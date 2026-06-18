import { ApplicationsPage } from "./features/applications/pages/ApplicationsPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-indigo-600">JobTracker</h1>
          <span className="text-sm text-gray-500">InternSathi Assignment</span>
        </div>
      </header>
      <ApplicationsPage />
    </div>
  );
}
