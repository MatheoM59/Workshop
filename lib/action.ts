"use server";
import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { Position } from "@/app/type";

export async function marquerTraite( status:string,id: number){
  await query("UPDATE users  Set health_status = ? WHERE id = ?",[status, id]);
  revalidatePath("/");

};

export async function getPositions() {
  return query<Position>(`
    SELECT u.*,
           g.sector, g.sector_from, l.direction, l.passed_at
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
