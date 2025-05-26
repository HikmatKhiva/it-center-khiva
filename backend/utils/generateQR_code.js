import QRcode from "qrcode";
async function generateQR_code(url) {
  try {
    const qr = await QRcode.toDataURL(url, {
      width: 100,
    });
    return qr;
  } catch (error) {
    throw error;
  }
}
export default generateQR_code;
