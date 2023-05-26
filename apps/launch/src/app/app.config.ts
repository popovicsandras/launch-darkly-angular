import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { appRoutes } from './app.routes';
import { FeatureFlagConfigToken, FeaturesService, FeaturesServiceToken } from './services/features.interface';
import { HxPFeatureFlagConfig, HxPFeaturesService } from './services/hxp-features.service';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    { provide: FeaturesServiceToken, useClass: HxPFeaturesService },
    // {
    //   provide: FeatureFlagConfigToken,
    //   useValue: {
    //     clientKey: '645ca4184131f212d209b3a4',
    //     context: {
    //       kind: 'user',
    //       key: 'example-context-key',
    //       name: 'Sandy'
    //     }
    //   } satisfies LDFeatureFlagConfig
    // },
    {
      provide: FeatureFlagConfigToken,
      useValue: {
        url: 'http://localhost:4200/assets/flags.json'
      } satisfies HxPFeatureFlagConfig
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (featuresService: FeaturesService) => () => featuresService.init(),
      deps: [FeaturesServiceToken],
      multi: true
    },
    importProvidersFrom(HttpClientModule)
  ],
};
