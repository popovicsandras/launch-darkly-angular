import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IWritableFeaturesService, IFeaturesService, FeaturesServiceToken, WritableFeaturesServiceToken, } from '../../interfaces/features.interface';
import { Observable, map } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'launch-darkly-angular-flags',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSlideToggleModule],
  templateUrl: './flags.component.html',
  styleUrls: ['./flags.component.scss'],
})
export class FlagsComponent {
  flags$: Observable<{ position: number; flag: string; value: any }[]>;
  displayedColumns: string[] = ['position', 'flag', 'value'];

  constructor(
    @Inject(FeaturesServiceToken) private featuresService: IFeaturesService,
    @Inject(WritableFeaturesServiceToken) private writableFeaturesService: IWritableFeaturesService
  ) {
    this.flags$ = this.featuresService.getFlags$().pipe(
      map((flags) => {
        return Object.keys(flags).map((key, index) => {
          return {
            position: index + 1,
            flag: key,
            value: flags[key].current,
          };
        });
      })
    );
  }

  protected change(flag: string, value: boolean) {
    this.writableFeaturesService.setFlag(flag, value);
  }
}
