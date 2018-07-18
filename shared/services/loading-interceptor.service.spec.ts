import {DebugElement} from '@angular/core';
import {TestBed, inject, ComponentFixture} from '@angular/core/testing';
import {LoadingInterceptorService} from './loading-interceptor.service';
import {HTTP_INTERCEPTORS, HttpClient, HttpResponse} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';

@Component({
  template: `<div id='loadingspinner' style='display: none'>{{text}}</div>`
})
class LoadingComponent {
  text = 'Loading';
}

describe('LoadingInterceptorService', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingComponent ],
      imports: [HttpClientTestingModule],
      providers: [
        LoadingInterceptorService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoadingInterceptorService,
          multi: true
        }]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', inject([LoadingInterceptorService], (service: LoadingInterceptorService) => {
    expect(component).toBeDefined();
    expect(service).toBeTruthy();

    const loadingElement: DebugElement = fixture.debugElement.query(By.css('#loadingspinner'));
    expect(loadingElement.nativeElement.innerText).toBe('Loading');
  }));

  it('passes on an unmodified get request to the next handler', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    http.get('/data').subscribe(
      response => {
        expect(response).toBeTruthy();
      }
    );

    const req = httpMock.expectOne('/data');
    expect(req.request.method).toEqual('GET');
    httpMock.verify();
  }));

  it('on http request show loading element and hide when resolved', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    http.get('/data').subscribe(
      response => {
        expect(response).toBeTruthy();
      }
    );

    const req = httpMock.expectOne('/data');
    expect(req.request.method).toEqual('GET');

    const loadingElement: DebugElement = fixture.debugElement.query(By.css('#loadingspinner'));
    expect(loadingElement.nativeElement.style.display).toBe('block');

    req.flush(new HttpResponse());
    expect(loadingElement.nativeElement.style.display).toBe('none');

    httpMock.verify();
  }));

});
