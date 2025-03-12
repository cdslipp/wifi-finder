<script>
  import { onMount } from 'svelte';
  import NetworkList from '$lib/components/NetworkList.svelte';
  import AddNetworkForm from '$lib/components/AddNetworkForm.svelte';
  import { addNetwork, subscribeToNetworks, setupOpenPermissions, db } from '$lib/db.js';
  
  /**
   * @typedef {Object} Network
   * @property {string} id - Network ID
   * @property {string} ssid - Network SSID
   * @property {string} password - Network password
   * @property {number} rating - Network rating
   * @property {number} reviews - Number of reviews
   * @property {number} createdAt - Creation timestamp
   * @property {boolean} hasPassword - Whether the network has a password
   * @property {boolean} requiresPersonalInfo - Whether the network requires personal info
   */
  
  /** @type {Network[]} */
  let networks = $state([]);
  let isLoading = $state(true);
  let error = $state(null);
  let debugInfo = $state({});
  
  // Derived value for sorted networks
  let sortedNetworks = $derived(
    networks && networks.length 
      ? [...networks].sort((a, b) => (b.rating || 0) - (a.rating || 0))
      : []
  );
  
  // Subscribe to network data on mount
  onMount(() => {
    // Show permissions setup info
    setupOpenPermissions();
    
    // Add a test network directly
    try {
      console.log("Adding test network...");
      const testNetwork = {
        ssid: "Test WiFi",
        password: "test123",
        rating: 4.5,
        hasPassword: true,
        requiresPersonalInfo: false
      };
      
      addNetwork(testNetwork)
        .then(result => {
          console.log("Test network added successfully:", result);
        })
        .catch(err => {
          console.error("Error adding test network:", err);
          error = "Error adding test network: " + (err.message || String(err));
        });
    } catch (err) {
      console.error("Exception adding test network:", err);
    }
    
    // Subscribe to network data
    try {
      const unsubscribe = subscribeToNetworks((/** @type {Network[]} */ networkData) => {
        console.log("Received networks:", networkData);
        debugInfo = { receivedData: networkData };
        
        if (Array.isArray(networkData)) {
          networks = networkData;
        } else {
          networks = [];
          console.warn("Received non-array network data:", networkData);
        }
        
        isLoading = false;
      });
      
      // Cleanup subscription on component destroy
      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    } catch (err) {
      console.error("Error setting up subscription:", err);
      error = "Error setting up subscription: " + (err.message || String(err));
      isLoading = false;
      return () => {};
    }
  });
  
  /**
   * Handle adding a new network
   * @param {{ ssid: string, password: string, rating: number, hasPassword: boolean, requiresPersonalInfo: boolean }} network - The network to add
   */
  function handleAddNetwork(network) {
    console.log("Handling add network:", network);
    
    try {
      addNetwork(network)
        .then(result => {
          console.log("Network added successfully:", result);
        })
        .catch(err => {
          console.error("Error adding network:", err);
          error = "Error adding network: " + (err.message || String(err));
        });
    } catch (err) {
      console.error("Exception adding network:", err);
      error = "Exception adding network: " + (err.message || String(err));
    }
  }
  
  /**
   * Test direct database query
   */
  function testDirectQuery() {
    console.log("Testing direct query...");
    
    try {
      db.subscribeQuery({ networks: {} }, (resp) => {
        console.log("Direct query response:", resp);
        debugInfo = { directQueryResponse: resp };
      });
    } catch (err) {
      console.error("Error in direct query:", err);
    }
  }
</script>

<div class="container mx-auto px-4 py-8 max-w-5xl">
  <header class="mb-8 text-center">
    <h1 class="text-4xl font-bold text-blue-800 mb-2">Where's the good free Wi-Fi in Kitchener?</h1>
    <p class="text-gray-600 text-lg">Find and share free WiFi networks in the Kitchener area</p>
  </header>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <section>
      <AddNetworkForm onAddNetwork={handleAddNetwork} />
      
      <div class="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 class="text-lg font-semibold mb-2">InstantDB Permissions Setup</h3>
        <p class="text-sm text-gray-600 mb-2">
          To allow open access to your database, set the following permissions in your InstantDB dashboard:
        </p>
        <pre class="bg-gray-800 text-white p-3 rounded text-xs overflow-auto">
{`{
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
}`}
        </pre>
        
        <button 
          class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          on:click={testDirectQuery}
        >
          Test Direct Query
        </button>
      </div>
    </section>
    
    <section>
      {#if isLoading}
        <div class="flex justify-center items-center h-40">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      {:else if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      {:else if sortedNetworks.length === 0}
        <div class="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-yellow-800">No Networks Found</h3>
          <p class="text-yellow-700">
            No WiFi networks have been added yet. Be the first to add one!
          </p>
        </div>
      {:else}
        <NetworkList networks={sortedNetworks} />
      {/if}
    </section>
  </div>
  
  <div class="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
    <h3 class="text-lg font-semibold mb-2">Debug Info</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p class="mb-2">Raw Networks Data:</p>
        <pre class="bg-gray-800 text-white p-3 rounded text-xs overflow-auto h-60">
{JSON.stringify(networks, null, 2)}
        </pre>
      </div>
      <div>
        <p class="mb-2">Debug Info:</p>
        <pre class="bg-gray-800 text-white p-3 rounded text-xs overflow-auto h-60">
{JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>
    </div>
  </div>
</div>
