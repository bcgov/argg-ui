import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RegisterApiComponent } from './register-api/register-api.component';

import { ArggService } from './services/argg.service';
import { BcdcService } from './services/bcdc.service';
import { OpenApiService } from './services/openapi.service';
import { UrlService } from './services/url.service';

@NgModule({
  declarations: [
    AppComponent,
    RegisterApiComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule    
  ],
  providers: [
    BcdcService,
    OpenApiService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
