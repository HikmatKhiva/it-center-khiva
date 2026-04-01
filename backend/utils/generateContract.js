import Pizzip from "pizzip";
import path from "path";
import fs from "fs";
import DocxTemplater from "docxtemplater";
import { getMonthName } from "./util.js";
const __dirname = path.resolve();
function angularParser(tag) {
  return {
    get: function (scope, context) {
      return scope[tag];
    },
  };
}
export const generateContract = async (student) => {
  try {
    const startDate = new Date(student.startTime);
    const finishedDate = new Date(student.finishedDate);
    const docTemplate =
      student.docType === "PASSPORT"
        ? "2-ways-contract_Passport"
        : "2-ways-contract_BirthCertificate";
    const template = fs.readFileSync(
      path.resolve(__dirname, "template", "docs", `${docTemplate}.docx`),
      "binary",
    );

    const zip = new Pizzip(template);
    const doc = new DocxTemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      parser: angularParser,
    });
    doc.render({
      startYear: startDate.getFullYear(),
      startMonth: getMonthName(startDate.getMonth() + 1),
      startDay: startDate.getDate(),

      finishedYear: finishedDate.getFullYear(),
      finishedMonth: getMonthName(finishedDate.getMonth() + 1),
      finishedDay: finishedDate.getDate(),
      passportId: student?.passportId,
      phone: student?.phone || "",
      passportIssueAt: student?.passportIssueAt,
      code: student.code,
      fullName: student.fullName,
      courseName: student.courseName,
      courseDuration: student.courseDuration,
      monthlyPrice: student.monthlyPrice,
      totalPrice: student.totalPrice,
      address: student.address,
      guarantorFullName: student?.guarantor?.fullName,
      guarantorPassportId: student?.guarantor?.passportId,
      guarantorPhone: student?.guarantor?.phone,
      guarantorPassportIssueAt: student?.guarantor?.passportIssueAt,
    });

    const buffer = doc.getZip().generate({ type: "nodebuffer" });
    return buffer;
  } catch (error) {
    throw error;
  }
};