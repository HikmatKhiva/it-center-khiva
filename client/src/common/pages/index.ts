import { lazy } from "react";
export const LoadNewStudents = lazy(() => import("./newstudent/NewStudents"));
export const LoadCertificatePage = lazy(() => import("./certificates/CertificatePage"));
export const LoadAdminGroup = lazy(() => import("./group/AdminGroups"));
export const LoadAdminGroupId = lazy(() => import("./group/AdminGroupId"));