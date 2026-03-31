import { createBrowserRouter } from "react-router-dom";
// Main 3
import {
  LoadHomePage,
  LoadContactPage,
  LoadNewsPage,
  LoadNewsPreview,
} from "./pages";
// layouts
import Default from "./layouts/Default";
// lazy loading
import LazyAdminPage from "./loading/LazyAdminPage";
import LazyLoadPage from "./loading/LazyLoadPage";
// Admin Pages
import {
  LoadAdminHome,
  // LoadAdminGroup,
  LoadAdminLogin,
  LoadAdminMessages,
  LoadAdminNews,
  // LoadAdminGroupId,
  LoadAdminCourse,
  LoadAdminTeachers,
  LoadAdminNewsCreate,
  // LoadAdminNewStudents,
  LoadAdminNewsPreview,
  LoadAdminNewsUpdate,
  LoadNotFoundPage,
  LoadAdminRoom,
  LoadAdminRoomId,
  LoadAdminReception,
  LoadAttendancePage
} from "./admin/pages";
// Admin Layout
import { LoadAdminLayout } from "./admin/layouts";
import ReceptionLayout from "./reception/layouts/ReceptionLayout";
import { LoadReceptionMainPage, LoadReceptionTeachers } from "./reception/page";
import {
  LoadCertificatePage,
  LoadNewStudents,
  LoadAdminGroup,
  LoadAdminGroupId,
  LoadStudents,
} from "./common/pages";
export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Default />,
    children: [
      {
        path: "/",
        element: <LazyLoadPage Page={LoadHomePage} />,
      },
      {
        path: "/contact",
        element: <LazyLoadPage Page={LoadContactPage} />,
      },
      {
        path: "/news",
        children: [
          {
            index: true,
            element: <LazyLoadPage Page={LoadNewsPage} />,
          },
          {
            path: ":slug",
            element: <LazyLoadPage Page={LoadNewsPreview} />,
          },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <LazyAdminPage Page={LoadAdminLayout} />,
    children: [
      {
        path: "main",
        element: <LazyAdminPage Page={LoadAdminHome} />,
      },
      {
        path: "group",
        children: [
          {
            index: true,
            element: <LazyAdminPage Page={LoadAdminGroup} />,
          },
          {
            path: ":id",
            element: <LazyAdminPage Page={LoadAdminGroupId} />,
          },
        ],
      },
      {
        path: "news",
        children: [
          {
            index: true,
            element: <LazyAdminPage Page={LoadAdminNews} />,
          },
          {
            path: "create",
            element: <LazyAdminPage Page={LoadAdminNewsCreate} />,
          },
          {
            path: ":slug",
            element: <LazyAdminPage Page={LoadAdminNewsPreview} />,
          },
          {
            path: "update/:slug",
            element: <LazyAdminPage Page={LoadAdminNewsUpdate} />,
          },
        ],
      },
      {
        path: "course",
        element: <LazyAdminPage Page={LoadAdminCourse} />,
      },
      {
        path: "teachers",
        element: <LazyAdminPage Page={LoadAdminTeachers} />,
      },
      {
        path: "messages",
        element: <LazyAdminPage Page={LoadAdminMessages} />,
      },
      {
        path: "rooms",
        children: [
          {
            index: true,
            element: <LazyLoadPage Page={LoadAdminRoom} />,
          },
          {
            path: ":id",
            element: <LazyLoadPage Page={LoadAdminRoomId} />,
          },
        ],
      },
      {
        path: "new-students",
        element: <LazyAdminPage Page={LoadNewStudents} />,
      },
      {
        path: "reception",
        element: <LazyAdminPage Page={LoadAdminReception} />,
      },
      {
        path: "certificate",
        element: <LazyAdminPage Page={LoadCertificatePage} />,
      },
      {
        path: "students",
        element: <LazyAdminPage Page={LoadStudents} />,
      },
      {
        path: "attendance",
        element: <LazyAdminPage Page={LoadAttendancePage} />,
      },
    ],
  },
  {
    path: "/reception",
    element: <LazyAdminPage Page={ReceptionLayout} />,
    children: [
      {
        path: "main",
        element: <LazyAdminPage Page={LoadReceptionMainPage} />,
      },
      {
        path: "new-students",
        element: <LazyAdminPage Page={LoadNewStudents} />,
      },
      {
        path: "teachers",
        element: <LazyAdminPage Page={LoadReceptionTeachers} />,
      },
      {
        path: "certificate",
        element: <LazyAdminPage Page={LoadCertificatePage} />,
      },
      {
        path: "students",
        element: <LazyAdminPage Page={LoadStudents} />,
      },
      {
        path: "group",
        children: [
          {
            index: true,
            element: <LazyAdminPage Page={LoadAdminGroup} />,
          },
          {
            path: ":id",
            element: <LazyAdminPage Page={LoadAdminGroupId} />,
          },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <LazyLoadPage Page={LoadAdminLogin} />,
  },
  {
    path: "*",
    element: <LazyLoadPage Page={LoadNotFoundPage} />,
  },
]);
