import axios, { AxiosResponse } from "axios";
import { parseHistory } from "./fromAPI/parseHistory"; // Import the parseHistory function

const API_BASE_URL = "https://j41d2f5t31.execute-api.us-west-2.amazonaws.com/prod";


export interface HistoryItem {
  message: string;
  sender: "user" | "ai" | "system"; // Add "system" for potential system messages
  timestamp: string;
  score?: number; // Make score optional
  feedback?: string; // Make feedback optional
  promptSummary?: string; 
  confidence?: number; 
  concerns?: string[]; 
  sessionId?: string;
  index?: number;
}

// Define the type for AI response data
interface AIResponse {
  message: string;
  aiGuidance: string;
  updatedHistory: HistoryItem[];
}

// Define the type for the new session request payload
interface NewSessionRequest {
  studentId: string;
  sessionName: string;
}

export interface NewSessionResponse {
  sessionId: string;
  studentId: string;
  sessionName: string;
  uploadedFiles: unknown[]; // Or use unknown[] if structure isn't defined yet
  history: HistoryItem[];
  createdAt: string; // ISO timestamp for when the session was created
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
export const fetchAIResponse = async (inputText: string, sessionId: string): Promise<AIResponse> => {
  try {
    const response: AxiosResponse<AIResponse> = await axios.post(
      `${API_BASE_URL}/airesponse`,
      { input: inputText, sessionId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Parse and return the response with formatted history
    const aiResponse = response.data;
    aiResponse.updatedHistory = parseHistory(aiResponse.updatedHistory); // Parse the history

    return aiResponse;
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

    // Parse and return sessions with formatted history
    const sessions = response.data.sessions.map(session => ({
      ...session,
      history: parseHistory(session.history) // Parse the history for each session
    }));

    console.log("Sessions fetched successfully:", sessions);
    return { sessions };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching sessions:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
};

// Delete a session by sessionId
export const deleteSession = async (sessionId: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/sessions/${sessionId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Session deleted successfully:", sessionId);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error deleting session:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
};
