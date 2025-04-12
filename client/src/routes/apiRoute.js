const API_BASE_URL = "http://127.0.0.1:8000";

export const API_ROUTES = {
  REGISTER: (id) => `${API_BASE_URL}/api/register/`, // Signup to website
  LOGIN: (id) => `${API_BASE_URL}/api/login/`, // login to website
  REFRESH: (id) => `${API_BASE_URL}/api/token/refresh/`, // login to website

  GET_EMOTION: (id) => `${API_BASE_URL}/api/emotion/get_emotion/`, // get emotion probabilites
  CHATBOT: (id) => `${API_BASE_URL}/chatbot/chat/`, // chat with chatbot

  GET_ASSESSEMENTS: (id) => `${API_BASE_URL}/assessment/assessments/`, // get all the assessments in db
  POST_USER_ASSESSEMENT: (id) => `${API_BASE_URL}/assessment/user_assessments/`, // creates user, assessment id pair
  GET_QUESTIONS: (id) =>
    `${API_BASE_URL}/assessment/questions/?assessment=${id}`, // get all questions for an assessment
  POST_ANSWER: (id) => `${API_BASE_URL}/assessment/responses/`, // post the user response for a question in assessment
  GRADE_ASSESSMENT: (id) => `${API_BASE_URL}/assessment/grade/`, // post this after the last question is answered
  ASSESS_USER: (id) => `${API_BASE_URL}/assessment/assess_medical/`, // review user accross top 5 assessments // updates the profile
  GET_ASSESSMENT_RESULT: (userAssessmentId) => `${API_BASE_URL}/assessment/user_assessments/`, // without userassessment id it gets all assessments
  GET_MEDICAL_PROFILE: (medicalAssessmentId) => `${API_BASE_URL}/api/medical-profile/${medicalAssessmentId}/`, // here goes medical assessment id

  CREATE_DIARY: (id) => `${API_BASE_URL}/api/diary/create/`, // post content of diary to db 
};
