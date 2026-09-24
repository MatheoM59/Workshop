"use client";
import { MapPin } from "lucide-react";
import type { Gates, Position } from "../type";
import { Sector } from "./Sector";
import { useState } from "react";
import { SectorSoft } from "./SectorSoft";
export const SectorManage =  ({ gates, positions, quarantine }: { gates: Gates[]; positions: Position[]; quarantine: Gates[] }) => {
  const [selectedGate, setSelectedGate] = useState<Gates | null>(null);
  return (
    <div className="w-full text-slate-900">
      {selectedGate ? <Sector gate={selectedGate} positions={positions} setSelectedGate={setSelectedGate}/> :
        <div>
          <div className="mb-5">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <MapPin size={20} className="text-cyan-600" /> Cartographie des Secteurs
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">Vue d&apos;ensemble et contrôle des accès par zone spatialisée.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {gates.map((gate) => (
              <SectorSoft
                key={gate.id}
                gate={gate}
                positions={positions}
                setSelectedGate={setSelectedGate}
              />
            ))}
          </div>
          <div className="mb-5">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <MapPin size={20} className="text-cyan-600" /> Zone de quarantaine
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">Vue des zones de quarantaine et des personnes assignées.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quarantine.map((gate) => (
              <SectorSoft
                key={gate.id}
                gate={gate}
                positions={positions}
                setSelectedGate={setSelectedGate}
              />
            ))}
          </div>
        </div>
      }

    </div>
  );
};
