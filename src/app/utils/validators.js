export const validateMessage = (message) => {
    if (!message?.trim()) {
      return 'Message cannot be empty';
    }
    if (message.length > 2000) {
      return 'Message is too long (max 2000 characters)';
    }
    return null;
  };
  
  export const validateWebSocketMessage = (data) => {
    const requiredFields = ['type', 'content'];
    return requiredFields.every(field => field in data);
  };