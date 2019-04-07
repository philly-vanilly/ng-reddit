import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SubComponent } from './sub.component';
import { ReadService } from '@web/src/app/read.service';
import { ActiveSubPipe } from '@web/src/app/sub/active-sub.pipe';
import { UiCardScrollerModule } from '@libs/ui/organism/ui-card-scroller/src';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(
      [
        {
          path: ':id',
          component: SubComponent
        },
        {
          path: '**',
          redirectTo: '',
          pathMatch: 'full'
        }
      ]
    ),
    UiCardScrollerModule
  ],
  declarations: [SubComponent, ActiveSubPipe],
  providers: [
    ReadService
  ]
})
export class SubModule { }
