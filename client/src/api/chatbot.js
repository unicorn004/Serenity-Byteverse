import { API_ROUTES } from "../routes/apiRoute";
import { getTokenFromCookie } from "../utils/get-token";
import { getUserFromCookie } from "../utils/get-user";

export const chatWithBot = async (message) => {
  try {
    const token = getTokenFromCookie(); // Get the auth token
    const user = getUserFromCookie(); // Get user data
    if (!user || !user.profile_id) {
      throw new Error("User profile ID not found.");
    }

    const requestBody = {
      user_id: user.profile_id,
      message: message,
    };

    const response = await fetch(API_ROUTES.CHATBOT(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Set Bearer token
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Chatbot API Error:", errorData);
      throw { response: { data: errorData } };
    }

    const res = await response.json();
    return res;
  } catch (error) {
    console.error("Chatbot request failed:", error);
    throw error;
  }
};
