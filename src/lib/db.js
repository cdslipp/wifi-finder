import { init, i, id } from "@instantdb/core";

// ID for app: wifi
const APP_ID = "d3669f6b-baf8-49dd-9fe9-d0adb08d4c76";

// Define a simpler schema without strict typing
const schema = i.schema({
  entities: {
    networks: i.entity({
      // Keep schema minimal and flexible
      ssid: i.string(),
      password: i.string(),
      rating: i.number(),
      reviews: i.number(),
      createdAt: i.number(),
      hasPassword: i.boolean(),
      requiresPersonalInfo: i.boolean(),
      requiresEmail: i.boolean(),
      requiresPhone: i.boolean(),
      requiresWatchAd: i.boolean(),
    }),
  },
});

console.log("Initializing InstantDB with APP_ID:", APP_ID);

// Initialize the database with proper configuration
export const db = init({ 
  appId: APP_ID, 
  schema
});

console.log("Database initialized:", !!db);

// Export the id function for generating unique IDs
export { id };

// Simple function to log database status
export function logDbStatus() {
  console.log("InstantDB Status:", {
    appId: APP_ID,
    isInitialized: !!db,
    hasTransact: !!db?.transact,
    hasTx: !!db?.tx,
    schema: schema
  });
}

/**
 * Add a new WiFi network directly
 * @param {Object} networkData - The network data to add
 * @param {string} [networkData.ssid] - Network SSID
 * @param {string} [networkData.password] - Network password
 * @param {number} [networkData.rating] - Network rating
 * @param {number} [networkData.reviews] - Number of reviews
 * @param {number} [networkData.createdAt] - Creation timestamp
 * @param {boolean} [networkData.hasPassword] - Whether the network has a password
 * @param {boolean} [networkData.requiresPersonalInfo] - Whether personal info is required
 * @param {boolean} [networkData.requiresEmail] - Whether email is required
 * @param {boolean} [networkData.requiresPhone] - Whether phone is required
 * @param {boolean} [networkData.requiresWatchAd] - Whether watching an ad is required
 * @returns {Promise<any>} - The result of the transaction
 */
export async function addNetworkDirectly(networkData) {
  try {
    // Generate a unique ID
    const networkId = id();
    console.log('Generated network ID:', networkId);
    
    // Create a properly formatted network object with correct types
    const formattedNetwork = {
      ssid: String(networkData.ssid || ''),
      password: String(networkData.password || ''),
      rating: Number(networkData.rating || 0),
      reviews: Number(networkData.reviews || 1),
      createdAt: Date.now(),
      hasPassword: Boolean(networkData.hasPassword),
      requiresPersonalInfo: Boolean(networkData.requiresPersonalInfo),
      requiresEmail: Boolean(networkData.requiresEmail),
      requiresPhone: Boolean(networkData.requiresPhone),
      requiresWatchAd: Boolean(networkData.requiresWatchAd),
    };
    
    console.log('Adding formatted network:', formattedNetwork);
    console.log('Transaction object:', db.tx.networks[networkId]);
    
    // Directly use the transaction pattern from the docs
    const result = await db.transact(
      db.tx.networks[networkId].update(formattedNetwork)
    );
    
    console.log('Transaction result:', result);
    return result;
  } catch (error) {
    console.error('Error in addNetworkDirectly:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    } else {
      console.error('Unknown error type:', error);
    }
    throw error;
  }
}

/**
 * Subscribe to network data
 * @param {Function} callback - Callback function to handle data
 * @returns {Function} Unsubscribe function
 */
export function subscribeToNetworks(callback) {
  console.log("Subscribing to networks...");
  
  return db.subscribeQuery({ networks: {} }, (resp) => {
    console.log("Received network data response:", resp);
    
    if (resp.error) {
      console.error("Error fetching networks:", resp.error.message);
      return;
    }
    
    if (resp.data && resp.data.networks) {
      console.log("Networks found:", Object.keys(resp.data.networks).length);
      callback(resp.data.networks);
    } else {
      console.log("No network data received");
      callback([]);
    }
  });
}

/**
 * Add a test network for debugging
 */
export async function addTestNetwork() {
  try {
    const testId = id();
    console.log("Adding test network with ID:", testId);
    
    const testNetwork = {
      ssid: "Test WiFi " + new Date().toLocaleTimeString(),
      password: "test123",
      rating: 4.5,
      reviews: 1,
      createdAt: Date.now(),
      hasPassword: true,
      requiresPersonalInfo: false,
      requiresEmail: true,
      requiresPhone: false,
      requiresWatchAd: true
    };
    
    console.log("Test network data:", testNetwork);
    
    // Use the exact pattern from the docs
    const result = await db.transact(
      db.tx.networks[testId].update(testNetwork)
    );
    
    console.log("Test network added successfully:", result);
    return result;
  } catch (error) {
    console.error("Error adding test network:", error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    } else {
      console.error('Unknown error type:', error);
    }
    throw error;
  }
}

/**
 * Set up open permissions for the database
 * This should be called once to configure the database
 */
export function setupOpenPermissions() {
  console.log("To set up open permissions:");
  console.log("1. Go to the InstantDB dashboard");
  console.log("2. Select your app (wifi)");
  console.log("3. Go to the Permissions tab");
  console.log("4. Set the following permissions:");
  console.log(`{
  "$default": {
    "allow": {
      "$default": "true"
    }
  },
  "attrs": {
    "allow": {
      "create": "true"
    }
  }
}`);
} 