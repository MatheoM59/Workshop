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