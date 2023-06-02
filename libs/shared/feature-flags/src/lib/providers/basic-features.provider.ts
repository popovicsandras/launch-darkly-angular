import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { FeaturesServiceToken } from '../interfaces/features.interface';
import { FakeFeaturesService } from '../services/fake-features.service';

export function provideBasicFeatures(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FeaturesServiceToken, useClass: FakeFeaturesService },
  ]);
}
