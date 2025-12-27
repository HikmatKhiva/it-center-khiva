import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
const AdminPageProtect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = useAppSelector(selectUser);
  useEffect(() => {
    // If no admin, redirect to auth unless already there
    // if (!admin) {
    //   if (location.pathname !== "/auth") {
    //     navigate("/auth", { replace: true });
    //   }
    //   return;
    // }
    // // Handle routing based on role
    // const currentPath = location.pathname;
    // switch (admin.role) {
    //   case "RECEPTION":
    //     if (!currentPath.startsWith("/reception") && currentPath !== "/auth") {
    //       navigate("/reception", { replace: true });
    //     }
    //     break;
    //   case "ADMIN":
    //     if (!currentPath.startsWith("/admin") && currentPath !== "/auth") {
    //       navigate("/admin", { replace: true });
    //     }
    //     break;
    //   default:
    //     if (currentPath !== "/" && currentPath !== "/auth") {
    //       navigate("/", { replace: true });
    //     }
    // }
  }, [admin]); // Only depend on admin changes, not location

  return null;
};
export default AdminPageProtect;