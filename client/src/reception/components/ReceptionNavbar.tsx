import { graduateMen } from "@/admin/assets/svg";
import { Divider, Group } from "@mantine/core";
import {
  GraduationCap,
  House,
  UserRoundPlus,
  Users,
  UsersRoundIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
const ReceptionNavbar = ({ close }: { close: () => void }) => {
  return (
    <div className="flex flex-col admin-navbar">
      <Group align="center" gap="5" className="pt-5 pb-3">
        <h3 className="text-xl px-4 ">Reception Paneli </h3>
      </Group>
      <Divider />
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
        to="/reception/group"
      >
        <Users />
        Guruhlar
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
      <NavLink
        onClick={close}
        className="w-full py-2 px-4 flex items-center gap-2  text-lg"
        to="/reception/students"
      >
        <img src={graduateMen} alt="graduateMen" width={28} />
        O'quvchilar
      </NavLink>
    </div>
  );
};
export default ReceptionNavbar;
