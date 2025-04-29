import { AppShell } from "@mantine/core";
import { Link, NavLink } from "react-router-dom";
import { Burger, Container, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ThemeControl from "../components/ThemeControl";
import { navLinks } from "../config";
import LogoSVG from "../motions_components/LogoSVG";
import NewOpenedGroup from "../components/announcement/NewOpenedGroup";
import { useQuery } from "@tanstack/react-query";
import { getNewGroupList } from "../api/api.helper";
const Header = () => {
  const [opened, { toggle,close }] = useDisclosure(false);
  const { data } = useQuery({
    queryKey: ["openedGroups"],
    queryFn:()=> getNewGroupList<IOpenedGroup>(),
  });
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      className="position-sticky top-0 z-50"
    >
      <AppShell.Header>
        <Container size="xl" p="0" className="h-full">
          <Group h="100%" px="md">
            <Link to="/">
              <LogoSVG />
            </Link>
            <Group justify="center" align="center" style={{ flex: 1 }}>
              <Group
                className="-translate-x-1/2"
                pos="fixed"
                left="50%"
                ml="xl"
                gap={20}
                visibleFrom="sm"
              >
                {navLinks?.map((link: ILinks) => (
                  <NavLink
                  onClick={close}
                    className={({ isActive }) =>
                      isActive
                        ? "text-[#93CE03]"
                        : "hover:text-[#93CE03] transition-all duration-300"
                    }
                    key={link.id}
                    to={link.link}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </Group>
            </Group>
            <Group align="flex-start">
              <ThemeControl />
              {Array.isArray(data) && data.length > 0 && (
                <NewOpenedGroup groupList={data} />
              )}
            </Group>

            <Burger
              onClick={toggle}
              aria-label="burger button"
              aria-labelledby="burger button"
              opened={opened}
              hiddenFrom="sm"
              size="sm"
            />
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        {navLinks?.map((link: ILinks) => (
          <NavLink onClick={close} className="p-2" key={link.id} to={link.link}>
            {link.label}
          </NavLink>
        ))}
      </AppShell.Navbar>
    </AppShell>
  );
};
export default Header;
