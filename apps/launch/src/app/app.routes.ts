import { Route } from '@angular/router';
import { NxWelcomeComponent } from './components/nx-welcome/nx-welcome.component';
import { LearningMaterialsComponent } from './components/learning-materials/learning-materials.component';
import { FeatureFlagsWrapperComponent } from './components/feature-flags-wrapper';
import { isFeatureOn, isFeatureOnNg14 } from '@feature-flags';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: NxWelcomeComponent,
  },
  {
    path: 'learning',
    component: LearningMaterialsComponent,
    canMatch: [ isFeatureOn('show-learning-materials') ],
  },
  {
    path: 'activity',
    component: LearningMaterialsComponent,
    canMatch: [ isFeatureOnNg14 ],
    data: { feature: 'show-activity' }
  },
  {
    path: 'flags',
    component: FeatureFlagsWrapperComponent,
  },
];
