import { MiniCalendar } from "@mantine/dates";
import dayjs from "dayjs";
import { useState } from "react";
// bayram kunlari (backenddan olsa yanada yaxshi)

const AttendancePage = () => {
  const holidays = ["2026-03-08", "2026-03-21"];
  const [value, setValue] = useState(null);

  const isLessonDay = (date: any) => {
    
    const d = dayjs(date);

    const dayOfMonth = d.date(); // 1–31
    const dayOfWeek = d.day(); // 0 = Sunday

    const formatted = d.format("YYYY-MM-DD");

    const isOdd = dayOfMonth % 2 === 1;
    const isSunday = dayOfWeek === 0;
    const isHoliday = holidays.includes(formatted);

    return isOdd && !isSunday && !isHoliday;
  };
  return (
    <div>
      AttendancePage
      {/* <MiniCalendar numberOfDays={10} /> */}
      <MiniCalendar
        value={value}
        onChange={setValue}
        numberOfDays={7}
        excludeDate={(date) => !isLessonDay(date)}
      />
    </div>
  );
};

export default AttendancePage;
