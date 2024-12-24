import axios, { AxiosResponse } from "axios";

const API_BASE_URL = "https://j41d2f5t31.execute-api.us-west-2.amazonaws.com/prod";

// Define the type for AI response data
interface AIResponse {
  message: string;
  aiGuidance: string; // Adjust to match your API response structure
}

// Define the type for the new session request payload
interface NewSessionRequest {
  studentId: string;
  sessionName: string;
}

// Define the type for the new session response
export interface NewSessionResponse {
  sessionId: string;
  studentId: string;
  sessionName: string;
  uploadedFiles: any[]; // Adjust based on your schema
  history: any[]; // Adjust based on your schema
  createdAt: string;
}

// Define the type for fetching sessions
export interface FetchSessionsResponse {
  sessions: NewSessionResponse[]; // Array of session data
}

// Create a new session
export const createNewSession = async (
  newSession: NewSessionRequest
): Promise<NewSessionResponse> => {
  try {
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
      console.error(
        "Error creating new session:",
        error.message,
        error.response?.data
      );
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
};

// Fetch AI response based on input text
export const fetchAIResponse = async (inputText: string): Promise<AIResponse> => {
  try {
    const response: AxiosResponse<AIResponse> = await axios.post(
      `${API_BASE_URL}/airesponse`,
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

// Fetch all sessions for a specific user by studentId
export const fetchSessions = async (studentId: string): Promise<FetchSessionsResponse> => {
  try {
    const response: AxiosResponse<FetchSessionsResponse> = await axios.get(
      `${API_BASE_URL}/sessions`,
      {
        params: { studentId },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Sessions fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching sessions:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
};
