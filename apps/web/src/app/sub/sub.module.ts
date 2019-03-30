import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SubComponent } from './sub.component';
import { NgxsModule } from '@ngxs/store';
import { SubState } from './sub.store';
import { ReadService } from '@web/src/app/read.service';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([
      SubState
    ]),
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
  declarations: [SubComponent],
  providers: [
    ReadService
  ]
})
export class SubModule { }
