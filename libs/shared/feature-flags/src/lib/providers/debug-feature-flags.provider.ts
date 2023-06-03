import { APP_INITIALIZER, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { FeaturesServiceToken, WritableFeaturesServiceConfig, WritableFeaturesServiceConfigToken, WritableFeaturesServiceToken } from '../interfaces/features.interface';
import { StorageFeaturesService } from '../services/storage-features.service';
import { DebugFeaturesService } from '../services/debug-features.service';

export function provideDebugFeatureFlags(writableFeaturesServiceConfig: WritableFeaturesServiceConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FeaturesServiceToken, useClass: DebugFeaturesService },

    { provide: WritableFeaturesServiceConfigToken, useValue: writableFeaturesServiceConfig },
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
