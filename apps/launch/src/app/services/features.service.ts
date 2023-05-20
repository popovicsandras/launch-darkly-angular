import { Inject, Injectable, InjectionToken } from '@angular/core';
import * as LDClient from 'launchdarkly-js-client-sdk';
import { Observable } from 'rxjs';

export interface FeatureFlagConfig {
  clientKey: string;
  context: LDClient.LDContext;
  options?: LDClient.LDOptions
}

export const FeatureFlagConfigToken = new InjectionToken<FeatureFlagConfig>('FeatureFlagConfig');

@Injectable({
  providedIn: 'root'
})
export class FeaturesService {

  private client!: LDClient.LDClient;
  private change$!: Observable<LDClient.LDFlagChangeset>;

  constructor(@Inject(FeatureFlagConfigToken) private config: FeatureFlagConfig) {
    console.log(config);
  }

  init(): Observable<LDClient.LDFlagChangeset> {
    return new Observable((subscriber) => {
      this.client = LDClient.initialize(this.config.clientKey, this.config.context, this.config.options);
      this.client.on('ready', () => {
        const reactiveFlags = this.setupChangeListener();
        subscriber.next(reactiveFlags);
        subscriber.complete();
      });
    });
  }

  private setupChangeListener() {
    const reactiveFlags: LDClient.LDFlagChangeset = Object.keys(this.getAllFlags()).reduce((acc, key) => {
      return {
        ...acc,
        [key]: {
          current: this.client.variation(key, false),
          previous: null
        }
      };
    }, {} as LDClient.LDFlagChangeset);

    this.change$ = new Observable((subscriber) => {
      subscriber.next(reactiveFlags);
      this.client.on('change', (flags) => {
        subscriber.next(flags);
      });
    });
    return reactiveFlags;
  }

  getAllFlags() {
    return this.client.allFlags();
  }

  getFlags$() {
    return this.change$;
  }
}
