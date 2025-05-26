import { prisma } from "../../app.js";
export const calculateDebt = async (groupId, discount) => {
  try {
    const group = await prisma.group.findUnique({
      where: {
        id: parseInt(groupId),
      },
    });
    if (!group) {
      throw new Error("Guruh topilmadi.");
    }
    const { price, duration } = group;
    const originalPrice = price * parseInt(duration);
    const discountAmount = (originalPrice * discount) / 100;
    return originalPrice - discountAmount;
  } catch (error) {
    throw error;
  }
};
export const generateStudentCode = async () => {
  const latest = await prisma.student.findFirst({
    orderBy: {
      createdAt: "desc",
    },
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