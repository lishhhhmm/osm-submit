import React, { useState } from 'react';
import { POIData } from './types';
import POIForm from './components/POIForm';
import ReviewSubmit from './components/ReviewSubmit';
import { Map, ArrowRight } from 'lucide-react';

const INITIAL_DATA: POIData = {
  lat: 0,
  lon: 0,
  tags: {
    name: '',
    amenity: '',
    cuisine: '',
  }
};

const App: React.FC = () => {
  const [data, setData] = useState<POIData>(INITIAL_DATA);
  const [step, setStep] = useState<'form' | 'review'>('form');
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  const isFormValid = () => {
    return data.tags.name && data.tags.amenity && data.lat !== 0 && data.lon !== 0;
  };

  const handleReset = () => {
    setData(INITIAL_DATA);
    setMode('create');
    setStep('form');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Map className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">OSM Submit</h1>
          </div>

          {/* Step Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <div className={`flex items-center gap-2 ${step === 'form' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-400 dark:text-slate-600'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'form' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>1</div>
              Fill Form
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-700" />
            <div className={`flex items-center gap-2 ${step === 'review' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-400 dark:text-slate-600'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'review' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>2</div>
              Review & Submit
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8">
        {step === 'form' && (
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                {mode === 'edit' ? 'Edit Place' : 'Add a New Place'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                {mode === 'edit'
                  ? 'Modify the details of this existing location'
                  : 'Fill in the details of the business or location you want to add to OpenStreetMap'}
              </p>
            </div>

            <POIForm data={data} onChange={setData} mode={mode} onModeChange={setMode} />

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep('review')}
                disabled={!isFormValid()}
                className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${isFormValid()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 hover:scale-[1.02]'
                  : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-500 cursor-not-allowed'
                  }`}
              >
                Continue to Review
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {!isFormValid() && (
              <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
                * Please fill in required fields: Business Name, Type, and Location
              </p>
            )}
          </div>
        )}

        {step === 'review' && (
          <ReviewSubmit data={data} onBack={() => setStep('form')} />
        )}
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-auto transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 dark:text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} OSM Submit. Designed for OpenStreetMap contributors.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;