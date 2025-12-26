import React, { useState } from 'react';
import { POIData } from '../types';
import { generateOsmXml, generateOsmJson } from '../services/osmService';
import { Copy, Check } from 'lucide-react';

interface RawPreviewProps {
  data: POIData;
}

const RawPreview: React.FC<RawPreviewProps> = ({ data }) => {
  const [mode, setMode] = useState<'xml' | 'json'>('xml');
  const [copied, setCopied] = useState(false);

  const content = mode === 'xml' ? generateOsmXml(data) : generateOsmJson(data);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Format Selector */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('xml')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'xml'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
          >
            OSM XML
          </button>
          <button
            onClick={() => setMode('json')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'json'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
          >
            JSON
          </button>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-600 dark:text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="text-sm">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Preview */}
      <div className="relative">
        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-96 overflow-y-auto border border-slate-700">
          <code>{content}</code>
        </pre>
      </div>

      {/* Format Info */}
      <div className="text-xs text-slate-500 dark:text-slate-400">
        {mode === 'xml' ? (
          <p>
            This XML format is compliant with the{' '}
            <a
              href="https://wiki.openstreetmap.org/wiki/API_v0.6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              OSM API v0.6
            </a>{' '}
            specification.
          </p>
        ) : (
          <p>JSON representation of the OSM data for debugging and integration purposes.</p>
        )}
      </div>
    </div>
  );
};

export default RawPreview;