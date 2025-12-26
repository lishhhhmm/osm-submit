import { OsmEnvironment } from '../types';

// OAuth Configuration
const OAUTH_CONFIG = {
    // Client ID from environment variable
    // Set this in your .env file (see .env.example)
    // Get from: https://www.openstreetmap.org/oauth2/applications
    CLIENT_ID: import.meta.env.VITE_OSM_CLIENT_ID || 'YOUR_CLIENT_ID_HERE',

    // Client Secret (optional - only needed if you checked "Confidential application")
    // For PKCE flow (recommended for SPAs), you don't need this
    CLIENT_SECRET: import.meta.env.VITE_OSM_CLIENT_SECRET || '',

    dev: {
        authUrl: 'https://master.apis.dev.openstreetmap.org/oauth2/authorize',
        tokenUrl: 'https://master.apis.dev.openstreetmap.org/oauth2/token',
        apiUrl: 'https://master.apis.dev.openstreetmap.org/api/0.6',
        userUrl: 'https://master.apis.dev.openstreetmap.org/api/0.6/user/details.json'
    },
    prod: {
        authUrl: 'https://www.openstreetmap.org/oauth2/authorize',
        tokenUrl: 'https://www.openstreetmap.org/oauth2/token',
        apiUrl: 'https://www.openstreetmap.org/api/0.6',
        userUrl: 'https://www.openstreetmap.org/api/0.6/user/details.json'
    }
};

// Get redirect URI based on current location
function getRedirectUri(): string {
    const origin = window.location.origin;
    return `${origin}/oauth/callback`;
}

// Generate random string for PKCE
function generateRandomString(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
    return Array.from(randomValues)
        .map(v => charset[v % charset.length])
        .join('');
}

// SHA-256 hash and base64url encode
async function sha256(plain: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    const hash = await crypto.subtle.digest('SHA-256', data);

    // Convert to base64url
    const bytes = new Uint8Array(hash);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * Start OAuth 2.0 login flow with PKCE
 */
export async function startOAuthLogin(env: OsmEnvironment = 'dev', appState?: any): Promise<void> {
    const config = OAUTH_CONFIG[env];

    // Save app state to restore after OAuth
    if (appState) {
        localStorage.setItem('oauth_app_state', JSON.stringify(appState));
        console.log('Saved app state before OAuth redirect');
    }

    // Generate PKCE values
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await sha256(codeVerifier);
    const state = generateRandomString(32);

    // Store values for later
    localStorage.setItem('oauth_code_verifier', codeVerifier);
    localStorage.setItem('oauth_state', state);
    localStorage.setItem('oauth_env', env);

    // Build authorization URL
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: OAUTH_CONFIG.CLIENT_ID,
        redirect_uri: getRedirectUri(),
        scope: 'read_prefs write_api', // Read user info + edit map
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        state: state
    });

    const authUrl = `${config.authUrl}?${params.toString()}`;

    console.log('Starting OAuth login flow...');
    console.log('Redirecting to:', authUrl);

    // Redirect to OSM
    window.location.href = authUrl;
}

/**
 * Handle OAuth callback and exchange code for token
 */
export async function handleOAuthCallback(code: string, state: string): Promise<string> {
    // Verify state to prevent CSRF
    const storedState = localStorage.getItem('oauth_state');
    if (state !== storedState) {
        throw new Error('Invalid state parameter - possible CSRF attack');
    }

    // Get stored values
    const codeVerifier = localStorage.getItem('oauth_code_verifier');
    const env = (localStorage.getItem('oauth_env') || 'dev') as OsmEnvironment;
    const config = OAUTH_CONFIG[env];

    if (!codeVerifier) {
        throw new Error('Code verifier not found - session may have expired');
    }

    // Exchange authorization code for access token
    const tokenParams = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: OAUTH_CONFIG.CLIENT_ID,
        code: code,
        redirect_uri: getRedirectUri(),
        code_verifier: codeVerifier
    });

    console.log('Exchanging code for token...');

    const response = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: tokenParams.toString()
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Token exchange failed: ${error}`);
    }

    const data = await response.json();
    const accessToken = data.access_token;

    // Clean up temporary storage
    localStorage.removeItem('oauth_code_verifier');
    localStorage.removeItem('oauth_state');

    // Store token
    localStorage.setItem('osm_oauth_token', accessToken);
    localStorage.setItem('osm_oauth_env', env);

    console.log('OAuth login successful!');

    return accessToken;
}

/**
 * Get current user details
 */
export async function getCurrentUser(token: string, env: OsmEnvironment = 'dev'): Promise<any> {
    const config = OAUTH_CONFIG[env];

    const response = await fetch(config.userUrl, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user details');
    }

    const data = await response.json();
    return data.user;
}

/**
 * Logout - clear stored token
 */
export function logout(): void {
    localStorage.removeItem('osm_oauth_token');
    localStorage.removeItem('osm_oauth_env');
    console.log('Logged out');
}

/**
 * Check if user is logged in
 */
export function isLoggedIn(): boolean {
    return !!localStorage.getItem('osm_oauth_token');
}

/**
 * Get stored token
 */
export function getStoredToken(): string | null {
    return localStorage.getItem('osm_oauth_token');
}

/**
 * Get stored environment
 */
export function getStoredEnv(): OsmEnvironment {
    return (localStorage.getItem('osm_oauth_env') as OsmEnvironment) || 'dev';
}
