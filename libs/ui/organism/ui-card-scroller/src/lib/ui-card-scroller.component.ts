import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Observable } from 'rxjs';
import { IDatasource } from 'ngx-ui-scroll';
import { Sub } from '@web/src/app/sub/sub.store';
import { filter } from 'rxjs/internal/operators/filter';
import { take } from 'rxjs/operators';
import { tap } from 'rxjs/internal/operators/tap';

@Component({
  selector: 'ui-card-scroller',
  template: `    
<div class="ui-card-scroller_container">
  <cdk-virtual-scroll-viewport
    [style.height]="viewportHeight"
    [class.handset]="isHandset"
    (scrolledIndexChange)="onScrollIndexChange()"
    itemSize="400"
    class="ui-card-scroller_viewport"
  >
<!--    <ng-container *ngIf="(sub$ | async).posts; let posts">-->
    <mat-card *cdkVirtualFor="let post of (sub$ | async)?.posts" [style.height.px]="400">
      <mat-card-title>{{post.title}}</mat-card-title>
      <img mat-card-image
           [src]="post.thumbnail"
           [style.height.px]="post.thumbnail_height"
           [style.width.px]="post.thumbnail_width"
           [alt]="post.url"
      >
      <mat-card-content>Author {{post.author}}</mat-card-content>
    </mat-card>
  </cdk-virtual-scroll-viewport>
</div>
  `,
  styleUrls: ['./ui-card-scroller.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiCardScrollerComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;
  @Input() sub$: Observable<Sub>;
  @Input() postsLength = 0;
  @Input() headerHeight = 50;
  @Output() scrollEndReached = new EventEmitter<number>();
  isHandset = false;



  constructor(
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef
  ) {
    breakpointObserver.observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait]).subscribe(result => {
      this.isHandset = result.matches;
      this.cdr.markForCheck();
    });
  }
  ngOnInit() {
    // this.scrollEndReached.emit(1);
  }

  get viewportHeight(): string {
    return `calc(100vh - ${this.headerHeight}px)`;
  }

  onScrollIndexChange() {
     const end = this.viewport.getRenderedRange().end;
     const total = this.viewport.getDataLength();

    console.log("SCROLLINDEXCHANGE. END = "+end+" TOTAL = "+total);
     if (end === total) {
       this.scrollEndReached.emit(end);
     }
  }
}


// <!--    <div class="ui-card-scroller_container">-->
// <!--        <mat-card-->
// <!--          *uiScroll="let post of datasource">-->
// <!--          <mat-card-title>{{ post.title }}</mat-card-title>-->
// <!--          <div class="ui-card-scroller_image-container">-->
// <!--            <img mat-card-image-->
// <!--                 [src]="post.thumbnail"-->
// <!--            >-->
// <!--          </div>-->
// <!--          <mat-card-content>Author {{ post.author }}</mat-card-content>-->
// <!--        </mat-card>-->
// <!--    </div>-->

// datasource: IDatasource = {
//   get: (index, count, success) => {
//     const lastRequestedIndex: number = index + count;
//     console.log("GET CALL: " + lastRequestedIndex);
//     if (lastRequestedIndex + 1 > this.postsLength) { // +1 because index starts at 0
//       this.scrollEndReached.emit(lastRequestedIndex);
//     }
//     this.sub$.pipe(
//       tap(sub => {
//         console.log("POSTS-LENGTH: " + sub.posts.length + " LAST REQUESTED INDEX: " + lastRequestedIndex);
//       }),
//       filter(sub => !!sub.posts[index] && !!sub.posts[lastRequestedIndex]),
//       take(1)
//     ).subscribe(sub => {
//       const data = sub.posts
//         .map(post => ({title: post.title, thumbnail: post.thumbnail}))
//         .slice(index, lastRequestedIndex)
//       ;
//       console.log("POSTS UPDATE: " + JSON.stringify(data));
//       success(data)
//     });
//   },
//   settings: {
//     minIndex: 0,
//     startIndex: 0,
//     windowViewport: true,
//     infinite: false
//   }
// };
