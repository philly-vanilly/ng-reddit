import { SubState } from '@web/src/app/sub/sub.store';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule, StorageOption } from '@ngxs/storage-plugin';
import { environment } from '@web/src/environments/environment';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';

const states = [SubState];

@NgModule({
  imports: [
    NgxsStoragePluginModule.forRoot({ // needs to be imported before NgxsModule to be available on initialization
      key: ['auth'], // string or array of strings that can be deeply nested via dot notation, eg 'auth.user'
      storage: StorageOption.SessionStorage
    }),
    NgxsModule.forRoot(states, {
      // developmentMode freezes the store and makes JS objects immutable which doesn't work with Entity ATM
      // https://github.com/ngxs-labs/entity-state/issues/52
      developmentMode: false // !environment.production
    }),
    NgxsRouterPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot({
      maxAge: 100,
      name: environment.appName,
      disabled: environment.production
    }),
    NgxsLoggerPluginModule.forRoot({
      disabled: true, // environment.production,
      collapsed: true,
      logger: console
    }),
  ],
  exports: [NgxsModule]
})
export class StoreModule {}
