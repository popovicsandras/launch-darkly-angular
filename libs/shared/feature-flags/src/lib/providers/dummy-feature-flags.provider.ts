import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { FeaturesServiceToken } from '../interfaces/features.interface';
import { DummyFeaturesService } from '../services/dummy-features.service';

export function provideDummyFeatureFlags(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FeaturesServiceToken, useClass: DummyFeaturesService },
  ]);
}
