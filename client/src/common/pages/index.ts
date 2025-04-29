import { lazy } from "react";
export const LoadNewStudents = lazy(() => import("./newstudent/NewStudents"));
export const LoadCertificatePage = lazy(() => import("./certificates/CertificatePage"));