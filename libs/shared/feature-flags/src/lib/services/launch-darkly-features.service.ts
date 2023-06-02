import { Inject, Injectable } from '@angular/core';
import * as LDClient from 'launchdarkly-js-client-sdk';
import { Observable, of } from 'rxjs';
import {
  FeatureFlagConfigToken,
  FeaturesService,
  FlagChangeset,
  FlagSet,
} from './features.interface';

export interface LDFeatureFlagConfig {
  clientKey: string;
  context: LDClient.LDContext;
  options?: LDClient.LDOptions;
}

@Injectable()
export class LDFeaturesService implements FeaturesService {
  private client!: LDClient.LDClient;
  private change$!: Observable<FlagChangeset>;

  constructor(
    @Inject(FeatureFlagConfigToken) private config: LDFeatureFlagConfig
  ) {}

  init(): Observable<FlagChangeset> {
    return new Observable((subscriber) => {
      this.client = LDClient.initialize(
        this.config.clientKey,
        this.config.context,
        this.config.options
      );
      this.client.on('ready', () => {
        const reactiveFlags = this.setupChangeListener();
        subscriber.next(reactiveFlags);
        subscriber.complete();
      });
    });
  }

  private setupChangeListener() {
    const reactiveFlags: LDClient.LDFlagChangeset = Object.keys(
      this.client.allFlags()
    ).reduce((acc, key) => {
      return {
        ...acc,
        [key]: {
          current: this.client.variation(key, false),
          previous: null,
        },
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

  isOn$(key: string): Observable<boolean> {
    // TODO: implement
    return of(false);
  }

  getFlags$(): Observable<FlagChangeset> {
    return this.change$;
  }
}
