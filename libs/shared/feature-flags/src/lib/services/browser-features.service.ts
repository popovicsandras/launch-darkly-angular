import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { BehaviorSubject, Observable, map, of, skip } from 'rxjs';
import { FlagChangeset, FeaturesService, FlagSet, FeaturesAdminService, } from '../interfaces/features.interface';
import { StorageService } from './storage.service';

export interface BrowserFeatureFlagConfig {
  defaultFlagNames?: FlagSet;
  storageKey?: string;
}

export const BrowserFeatureFlagConfigToken = new InjectionToken<BrowserFeatureFlagConfig>( 'BrowserFeatureFlagConfigToken' );
export const BrowserFeaturesServiceToken = new InjectionToken<FeaturesService>( 'BrowserFeaturesServiceToken' );

@Injectable()
export class BrowserFeaturesService implements FeaturesService, FeaturesAdminService {
  private flags = new BehaviorSubject<FlagChangeset>({});
  private flags$ = this.flags.asObservable();

  constructor(
    private storageService: StorageService,
    @Optional() @Inject(BrowserFeatureFlagConfigToken) private config: BrowserFeatureFlagConfig
  ) {
    this.flags
      .pipe(skip(1))
      .subscribe((flags) => {
        const serializableFlags = Object.keys(flags).reduce((acc, key) => ({ ...acc, [key]: flags[key].current }), {});
        this.storageService.setItem(this.storageKey, JSON.stringify(serializableFlags));
      });
  }

  get storageKey(): string {
    return this.config?.storageKey || 'hxp-feature-flags';
  }

  init(): Observable<FlagChangeset> {
    const defaultFlags: FlagSet = this.config?.defaultFlagNames || {};
    const storedFlags: FlagSet = JSON.parse(this.storageService.getItem(this.storageKey) || '{}');
    const flags = { ...defaultFlags, ...storedFlags };

    const initialFlagChangeSet: FlagChangeset = Object.keys(flags).reduce((acc, key) => {
      return {
        ...acc,
        [key]: { current: flags[key], previous: null },
      };
    }, {});

    this.flags.next(initialFlagChangeSet);

    return of(initialFlagChangeSet);
  }

  isOn$(key: string): Observable<boolean> {
    return this.flags$.pipe(
      map((flags) => {
        return !!flags[key]?.current;
      })
    );
  }

  getFlags$(): Observable<FlagChangeset> {
    return this.flags$;
  }

  setFlag(key: string, value: any) {

  }

  resetFlags(flags: FlagSet) {

  }
}
