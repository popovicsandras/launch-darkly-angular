import { Inject, Injectable, Optional } from '@angular/core';
import { BehaviorSubject, Observable, map, of, skip } from 'rxjs';
import { FlagChangeset, IFeaturesService, FlagSet, IWritableFeaturesService, WritableFeaturesServiceConfigToken } from '../interfaces/features.interface';
import { StorageService } from './storage.service';

export interface StorageFeaturesServiceConfig {
  storageKey?: string;
}

@Injectable()
export class StorageFeaturesService
  implements IFeaturesService, IWritableFeaturesService
{
  private currentFlagState: FlagChangeset = {};
  private flags = new BehaviorSubject<FlagChangeset>({});
  private flags$ = this.flags.asObservable();

  constructor(
    private storageService: StorageService,
    @Optional()
    @Inject(WritableFeaturesServiceConfigToken)
    private config: StorageFeaturesServiceConfig
  ) {
    this.flags.pipe(skip(1)).subscribe((flags) => {
      this.currentFlagState = flags;
      const serializableFlags = Object.keys(flags).reduce(
        (acc, key) => ({ ...acc, [key]: flags[key].current }),
        {}
      );
      this.storageService.setItem(
        this.storageKey,
        JSON.stringify(serializableFlags)
      );
    });
  }

  get storageKey(): string {
    return this.config?.storageKey || 'feature-flags';
  }

  init(): Observable<FlagChangeset> {
    const storedFlags: FlagSet = JSON.parse(
      this.storageService.getItem(this.storageKey) || '{}'
    );

    const initialFlagChangeSet: FlagChangeset = Object.keys(storedFlags).reduce(
      (acc, key) => {
        return {
          ...acc,
          [key]: { current: storedFlags[key], previous: null },
        };
      },
      {}
    );

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
    this.flags.next({
      ...this.currentFlagState,
      [key]: {
        current: value,
        previous: this.currentFlagState[key]?.current ?? null,
      },
    });
  }

  resetFlags(flags: FlagSet) {
    this.flags.next(
      Object.keys(flags).reduce((acc, key) => {
        return {
          ...acc,
          [key]: { current: flags[key], previous: null },
        };
      }, {})
    );
  }

  mergeFlags(flags: FlagChangeset) {
    const mergedFlags: FlagChangeset = Object.keys(flags).reduce((acc, key) => {
      const current = this.currentFlagState[key]?.current;
      return {
        ...acc,
        [key]: {
          current: current ?? flags[key].current,
          previous: current ?? null,
        },
      };
    }, {});

    Object.keys(this.currentFlagState)
      .filter((key) => !flags[key])
      .forEach((key) => {
        mergedFlags[key] = {
          current: this.currentFlagState[key].current,
          previous: this.currentFlagState[key].previous,
        };
      });

    this.flags.next(mergedFlags);
  }
}
