import { APP_INITIALIZER, EnvironmentProviders, importProvidersFrom, makeEnvironmentProviders, } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HxPFeatureFlagConfig, HxPFeaturesService, } from '../services/hxp-features.service';
import { FeaturesServiceConfigToken, IFeaturesService, FeaturesServiceToken, OverriddableFeaturesServiceToken, } from '@feature-flags';

export function provideFeaturesFlags(
  featureFlagServiceConfig: HxPFeatureFlagConfig
): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FeaturesServiceToken, useClass: HxPFeaturesService },
    { provide: FeaturesServiceConfigToken, useValue: featureFlagServiceConfig },
    { provide: OverriddableFeaturesServiceToken, useClass: HxPFeaturesService },
    {
      provide: APP_INITIALIZER,
      useFactory: (featuresService: IFeaturesService) => () =>
        featuresService.init(),
      deps: [OverriddableFeaturesServiceToken],
      multi: true,
    },
    importProvidersFrom(HttpClientModule),
  ]);
}
