import React, { ReactNode, ReactElement } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactElement;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: { componentStack: string } | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Log to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-gradient-to-br from-ramadan-50 to-ramadan-100 flex items-center justify-center p-4">
            <div className="card max-w-md w-full text-center space-y-4">
              <div className="text-6xl">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-900">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600">
                We apologize for the inconvenience. The app encountered an unexpected error.
              </p>

              {process.env.NODE_ENV !== 'production' && this.state.error && (
                <details className="text-left text-sm bg-red-50 p-3 rounded border border-red-200">
                  <summary className="font-semibold text-red-800 cursor-pointer">
                    Error Details (Dev Only)
                  </summary>
                  <pre className="mt-2 text-red-600 overflow-auto text-xs">
                    {this.state.error.toString()}
                    {'\n\n'}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={this.handleReset}
                  className="btn-primary flex-1"
                  aria-label="Try again"
                >
                  🔄 Try Again
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn-secondary flex-1"
                  aria-label="Go home"
                >
                  🏠 Home
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
