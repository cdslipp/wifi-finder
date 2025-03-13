<script>
  import { onMount } from 'svelte';
  import { db, addNetworkDirectly, addTestNetwork } from '$lib/db.js';
  import toast, { Toaster } from 'svelte-5-french-toast';
  
  // Form state
  let ssid = $state('');
  let password = $state('');
  let rating = $state(5);
  let hasPassword = $state(false);
  let requiresEmail = $state(false);
  let requiresPhone = $state(false);
  let requiresWatchAd = $state(false);
  let requiresPersonalInfo = $state(false);
  
  // UI state
  let isLoading = $state(true);
  let isSubmitting = $state(false);
  /** @type {string|null} */
  let error = $state(null);
  /** @type {string|null} */
  let success = $state(null);
  /** @type {any[]} */
  let networks = $state([]);
  let hoveredRating = $state(0);
  
  // Derived value for sorted networks
  let sortedNetworks = $derived(
    networks && networks.length 
      ? [...networks].sort((a, b) => (b.rating || 0) - (a.rating || 0))
      : []
  );
  
  /**
   * Set error message
   * @param {unknown} err - Error object or message
   * @param {string} prefix - Prefix for the error message
   */
  function setError(err, prefix) {
    const errorMessage = prefix + ": " + 
      (err instanceof Error ? err.message : String(err));
    console.error(errorMessage);
    error = errorMessage;
    toast.error(errorMessage);
  }
  
  /**
   * Subscribe to network data
   */
  function subscribeToNetworkData() {
    console.log("Setting up subscription...");
    
    return db.subscribeQuery({ networks: {} }, (resp) => {
      console.log("Subscription response:", resp);
      
      if (resp.error) {
        setError(resp.error, "Database error");
        return;
      }
      
      if (resp.data && resp.data.networks) {
        console.log("Networks from DB:", resp.data.networks);
        networks = resp.data.networks;
      } else {
        console.log("No networks found in response");
        networks = [];
      }
      
      isLoading = false;
    });
  }
  
  /**
   * Set the rating when a star is clicked
   * @param {number} value - The rating value
   */
  function setRating(value) {
    rating = value;
    hoveredRating = 0;
  }
  
  /**
   * Set the hovered rating for preview
   * @param {number} value - The hovered rating value
   */
  function setHoveredRating(value) {
    hoveredRating = value;
  }
  
  /**
   * Clear the hovered rating
   */
  function clearHoveredRating() {
    hoveredRating = 0;
  }
  
  /**
   * Handle form submission to add a new network
   * @param {Event} event - The form submission event
   */
  async function handleAddNetwork(event) {
    event.preventDefault();
    
    // Validate form
    if (!ssid) {
      setError("SSID is required", "Validation Error");
      return;
    }
    
    if (hasPassword && !password) {
      setError("Password is required when 'Has Password' is checked", "Validation Error");
      return;
    }
    
    let loadingId;
    
    try {
      isSubmitting = true;
      error = null;
      success = null;
      
      loadingId = toast.loading('Adding network...');
      
      // Create network object
      const networkData = {
        ssid,
        password: hasPassword ? password : '',
        rating,
        reviews: 1,
        createdAt: Date.now(),
        hasPassword,
        requiresEmail,
        requiresPhone,
        requiresWatchAd,
        requiresPersonalInfo
      };
      
      console.log('Adding network with data:', networkData);
      
      // Add network to database
      const result = await addNetworkDirectly(networkData);
      
      console.log('Network added successfully:', result);
      
      // Reset form
      ssid = '';
      password = '';
      rating = 5;
      hasPassword = false;
      requiresEmail = false;
      requiresPhone = false;
      requiresWatchAd = false;
      requiresPersonalInfo = false;
      
      // Show success message
      success = 'Network added successfully!';
      toast.dismiss(loadingId);
      toast.success('Network added successfully!');
    } catch (err) {
      console.error('Error adding network:', err);
      setError(err, 'Failed to add network');
      if (loadingId) toast.dismiss(loadingId);
    } finally {
      isSubmitting = false;
    }
  }
  
  /**
   * Handle adding a test network
   */
  async function handleAddTestNetwork() {
    let loadingId;
    
    try {
      isSubmitting = true;
      error = null;
      success = null;
      
      loadingId = toast.loading('Adding test network...');
      
      // Add test network to database
      const result = await addTestNetwork();
      
      console.log('Test network added successfully:', result);
      
      // Show success message
      success = 'Test network added successfully!';
      toast.dismiss(loadingId);
      toast.success('Test network added successfully!');
    } catch (err) {
      console.error('Error adding test network:', err);
      setError(err, 'Failed to add test network');
      if (loadingId) toast.dismiss(loadingId);
    } finally {
      isSubmitting = false;
    }
  }
  
  // Subscribe to network data on mount
  onMount(() => {
    console.log("Component mounted");
    
    // Set up subscription
    const unsubscribe = subscribeToNetworkData();
    
    // Cleanup subscription on component destroy
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  });
</script>

<Toaster />

