import { Prisma } from "@prisma/client";
export const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        return res.status(400).json({
          message: "Bu qiymat allaqachon mavjud.",
          field: err.meta?.target,
        });

      case "P2025":
        return res.status(404).json({
          message: "Ma'lumot topilmadi.",
        });

      default:
        return res.status(400).json({
          message: "Database xatolik yuz berdi.",
          code: err.code,
        });
    }
  }
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      message: "Noto‘g‘ri ma'lumot yuborildi.",
    });
  }
  return res.status(500).json({
    message: "Serverda xatolik yuz berdi.",
  });
};