import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesDirective } from './directives/features.directive';
import { LearningMaterialsComponent } from './learning-materials.component';

@Component({
  selector: 'launch-darkly-angular-nx-welcome',
  imports: [CommonModule, FeaturesDirective, LearningMaterialsComponent],
  standalone: true,
  templateUrl: './nx-welcome.component.html',
  styleUrls: ['./nx-welcome.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NxWelcomeComponent {}
