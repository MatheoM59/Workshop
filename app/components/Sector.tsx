import type { Gates } from "../type";
import { getPositions } from "@/lib/action";
export const Sector = async ({ gate }:{ gate: Gates }) => {
  const positions = await getPositions();
  const inside = positions.filter((p) => p.sector === gate.sector);

  if (!inside) return;
  return (

    <div className="bg-slate-900/90 border border-cyan-500/40 rounded-xl p-6 shadow-2xl space-y-6 text-slate-100">
      <div className="flex justify-between items-start border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block">
            {gate.name}
          </span>
          <h3 className="text-2xl font-bold text-slate-100">{gate.sector}</h3>
          <p className="text-xs text-slate-400 mt-1">{gate.id}</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-right">
          <span className="text-xs text-slate-500 block">Effectif présent</span>
          <span className="text-xl font-bold text-cyan-400">{inside.length}</span>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
          Occupants Actuels :
        </h4>
        {inside.map((i) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" key={i.id}>
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg flex justify-between items-center">
              <div>
                <div className="font-semibold text-slate-200">{i.firstname} {i.lastname}</div>
                <div className="text-xs text-slate-500">{i.role} • Chambre {i.room_id}</div>
                {i.health_status === "SICK" && <div className="text-xs text-red-400 mt-1">
                  Pathologie : {i.disease_name}
                </div>}
              </div>
              <div className="text-right space-y-1">
                <span className="bg-green-900/50 text-green-300 border border-green-500/30 text-xs px-2 py-0.5 rounded font-medium">
                  {i.health_status}
                </span>
                {i.health_status !== "NORMAL" && <div className="text-[10px] text-slate-400">
                  Score crit. :
                  <span className="text-cyan-400 font-bold">{i.crit_score}</span>
                </div>}
              </div>
            </div>
          </div>
        ))}

        {inside.length === 0 && <div className="p-8 text-center bg-slate-950/40 border border-dashed border-slate-800 rounded-lg text-slate-500 text-sm">
          Aucun membre d&apos;équipage détecté dans ce secteur.
        </div>}
      </div>
    </div>
  );
};
