import axios from "axios";
import { cookieVariables } from "./cookie-variables";

const logout = async ({
  cookie_variable,
  login_route,
}: {
  cookie_variable: string;
  login_route: string;
}) => {
  await axios.post("/api/auth/logout", { cookie_variable });
  window.location.href = login_route;
};

export const loginAdmin = async ({
  username,
  password,
  role,
}: {
  username: string;
  password: string;
  role: string;
}) => {
  const data = await axios.post("/api/auth/login-admin", {
    username,
    password,
    role,
  });
  localStorage.setItem("user-admin", JSON.stringify(data.data.user || null));
  return data;
};


export const loginStudent = async ({
  username,
  password,
  role,
}: {
  username: string;
  password: string;
  role: string;
}) => {
  const data = await axios.post("/api/auth/login-student", {
    username,
    password,
    role,
  });
  localStorage.setItem("user-student", JSON.stringify(data.data.user || null));
  return data;
};

export const loginBusiness = async ({
  username,
  password,
  role,
}: {
  username: string;
  password: string;
  role: string;
}) => {
  const data = await axios.post("/api/auth/login-store", {
    username,
    password,
    role,
  });
  localStorage.setItem("user-store", JSON.stringify(data.data.user || null));
  return data;
};

export const logoutAdmin = async () => {
  await logout({
    cookie_variable: cookieVariables.admin,
    login_route: "/login-admin",
  });
};

export const logoutStore = async () => {
  await logout({
    cookie_variable: cookieVariables.company,
    login_route: "/login-store",
  });
};


export const loginInstructor = async ({
    username,
    password,
    role
}: {
    username: string;
    password: string;
    role: string;
}) => {
    const data =  await axios.post('/api/auth/login-instructor', {
        username,
        password,
        role
    });
    localStorage.setItem("user-instructor", JSON.stringify(data.data.user || null))
    return data
}

export const logoutInstructor = async () => {
    await logout({
        cookie_variable :cookieVariables.instructor,
        login_route:'/login-instructor'
    })
}
