import { APP_INITIALIZER, EnvironmentProviders, makeEnvironmentProviders, } from '@angular/core';
import { FeaturesServiceConfigToken, IFeaturesService, FeaturesServiceToken, } from '@feature-flags';
import { LDFeatureFlagConfig, LDFeaturesService, } from '../services/launch-darkly-features.service';

export function provideLaunchDarklyFeatureFlags(
  featureFlagServiceConfig: LDFeatureFlagConfig
): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FeaturesServiceToken, useClass: LDFeaturesService },
    { provide: FeaturesServiceConfigToken, useValue: featureFlagServiceConfig },
    {
      provide: APP_INITIALIZER,
      useFactory: (featuresService: IFeaturesService) => () =>
        featuresService.init(),
      deps: [FeaturesServiceToken],
      multi: true,
    },
  ]);
}
