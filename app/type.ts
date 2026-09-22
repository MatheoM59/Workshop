export type Users = {
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
