import { marquerTraite } from "@/lib/action";
import { query } from "@/lib/db";
import type { Users } from "../type";

export const List = async () => {
  const clients  =  await query<Users>("SElECT * FROM users ");

  const patients = clients.filter((c) => c.health_status === "QUARANTINE");
  const patientsLogement = patients.map((p) => p.room_id);
  const contact = clients.filter((c) => c.health_status === "CONTACT" || c.health_status !== "SICK" &&
    c.health_status !== "QUARANTINE" &&
     patientsLogement.some((logement) => c.room_id === logement - 1 || c.room_id === logement + 1) );

  return (
    <section className="flex flex-col gap-6">

      <ul className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4">
        <div className=" flex items-center gap-3">
          <span
            className={"rounded px-2.5 py-1 text-xs font-semibold tracking-wide "}
          >

          </span>
          <span className="text-sm text-slate-500">
            {patients.length} patient{patients.length > 1 ? "s" : ""}
          </span>
        </div>
        {patients.map((client) => (
          <li
            key={client.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 border-l-4 border-l-red-500 bg-white p-4 transition-shadow hover:shadow-md"
          >
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-slate-900">
                {client.firstname.toUpperCase()}
              </span>
              <span className="text-slate-700">
                {client.lastname}
              </span>
              <span className="font-mono text-xs text-slate-500">
                #{client.id}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">
                Lieu de quarantaine
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 font-mono font-medium text-slate-900">
                {client.room_id}
              </span>
              <form action={marquerTraite.bind(null,"NORMAL",client.id)}>
                <button className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-700">Patient traité</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
      <ul className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4">
        <div className=" flex items-center gap-3">
          <span
            className={"rounded px-2.5 py-1 text-xs font-semibold tracking-wide "}
          >

          </span>
          <span className="text-sm text-slate-500">
            {contact.length} patient{patients.length > 1 ? "s" : ""}
          </span>
        </div>
        {contact.map((client) => (
          <li
            key={client.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 border-l-4 border-l-yellow-400 bg-white p-4 transition-shadow hover:shadow-md"
          >
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-slate-900">
                {client.firstname.toUpperCase()}
              </span>
              <span className="text-slate-700">
                {client.lastname}
              </span>
              <span className="font-mono text-xs text-slate-500">
                #{client.id}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">
                Lieu de quarantaine
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 font-mono font-medium text-slate-900">
                {client.room_id}
              </span>
              <form action={marquerTraite.bind(null,"NORMAL",client.id)}>
                <button className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-700">Patient traité</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
