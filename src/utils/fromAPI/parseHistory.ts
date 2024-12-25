// Define the type for a history item
export interface HistoryItem {
    message: string;
    sender: "user" | "ai";
    timestamp: string;
  }
  
  // The function now expects history to be of type 'any' or 'string' (could be parsed from JSON)
  export const parseHistory = (history: string | HistoryItem[]): HistoryItem[] => {
    try {
      // Check if history is already in the correct format (array of objects)
      if (Array.isArray(history)) {
        return history;
      }
  
      // If it's a string, try to parse it into an array
      if (typeof history === "string") {
        return JSON.parse(history);
      }
  
      // If history is neither an array nor a string, return an empty array
      return [];
    } catch (error) {
      console.error("Error parsing history:", error);
      return [];
    }
  };
  