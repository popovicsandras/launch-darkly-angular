import { ApplicationConfig } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideDummyFeatures, provideOverridableFeatures } from '@feature-flags';
import { provideHxPFeatures, provideLaunchDarklyFeatures, } from '@features';

export const appConfig: ApplicationConfig = {
  providers: [
    // For functional router guars, withEnabledBlockingInitialNavigation can not be used, since routing happens before the features are loaded.
    // provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideRouter(appRoutes),

    // It is supposed to be provided by ADF by default, but every app should reprovide it.
    provideDummyFeatures(),

    // Provided by every HxP application
    provideHxPFeatures({ url: 'http://localhost:4200/assets/flags.json' }),

    // Provided by every HxP application in _NOT_ release configuration
    provideOverridableFeatures({
      storageKey: 'hxp-feature-flags',
      defaultValues: {
        'show-learning-materials': true,
      }
    }),

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
