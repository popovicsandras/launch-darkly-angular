import { APP_INITIALIZER, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { FeaturesServiceToken, WritableFeaturesServiceConfigToken, WritableFeaturesServiceToken } from '../interfaces/features.interface';
import { StorageFeaturesServiceConfig, StorageFeaturesService } from '../services/storage-features.service';
import { DebugFeaturesService } from '../services/debug-features.service';

export function provideDebugFeatureFlags(overridableFeatureServiceConfig: StorageFeaturesServiceConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FeaturesServiceToken, useClass: DebugFeaturesService },

    { provide: WritableFeaturesServiceConfigToken, useValue: overridableFeatureServiceConfig },
    { provide: WritableFeaturesServiceToken, useClass: StorageFeaturesService },
    {
      provide: APP_INITIALIZER,
      useFactory: (featuresService: StorageFeaturesService) => () =>
        featuresService.init(),
      deps: [WritableFeaturesServiceToken],
      multi: true,
    },
  ]);
}
