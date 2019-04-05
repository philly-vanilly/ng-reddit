import {
  AuthModule, AuthService,
  AuthState,
  getExpirationDateFromAuthData, getPreUserLoginDataFromStorage,
  hashDataToKeyValuePairs, InitialAuthService,
  RedirectHashAuthData, requestIsALoginRedirect
} from '@libs/auth/src';
import { async, getTestBed, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { ApplicationModule, Injector } from '@angular/core';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { MockModule } from 'ng-mocks';
import { RouterTestingModule } from '@angular/router/testing';

describe('InitialAuthService', () => {
  describe('getExpirationDateFromAuthData', () => {
    // as date: '2019-04-03T21:17:46.932Z'
    const expirationDateBase64Valid = 'MjAxOS0wNC0wM1QyMToxNzo0Ni45MzJa';
    const expirationInSecondsStringValid = '3600';

    it('should get right expiration date', () => {
      const expectedExpirationDateString = '2019-04-03T22:17:46.932Z'; // +1 hour

      const result: Date = getExpirationDateFromAuthData(expirationDateBase64Valid, expirationInSecondsStringValid);

      expect(result.toJSON()).toBe(expectedExpirationDateString);
    });

    it('should throw error on undefined state', () => {
      const expirationDateBase64 = undefined;
      let error: Error;

      try {
        getExpirationDateFromAuthData(expirationDateBase64, expirationInSecondsStringValid);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.name).toBe('InvalidCharacterError');
    });

    it('should throw error on non-base64 state', () => {
      const expirationDateBase64 = 'non_base_64';
      let error: Error;

      try {
        getExpirationDateFromAuthData(expirationDateBase64, expirationInSecondsStringValid);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.name).toBe('InvalidCharacterError');
    });

    it('should throw error on not a valid date', () => {
      const expirationDateBase64 = btoa('anything');
      let error: Error;

      try {
        getExpirationDateFromAuthData(expirationDateBase64, expirationInSecondsStringValid);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.message.startsWith('state does not contain a valid date')).toBeTruthy();
    });

    it('should throw error on undefined expiration', () => {
      const expirationInSecondsString = undefined;
      let error: Error;

      try {
        getExpirationDateFromAuthData(expirationDateBase64Valid, expirationInSecondsString);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.message.startsWith('expires_in is not a valid number')).toBeTruthy();
    });

    it('should throw error on non-positive expiration', () => {
      const expirationInSecondsString = '0';
      let error: Error;

      try {
        getExpirationDateFromAuthData(expirationDateBase64Valid, expirationInSecondsString);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.message.startsWith('expires_in is not a valid number')).toBeTruthy();
    });
  });

  describe('hashDataToKeyValuePairs', () => {
    const access_token = '272076716164-Y6u57GLIE1DQDYRzUX1UKa6N5pE';
    const token_type = 'bearer';
    const state = 'MjAxOS0wNC0wNFQwOTowNDozNi42NDJa';
    const expires_in = '3600';
    const scope = 'read';

    it('should convert valid hash-string to auth data', () => {
      const dummyHash = `#access_token=${access_token}&token_type=${token_type}&state=${state}&expires_in=${expires_in}&scope=${scope}`;

      const res: RedirectHashAuthData = hashDataToKeyValuePairs(dummyHash);

      expect(res).toBeDefined();
      expect(res.access_token).toBe(access_token);
      expect(res.token_type).toBe(token_type);
      expect(res.state).toBe(state);
      expect(res.expires_in).toBe(expires_in);
      expect(res.scope).toBe(scope);
    });

    it('should return undefined on not all required properties', () => {
      const dummyHash = `#access_token=${access_token}`;

      const res: RedirectHashAuthData = hashDataToKeyValuePairs(dummyHash);

      expect(res).toBeUndefined();
    });

    it('should return undefined on too many properties', () => {
      const dummyHash = `#foo=bar&access_token=${access_token}&token_type=${token_type}&state=${state}&expires_in=${expires_in}&scope=${scope}`;

      const res: RedirectHashAuthData = hashDataToKeyValuePairs(dummyHash);

      expect(res).toBeUndefined();
    });
  });

  describe('requestIsALoginRedirect', () => {
    it('should return true on defined values', () => {
      const savedState = 'foo';
      const hashData = '#bar';

      const result: boolean = requestIsALoginRedirect(savedState, hashData);

      expect(result).toBeTruthy();
    });

    it('should return false on undefined savedState', () => {
      const savedState = undefined;
      const hashData = '#bar';

      const result: boolean = requestIsALoginRedirect(savedState, hashData);

      expect(result).toBeFalsy();
    });

    it('should return false on undefined hashData', () => {
      const savedState = 'foo';
      const hashData = undefined;

      const result: boolean = requestIsALoginRedirect(savedState, hashData);

      expect(result).toBeFalsy();
    });

    it('should return false on value-less hashData', () => {
      const savedState = 'foo';
      const hashData = '#';

      const result: boolean = requestIsALoginRedirect(savedState, hashData);

      expect(result).toBeFalsy();
    });
  });

  describe('getPreUserLoginDataFromStorage', () => {
    beforeEach(() => {
      const store = {};
      const mockLocalStorage = {
        getItem: (key: string): string => {
          return key in store ? store[key] : null;
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        setItem: (key: string, value: string) => {
          store[key] = `${value}`;
        }
      };
      spyOn(sessionStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
      spyOn(sessionStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
      spyOn(sessionStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    });

    it('should get valid data from storage and delete it afterwards', () => {
      const storageTokenA = 'a';
      const storageTokenB = 'b';
      const storageValueA = 'x';
      const storageValueB = 'y';

      sessionStorage.setItem(storageTokenA, storageValueA);
      sessionStorage.setItem(storageTokenB, storageValueB);
      const {savedState, urlTreeSerialized} = getPreUserLoginDataFromStorage(storageTokenA, storageTokenB);
      const storageItemAfterFunctionCallA = sessionStorage.getItem(storageTokenA);
      const storageItemAfterFunctionCallB = sessionStorage.getItem(storageTokenB);

      expect(savedState).toBe(storageValueA);
      expect(urlTreeSerialized).toBe(storageValueB);
      expect(storageItemAfterFunctionCallA).toBeNull();
      expect(storageItemAfterFunctionCallB).toBeNull();
    });
  });

  describe('initAuth', () => {
    let store: Store;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          MockModule(NgxsModule.forRoot([AuthState]))
        ],
        providers: [
          InitialAuthService,
          Injector,
          {provide: AuthService, useValue: jest.fn()}
        ]
      }).compileComponents();
      store = TestBed.get(Store);
    }));

    it('should be created', () => {
      const service: InitialAuthService = TestBed.get(InitialAuthService);
      expect(service).toBeTruthy();
    });
  });
});
