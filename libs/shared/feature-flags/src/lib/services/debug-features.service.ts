import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { IDebugFeaturesService, IFeaturesService, FlagChangeset, OverriddableFeaturesServiceToken, IWritableFeaturesService, WritableFeaturesServiceToken } from '../interfaces/features.interface';

@Injectable()
export class DebugFeaturesService implements IDebugFeaturesService {
  private isInDebugMode = new BehaviorSubject<boolean>(false);
  private isInDebugMode$ = this.isInDebugMode.asObservable();

  constructor(
    @Inject(OverriddableFeaturesServiceToken) private overriddenFeaturesService: IFeaturesService,
    @Inject(WritableFeaturesServiceToken) private writableFeaturesService: IFeaturesService,
  ) {}

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

  enable(on: boolean): void {
    this.isInDebugMode.next(on);
  }

  isEnabled(): Observable<boolean> {
    return this.isInDebugMode$;
  }
}
