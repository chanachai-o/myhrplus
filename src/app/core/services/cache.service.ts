import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

interface CacheEntry<T> {
  data: T;
  expiry: number;
  accessedAt: number; // For LRU tracking
}

/**
 * CacheService with LRU (Least Recently Used) strategy
 * Automatically evicts least recently used entries when cache is full
 */
@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes
  private maxSize = 100; // Maximum cache entries

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now > entry.expiry) {
      // Expired, remove from cache
      this.cache.delete(key);
      return null;
    }

    // Update access time for LRU (move to end)
    this.updateAccessOrder(key, entry);

    return entry.data as T;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiry = now + (ttl || this.defaultTTL);

    // Remove expired entries first
    this.cleanExpiredEntries();

    // If cache is full and key doesn't exist, evict least recently used
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    // Update or add entry (will be at the end for LRU)
    const existingEntry = this.cache.get(key);
    if (existingEntry) {
      // Update existing entry
      existingEntry.data = data;
      existingEntry.expiry = expiry;
      existingEntry.accessedAt = now;
      // Move to end (remove and re-add)
      this.cache.delete(key);
      this.cache.set(key, existingEntry);
    } else {
      // Add new entry
      this.cache.set(key, {
        data,
        expiry,
        accessedAt: now
      });
    }
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Helper method to cache Observable results
  cacheObservable<T>(
    key: string,
    observable: Observable<T>,
    ttl?: number
  ): Observable<T> {
    const cached = this.get<T>(key);
    
    if (cached !== null) {
      return of(cached);
    }

    return observable.pipe(
      tap(data => this.set(key, data, ttl))
    );
  }

  /**
   * Update access order for LRU (move to end)
   */
  private updateAccessOrder(key: string, entry: CacheEntry<any>): void {
    entry.accessedAt = Date.now();
    // Move to end (remove and re-add)
    this.cache.delete(key);
    this.cache.set(key, entry);
  }

  /**
   * Evict least recently used entry (first in Map)
   */
  private evictLRU(): void {
    if (this.cache.size === 0) return;

    // Find least recently used (oldest accessedAt)
    let lruKey: string | null = null;
    let oldestAccess = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.accessedAt < oldestAccess) {
        oldestAccess = entry.accessedAt;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
    }
  }

  /**
   * Clean expired entries
   */
  private cleanExpiredEntries(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; maxSize: number; usage: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      usage: Math.round((this.cache.size / this.maxSize) * 100)
    };
  }

  /**
   * Set maximum cache size
   */
  setMaxSize(maxSize: number): void {
    this.maxSize = maxSize;
    // If current size exceeds new max, evict entries
    while (this.cache.size > this.maxSize) {
      this.evictLRU();
    }
  }
}





