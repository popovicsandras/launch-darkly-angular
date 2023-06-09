import { Inject, Injectable, Optional } from '@angular/core';
import { BehaviorSubject, Observable, skip, switchMap } from 'rxjs';
import { IDebugFeaturesService, IFeaturesService, FlagChangeset, OverriddableFeaturesServiceToken, WritableFeaturesServiceToken, WritableFeaturesServiceConfigToken, WritableFeaturesServiceConfig, FlagSet, IWritableFeaturesService } from '../interfaces/features.interface';
import { StorageService } from './storage.service';

@Injectable()
export class DebugFeaturesService implements IDebugFeaturesService {
  private isInDebugMode: BehaviorSubject<boolean>;
  private isInDebugMode$: Observable<boolean>;

  get storageKey(): string {
    return `${this.config?.storageKey || 'feature-flags'}-override`;
  }

  constructor(
    @Inject(OverriddableFeaturesServiceToken) private overriddenFeaturesService: IFeaturesService,
    @Inject(WritableFeaturesServiceToken) private writableFeaturesService: IFeaturesService & IWritableFeaturesService,
    private storageService: StorageService,
    @Optional() @Inject(WritableFeaturesServiceConfigToken) private config?: WritableFeaturesServiceConfig
  ) {
    this.isInDebugMode = new BehaviorSubject<boolean>(JSON.parse(this.storageService.getItem(this.storageKey) || 'false'));
    this.isInDebugMode$ = this.isInDebugMode.asObservable();

    this.isInDebugMode.pipe(skip(1)).subscribe((debugMode) => {
      this.storageService.setItem(this.storageKey, JSON.stringify(debugMode));
    });
  }

  isOn$(key: string): Observable<boolean> {
    return this.isInDebugMode$.pipe(
      switchMap((isInDebugMode) => (isInDebugMode ? this.writableFeaturesService : this.overriddenFeaturesService).isOn$(key))
    )
  }

  getFlags$(): Observable<FlagChangeset> {
    return this.isInDebugMode$.pipe(
      switchMap((isInDebugMode) => (isInDebugMode ? this.writableFeaturesService : this.overriddenFeaturesService).getFlags$())
    )
  }

  getFlagsSnapshot(): FlagChangeset {
    return this.isInDebugMode.getValue() ? this.writableFeaturesService.getFlagsSnapshot() : this.overriddenFeaturesService.getFlagsSnapshot();
  }

  resetFlags(flags: FlagSet): void {
    this.writableFeaturesService.resetFlags(flags);
  }

  enable(on: boolean): void {
    this.isInDebugMode.next(on);
  }

  isEnabled(): Observable<boolean> {
    return this.isInDebugMode$;
  }
}
