// 'use client';

// import { useState } from "react";
// import { Simulation } from "./Simulation";

// export const DashboardClient = () => {
//   const [showSimulation, setShowSimulation] = useState(false);

//   return (
//     <>
//       <header className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
//         <div>
//           <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
//             QuaranTech — Dashboard
//           </h1>
//           <p className="mt-1 text-sm text-slate-500">
//             Triage des patients et suivi sanitaire par secteur
//           </p>
//         </div>

//         <button
//           onClick={() => setShowSimulation(!showSimulation)}
//           className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
//             showSimulation
//               ? "bg-slate-200 text-slate-800 hover:bg-slate-300"
//               : "bg-slate-900 text-white hover:bg-slate-700"
//           }`}
//         >
//           {showSimulation ? "Fermer la simulation" : "Ouvrir la simulation"}
//         </button>
//       </header>

//       {showSimulation && (
//         <section className="mb-8 rounded-xl border border-cyan-200 bg-cyan-50/30 p-6">
//           <div className="mb-4 border-b border-cyan-100 pb-2">
//             <h2 className="text-lg font-semibold text-slate-900">
//               Module de Simulation (Capteurs NFC & MedBox)
//             </h2>
//             <p className="text-xs text-slate-500">
//               Simulez le passage des portails ou modifiez manuellement le statut d'un agent.
//             </p>
//           </div>
//           <Simulation />
//         </section>
//       )}
//     </>
//   );
// };

'use client';

import { useState } from "react";
import { Simulation, SectorOption, RoomOption } from "./Simulation";
import type { Users } from "../type";

interface DashboardClientProps {
  users?: Users[];
  sectors?: SectorOption[];
  rooms?: RoomOption[];
}

export const DashboardClient = ({
  users = [],
  sectors = [],
  rooms = [],
}: DashboardClientProps) => {
  const [showSimulation, setShowSimulation] = useState(false);

  return (
    <>
      <header className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            QuaranTech — Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Triage des patients et suivi sanitaire par secteur
          </p>
        </div>

        <button
          onClick={() => setShowSimulation(!showSimulation)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            showSimulation
              ? "bg-slate-200 text-slate-800 hover:bg-slate-300"
              : "bg-slate-900 text-white hover:bg-slate-700"
          }`}
        >
          {showSimulation ? "Fermer la simulation" : "Ouvrir la simulation"}
        </button>
      </header>

      {showSimulation && (
        <section className="mb-8 rounded-xl border border-cyan-200 bg-cyan-50/30 p-6">
          <div className="mb-4 border-b border-cyan-100 pb-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Module de Simulation (Capteurs NFC & MedBox)
            </h2>
            <p className="text-xs text-slate-500">
              Simulez le passage des portails ou modifiez manuellement le statut d'un agent.
            </p>
          </div>
          <Simulation users={users} sectors={sectors} rooms={rooms} />
        </section>
      )}
    </>
  );
};