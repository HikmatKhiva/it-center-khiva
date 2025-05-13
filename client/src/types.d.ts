interface ILinks {
  id: number;
  link: string;
  label: string;
}

interface INewGroup {
  name: string;
  courseId: string;
  teacherId: string;
  price: number;
  duration: number;
  groupTime: string;
  // groupTime: {
  //   day: string;
  //   hour: string;
  // };
}
interface IStudentCreate {
  firstName: string;
  secondName: string;
  passportId: string;
  gender: string;
  courseId: number;
  groupId: number;
  phone: string;
}
interface IStudent extends IDefault {
  firstName: string;
  secondName: string;
  passportId: string;
  gender: string;
  courseId: number;
  code: string;
  groupId: number;
  certificate_url?: string;
  phone: null | string;
  debt: string;
  discount: string;
  Certificate: {
    id: number;
    certificateUrl: string;
  };
}
interface ISelect {
  value: string;
  label: string;
}
interface IGroup {
  id: number;
  name: string;
  isGroupFinished: boolean;
  teacher: ITeacher;
  course: ICourse;
  Students: [];
  price: number;
  duration: number;
  finishedDate: Date;
  groupTime: string;
  createdAt: Date;
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
}
interface IPayments extends IDefault {
  paymentDate: Date;
  amount: string;
  status: string;
  studentId: number;
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
}
interface IQueryStudent {
  isAttend: string;
  courseId: string;
  month: string;
  courseTime: string;
  limit: number;
  page: number;
}
interface IOpenedGroup {
  courseName: string;
  teacher: string;
  groupTime: string;
  admissionEnd: string;
}

interface IStats {
  active_students_count: string;
  active_groups_count: string;
  total_teachers_count: string;
  total_courses_count: string;
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
  isGroupFinished: boolean;
}
interface GroupQueryResponse {
  groups: IGroup[];
  totalPages: number;
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
  payments: IPayments[];
  student: IStudent;
  percentagePaid: number;
}

interface IDebtorsResponse extends IDefaultResponse {
  debtors: IDebtor[];
  currentMonth: string;
  count: number;
}

interface IDebtorQuery extends IDefaultQuery {
  month: string;
}

interface ICertificateResponse extends IDefaultResponse {
  students: ICertificateStudents[];
}
interface IReceptionResponse {
  receptions: IUserProfile[];
}
interface INewsResponse extends IDefaultResponse {
  news: INews[];
}
