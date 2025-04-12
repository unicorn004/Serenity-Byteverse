import { API_ROUTES } from "../routes/apiRoute";
import { getTokenFromCookie } from "../utils/get-token";


// Signup API call using fetch
export const register = async (data) => {
  try {
    // Send the POST request using fetch
    const response = await fetch(API_ROUTES.REGISTER(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set content type as JSON
      },
      body: JSON.stringify(data), // Convert JavaScript object to JSON string
    });

    // Check if the response status is not OK
    if (!response.ok) {
      // Extract error information and throw an error
      const errorData = await response.json();
      console.log(errorData);
      throw { response: { data: errorData } };
    }

    // Parse the JSON response
    const res = await response.json();
    console.log(res);

    return res;
  } catch (error) {
    throw error;
  }
};

export const login = async (data) => {
  try {
    const response = await fetch(API_ROUTES.LOGIN(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw { response: { data: errorData } };
    }

    const result = await response.json();
    console.log(result);
    
    return result;
  } catch (error) {
    throw error;
  }
};

// export const logout = async () => {
//   const token = getTokenFromCookie(); // Retrieve token from cookie
  
//   if (!token) {
//     throw new Error('Token is missing');
//   }

//   try {
//     const response = await fetch(API_ROUTES.LOGOUT, {
//       method: "POST",
//       headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw { response: { data: errorData } };
//     }

//     const result = await response.json();
//     console.log(result);

//     return result;
//   } catch (error) {
//     throw error;
//   }
// };

// Refresh token API call using axios
export const refreshToken = async (refreshToken) => {
  try {
    const response = await authAPI.post("/token/refresh", {
      refresh: refreshToken,
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : "Error occurred during token refresh";
  }
};

export default {
  register,
  login,
  refreshToken,
  // logout,
};

