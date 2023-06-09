import { ChangeDetectionStrategy, Component, Inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IWritableFeaturesService, FeaturesServiceToken, WritableFeaturesServiceToken, IDebugFeaturesService, FlagChangeset, WritableFlagChangeset, IFeaturesService } from '../interfaces/features.interface';
import { BehaviorSubject, Observable, Subject, combineLatest, debounceTime, map, take, takeUntil } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'feature-flags-overrides',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatTableModule, MatSlideToggleModule, MatToolbarModule, MatIconModule, MatButtonModule, MatInputModule, MatTooltipModule ],
  templateUrl: './flags.component.html',
  styleUrls: ['./flags.component.ng16.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlagsComponent implements OnDestroy {
  displayedColumns: string[] = ['icon', 'flag', 'value'];
  flags$: Observable<{ fictive: boolean; flag: string; value: any }[]>;
  isEnabled = false;
  destroy$ = new Subject<void>();

  inputValue = '';
  inputValue$ = new BehaviorSubject<string>('');
  showPlusButton$!: Observable<boolean>;

  constructor(
    @Inject(FeaturesServiceToken) private featuresService: IDebugFeaturesService & IFeaturesService<WritableFlagChangeset>,
    @Inject(WritableFeaturesServiceToken) private writableFeaturesService: IWritableFeaturesService
  ) {
    this.featuresService.isEnabled().pipe(takeUntil(this.destroy$)).subscribe((isEnabled) => {
      this.isEnabled = isEnabled;
    });

    const flags$ = this.featuresService.getFlags$().pipe(
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

    const debouncedInputValue$ = this.inputValue$.pipe(debounceTime(100));

    this.flags$ = combineLatest([flags$, debouncedInputValue$]).pipe(
      map(([flags, inputValue]) => {
        if (!inputValue) {
          return flags;
        }

        return flags.filter((flag) => flag.flag.includes(inputValue));
      })
    );

    this.showPlusButton$ = this.flags$.pipe(
      map((flags) => {
        return this.isEnabled && flags.length === 0;
      }
    ));
  }

  protected onChange(flag: string, value: boolean) {
    this.writableFeaturesService.setFlag(flag, value);
  }

  protected onEnable(value: boolean) {
    if (value) {
      this.writableFeaturesService.mergeFlags(this.featuresService.getFlagsSnapshot());
    }

    this.featuresService.enable(value);
  }

  protected onInputChange(text: string) {
    this.inputValue$.next(text);
  }

  protected onClearInput() {
    this.inputValue = '';
    this.inputValue$.next('');
  }

  protected onAdd(event: KeyboardEvent) {
    this.showPlusButton$.pipe(take(1)).subscribe((showPlusButton) => {
      if (showPlusButton && event.key === 'Enter' && event.shiftKey) {
        this.writableFeaturesService.setFlag(this.inputValue, false);
      }
    });
  }

  protected onAddButtonClick() {
    this.writableFeaturesService.setFlag(this.inputValue, false);
  }

  protected onDelete(flag: string) {
    this.writableFeaturesService.removeFlag(flag);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
