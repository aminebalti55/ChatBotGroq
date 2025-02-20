export const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  export const formatChatTitle = (messages) => {
    if (!messages.length) return 'New Chat';
    return messages[0].content.slice(0, 30) + '...';
  };