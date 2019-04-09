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

@Component({
  selector: 'ui-card-scroller',
  template: `
    <div class="ui-card-scroller_container">
        <mat-card
          *uiScroll="let post of datasource">
          <mat-card-title>{{ post.title }}</mat-card-title>
          <div class="ui-card-scroller_image-container">
            <img mat-card-image
                 [src]="post.thumbnail"
            >
          </div>
          <mat-card-content>Author {{ post.author }}</mat-card-content>
        </mat-card>
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

  datasource: IDatasource = {
    get: (index, count, success) => {
      const lastRequestedIndex: number = index + count;
      console.log("GET CALL: " + lastRequestedIndex);
      if (lastRequestedIndex + 1 > this.postsLength) { // +1 because index starts at 0
        this.scrollEndReached.emit(lastRequestedIndex);
      }
      this.sub$.pipe(
        filter(sub => !!sub.posts[index] && !!sub.posts[lastRequestedIndex]),
        take(1)
      ).subscribe(sub => {
        const data = sub.posts
          .map(post => ({title: post.title, thumbnail: post.thumbnail}))
          .slice(index, lastRequestedIndex)
        ;
        console.log("POSTS UPDATE: " + JSON.stringify(data));
        success(data)
      });
    },
    settings: {
      minIndex: 0,
      startIndex: 0,
      windowViewport: true,
      infinite: true
    }
  };

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
    this.scrollEndReached.emit(1);
  }

  get viewportHeight(): string {
    return `calc(100vh - ${this.headerHeight}px)`;
  }

  onScrollIndexChange($event: number) {
     const end = this.viewport.getRenderedRange().end;
     const total = this.viewport.getDataLength();

     if (end === total) {
       console.log("EMITTING");
       this.scrollEndReached.emit(10);
     }
  }
}
