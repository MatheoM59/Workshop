import { query } from "@/lib/db";
import { List } from "./components/List";
import { SectorManage } from "./components/SectorManage";
import { Gates } from "./type";
import { DashboardClient } from "./components/DashboardClient";
import { getPositions } from "@/lib/action";
import { HeaderSection } from "./components/HeaderSection";
import type { Users } from "./type";

export default async function Page() {
  const users = await query<Users>("SELECT id, firstname, lastname, health_status, room_id FROM users");
  const gates = await query<Gates>("SELECT * FROM gates WHERE is_Q = 0 ");
  const quarantine = await query<Gates>("SELECT * FROM gates WHERE is_Q = 1 ");
  const positions = await getPositions();
  const sectorsResult = await query<{ sector: string }>(
    "SELECT DISTINCT sector FROM gates WHERE sector IS NOT NULL AND sector != ''",
  );
  const sectors = sectorsResult.map((g) => ({ id: g.sector, name: g.sector }));
  const roomsResult = await query<{ room_id: number }>(
    "SELECT DISTINCT room_id FROM users WHERE room_id IS NOT NULL",
  );
  const rooms = roomsResult.map((u) => ({ id: u.room_id, name: `Room #${u.room_id}` }));

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl bg-white p-6 sm:p-10">
      <DashboardClient users={users} sectors={sectors} rooms={rooms} />
      <List />
      <HeaderSection title="Finder" subtitle="Trouver les citoyens dans chaque secteur"/>
      <SectorManage quarantine={quarantine} gates={gates} positions={positions}/>
    </main>

  );
}
