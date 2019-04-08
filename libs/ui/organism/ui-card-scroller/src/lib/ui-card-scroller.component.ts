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
import { PostModel } from '@libs/shared-models/src';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'ui-card-scroller',
  template: `
    <div class="ui-card-scroller_container">
      <cdk-virtual-scroll-viewport
        [style.height]="viewportHeight"
        [class.handset]="isHandset"
        (scrolledIndexChange)="onScrollIndexChange($event)"
        itemSize="478"
        class="ui-card-scroller_viewport"
      >
        <mat-card *cdkVirtualFor="let post of posts" [style.height]="'auto'">
          <mat-card-title>{{post.title}}</mat-card-title>
          <img mat-card-image [src]="post.thumbnail" [alt]="post.url">
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
  @Input() posts: PostModel[]; // TODO: make own ui-specific model
  @Input() headerHeight = 50;
  @Output() offset = new EventEmitter<number>();
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

  get viewportHeight(): string {
    return `calc(100vh - ${this.headerHeight}px)`;
  }

  onScrollIndexChange($event: number) {
     const end = this.viewport.getRenderedRange().end;
     const total = this.viewport.getDataLength();

     if (end === total) {
       console.log("END REACHED + " + this.viewport.getRenderedRange() + " " + this.viewport.getDataLength());
       this.offset.emit(10);
     }
  }
}
