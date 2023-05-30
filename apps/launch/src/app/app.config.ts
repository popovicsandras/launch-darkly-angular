import { ApplicationConfig } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHxPFeatures } from '@features';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
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
