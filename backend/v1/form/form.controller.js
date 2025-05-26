import { prisma } from "../../app.js";
import { convertDataForSelect } from "./form.helper.js";
const getCourseAndTeachers = async (req, res) => {
  try {
    const dataTeacher = await prisma.teacher.findMany({
      select: {
        id: true,
        firstName: true,
        secondName: true,
      },
    });
    const teachers = dataTeacher.map((teacher) =>
      convertDataForSelect(
        teacher.id,
        `${teacher.firstName} ${teacher?.secondName}.`
      )
    );
    const dataCourse = await prisma.course.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    const courses = dataCourse.map((course) =>
      convertDataForSelect(course.id, `${course.name}.`)
    );
    return res.status(200).json({
      courses,
      teachers,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
export { getCourseAndTeachers };