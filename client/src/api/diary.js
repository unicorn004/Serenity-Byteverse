import { API_ROUTES } from "../routes/apiRoute";
import { getTokenFromCookie } from "../utils/get-token";
import { getUserFromCookie } from "../utils/get-user";

/**
 * A reusable function to make API calls
 * @param {string} endpoint - The API endpoint to call (from API_ROUTES)
 * @param {string} method - HTTP method ('GET', 'POST', etc.)
 * @param {object} body - Request body (for POST, PUT, etc.), optional
 * @param {boolean} authRequired - Whether to include Authorization header, default is true
 * @returns {Promise<object>} - The API response JSON
 */
const apiCall = async (
  endpoint,
  method = "GET",
  body = null,
  authRequired = true
) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    // If authentication is required, include the bearer token
    if (authRequired) {
      const token = getTokenFromCookie();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      else{
        console.log("Error Access token not found");
        return;
      }
    }

    const options = {
      method,
      headers,
    };

    // Add the request body if it's not a GET request
    if (body && method !== "GET") {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(endpoint, options);
    console.log(`Response to ${endpoint} is ${response}`)

    // Check for errors
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API request failed");
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in API call to ${endpoint}:`, error.message);
    throw error;
  }
};

// Create user-assessment pair
export const createDiary = async (content) => { 
  return await apiCall(API_ROUTES.CREATE_DIARY(), "POST", {
    entry_text : content
  });
};