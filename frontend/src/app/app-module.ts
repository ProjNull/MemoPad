import { CUSTOM_ELEMENTS_SCHEMA, NgModule, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { SideBar } from './components/side-bar/side-bar';
import { DialogModule } from '@angular/cdk/dialog';
import { SettingsModule } from './dialogs/settings/settings-module';
import { IconifyIcon } from './components/iconify-icon/iconify-icon';
import { FormsModule } from '@angular/forms';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MainLoader } from './main-loader/main-loader';
import { TreeView } from './components/tree-view/tree-view';
import { TreeItem } from './components/tree-view/tree-item/tree-item';



import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { ServiceWorkerModule } from '@angular/service-worker';

const dbConfig: DBConfig  = {
  name: 'MemoPad',
  version: 1,
  objectStoresMeta: [
    {
      store: 'folders',
      storeConfig: { keyPath: 'localId', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: true } }
      ]
    },{
      store: 'notes',
      storeConfig: { keyPath: 'localId', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: true } },
        { name: 'content', keypath: 'content', options: { unique: true } },
        { name: 'remoteId', keypath: 'remoteId', options: { unique: true } }
      ]
    }
  ]
};



@NgModule({
  declarations: [
    App,
    SideBar,
    MainLoader,
    TreeView,
    TreeItem
  ],
  imports: [
    NgxIndexedDBModule.forRoot(dbConfig),
    DialogModule,
    BrowserModule,
    AppRoutingModule,
    SettingsModule,
    IconifyIcon,
    FormsModule,CdkMenuModule, 
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: !isDevMode(),
        // Register the ServiceWorker as soon as the application is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000'
      })
    
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [App]
})
export class AppModule { }
