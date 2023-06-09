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

api.interceptors.response.use(
  function (response) {
    return response;
  }, 
  function (error) {
    if (error.response.status === 401) {
      sessionStorage['jwt'] = null;
      
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const getSchoolById = (schoolId: string) => api.get(`/School/GetSchoolById?schoolId=${schoolId}`);

const getDisciplineByTeacherId = (teacherId: string ) => api.get(`/Curriculum/GetDisciplineByTeacherId?teacherId=${teacherId}`);

const getAllSchools = () => api.get(`/School/GetAllSchools`);

const getAllActiveSchools = () => api.get(`/School/GetAllActiveSchools`);

const getAllUsers = () => api.get(`/Account/GetAllUsers`);

const getAllGrades = () => api.get(`/Grades/GetAllGrades`);

const getUserById = (userId: any) => api.get(`/Account/GetUserById/?userId=${userId}`)

const getLoggedUser = () => api.get("/Account/GetLoggedUser");

const getAllSchoolsClassess = () => api.get(`/SchoolClass/GetAllClassess`);

const getAllAttendances = () => api.get(`/Attendances/GetAllAttendances`);

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

const addChild = (parentId: string, firstName: string | undefined, lastName: string | undefined) =>
  api.put(`/Account/AddChild?parentId=${parentId}&childFirstName=${firstName}&childLastName=${lastName}`);

const changeSchool = (newSchool: string | undefined, userId: string) =>
  api.put(`/School/Update`, {
    name: newSchool,
    users: [
      {
        userId: userId,
        role: 4,
      },
    ],
  });

const enroll = (userId: string, schoolClassName: string | undefined) =>
  api.put(`/SchoolClass/EnrollForClass`, {
    studentId: userId,
    SchoolClassName: schoolClassName,
  });

const withdraw = (userId: string) => api.put(`/SchoolClass/WithdrawFromClass?studentId=${userId}`);

const createSchoolClass = (year: number, department: string | undefined, schoolName: string | undefined, teacherNames: string | undefined) =>
  api.post(`/SchoolClass/CreateClass`, {
    year: year,
    department: department,
    schoolName: schoolName,
    teacherNames: teacherNames,
  });

const createGrade = (studentUsername: string, rate: string | undefined, discipline: string | undefined) => {
  api.post("/Grades/Create",{
    studentUsername: studentUsername,
    number: rate,
    disciplineName: discipline
  })
}

const createAttendance = (studentUsername: string, date:string | undefined, hasAttended: boolean | null, discipline: string | undefined) => {
  api.post("/Attendances/Create", {
    studentUsername: studentUsername,
    hasAttended: hasAttended,
    date: date,
    disciplineName: discipline
  })
}

const updateGrade = (id: string, studentUsername: string, rate: string | undefined, discipline: string | undefined) => api.put("/Grades/Update",
{
    id: id,
    studentUsername: studentUsername,
    number: rate,
    disciplineName: discipline
})


const deleteGrade = (id: string | undefined) => api.delete(`/Grades/Delete/?id=${id}`);

const createCurricullum = (disciplines: Discipline[]) => api.post(`/Curriculum/Create`, disciplines);

const getClassessInSchool = (schoolId: string) => api.get(`/SchoolClass/GetClassessInSchool?schoolId=${schoolId}`);

const getPeopleInSchool = (schoolId: string) => api.get(`/School/GetPeopleInSchool?schoolId=${schoolId}`);

const getLoggedUserCurricullum = () => api.get(`/Curriculum/GetLoggedUserCurricullum`);

const getSchoolStatistics = () => api.get('/Statistics/GetSchoolStatistics')

const getClassesStatistics = () => api.get('/Statistics/GetClassStatistics')

const getTeachersStatistics = () => api.get('/Statistics/GetTeacherStatistics')

const deactivateSchool = (name: string) => api.delete(`/School/Deactivate?name=${name}`)

const activateSchool = (name: string) => api.put(`/School/Activate?name=${name}`)

const requests = {
  getSchoolById,
  getAllSchools,
  getAllActiveSchools,
  getAllUsers,
  getDisciplineByTeacherId,
  getAllGrades,
  getUserById,
  getAllSchoolsClassess,
  updateUser,
  getLoggedUser,
  createGrade,
  updateGrade,
  deleteGrade,
  createAttendance,
  addChild,
  changeSchool,
  enroll,
  withdraw,
  createSchoolClass,
  createCurricullum,
  getClassessInSchool,
  getPeopleInSchool,
  getLoggedUserCurricullum,
  getSchoolStatistics,
  getClassesStatistics,
  getTeachersStatistics,
  getAllAttendances,
  deleteSchool: deactivateSchool,
  activateSchool
};

export default requests;