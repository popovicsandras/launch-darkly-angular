import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FeaturesService, FlagChangeset } from './features.interface';

@Injectable()
export class FakeFeaturesService implements FeaturesService {

  init(): Observable<FlagChangeset> {
    return of();
  }

  isOn$(_key: string): Observable<boolean> {
    return of(false);
  }

  getFlags$(): Observable<FlagChangeset> {
    return of({});
  }
}
