import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './components/nx-welcome/nx-welcome.component';
import { FeaturesDirective } from '@features';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule, FeaturesDirective],
  selector: 'launch-darkly-angular-root',
  template: `
    <ul style="display: flex; justify-content: space-around;">
      <li style="list-style: none;">
        <a routerLink="/">Home</a>
      </li>
      <li style="list-style: none;" *forFeatures="'show-learning-materials'">
        <a routerLink="/learning">Learning</a>
      </li>
    </ul>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'launch';
}
