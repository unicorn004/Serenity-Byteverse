export const getUserFromCookie = () => {
  const user = document.cookie
    .split("; ")
    .find((row) => row.startsWith("user="));

  if (user) {
    const encodedData = user.split("=")[1]; // Extract the encoded value
    try {
      const decodedData = decodeURIComponent(encodedData); // Decode URL encoding
      return JSON.parse(decodedData); // Parse JSON directly
    } catch (error) {
      console.error("Error decoding user data:", error);
      return null;
    }
  }
  return null; // Return null if no valid token found
};

