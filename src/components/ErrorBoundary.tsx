import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Viewer Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg p-8">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                Failed to load 3D model
              </h3>
              <p className="text-gray-600 text-sm">
                The model file may be corrupted, expired, or in an unsupported format.
              </p>
              <p className="text-gray-500 text-xs mt-4">
                {this.state.error?.message}
              </p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
