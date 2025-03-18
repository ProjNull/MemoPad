import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { provideHttpClient } from '@angular/common/http';
import { LoginComponent } from './pages/auth/login/login.component';
import { FolderViewItemComponent } from './components/folder-view-item/folder-view-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoteViewItemComponent } from './components/note-view-item/note-view-item.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    FolderViewItemComponent,
    NoteViewItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
