import DashboardLayout from "../components/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-gray-600">Choose an action from the sidebar to get started.</p>
    </DashboardLayout>
  );
}
