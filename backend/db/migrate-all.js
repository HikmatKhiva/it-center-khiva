// migrate-all-safe.js
import { PrismaClient } from "@prisma/client";
import csvParser from "csv-parser";
import fs from "fs";
import { nanoid, customAlphabet } from "nanoid";

const prisma = new PrismaClient();

// CSV fayllar
const CSV_FILES = {
  admins: "admin.csv",
  students: "student.csv",
  payments: "payment.csv",
  groups: "group.csv",
  courses: "course.csv",
  teachers: "teacher.csv",
};

// CSV o'qish funksiyasi
async function readCsv(filename) {
  const rows = [];
  await new Promise((resolve, reject) => {
    fs.createReadStream(`data/${filename}`)
      .pipe(csvParser())
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve())
      .on("error", (err) => reject(err));
  });
  return rows;
}

// Sequence’larni reset qilish
// async function resetSequences() {
//   const tables = ["Teacher", "Course", "Group", "Student", "Payment", "Admin"];
//   for (const table of tables) {
//     await prisma.$executeRawUnsafe(`
//       SELECT setval('"${table}_id_seq"', COALESCE((SELECT MAX(id) FROM "${table}"), 1));
//     `);
//     console.log(`🔄 Sequence reset for table: ${table}`);
//   }
// }

// Admin qo'shish
async function migrateAdmins() {
  const admins = await readCsv(CSV_FILES.admins);

  for (const row of admins) {
    await prisma.admin.upsert({
      where: { id: Number(row.id) },
      update: {
        username: row.username,
        password: row.password,
        photo_url: row.photo_url || null,
        secret: row.secret,
        role: row.role,
        isActive: row.isActive === "true",
        updatedAt: new Date(),
      },
      create: {
        id: Number(row.id),
        username: row.username,
        password: row.password,
        photo_url: row.photo_url || null,
        secret: row.secret,
        role: row.role,
        isActive: row.isActive === "true",
        createdAt: row.createdAt ? new Date(row.createdAt) : new Date(),
        updatedAt: row.updatedAt ? new Date(row.updatedAt) : new Date(),
      },
    });
    console.log(`✅ Admin migrated/upsert: ${row.username}`);
  }

  console.log(`🎉 Total admins migrated: ${admins.length}`);
}

// Teachers migratsiyasi
async function migrateTeachers() {
  const teachers = await readCsv(CSV_FILES.teachers);
  for (const row of teachers) {
    await prisma.teacher.upsert({
      where: { id: Number(row.id) },
      update: {},
      create: {
        id: Number(row.id),
        firstName: row.firstName,
        secondName: row.secondName,
        phone: row.phone || null,
        photo_url: row.photo_url || null,
        role: "TEACHER",
        createdAt: new Date(row.createdAt),
        updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
      },
    });
  }
  console.log(`✅ Teachers migrated: ${teachers.length}`);
}

// Courses migratsiyasi
async function migrateCourses() {
  const courses = await readCsv(CSV_FILES.courses);
  for (const row of courses) {
    await prisma.course.upsert({
      where: { id: Number(row.id) },
      update: {},
      create: {
        id: Number(row.id),
        name: row.name,
        nameCertificate: row.nameCertificate,
        teacherId: Number(row.teacherId),
        createdAt: new Date(row.createdAt),
        updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
      },
    });
  }
  console.log(`✅ Courses migrated: ${courses.length}`);
}

// Groups migratsiyasi
async function migrateGroups() {
  const groups = await readCsv(CSV_FILES.groups);
  for (const row of groups) {
    await prisma.group.upsert({
      where: { id: Number(row.id) },
      update: {},
      create: {
        id: Number(row.id),
        name: row.name,
        courseId: Number(row.courseId),
        teacherId: Number(row.teacherId),
        price: Number(row.price),
        duration: Number(row.duration),
        isActive: row.isActive === "FINISHED" ? "FINISHED" : "ACTIVE",
        finishedDate: row.finishedDate ? new Date(row.finishedDate) : null,
        startTime: row.startTime
          ? new Date(row.startTime)
          : new Date(row.createdAt),
        createdAt: new Date(row.createdAt),
        updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
      },
    });
  }
  console.log(`✅ Groups migrated: ${groups.length}`);
}

// Students migratsiyasi
async function migrateStudents() {
  const students = await readCsv(CSV_FILES.students);
  for (const row of students) {
    await prisma.student.upsert({
      where: { id: Number(row.id) },
      update: {},
      create: {
        id: Number(row.id),
        firstName: row.firstName,
        secondName: row.secondName,
        passportId: row.passportId || null,
        gender: row.gender === "MALE" ? "MALE" : "FEMALE",
        debt: row.debt ? Number(row.debt) : 0,
        debtStatus: Number(row.debt) > 0 ? "ACTIVE" : "PENDING",
        code: row.code,
        address: row.address || "",
        phone: row.phone || null,
        finishedDate: row.finishedDate ? new Date(row.finishedDate) : null,
        courseId: Number(row.courseId),
        groupId: Number(row.groupId),
        createdAt: new Date(row.createdAt),
        updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
        docType: row.passportId ? "PASSPORT" : "BIRTHCERTIFICATE",
        paymentType: "selfPayment",
      },
    });
  }
  console.log(`✅ Students migrated: ${students.length}`);
}

// Payments + Receipts
async function migratePayments() {
  const payments = await readCsv(CSV_FILES.payments);
  const generatePublicToken = () => nanoid(32);
  const generateReceiptNo = customAlphabet("1234567890ABCDEF", 6);

  for (const row of payments) {
    const publicToken = generatePublicToken();
    const receiptNo = `RV${generateReceiptNo()}`;

    await prisma.payment.upsert({
      where: { id: Number(row.id) },
      update: {},
      create: {
        id: Number(row.id),
        paymentDate: new Date(row.paymentDate),
        amount: Number(row.amount),
        status: row.status || "Paid",
        isRefunded: row.isRefunded === "true",
        refundedAt: row.refundedAt ? new Date(row.refundedAt) : null,
        createdAt: new Date(row.createdAt),
        updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
        studentId: Number(row.studentId),
        createdById: Number(row.createdById) || 1,
        receipts: {
          create: {
            receiptNo,
            publicToken,
            studentId: Number(row.studentId),
            amount: Number(row.amount),
            status: Number(row.amount) > 0 ? "ACTIVE" : "CANCELLED",
            issuedAt: new Date(row.paymentDate),
            cancelledAt: null,
          },
        },
      },
    });
  }
  console.log(`✅ Payments migrated: ${payments.length}`);
}

// Barchasini ishlatish
async function main() {
  try {
    // console.log("🔹 Sequence’larni reset qilinmoqda...");
    // await resetSequences();

    console.log("🔹 Admin tayyorlanmoqda...");
    await migrateAdmins();

    console.log("🔹 Teachers migratsiya...");
    await migrateTeachers();

    console.log("🔹 Courses migratsiya...");
    await migrateCourses();

    console.log("🔹 Groups migratsiya...");
    await migrateGroups();

    console.log("🔹 Students migratsiya...");
    await migrateStudents();

    console.log("🔹 Payments migratsiya...");
    await migratePayments();

    console.log("🎉 Barcha ma'lumotlar muvaffaqiyatli migratsiya qilindi!");
  } catch (e) {
    console.error("❌ Xato:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
