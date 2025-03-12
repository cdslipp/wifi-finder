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
   * @property {boolean} requiresEmail - Whether the network requires email
   * @property {boolean} requiresPhone - Whether the network requires phone
   * @property {boolean} requiresWatchAd - Whether the network requires watching an ad
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
  {/if}
</div> 