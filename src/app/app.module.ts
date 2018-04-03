import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AgmCoreModule, GoogleMapsAPIWrapper, MarkerManager } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCH2fPF73m7rlBHjGKHbQORYTrr87_cGOM'
    }),
    FormsModule
  ],
  providers: [GoogleMapsAPIWrapper, MarkerManager],
  bootstrap: [AppComponent]
})
export class AppModule { }
