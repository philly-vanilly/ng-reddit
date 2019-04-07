import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ui-card-scroller',
  template: `
    <p>
      ui-card-scroller works!
    </p>
  `,
  styleUrls: ['./ui-card-scroller.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiCardScrollerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
