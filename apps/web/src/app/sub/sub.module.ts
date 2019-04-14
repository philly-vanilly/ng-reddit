import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SubComponent } from './sub.component';
import { ReadService } from '@web/src/app/read.service';
import { ActiveSubPipe } from '@web/src/app/sub/active-sub.pipe';
import { UiCardScrollerModule } from '@libs/ui/organism/ui-card-scroller/src';
import { MatProgressBarModule } from '@angular/material';
import { SubsPostsPipe } from '@web/src/app/sub/subs-posts.pipe';

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
          redirectTo: 'all',
          pathMatch: 'full'
        }
      ]
    ),
    UiCardScrollerModule,
    MatProgressBarModule,
  ],
  declarations: [SubComponent, ActiveSubPipe, SubsPostsPipe],
  providers: [
    ReadService
  ]
})
export class SubModule { }
