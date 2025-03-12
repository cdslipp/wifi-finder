<script>
  // Define props for the callback
  let onAddNetwork = $props();
  
  let ssid = $state('');
  let password = $state('');
  let rating = $state(5);
  let hasPassword = $state(true);
  let requiresPersonalInfo = $state(false);
  let formError = $state('');
  let hoveredRating = $state(0);
  
  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  function handleSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!ssid.trim()) {
      formError = 'SSID is required';
      return;
    }
    
    // Only validate password if hasPassword is true
    if (hasPassword && !password.trim()) {
      formError = 'Password is required';
      return;
    }
    
    // Call the callback with new network data
    if (typeof onAddNetwork === 'function') {
      onAddNetwork({
        ssid: ssid.trim(),
        password: hasPassword ? password.trim() : '',
        rating: Number(rating),
        hasPassword,
        requiresPersonalInfo
      });
    }
    
    // Reset form
    ssid = '';
    password = '';
    rating = 5;
    hasPassword = true;
    requiresPersonalInfo = false;
    formError = '';
  }
  
  /**
   * Set the rating when a star is clicked
   * @param {number} value - The rating value
   */
  function setRating(value) {
    rating = value;
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
   * Toggle the hasPassword state
   */
  function toggleHasPassword() {
    hasPassword = !hasPassword;
    if (!hasPassword) {
      password = '';
    }
  }
</script>

<div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
  <h2 class="text-2xl font-bold mb-4">Add a New WiFi Network</h2>
  
  <form on:submit={handleSubmit} class="space-y-4">
    {#if formError}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {formError}
      </div>
    {/if}
    
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
    
    {#if hasPassword}
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="text"
          id="password"
          bind:value={password}
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g. coffee123"
        />
      </div>
    {/if}
    
    <div class="flex items-center">
      <input
        type="checkbox"
        id="requiresPersonalInfo"
        bind:checked={requiresPersonalInfo}
        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label for="requiresPersonalInfo" class="ml-2 block text-sm text-gray-700">
        Requires personal info (phone/email) to connect
      </label>
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
      class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Add Network
    </button>
  </form>
</div> 