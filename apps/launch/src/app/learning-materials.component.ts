import { Component, ViewEncapsulation } from '@angular/core';
// import { Features } from './decorators/features.decorator';

// @Features(['learningMaterials'])
@Component({
  /* eslint-disable-next-line @angular-eslint/component-selector */
  selector: 'learning-materials',
  standalone: true,
  templateUrl: './learning-materials.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class LearningMaterialsComponent {
  constructor() {
    const injector = (this as any).___injector;
    console.log('LearningMaterialsComponent');
  }
}
