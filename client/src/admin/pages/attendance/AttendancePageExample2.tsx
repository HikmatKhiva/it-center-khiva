// import { Button, Menu, Table } from "@mantine/core";
// import { Minus, NotebookPen, Plus } from "lucide-react";
// const AttendancePageExample2 = () => {
//   return (
//     <div>
//       <Table withTableBorder>
//         <Table.Thead>
//           <Table.Tr>
//             <Table.Th>N</Table.Th>
//             <Table.Th>Dushanba</Table.Th>
//             <Table.Th>Seshanba</Table.Th>
//             <Table.Th>Chorshanba</Table.Th>
//             <Table.Th>Payshanba</Table.Th>
//             <Table.Th>Juma</Table.Th>
//             <Table.Th>Shanba</Table.Th>
//             <Table.Th>Yakshanba</Table.Th>
//           </Table.Tr>
//         </Table.Thead>
//         <Table.Tbody>
//           <Table.Tr>
//             <Table.Td>Hikmat</Table.Td>
//             <Table.Td>
//               <Menu>
//                 <Menu.Target>
//                   <Button size="compact-lg">1</Button>
//                 </Menu.Target>
//                 <Menu.Dropdown>
//                   <Menu.Item>
//                     <Plus size={16} />
//                   </Menu.Item>
//                   <Menu.Item>
//                     <Minus size={16} />
//                   </Menu.Item>
//                   <Menu.Item>
//                     <NotebookPen size={16} />
//                   </Menu.Item>
//                 </Menu.Dropdown>
//               </Menu>
//             </Table.Td>
//             <Table.Td>2</Table.Td>
//             <Table.Td>3</Table.Td>
//             <Table.Td>4</Table.Td>
//             <Table.Td>5</Table.Td>
//             <Table.Td>6</Table.Td>
//             <Table.Td>7</Table.Td>
//           </Table.Tr>
//         </Table.Tbody>
//       </Table>
//     </div>
//   );
// };

// export default AttendancePageExample2;


// import React from 'react'
// import {
//   Container,
//   Card,
//   Text,
//   Group,
//   Avatar,
//   SegmentedControl,
//   Stack,
//   Badge,
//   Button,
//   TextInput,
//   Grid,
//   Title,
// } from "@mantine/core";
// import { useState } from "react";

// const students = [
//   { id: 1, name: "Ali Karimov" },
//   { id: 2, name: "John Doe" },
//   { id: 3, name: "Jane Smith" },
//   { id: 4, name: "Sara Lee" },
// ];

const AttendancePageExample2 = () => {
//     const [attendance, setAttendance] = useState({});

//   const setStatus = (id, value) => {
//     setAttendance((prev) => ({ ...prev, [id]: value }));
//   };

//   const stats = {
//     present: Object.values(attendance).filter((v) => v === "present").length,
//     absent: Object.values(attendance).filter((v) => v === "absent").length,
//     late: Object.values(attendance).filter((v) => v === "late").length,
//   };

  return (
  <>
   {/* <Container size="md" py="xl">
      <Group position="apart" mb="lg">
        <Title order={2}>📋 Attendance</Title>
        <Button variant="light">Today</Button>
      </Group>

      <Group mb="md">
        <TextInput placeholder="Search student..." style={{ flex: 1 }} />
        <Button variant="default">Class 10A</Button>
      </Group>

      <Grid mb="md">
        <Grid.Col span={4}>
          <Card radius="lg" shadow="sm">
            <Text size="sm">Present</Text>
            <Title color="teal">{stats.present}</Title>
          </Card>
        </Grid.Col>

        <Grid.Col span={4}>
          <Card radius="lg" shadow="sm">
            <Text size="sm">Absent</Text>
            <Title color="red">{stats.absent}</Title>
          </Card>
        </Grid.Col>

        <Grid.Col span={4}>
          <Card radius="lg" shadow="sm">
            <Text size="sm">Late</Text>
            <Title color="yellow">{stats.late}</Title>
          </Card>
        </Grid.Col>
      </Grid>

      <Card radius="lg" shadow="sm" p="md">
        <Stack spacing="sm">
          {students.map((student) => (
            <Group key={student.id} position="apart">
              <Group>
                <Avatar radius="xl">{student.name[0]}</Avatar>
                <Text fw={500}>{student.name}</Text>
              </Group>

              <SegmentedControl
                value={attendance[student.id] || ""}
                onChange={(val) => setStatus(student.id, val)}
                data={[
                  { label: "✅", value: "present" },
                  { label: "❌", value: "absent" },
                  { label: "⏰", value: "late" },
                ]}
                radius="xl"
                size="sm"
              />
            </Group>
          ))}
        </Stack>
      </Card>

      <Button fullWidth mt="lg" size="md" radius="lg">
        💾 Save Attendance
      </Button>
    </Container> */}
    </>
  )
}

export default AttendancePageExample2