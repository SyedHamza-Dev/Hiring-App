export const checkAuth = () => sessionStorage.getItem("isLoggedIn") === "true";

export const login = (username: string, password: string) => {
  if (username === "admin" && password === "password") {
    sessionStorage.setItem("isLoggedIn", "true");
    return true;
  }
  return false;
};

export const logout = () => {
  sessionStorage.removeItem("isLoggedIn");
};
