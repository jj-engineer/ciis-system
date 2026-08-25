import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Home, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[CIIS ErrorBoundary Caught Error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetAndReload = () => {
    try {
      if ('caches' in window) {
        caches.keys().then((keys) => {
          for (const key of keys) {
            caches.delete(key);
          }
        });
      }
      sessionStorage.clear();
      // Clear current user session but keep general mock data if needed
      localStorage.removeItem('ciis_current_user_live_v1');
    } catch (e) {
      console.error('Storage clear error:', e);
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 select-none font-sans">
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-900/20 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 w-full max-w-lg bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">
            {/* Header Badge */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-pink-950/60 border border-pink-700/50 flex items-center justify-center text-pink-400 shadow-lg shadow-pink-950/40">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold tracking-widest text-pink-400 uppercase">
                CIIS LMS • RECOVERY SHIELD
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                មានបញ្ហាបន្តិចបន្តួចក្នុងកម្មវិធី
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto">
                កម្មវិធីបានជួបប្រទះបញ្ហាមិនរំពឹងទុក។ សូមចុចប៊ូតុងខាងក្រោមដើម្បីដំណើរការឡើងវិញ។
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-800 via-pink-700 to-rose-600 hover:from-pink-700 hover:to-rose-500 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-pink-950/30 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>ផ្ទុកឡើងវិញ (Reload App)</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetAndReload}
                className="py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border border-zinc-700 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>ទំព័រដើម (Home)</span>
              </button>
            </div>

            {/* Developer Details Toggle */}
            {this.state.error && (
              <div className="pt-2 text-left">
                <button
                  type="button"
                  onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                  className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 underline cursor-pointer"
                >
                  {this.state.showDetails ? 'Hide technical details' : 'Show technical details'}
                </button>

                {this.state.showDetails && (
                  <pre className="mt-2 p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-[10px] font-mono text-rose-300 overflow-x-auto max-h-40 whitespace-pre-wrap">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="text-[10px] text-zinc-600 font-mono pt-2 border-t border-zinc-800/80">
              សាលារៀនអន្តរជាតិ សុី អាយ អាយ អេស (CIIS LMS)
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
