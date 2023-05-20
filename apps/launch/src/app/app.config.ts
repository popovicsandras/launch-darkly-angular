import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { appRoutes } from './app.routes';
import { FeatureFlagConfig, FeatureFlagConfigToken, FeaturesService } from './services/features.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    {
      provide: FeatureFlagConfigToken,
      useValue: {
        clientKey: '645ca4184131f212d209b3a4',
        context: {
          kind: 'user',
          key: 'example-context-key',
          name: 'Sandy'
        }
      } satisfies FeatureFlagConfig
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (featuresService: FeaturesService) => () => featuresService.init(),
      deps: [FeaturesService],
      multi: true
    }
  ],
};
