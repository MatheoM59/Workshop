<<<<<<< HEAD
"use client";
import React from 'react';
import { Users, ArrowLeft } from 'lucide-react';

export interface Person {
  id: number;
  firstname: string;
  lastname: string;
  role: string;
  health_status: 'NORMAL' | 'CONTACT' | 'SICK' | 'QUARANTINE';
}

export interface SectorData {
  id: string;
  name: string;
  code: string;
  description: string;
  people: Person[];
}

interface SectorProps {
  sector: SectorData;
  onBack: () => void;
}

export const Sector: React.FC<SectorProps> = ({ sector, onBack }) => {
  // Garde de sécurité pour éviter le crash si la prop est undefined ou null
  if (!sector) {
    return (
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-center">
        <p className="mb-4">Aucun secteur sélectionné ou données indisponibles.</p>
        <button 
          onClick={onBack}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-xs font-semibold"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  const getStatusBadge = (status: Person['health_status']) => {
    switch (status) {
      case 'NORMAL':
        return <span className="bg-green-900/50 text-green-300 border border-green-500/30 text-xs px-2 py-0.5 rounded font-medium">NORMAL</span>;
      case 'CONTACT':
        return <span className="bg-yellow-900/50 text-yellow-300 border border-yellow-500/30 text-xs px-2 py-0.5 rounded font-medium">CONTACT</span>;
      case 'SICK':
        return <span className="bg-orange-900/50 text-orange-300 border border-orange-500/30 text-xs px-2 py-0.5 rounded font-medium">MALADE</span>;
      case 'QUARANTINE':
        return <span className="bg-red-900/50 text-red-300 border border-red-500/30 text-xs px-2 py-0.5 rounded font-medium animate-pulse">QUARANTAINE</span>;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-cyan-500/40 rounded-xl p-6 shadow-2xl space-y-6 text-slate-100">
      {/* HEADER DU SECTEUR */}
      <div className="flex justify-between items-start border-b border-slate-800 pb-4">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition mb-3"
          >
            <ArrowLeft size={14} /> Retour à la liste
          </button>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block">{sector.code}</span>
          <h3 className="text-2xl font-bold text-slate-100">{sector.name}</h3>
          <p className="text-xs text-slate-400 mt-1">{sector.description}</p>
        </div>
        <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-right">
          <span className="text-xs text-slate-500 block">Effectif présent</span>
          <span className="text-xl font-bold text-cyan-400 flex items-center gap-1 justify-end">
            <Users size={18} /> {sector.people?.length || 0}
          </span>
        </div>
      </div>

      {/* LISTE DES PERSONNES */}
      <div>
        <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Occupants Actuels :</h4>
        {sector.people && sector.people.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sector.people.map((person) => (
              <div 
                key={person.id} 
                className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold text-slate-200">
                    {person.firstname} {person.lastname}
                  </div>
                  <div className="text-xs text-slate-500">{person.role} • ID: #{person.id}</div>
                </div>
                <div>{getStatusBadge(person.health_status)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-950/40 border border-dashed border-slate-800 rounded-lg text-slate-500 text-sm">
            Aucun membre d'équipage détecté dans ce secteur.
          </div>
        )}
=======
import type { Gates, Position } from "../type";
export const Sector =  ({ gate, positions, setSelectedGate }: { gate: Gates; positions: Position[]; setSelectedGate: (gate: Gates | null) => void }) => {
  const inside = positions.filter((p) => p.sector === gate.sector);
  return (

    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 text-slate-900">
      <button className="text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 bg-slate-50 text-xs px-2 py-0.5 rounded font-medium" onClick={() => setSelectedGate(null)}>
        Retour
      </button>
      <div className="flex justify-between items-start border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-mono font-semibold text-cyan-600 uppercase tracking-widest block">
            {gate.name}
          </span>
          <h3 className="text-2xl font-bold text-slate-900">{gate.sector}</h3>
          <p className="text-xs text-slate-500 mt-1">{gate.id}</p>
        </div>
        <div className="bg-slate-100 px-4 py-2 rounded-lg text-right">
          <span className="text-xs text-slate-500 block">Effectif présent</span>
          <span className="text-xl font-bold text-slate-900">{inside.length}</span>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">
          Occupants Actuels :
        </h4>
        {inside.map((i) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" key={i.id}>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
              <div>
                <div className="font-semibold text-slate-900">{i.firstname} {i.lastname}</div>
                <div className="text-xs text-slate-500">{i.role} • Chambre {i.room_id}</div>
                {i.health_status === "SICK" && <div className="text-xs text-red-600 mt-1">
                  Pathologie : {i.disease_name}
                </div>}
              </div>
              <div className="text-right space-y-1">
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2 py-0.5 rounded font-medium">
                  {i.health_status}
                </span>
                {
                  i.health_status !== "NORMAL" && i.health_status !== "CONTACT" &&
                (<div className="text-[10px] text-slate-400">
                  Score crit. :
                  <span className="text-cyan-700 font-bold">{i.crit_score}</span>
                </div>)
                }
              </div>
            </div>
          </div>
        ))}

        {inside.length === 0 && <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm">
          Aucun membre d&apos;équipage détecté dans ce secteur.
        </div>}
>>>>>>> 56a20bef77be5bcf61677ceaafbcd074fc9dae4c
      </div>
    </div>
  );
};

export default Sector;