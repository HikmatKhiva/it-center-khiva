import { prisma } from "../../app.js";
import path from "path";
import fs from "fs";
import { zipFolder } from "../../utils/zipFolder.js";
import { promisify } from "util";
const __dirname = path.resolve();
const unlinkAsync = promisify(fs.unlink); // Promisify fs.unlink for async/await
import validator from "validator";
import createPdf from "../../utils/generateCertificate.js";
// find certificate using QR-code
const findCertificate = async (req, res) => {
  try {
    const { code } = req.query;
    const isValidCode = validator.matches(code, /^\d{2}\/\d{3}-\d{3}$/);
    if (code.length === 0) {
      return res.status(400).json({ message: "code required!" });
    }
    if (!isValidCode) {
      return res.status(400).json({ error: "Manzil xato" });
    }
    const student = await prisma.student.findUnique({
      where: {
        code,
      },
      include: {
        course: true,
      },
    });
    if (student.debt > 0) {
      return res
        .status(400)
        .json({ message: "O'quvchi qarzli!", debt: student?.debt });
    }
    if (!student) {
      return res.status(404).json({ message: "O'quvchi topilmadi!" });
    }
    const pdfBytes = await createPdf(student, student.course.nameCertificate);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${student.code}-${student.firstName}-${student.secondName}.pdf"`,
    );
    // Send the PDF bytes directly in the response
    return res.send(Buffer.from(pdfBytes));
  } catch (error) {
    return res.status(500).json({ error });
  }
};
const getAllCertificates = async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      name = "",
      year,
      passportId = "",
    } = req.query;
    const yearFilter = parseInt(year, 10) || new Date().getFullYear();

    // Shared where clause to avoid duplication
    const whereClause = {
      passportId: {
        contains: passportId,
        mode: "insensitive",
      },
      firstName: {
        contains: name,
        mode: "insensitive",
      },
      debt: { equals: 0 },
      Group: {
        finishedDate: {
          gte: new Date(yearFilter, 0, 1),
          lte: new Date(yearFilter, 11, 31, 23, 59, 59, 999),
        },
      },
    };

    const [students, totalCount] = await prisma.$transaction([
      prisma.student.findMany({
        where: whereClause,
        select: {
          id: true,
          firstName: true,
          secondName: true,
          passportId: true,
          code: true,
          finishedDate: true,
          course: {
            select: {
              id: true,
              name: true,
              teacher: {
                select: {
                  firstName: true,
                  secondName: true,
                },
              },
            },
          },
          Group: {
            select: {
              finishedDate: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.student.count({ where: whereClause }),
    ]);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    return res.status(200).json({
      students,
      totalPages,
      totalCount,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const downloadGroupCertificateZip = async (req, res) => {
  try {
    const { id } = req.params;
    // Use findFirst instead of findUnique to filter by multiple fields
    const group = await prisma.group.findFirst({
      where: {
        id: parseInt(id),
        isActive: "FINISHED", // Filter condition, not part of unique key
      },
      select: {
        name: true, // You use group.name later, so select it here
        Students: {
          where: {
            debt: 0,
          },
          select: {
            id: true,
            firstName: true,
            secondName: true,
            code: true,
            finishedDate: true,
            course: {
              select: {
                nameCertificate: true,
                name: true,
              },
            },
          },
        },
      },
    });
    if (!group) {
      return res.status(404).json({ message: "Guruh topilmadi." });
    }
    if (group.Students.length === 0) {
      return res.status(404).json({ message: "O'quvchilar barchasi qarzdor!" });
    }
    const tempPath = path.join(__dirname, "temp");
    if (!fs.existsSync(tempPath)) {
      fs.mkdirSync(tempPath, { recursive: true });
    }
    const certificatesDir = path.join(tempPath, group.name);
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true });
    }
    for (const student of group.Students) {
      const certPath = path.join(
        certificatesDir,
        `${student.firstName}_${student.secondName}_certificate.pdf`,
      );
      const pdfBytes = await createPdf(student, student.course.nameCertificate);
      fs.writeFileSync(certPath, pdfBytes);
    }
    await zipFolder(certificatesDir, group.name);
    const zipFilePath = path.join(__dirname, "temp", `${group.name}.zip`);
    // 2. Stream the zip file to the response
    const fileStream = fs.createReadStream(zipFilePath);
    res.set("Content-Disposition", `attachment; filename="${group.name}.zip"`);
    res.set("Content-Type", "application/zip");
    res.status(200);
    fileStream.pipe(res); // Pipe the file stream to the response
    // 3. Handle stream completion and errors
    fileStream.on("end", async () => {
      try {
        await unlinkAsync(zipFilePath); // Use await with promisified unlink
        fs.rmSync(certificatesDir, { recursive: true, force: true });
        console.log("Temporary files deleted.");
        console.log(`Successfully deleted ${zipFilePath}`);
      } catch (unlinkError) {
        const sanitizedPath = validator.escape(zipFilePath);
        console.error(`Error deleting ${sanitizedPath}:`, unlinkError);
        // Log the error but don't throw, as the response has already been sent.
      }
    });
    fileStream.on("error", (streamError) => {
      console.error("Error streaming file:", streamError);
      // If an error occurs during streaming, you can't change the headers or status code.
      // You can log the error and potentially send a generic error message to the client if possible.
      if (!res.headersSent) {
        res.status(500).send("Error streaming file.");
      }
    });
    return;
  } catch (error) {
    return res.status(500).json({ error });
  }
};
const downloadCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate the ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid certificate ID" });
    }

    // Fetch certificate information from database
    const student = await prisma.student.findFirst({
      where: {
        id: parseInt(id),
        debt: 0,
      },
      include: {
        course: true,
      },
    });

    if (!student) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    // Generate PDF
    const pdfBytes = await createPdf(student, student.course.nameCertificate);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${student.code}-${student.firstName}-${student.secondName}.pdf"`,
    );
    return res.send(Buffer.from(pdfBytes));
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while downloading the certificate" });
  }
};
export {
  downloadGroupCertificateZip,
  findCertificate,
  getAllCertificates,
  downloadCertificate,
};
