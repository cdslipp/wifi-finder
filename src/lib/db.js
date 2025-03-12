import { init, i, id } from "@instantdb/core";

// ID for app: wifi
const APP_ID = "d3669f6b-baf8-49dd-9fe9-d0adb08d4c76";

// Define a simpler schema without strict typing
const schema = i.schema({
  entities: {
    networks: i.entity({
      // Keep schema minimal and flexible
      ssid: i.any(),
      password: i.any(),
      rating: i.any(),
      reviews: i.any(),
      createdAt: i.any(),
      hasPassword: i.any(),
      requiresPersonalInfo: i.any(),
    }),
  },
});

// Initialize the database
export const db = init({ appId: APP_ID, schema });

/**
 * Add a new WiFi network
 * @param {Object} network - The network to add
 * @param {string} network.ssid - Network SSID
 * @param {string} network.password - Network password
 * @param {number} network.rating - Network rating
 * @param {boolean} network.hasPassword - Whether the network has a password
 * @param {boolean} network.requiresPersonalInfo - Whether the network requires personal info
 */
export function addNetwork(network) {
  console.log("Adding network:", network);
  
  try {
    return db.transact(
      db.tx.networks[id()].update({
        ssid: network.ssid,
        password: network.password || "",
        rating: network.rating,
        reviews: 1,
        createdAt: Date.now(),
        hasPassword: network.hasPassword || false,
        requiresPersonalInfo: network.requiresPersonalInfo || false,
      })
    );
  } catch (error) {
    console.error("Error adding network:", error);
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
    console.log("Received network data:", resp);
    
    if (resp.error) {
      console.error("Error fetching networks:", resp.error.message);
      return;
    }
    
    if (resp.data && resp.data.networks) {
      callback(resp.data.networks);
    } else {
      console.log("No network data received");
      callback([]);
    }
  });
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