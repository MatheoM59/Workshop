"use server";
import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function marquerTraite( status:string,id: number){
  await query("UPDATE users  Set health_status = ? WHERE id = ?",[status, id]);
  revalidatePath("/");
};

//---------------------------------

export async function enregistrerPassageGate(
  userId: number,
  sector: string,
  roomId: number | string,
  accessGranted: boolean
) {
  try {
    // 1. On cherche l'ID de la porte dans la table 'gates' via 'sector'
    const gates = await query<{ id: number }>(
      "SELECT id FROM gates WHERE sector = ? LIMIT 1",
      [sector]
    );

    // Si pas de gate correspondante trouvée, fallback sur ID 1
    const gateId = gates.length > 0 ? gates[0].id : 1;

    // 2. Insertion du log dans 'gate_logs'
    await query(
      "INSERT INTO gate_logs (user_id, gate_id, passed_at, access_granted) VALUES (?, ?, NOW(), ?)",
      [userId, gateId, accessGranted ? 1 : 0]
    );

    // 3. Si l'accès est AUTORISÉ, on met à jour 'room_id' dans la table 'users'
    if (accessGranted) {
      await query("UPDATE users SET room_id = ? WHERE id = ?", [
        roomId,
        userId,
      ]);
    }

    // Rafraîchir les données Next.js
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du log :", error);
    throw new Error("Impossible d'enregistrer le passage dans gate_logs");
  }
}