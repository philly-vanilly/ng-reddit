import { NgModule } from '@angular/core';
import { UiCardScrollerComponent } from './ui-card-scroller.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import { MatCardModule } from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { UiScrollModule } from 'ngx-ui-scroll';


@NgModule({
  imports: [
    CommonModule, // async pipe
    MatCardModule,
    LayoutModule,
    UiScrollModule,
    ScrollingModule,
    ExperimentalScrollingModule
  ],
  declarations: [UiCardScrollerComponent],
  exports: [UiCardScrollerComponent]
})
export class UiCardScrollerModule {}
