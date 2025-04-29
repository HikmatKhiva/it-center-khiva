import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
const Default = () => {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="pt-[60px] min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
export default Default;