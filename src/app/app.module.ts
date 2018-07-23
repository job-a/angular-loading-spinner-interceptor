import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';

import { AppComponent } from './app.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { MeldingComponent } from './melding/melding.component';

import { DomService } from './shared/services/dom.service';
import { MeldingService } from './shared/services/melding.service';
import { LoadingInterceptorService } from './shared/services/interceptors/loading-interceptor.service';
import { HttpErrorInterceptorService } from './shared/services/interceptors/http-error-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    LoadingSpinnerComponent,
    MeldingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    Angular2FontawesomeModule
  ],
  providers: [
    DomService,
    MeldingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    LoadingSpinnerComponent,
    MeldingComponent
  ]
})
export class AppModule { }
