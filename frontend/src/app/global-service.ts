import { Injectable } from '@angular/core';

export type ThemeVariant = {
  label: string,
  value: string
};

export const themeVariants:ThemeVariant[] = [
  {label:"Auto",value:"default"},
  {label:"Light",value:"memopadLight"},
  {label:"Dark",value:"memopadDark"}
]

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private theme: string = "auto";
  setTheme(t:string) {
    this.theme = t
    this.updateTheme()
  }

  getTheme() {
    return this.theme;
  }



  updateTheme() {
    if (this.theme == "default") {

      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", this.theme);
    }
    sessionStorage.setItem("theme",this.theme);
  }

  constructor() {
    var thm: string |null = sessionStorage.getItem("theme");
    if (thm) {
      this.theme = thm;
      this.updateTheme()
    }

  }
}
