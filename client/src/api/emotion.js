import { API_ROUTES } from "../routes/apiRoute";

const fetchAPI = async (
  url,
  method = "GET",
  body = null,
  isFormData = false
) => {
  try {
    const options = {
      method,
      headers: isFormData
        ? {} // Do not set Content-Type for FormData; fetch will handle it
        : { "Content-Type": "application/json" },
    };

    if (body) options.body = body; // FormData should not be stringified

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw { response: { data: errorData } };
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const get_emotion = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile); // "image" should match your Django backend field name

  return fetchAPI(API_ROUTES.GET_EMOTION(), "POST", formData, true);
};
