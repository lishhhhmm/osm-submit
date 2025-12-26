import React, { useState, useEffect } from 'react';
import { User, LogOut, LogIn, Loader2 } from 'lucide-react';
import { startOAuthLogin, logout, isLoggedIn, getCurrentUser, getStoredToken, getStoredEnv } from '../services/oauthService';
import { OsmEnvironment } from '../types';

interface UserInfoProps {
    env: OsmEnvironment;
    onEnvChange: (env: OsmEnvironment) => void;
    appState?: any;
}

const UserInfo: React.FC<UserInfoProps> = ({ env, onEnvChange, appState }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn());
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            if (isAuthenticated) {
                setLoading(true);
                try {
                    const token = getStoredToken();
                    const storedEnv = getStoredEnv();
                    if (token) {
                        const userData = await getCurrentUser(token, storedEnv);
                        setUser(userData);
                        // Sync environment
                        onEnvChange(storedEnv);
                    }
                } catch (error) {
                    console.error('Failed to load user:', error);
                    // Token might be invalid
                    handleLogout();
                } finally {
                    setLoading(false);
                }
            }
        };

        loadUser();
    }, [isAuthenticated]);

    const handleLogin = async () => {
        // Save app state before redirecting to OAuth
        await startOAuthLogin(env, appState);
    };

    const handleLogout = () => {
        logout();
        setIsAuthenticated(false);
        setUser(null);
    };

    if (loading) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Loading...</span>
            </div>
        );
    }

    if (isAuthenticated && user) {
        return (
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 flex-1">
                    {user.img?.href ? (
                        <img
                            src={user.img.href}
                            alt={user.display_name}
                            className="w-8 h-8 rounded-full border-2 border-blue-300 dark:border-blue-700"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {user.display_name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {env === 'dev' ? 'Sandbox' : 'Production'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-950/20 rounded-lg transition-colors group"
                    title="Logout"
                >
                    <LogOut className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleLogin}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
            <LogIn className="w-4 h-4" />
            <span className="font-medium">Login with OSM</span>
        </button>
    );
};

export default UserInfo;
