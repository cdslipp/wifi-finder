<script>
  // Define props
  let networks = $props();
  
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
</script>

<div class="space-y-4">
  <h2 class="text-2xl font-bold">Top WiFi Networks in Kitchener</h2>
  
  {#if !networks || networks.length === 0}
    <p class="text-gray-500 italic">No networks added yet. Be the first to add one!</p>
  {:else}
    <div class="space-y-4">
      {#each networks as network (network.id)}
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
                
                {#if network.requiresPersonalInfo !== undefined}
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium {network.requiresPersonalInfo ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
                    {network.requiresPersonalInfo ? 'Requires Personal Info' : 'No Personal Info Required'}
                  </span>
                {/if}
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
  {/if}
</div> 