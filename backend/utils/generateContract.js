import Pizzip from "pizzip";
import path from "path";
import fs from "fs";
import DocxTemplater from "docxtemplater";
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
    const name = "Hikmatbek Bekturdiev";
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
    const outputFileName = `Contract_${student.fullName}.docx`;
    fs.writeFileSync(outputFileName, buffer);
    console.log(`Generated: ${outputFileName}`);
    return true;
  } catch (error) {
    throw error;
  }
};
