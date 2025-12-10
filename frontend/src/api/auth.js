import axios from "./axios";

export const logoutUser = async () => {
  try {
    await axios.post("/auth/logout/");
    return true;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
};
