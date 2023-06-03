import { Component } from '@angular/core';
import { FlagsComponent } from '@feature-flags';

@Component({
  /* eslint-disable-next-line @angular-eslint/component-selector */
  selector: 'feature-flags-wrapper',
  standalone: true,
  imports: [FlagsComponent],
  template: `<feature-flags-overrides class="feature-flags-overrides"></feature-flags-overrides>`,
  styles: [`
  :host {
    margin: 16px;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .feature-flags-overrides {
    width: 500px;
  }
  `]
})
export class FeatureFlagsWrapperComponent {}
