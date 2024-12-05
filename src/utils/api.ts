import axios, { AxiosResponse } from "axios";

const API_BASE_URL = "https://zq1588s5g3.execute-api.us-west-2.amazonaws.com/dev/interact"; // Replace with your API Gateway URL

// Define the type of the expected response data
interface AIResponse {
  message: string; // Modify this based on the actual structure of your API's response
  aiGuidance: string; // Modify this based on the actual structure of your API's response
}

// Type the inputText parameter and the return type of the function
export const fetchAIResponse = async (inputText: string): Promise<AIResponse> => {
  try {
    // Get the API key from the environment variables
    const apiKey = import.meta.env.VITE_API_KEY;
    
    // Make the API call and specify the response type
    const response: AxiosResponse<AIResponse> = await axios.post(
      `${API_BASE_URL}`,
      {
        input: inputText,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey, // Include the API key in the request headers
        },
      }
    );

    // Return the response data
    return response.data;
  } catch (error) {
    // Handle error types properly
    if (axios.isAxiosError(error)) {
      console.error("Error fetching AI response:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
};
