
export const getAccessToken = () =>
  localStorage.getItem("accessToken");

export const getRefreshToken = () =>
  localStorage.getItem("refreshToken");

export const clearAuthStorage = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
