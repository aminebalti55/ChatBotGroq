// src/components/shared/ErrorBoundary/index.jsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-destructive-50 dark:bg-destructive-900/20 rounded-lg">
          <AlertTriangle className="w-12 h-12 text-destructive-500 mb-4" />
          <h2 className="text-lg font-semibold text-deep-space-800 dark:text-deep-space-100 mb-2">
            Something went wrong
          </h2>
          <p className="text-deep-space-600 dark:text-deep-space-300 text-center">
            Please try refreshing the page
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;