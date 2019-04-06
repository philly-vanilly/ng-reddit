import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SubComponent } from './sub.component';
import { ReadService } from '@web/src/app/read.service';

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
  declarations: [SubComponent],
  providers: [
    ReadService
  ]
})
export class SubModule { }
