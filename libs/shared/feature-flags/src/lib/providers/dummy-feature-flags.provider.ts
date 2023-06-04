import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { FeaturesServiceToken } from '../interfaces/features.interface';
import { DummyFeaturesService } from '../services/dummy-features.service';
import { isFeatureOnNg14 } from '../guards/is-feature-on.guard.ng14';

export function provideDummyFeatureFlags(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FeaturesServiceToken, useClass: DummyFeaturesService },
    isFeatureOnNg14
  ]);
}
