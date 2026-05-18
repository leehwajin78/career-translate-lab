import { Outlet } from "react-router-dom";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";

export default function Layout() {
  useScrollRestoration();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
