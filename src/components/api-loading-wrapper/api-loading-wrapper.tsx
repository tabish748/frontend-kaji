import React from 'react';
import Loader from "@/components/loader/loader";
import Button from "@/components/button/button";

interface ApiLoadingWrapperProps {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  retryText?: string;
  errorTitle?: string;
  loadingMinHeight?: string;
  children: React.ReactNode;
}

const ApiLoadingWrapper: React.FC<ApiLoadingWrapperProps> = ({
  loading = false,
  error = null,
  onRetry,
  retryText = "Retry",
  errorTitle = "Error loading data",
  loadingMinHeight = "400px",
  children
}) => {
  // Show loading state
  if (loading) {
    return (
      <div 
        className="d-flex justify-content-center align-items-center" 
        style={{ minHeight: loadingMinHeight }}
      >
        <Loader />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div 
        className="d-flex justify-content-center flex-column gap-2 align-items-center text-center" 
        style={{ minHeight: loadingMinHeight }}
      >
          <h3>{errorTitle}</h3>
          <p>{error}</p>
          {onRetry && (
            <Button 
              type="primary" 
              text={retryText} 
              onClick={onRetry}
            />
          )}
      </div>
    );
  }

  // Show content when loaded successfully
  return <>{children}</>;
};

export default ApiLoadingWrapper; 