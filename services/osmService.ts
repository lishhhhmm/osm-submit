import { POIData, OsmEnvironment } from '../types';

export const generateOsmXml = (data: POIData, changesetId: string = "0"): string => {
  const { lat, lon, tags } = data;

  const tagLines = Object.entries(tags)
    .filter(([_, value]) => value && value.trim() !== '')
    .map(([key, value]) => `    <tag k="${key}" v="${escapeXml(value || '')}"/>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<osm version="0.6" generator="OSM Submit">
  <node changeset="${changesetId}" lat="${lat}" lon="${lon}">
${tagLines}
  </node>
</osm>`;
};

export const generateOsmJson = (data: POIData): string => {
  return JSON.stringify({
    type: "node",
    lat: data.lat,
    lon: data.lon,
    tags: Object.fromEntries(
      Object.entries(data.tags).filter(([_, v]) => v && v.trim() !== '')
    )
  }, null, 2);
};

export const submitToOsm = async (
  token: string,
  env: OsmEnvironment,
  data: POIData,
  onLog: (msg: string, type: 'info' | 'success' | 'error') => void
): Promise<string> => {

  const baseUrl = env === 'dev'
    ? 'https://master.apis.dev.openstreetmap.org/api/0.6'
    : 'https://api.openstreetmap.org/api/0.6';

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'text/xml'
  };

  try {
    // 1. Create Changeset
    onLog("Creating OSM Changeset...", 'info');
    const changesetXml = `
      <osm>
        <changeset>
          <tag k="created_by" v="OSM Submit"/>
          <tag k="comment" v="Added ${data.tags.name || 'a place'} via OSM Submit"/>
        </changeset>
      </osm>`;

    const csResponse = await fetch(`${baseUrl}/changeset/create`, {
      method: 'PUT',
      headers,
      body: changesetXml
    });

    if (!csResponse.ok) {
      const errText = await csResponse.text();
      if (csResponse.status === 401) throw new Error("Unauthorized. Please check your Access Token.");
      throw new Error(`Changeset creation failed: ${errText}`);
    }

    const changesetId = await csResponse.text();
    onLog(`Changeset #${changesetId} created.`, 'success');

    try {
      // 2. Create Node
      onLog("Uploading Node data...", 'info');
      const nodeXml = generateOsmXml(data, changesetId);

      const nodeResponse = await fetch(`${baseUrl}/node/create`, {
        method: 'PUT',
        headers,
        body: nodeXml
      });

      if (!nodeResponse.ok) {
        throw new Error(`Node creation failed: ${await nodeResponse.text()}`);
      }

      const nodeId = await nodeResponse.text();
      onLog(`Node #${nodeId} successfully created!`, 'success');
      return nodeId;

    } finally {
      // 3. Close Changeset
      onLog("Closing changeset...", 'info');
      await fetch(`${baseUrl}/changeset/${changesetId}/close`, {
        method: 'PUT',
        headers
      });
      onLog("Changeset closed.", 'info');
    }
  } catch (error: any) {
    onLog(error.message || "Unknown error occurred", 'error');
    throw error;
  }
};

const escapeXml = (unsafe: string): string => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};
