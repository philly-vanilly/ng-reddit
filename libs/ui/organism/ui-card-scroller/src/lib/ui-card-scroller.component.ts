import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { SubPost } from '@web/src/app/models/subreddit-listing';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'ui-card-scroller',
  template: `    
      <cdk-virtual-scroll-viewport
        [style.height]="'calc(100vh - 50px)'"
        itemSize="200"
        class="viewport"
        [class.handset]="isHandset"
      >
        <mat-card *cdkVirtualFor="let post of posts" matRipple [style.height]="'auto'">
          <mat-card-title>{{post.title}}</mat-card-title>
          <img mat-card-image [src]="post.thumbnail" [alt]="post.url">
          <mat-card-content>Author {{post.author}}</mat-card-content>
        </mat-card>
      </cdk-virtual-scroll-viewport>
  `,
  styleUrls: ['./ui-card-scroller.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiCardScrollerComponent implements OnInit {
  @Input() posts: SubPost[]; // TODO: make own ui-specific model
  isHandset = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef
  ) {
    breakpointObserver.observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait]).subscribe(result => {
      console.log("Handset? " + result.matches);
      this.isHandset = result.matches;
      this.cdr.markForCheck();
    });
  }
  ngOnInit() {
  }

}
