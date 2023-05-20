import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesDirective } from './directives/features.directive';

@Component({
  selector: 'launch-darkly-angular-nx-welcome',
  imports: [CommonModule, FeaturesDirective],
  standalone: true,
  templateUrl: './nx-welcome.component.html',
  styleUrls: ['./nx-welcome.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NxWelcomeComponent {}
