import React, { useEffect, useState } from 'react';
import { handleOAuthCallback, getCurrentUser } from '../services/oauthService';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const OAuthCallback: React.FC = () => {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Processing login...');

    useEffect(() => {
        const processCallback = async () => {
            try {
                // Get code and state from URL
                const params = new URLSearchParams(window.location.search);
                const code = params.get('code');
                const state = params.get('state');

                if (!code || !state) {
                    throw new Error('Missing authorization code or state');
                }

                setMessage('Exchanging authorization code...');

                // Exchange code for token
                const token = await handleOAuthCallback(code, state);

                setMessage('Fetching user details...');

                // Get user info
                const env = localStorage.getItem('oauth_env') || 'dev';
                const user = await getCurrentUser(token, env as any);

                console.log('Logged in as:', user.display_name);

                setStatus('success');
                setMessage(`Welcome, ${user.display_name}!`);

                // Redirect back to main app after 2 seconds
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);

            } catch (error: any) {
                console.error('OAuth callback error:', error);
                setStatus('error');
                setMessage(error.message || 'Login failed');

                // Redirect back after 5 seconds
                setTimeout(() => {
                    window.location.href = '/';
                }, 5000);
            }
        };

        processCallback();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 max-w-md w-full border border-slate-200 dark:border-slate-800">
                <div className="text-center">
                    {status === 'loading' && (
                        <>
                            <Loader2 className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4 animate-spin" />
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                                Logging you in...
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                {message}
                            </p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                                Success!
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                {message}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-500">
                                Redirecting you back...
                            </p>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <XCircle className="w-16 h-16 text-red-600 dark:text-red-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                                Login Failed
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                {message}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-500">
                                Redirecting back in 5 seconds...
                            </p>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                Go Back Now
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OAuthCallback;
