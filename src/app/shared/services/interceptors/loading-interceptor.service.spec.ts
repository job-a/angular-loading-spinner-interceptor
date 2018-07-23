import {TestBed, inject} from '@angular/core/testing';
import {LoadingInterceptorService} from './loading-interceptor.service';
import {HTTP_INTERCEPTORS, HttpClient, HttpResponse} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {DomService} from '../dom.service';
import {LoadingSpinnerComponent} from '../../../loading-spinner/loading-spinner.component';
import {MockComponentRef} from '../mockservices/mock-component-ref';
import {ComponentRef} from '@angular/core';

describe('LoadingInterceptorService', () => {
  let loadingInterceptorService: LoadingInterceptorService;
  let domServiceSpy: jasmine.SpyObj<DomService>;


  beforeEach(() => {
  const domSpy = jasmine.createSpyObj('DomService', ['appendComponentToBody', 'removeComponentFromBody']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {provide: DomService, useValue: domSpy},
        LoadingInterceptorService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoadingInterceptorService,
          multi: true
        }]
    });

    loadingInterceptorService = TestBed.get(LoadingInterceptorService);
    domServiceSpy = TestBed.get(DomService);
  });

  it('should be created', inject([LoadingInterceptorService], (service: LoadingInterceptorService) => {
    expect(service).toBeTruthy();
  }));

  it('passes on an unmodified get request to the next handler', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    /* stub the domService */
    const mockComponentReference: ComponentRef<LoadingSpinnerComponent> = new MockComponentRef(new LoadingSpinnerComponent());
    domServiceSpy.appendComponentToBody.and.returnValue(mockComponentReference);

    /* send a http request and assert a response */
    http.get('/data').subscribe(
      response => {
        expect(response).toBeTruthy();
      }
    );

    const req = httpMock.expectOne('/data'); // assert the number of http requests
    expect(req.request.method).toEqual('GET'); // assert the type of http request
    req.flush(new HttpResponse()); // complete the request and return the object passed in as parameter
    httpMock.verify(); // verify that there are no outstanding http calls
  }));

  it('on http request show loading element via DomService and hide when resolved', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    const mockComponentReference: ComponentRef<LoadingSpinnerComponent> = new MockComponentRef(new LoadingSpinnerComponent());
    domServiceSpy.appendComponentToBody.and.returnValue(mockComponentReference);

    http.get('/data').subscribe(
      response => {
        expect(response).toBeTruthy();
      }
    );

    const req = httpMock.expectOne('/data');
    req.flush(new HttpResponse());

    /* assert the stub methods are called as expected */
    expect(domServiceSpy.appendComponentToBody.calls.count()).toBe(1);
    expect(domServiceSpy.appendComponentToBody.calls.mostRecent().args[0]).toBe(LoadingSpinnerComponent);
    expect(domServiceSpy.appendComponentToBody.calls.mostRecent().returnValue).toBe(mockComponentReference);
    expect(domServiceSpy.removeComponentFromBody.calls.count()).toBe(1);
    expect(domServiceSpy.removeComponentFromBody.calls.mostRecent().args[0]).toBe(mockComponentReference);
  }));

});
