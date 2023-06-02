import { Route } from '@angular/router';
import { NxWelcomeComponent } from './components/nx-welcome/nx-welcome.component';
import { LearningMaterialsComponent } from './components/learning-materials/learning-materials.component';
import { inject } from '@angular/core';
import { FeaturesServiceToken, FlagsComponent } from '@features';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: NxWelcomeComponent
  },
  {
    path: 'learning',
    component: LearningMaterialsComponent,
    canMatch: [() => inject(FeaturesServiceToken).isOn$('show-learning-materials')]
  },
  {
    path: 'flags',
    component: FlagsComponent
  }
];
