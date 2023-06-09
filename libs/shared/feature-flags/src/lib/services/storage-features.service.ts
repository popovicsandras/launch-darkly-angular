import { Inject, Injectable, Optional } from '@angular/core';
import { BehaviorSubject, Observable, map, of, skip } from 'rxjs';
import { FlagChangeset, IFeaturesService, FlagSet, IWritableFeaturesService, WritableFeaturesServiceConfigToken, WritableFlagChangeset, WritableFeaturesServiceConfig } from '../interfaces/features.interface';
import { StorageService } from './storage.service';
import { FlagSetParser } from './flagset.parser';

@Injectable()
export class StorageFeaturesService implements IFeaturesService, IWritableFeaturesService
{
  private currentFlagState: WritableFlagChangeset = {};
  private flags = new BehaviorSubject<WritableFlagChangeset>({});
  private flags$ = this.flags.asObservable();

  constructor(
    private storageService: StorageService,
    @Optional() @Inject(WritableFeaturesServiceConfigToken) private config?: WritableFeaturesServiceConfig
  ) {
    this.flags.pipe(skip(1)).subscribe((flags) => {
      this.currentFlagState = flags;
      this.storageService.setItem(this.storageKey, JSON.stringify(FlagSetParser.serialize(flags)));
    });
  }

  get storageKey(): string {
    return this.config?.storageKey || 'feature-flags';
  }

  init(): Observable<WritableFlagChangeset> {
    const storedFlags = JSON.parse(this.storageService.getItem(this.storageKey) || '{}');
    const initialFlagChangeSet = FlagSetParser.deserialize(storedFlags);
    this.flags.next(initialFlagChangeSet);
    return of(initialFlagChangeSet);
  }

  isOn$(key: string): Observable<boolean> {
    return this.flags$.pipe(
      map(flags => !!flags[key]?.current)
    );
  }

  getFlags$(): Observable<WritableFlagChangeset> {
    return this.flags$;
  }

  getFlagsSnapshot(): FlagChangeset {
    return this.currentFlagState;
  }

  setFlag(key: string, value: any): void {
    let fictive = {};
    if (!this.currentFlagState[key]) {
      fictive = { fictive: true };
    } else {
      fictive = this.currentFlagState[key]?.fictive ? { fictive: true } : {};
    }

    this.flags.next({
      ...this.currentFlagState,
      [key]: {
        current: value,
        previous: this.currentFlagState[key]?.current ?? null,
        ...fictive,
      },
    });
  }

  removeFlag(key: string): void {
    const { [key]: _, ...flags } = this.currentFlagState;
    this.flags.next(flags);
  }

  resetFlags(flags: FlagSet): void {
    this.flags.next(
      Object.keys(flags).reduce((acc, key) => {
        return {
          ...acc,
          [key]: {
            current: flags[key],
            previous: null,
            fictive: true,
          },
        };
      }, {})
    );
  }

  mergeFlags(flags: FlagChangeset): void {
    const mergedFlags: WritableFlagChangeset = Object.keys(flags).reduce((acc, key) => {
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
          fictive: true,
        };
      });

    this.flags.next(mergedFlags);
  }
}
