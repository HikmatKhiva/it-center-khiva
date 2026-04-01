interface ILinks {
  id: number;
  link: string;
  label: string;
}
interface IRoomForm {
  name: string;
  capacity: number;
}

interface INewGroup {
  name: string;
  courseId: string;
  teacherId: string;
  price: number;
  duration: number;
  schedules: {
    weekType: string;
    time: string;
    roomId: string | number;
  };
}
interface IUpdateGroup {
  teacherId: string;
  schedules: {
    weekType: string;
    time: string;
    roomId: string | number;
  };
}
interface ISlotsResponse {
  slots: ISelect[];
}
interface IStudentCreate {
  firstName: string;
  secondName: string;
  passportId: string;
  issueAt: null | Date;
  gender: string;
  address: string;
  courseId: number;
  groupId: number;
  phone: string;
  docType: "PASSPORT" | "BIRTHCERTIFICATE";
  guarantor: IGuarantorCreate;
}
interface IGuarantorCreate {
  firstName: string;
  secondName: string;
  phone: string;
  passportId: string;
  issueAt: null | Date | string;
}
interface IGuarantor {
  id: number;
  firstName: string;
  secondName: string;
  phone: string;
  passportId: string;
  issueAt:  Date | string ;
  // studentId: number;
}
interface IStudent extends IDefault {
  firstName: string;
  secondName: string;
  passportId: string;
  gender: string;
  courseId: number;
  address: string;
  code: string;
  groupId: number;
  certificate_url?: string;
  issueAt: null | Date;
  phone: null | string;
  debt: string;
  discount: string;
  docType: "PASSPORT" | "BIRTHCERTIFICATE";
  Certificate: {
    id: number;
    certificateUrl: string;
  };
  Group: {
    duration: number;

    startTime: null | Date;
  };
  guarantor: IGuarantor;
}
interface IStudents extends IDefault {
  firstName: string;
  secondName: string;
  code: string;
  passportId: string;
  finishedDate: Date | null;
  guarantor: IGuarantor;
  debt: string;
  Group: {
    name: string;
    isActive: "PENDING" | "ACTIVE" | "FINISHED";
  };
  course: {
    name: string;
    teacher: {
      firstName: string;
      secondName: string;
    };
  };
}
interface IAllStudentsResponse {
  students: IStudents[];
  totalPages: number;
}
interface ISelect {
  value: string;
  label: string;
}
interface IGroup {
  id: number;
  name: string;
  teacher: ITeacher;
  course: ICourse;
  Students: [];
  price: number;
  duration: number;
  finishedDate: Date;
  groupTime: string;
  createdAt: Date;
  startTime: Date | null;
  price: string;
  isActive: "PENDING" | "ACTIVE" | "FINISHED";
  schedules: [
    {
      id: number;
      weekType: string;
      time: string;
      roomId: number;
      groupId: number;
    },
  ];
}
interface IGroupResponse {
  id: number;
  name: string;
  teacher: ITeacher;
  course: ICourse;
  Students: [];
  price: number;
  duration: number;
  finishedDate: Date;
  groupTime: string;
  createdAt: Date;
  startTime: Date | null;
  price: string;
  isActive: "PENDING" | "ACTIVE" | "FINISHED";
  schedules: [
    {
      id: number;
      weekType: string;
      time: string;
      roomId: number;
      groupId: number;
    },
  ];
  totalPages: number;
}
interface IGroupActivate {
  startTime: Date;
  finishedDate: Date;
}

interface INewCourse {
  name: string;
  teacherId: string;
  nameCertificate: string;
}

interface ITeacherForm {
  id: string;
  firstName: string;
  secondName: string;
  photo_url?: string;
  image: null | File;
  phone: string;
}

interface CreateCardProps {
  newsCard: INewsCard;
  photo: string;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}
interface INewsCard {
  title: string;
  description: string;
  image: File | null;
}

