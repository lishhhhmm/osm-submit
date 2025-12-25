import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { suggestTagsFromDescription } from '../services/geminiService';
import { OsmTags } from '../types';

interface GeminiAssistantProps {
  onApplyTags: (tags: Partial<OsmTags>) => void;
}

const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ onApplyTags }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuggest = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const suggestedTags = await suggestTagsFromDescription(input);
      onApplyTags(suggestedTags);
      setInput(''); // Clear input on success
    } catch (e) {
      setError("Failed to get suggestions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-xl p-6 mb-8 shadow-sm transition-colors duration-200">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="font-semibold text-indigo-900 dark:text-indigo-200">AI Tag Assistant</h3>
      </div>
      <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-4">
        Describe the place naturally (e.g., "Joe's Pizza on 5th Ave, open daily till 10pm, serves NYC style slices") and we'll fill the form for you.
      </p>
      
      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type description here..."
          className="w-full p-3 pr-12 rounded-lg border border-indigo-200 dark:border-indigo-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none min-h-[80px] text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-slate-900 transition-colors"
        />
        <button
          onClick={handleSuggest}
          disabled={isLoading || !input.trim()}
          className="absolute bottom-3 right-3 p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          title="Generate Tags"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
};

export default GeminiAssistant;