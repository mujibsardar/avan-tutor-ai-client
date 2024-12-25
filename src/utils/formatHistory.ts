export const formatHistory = (history: Array<{ message: string; sender: string; timestamp: string }>): string => {
    return history
      .map(({ message, sender, timestamp }) => {
        const senderName = sender === "ai" ? "AI" : sender === "user" ? "User" : "Unknown";
        return `${senderName} [${new Date(timestamp).toLocaleTimeString()}]:\n${message}\n`;
      })
      .join("\n\n");
  };