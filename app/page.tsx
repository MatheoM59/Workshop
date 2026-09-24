// // import { List } from "./components/List";
// // import { SectorManager } from "./components/SectorManage";
// // import { DashboardClient } from "./components/DashboardClient";

// // export default async function Page() {
// //   return (
// //     <main className="mx-auto min-h-screen w-full max-w-7xl bg-white p-6 sm:p-10">
// //       {/* Composant Client uniquement pour le bouton et la zone de simulation */}
// //       <DashboardClient />

// //       {/* Cartographie et gestion des secteurs (RSC) */}
// //       <section className="mb-8">
// //         <SectorManager />
// //       </section>

// //       {/* Liste de suivi des patients (RSC) */}
// //       <List />
// //     </main>
// //   );
// // }

// import { query } from "@/lib/db"; // Ajuste selon ton chemin exact
// import { List } from "./components/List";
// import { SectorManager } from "./components/SectorManage";
// import { DashboardClient } from "./components/DashboardClient";
// import type { Users } from "./type";

// export default async function Page() {
//   // Récupération directe des utilisateurs en BDD
//   const users = await query<Users>("SELECT id, firstname, lastname, health_status FROM users");

//   return (
//     <main className="mx-auto min-h-screen w-full max-w-7xl bg-white p-6 sm:p-10">
//       {/* On passe la liste réelle des utilisateurs de la BDD */}
//       <DashboardClient users={users} />

//       <section className="mb-8">
//         <SectorManager />
//       </section>

//       <List />
//     </main>
//   );
// }

import { query } from "@/lib/db";
import { List } from "./components/List";
<<<<<<< HEAD
import { SectorManager } from "./components/SectorManage";
import { DashboardClient } from "./components/DashboardClient";
import type { Users } from "./type";

export default async function Page() {
  // 1. Récupération des utilisateurs
  const users = await query<Users>("SELECT id, firstname, lastname, health_status, room_id FROM users");

  // 2. Extraction des secteurs uniques depuis la table gates
  const sectorsResult = await query<{ sector: string }>(
    "SELECT DISTINCT sector FROM gates WHERE sector IS NOT NULL AND sector != ''"
  );
  const sectors = sectorsResult.map((g) => ({ id: g.sector, name: g.sector }));

  // 3. Extraction des room_id uniques depuis la table users
  const roomsResult = await query<{ room_id: number }>(
    "SELECT DISTINCT room_id FROM users WHERE room_id IS NOT NULL"
  );
  const rooms = roomsResult.map((u) => ({ id: u.room_id, name: `Room #${u.room_id}` }));

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl bg-white p-6 sm:p-10">
      <DashboardClient users={users} sectors={sectors} rooms={rooms} />

      <section className="mb-8">
        <SectorManager />
      </section>

      <List />
    </main>
=======
import { SectorManage } from "./components/SectorManage";
import { HeaderSection } from "./components/HeaderSection";
import { getPositions } from "@/lib/action";
import { Gates } from "./type";
import { query } from "@/lib/db";
export default async function App() {
  const gates = await query<Gates>("SELECT * FROM gates WHERE is_locked = 0 ");
  const quarantine = await query<Gates>("SELECT * FROM gates WHERE is_locked = 1 ");
  const positions = await getPositions();
  return (
    <div className="min-h-screen w-full bg-white">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 p-6 sm:p-10">
        <HeaderSection title="Dash Board" subtitle="Triage des patients par niveau d&apos;urgence"/>
        <List />
        <HeaderSection title="Finder" subtitle="Trouver les citoyens dans chaque secteur"/>
        <SectorManage quarantine={quarantine} gates={gates} positions={positions}/>
      </main>
    </div>
>>>>>>> 56a20bef77be5bcf61677ceaafbcd074fc9dae4c
  );
}