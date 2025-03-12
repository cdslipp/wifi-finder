import { id } from '@instantdb/core';
import { db, logDbStatus, addNetworkDirectly, addTestNetwork } from '$lib/db.js';
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
  addNetwork: async ({ request }) => {
    console.log("Form submission received for addNetwork");
    const formData = await request.formData();
    
    // Extract form values
    const ssid = formData.get('ssid');
    const password = formData.get('password') || '';
    const rating = Number(formData.get('rating'));
    const hasPassword = formData.get('hasPassword') === 'on';
    const requiresEmail = formData.get('requiresEmail') === 'on';
    const requiresPhone = formData.get('requiresPhone') === 'on';
    const requiresWatchAd = formData.get('requiresWatchAd') === 'on';
    const requiresPersonalInfo = formData.get('requiresPersonalInfo') === 'on';
    
    console.log("Form data extracted:", { 
      ssid, password, rating, hasPassword, 
      requiresEmail, requiresPhone, requiresWatchAd, requiresPersonalInfo 
    });
    
    // Log database status for debugging
    logDbStatus();
    
    // Validate form
    if (!ssid) {
      console.log("Validation failed: SSID is required");
      return fail(400, { 
        error: 'SSID is required',
        values: {
          ssid, password, rating, hasPassword, 
          requiresEmail, requiresPhone, requiresWatchAd, requiresPersonalInfo
        }
      });
    }
    
    if (hasPassword && !password) {
      console.log("Validation failed: Password is required when 'Has Password' is checked");
      return fail(400, { 
        error: 'Password is required when "Has Password" is checked',
        values: {
          ssid, password, rating, hasPassword, 
          requiresEmail, requiresPhone, requiresWatchAd, requiresPersonalInfo
        }
      });
    }
    
    try {
      // Create network object
      const networkData = {
        ssid: ssid ? String(ssid) : '',
        password: hasPassword ? String(password) : '',
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
      
      // Use the direct method to add the network
      const result = await addNetworkDirectly(networkData);
      
      console.log('Network added successfully:', result);
      
      return {
        success: true,
        message: 'Network added successfully!'
      };
    } catch (err) {
      console.error('Error adding network:', err);
      
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      return fail(500, { 
        error: 'Failed to add network: ' + errorMessage,
        values: {
          ssid, password, rating, hasPassword, 
          requiresEmail, requiresPhone, requiresWatchAd, requiresPersonalInfo
        }
      });
    }
  },
  
  addTestNetwork: async () => {
    console.log("Request received for addTestNetwork");
    
    try {
      // Log database status for debugging
      logDbStatus();
      
      // Use the dedicated test network function
      const result = await addTestNetwork();
      
      console.log('Test network added successfully:', result);
      
      return {
        success: true,
        message: 'Test network added successfully!'
      };
    } catch (err) {
      console.error('Error adding test network:', err);
      
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      return fail(500, { 
        error: 'Failed to add test network: ' + errorMessage
      });
    }
  }
}; 