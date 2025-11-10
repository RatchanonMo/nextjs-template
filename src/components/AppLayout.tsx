export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="h-dvh bg-cover bg-center bg-no-repeat relative bg-slate-500"
      // style={{ backgroundImage: "url(/images/background.jpg)" }}
    >
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      <div className="relative z-10 h-full flex flex-col md:flex-row">
        {children}
      </div>
    </div>
  );
}