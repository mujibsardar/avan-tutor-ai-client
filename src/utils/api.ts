import axios, { AxiosResponse } from "axios";

// Replace this with your actual API Gateway URL
// ORIGINAL 
// const API_BASE_URL = "https://4v56b6gpia.execute-api.us-west-2.amazonaws.com/prod";
// NEW
const API_BASE_URL = "https://57xsoxbzr0.execute-api.us-west-2.amazonaws.com/prod"; 

// Define the type of the expected response data for AI response
interface AIResponse {
  message: string; // Modify this based on the actual structure of your API's response
  aiGuidance: string; // Modify this based on the actual structure of your API's response
}

// Define the type of the expected response for file upload
// UNUSED
// interface FileUploadResponse {
//   message: string; // Adjust based on API response
//   s3Url?: string; // Optional URL if your Lambda uploads to S3
// }

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

// Upload file to the API
// UNUSED
// export const uploadFileToApi = async (formData: FormData): Promise<FileUploadResponse> => {
//   try {
//     const apiKey = import.meta.env.VITE_API_KEY;

//     const response: AxiosResponse<FileUploadResponse> = await axios.post(
//       `${API_BASE_URL}/upload`, // Adjust endpoint for file upload
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           "x-api-key": apiKey,
//         },
//       }
//     );
//     console.log("File upload response in api.ts:", JSON.stringify(response,null,2));
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error("Error uploading file:", error.message);
//     } else {
//       console.error("Unknown error:", error);
//     }
//     throw error;
//   }
// };

