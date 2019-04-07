import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SubComponent } from './sub.component';
import { ReadService } from '@web/src/app/read.service';
import { ActiveSubPipe } from '@web/src/app/sub/active-sub.pipe';

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
    )
  ],
  declarations: [SubComponent, ActiveSubPipe],
  providers: [
    ReadService
  ]
})
export class SubModule { }
