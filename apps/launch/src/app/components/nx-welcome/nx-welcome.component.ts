import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesDirective } from '@features';
import { LearningMaterialsComponent } from '../learning-materials/learning-materials.component';

@Component({
  selector: 'launch-darkly-angular-nx-welcome',
  imports: [CommonModule, FeaturesDirective, LearningMaterialsComponent],
  standalone: true,
  templateUrl: './nx-welcome.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class NxWelcomeComponent {}
