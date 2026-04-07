import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled React error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--color-bg-primary)' }}>
          <div className="max-w-md w-full rounded-2xl p-6 text-center" style={{ border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}>
            <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-400 mb-4">An unexpected error occurred while rendering this page.</p>
            <button
              onClick={this.handleReload}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}