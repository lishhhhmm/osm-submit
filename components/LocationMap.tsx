import React, { useEffect, useRef } from 'react';
import { queryNearbyPOIs, overpassToPOIData } from '../services/overpassService';
import { POIData } from '../types';

interface LocationMapProps {
  lat: number;
  lon: number;
  onChange: (lat: number, lon: number) => void;
  onPOIDetected?: (lat: number, lon: number) => void;
}

const LocationMap: React.FC<LocationMapProps> = ({ lat, lon, onChange, onPOIDetected }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);
  const tileLayerInstance = useRef<any>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current || !(window as any).L) return;
    if (mapInstance.current) return;

    const L = (window as any).L;

    // Default view
    const initialLat = lat || 51.505;
    const initialLon = lon || -0.09;
    const initialZoom = (lat === 0 && lon === 0) ? 2 : 16;

    const map = L.map(mapContainer.current, {
      center: [initialLat, initialLon],
      zoom: initialZoom,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Add locate control (finds user's location)
    L.control.locate({
      position: 'bottomright',
      strings: {
        title: "Show my location"
      },
      locateOptions: {
        enableHighAccuracy: true,
        timeout: 60000,
        maximumAge: 0,
        watch: false  // Don't continuously track - just locate once
      },
      flyTo: false, // Instant, no animation
      setView: 'untilPan', // Jump to location immediately
      clickBehavior: {
        inView: 'setView',
        outOfView: 'setView'
      },
      returnToPrevBounds: false, // Don't return to previous bounds
      cacheLocation: false, // Don't cache - always get fresh location
      showCompass: false, // Don't show compass (mobile)
      onLocationError: (err: any) => {
        console.error("Locate control error:", err);
        alert("Could not find your location. Please ensure location services are enabled.");
      }
    }).addTo(map);

    // Always use standard OpenStreetMap tiles (looks good in both light and dark mode)
    tileLayerInstance.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Marker
    const marker = L.marker([initialLat, initialLon], {
      draggable: true,
      autoPan: true
    }).addTo(map);

    // Events
    marker.on('dragend', (e: any) => {
      const { lat, lng } = e.target.getLatLng();
      // High precision update from drag
      onChange(parseFloat(lat.toFixed(7)), parseFloat(lng.toFixed(7)));
    });

    // Debounce POI detection to avoid rate limiting
    let poiCheckTimeout: any = null;
    const checkForPOI = async (lat: number, lng: number) => {
      if (!onPOIDetected) return;

      // Clear any pending checks
      if (poiCheckTimeout) {
        clearTimeout(poiCheckTimeout);
      }

      // Wait 500ms before notifying parent (debounce)
      poiCheckTimeout = setTimeout(() => {
        console.log('Notifying parent of location click...');
        onPOIDetected(lat, lng);
      }, 500);
    };

    // Check for existing POIs when clicking
    map.on('click', async (e: any) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      onChange(parseFloat(lat.toFixed(7)), parseFloat(lng.toFixed(7)));

      // Debounced POI check
      checkForPOI(lat, lng);
    });

    // Handle location found from locate control
    map.on('locationfound', async (e: any) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      onChange(parseFloat(lat.toFixed(7)), parseFloat(lng.toFixed(7)));
      console.log("Location found:", lat, lng);

      // Debounced POI check
      checkForPOI(lat, lng);
    });


    mapInstance.current = map;
    markerInstance.current = marker;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []); // Run once on mount

  // Sync props to map (One-way binding: State -> Map)
  useEffect(() => {
    if (!mapInstance.current || !markerInstance.current) return;

    const currentLatLng = markerInstance.current.getLatLng();
    // Use a small epsilon for float comparison
    const latDiff = Math.abs(currentLatLng.lat - lat);
    const lonDiff = Math.abs(currentLatLng.lng - lon);

    // Only update map if the prop deviation is significant (avoid drag feedback loops)
    if (latDiff > 0.0000001 || lonDiff > 0.0000001) {
      markerInstance.current.setLatLng([lat, lon]);

      // Jump to location instantly (no animation)
      if (latDiff > 0.001 || lonDiff > 0.001) {
        mapInstance.current.setView([lat, lon], 18); // Instant zoom to location
      } else {
        mapInstance.current.setView([lat, lon]); // Instant pan
      }
    }

    // Ensure map handles container resize properly
    mapInstance.current.invalidateSize();
  }, [lat, lon]);

  return (
    <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 z-0 bg-slate-100 dark:bg-slate-800">
      <div ref={mapContainer} className="w-full h-full" />
      {/* Instruction Overlay */}
      <div className="absolute top-2 right-2 z-[400] bg-white/90 dark:bg-slate-900/90 text-[10px] font-medium px-2 py-1 rounded shadow text-slate-500 dark:text-slate-400 backdrop-blur-sm pointer-events-none">
        Drag marker to adjust
      </div>
    </div>
  );
};

export default LocationMap;