import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IWritableFeaturesService, FeaturesServiceToken, WritableFeaturesServiceToken, IDebugFeaturesService, FlagChangeset, } from '../../interfaces/features.interface';
import { Observable, map, take } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'feature-flags-overrides',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSlideToggleModule, MatToolbarModule],
  templateUrl: './flags.component.html',
  styleUrls: ['./flags.component.scss'],
})
export class FlagsComponent {
  flags$: Observable<{ position: number; flag: string; value: any }[]>;
  isEnabled$: Observable<boolean>;
  displayedColumns: string[] = ['position', 'flag', 'value'];

  constructor(
    @Inject(FeaturesServiceToken) private featuresService: IDebugFeaturesService,
    @Inject(WritableFeaturesServiceToken) private writableFeaturesService: IWritableFeaturesService
  ) {
    this.isEnabled$ = this.featuresService.isEnabled();
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

  protected onChange(flag: string, value: boolean) {
    this.writableFeaturesService.setFlag(flag, value);
  }

  protected onEnable(value: boolean) {
    if (value) {
      let flagsSnapshot: FlagChangeset = this.getRealFlagsSnapshot();
      this.writableFeaturesService.mergeFlags(flagsSnapshot);
    }

    this.featuresService.enable(value);
  }

  private getRealFlagsSnapshot() {
    let flagsSnapshot!: FlagChangeset;
    this.featuresService.getFlags$()
      .pipe(take(1))
      .subscribe((flags) => {
        flagsSnapshot = flags;
      });

    return flagsSnapshot;
  }
}
