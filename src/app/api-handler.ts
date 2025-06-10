import { store } from './store';
import { startLoading, stopLoading } from './features/loading/loadingSlice';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

class ApiHandler {
  static async request(endpoint: string, method: string = 'GET', body?: any, query?: any, customHeaders?: any, requireToken: boolean = true) {
    // Start loading
    store.dispatch(startLoading());
    
    try {
      const currentLang = localStorage.getItem('preferredLanguage') || 'en';
      
      const headers = {
        'Accept': 'application/json',
        'Accept-Language': currentLang,
        ...customHeaders
      };

      // Only set Content-Type for non-FormData requests
      if (!(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }

      if (requireToken) {
        const token = localStorage.getItem('token');

        if (!token) {
          store.dispatch(stopLoading());
          window.location.replace('/cn-login');
          throw new Error('No authentication token found');
        }

        headers['Authorization'] = `Bearer ${token}`;
      }

      if (query) {
        endpoint += `?${toQueryString(query)}`;
      }

      const config: RequestInit = {
        method: method,
        headers: headers,
        credentials: 'include',
      };

      if (body) {
        config.body = body instanceof FormData ? body : JSON.stringify(body);
      }

      const response = await fetch(`${baseUrl}${endpoint}`, config);

      // Inside ApiHandler

      if (!response.ok) {
        const data = await response.json();
        
        if (data?.errors) {
          throw {
            message: data.message,
            errors: data.errors
          };
        } else {
          throw new Error(data.message || 'Failed API request');
        }
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    } finally {
      // Stop loading regardless of success or failure
      store.dispatch(stopLoading());
    }
  }
}

export default ApiHandler;

function toQueryString(params: any) {
  return Object.keys(params)
    .map(key => key + '=' + params[key])
    .join('&');
}

