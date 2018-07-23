import { TestBed, async } from '@angular/core/testing';

import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {LoadingSpinnerComponent} from './loading-spinner/loading-spinner.component';
import {FormsModule} from '@angular/forms';
import {Angular2FontawesomeModule} from 'angular2-fontawesome';

import {DomService} from './shared/services/dom.service';
import {MeldingService} from './shared/services/melding.service';
import {MeldingComponent} from './melding/melding.component';
import {AppComponent} from './app.component';

describe('AppComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        LoadingSpinnerComponent,
        MeldingComponent
      ],
      providers: [
        DomService,
        MeldingService
      ],
      imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        Angular2FontawesomeModule
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});
