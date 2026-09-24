import { Users as UsersIcon, ShieldAlert, ShieldCheck } from "lucide-react";
import { Gates, Position } from "../type";
export const SectorSoft = ({ gate, positions, setSelectedGate }:
{ gate: Gates; positions: Position[]; setSelectedGate: (gate: Gates) => void }) => {
  const inside = positions.filter((p) => p.sector === gate.sector);
  const infest = inside.some((p) => p.health_status === "SICK" || p.health_status === "QUARANTINE");
  return (
    <div
      onClick={() => setSelectedGate(gate)}
      className={`flex cursor-pointer flex-col rounded-xl border bg-white p-4 transition-shadow hover:shadow-md ${
        infest ? "border-red-300" : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-xs font-semibold uppercase tracking-wide text-cyan-600">
          {gate.sector}
        </span>
        {infest ? (
          <ShieldAlert size={16} className="shrink-0 text-red-500" />
        ) : (
          <ShieldCheck size={16} className="shrink-0 text-slate-300" />
        )}
      </div>

      <h3 className="mt-2 text-base font-bold text-slate-900">{gate.name}</h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        {gate.sector_from
          ? `Accès depuis ${gate.sector_from}.`
          : "Zone rattachée au réseau principal."}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span>Présents :</span>
        <span className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-700">
          <UsersIcon size={14} className="text-cyan-600" /> {inside.length}
        </span>
      </div>
    </div>
  );
};
