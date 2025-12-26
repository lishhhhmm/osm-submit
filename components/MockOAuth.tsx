import React, { useState } from 'react';
import { CheckCircle, XCircle, User } from 'lucide-react';

interface MockOAuthProps {
    onClose: () => void;
    appState?: any;
}

const MockOAuth: React.FC<MockOAuthProps> = ({ onClose, appState }) => {
    const [selectedScenario, setSelectedScenario] = useState<string>('');

    const scenarios = [
        {
            id: 'success',
            name: 'Success - Login as TestUser',
            icon: CheckCircle,
            color: 'green',
            user: {
                id: 12345,
                display_name: 'TestUser',
                img: { href: '' }
            },
            token: 'mock_token_dev_12345'
        },
        {
            id: 'fail-invalid',
            name: 'Fail - Invalid Credentials',
            icon: XCircle,
            color: 'red',
            error: 'Invalid OAuth credentials'
        },
        {
            id: 'fail-denied',
            name: 'Fail - User Denied Access',
            icon: XCircle,
            color: 'red',
            error: 'User denied authorization'
        }
    ];

    const handleSelect = (scenario: any) => {
        setSelectedScenario(scenario.id);

        setTimeout(() => {
            // Save app state before navigation (same as real OAuth)
            if (appState) {
                localStorage.setItem('oauth_app_state', JSON.stringify(appState));
                console.log('Saved app state before mock OAuth callback');
            }

            if (scenario.user && scenario.token) {
                // Success scenario - store data for callback to retrieve
                localStorage.setItem('mock_oauth_user', JSON.stringify(scenario.user));
                localStorage.setItem('mock_oauth_token', scenario.token);
                localStorage.setItem('mock_oauth_success', 'true');

                // Navigate to callback page like real OAuth
                window.location.href = '/#/oauth/callback?code=mock_code&state=mock_state';
            } else {
                // Error scenario
                localStorage.setItem('mock_oauth_error', scenario.error);
                localStorage.setItem('mock_oauth_success', 'false');

                // Navigate to callback page with error
                window.location.href = '/#/oauth/callback?error=' + encodeURIComponent(scenario.error);
            }

            onClose();
        }, 500);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            🔧 Mock OAuth (Dev Only)
                        </h2>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Testing mode - Select a scenario to simulate OAuth login
                    </p>
                </div>

                <div className="space-y-3 mb-6">
                    {scenarios.map((scenario) => {
                        const Icon = scenario.icon;
                        const isSelected = selectedScenario === scenario.id;

                        return (
                            <button
                                key={scenario.id}
                                onClick={() => handleSelect(scenario)}
                                disabled={isSelected}
                                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${isSelected
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={`w-5 h-5 ${scenario.color === 'green'
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                        }`} />
                                    <div className="flex-1">
                                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                                            {scenario.name}
                                        </div>
                                        {isSelected && (
                                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                                Simulating...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-2 px-4 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    Cancel
                </button>

                <p className="mt-4 text-xs text-center text-amber-600 dark:text-amber-400">
                    ⚠️ Development mode only - Real OAuth will be used on production
                </p>
            </div>
        </div>
    );
};

export default MockOAuth;
