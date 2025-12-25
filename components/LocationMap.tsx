import React, { useEffect, useRef } from 'react';

interface LocationMapProps {
  lat: number;
  lon: number;
  onChange: (lat: number, lon: number) => void;
}

const LocationMap: React.FC<LocationMapProps> = ({ lat, lon, onChange }) => {
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

    // Map Tiles (Light/Dark aware)
    const lightUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const darkUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    tileLayerInstance.current = L.tileLayer(isDark ? darkUrl : lightUrl, {
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

    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      onChange(parseFloat(lat.toFixed(7)), parseFloat(lng.toFixed(7)));
    });

    mapInstance.current = map;
    markerInstance.current = marker;

    // Handle Theme Changes
    const matcher = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
       if (tileLayerInstance.current) {
         tileLayerInstance.current.setUrl(e.matches ? darkUrl : lightUrl);
       }
    };
    matcher.addEventListener('change', updateTheme);

    return () => {
      map.remove();
      mapInstance.current = null;
      matcher.removeEventListener('change', updateTheme);
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
      
      // If the change is significant (e.g. Locate Me clicked), fly to it
      if (latDiff > 0.001 || lonDiff > 0.001) {
         mapInstance.current.flyTo([lat, lon], 18, { duration: 1.5 });
      } else {
         // Minor adjustment (manual input) - just pan
         mapInstance.current.panTo([lat, lon]);
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