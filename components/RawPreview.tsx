import React, { useState, useEffect, useRef } from 'react';
import { POIData, OsmEnvironment, SubmissionLog } from '../types';
import { generateOsmXml, generateOsmJson, submitToOsm } from '../services/osmService';
import { Copy, Check, Loader2, Send, Shield, Server, Terminal, ExternalLink } from 'lucide-react';

interface RawPreviewProps {
  data: POIData;
}

const RawPreview: React.FC<RawPreviewProps> = ({ data }) => {
  const [mode, setMode] = useState<'xml' | 'json'>('xml');
  const [copied, setCopied] = useState(false);

  // Submission State
  const [showSubmit, setShowSubmit] = useState(false);
  const [token, setToken] = useState('');
  const [env, setEnv] = useState<OsmEnvironment>('dev');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logs, setLogs] = useState<SubmissionLog[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const content = mode === 'xml' ? generateOsmXml(data) : generateOsmJson(data);

  // Load cached token from localStorage on mount
  useEffect(() => {
    const cachedToken = localStorage.getItem('osm_oauth_token');
    if (cachedToken) {
      setToken(cachedToken);
    }
  }, []);

  // Save token to localStorage when it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('osm_oauth_token', token);
    }
  }, [token]);

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addLog = (message: string, type: 'info' | 'success' | 'error') => {
    setLogs(prev => [...prev, { timestamp: new Date(), message, type }]);
  };

  const handleSubmit = async () => {
    if (!token) {
      addLog("Please enter a valid OAuth2 Access Token.", 'error');
      return;
    }

    setIsSubmitting(true);
    setLogs([]); // Clear previous logs

    try {
      await submitToOsm(token, env, data, addLog);
    } catch (e) {
      // Error is logged inside submitToOsm via callback
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1 transition-colors">
          <button
            onClick={() => setMode('xml')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'xml'
              ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
          >
            OSM XML
          </button>
          <button
            onClick={() => setMode('json')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'json'
              ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
          >
            JSON
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
      </div>

      {/* Code Viewer */}
      <div className="relative">
        <pre className="w-full bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed shadow-inner border border-slate-700 h-[300px]">
          <code>{content}</code>
        </pre>
      </div>

      {/* Submission Zone */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors duration-200">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Send className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            Submission API
          </h3>
          <button
            onClick={() => setShowSubmit(!showSubmit)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {showSubmit ? 'Hide' : 'Configure & Submit'}
          </button>
        </div>

        {showSubmit && (
          <div className="p-6 space-y-6">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200 text-sm rounded-lg border border-amber-100 dark:border-amber-900 flex items-start gap-3">
              <Shield className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Authentication Required</p>
                <p className="mt-1 opacity-90">
                  Submitting directly to the API requires a valid OAuth2 Access Token.
                  Do not paste tokens from untrusted sources.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <Server className="w-4 h-4" /> Environment
                </label>
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <button
                    onClick={() => setEnv('dev')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${env === 'dev'
                      ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-slate-100'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                  >
                    Sandbox (Dev)
                  </button>
                  <button
                    onClick={() => setEnv('prod')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${env === 'prod'
                      ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 shadow-sm ring-1 ring-red-100 dark:ring-red-900'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                  >
                    Production (Live)
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                  {env === 'dev' ? 'Safe for testing. Uses master.apis.dev.openstreetmap.org' : 'WARNING: Writes real data to openstreetmap.org'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  OAuth2 Access Token
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Paste your Bearer token here..."
                    className="flex-1 p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  />
                  {token && (
                    <button
                      onClick={() => {
                        setToken('');
                        localStorage.removeItem('osm_oauth_token');
                      }}
                      className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900 transition-colors"
                      title="Clear saved token"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                  🔒 Token is securely cached on your device. Only you can access it.
                </p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'bg-slate-400 dark:bg-slate-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                }`}
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {isSubmitting ? 'Processing...' : `Submit to ${env === 'prod' ? 'Live Map' : 'Sandbox'}`}
            </button>

            {/* Console Output */}
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm h-40 overflow-y-auto border border-slate-700">
              <div className="flex items-center gap-2 text-slate-400 mb-2 border-b border-slate-700 pb-2">
                <Terminal className="w-4 h-4" />
                <span>Console Output</span>
              </div>
              {logs.length === 0 && (
                <span className="text-slate-600 italic">Ready to submit...</span>
              )}
              <div className="space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className={`flex items-start gap-2 ${log.type === 'error' ? 'text-red-400' :
                    log.type === 'success' ? 'text-green-400' : 'text-blue-300'
                    }`}>
                    <span className="text-slate-500 text-xs mt-0.5 select-none">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                    <span>{log.message}</span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>
          </div>
        )}
      </div>

      {!showSubmit && (
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900 text-sm text-blue-800 dark:text-blue-200">
          <h4 className="font-semibold mb-1 flex items-center gap-2">
            Manual Submission
            <ExternalLink className="w-3 h-3" />
          </h4>
          <p className="opacity-90">
            Don't have a token? Save the XML above as a <code>.osc</code> file and open it in JOSM.
          </p>
        </div>
      )}
    </div>
  );
};

export default RawPreview;