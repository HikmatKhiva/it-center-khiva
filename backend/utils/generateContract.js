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
    const template = fs.readFileSync(
      path.resolve(__dirname, "template", "docs", "2-ways-contract.docx"),
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
      startDay: startDate.getDay(),

      fullName: student.fullName,
      courseName: student.courseName,
      courseDuration: student.courseDuration,
      monthlyPrice: student.monthlyPrice,
      totalPrice: student.totalPrice,
      address: student.address,
      guarantorFullName: student?.guarantor?.fullName,
      guarantorPassportId: student?.guarantor?.passportId,
      guarantorPhone: student?.guarantor?.phone,
    });

    const buffer = doc.getZip().generate({ type: "nodebuffer" });
    // const outputFileName = `Contract_${student.fullName}.docx`;
    // fs.writeFileSync(outputFileName, buffer);
    return buffer;
  } catch (error) {
    throw error;
  }
};
