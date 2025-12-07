import { Router } from "express";
import { studentsRoutes } from "./students/students.routes.js";
import { certificateRoutes } from "./certificates/certificates.routes.js";
import { courseRoutes } from "./courses/courses.routes.js";
import { groupRoutes } from "./groups/groups.routes.js";
import { teachersRoutes } from "./teachers/teachers.routes.js";
import { paymentsRoutes } from "./payments/payments.routes.js";
import { adminRoutes } from "./admin/admin.routes.js";
import { debtorsRoutes } from "./debtors/debtors.routes.js";
import { roomRoutes } from "./rooms/rooms.routes.js";
// controllers
import { addNewStudent } from "./newStudents/newStudents.controller.js";
import { createMessage } from "./messages/messages.controller.js";
import { getNewGroups } from "./groups/groups.controller.js";
import { middlewareAdmin } from "../middleware/admin.middleware.js";
import { getCourseAndTeachers } from "./form/form.controller.js";
import {
  adminLogin,
  generateSecret,
  Verify2FA,
} from "./admin/admin.controller.js";
import { newStudentRoutes } from "./newStudents/newStudents.routes.js";
import { validate } from "../middleware/validation.middleware.js";
export const V1Routes = Router();
import { userLoginSchema, userVerifySchema } from "./admin/admin.validation.js";
import { newsRoutes } from "./news/news.routes.js";
import { messageSchema } from "./messages/message.validation.js";
import { newStudentSchema } from "./newStudents/newStudent.validation.js";
import { receptionRoutes } from "./reception/reception.routes.js";
import { statsRoutes } from "./stats/stats.routes.js";
// without admin middleware routes
V1Routes.post("/newStudents/add", validate(newStudentSchema), addNewStudent);
V1Routes.post("/message/create", validate(messageSchema), createMessage);
V1Routes.get("/opened/group", getNewGroups);
V1Routes.get("/form/data", getCourseAndTeachers);
V1Routes.post("/auth/admin/login", validate(userLoginSchema), adminLogin);
V1Routes.post("/auth/admin/verify-2fa", validate(userVerifySchema), Verify2FA);
V1Routes.use("/news", newsRoutes);
// checking admin middleware
V1Routes.use("/debtors", middlewareAdmin, debtorsRoutes);
V1Routes.use("/students", middlewareAdmin, studentsRoutes);
V1Routes.use("/certificate", middlewareAdmin, certificateRoutes);
V1Routes.use("/course", middlewareAdmin, courseRoutes);
V1Routes.use("/group", middlewareAdmin, groupRoutes);
V1Routes.use("/teachers", middlewareAdmin, teachersRoutes);
V1Routes.use("/payment", middlewareAdmin, paymentsRoutes);
V1Routes.use("/admin", middlewareAdmin, adminRoutes);
V1Routes.use("/reception", middlewareAdmin, receptionRoutes);
V1Routes.use("/newStudents", middlewareAdmin, newStudentRoutes);
V1Routes.use("/stats", middlewareAdmin, statsRoutes);
V1Routes.get("/generate-secret", middlewareAdmin, generateSecret);

// new features
V1Routes.use("/room", middlewareAdmin, roomRoutes);
