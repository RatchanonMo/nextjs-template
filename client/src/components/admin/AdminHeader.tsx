interface AdminHeaderProps {
  error?: string | null;
}

export default function AdminHeader({ error }: AdminHeaderProps) {
  return (
    <>
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage users, inspect their projects/tasks, and enforce role-based access.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
    </>
  );
}
