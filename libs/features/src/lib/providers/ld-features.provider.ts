import { APP_INITIALIZER, EnvironmentProviders, makeEnvironmentProviders } from "@angular/core";
import { FeatureFlagConfigToken, FeaturesService, FeaturesServiceToken } from "../services/features.interface";
import { LDFeatureFlagConfig, LDFeaturesService } from "../services/launch-darkly-features.service";

export function provideLaunchDarklyFeatures(featureFlagServiceConfig: LDFeatureFlagConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FeaturesServiceToken, useClass: LDFeaturesService },
    { provide: FeatureFlagConfigToken, useValue: featureFlagServiceConfig },
    {
      provide: APP_INITIALIZER,
      useFactory: (featuresService: FeaturesService) => () => featuresService.init(),
      deps: [FeaturesServiceToken],
      multi: true
    }
  ]);
}
