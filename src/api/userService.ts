import { privateApi } from "./auth";

// API function to fetch user role report
export const getUserRoleReport = async () => {
  try {
    const response = await privateApi.get("/accounts/user-role-report/");
    return response.data;
  } catch (error) {
    console.error("Error fetching user role report:", error);
    throw error;
  }
};

// API function to fetch recently registered users
export const getRecentlyRegisteredUsers = async () => {
  try {
    const response = await privateApi.get(
      "/accounts/recently-registered-users/"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching recently registered users:", error);
    throw error;
  }
};

// API function to fetch active vs inactive users
export const getActiveInactiveUsersReport = async () => {
  try {
    const response = await privateApi.get(
      "/accounts/active-inactive-users-report/"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching active vs inactive users report:", error);
    throw error;
  }
};
