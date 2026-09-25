import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error in ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFF5EC] text-[#241416] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FCEBE9] border border-[#E8D9CC] flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-[#A8382B]" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-3 tracking-wide text-[#241416]">
            An Unexpected Interruption Occurred
          </h1>
          <p className="text-[#7E6568] max-w-md mb-8 text-sm leading-relaxed">
            Our dining application encountered a temporary discrepancy. Please refresh the page to restore your session.
          </p>
          <button
            onClick={this.handleReload}
            className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 rounded-xl bg-[#602E31] hover:bg-[#4D2326] text-[#FFF5EC] font-bold text-sm shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Reload Experience
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
