import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FeaturesService } from '../services/features.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import * as LDClient from 'launchdarkly-js-client-sdk';

@Directive({
  /* eslint-disable-next-line @angular-eslint/directive-selector */
  selector: '[forFeatures]',
  standalone: true,
})
export class FeaturesDirective {
  private hasView = false;
  private inputUpdate$ = new BehaviorSubject([] as string[]);

  @Input()
  set forFeatures(feature: string[] | string) {
    this.inputUpdate$.next(Array.isArray(feature) ? feature : [feature]);
  }

  constructor(
    private featuresService: FeaturesService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) {
      combineLatest([this.featuresService.getFlags$(), this.inputUpdate$])
        .pipe(takeUntilDestroyed())
        .subscribe(([flags, features]: any) => {
          console.log(flags, features)
          this.updateView(flags, features);
      });
  }

  private updateView(flags: LDClient.LDFlagChangeset, features: string[]) {
    const shouldShow = features.every((feature) => flags[feature]?.current);
    console.log(flags, features, shouldShow);

    if (shouldShow && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!shouldShow && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
