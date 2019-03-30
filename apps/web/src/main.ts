import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { BootstrapModuleFn, hmr, WebpackModule } from '@ngxs/hmr-plugin';

declare const module: WebpackModule;

if (environment.production) {
  enableProdMode();
}

const bootstrap: BootstrapModuleFn = () => platformBrowserDynamic().bootstrapModule(AppModule);

// see https://ngxs.gitbook.io/ngxs/plugins/hmr
if (environment.hmr) {
  hmr(module, bootstrap).catch(err => console.error(err));
} else {
  bootstrap().catch(err => console.log(err));
}
