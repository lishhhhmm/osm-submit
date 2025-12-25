import React, { useCallback, useState } from 'react';
import { POIData, OsmTags } from '../types';
import { MapPin, Building, Globe, Phone, Clock, Accessibility, Edit, PlusCircle } from 'lucide-react';
import LocationMap from './LocationMap';
import POISelector from './POISelector';
import { queryNearbyPOIs, overpassToPOIData, getPOIDisplayName } from '../services/overpassService';

interface POIFormProps {
  data: POIData;
  onChange: (data: POIData) => void;
  mode?: 'create' | 'edit';
  onModeChange?: (mode: 'create' | 'edit') => void;
}

const POIForm: React.FC<POIFormProps> = ({ data, onChange, mode = 'create', onModeChange }) => {
  const [showPOISelector, setShowPOISelector] = useState(false);
  const [nearbyPOIs, setNearbyPOIs] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lon: number } | null>(null);

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

      {/* Mode Indicator */}
      {mode === 'edit' && data.id && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl p-4 flex items-center gap-3">
          <Edit className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <div className="flex-1">
            <p className="font-semibold text-amber-900 dark:text-amber-100">Editing Existing POI #{data.id}</p>
            <p className="text-sm text-amber-700 dark:text-amber-300">You're modifying an existing OpenStreetMap feature</p>
          </div>
        </div>
      )}

      {mode === 'create' && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl p-4 flex items-center gap-3">
          <PlusCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div className="flex-1">
            <p className="font-semibold text-blue-900 dark:text-blue-100">Creating New POI</p>
            <p className="text-sm text-blue-700 dark:text-blue-300">Add a new place to OpenStreetMap</p>
          </div>
        </div>
      )}

      {/* Location Section */}
      <section className={cardClass}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-500" />
            Location
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Click the 📍 button or click anywhere on the map. We'll automatically detect if a POI already exists at that location.
          </p>
        </div>

        {/* Map */}
        <div className="mb-6">
          <LocationMap
            lat={data.lat}
            lon={data.lon}
            onChange={handleMapChange}
            onPOIDetected={async (clickedLat, clickedLon) => {
              // Store clicked location
              setSelectedLocation({ lat: clickedLat, lon: clickedLon });

              // Query for nearby POIs (100m radius)
              try {
                const pois = await queryNearbyPOIs(clickedLat, clickedLon, 100);
                if (pois.length > 0) {
                  // Show selector with all nearby POIs
                  setNearbyPOIs(pois);
                  setShowPOISelector(true);
                } else {
                  // No POIs found - go to create mode
                  onModeChange?.('create');
                }
              } catch (error) {
                console.error('Error querying POIs:', error);
                onModeChange?.('create');
              }
            }}
          />
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

      {/* Business Info - Streamlined */}
      <section className={cardClass}>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Building className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Business Information
        </h3>
        <div className="space-y-4">
          {/* Name - Required */}
          <div>
            <label className={labelClass}>
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.tags.name}
              onChange={(e) => handleTagChange('name', e.target.value)}
              placeholder="e.g. Starbucks, McDonald's, 7-Eleven"
              className={inputClass.replace('blue', 'indigo')}
              required
            />
          </div>

          {/* Type - Required */}
          <div>
            <label className={labelClass}>
              Type <span className="text-red-500">*</span>
            </label>
            <select
              value={data.tags.amenity}
              onChange={(e) => handleTagChange('amenity', e.target.value)}
              className={selectClass.replace('blue', 'indigo')}
              required
            >
              <option value="">Select business type...</option>
              <optgroup label="Food & Drink">
                <option value="restaurant">Restaurant</option>
                <option value="fast_food">Fast Food</option>
                <option value="cafe">Cafe / Coffee Shop</option>
                <option value="bar">Bar</option>
                <option value="pub">Pub</option>
                <option value="ice_cream">Ice Cream Shop</option>
                <option value="food_court">Food Court</option>
                <option value="biergarten">Beer Garden</option>
              </optgroup>
              <optgroup label="Shopping">
                <option value="supermarket">Supermarket</option>
                <option value="convenience">Convenience Store</option>
                <option value="marketplace">Marketplace</option>
                <option value="mall">Shopping Mall</option>
                <option value="department_store">Department Store</option>
                <option value="clothes">Clothing Store</option>
                <option value="shoes">Shoe Store</option>
                <option value="electronics">Electronics Store</option>
                <option value="books">Book Store</option>
                <option value="sports">Sports Shop</option>
                <option value="bicycle">Bicycle Shop</option>
                <option value="car">Car Dealership</option>
                <option value="furniture">Furniture Store</option>
                <option value="jewelry">Jewelry Store</option>
                <option value="gift">Gift Shop</option>
                <option value="florist">Florist</option>
                <option value="bakery">Bakery</option>
                <option value="butcher">Butcher</option>
              </optgroup>
              <optgroup label="Services">
                <option value="bank">Bank</option>
                <option value="atm">ATM</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="fuel">Gas Station</option>
                <option value="charging_station">EV Charging Station</option>
                <option value="car_wash">Car Wash</option>
                <option value="car_repair">Auto Repair</option>
                <option value="post_office">Post Office</option>
                <option value="veterinary">Veterinary</option>
                <option value="dentist">Dentist</option>
                <option value="doctors">Doctor / Clinic</option>
                <option value="hospital">Hospital</option>
                <option value="clinic">Medical Clinic</option>
              </optgroup>
              <optgroup label="Accommodation">
                <option value="hotel">Hotel</option>
                <option value="motel">Motel</option>
                <option value="hostel">Hostel</option>
                <option value="guest_house">Guest House</option>
              </optgroup>
              <optgroup label="Entertainment">
                <option value="cinema">Cinema</option>
                <option value="theatre">Theatre</option>
                <option value="nightclub">Nightclub</option>
                <option value="casino">Casino</option>
                <option value="gym">Gym / Fitness</option>
              </optgroup>
              <optgroup label="Other">
                <option value="parking">Parking</option>
                <option value="bicycle_parking">Bicycle Parking</option>
                <option value="toilets">Public Toilets</option>
                <option value="library">Library</option>
                <option value="community_centre">Community Center</option>
                <option value="place_of_worship">Place of Worship</option>
              </optgroup>
            </select>
          </div>

          {/* Cuisine - Only show for food places */}
          {(data.tags.amenity === 'restaurant' ||
            data.tags.amenity === 'fast_food' ||
            data.tags.amenity === 'cafe') && (
              <div>
                <label className={labelClass}>Cuisine (Optional)</label>
                <input
                  type="text"
                  value={data.tags.cuisine || ''}
                  onChange={(e) => handleTagChange('cuisine', e.target.value)}
                  placeholder="e.g. pizza, burger, italian, chinese, coffee"
                  className={inputClass.replace('blue', 'indigo')}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Separate multiple cuisines with semicolons: italian;pizza
                </p>
              </div>
            )}

          {/* Street Address - Common */}
          <div>
            <label className={labelClass}>Street Address (Optional)</label>
            <input
              type="text"
              value={data.tags["addr:street"] || ''}
              onChange={(e) => handleTagChange('addr:street', e.target.value)}
              placeholder="e.g. Main Street"
              className={inputClass.replace('blue', 'indigo')}
            />
          </div>

          {/* House Number and City - Side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Number</label>
              <input
                type="text"
                value={data.tags["addr:housenumber"] || ''}
                onChange={(e) => handleTagChange('addr:housenumber', e.target.value)}
                placeholder="123"
                className={inputClass.replace('blue', 'indigo')}
              />
            </div>
            <div>
              <label className={labelClass}>City</label>
              <input
                type="text"
                value={data.tags["addr:city"] || ''}
                onChange={(e) => handleTagChange('addr:city', e.target.value)}
                placeholder="e.g. Athens"
                className={inputClass.replace('blue', 'indigo')}
              />
            </div>
          </div>

          {/* Phone and Website - Common for businesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`${labelClass} flex items-center gap-1`}><Phone className="w-3 h-3" /> Phone</label>
              <input
                type="text"
                value={data.tags.phone || ''}
                onChange={(e) => handleTagChange('phone', e.target.value)}
                placeholder="+30 123 456 7890"
                className={inputClass.replace('blue', 'indigo')}
              />
            </div>
            <div>
              <label className={`${labelClass} flex items-center gap-1`}><Globe className="w-3 h-3" /> Website</label>
              <input
                type="text"
                value={data.tags.website || ''}
                onChange={(e) => handleTagChange('website', e.target.value)}
                placeholder="https://example.com"
                className={inputClass.replace('blue', 'indigo')}
              />
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <label className={`${labelClass} flex items-center gap-1`}><Clock className="w-3 h-3" /> Opening Hours</label>
            <input
              type="text"
              value={data.tags.opening_hours || ''}
              onChange={(e) => handleTagChange('opening_hours', e.target.value)}
              placeholder="Mo-Fr 09:00-17:00; Sa 10:00-14:00"
              className={inputClass.replace('blue', 'indigo')}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Use OSM format. Example: Mo-Fr 09:00-21:00; Sa-Su 10:00-18:00
            </p>
          </div>

          {/* Wheelchair Access - Important */}
          <div>
            <label className={`${labelClass} flex items-center gap-1`}><Accessibility className="w-3 h-3" /> Wheelchair Access</label>
            <select
              value={data.tags.wheelchair || ''}
              onChange={(e) => handleTagChange('wheelchair', e.target.value)}
              className={selectClass.replace('blue', 'indigo')}
            >
              <option value="">Unknown</option>
              <option value="yes">Yes - Fully Accessible</option>
              <option value="limited">Limited - Partially Accessible</option>
              <option value="no">No - Not Accessible</option>
            </select>
          </div>
        </div>
      </section>

      {/* POI Selector Modal */}
      {showPOISelector && (
        <POISelector
          pois={nearbyPOIs.map(poi => ({
            id: poi.id,
            name: getPOIDisplayName(poi),
            type: poi.tags?.amenity || poi.tags?.shop || 'unknown',
            tags: poi.tags
          }))}
          onSelect={(selectedPOI) => {
            if (selectedPOI) {
              // Find the full POI data
              const fullPOI = nearbyPOIs.find(p => p.id === selectedPOI.id);
              if (fullPOI) {
                const poiData = overpassToPOIData(fullPOI);
                onChange(poiData);
                onModeChange?.('edit');
              }
            }
            setShowPOISelector(false);
          }}
          onCreateNew={() => {
            // User chose to create new even though POIs exist
            if (selectedLocation) {
              onChange({
                ...data,
                lat: selectedLocation.lat,
                lon: selectedLocation.lon
              });
            }
            onModeChange?.('create');
            setShowPOISelector(false);
          }}
          onCancel={() => {
            setShowPOISelector(false);
          }}
        />
      )}
    </div>
  );
};

export default POIForm;