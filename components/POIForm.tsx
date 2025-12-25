import React, { useCallback } from 'react';
import { POIData, OsmTags } from '../types';
import { MapPin, Building, Globe, Phone, Clock, Accessibility } from 'lucide-react';
import LocationMap from './LocationMap';

interface POIFormProps {
  data: POIData;
  onChange: (data: POIData) => void;
}

const POIForm: React.FC<POIFormProps> = ({ data, onChange }) => {

  const handleTagChange = (key: keyof OsmTags, value: string) => {
    onChange({
      ...data,
      tags: {
        ...data.tags,
        [key]: value
      }
    });
  };

  const handleCoordChange = (key: 'lat' | 'lon', value: string) => {
    onChange({
      ...data,
      [key]: parseFloat(value) || 0
    });
  };

  const handleMapChange = (lat: number, lon: number) => {
    onChange({
      ...data,
      lat,
      lon
    });
  };

  const cardClass = "bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-200";
  const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";
  const inputClass = "w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500";
  const selectClass = "w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100";

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Location Section */}
      <section className={cardClass}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-500" />
            Location
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Click the 📍 button on the map to find your location, or click anywhere to set position
          </p>
        </div>

        {/* Map */}
        <div className="mb-6">
          <LocationMap lat={data.lat} lon={data.lon} onChange={handleMapChange} />
        </div>

        {/* Manual Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Latitude</label>
            <input
              type="number"
              value={data.lat}
              onChange={(e) => handleCoordChange('lat', e.target.value)}
              className={inputClass}
              step="0.0000001"
            />
          </div>
          <div>
            <label className={labelClass}>Longitude</label>
            <input
              type="number"
              value={data.lon}
              onChange={(e) => handleCoordChange('lon', e.target.value)}
              className={inputClass}
              step="0.0000001"
            />
          </div>
        </div>
      </section>

      {/* Basic Info */}
      <section className={cardClass}>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Building className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Basic Details
        </h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Name</label>
            <input
              type="text"
              value={data.tags.name}
              onChange={(e) => handleTagChange('name', e.target.value)}
              placeholder="e.g. Luigi's Pizza"
              className={inputClass.replace('blue', 'indigo')}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Type (Amenity)</label>
              <select
                value={data.tags.amenity}
                onChange={(e) => handleTagChange('amenity', e.target.value)}
                className={selectClass.replace('blue', 'indigo')}
              >
                <option value="">Select Type...</option>
                <option value="restaurant">Restaurant</option>
                <option value="fast_food">Fast Food</option>
                <option value="cafe">Cafe</option>
                <option value="bar">Bar</option>
                <option value="pub">Pub</option>
                <option value="ice_cream">Ice Cream</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Cuisine</label>
              <input
                type="text"
                value={data.tags.cuisine || ''}
                onChange={(e) => handleTagChange('cuisine', e.target.value)}
                placeholder="e.g. pizza, italian, burger"
                className={inputClass.replace('blue', 'indigo')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Address */}
      <section className={cardClass}>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
          Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Street</label>
            <input
              type="text"
              value={data.tags["addr:street"] || ''}
              onChange={(e) => handleTagChange('addr:street', e.target.value)}
              className={inputClass.replace('blue', 'emerald')}
            />
          </div>
          <div>
            <label className={labelClass}>House Number</label>
            <input
              type="text"
              value={data.tags["addr:housenumber"] || ''}
              onChange={(e) => handleTagChange('addr:housenumber', e.target.value)}
              className={inputClass.replace('blue', 'emerald')}
            />
          </div>
          <div>
            <label className={labelClass}>Postcode</label>
            <input
              type="text"
              value={data.tags["addr:postcode"] || ''}
              onChange={(e) => handleTagChange('addr:postcode', e.target.value)}
              className={inputClass.replace('blue', 'emerald')}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>City</label>
            <input
              type="text"
              value={data.tags["addr:city"] || ''}
              onChange={(e) => handleTagChange('addr:city', e.target.value)}
              className={inputClass.replace('blue', 'emerald')}
            />
          </div>
        </div>
      </section>

      {/* Details */}
      <section className={cardClass}>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-amber-600 dark:text-amber-500" />
          Contact & Extra
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`${labelClass} flex items-center gap-1`}><Phone className="w-3 h-3" /> Phone</label>
              <input
                type="text"
                value={data.tags.phone || ''}
                onChange={(e) => handleTagChange('phone', e.target.value)}
                placeholder="+1 555 0199"
                className={inputClass.replace('blue', 'amber')}
              />
            </div>
            <div>
              <label className={`${labelClass} flex items-center gap-1`}><Globe className="w-3 h-3" /> Website</label>
              <input
                type="text"
                value={data.tags.website || ''}
                onChange={(e) => handleTagChange('website', e.target.value)}
                placeholder="https://example.com"
                className={inputClass.replace('blue', 'amber')}
              />
            </div>
          </div>
          <div>
            <label className={`${labelClass} flex items-center gap-1`}><Clock className="w-3 h-3" /> Opening Hours</label>
            <input
              type="text"
              value={data.tags.opening_hours || ''}
              onChange={(e) => handleTagChange('opening_hours', e.target.value)}
              placeholder="Mo-Fr 09:00-17:00; Sa 10:00-14:00"
              className={inputClass.replace('blue', 'amber')}
            />
          </div>
          <div>
            <label className={`${labelClass} flex items-center gap-1`}><Accessibility className="w-3 h-3" /> Wheelchair Access</label>
            <select
              value={data.tags.wheelchair || ''}
              onChange={(e) => handleTagChange('wheelchair', e.target.value)}
              className={selectClass.replace('blue', 'amber')}
            >
              <option value="">Unknown</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="limited">Limited</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
};

export default POIForm;