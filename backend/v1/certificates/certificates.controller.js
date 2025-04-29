import { prisma } from "../../app.js";
import path from "path";
import fs from "fs";
import { zipFolder } from "../../utils/zipFolder.js";
import { promisify } from "util";
const __dirname = path.resolve();
const unlinkAsync = promisify(fs.unlink); // Promisify fs.unlink for async/await
// find certificate using QR-code
const findCertificate = async (req, res) => {
  try {
    const { code } = req.query;
    if (code.length === 0) {
      return res.status(400).json({ message: "code required!" });
    }
    if (typeof code !== "string") {
      return res.status(400).json({ error: "Manzil xato" });
    }
    let [yearCode, studentCode] = code.split("/");
    yearCode = yearCode.split(".")[0];
    const studentIdRegex = /^[0-9]+$/; // If studentId should be numeric
    const groupCodeRegex = /^[a-zA-Z0-9_-]+$/; // If groupCode should be alphanumeric with underscores or dashes

    if (!studentIdRegex.test(yearCode)) {
      return res.status(400).json({ error: "O'quvchi id xato!" });
    }
    if (!groupCodeRegex.test(studentCode)) {
      return res.status(400).json({ error: "Guruh code xato!" });
    }
    // Validate input types
    if (!yearCode || !studentCode) {
      return res.status(400).json({ error: "Manzil xato" });
    }
    const certificateUrl = `${yearCode}/${studentCode}`;
    const certificate = await prisma.certificate.findUnique({
      where: {
        certificateUrl,
      },
    });
    if (!certificate) {
      return res.status(404).json({ message: "Sertifiqat topilmadi!" });
    }

    const filePath = path.join(
      __dirname,
      "public",
      "certificates",
      `${certificate.filePath}`
    );
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "certificate mavjud emas." });
    }
    fs.accessSync(filePath, fs.constants.F_OK);
    res.sendFile(filePath);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
const getAllCertificates = async (req, res) => {
  try {
    const { limit = 10, page = 1, passport } = req.query;
    const students = await prisma.student.findMany({
      where: {
        passportId: {
          contains: passport,
        },
        Certificate: {
          isNot: null,
        },
      },
      select: {
        id: true,
        firstName: true,
        secondName: true,
        passportId: true,
        Certificate: {
          select: {
            id: true,
            certificateUrl: true,
          },
        },
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
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });
    const totalCount = await prisma.student.count({
      where: {
        passportId: {
          contains: passport,
        },
        Certificate: {
          isNot: null,
        },
      },
    });
    const totalPages = Math.ceil(totalCount / limit);
    return res.status(200).json({
      students,
      totalPages,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const downloadGroupCertificateZip = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await prisma.group.findUnique({
      where: {
        id: parseInt(id),
        isGroupFinished: true,
      },
      select: {
        name: true,
      },
    });
    if (!group) {
      res.status(404).json({ message: "Guruh topilmadi." });
    }
    const year = "25";
    const folderPath = path.join(
      __dirname,
      "public",
      "certificates",
      `${year}/${group.name}`
    );
    if (!fs.existsSync(folderPath)) {
      res.status(404).json({ message: "Sertificatlar topilmadi." });
    }
    await zipFolder(folderPath, group.name);
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
        console.log(`Successfully deleted ${zipFilePath}`);
      } catch (unlinkError) {
        console.error(`Error deleting ${zipFilePath}:`, unlinkError);
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
    const find = await prisma.student.findUnique({
      where: {
        id: parseInt(id),
        Certificate: {
          is: {}, // Ensures at least one related Certificate exists
        },
      },
      select: {
        Certificate: true,
        firstName: true,
        secondName: true,
      },
    });

    if (!find) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    const certificate = find.Certificate;
    const fullName = `${find.firstName} ${find.secondName}`;

    // Get the file path (adjust based on your storage system)
    const filePath = path.join(
      __dirname,
      "public",
      "certificates",
      `${certificate.filePath}`
    );
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Certificate file not found" });
    }

    // Set appropriate headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${fullName}_certificate.pdf`
    );

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error serving certificate:", error);
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
