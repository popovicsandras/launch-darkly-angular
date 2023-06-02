import { APP_INITIALIZER, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { FeaturesServiceToken } from '../interfaces/features.interface';
import { OverridableFeatureServiceConfig, OverridableFeaturesServiceConfigToken, OverridableFeaturesService, OverridableFeaturesServiceToken } from '../services/overridable-features.service';

export function provideOverridableFeatures(overridableFeatureServiceConfig: OverridableFeatureServiceConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    // { provide: FeaturesServiceToken, useClass: OverridableFeaturesService },

    { provide: OverridableFeaturesServiceConfigToken, useValue: overridableFeatureServiceConfig },
    { provide: OverridableFeaturesServiceToken, useClass: OverridableFeaturesService },
    {
      provide: APP_INITIALIZER,
      useFactory: (featuresService: OverridableFeaturesService) => () =>
        featuresService.init(),
      deps: [OverridableFeaturesServiceToken],
      multi: true,
    },
  ]);
}
