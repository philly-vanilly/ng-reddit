import { async, TestBed } from '@angular/core/testing';
import { MockModule } from 'ng-mocks';
import { AuthService, AuthState, InitialAuthService } from '@libs/auth/src';
import { Injector } from '@angular/core';
import { Store, NgxsModule } from '@ngxs/store';

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
