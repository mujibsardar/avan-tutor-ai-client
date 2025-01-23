# Avan Tutor AI - Client (React Frontend)

## Overview

This repository contains the React-based frontend for the Avan Tutor AI platform, a personalized AI-powered tutoring application. This frontend provides a user-friendly interface for interacting with the AI tutor, managing tutoring sessions, and viewing session history. It leverages AWS Amplify for authentication and integrates seamlessly with the backend API.

## Key Technologies and Skills Demonstrated:

*   **React.js:** Developed a responsive and interactive user interface using React.js, utilizing components, hooks, and state management to create a seamless user experience.
*   **AWS Amplify:** Integrated with AWS Amplify for user authentication (sign-in, sign-up, sign-out), providing a secure and scalable authentication solution.
*   **TypeScript:** Used TypeScript to write type-safe and maintainable code, improving code quality and reducing errors.
*   **React Hooks:** Leveraged React hooks (e.g., `useState`, `useEffect`) to manage component state and lifecycle, creating functional and reusable components.
*   **Axios:** Used Axios to make HTTP requests to the backend API, handling data fetching and submission.
*   **React Markdown:** Used React Markdown to render AI-generated responses formatted in Markdown, displaying code snippets, equations, and other formatted content.
*   **React Syntax Highlighter:** Integrated React Syntax Highlighter to display code snippets with syntax highlighting.
*   **Lottie Animations:** Used Lottie animations to provide visual feedback and enhance the user experience during loading states.
*   **Responsive Design:** Implemented a responsive design that adapts to different screen sizes, providing a consistent user experience across devices.
*   **Session Management:** Implemented session management features, allowing users to create, select, and delete tutoring sessions.
*   **UI Libraries:** Utilized UI libraries and components (e.g., `@aws-amplify/ui-react`) to create a visually appealing and consistent user interface.

## Key Features:

*   **User Authentication:** Secure user authentication using AWS Amplify (sign-in, sign-up, sign-out).
*   **Session Management:** Create, select, and delete tutoring sessions.
*   **AI Interaction:** Send questions and receive personalized responses from the AI tutor.
*   **History Display:** View and navigate through session history, including user prompts, AI responses, and search results.
*   **Code Syntax Highlighting:** Display code snippets with syntax highlighting for improved readability.
*   **File Upload:** Upload text files to the chat input using drag and drop.

## Setup and Installation

To run this frontend application locally:

1.  Ensure you have Node.js and npm installed.
2.  Clone the repository:

    ```bash
    git clone [YOUR_FRONTEND_REPO_URL]
    cd [YOUR_FRONTEND_DIRECTORY]
    ```

3.  Install dependencies:

    ```bash
    npm install
    ```

4.  Configure AWS Amplify:
    *   You'll need to configure AWS Amplify with the correct settings for your backend.  Typically, this involves creating an `amplify_outputs.json` file (or similar) with the necessary endpoint and authentication information. This file should *not* be committed to source control.

5.  Start the development server:

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:5173` (or a similar address).

## Interacting with the Backend

This frontend interacts with the backend API to:

*   Authenticate users.
*   Create, fetch, and delete tutoring sessions.
*   Send user prompts and receive AI-generated responses.

The backend API endpoints are configured in the `src/utils/api.ts` file.

## Author

*   **Avan Sardar** - A cloud-focused full-stack developer with a developing passion for AI, serverless technologies and bringing great ideas to life with technology and people.

## Contact

Feel free to contact me at **avansardar@outlook.com** for any questions or discussions related to this project.
