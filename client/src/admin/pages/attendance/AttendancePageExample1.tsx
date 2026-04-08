import { Table, Button, Badge } from "@mantine/core";
import { MiniCalendar } from "@mantine/dates";
import dayjs from "dayjs";
import { useState } from "react";

// Uzbekistan holidays 2026 (add more from backend/API) [web:9][web:11]
const holidays = ["2026-03-08", "2026-03-21", "2026-12-08"];

const AttendancePageExample1 = () => {
  const students = [
    { id: 1, name: "Ali Valiev", group: "A-101" },
    { id: 2, name: "Zarina Karimova", group: "A-102" },
    { id: 3, name: "Bobur Rakhimov", group: "A-101" },
    // Fetch from Prisma: await prisma.student.findMany()
  ];

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<{ [date: string]: { [studentId: number]: "Present" | "Absent" | "Late" } }>({});

  const isLessonDay = (date: Date) => {
    const d = dayjs(date);
    const dayOfMonth = d.date();
    const dayOfWeek = d.day();
    const formatted = d.format("YYYY-MM-DD");
    const isOdd = dayOfMonth % 2 === 1;
    const isSunday = dayOfWeek === 0;
    const isHoliday = holidays.includes(formatted);
    return isOdd && !isSunday && !isHoliday;
  };

  const updateAttendance = (studentId: number, status: "Present" | "Absent" | "Late") => {
    if (!selectedDate) return;
    setAttendance((prev) => ({
      ...prev,
      [selectedDate]: { ...prev[selectedDate], [studentId]: status },
    }));
  };

  const tableRows = students.map((student) => {
    const status = selectedDate ? attendance[selectedDate]?.[student.id] : undefined;
    return (
      <Table.Tr key={student.id}>
        <Table.Td>{student.name}</Table.Td>
        <Table.Td>{student.group}</Table.Td>
        <Table.Td>
          <Badge color={status === "Present" ? "green" : status === "Late" ? "yellow" : "red"}>
            {status || "Pending"}
          </Badge>
        </Table.Td>
        <Table.Td>
          <Button.Group>
            <Button size="xs" variant={status === "Present" ? "filled" : "default"} onClick={() => updateAttendance(student.id, "Present")} >
              Present
            </Button>
            <Button size="xs" variant={status === "Absent" ? "filled" : "default"} onClick={() => updateAttendance(student.id, "Absent")} >
              Absent
            </Button>
            <Button size="xs" variant={status === "Late" ? "filled" : "default"} onClick={() => updateAttendance(student.id, "Late")} >
              Late
            </Button>
          </Button.Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <div style={{ padding: "1rem", maxWidth: "800px" }}>
      <h2>Student Daily Attendance</h2>
      
      <MiniCalendar
        value={selectedDate}
        onChange={setSelectedDate}
        numberOfDays={30}
        // excludeDate={(date) => !isLessonDay(date)}
      />

      {selectedDate && (
        <div style={{ marginTop: "1rem" }}>
          <p>Selected: {dayjs(selectedDate).format("MMMM DD, YYYY")} ({isLessonDay(new Date(selectedDate)) ? "Lesson Day" : "No Lesson"})</p>
          
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Student</Table.Th>
                <Table.Th>Group</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{tableRows}</Table.Tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AttendancePageExample1;
