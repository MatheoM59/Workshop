import { List } from "./components/List";
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
  );
}
