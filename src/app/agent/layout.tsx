import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black">
      <Navbar dark />
      {children}
      <Footer />
    </div>
  );
}
