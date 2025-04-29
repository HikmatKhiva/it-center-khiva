import { prisma } from "../../app.js";
import createPdf from "../../utils/generateCertificate.js";
// main process
export async function createCertificate(student, group, courseName, origin) {
  if (!student.id || !group.id || !courseName || !origin) {
    throw new Error("Certificate yaratish uchun ma'lumot lar to'liq emas!");
  }
  const currentYear = new Date().getFullYear().toString().slice(2, 4);
  try {
    const generatedURL = `${origin}/site/certificate/?code=${currentYear}/${student?.code}`;
    // create certificate pdf
    await createPdf(student, group, courseName, generatedURL);
  } catch (error) {
    throw error;
  }
}
// save a certificate url
export async function createCertificateUrl(student, group, filePath) {
  if (!student || !group || !group.id || !filePath) {
    throw new Error("Certificate url yaratish uchun ma'lumot lar to'liq emas!");
  }
  const currentYear = new Date().getFullYear().toString().slice(2, 4);
  const parsedStudentId = parseInt(student.id, 10);
  const parsedGroupId = parseInt(group.id, 10);
  // Construct the certificate URL
  const certificateUrl = `${currentYear}/${student.code}`;
  try {
    await prisma.certificate.create({
      data: {
        studentId: parsedStudentId,
        groupId: parsedGroupId,
        certificateUrl,
        filePath,
      },
    });
  } catch (error) {
    throw error;
  }
}