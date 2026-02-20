import { prisma } from "../../app.js";
import { generateReceipt } from "../../utils/generateReceipt.js";
// find receipt by public token for scan qr code public everyone
const findReceipt = async (req, res) => {
  try {
    const { token } = req.params;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const receipt = await prisma.receipt.findUnique({
      where: { publicToken: token },
      select: {
        issuedAt: true,
        receiptNo: true,
        status: true,
        amount: true,
        publicToken:true,
        student: {
          select: {
            firstName: true,
            secondName: true,
            course: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    if (!receipt) {
      return res.status(404).json({ message: "Chek Topilmadi!" });
    }
    const pdfBytes = await generateReceipt(receipt,baseUrl);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${receipt.receiptNo}.pdf"`,
    );
    // Send the PDF bytes directly in the response
    return res.send(Buffer.from(pdfBytes));
  } catch (error) {
    return res.status(500).json({ error });
  }
};
// get receipt by paymentId
const getReceipt = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const parsedId = parseInt(paymentId);
    const receipt = await prisma.receipt.findUnique({
      where: { paymentId: parsedId },
      select: {
        id: true,
        issuedAt: true,
        receiptNo: true,
        status: true,
        amount: true,
        publicToken: true,
        student: {
          select: {
            firstName: true,
            secondName: true,
            course: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    if (!receipt) {
      return res.status(404).json({ message: "Chek Topilmadi!" });
    }
    return res.status(200).json(receipt);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
export { findReceipt, getReceipt };