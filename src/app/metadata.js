'use client'


export const metadata = {
    title: "AI Chatbot",
    description: "A real-time AI chatbot interface.",
  };
  
  // The following is a wrapper component that can be used to override metadata in specific pages
  export const MetadataProvider = ({ children, title, description }) => {
    if (typeof document !== 'undefined') {
      document.title = title || metadata.title;
      document.querySelector('meta[name="description"]')?.setAttribute('content', description || metadata.description);
    }
    return children;
  };