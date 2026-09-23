import type { Gates } from "../type";
import { query } from "@/lib/db";
import { Sector } from "./Sector";
import { getPositions } from "@/lib/action";
export const SectorManage = async () => {
  const gates = await query<Gates>("SELECT * FROM gates");
  const positions = await getPositions();
  console.log(positions);
  console.log(gates);
  return (
    <div>
      <h1>Hello world </h1>

      {gates.map((gate) => {
        /*
          if (inside.length === 0) return;
        */
        return (
          <Sector gate={gate} key={gate.id}/>
        )
        ;},
      )
      }
    </div>
  );
};
