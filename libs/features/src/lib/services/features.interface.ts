import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const FeatureFlagConfigToken = new InjectionToken<any>('FeatureFlagConfig');
export const FeaturesServiceToken = new InjectionToken<FeaturesService>('FeaturesService');

export interface FlagChangeset {
  [key: string]: {
    current: any;
    previous: any;
  };
}

export interface FlagSet {
  [key: string]: any;
}

export interface FeaturesService {
  init(): Observable<FlagChangeset>;
  isOn(key: string): boolean;
  getAllFlags(): FlagSet;
  getFlags$(): Observable<FlagChangeset>;
}
