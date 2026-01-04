export const addNewStudentValidation = {
  fullName: (val: string) =>
    /^.{4,}$/?.test(val) ? null : "Ism 4 kirilishi shart!",
  phone: (number: number | string) =>
    /^\+99 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(String(number))
      ? null
      : "Raqam kiriting!",
  courseId: (val: string) =>
    /^(?!\s*$).+/.test(val) ? null : "Bu joy to'ldirilishi shart!",
  courseTime: (val: string) =>
    /^(?!\s*$).+/?.test(val) ? null : "Bu joy to'ldirilishi shart!",
};
export const anonymMessageValidation = {
  fullName: (val: string) =>
    val.length > 4 ? null : "4 ta belgidan ko'p bo'lishi kerak!",
  message: (val: string) =>
    val.length > 10 ? null : "10 ta belgidan ko'p bo'lishi kerak shart!",
};
export const createCourseValidation = {
  name: (value: string) =>
    value.trim().length < 3
      ? "Kurs nomi 3 ta belgidan kam bo'lishi mumkin emas!"
      : null,
  nameCertificate: (value: string) =>
    value.trim().length < 20
      ? "Kurs nomi 20 harfdan kam bo'lishi mumkin emas!"
      : null,
  teacherId: (value: string) => (value ? null : "O'qituvchini tanlang!"),
};
export const createGroupValidation = {
  name: (value: string) =>
    value.trim().length <= 3 ? "Guruh nomi 3 harfdan kam bo'lmasin!" : null,
  duration: (value: number) =>
    parseInt(value.toString()) > 10 ? "10 dan katta bo'lmasin!" : null,
  price: (value: number) =>
    value < 100000 ? "To'lov puli 100000 kam bo'lmasin!" : null,
  courseId: (value: string) => (!value ? "Kursni tanlash shart!" : null),
  teacherId: (value: string) => (!value ? "O'qituvchini tanlash shart!" : null),
  schedules: {
    weekType: (value: string) =>
      value.trim().length === 0 ? "Kuni belgilang!" : null,
    time: (value: string) =>
      value.trim().length === 0 ? "Vaqtni belgilang!" : null,
    roomId: (value: string | number) => (!value ? "Xonani belgilang!" : null),
  },
};
export const updateGroupValidation = {
  teacherId: (value: string) => (!value ? "O'qituvchini tanlash shart!" : null),
  schedules: {
    weekType: (value: string) =>
      value.trim().length === 0 ? "Kuni belgilang!" : null,
    time: (value: string) =>
      value.trim().length === 0 ? "Vaqtni belgilang!" : null,
    roomId: (value: string | number) => (!value ? "Xonani belgilang!" : null),
  },
};
export const createPaymentValidation = {
  amount: (number: number) =>
    number <= 0 ? "Summani to'g'ri kiriting!" : null,
  studentId: (id: number) =>
    typeof id === "undefined" ? "Ma'lumot to'liq emas!" : null,
  paymentDate: (date: Date) => (date ? null : "To'lov sanasini kiriting!"),
};
export const adminValidation = {
  username: (val: string) =>
    val.trim().length >= 4
      ? null
      : "Username eng kamida 6 belgi bo'lishi kerak!",
  password: (val: string) =>
    val.trim().length >= 6
      ? null
      : "Password eng kamida 6 belgi bo'lishi kerak!",
};
export const studentValidation = {
  firstName: (value: string) => {
    if (!value) return "Ism bo'lishi shart!";
    if (typeof value !== "string") return "Ismni harflar bilan kiriting!";
    if (value?.length <= 3) return "Ismni harflar 3 dan ko'p bo'lishi kerak!";
    return null;
  },
  secondName: (value: string) => {
    if (!value) return "Familiya bo'lishi shart!";
    if (typeof value !== "string") return "Familiya harflar bilan kiriting!";
    if (value?.length <= 3)
      return "Familiya harflar 3 dan ko'p bo'lishi kerak!";
    return null;
  },
  gender: (value: string) =>
    !["male", "female"].includes(value) ? "Iltimos jinsni tanlang!" : null,
};
export const tokenValidation = {
  token: (token: string) =>
    !/^\d*$/.test(token)
      ? "Iltmos faqat raqam kiriting!"
      : token?.length !== 6
      ? "Code to'liq kiriting!"
      : null,
};
export const adminValidate = {
  password: (val: string) =>
    val.trim().length >= 6
      ? null
      : "Password eng kamida 6 belgi bo'lishi kerak!",
  secret: (val: string) => (val.length ? null : "secret key bo'lishi kerak!"),
  username: (val: string) =>
    /^.{4,}$/.test(val) ? null : "Username kiritlishi shart!",
};
export const teacherValidate = {
  firstName: (value: string) =>
    value?.trim().length > 0 ? null : "Ismingizni to'ldiring!",
  secondName: (value: string) =>
    value?.trim().length > 0 ? null : "Familiyangizni to'ldiring!",
};

export const RoomCreateValidate = {
  name: (value: string) =>
    value.trim().length >= 3 ? null : "Eng kami 3 belgi bo'lishi kerak!",
  capacity: (value: number) =>
    value >= 5 && value <= 30 ? null : "Eng kami 5 ko'pi 30 bo'lishi kerak!",
};

export const updateNewStudentValidation = {
  fullName: (val: string) =>
    val.length < 3 ? "Ism 3 ta harfdan katta bo'lishi kerak!" : null,
  isAttend: (val: string) => (!val ? "Bu joy bo'sh bo'lmasligi kerak" : null),
  // reason: (val: string) => null,
};

export const paymentRefundValidation = {
  amount:(val:number)=>val < 10000 ? "Qiymat 10000 dan katta bo'lishi kerak!":null, 
}