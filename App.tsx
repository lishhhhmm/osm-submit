import React, { useState } from 'react';
import { POIData, ViewMode, OsmTags } from './types';
import POIForm from './components/POIForm';
import RawPreview from './components/RawPreview';
import { Map, Code2, Menu, X } from 'lucide-react';

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
  const [view, setView] = useState<ViewMode>(ViewMode.FORM);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavButton = ({ mode, icon: Icon, label }: { mode: ViewMode, icon: any, label: string }) => (
    <button
      onClick={() => {
        setView(mode);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${view === mode
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
        }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Map className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">OSM Submit</h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            <NavButton mode={ViewMode.FORM} icon={Map} label="Editor" />
            <NavButton mode={ViewMode.RAW} icon={Code2} label="Raw Data" />
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-600 dark:text-slate-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 shadow-lg space-y-2">
            <button
              onClick={() => {
                setView(ViewMode.FORM);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${view === ViewMode.FORM ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold' : 'text-slate-600 dark:text-slate-400'}`}
            >
              <Map className="w-5 h-5" /> Editor
            </button>
            <button
              onClick={() => {
                setView(ViewMode.RAW);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 ${view === ViewMode.RAW ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold' : 'text-slate-600 dark:text-slate-400'}`}
            >
              <Code2 className="w-5 h-5" /> Raw Data
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8">

        {view === ViewMode.FORM && (
          <div className="space-y-6">
            <div className="text-center md:text-left mb-8">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Create New Place</h2>
              <p className="text-slate-500 dark:text-slate-400">Fill in the details below to generate an OSM-compliant submission.</p>
            </div>

            <POIForm data={data} onChange={setData} />

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setView(ViewMode.RAW)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                Review Data <Code2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {view === ViewMode.RAW && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Raw API Data</h2>
                <p className="text-slate-500 dark:text-slate-400">Preview the XML payload for the OSM API.</p>
              </div>
              <button
                onClick={() => setView(ViewMode.FORM)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Back to Edit
              </button>
            </div>
            <RawPreview data={data} />
          </div>
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