import { Inject, Injectable, Optional } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import {
  FeatureFlagConfigToken,
  FlagChangeset,
  FeaturesService,
  FlagSet,
} from './features.interface';

export interface BrowserFeatureFlagConfig {
  flags: FlagSet;
}

@Injectable()
export class BrowserFeaturesService implements FeaturesService {
  private flags$ = new Subject<FlagChangeset>();

  constructor(
    @Optional()
    @Inject(FeatureFlagConfigToken)
    private config: BrowserFeatureFlagConfig
  ) {}

  init(): Observable<FlagChangeset> {
    if (this.config) {
      this.flags$.next(this.config.flags);
    }

    return this.flags$;
  }

  isOn$(key: string): Observable<boolean> {
    return of(false);
  }

  getFlags$(): Observable<FlagChangeset> {
    return this.flags$.asObservable();
  }
}
