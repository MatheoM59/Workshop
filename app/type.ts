/** Les quatre valeurs de l'enum `users.health_status` en base. */
export type HealthStatus = "NORMAL" | "CONTACT" | "SICK" | "QUARANTINE";

export type Users = {
  id: number;
  firstname: string;
  lastname: string;
  role: string;
  health_status: HealthStatus;
  disease_name: string | null;
  crit_score: number | null;
  room_id: number;
  updated_at: Date;
};

export type Gates = {
  id: string;
  name:string;
  sector: string;
  sector_from:string;
  is_Q: boolean;
};

export type Gate_logs = {
  id: number;
  user_id: number;
  gate_id : string;
  direction: string;
  passed_at: Date;
  access_granted: boolean;
};

export type Position = {
  id : number;
  firstname : string;
  lastname:string;
  role:string;
  health_status: HealthStatus;
  disease_name: string | null;
  crit_score: number | null;
  room_id:number;
  updated_at:Date;
  sector:string | null;
  sector_from: string | null;
  direction : "IN" | "OUT" | null;
  passed_at: Date | null;
};
