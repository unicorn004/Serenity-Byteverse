const API_BASE_URL = "http://127.0.0.1:8000";

export const API_ROUTES = {
  // emotion
  GET_EMOTION: (id) => `${API_BASE_URL}/api/emotion/get_emotion/`, // get emotion probabilites
};
