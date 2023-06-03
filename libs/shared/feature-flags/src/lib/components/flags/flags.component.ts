import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IWritableFeaturesService, FeaturesServiceToken, WritableFeaturesServiceToken, IDebugFeaturesService, FlagChangeset, WritableFlagChangeset, IFeaturesService, } from '../../interfaces/features.interface';
import { Observable, map, take } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'feature-flags-overrides',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSlideToggleModule, MatToolbarModule, MatIconModule],
  templateUrl: './flags.component.html',
  styleUrls: ['./flags.component.scss'],
})
export class FlagsComponent {
  flags$: Observable<{ fictive: boolean; flag: string; value: any }[]>;
  isEnabled$: Observable<boolean>;
  displayedColumns: string[] = ['position', 'flag', 'value'];

  constructor(
    @Inject(FeaturesServiceToken) private featuresService: IDebugFeaturesService & IFeaturesService<WritableFlagChangeset>,
    @Inject(WritableFeaturesServiceToken) private writableFeaturesService: IWritableFeaturesService
  ) {
    this.isEnabled$ = this.featuresService.isEnabled();

    this.flags$ = this.featuresService.getFlags$().pipe(
      map((flags) => {
        return Object.keys(flags).map((key) => {
          return {
            flag: key,
            value: flags[key].current,
            fictive: flags[key]?.fictive ?? false
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
      this.writableFeaturesService.mergeFlags(this.getRealFlagsSnapshot());
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
