import React from 'react';
import { MapPin, Edit, PlusCircle, X, Navigation } from 'lucide-react';

interface POIOption {
    id: number;
    name: string;
    type: string;
    distance?: number;
    tags?: Record<string, string>;
}

interface POISelectorProps {
    pois: POIOption[];
    onSelect: (poi: POIOption | null) => void;
    onCreateNew: () => void;
    onCancel: () => void;
}

const POISelector: React.FC<POISelectorProps> = ({ pois, onSelect, onCreateNew, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col border border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                Found {pois.length} {pois.length === 1 ? 'Place' : 'Places'}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                Select a place to edit or create new
                            </p>
                        </div>
                        <button
                            onClick={onCancel}
                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Cancel"
                        >
                            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* POI List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {pois.map((poi) => (
                        <button
                            key={poi.id}
                            onClick={() => onSelect(poi)}
                            className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all group"
                        >
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50 transition-colors">
                                    <Edit className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                                        {poi.name || 'Unnamed'}
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                                        {poi.type.replace('_', ' ')}
                                    </p>
                                    {poi.distance !== undefined && (
                                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 flex items-center gap-1">
                                            <Navigation className="w-3 h-3" />
                                            ~{poi.distance}m away
                                        </p>
                                    )}
                                </div>
                                <div className="text-xs text-slate-400 dark:text-slate-600">
                                    #{poi.id}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Create New Option */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={onCreateNew}
                        className="w-full p-4 rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                                <PlusCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="text-left flex-1">
                                <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                                    Create New Place
                                </h4>
                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                    Add a new POI at this location
                                </p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default POISelector;
