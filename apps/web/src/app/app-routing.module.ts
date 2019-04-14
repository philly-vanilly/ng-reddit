import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';

const routes = [
  {
    path: 'r',
    loadChildren: './sub/sub.module#SubModule'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        initialNavigation: 'enabled', // https://angular.io/api/router/ExtraOptions#initialNavigation
        preloadingStrategy: PreloadAllModules,
        useHash: false,
        enableTracing: false,
        // the following keys are for using hash-fragment-scrolling with angular router
        onSameUrlNavigation: 'reload', // this allows anchor-scrolling within the same page
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
        scrollOffset: [0, 0] // [x, y]
      }
    ),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
