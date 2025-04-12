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
      } else {
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
    console.log(`Response to ${endpoint} is ${response}`);

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

// Get all assessments
export const getAssessments = async () => {
  return await apiCall(API_ROUTES.GET_ASSESSEMENTS(), "GET");
};

// Create user-assessment pair
export const postUserAssessment = async (assessmentId) => {
  const user = getUserFromCookie();
  return await apiCall(API_ROUTES.POST_USER_ASSESSEMENT(), "POST", {
    user: user.profile_id,
    assessment: assessmentId,
  });
};

// Get all questions for an assessment
export const getQuestions = async (assessmentId) => {
  return await apiCall(API_ROUTES.GET_QUESTIONS(assessmentId), "GET");
};

// Post user's answer for a question
export const postAnswer = async (questionId, answer) => {
  const user = getUserFromCookie();
  console.log("answer = ", answer);
  return await apiCall(API_ROUTES.POST_ANSWER(), "POST", {
    user: user.profile_id,
    question: questionId,
    response_text: answer,
  });
};

// Grade the assessment after the last question
export const gradeAssessment = async (assessmentId) => {
  const user = getUserFromCookie();
  return await apiCall(API_ROUTES.GRADE_ASSESSMENT(), "POST", {
    user_id: user.profile_id,
    assessment_id: assessmentId,
  });
};

// Assess user across top 5 assessments and update profile
export const assessUser = async () => {
  const user = getUserFromCookie();
  return await apiCall(API_ROUTES.ASSESS_USER(), "POST", {
    user: user.profile_id,
  });
};

// Get the aggregate assessment done for user
export const getAssessmentResult = async () => {
  return await apiCall(
    API_ROUTES.GET_ASSESSMENT_RESULT(),
    "GET"
  );
};


// Get the aggregate assessment done for user
export const getMedicalAssessmentResult = async (medicalAssessmentId) => {
  return await apiCall(
    API_ROUTES.GET_MEDICAL_PROFILE(medicalAssessmentId),
    "GET"
  );
};
