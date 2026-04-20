export const getStoredUser = () => {
    try {
        return JSON.parse(localStorage.getItem("userInfo") || "null");
    } catch {
        return null;
    }
};

export const setStoredUser = (user) => {
    localStorage.setItem("userInfo", JSON.stringify(user));
    window.dispatchEvent(new Event("user-auth-changed"));
};

export const clearStoredUser = () => {
    localStorage.removeItem("userInfo");
    window.dispatchEvent(new Event("user-auth-changed"));
};