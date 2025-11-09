'use client';
import React from 'react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

interface ErrorBoundaryState {
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { error: null, errorInfo: null };

    static getDerivedStateFromError(error: Error) {
        return { error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught in boundary:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    retry = () => {
        this.setState({ error: null, errorInfo: null });
    };

    render() {
        if (this.state.error) {
            const FallbackComponent = this.props.fallback;

            if (FallbackComponent) {
                return <FallbackComponent error={this.state.error} retry={this.retry} />;
            }

            return (
                <div className="min-h-[200px] flex flex-col items-center justify-center p-6 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                            Something went wrong
                        </h3>
                        <p className="text-red-600 dark:text-red-300 mb-4">
                            {this.state.error.message || "An unexpected error occurred"}
                        </p>
                        <button
                            onClick={this.retry}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;