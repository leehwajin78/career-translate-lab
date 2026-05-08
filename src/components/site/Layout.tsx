import { Outlet } from "react-router-dom";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";

export default function Layout() {
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
