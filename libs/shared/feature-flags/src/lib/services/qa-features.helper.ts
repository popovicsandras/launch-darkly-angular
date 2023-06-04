import { Inject, Injectable, Type } from '@angular/core';
import { FlagChangeset, FeaturesServiceToken, FlagSet } from '../interfaces/features.interface';
import { DebugFeaturesService } from './debug-features.service';

declare const ng: {
  getComponent: (element: HTMLElement) => Type<any>;
  applyChanges: (component: Type<any>) => void;
};

@Injectable()
export class QaFeaturesHelper {
  public rootComponentDOMSelector?: () => HTMLElement;

  constructor( @Inject(FeaturesServiceToken) private debugFeaturesService: DebugFeaturesService ) {}

  isOn(key: string): boolean {
    let isOn = false;
    this.debugFeaturesService.isOn$(key).subscribe((on) => {
      isOn = on;
    });

    return isOn;
  }

  getFlags(): FlagChangeset {
    let flags: FlagChangeset = {};
    this.debugFeaturesService.getFlags$().subscribe((flagChangeset) => {
      flags = flagChangeset;
    });
    return flags;
  }

  resetFlags(flags: FlagSet): void {
    this.debugFeaturesService.resetFlags(flags);
    this.triggerChangeDetection();
  }

  enable(): void {
    this.debugFeaturesService.enable(true);
    this.triggerChangeDetection();
  }

  disable(): void {
    this.debugFeaturesService.enable(false);
    this.triggerChangeDetection();
  }

  isEnabled(): boolean {
    let enabled = false;
    this.debugFeaturesService.isEnabled().subscribe((isEnabled) => {
      enabled = isEnabled;
    });
    return enabled;
  }

  private triggerChangeDetection(): void {
    if (this.rootComponentDOMSelector) {
      const root = ng.getComponent(this.rootComponentDOMSelector());
      ng.applyChanges(root);
    }
  }
}
