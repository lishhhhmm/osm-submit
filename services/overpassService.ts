import { POIData } from '../types';

interface OverpassElement {
    type: string;
    id: number;
    lat?: number;
    lon?: number;
    tags?: Record<string, string>;
    center?: { lat: number; lon: number };
}

interface OverpassResponse {
    elements: OverpassElement[];
}

/**
 * Query OSM for existing POIs near a location
 */
export async function queryNearbyPOIs(lat: number, lon: number, radiusMeters: number = 20): Promise<OverpassElement[]> {
    // Overpass API query to find nodes and ways near the point
    const query = `
    [out:json][timeout:10];
    (
      node(around:${radiusMeters},${lat},${lon})[amenity];
      node(around:${radiusMeters},${lat},${lon})[shop];
      way(around:${radiusMeters},${lat},${lon})[amenity];
      way(around:${radiusMeters},${lat},${lon})[shop];
    );
    out tags center;
  `;

    console.log('Querying Overpass API for POIs near:', lat, lon);

    try {
        const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (!response.ok) {
            throw new Error(`Overpass API error: ${response.statusText}`);
        }

        const data: OverpassResponse = await response.json();
        console.log('Overpass API returned', data.elements?.length || 0, 'POIs');
        if (data.elements && data.elements.length > 0) {
            console.log('First POI:', data.elements[0]);
        }
        return data.elements || [];
    } catch (error) {
        console.error('Error querying Overpass API:', error);
        return [];
    }
}

/**
 * Convert Overpass element to POIData
 */
export function overpassToPOIData(element: OverpassElement): POIData {
    const lat = element.type === 'node' ? element.lat! : element.center!.lat;
    const lon = element.type === 'node' ? element.lon! : element.center!.lon;

    const poiData = {
        id: element.id,
        version: 1, // We'd need to fetch full details for actual version
        lat,
        lon,
        tags: {
            name: element.tags?.name || '',
            amenity: element.tags?.amenity || element.tags?.shop || '',
            cuisine: element.tags?.cuisine,
            phone: element.tags?.phone,
            website: element.tags?.website,
            opening_hours: element.tags?.opening_hours,
            'addr:street': element.tags?.['addr:street'],
            'addr:housenumber': element.tags?.['addr:housenumber'],
            'addr:city': element.tags?.['addr:city'],
            'addr:postcode': element.tags?.['addr:postcode'],
            wheelchair: element.tags?.wheelchair,
        }
    };

    console.log('Converted POI data:', poiData);
    return poiData;
}

/**
 * Get POI display name
 */
export function getPOIDisplayName(element: OverpassElement): string {
    const name = element.tags?.name;
    const amenity = element.tags?.amenity || element.tags?.shop;

    if (name && amenity) {
        return `${name} (${amenity})`;
    } else if (name) {
        return name;
    } else if (amenity) {
        return amenity.replace('_', ' ');
    }
    return `POI #${element.id}`;
}
