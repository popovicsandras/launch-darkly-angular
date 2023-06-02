import { APP_INITIALIZER, EnvironmentProviders, importProvidersFrom, makeEnvironmentProviders } from "@angular/core";
import { HxPFeatureFlagConfig, HxPFeaturesService } from "../services/hxp-features.service";
import { FeatureFlagConfigToken, FeaturesService, FeaturesServiceToken } from "../services/features.interface";
import { HttpClientModule } from "@angular/common/http";

export function provideHxPFeatures(featureFlagServiceConfig: HxPFeatureFlagConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FeaturesServiceToken, useClass: HxPFeaturesService },
    { provide: FeatureFlagConfigToken, useValue: featureFlagServiceConfig },
    {
      provide: APP_INITIALIZER,
      useFactory: (featuresService: FeaturesService) => () => featuresService.init(),
      deps: [FeaturesServiceToken],
      multi: true
    },
    importProvidersFrom(HttpClientModule)
  ]);
}
