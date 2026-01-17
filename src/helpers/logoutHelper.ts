let logoutFunction: (() => void) | null = null;

export const setLogoutFunction = (fn: () => void) => {
  logoutFunction = fn;
};

export const callLogoutFunction = () => {
  if (logoutFunction) {
    logoutFunction();
  } else {
    console.warn("Logout function not set.");
  }
};
