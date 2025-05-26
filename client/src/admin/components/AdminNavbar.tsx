import { Divider, Group } from "@mantine/core";
import {
  BookOpenText,
  ConciergeBell,
  GraduationCap,
  House,
  Mails,
  Newspaper,
  User,
  UserRoundPlus,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";
const AdminNavbar = ({ close }: { close: () => void }) => {
  return (
    <div className="flex flex-col admin-navbar">
      <Group align="center" gap="5" className="pt-5 pb-3">
        <h3 className="text-xl px-4 ">Boshqaruv Paneli </h3>
      </Group>
      <Divider />
      <NavLink
        onClick={close}
        className="w-full py-2 px-4 flex items-center gap-2  text-lg"
        to="/admin/main"
      >
        <House />
        Bosh sahifa
      </NavLink>
      <NavLink
        onClick={close}
        className="w-full py-2 px-4 flex items-center gap-2  text-lg"
        to="/admin/group"
      >
        <Users />
        Guruhlar
      </NavLink>

      <NavLink
        onClick={close}
        className="w-full py-2 px-4 flex items-center gap-2  text-lg"
        to="/admin/news"
      >
        <Newspaper />
        Yangiliklar
      </NavLink>
      <NavLink
        onClick={close}
        className="w-full py-2 px-4 flex items-center gap-2  text-lg"
        to="/admin/course"
      >
        <BookOpenText />
        Kurslar
      </NavLink>
      <NavLink
        onClick={close}
        className="w-full py-2 px-4 flex items-center gap-2  text-lg"
        to="/admin/teachers"
      >
        <User />
        O'qituvchilar
      </NavLink>
      <NavLink
        onClick={close}
        className="w-full py-2 px-4 flex items-center gap-2  text-lg"
        to="/admin/messages"
      >
        <Mails />
        Xabarlar
      </NavLink>
      <NavLink
        onClick={close}
        className="w-full py-2 px-4 flex items-center gap-2  text-lg"
        to="/admin/students"
      >
        <UserRoundPlus />
        Yangi o'quvchilar
      </NavLink>
      <NavLink
        onClick={close}
        className="w-full py-2 px-4 flex items-center gap-2  text-lg"
        to="/admin/reception"
      >
        <ConciergeBell />
        Reception
      </NavLink>
      <NavLink
        onClick={close}
        className="w-full py-2 px-4 flex items-center gap-2  text-lg"
        to="/admin/certificate"
      >
        <GraduationCap />
        Tayor Sertificatlar
      </NavLink>
      {/* <NavLink
        onClick={close}
        className="w-full py-2 px-4 flex items-center gap-2  text-lg"
        to="/admin/rooms"
      >
        <DoorClosed  />
        Xonalar
      </NavLink> */}
    </div>
  );
};
export default AdminNavbar;