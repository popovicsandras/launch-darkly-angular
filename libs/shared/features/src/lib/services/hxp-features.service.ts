import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import {
  FeatureFlagConfigToken,
  FeaturesService,
  FlagChangeset,
} from '@feature-flags';

export interface HxPFeatureFlagConfig {
  url: string;
}

@Injectable()
export class HxPFeaturesService implements FeaturesService {
  private flags!: FlagChangeset;

  constructor(
    @Inject(FeatureFlagConfigToken) private config: HxPFeatureFlagConfig,
    private httpClient: HttpClient
  ) {}

  init(): Observable<FlagChangeset> {
    return this.httpClient.get<FlagChangeset>(this.config.url).pipe(
      tap((flags) => {
        this.flags = Object.keys(flags).reduce((acc, flag) => {
          return { ...acc, [flag]: { current: flags[flag], previous: null } };
        }, {});
      })
    );
  }

  isOn$(key: string): Observable<boolean> {
    return of(this.flags[key].current);
  }

  getFlags$(): Observable<FlagChangeset> {
    return of(this.flags);
  }
}