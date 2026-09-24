/*export type Users = {
  id : number;
  firstname : string;
  lastname:string;
  role:string;
  health_status:string;
  disease_name: string | null;
  crit_score: number | null;
  room_id:number;
  updated_at:Date;

};
<<<<<<< HEAD
*/

// types.ts

export type Users = {
  id: number;
  firstname: string;
  lastname: string;
  role: string;
  health_status: string;
  disease_name: string | null;
  crit_score: number | null;
  room_id: number;
  updated_at: Date;
};

export type SectorData = {
  id: string;
  name: string;
  code: string;
  description: string;
  people: Users[]; // Utilise ton type Users ici
};
=======

export type Gates = {
  id: string;
  name:string;
  sector: string;
  sector_from:string;
  is_locked: boolean;
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
  health_status:string;
  disease_name: string | null;
  crit_score: number | null;
  room_id:number;
  updated_at:Date;
  sector:string | null;
  sector_from: string | null;
  direction : "IN" | "OUT" | null;
  passed_at: Date | null;
};
>>>>>>> 56a20bef77be5bcf61677ceaafbcd074fc9dae4c
