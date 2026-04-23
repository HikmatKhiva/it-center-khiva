export const formatterGroups = (groups) => {
  return groups.map((group) => {
    const admissionEnd = new Date(
      group.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000
    );
    return {
      courseName: group.course?.name || null,
      teacher:
        `${group.teacher?.firstName} ${group.teacher?.secondName}` || null,
      groupTime: group.schedules[0].time.replace("T", "").replace("_", ":"),
      weekType: group.schedules[0].weekType,
      room: group.schedules[0].Room.name,
      admissionEnd: `${admissionEnd.getDate().toString().padStart(2, "0")}.${(
        admissionEnd.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}.${admissionEnd.getFullYear()}`,
    };
  });
};
// 
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
    const originalPrice = parseInt(price) * parseInt(duration);
    const discountAmount = (originalPrice * discount) / 100;
    return originalPrice - discountAmount;
  } catch (error) {
    throw error;
  }
};