<div class="container mx-auto px-4 py-8 max-w-5xl">
  <header class="mb-8 text-center">
    <h1 class="text-4xl font-bold text-blue-800 mb-2">Where's the good free Wi-Fi in Kitchener?</h1>
    <p class="text-gray-600 text-lg">Find and share free WiFi networks in the Kitchener area</p>
  </header>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <section>
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 class="text-2xl font-bold mb-4">Add a New WiFi Network</h2>
        
        {#if error}
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        {/if}
        
        {#if success}
          <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        {/if}
        
        <form on:submit={handleAddNetwork} class="space-y-4">
          <div>
            <label for="ssid" class="block text-sm font-medium text-gray-700 mb-1">
              Network Name (SSID)
            </label>
            <input
              type="text"
              id="ssid"
              bind:value={ssid}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Kitchener Public Library"
            />
          </div>
          
          <div class="flex items-center">
            <input
              type="checkbox"
              id="hasPassword"
              bind:checked={hasPassword}
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="hasPassword" class="ml-2 block text-sm text-gray-700">
              This network requires a password
            </label>
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Password (if required)
            </label>
            <input
              type="text"
              id="password"
              bind:value={password}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. coffee123"
            />
          </div>
          
          <div class="border-t border-gray-200 pt-4 mt-4">
            <h3 class="text-lg font-medium mb-2">Connection Requirements</h3>
            <p class="text-sm text-gray-600 mb-3">Did you need to:</p>
            
            <div class="space-y-2">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="requiresEmail"
                  bind:checked={requiresEmail}
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="requiresEmail" class="ml-2 block text-sm text-gray-700">
                  Enter email address
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="requiresPhone"
                  bind:checked={requiresPhone}
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="requiresPhone" class="ml-2 block text-sm text-gray-700">
                  Enter phone number
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="requiresWatchAd"
                  bind:checked={requiresWatchAd}
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="requiresWatchAd" class="ml-2 block text-sm text-gray-700">
                  Watch an advertisement
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="requiresPersonalInfo"
                  bind:checked={requiresPersonalInfo}
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="requiresPersonalInfo" class="ml-2 block text-sm text-gray-700">
                  Other personal information required
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <div 
              class="flex items-center" 
              on:mouseleave={clearHoveredRating}
            >
              {#each Array(5) as _, i}
                <button
                  type="button"
                  on:click={() => setRating(i + 1)}
                  on:mouseenter={() => setHoveredRating(i + 1)}
                  class="w-8 h-8 focus:outline-none"
                >
                  <svg 
                    class="w-8 h-8 {(hoveredRating > 0 ? i < hoveredRating : i < rating) ? 'text-yellow-400' : 'text-gray-300'}" 
                    fill="currentColor" 
                    viewBox="0 0 20 20" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </button>
              {/each}
              <span class="ml-2 text-gray-700 font-medium">{rating} / 5</span>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding...' : 'Add Network'}
          </button>
        </form>
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
        <div class="space-y-4">
          <h2 class="text-2xl font-bold">Top WiFi Networks in Kitchener</h2>
          
          <div class="space-y-4">
            {#each sortedNetworks as network (network.id)}
              <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-xl font-semibold">{network.ssid}</h3>
                    <div class="mt-1 flex items-center">
                      <div class="flex items-center">
                        {#each Array(5) as _, i}
                          <svg 
                            class="w-5 h-5 {i < Math.floor(network.rating) ? 'text-yellow-400' : 'text-gray-300'}" 
                            fill="currentColor" 
                            viewBox="0 0 20 20" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        {/each}
                        <span class="ml-1 text-gray-600 text-sm">({network.rating.toFixed(1)})</span>
                      </div>
                      <span class="ml-2 text-sm text-gray-500">{network.reviews} {network.reviews === 1 ? 'review' : 'reviews'}</span>
                    </div>
                    
                    <div class="mt-2 flex flex-wrap gap-2">
                      {#if network.hasPassword !== undefined}
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium {network.hasPassword ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}">
                          {network.hasPassword ? 'Password Required' : 'No Password'}
                        </span>
                      {/if}
                    </div>
                    
                    <div class="mt-2">
                      <h4 class="text-sm font-medium text-gray-700">Connection Requirements:</h4>
                      <ul class="mt-1 space-y-1">
                        {#if network.requiresEmail}
                          <li class="flex items-center text-xs text-red-600">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd"></path>
                            </svg>
                            Requires email address
                          </li>
                        {/if}
                        
                        {#if network.requiresPhone}
                          <li class="flex items-center text-xs text-red-600">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd"></path>
                            </svg>
                            Requires phone number
                          </li>
                        {/if}
                        
                        {#if network.requiresWatchAd}
                          <li class="flex items-center text-xs text-red-600">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd"></path>
                            </svg>
                            Requires watching an ad
                          </li>
                        {/if}
                        
                        {#if network.requiresPersonalInfo}
                          <li class="flex items-center text-xs text-red-600">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd"></path>
                            </svg>
                            Requires other personal information
                          </li>
                        {/if}
                        
                        {#if !network.requiresEmail && !network.requiresPhone && !network.requiresWatchAd && !network.requiresPersonalInfo}
                          <li class="flex items-center text-xs text-green-600">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            No additional requirements
                          </li>
                        {/if}
                      </ul>
                    </div>
                    
                    {#if network.createdAt}
                      <div class="text-xs text-gray-500 mt-1">
                        Added {new Date(network.createdAt).toLocaleDateString()}
                      </div>
                    {/if}
                  </div>
                  
                  {#if network.hasPassword && network.password}
                    <div class="bg-gray-100 px-3 py-1 rounded-md">
                      <div class="font-mono text-sm">
                        Password: {network.password}
                      </div>
                    </div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </section>
  </div>
</div>
