import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-white">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
