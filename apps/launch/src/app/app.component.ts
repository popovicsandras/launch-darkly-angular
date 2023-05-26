import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule],
  selector: 'launch-darkly-angular-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'launch';
}
