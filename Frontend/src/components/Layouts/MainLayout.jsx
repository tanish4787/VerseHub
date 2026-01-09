import { Outlet } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import MobileNav from "../MobileNav";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 pb-20 md:pb-6">
        <Outlet />
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
