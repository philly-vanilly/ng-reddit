import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Observable, Subject } from 'rxjs';
import { Sub } from '@web/src/app/sub/sub.store';
import { map, takeUntil } from 'rxjs/operators';
import { Post } from '@libs/shared-models/src';

@Component({
  selector: 'ui-card-scroller',
  template: `    
<mat-progress-bar *ngIf="(sub$ | async)?.isLoading" mode="query" class="ui-card-scroller_progress-bar"></mat-progress-bar>
<cdk-virtual-scroll-viewport
  [style.height]="viewportHeight"
  [class.handset]="isHandset"
  (scrolledIndexChange)="onScrollIndexChange()"
  itemSize="100"
  class="ui-card-scroller_viewport"
>
  <mat-card *cdkVirtualFor="let postID of (sub$ | async)?.postIDs" [style.height.px]="100">
    <mat-card-title>{{ (postsMap$ | async)[postID].title}}</mat-card-title>
<!--      <img mat-card-image-->
<!--           [src]="post.thumbnail"-->
<!--           [style.height.px]="post.thumbnail_height"-->
<!--           [style.width.px]="post.thumbnail_width"-->
<!--           [alt]="post.url"-->
<!--      >-->
    <mat-card-content>ID {{postID}}</mat-card-content>
  </mat-card>
</cdk-virtual-scroll-viewport>
  `,
  styleUrls: ['./ui-card-scroller.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiCardScrollerComponent implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;
  @Input() sub$: Observable<Sub>;
  @Input() postsMap$: Observable<{ [name: string]: Post }>;
  @Input() offsetTop = 0;
  @Input() headerHeight = 0;
  @Output() scrollEndReached = new EventEmitter<number>();
  isHandset = false;
  private destroy$ = new Subject<any>();

  constructor(
    public breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).pipe( // TODO: move this into a pipe
      takeUntil(this.destroy$),
      map(result => {
        this.isHandset = result.matches;
        this.cdr.markForCheck();
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  get viewportHeight(): string {
    return `calc(100vh - ${this.offsetTop}px)`;
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
