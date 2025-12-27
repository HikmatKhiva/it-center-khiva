export const formatSchedules = (room) => {
  return {
    id: room.id,
    name: room.name,
    capacity: room.capacity,
    schedules: room.schedules.map((schedule) => {
      const { teacher, _count, name } = schedule.group;
      const { time, weekType } = schedule;
      return {
        name,
        time,
        weekType,
        teacher: `${teacher.firstName} ${teacher.secondName}`,
        countStudents: _count.Students,
      };
    }),
  };
};
export const formatSchedulesByDay = (rooms) => {
  const result = rooms.map((room) => ({
    ...room,
    schedules: room.schedules.reduce(
      (acc, schedule) => {
        if (schedule.weekType === "ODD") {
          acc.ODD.time.push(schedule.time.replace("T", "").replace("_", ":"));
        } else if (schedule.weekType === "EVEN") {
          acc.EVEN.time.push(schedule.time.replace("T", "").replace("_", ":"));
        }
        return acc;
      },
      {
        ODD: { time: [] },
        EVEN: { time: [] },
      }
    ),
  }));
  return result;
};