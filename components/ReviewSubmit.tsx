import React, { useState } from 'react';
import { POIData, OsmEnvironment, SubmissionLog } from '../types';
import { submitToOsm } from '../services/osmService';
import { CheckCircle, MapPin, Building, Phone, Globe, Clock, Loader2, Send, ChevronDown, ChevronUp, Code2 } from 'lucide-react';
import RawPreview from './RawPreview';

interface ReviewSubmitProps {
    data: POIData;
    onBack: () => void;
}

const ReviewSubmit: React.FC<ReviewSubmitProps> = ({ data, onBack }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [token, setToken] = useState('');
    const [env, setEnv] = useState<OsmEnvironment>('dev');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [logs, setLogs] = useState<SubmissionLog[]>([]);

    // Load cached token
    React.useEffect(() => {
        const cachedToken = localStorage.getItem('osm_oauth_token');
        if (cachedToken) {
            setToken(cachedToken);
        }
    }, []);

    const addLog = (message: string, type: 'info' | 'success' | 'error') => {
        setLogs(prev => [...prev, { timestamp: new Date(), message, type }]);
    };

    const handleSubmit = async () => {
        if (!token) {
            alert("Please enter your OSM OAuth token first.");
            return;
        }

        setIsSubmitting(true);
        setLogs([]);

        try {
            await submitToOsm(token, env, data, addLog);
        } catch (e) {
            // Error logged via callback
        } finally {
            setIsSubmitting(false);
        }
    };

    const InfoRow = ({ label, value, icon: Icon }: { label: string, value: string | undefined, icon: any }) => {
        if (!value) return null;
        return (
            <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{label}</div>
                    <div className="text-sm text-slate-900 dark:text-slate-100 font-medium break-words">{value}</div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Review Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Review Your Submission</h2>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Please verify the information before submitting to OpenStreetMap</p>
                </div>

                <div className="p-6 space-y-4">
                    {/* Business Name */}
                    <div className="mb-4">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{data.tags.name || 'Unnamed Place'}</h3>
                        <p className="text-slate-500 dark:text-slate-400 capitalize">{data.tags.amenity?.replace('_', ' ') || 'No type specified'}</p>
                    </div>

                    {/* Key Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <InfoRow label="Location" value={`${data.lat.toFixed(6)}, ${data.lon.toFixed(6)}`} icon={MapPin} />
                        <InfoRow label="Type" value={data.tags.amenity} icon={Building} />
                        <InfoRow label="Cuisine" value={data.tags.cuisine} icon={Building} />
                        <InfoRow label="Phone" value={data.tags.phone} icon={Phone} />
                        <InfoRow label="Website" value={data.tags.website} icon={Globe} />
                        <InfoRow label="Opening Hours" value={data.tags.opening_hours} icon={Clock} />
                        <InfoRow label="Street" value={data.tags["addr:street"]} icon={MapPin} />
                        <InfoRow label="City" value={data.tags["addr:city"]} icon={MapPin} />
                        <InfoRow label="Wheelchair" value={data.tags.wheelchair} icon={CheckCircle} />
                    </div>
                </div>
            </div>

            {/* Submission Controls */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">Submit to OpenStreetMap</h3>

                {/* Environment Selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Environment</label>
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <button
                            onClick={() => setEnv('dev')}
                            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${env === 'dev'
                                    ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-slate-100'
                                    : 'text-slate-500 dark:text-slate-400'
                                }`}
                        >
                            Sandbox (Testing)
                        </button>
                        <button
                            onClick={() => setEnv('prod')}
                            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${env === 'prod'
                                    ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400'
                                }`}
                        >
                            Production (Live)
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                        {env === 'dev' ? '✅ Safe for testing' : '⚠️ Will modify real OSM data'}
                    </p>
                </div>

                {/* Token Input */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">OAuth Token</label>
                    <div className="flex gap-2">
                        <input
                            type="password"
                            value={token}
                            onChange={(e) => {
                                setToken(e.target.value);
                                if (e.target.value) {
                                    localStorage.setItem('osm_oauth_token', e.target.value);
                                }
                            }}
                            placeholder="Paste your OAuth token..."
                            className="flex-1 p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                        />
                        {token && (
                            <button
                                onClick={() => {
                                    setToken('');
                                    localStorage.removeItem('osm_oauth_token');
                                }}
                                className="px-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                        🔒 Securely cached on your device
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !token}
                    className={`w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${isSubmitting || !token
                            ? 'bg-slate-400 dark:bg-slate-600 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                        }`}
                >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {isSubmitting ? 'Submitting...' : `Submit to ${env === 'prod' ? 'Live Map' : 'Sandbox'}`}
                </button>

                {/* Logs */}
                {logs.length > 0 && (
                    <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm max-h-40 overflow-y-auto">
                        {logs.map((log, i) => (
                            <div key={i} className={`text-xs mb-1 ${log.type === 'error' ? 'text-red-400' :
                                    log.type === 'success' ? 'text-green-400' : 'text-blue-300'
                                }`}>
                                [{log.timestamp.toLocaleTimeString()}] {log.message}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Advanced/Developer Options */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        <span className="font-medium text-slate-700 dark:text-slate-300">Advanced: View Raw Data</span>
                    </div>
                    {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>

                {showAdvanced && (
                    <div className="p-6 border-t border-slate-100 dark:border-slate-800">
                        <RawPreview data={data} />
                    </div>
                )}
            </div>

            {/* Back Button */}
            <div className="flex justify-start">
                <button
                    onClick={onBack}
                    className="px-6 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    ← Back to Edit
                </button>
            </div>
        </div>
    );
};

export default ReviewSubmit;
