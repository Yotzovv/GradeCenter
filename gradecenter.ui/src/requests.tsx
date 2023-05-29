import axios from "axios";
import { UserRoles } from "./models/aspNetUser";
import Discipline from "./models/discipline";

const api = axios.create({
  baseURL: "https://localhost:7273/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${sessionStorage["jwt"]}`,
  },
});

api.interceptors.request.use(
  (config) => {
    if (!sessionStorage["jwt"]) {
      window.location.href = "/login";
    }

    return config;
  },
  (error) => {
    window.location.href = "/login";
    return Promise.reject(error);
  }
);

const getSchoolById = (schoolId: string) => api.get(`/School/GetSchoolById?schoolId=${schoolId}`);

const getAllSchools = () => api.get(`/School/GetAllSchools`);

const getAllUsers = () => api.get(`/Account/GetAllUsers`);

const getAllSchoolsClassess = () => api.get(`/SchoolClass/GetAllClassess`);

const updateUser = (
  userId: string,
  newPassword?: string | null,
  newRole?: UserRoles | null,
  isActive?: boolean | null,
  newPhoneNumber?: string | null
) => {
  var url = `/Account/Update?userId=${userId}`;

  if(newPassword) {
    url += `&newPassword=${newPassword}`;
  }

  if(newRole) {
    url += `&newRole=${newRole}`;
  }
  
  if(isActive !== null && isActive !== undefined) {
    url += `&isActive=${isActive}`;
  }

  if(newPhoneNumber) {
    url += `&newPhoneNumber=${newPhoneNumber}`;
  }

  api.put(url);
};

const addChild = (parentId: string, firstName: string, lastName: string) =>
  api.put(`/Account/AddChild?parentId=${parentId}&childFirstName=${firstName}&childLastName=${lastName}`);

const changeSchool = (newSchool: string, userId: string) =>
  api.put(`/School/Update`, {
    name: newSchool,
    users: [
      {
        userId: userId,
        role: 4,
      },
    ],
  });

const enroll = (userId: string, schoolClassName: string) =>
  api.put(`/SchoolClass/EnrollForClass`, {
    studentId: userId,
    SchoolClassName: schoolClassName,
  });

const withdraw = (userId: string) => api.put(`/SchoolClass/WithdrawFromClass?studentId=${userId}`);

const createSchoolClass = (year: number, department: string, schoolName: string, teacherNames: string) =>
  api.post(`/SchoolClass/CreateClass`, {
    year: year,
    department: department,
    schoolName: schoolName,
    teacherNames: teacherNames,
  });

const createCurricullum = (disciplines: Discipline[]) => api.post(`/Curriculum/Create`, disciplines);

const getClassessInSchool = (schoolId: string) => api.get(`/SchoolClass/GetClassessInSchool?schoolId=${schoolId}`);

const getPeopleInSchool = (schoolId: string) => api.get(`/School/GetPeopleInSchool?schoolId=${schoolId}`);

const getLoggedUserCurricullum = () => api.get(`/Curriculum/GetLoggedUserCurricullum`);

const requests = {
  getSchoolById,
  getAllSchools,
  getAllUsers,
  getAllSchoolsClassess,
  updateUser,
  addChild,
  changeSchool,
  enroll,
  withdraw,
  createSchoolClass,
  createCurricullum,
  getClassessInSchool,
  getPeopleInSchool,
  getLoggedUserCurricullum,
};

export default requests;
