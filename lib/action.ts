"use server";
import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function marquerTraite( status:string,id: number){
  await query("UPDATE users  Set health_status = ? WHERE id = ?",[status, id]);
  revalidatePath("/");

};
