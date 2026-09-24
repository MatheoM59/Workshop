import { marquerTraite } from "@/lib/action";
import { query } from "@/lib/db";
import type { Users } from "../type";

export const List = async () => {
  const clients  =  await query<Users>("SElECT * FROM users ");

  const patients = clients.filter((c) => c.health_status === "SICK");
  const quarantined = clients.filter((c) => c.health_status === "QUARANTINE");
  const patientsLogement = patients.map((p) => p.room_id);
  const contact = clients.filter((c) => c.health_status === "CONTACT" || c.health_status !== "SICK" &&
    c.health_status !== "QUARANTINE" &&
     patientsLogement.some((logement) => c.room_id === logement - 1 || c.room_id === logement + 1) );
  const citoyen = clients.filter((c) => c.health_status === "NORMAL" && !patientsLogement.some((logement) => c.room_id === logement - 1 || c.room_id === logement + 1));

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-sm text-slate-500">
        Nombre de personnes présente dans le vaisseau : {clients.length}
      </h2>
      <ul className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4">

        <span className="mb-1 text-sm text-slate-500">
          {patients.length} patient{patients.length > 1 ? "s" : ""} malade mais pas en quarantaine
        </span>

        {patients.map((client) => (
          <li
            key={client.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 border-l-4 border-l-red-500 bg-white p-4 transition-shadow hover:shadow-md"
          >
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-slate-900">
                {client.firstname.toUpperCase()}
              </span>
              <span className="text-slate-800">
                {client.lastname}
              </span>
              <span className="font-mono text-xs text-slate-500">
                #{client.id}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">

              <form action={marquerTraite.bind(null,"NORMAL",client.id)}>
                <button disabled className="rounded-md border border-slate-300 bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 cursor-not-allowed">En attente de mise en quarantaine</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
      <ul className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4">

        <span className="mb-1 text-sm text-slate-500">
          {quarantined.length} patient{quarantined.length > 1 ? "s" : ""} en quarantaine
        </span>

        {quarantined.map((client) => (
          <li
            key={client.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 border-l-4 border-l-red-500 bg-white p-4 transition-shadow hover:shadow-md"
          >
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-slate-900">
                {client.firstname.toUpperCase()}
              </span>
              <span className="text-slate-800">
                {client.lastname}
              </span>
              <span className="font-mono text-xs text-slate-500">
                #{client.id}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <form action={marquerTraite.bind(null,"NORMAL",client.id)}>
                <button className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700">Envoyer un medecin</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
      <ul className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4">

        <span className="mb-1 text-sm text-slate-500">
          {contact.length} cas contact{contact.length > 1 ? "s" : ""}
        </span>
        {contact.map((client) => (
          <li
            key={client.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 border-l-4 border-l-amber-400 bg-white p-4 transition-shadow hover:shadow-md"
          >
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-slate-900">
                {client.firstname.toUpperCase()}
              </span>
              <span className="text-slate-800">
                {client.lastname}
              </span>
              <span className="font-mono text-xs text-slate-500">
                #{client.id}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <form action={marquerTraite.bind(null,"NORMAL",client.id)}>
                <button className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700">Envoyer un medecin</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
      <ul className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4">

        <span className="mb-1 text-sm text-slate-500">
          {citoyen.length} citoyen{citoyen.length > 1 ? "s" : ""}
        </span>
        {citoyen.map((client) => (
          <li
            key={client.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 border-l-4 border-l-emerald-500 bg-white p-4 transition-shadow hover:shadow-md"
          >
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-slate-900">
                {client.firstname.toUpperCase()}
              </span>
              <span className="text-slate-800">
                {client.lastname}
              </span>
              <span className="font-mono text-xs text-slate-500">
                #{client.id}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">
                Lieu de vie
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 font-mono font-medium text-slate-900">
                {client.room_id}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
