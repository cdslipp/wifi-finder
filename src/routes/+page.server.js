import { id } from '@instantdb/core';
import { db } from '$lib/db.js';
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
  addNetwork: async ({ request }) => {
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
    
    // Validate form
    if (!ssid) {
      return fail(400, { 
        error: 'SSID is required',
        values: {
          ssid, password, rating, hasPassword, 
          requiresEmail, requiresPhone, requiresWatchAd, requiresPersonalInfo
        }
      });
    }
    
    if (hasPassword && !password) {
      return fail(400, { 
        error: 'Password is required when "Has Password" is checked',
        values: {
          ssid, password, rating, hasPassword, 
          requiresEmail, requiresPhone, requiresWatchAd, requiresPersonalInfo
        }
      });
    }
    
    try {
      // Add network to database
      const result = await db.transact(
        db.tx.networks[id()].update({
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
        })
      );
      
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
    try {
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
      
      const result = await db.transact(
        db.tx.networks[id()].update(testNetwork)
      );
      
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