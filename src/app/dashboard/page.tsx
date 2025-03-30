// src/app/dashboard/page.tsx
import { currentUser } from "@clerk/nextjs";

export default async function DashboardPage() {
  const user = await currentUser();
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4">
        Welcome, {user?.firstName || "User"}!
      </p>
    </div>
  );
}