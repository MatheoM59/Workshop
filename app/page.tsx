import { List } from "./components/List";

export default function App() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl bg-white p-6 sm:p-10">
      <header className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Dash Board
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Triage des patients par niveau d&apos;urgence
        </p>
      </header>

      <List />
    </main>
  );
}
