import { Divider, Group, NavLink as MantineNavLink } from "@mantine/core";
import {
  BookOpenText,
  ConciergeBell,
  DoorClosed,
  GraduationCap,
  House,
  Mails,
  Newspaper,
  User,
  UserRoundPlus,
  Users,
  Settings,
  UserRound,
  Calendar,
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
      <MantineNavLink
        label="Sozlamalar"
        leftSection={<Settings />}
        href="/admin/settings"
      >
        <MantineNavLink
          component={NavLink}
          onClick={close}
          to="/admin/teachers"
          label="O'qituvchilar"
          leftSection={<User />}
        />
        <MantineNavLink
          component={NavLink}
          onClick={close}
          to="/admin/course"
          label="Kurslar"
          leftSection={<BookOpenText />}
        />
        <MantineNavLink
          component={NavLink}
          onClick={close}
          to="/admin/reception"
          label="Reception"
          leftSection={<ConciergeBell />}
        />
        <MantineNavLink
          component={NavLink}
          onClick={close}
          to="/admin/rooms"
          label="Xonalar"
          leftSection={<DoorClosed />}
        />
      </MantineNavLink>
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
        to="/admin/messages"
      >
        <Mails />
        Xabarlar
      </NavLink>
      <NavLink
        onClick={close}
        className="w-full py-2 px-4 flex items-center gap-2  text-lg"
        to="/admin/new-students"
      >
        <UserRoundPlus />
        Yangi o'quvchilar
      </NavLink>

      <NavLink
        onClick={close}
        className="w-full py-2 px-4 flex items-center gap-2  text-lg"
        to="/admin/certificate"
      >
        <GraduationCap />
        Tayor Sertificatlar
      </NavLink>
      <NavLink
        onClick={close}
        className="w-full py-2 px-4 flex items-center gap-2  text-lg"
        to="/admin/students"
      >
        <UserRound />
        O'quvchilar
      </NavLink>
      <NavLink
        onClick={close}
        className="w-full py-2 px-4 flex items-center gap-2  text-lg"
        to="/admin/attendance"
      >
        <Calendar />
        Attendance
      </NavLink>
    </div>
  );
};
export default AdminNavbar;