import { prisma } from "../../app.js";
import { generateContract } from "../../utils/generateContract.js";
import {
  dataConverter,
  generateStudentCode,
  studentsConverter,
} from "./students.helper.js";
import path from "path";
import fs from "fs";
import { zipFolder } from "../../utils/zipFolder.js";
import { promisify } from "util";
const unlinkAsync = promisify(fs.unlink); // Promisify fs.unlink for async/await
const __dirname = path.resolve();
// get all students
const getAllStudents = async (req, res) => {
  try {
    let {
      limit = 1,
      page = 1,
      name,
      passportId,
      year,
      courseId,
      orderBy,
    } = req.query;
    const yearFilter = parseInt(year, 10) || new Date().getFullYear();
    orderBy = orderBy || "asc";
    const students = await prisma.student.findMany({
      where: {
        firstName: {
          contains: name,
          mode: "insensitive",
        },
        ...(courseId && { courseId: parseInt(courseId) }),
        ...(passportId && {
          OR: [
            {
              passportId: {
                contains: passportId,
                mode: "insensitive",
              },
            },
            {
              guarantor: {
                passportId: {
                  contains: passportId,
                  mode: "insensitive",
                },
              },
            },
          ],
        }),
        createdAt: {
          gte: new Date(yearFilter, 0, 1),
          lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
        },
      },
      orderBy: {
        createdAt: orderBy,
      },
      select: {
        id: true,
        firstName: true,
        secondName: true,
        createdAt: true,
        code: true,
        passportId: true,
        finishedDate: true,
        debt: true,
        guarantor: true,
        Group: {
          select: {
            name: true,
            isActive: true,
          },
        },
        course: {
          select: {
            name: true,
            teacher: {
              select: {
                firstName: true,
                secondName: true,
              },
            },
          },
        },
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });
    const totalCount = await prisma.student.count({
      where: {
        firstName: {
          contains: name,
          mode: "insensitive",
        },
        ...(courseId && { courseId: parseInt(courseId) }),
        passportId: {
          contains: passportId,
          mode: "insensitive",
        },
        createdAt: {
          gte: new Date(yearFilter, 0, 1),
          lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
        },
      },
    });
    const totalPages = Math.ceil(totalCount / limit);
    return res.status(200).json({ students, totalPages });
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ error });
  }
};
// get group students
const getGroupStudents = async (req, res) => {
  try {
    const { limit = 1, page = 1, name, groupId } = req.query;
    const students = await prisma.student.findMany({
      where: {
        OR: [
          { firstName: { contains: name, mode: "insensitive" } },
          { secondName: { contains: name, mode: "insensitive" } },
        ],
        ...(groupId && { groupId: parseInt(groupId) }),
      },
      include: {
        guarantor: true,
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });
    const totalCount = await prisma.student.count({
      where: {
        firstName: {
          contains: name,
        },
        ...(groupId && { groupId: parseInt(groupId) }),
      },
    });
    const totalPages = Math.ceil(totalCount / limit);
    return res.status(200).json({ students, totalPages });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// get a student
const getAStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!student) {
      return res.status(404).json({ message: "O'quvchi topilmadi." });
    }
    return res.status(200).json(student);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// create a student
const createStudent = async (req, res, next) => {
  try {
    const {
      firstName,
      secondName,
      passportId,
      groupId,
      courseId,
      discount,
      gender,
      phone,
      guarantor,
      address,
      docType,
    } = req.body;
    const group = await prisma.group.findUnique({
      where: {
        id: parseInt(groupId),
      },
    });
    if (!group) return res.status(404).json({ message: "Guruh topilmadi!" });
    if (group.isActive === "FINISHED") {
      return res.status(400).json({ message: "Guruh yakunlangan!" });
    }
    let debt;
    let finishedDate;
    if (docType === "BIRTHCERTIFICATE" && !guarantor) {
      return res.status(500).json({ message: "Vasiy ma'lumotlari shart!" });
    }
    const student = await prisma.student.findUnique({
      where: {
        passportId,
      },
    });
    if (group.isActive === "ACTIVE") {
      debt =
        parseInt(group.price) * parseInt(group.duration) * (1 - discount / 100);
      finishedDate = group.finishedDate;
    }
    if (student) {
      return res
        .status(400)
        .json({ message: "Passport ID ma'lumotlar bazasida mavjud!" });
    }
    const code = await generateStudentCode();
    const exists = await prisma.student.findUnique({
      where: { code: code },
    });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Student Code ma'lumotlar bazasida mavjud!" });
    }
    let guarantorId = null;
    if (docType === "BIRTHCERTIFICATE") {
      const g = await prisma.guarantor.upsert({
        where: { passportId: guarantor.passportId },
        update: {},
        create: {
          firstName: guarantor.firstName,
          secondName: guarantor.secondName,
          passportId: guarantor.passportId,
          phone: guarantor.phone,
        },
      });
      guarantorId = g.id;
    }
    await prisma.student.create({
      data: {
        firstName,
        secondName,
        passportId,
        groupId,
        courseId,
        address,
        docType,
        code,
        debt: debt ? debt : undefined,
        finishedDate: finishedDate ? finishedDate : undefined,
        discount: parseInt(discount),
        gender: gender.toUpperCase(),
        phone,
        paymentType: "selfPayment",
        guarantorId,
      },
    });
    return res
      .status(201)
      .json({ message: "O'quvchi muvaffaqiyatli yaratildi." });
  } catch (error) {
    next(error);
  }
};
// update student
const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      secondName,
      passportId,
      gender,
      phone,
      docType,
      address,
      guarantor,
    } = req.body;
    if (docType === "BIRTHCERTIFICATE" && !guarantor) {
      return res.status(500).json({ message: "Vasiy ma'lumotlari shart!" });
    }
    let guarantorId = null;
    if (docType === "BIRTHCERTIFICATE") {
      const g = await prisma.guarantor.upsert({
        where: { passportId: guarantor.passportId },
        update: {},
        create: {
          firstName: guarantor.firstName,
          secondName: guarantor.secondName,
          passportId: guarantor.passportId,
          phone: guarantor.phone,
        },
      });

      guarantorId = g.id;
    }
    await prisma.student.update({
      where: {
        id: parseInt(id),
      },
      data: {
        firstName,
        secondName,
        passportId,
        gender: gender.toUpperCase(),
        phone,
        docType,
        address,
        guarantorId,
      },
    });
    return res
      .status(200)
      .json({ message: "O'quvchi muvaffaqiyatli yangilandi." });
  } catch (error) {
    next(error);
  }
};
// delete a student
const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.student.delete({
      where: {
        id: parseInt(id, 10),
      },
    });
    return res
      .status(200)
      .json({ message: "O'quvchi muvaffaqiyatli o'chirildi." });
  } catch (error) {
    next(error);
  }
};
const getContract = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
      where: {
        id: parseInt(id),
        Group: {
          isActive: {
            in: ["ACTIVE", "FINISHED"],
          },
        },
      },
      include: {
        Group: {
          select: {
            price: true,
            duration: true,
            startTime: true,
            finishedDate: true,
          },
        },
        course: {
          select: {
            name: true,
          },
        },
        guarantor: true,
      },
    });
    if (!student) {
      return res.status(404).json({ message: "O'quvchi mavjud emas!" });
    }
    const data = dataConverter(student);
    const docxBuffer = await generateContract(data);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="contract-${student.firstName}-${student.secondName}.docx"`,
    );
    return res.send(docxBuffer);
  } catch (error) {
    res.status(500).json({ error });
  }
};
const downloadAllContracts = async (req, res) => {
  try {
    const { id } = req.params;
    const students = await prisma.student.findMany({
      where: {
        Group: {
          id: parseInt(id),
          isActive: {
            in: ["ACTIVE", "FINISHED"],
          },
        },
      },
      include: {
        Group: {
          select: {
            name: true,
            price: true,
            duration: true,
            startTime: true,
            finishedDate: true,
          },
        },
        course: {
          select: {
            name: true,
          },
        },
        guarantor: true,
      },
    });
    if (students.length === 0) {
      return res.status(404).json({ message: "O'quvchilar yo'q!" });
    }
    const groupName = students[0]?.Group?.name;
    const data = studentsConverter(students);
    const tempPath = path.join(__dirname, "temp");
    if (!fs.existsSync(tempPath)) {
      fs.mkdirSync(tempPath, { recursive: true });
    }
    const contractsDir = path.join(tempPath, groupName);
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir, { recursive: true });
    }
    for (const student of data) {
      const certPath = path.join(
        contractsDir,
        `${student.fullName}_contract.docx`,
      );
      const docxBuffer = await generateContract(student);
      fs.writeFileSync(certPath, docxBuffer);
    }
    await zipFolder(contractsDir, groupName);
    const zipFilePath = path.join(__dirname, "temp", `${groupName}.zip`);
    const fileStream = fs.createReadStream(zipFilePath);
    res.set("Content-Disposition", `attachment; filename="${groupName}.zip"`);
    res.set("Content-Type", "application/zip");
    res.status(200);
    fileStream.pipe(res);
    fileStream.on("end", async () => {
      try {
        await unlinkAsync(zipFilePath);
        fs.rmSync(contractsDir, { recursive: true, force: true });
        console.log("Temporary files deleted.");
        console.log(`Successfully deleted ${zipFilePath}`);
      } catch (unlinkError) {
        const sanitizedPath = validator.escape(zipFilePath);
        console.error(`Error deleting ${sanitizedPath}:`, unlinkError);
      }
    });
    fileStream.on("error", (streamError) => {
      console.error("Error streaming file:", streamError);
      if (!res.headersSent) {
        res.status(500).send("Error streaming file.");
      }
    });
    return;
  } catch (error) {
    res.status(500).json({ error });
  }
};
const getGuarantor = async (req, res) => {
  try {
    const { passportId } = req.params;
    const guarantor = await prisma.guarantor.findUnique({
      where: { passportId },
    });
    if (!guarantor) {
      return res.status(404).json({ message: "Vasiy topilmadi!" });
    }
    return res.status(200).json(guarantor);
  } catch (error) {
    res.status(500).json({ error });
  }
};
export {
  getGroupStudents,
  getAllStudents,
  getAStudent,
  createStudent,
  deleteStudent,
  updateStudent,
  getContract,
  getGuarantor,
  downloadAllContracts,
};
