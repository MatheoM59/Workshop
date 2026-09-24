"use server";
import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { HealthStatus, Position } from "@/app/type";

/** Dernière porte franchie par un agent, ou null s'il n'a jamais badgé. */
async function derniereGate(userId: number) {
  const rows = await query<{ gate_id: string }>(
    `SELECT gate_id FROM gate_logs
     WHERE user_id = ? AND access_granted = 1
     ORDER BY passed_at DESC, id DESC LIMIT 1`,
    [userId],
  );
  return rows.length > 0 ? rows[0].gate_id : null;
}

/**
 * Applique la règle de contamination sur un secteur : si au moins un malade
 * s'y trouve, tous les occupants sains passent en CONTACT.
 *
 * Le secteur est identifié par sa porte, et l'occupation se déduit du dernier
 * passage de chacun — même logique que `getPositions`.
 */
async function propagerContact(gateId: string) {
  const malades = await query<{ id: number }>(
    `SELECT u.id FROM users u
     JOIN gate_logs l ON l.id = (
       SELECT id FROM gate_logs
       WHERE user_id = u.id AND access_granted = 1
       ORDER BY passed_at DESC, id DESC LIMIT 1
     )
     WHERE l.gate_id = ? AND u.health_status = 'SICK'
     LIMIT 1`,
    [gateId],
  );

  if (malades.length === 0) return;

  await query(
    `UPDATE users u
     JOIN gate_logs l ON l.id = (
       SELECT id FROM gate_logs
       WHERE user_id = u.id AND access_granted = 1
       ORDER BY passed_at DESC, id DESC LIMIT 1
     )
     SET u.health_status = 'CONTACT'
     WHERE l.gate_id = ? AND u.health_status = 'NORMAL'`,
    [gateId],
  );
}

export async function marquerTraite( status:HealthStatus,id: number){
  await query("UPDATE users  Set health_status = ? WHERE id = ?",[status, id]);

  // Déclarer quelqu'un malade contamine les occupants sains de son secteur.
  if (status === "SICK") {
    const gateId = await derniereGate(id);
    if (gateId) await propagerContact(gateId);
  }

  revalidatePath("/");
};

export async function enregistrerPassageGate(
  userId: number,
  sector: string,
  accessGranted: boolean,
) {
  try {
    const gates = await query<{ id: string }>(
      "SELECT id FROM gates WHERE sector = ? LIMIT 1",
      [sector],
    );

    const gateId = gates.length > 0 ? gates[0].id : 1;
    await query(
      "INSERT INTO gate_logs (user_id, gate_id, passed_at, access_granted) VALUES (?, ?, NOW(), ?)",
      [userId, gateId, accessGranted ? 1 : 0],
    );

    // Entrer dans un secteur où se trouve un malade rend cas contact.
    if (accessGranted) await propagerContact(String(gateId));

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du log :", error);
    throw new Error("Impossible d'enregistrer le passage dans gate_logs");
  }
}
export async function getPositions() {
  return query<Position>(`
    SELECT u.*,
           g.sector, g.sector_from, l.passed_at
    FROM users u
    LEFT JOIN gate_logs l ON l.id = (
      SELECT id FROM gate_logs
      WHERE user_id = u.id AND access_granted = 1
      ORDER BY passed_at DESC, id DESC
      LIMIT 1
    )
    LEFT JOIN gates g ON g.id = l.gate_id
  `);
}
