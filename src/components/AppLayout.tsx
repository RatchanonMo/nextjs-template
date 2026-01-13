export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-dvh relative w-5xl bg-slate-300 mx-auto p-10">
      {children}
    </main>
  );
}
