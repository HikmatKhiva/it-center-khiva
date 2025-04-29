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
  if (!latest) return "100-001";
  const latestCode = latest?.code;
  const codeParts = latestCode.split("-");
  const firstPart = codeParts[0];
  const secondPart = parseInt(codeParts[1]);
  // Increment the second part
  const newSecondPart = secondPart + 1;
  // Generate the new code
  return `${firstPart}-${String(newSecondPart).padStart(3, "0")}`;
};
