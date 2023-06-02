import { APP_INITIALIZER, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { FeaturesServiceToken } from '../interfaces/features.interface';
import { BrowserFeatureFlagConfig, BrowserFeatureFlagConfigToken, BrowserFeaturesService, BrowserFeaturesServiceToken } from '../services/browser-features.service';

export function provideOverridableFeatures(browserFeatureFlagConfig: BrowserFeatureFlagConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    // { provide: FeaturesServiceToken, useClass: OverridableFeaturesService },

    { provide: BrowserFeatureFlagConfigToken, useValue: browserFeatureFlagConfig },
    { provide: BrowserFeaturesServiceToken, useClass: BrowserFeaturesService },
    {
      provide: APP_INITIALIZER,
      useFactory: (featuresService: BrowserFeaturesService) => () =>
        featuresService.init(),
      deps: [BrowserFeaturesServiceToken],
      multi: true,
    },
  ]);
}
