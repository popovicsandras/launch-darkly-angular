import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningMaterialsComponent } from './learning-materials.component';
import { FeaturesDirective } from '@features';

@Component({
  selector: 'launch-darkly-angular-nx-welcome',
  imports: [CommonModule, FeaturesDirective, LearningMaterialsComponent],
  standalone: true,
  templateUrl: './nx-welcome.component.html',
  styleUrls: ['./nx-welcome.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NxWelcomeComponent {}
