"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { marquerTraite, enregistrerPassageGate } from "../../lib/action";
import type { HealthStatus, Users } from "../type";

export interface SectorOption {
  id: string;
  name: string;
}

export interface RoomOption {
  id: number;
  name: string;
}

interface SimulationProps {
  users?: Users[];
  sectors?: SectorOption[];
  rooms?: RoomOption[];
}

export const Simulation: React.FC<SimulationProps> = ({
  users = [],
  sectors = [],
  rooms = [],
}) => {
  // On ne garde que l'identifiant en état : l'objet est redérivé des props à
  // chaque rendu, donc il reflète toujours la base après un revalidatePath.
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const selectedUser = users.find((u) => u.id === selectedUserId) ?? null;
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [selectedStatus, setSelectedStatus] = useState<HealthStatus>("NORMAL");
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [selectedRoomId, setSelectedRoomId] = useState<string | number>("");
  const [feedback, setFeedback] = useState<string | null>(null);

  if (sectors.length > 0 && !selectedSector) {
    setSelectedSector(sectors[0].name);
  }
  if (rooms.length > 0 && !selectedRoomId) {
    setSelectedRoomId(rooms[0].id);
  }

  const filteredUsers = users.filter((u) =>
    `${u.firstname} ${u.lastname} #${u.id}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      setFeedback("Veuillez sélectionner un agent.");
      return;
    }

    try {
      await marquerTraite(selectedStatus, selectedUser.id);

      setFeedback(
        `Statut de ${selectedUser.firstname} ${selectedUser.lastname} (#${selectedUser.id}) mis à jour : ${selectedStatus}`,
      );
    } catch {
      setFeedback("Erreur lors de la mise à jour du statut.");
    }
  };

  const handleGatePass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedRoomId || !selectedSector) {
      setFeedback("Veuillez sélectionner un agent, un secteur et une room.");
      return;
    }

    // Détection des zones de quarantaine
    const isQuarantineSector = /^(secteur\s*)?q/i.test(selectedSector.trim());

    // Règle 1 : Un agent en QUARANTINE ne peut aller QUE dans les secteurs de quarantaine
    if (selectedUser.health_status === "QUARANTINE" && !isQuarantineSector) {
      // Log de l'échec d'accès (access_granted = false)
      await enregistrerPassageGate(selectedUser.id, selectedSector, false);

      setFeedback(
        `ACCÈS REFUSÉ : L'agent #${selectedUser.id} (${selectedUser.firstname} ${selectedUser.lastname}) est en QUARANTINE. Accès interdit au secteur "${selectedSector}".`,
      );
      return;
    }

    // Règle 2 : Un agent non-QUARANTINE ne peut PAS accéder aux secteurs de Quarantaine
    if (selectedUser.health_status !== "QUARANTINE" && isQuarantineSector) {
      // Log de l'échec d'accès (access_granted = false)
      await enregistrerPassageGate(selectedUser.id, selectedSector, false);

      setFeedback(
        `ACCÈS REFUSÉ : L'agent #${selectedUser.id} (${selectedUser.firstname} ${selectedUser.lastname}) n'est pas en quarantaine. Accès restreint au secteur "${selectedSector}".`,
      );
      return;
    }

    // Passage autorisé -> Log du succès (access_granted = true) + mise à jour du room_id de l'agent
    await enregistrerPassageGate(selectedUser.id, selectedSector, true);

    setFeedback(
      `ACCÈS AUTORISÉ : L'agent #${selectedUser.id} (${selectedUser.firstname} ${selectedUser.lastname}) a franchi le portail NFC vers la room #${selectedRoomId} (${selectedSector}).`,
    );
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-slate-900">
          Changement de Statut Sanitaire
        </h3>
        <form onSubmit={handleStatusChange} className="flex flex-col gap-4">
          <div className="relative" ref={dropdownRef}>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Sélectionner un agent (BDD)
            </label>
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="flex w-full cursor-pointer items-center justify-between rounded-md border border-slate-300 bg-white p-2 text-sm focus:border-slate-900"
            >
              <span className={selectedUser ? "font-medium text-slate-900" : "text-slate-400"}>
                {selectedUser
                  ? `#${selectedUser.id} - ${selectedUser.firstname} ${selectedUser.lastname}`
                  : "Rechercher ou choisir un agent..."}
              </span>
              <ChevronDown size={16} className="text-slate-500" />
            </div>

            {isOpen && (
              <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-200 bg-white p-2 shadow-lg">
                <div className="mb-2 flex items-center gap-2 border-b border-slate-100 px-1 pb-2">
                  <Search size={14} className="text-slate-400" />
                  <input
                    type="text"
                    placeholder="Chercher par nom ou ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent text-xs outline-none"
                    autoFocus
                  />
                </div>
                {filteredUsers.length === 0 ? (
                  <div className="p-2 text-center text-xs text-slate-400">
                    Aucun agent trouvé
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setSelectedStatus(user.health_status);
                        setIsOpen(false);
                      }}
                      className="flex cursor-pointer items-center justify-between rounded p-2 text-xs hover:bg-slate-50"
                    >
                      <span>
                        <strong className="text-slate-900">#{user.id}</strong> {user.firstname} {user.lastname}
                      </span>
                      <span className="text-[10px] text-slate-400">({user.health_status})</span>
                      {selectedUser?.id === user.id && (
                        <Check size={14} className="text-cyan-600" />
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Nouveau Statut
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as HealthStatus)}
              className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-slate-900 focus:outline-none"
            >
              <option value="NORMAL">NORMAL</option>
              <option value="CONTACT">CONTACT</option>
              <option value="SICK">SICK</option>
              <option value="QUARANTINE">QUARANTINE</option>
            </select>
          </div>

          <button
            type="submit"
            className="rounded-md bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Appliquer la modification
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-slate-900">
          Simulateur Portail NFC
        </h3>
        <form onSubmit={handleGatePass} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Agent sélectionné
            </label>
            <input
              type="text"
              readOnly
              value={
                selectedUser
                  ? `#${selectedUser.id} - ${selectedUser.firstname} ${selectedUser.lastname}`
                  : "Aucun agent sélectionné"
              }
              className="w-full rounded-md border border-slate-200 bg-slate-50 p-2 text-sm text-slate-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Secteur Cible
              </label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-slate-900 focus:outline-none"
              >
                {sectors.length === 0 ? (
                  <option value="">Aucun secteur en BDD</option>
                ) : (
                  sectors.map((sector) => (
                    <option key={sector.id} value={sector.name}>
                      {sector.name}
                    </option>
                  ))
                )}
              </select>
            </div>

          </div>

          <button
            type="submit"
            className="rounded-md bg-cyan-600 py-2 text-sm font-medium text-white hover:bg-cyan-500"
          >
            Badger la porte
          </button>
        </form>

        {feedback && (
          <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800">
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
};
