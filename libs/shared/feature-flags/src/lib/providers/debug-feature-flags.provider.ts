import { APP_INITIALIZER, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { FeaturesServiceToken, QaFeaturesHelperConfig, WritableFeaturesServiceConfig, WritableFeaturesServiceConfigToken, WritableFeaturesServiceToken } from '../interfaces/features.interface';
import { StorageFeaturesService } from '../services/storage-features.service';
import { DebugFeaturesService } from '../services/debug-features.service';
import { QaFeaturesHelper } from '../services/qa-features.helper';
import { DOCUMENT } from '@angular/common';

export function provideDebugFeatureFlags(config: WritableFeaturesServiceConfig & QaFeaturesHelperConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FeaturesServiceToken, useClass: DebugFeaturesService },
    { provide: WritableFeaturesServiceConfigToken, useValue: config },
    { provide: WritableFeaturesServiceToken, useClass: StorageFeaturesService },
    { provide: QaFeaturesHelper, useClass: QaFeaturesHelper },
    {
      provide: APP_INITIALIZER,
      useFactory: (featuresService: StorageFeaturesService) => () => featuresService.init(),
      deps: [WritableFeaturesServiceToken],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (qaFeaturesHelper: QaFeaturesHelper, document: Document & { [key: string]: QaFeaturesHelper }) => () => {
        qaFeaturesHelper.rootComponentDOMSelector = config.rootComponentDOMSelector;
        document[config.helperExposeKeyOnDocument ?? 'featureOverrides'] = qaFeaturesHelper;
      },
      deps: [QaFeaturesHelper, DOCUMENT],
      multi: true,
    },
  ]);
}
