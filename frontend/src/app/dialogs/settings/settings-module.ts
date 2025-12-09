import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsDialog } from './settings';
import { ThemeSwitcher } from './theme-switcher/theme-switcher';
import { IconifyIcon } from '../../components/iconify-icon/iconify-icon';



@NgModule({
  declarations: [
    SettingsDialog,
    ThemeSwitcher
  ],
  exports: [
    SettingsDialog,
    ThemeSwitcher
  ],
  imports: [
    CommonModule,
    IconifyIcon
  ]
})
export class SettingsModule { }
