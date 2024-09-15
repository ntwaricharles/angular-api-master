import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class CachingService {
  private expiryKeySuffix = '_expiry';

  constructor() {}

  // Get cached data and check expiry
  getCache(key: string, expiryTimeMs: number = 5 * 60 * 1000): any {
    const data = localStorage.getItem(key);
    const expiry = localStorage.getItem(key + this.expiryKeySuffix);
    const now = Date.now();

    if (expiry && now - Number(expiry) > expiryTimeMs) {
      this.removeCache(key); // Remove expired cache
      return null;
    }

    return data ? JSON.parse(data) : null;
  }

  // Set cache with expiry time
  setCache(key: string, data: any, expiryTimeMs: number = 5 * 60 * 1000): void {
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(
      key + this.expiryKeySuffix,
      (Date.now() + expiryTimeMs).toString()
    );
  }

  // Clear all cache
  clearCache(): void {
    localStorage.clear();
  }

  // Remove specific cache
  removeCache(key: string): void {
    localStorage.removeItem(key);
    localStorage.removeItem(key + this.expiryKeySuffix); // Also remove expiry timestamp
  }
}
