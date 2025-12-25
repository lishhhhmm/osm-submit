export interface OsmTags {
  name: string;
  amenity: string;
  cuisine?: string;
  "addr:street"?: string;
  "addr:housenumber"?: string;
  "addr:city"?: string;
  "addr:postcode"?: string;
  phone?: string;
  website?: string;
  opening_hours?: string;
  wheelchair?: string;
  [key: string]: string | undefined;
}

export interface POIData {
  lat: number;
  lon: number;
  tags: OsmTags;
}

export enum ViewMode {
  FORM = 'FORM',
  RAW = 'RAW'
}

export type OsmEnvironment = 'dev' | 'prod';

export interface SubmissionLog {
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'error';
}