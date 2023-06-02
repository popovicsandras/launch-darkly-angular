import { ApplicationConfig } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideDummyFeatureFlags, provideDebugFeatureFlags } from '@feature-flags';
import { provideFeaturesFlags, provideLaunchDarklyFeatureFlags, } from '@features';

export const appConfig: ApplicationConfig = {
  providers: [
    // For functional router guars, withEnabledBlockingInitialNavigation can not be used, since routing happens before the features are loaded.
    // provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideRouter(appRoutes),

    // It is supposed to be provided by ADF by default, but every app should reprovide it.
    provideDummyFeatureFlags(),

    // Provided by every HxP application
    provideFeaturesFlags({ url: 'http://localhost:4200/assets/flags.json' }),

    // Provided by every HxP application in _NOT_ release configuration
    provideDebugFeatureFlags({storageKey: 'hxp-feature-flags'}),

    // Fallback option to communicate directly with LaunchDarkly
    // provideLaunchDarklyFeatures(
    //   {
    //     clientKey: '<client-key>',
    //     context: {
    //       kind: 'user',
    //       key: 'example-context-key',
    //       name: 'Sandy'
    //     }
    //   }
    // ),
  ],
};
