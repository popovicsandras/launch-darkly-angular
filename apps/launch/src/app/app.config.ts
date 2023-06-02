import { ApplicationConfig } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideBasicFeatures, provideHxPFeatures, provideLaunchDarklyFeatures } from '@features';

export const appConfig: ApplicationConfig = {
  providers: [
    // For functional router guars, withEnabledBlockingInitialNavigation can not be used, since routing happens before the features are loaded.
    // provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideRouter(appRoutes),

    // provideBasicFeatures(), // It is supposed to be provided by ADF by default, but every app should reprovide it.

    provideHxPFeatures( { url: 'http://localhost:4200/assets/flags.json' } ),

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
