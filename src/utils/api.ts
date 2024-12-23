import axios, { AxiosResponse } from "axios";
const API_BASE_URL = "https://j41d2f5t31.execute-api.us-west-2.amazonaws.com/prod"; 

// Define the type of the expected response data for AI response
interface AIResponse {
  message: string; // Modify this based on the actual structure of your API's response
  aiGuidance: string; // Modify this based on the actual structure of your API's response
}

// Define the type for the new session request payload
interface NewSessionRequest {
  studentId: string;
  sessionName: string;
}

// Define the type for the expected response data
interface NewSessionResponse {
  sessionId: string;
  studentId: string;
  sessionName: string;
  uploadedFiles: any[]; // Update this based on your schema if necessary
  history: any[]; // Update this based on your schema if necessary
  createdAt: string;
}

// Create a new session
export const createNewSession = async (newSession: NewSessionRequest): Promise<NewSessionResponse> => {
  try {
    // Make a POST request to the sessions endpoint
    const response: AxiosResponse<NewSessionResponse> = await axios.post(
      `${API_BASE_URL}/sessions`,
      newSession,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("New session created successfully:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating new session:", error.message, error.response?.data);
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
};

// Fetch AI response based on input text
export const fetchAIResponse = async (inputText: string): Promise<AIResponse> => {
  try {
    // Get the API key from the environment variables
    // const apiKey = import.meta.env.VITE_API_KEY;

    const response: AxiosResponse<AIResponse> = await axios.post(
      `${API_BASE_URL}/airesponse`, // Adjust endpoint for AI response
      { input: inputText },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching AI response:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
};


