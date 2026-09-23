import { List } from "./components/List";
import { SectorManage } from "./components/SectorManage";
import { HeaderSection } from "./components/HeaderSection";
export default function App() {
  return (
    <main className="mx-auto flex flex-col min-h-screen w-full max-w-7xl bg-white p-6 sm:p-10 gap-6">
      <HeaderSection title="Dash Board" subtitle="Triage des patients par niveau d&apos;urgence"/>
      <List />
      <HeaderSection title="Finder" subtitle="Trouver les citoyens dans chaque secteur"/>
      <SectorManage/>
    </main>
  );
}
