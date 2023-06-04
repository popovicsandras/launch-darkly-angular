import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './components/nx-welcome/nx-welcome.component';
import { FeaturesDirective } from '@feature-flags';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  standalone: true,
  imports: [
    NxWelcomeComponent,
    RouterModule,
    FeaturesDirective,
    CommonModule,
    MatToolbarModule,
  ],
  selector: 'launch-darkly-angular-root',
  template: `
    <mat-toolbar>
      <ul
        style="display: flex; justify-content: space-around; gap: 12px; width: 100%;"
      >
        <ng-container *ngFor="let item of menuitems">
          <ng-container *ngIf="!item.feature; else feature">
            <li style="list-style: none;">
              <a [routerLink]="item.path" routerLinkActive="active">{{
                item.label
              }}</a>
            </li>
          </ng-container>

          <ng-template #feature>
            <li style="list-style: none;" *forFeatures="item.feature!">
              <a [routerLink]="item.path" routerLinkActive="active">{{
                item.label
              }}</a>
            </li>
          </ng-template>
        </ng-container>
      </ul>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  menuitems = [
    { path: '/', label: 'Home' },
    {
      path: '/learning',
      label: 'Learning',
      feature: 'show-learning-materials',
    },
    {
      path: '/activity',
      label: 'Activity',
      feature: 'show-activity',
    },
    { path: '/flags', label: 'Flags' },
  ];
  title = 'launch';
}
