export const navLinks: ILinks[] = [
  { id: 1, link: "/news", label: "Yangiliklar" },
  { id: 2, link: "/contact", label: "Bog'lanish" },
];
export const selectMonths: { label: string; value: string }[] = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];
// Use this type if you want strong typing (optional)
export type CourseTimeGroup = {
  group: string;
  items: { label: string; value: string }[];
};
export const courseTimes: CourseTimeGroup[] = [
  {
    group: "Toq kunlari",
    items: [
      { value: "Toq 9:00", label: "9:00" },
      { value: "Toq 11:00", label: "11:00" },
      { value: "Toq 14:00", label: "14:00" },
      { value: "Toq 16:00", label: "16:00" },
      { value: "Toq muhim emas", label: "Muhim emas." },
    ],
  },
  {
    group: "Juft kunlari",
    items: [
      { value: "Juft 9:00", label: "9:00" },
      { value: "Juft 11:00", label: "11:00" },
      { value: "Juft 14:00", label: "14:00" },
      { value: "Juft 16:00", label: "16:00" },
      { value: "Juft muhim emas", label: "Muhim emas." },
    ],
  },
];

export const attends = [
  { label: "Kelmaydigan O'quvchilar", value: "reject" },
  { label: "Keladigan O'quvchilar", value: "success" },
  { label: "Telefon qilinmagan", value: "pending" },
];
export const weeks = [
  "Dushanba",
  "Seshanba",
  "Chorshanba",
  "Payshanba",
  "Juma",
  "Shanba",
];
export const workHours = ["9:00", "11:00", "14:00", "16:00", "18:00"];
export const discounts = [
  { value: "0", label: "0%" },
  { value: "5", label: "5%" },
  { value: "10", label: "10%" },
];
