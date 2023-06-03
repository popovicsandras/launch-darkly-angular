import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const FeaturesServiceConfigToken = new InjectionToken<any>('FeatureServiceConfigToken');
export const FeaturesServiceToken = new InjectionToken<IFeaturesService>('FeaturesService');
export const WritableFeaturesServiceToken = new InjectionToken<IFeaturesService & IWritableFeaturesService>('WritableFeaturesServiceToken');
export const WritableFeaturesServiceConfigToken = new InjectionToken<WritableFeaturesServiceConfig>('WritableFeaturesServiceConfigToken');
export const OverriddableFeaturesServiceToken = new InjectionToken<IFeaturesService>('OverriddableFeaturesServiceToken');

export interface WritableFeaturesServiceConfig { storageKey?: string; }

export interface FlagChangeset {
  [key: string]: {
    current: any;
    previous: any;
  };
}

export interface WritableFlagChangeset {
  [key: string]: {
    current: any;
    previous: any;
    fictive?: boolean;
  };
}

export interface FlagSet {
  [key: string]: any;
}

export interface IFeaturesService<T = FlagChangeset> {
  init(): Observable<T>;
  isOn$(key: string): Observable<boolean>;
  getFlags$(): Observable<T>;
}

export interface IWritableFeaturesService {
  setFlag(key: string, value: any): void;
  resetFlags(flags: FlagSet): void;
  mergeFlags(flags: FlagChangeset): void;
}

export interface IDebugFeaturesService {
  enable(on: boolean): void;
  isEnabled(): Observable<boolean>;
}

