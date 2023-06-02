import { Directive, Inject, Input, TemplateRef, ViewContainerRef, } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { IFeaturesService, FeaturesServiceToken, FlagChangeset, } from '../interfaces/features.interface';

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
    @Inject(FeaturesServiceToken) private featuresService: IFeaturesService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {
    combineLatest([this.featuresService.getFlags$(), this.inputUpdate$])
      .pipe(takeUntilDestroyed())
      .subscribe(([flags, features]: any) => this.updateView(flags, features));
  }

  private updateView(flags: FlagChangeset, features: string[]) {
    const shouldShow = features.every((feature) => flags[feature]?.current);

    if (shouldShow && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!shouldShow && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