interface INewPayment {
  studentId: number;
  amount: number;
  paymentDate: Date;
}
interface IPayments extends IDefault {
  paymentDate: Date;
  amount: string;
  status: string;
  studentId: number;
  isRefunded: boolean;
  refundedAt: Date;
  createdBy: {
    username: string;
    role: string;
  };
}
interface IRefund {
  id: number;
  paymentId: number;
  amount: string;
  createdAt: Date;
  reason: string;
  cancelledBy: {
    role: string;
  };
}
interface INewStudentCreate {
  fullName: string;
  phone: string;
  courseId: string;
  courseTime: string;
}
interface IAddStudents {
  id: number;
  full_name: string;
  phone: string;
  course_time: string;
  course_name: string;
  created_at: string;
  is_attend: string;
}
interface INewStudent extends INewStudentCreate, IDefault {
  course: ICourse;
  isAttend: string;
  reason: null | string;
}
interface IQueryStudent {
  isAttend: string;
  courseId: string;
  month: string;
  courseTime: string;
  limit: number;
  page: number;
  year: string;
}
interface IOpenedGroup {
  courseName: string;
  teacher: string;
  groupTime: string;
  admissionEnd: string;
  weekType: string;
  room: string;
}

interface IStats {
  stat: string;
  yearFilter: number;
  activeStudents: number;
  activeGroups: number;
  totalTeachers: number;
  totalCourses: number;
  totalMaleStudents: number;
  totalFemaleStudents: number;
  totalStudents: number;
  finishedStudents: number;
  totalFinishedMaleStudents: number;
  totalFinishedFemaleStudents: number;
  finishedGroups: number;
  totalDebtors: number;
  totalNewstudentNOT_CAME: number;
  totalNewstudentCAME: number;
  totalNewstudent: number;
  totalNewstudentPENDING: number;
}
interface IPaymentRefund {
  amount: number;
  reason: string;
}
interface IYearly {
  month: string;
  expectedIncome: number;
  paidThisMonth: number;
  percentage: number;
}
interface INews {
  id: number;
  slug: string;
  photo_url: string;
  title: string;
  description: string;
  content: string;
  created_at: string;
  created_time: string | null;
  createdAt: Date;
}

interface IAnonymMessage {
  fullName: string;
  message: string;
}

interface IMessage {
  id: number;
  fullName: string;
  message: string;
  createdAt: Date;
}
interface IUserLogin {
  username: string;
  password: string;
}
interface I2FAData {
  token: string;
  username: string;
}

interface InitialStateAdmin {
  admin: null | IAdmin;
}
interface IAdmin {
  id: number;
  token: string;
  role: string;
  expirationTime: number;
}
interface IUserProfile {
  id: number;
  username: string;
  photo_url: null | string;
  role: string;
  secret: string;
  username: string;
  isActive: boolean;
}
interface IUserUpdate {
  id: number;
  username: string;
  secret: string;
  password: string;
}
interface IDefault {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}
interface ICourse extends IDefault {
  name: string;
  teacher: ITeacher;
  nameCertificate: string;
}
interface ICourseResponse extends IDefault {
  name: string;
  nameCertificate: string;
  teacherId: number;
}
interface ITeacher extends IDefault {
  firstName: string;
  secondName: string;
  photo_url: string;
  phone: null | string;
}
interface ICertificateStudents {
  id: number;
  firstName: string;
  secondName: string;
  passportId: string;
  code: string;
  finishedDate: Date;
  Certificate: {
    id: number;
    certificateUrl: string;
  };
  course: {
    id: number;
    name: string;
    teacher: {
      firstName: string;
      secondName: string;
    };
  };
  Group: {
    finishedDate: Date;
  };
}

interface IDebtor {
  id: number;
  fullName: string;
  passportId: string;
  groupPrice: string;
  groupName: string;
  courseName: string;
  teacherName: string;
  debt: string;
  lastPaymentDate: string;
  totalPaidThisMonth: number;
  createdAt: Date;
}

