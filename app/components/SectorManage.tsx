"use client";

import React, { useState } from 'react';
import { MapPin, Users, ShieldAlert, ShieldCheck } from 'lucide-react';
import Sector, { SectorData } from './Sector';

export const SectorManager: React.FC = () => {
  const [sectors] = useState<SectorData[]>([
    {
      id: 'SEC_A',
      name: 'Passerelle de Commandement',
      code: 'Secteur A',
      description: 'Centre de pilotage et de navigation de la station.',
      people: [
        { id: 1, firstname: 'John', lastname: 'Doe', role: 'Commandant', health_status: 'NORMAL' }
      ]
    },
    {
      id: 'SEC_B',
      name: 'Module de Vie & Mess',
      code: 'Secteur B',
      description: 'Espace de restauration et dortoirs de l équipage.',
      people: [
        { id: 2, firstname: 'Elena', lastname: 'Rostova', role: 'Ingénieure', health_status: 'CONTACT' },
        { id: 3, firstname: 'Alex', lastname: 'Vance', role: 'Pilote', health_status: 'QUARANTINE' }
      ]
    },
    {
      id: 'SEC_C',
      name: 'Serre Hydroponique',
      code: 'Secteur C',
      description: 'Production d oxygène et cultures biologiques.',
      people: []
    },
    {
      id: 'SEC_MED',
      name: 'Secteur Médical & MedBox',
      code: 'Secteur MED',
      description: 'Zone d examen médical et d isolement.',
      people: [
        { id: 4, firstname: 'Sarah', lastname: 'Connor', role: 'Médecin', health_status: 'SICK' }
      ]
    }
  ]);

  const [selectedSector, setSelectedSector] = useState<SectorData | null>(null);

  return (
    <div className="w-full">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <MapPin size={22} className="text-cyan-600" /> Cartographie des Secteurs
        </h2>
        <p className="text-xs text-slate-500">Vue d'ensemble et contrôle des accès par zone spatialisée.</p>
      </div>

      {selectedSector ? (
        <Sector 
          sector={selectedSector} 
          onBack={() => setSelectedSector(null)} 
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {sectors.map((sec) => {
            const hasAlert = sec.people.some(p => p.health_status === 'QUARANTINE' || p.health_status === 'SICK');

            return (
              <div
                key={sec.id}
                onClick={() => setSelectedSector(sec)}
                className={`p-5 rounded-xl border bg-white cursor-pointer transition-all duration-200 hover:scale-[1.02] flex flex-col justify-between shadow-sm ${
                  hasAlert
                    ? 'border-red-300 hover:border-red-500 hover:shadow-md hover:shadow-red-500/10'
                    : 'border-slate-200 hover:border-slate-900 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono text-cyan-700 font-semibold">{sec.code}</span>
                    {hasAlert ? (
                      <ShieldAlert size={18} className="text-red-600 animate-pulse" />
                    ) : (
                      <ShieldCheck size={18} className="text-slate-400" />
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">{sec.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{sec.description}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Présents :</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                    <Users size={12} className="text-cyan-600" /> {sec.people.length}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SectorManager;