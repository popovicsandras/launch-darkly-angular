import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const FeaturesServiceConfigToken = new InjectionToken<any>('FeatureServiceConfigToken');
export const FeaturesServiceToken = new InjectionToken<IFeaturesService>('FeaturesService');
export const WritableFeaturesServiceToken = new InjectionToken<IFeaturesService & IWritableFeaturesService>('WritableFeaturesServiceToken');
export const WritableFeaturesServiceConfigToken = new InjectionToken<any>('WritableFeaturesServiceConfigToken');
export const OverriddableFeaturesServiceToken = new InjectionToken<IFeaturesService>('OverriddableFeaturesServiceToken');

export interface FlagChangeset {
  [key: string]: {
    current: any;
    previous: any;
  };
}

export interface FlagSet {
  [key: string]: any;
}

export interface IFeaturesService {
  init(): Observable<FlagChangeset>;
  isOn$(key: string): Observable<boolean>;
  getFlags$(): Observable<FlagChangeset>;
}

export interface IDebugFeaturesService extends Omit<IFeaturesService, 'init'> {
  enable(on: boolean): void;
  isEnabled(): Observable<boolean>;
}

export interface IWritableFeaturesService {
  setFlag(key: string, value: any): void;
  resetFlags(flags: FlagSet): void;
  resetToDefaults(): void;
}
