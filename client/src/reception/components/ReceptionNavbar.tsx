import { GraduationCap, House, UserRoundPlus, UsersRoundIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
const ReceptionNavbar = ({ close }: { close: () => void }) => {
  return (
    <div className="flex flex-col admin-navbar">
      <NavLink
        onClick={close}
        className="w-full py-2 px-4 flex items-center gap-2  text-lg"
        to="/reception/main"
      >
        <House />
        Bosh sahifa
      </NavLink>
      <NavLink
        onClick={close}
        className="w-full py-2 px-4 flex items-center gap-2  text-lg"
        to="/reception/teachers"
      >
        <UsersRoundIcon />
        O'qituvchilar
      </NavLink>
      <NavLink
        onClick={close}
        className="w-full py-2 px-4 flex items-center gap-2  text-lg"
        to="/reception/new-students"
      >
        <UserRoundPlus />
        Yangi o'quvchilar
      </NavLink>
      <NavLink
        onClick={close}
        className="w-full py-2 px-4 flex items-center gap-2  text-lg"
        to="/reception/certificate"
      >
        <GraduationCap />
        Tayor Sertificatlar
      </NavLink>
    </div>
  );
};
export default ReceptionNavbar;
