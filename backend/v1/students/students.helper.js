import { prisma } from "../../app.js";
import { formatDateWithoutTime } from "../../utils/util.js";
export const generateStudentCode = async () => {
  const latest = await prisma.student.findFirst({
    orderBy: { id: "desc" }, // change get latest created by id when activate group updated student createdAt ,
    select: { code: true },
  });
  const currentYear = new Date().getFullYear() % 100; // Get the last two digits of the current year
  const newFirstPart = String(currentYear).padStart(2, "0"); // Ensure it's two digits
  if (!latest) return `${newFirstPart}/100-001`; // Initial code if no students exist

  const latestCode = latest?.code;
  const codeParts = latestCode.split("/");
  const firstPart = codeParts[0]; // e.g., "25" or "26"
  const secondPart = codeParts[1].split("-")[1]; // e.g., "001"
  const secondPartNumber = parseInt(secondPart);

  // Check if the first part is the same as the current year
  if (firstPart === newFirstPart) {
    // Increment the second part
    const newSecondPart = secondPartNumber + 1;
    // Generate the new code
    return `${firstPart}/100-${String(newSecondPart).padStart(3, "0")}`;
  } else {
    // Reset the second part if the year has changed
    return `${newFirstPart}/100-001`;
  }
};
const getFormattedCode = (value) => {
  const part1 = value.split("/")[0]; // "26"
  const part2 = value.split("-")[1]; // "123"
  return `${part1}/${part2}`;
};
export const dataConverter = (student) => {
  return {
    fullName: `${student?.firstName} ${student?.secondName}`,
    phone: student?.phone,
    passportId: student?.passportId,
    passportIssueAt: formatDateWithoutTime(student.issueAt),
    monthlyPrice: student?.Group?.price,
    courseDuration: student?.Group?.duration,
    code: getFormattedCode(student.code),
    docType: student?.docType,
    totalPrice: Math.floor(
      parseInt(student?.Group?.price) * parseInt(student?.Group?.duration),
    ),
    startTime: student?.Group?.startTime,
    finishedDate: student?.Group?.finishedDate,
    courseName: student?.course?.name,
    address: student?.address,
    guarantor: {
      fullName: `${student?.guarantor?.firstName} ${student?.guarantor?.secondName}`,
      passportId: student?.guarantor?.passportId,
      phone: student?.guarantor?.phone,
      passportIssueAt: formatDateWithoutTime(student?.guarantor?.issueAt),
    },
  };
};
export const studentsConverter = (students) => {
  return students.map((student) => dataConverter(student));
};
