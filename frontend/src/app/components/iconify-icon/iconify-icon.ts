import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { icons as biIcons, IconifyJSON } from "@iconify-json/bi";


const mappings: Record<string,IconifyJSON> = {
  "bi":biIcons
}

@Component({
  selector: 'iconify-icon',
  standalone: true,
  host: {
    "class":"w-4 h-4"
  },
  template: '<svg class="w-full h-full" viewBox="0 0 16 16" [innerHTML]="body"></svg>',
})
export class IconifyIcon implements OnInit {
  @Input("icon") icon!:string;
  

  

  constructor(private sanitizer: DomSanitizer) {}
  public body:SafeHtml | undefined;
  ngOnInit(): void {
    var data = this.icon.split(":");
    const iconSet = mappings[data[0]];
    if (iconSet) {
      const icon = iconSet.icons[data[1]];
      if (icon && icon != undefined) {
        this.body = this.sanitizer.bypassSecurityTrustHtml(icon.body);
      } else {
        this.body = this.sanitizer.bypassSecurityTrustHtml("<span>I:"+ this.icon +"</span>");
      }
    }
  }
}