interface IUserRegister {
  username: string;
  password: string;
  secret: string;
  role: string;
}
interface IGroupQuery {
  name: string;
  page: number;
  limit: number;
}
interface GroupQueryResponse {
  groups: IGroup[];
  totalPages: number;
}
interface ISchedules {
  name: string;
  time: string;
  weekType: string;
  teacher: string;
  countStudents: number;
  isActive: "PENDING" | "ACTIVE" | "FINISHED";
}
interface RoomsQueryResponse {
  rooms: IRoom[];
  totalPages: number;
  totalCount: number;
}
interface IRoom {
  id: number;
  name: string;
  capacity: number;
  schedules: {
    ODD: {
      time: string[];
    };
    EVEN: {
      time: string[];
    };
  };
}
interface RoomQueryResponse {
  id: number;
  name: string;
  capacity?: number;
  schedules: ISchedules[];
}
interface IRoomCreate {
  name: string;
  capacity: number;
}
interface IDefaultQuery {
  name: string;
  page: number;
  limit: number;
}
interface IDefaultResponse {
  totalPages: number;
}
interface ITeacherResponse extends IDefaultResponse {
  teachers: ITeacher[];
}
interface ICoursesResponse extends IDefaultResponse {
  courses: ICourse[];
}
interface IMessagesResponse extends IDefaultResponse {
  messages: IMessage[];
  totalCount: number;
}
interface INewStudentResponse extends IDefaultResponse {
  students: INewStudent[];
  countNewStudents: number;
}
interface IMessageResponse {
  message: string;
}
interface I2FAResponse {
  message: string;
  user: IAdmin;
}
interface ILoginResponse {
  message: string;
  username: string;
}
interface IStudentsResponse extends IDefaultResponse {
  students: IStudent[];
}

interface IPaymentsResponse {
  monthlyPrice: number;
  payments: IPayments[];
  student: IStudent;
  percentagePaid: number;
  monthly: IPaymentMonthly[];
}
interface ITeacherChartResponse {
  teacherName: string;
  month: number;
  totalPaid: number;
  totalSalary: number;
  expectedSalary: number;
  totalAmount: number;
}

interface IPaymentMonthly {
  month: string;
  payment: string;
  paid: number;
  percentage: number;
}
interface IDebtorsResponse extends IDefaultResponse {
  debtors: IDebtor[];
  currentMonth: string;
  count: number;
}

interface IDebtorQuery extends IDefaultQuery {
  month: string;
  year: string;
  orderBy: "asc" | "desc";
}

interface IRoomQuery {
  weekType: string;
  time: string;
}
interface ICertificateResponse extends IDefaultResponse {
  students: ICertificateStudents[];
  totalCount: number;
}
interface IReceptionResponse {
  receptions: IUserProfile[];
}
interface INewsResponse extends IDefaultResponse {
  news: INews[];
}

interface IMemory {
  totalMB: number;
  usedMB: number;
  freeMB: number;
  totalGB: number;
}
interface IMetricsResponse {
  memory: IMemory;
}

interface INewStudentUpdate {
  courseId: string;
  fullName: string;
  isAttend: string;
  reason: string;
}

interface IReceipt {
  id: 1;
  issuedAt: Date;
  receiptNo: string;
  status: string;
  amount: string;
  publicToken: string;
  cancelledAt: Date | null;
  student: {
    firstName: string;
    secondName: string;
    course: {
      name: string;
    };
  };
}

interface ISelectedPayment {
  id: number;
  amount: number;
  confirmedStatus: "PENDING" | "CONFIRMED";
}

interface IAdminPayment {
  id: number;
  studentId: number;
  amount: number;
  paymentDate: Date;
  confirmedAt: null;
  confirmedStatus: "PENDING" | "CONFIRMED";
  fullName: string;
  groupName: string;
  courseName: string;
  teacherName: string;
}
interface IAdminPaymentResponse {
  payments: IAdminPayment[];
  totalPages: number;
}