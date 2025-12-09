import { Component } from '@angular/core';
import { GlobalService, ThemeVariant, themeVariants } from '../../../global-service';

@Component({
  selector: 'app-theme-switcher',
  standalone: false,
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.css',
})
export class ThemeSwitcher {
  constructor(public g:GlobalService) {}

  public variants = themeVariants;


}
