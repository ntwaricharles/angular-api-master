import { TestBed } from '@angular/core/testing';
import { CachingService } from './caching.service';

describe('CachingService', () => {
  let service: CachingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CachingService);

    // Mock localStorage methods
    (global as any).localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set cache correctly', () => {
    const key = 'testKey';
    const data = { test: 'data' };
    const expiryTimeMs = 10 * 60 * 1000;

    service.setCache(key, data, expiryTimeMs);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      key,
      JSON.stringify(data)
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      key + '_expiry',
      (Date.now() + expiryTimeMs).toString()
    );
  });

  it('should get cache correctly', () => {
    const key = 'testKey';
    const data = JSON.stringify({ test: 'data' });
    const expiryTimeMs = 10 * 60 * 1000;
    const expiry = (Date.now() + expiryTimeMs).toString();

    (localStorage.getItem as jest.Mock).mockImplementation((k: string) => {
      if (k === key) return data;
      if (k === key + '_expiry') return expiry;
      return null;
    });

    const result = service.getCache(key, expiryTimeMs);
    expect(result).toEqual({ test: 'data' });
  });

  it('should return null for expired cache and remove it', () => {
    const key = 'testKey';
    const data = JSON.stringify({ test: 'data' });
    const expiryTimeMs = 10 * 60 * 1000;
    const expiry = (Date.now() - (expiryTimeMs + 1000)).toString(); // expired

    (localStorage.getItem as jest.Mock).mockImplementation((k: string) => {
      if (k === key) return data;
      if (k === key + '_expiry') return expiry;
      return null;
    });

    const result = service.getCache(key, expiryTimeMs);
    expect(result).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith(key);
    expect(localStorage.removeItem).toHaveBeenCalledWith(key + '_expiry');
  });

  it('should clear all cache', () => {
    service.clearCache();
    expect(localStorage.clear).toHaveBeenCalled();
  });

  it('should remove specific cache', () => {
    const key = 'testKey';

    service.removeCache(key);
    expect(localStorage.removeItem).toHaveBeenCalledWith(key);
    expect(localStorage.removeItem).toHaveBeenCalledWith(key + '_expiry');
  });
});
