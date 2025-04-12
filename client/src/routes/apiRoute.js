const API_BASE_URL = "http://127.0.0.1:8000";

export const API_ROUTES = {

  REGISTER: (id) => `${API_BASE_URL}/api/register/`, // Signup to website
  LOGIN: (id) => `${API_BASE_URL}/api/login/`, // login to website
  REFRESH: (id) => `${API_BASE_URL}/api/token/refresh/`, // login to website

  GET_EMOTION: (id) => `${API_BASE_URL}/api/emotion/get_emotion/`, // get emotion probabilites
};
