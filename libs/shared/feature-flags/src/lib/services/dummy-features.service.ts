import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IFeaturesService, FlagChangeset } from '../interfaces/features.interface';

@Injectable()
export class DummyFeaturesService implements IFeaturesService {
  init(): Observable<FlagChangeset> {
    return of();
  }

  isOn$(_key: string): Observable<boolean> {
    return of(false);
  }

  getFlags$(): Observable<FlagChangeset> {
    return of({});
  }

  getFlagsSnapshot(): FlagChangeset {
    return {};
  }
}
