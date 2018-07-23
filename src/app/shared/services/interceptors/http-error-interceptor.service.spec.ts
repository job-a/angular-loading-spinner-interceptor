import {TestBed, inject} from '@angular/core/testing';
import {HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpErrorInterceptorService} from './http-error-interceptor.service';
import {GlobaleConstanten} from '../../model/globale-constanten';
import {MeldingService} from '../melding.service';

describe('HttpErrorInterceptorService', () => {
  let meldingServiceSpy: jasmine.SpyObj<MeldingService>;

  beforeEach(() => {
  const meldingSpy = jasmine.createSpyObj('MeldingService', ['toonMelding']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {provide: MeldingService, useValue: meldingSpy},
        HttpErrorInterceptorService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptorService,
          multi: true
        }]
    });

    meldingServiceSpy = TestBed.get(MeldingService);
  });

  it('should be created', inject([HttpErrorInterceptorService], (service: HttpErrorInterceptorService) => {
    expect(service).toBeTruthy();
  }));

  it('does nothing on a successful http response', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    /* create a mock response */
    const data = 'Some valid body';
    const mockResponse = new HttpResponse({
      status: 200, statusText: 'OK'
    });

    /* send a http request and assert a response and error*/
    http.get('/data').subscribe(
      res => { expect(res).toBe(data); },
      error => { expect(error).toBeFalsy(); }
    );

    const req = httpMock.expectOne('/data'); // assert the number of http requests
    expect(req.request.method).toEqual('GET'); // assert the type of http request
    req.flush(data, mockResponse); // complete the request and return the object passed in as parameter
    httpMock.verify(); // verify that there are no outstanding http calls
  }));

  it(`creates an error dialog 'Er zijn validatiefouten' when 400 occurs`, inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    const data = 'Er zijn validatiefouten';
    const mockErrorResponse = new HttpErrorResponse({
      error : null,
      headers : null,
      status : 400,
      statusText : 'Invalid request',
      url : '/data',
    });

    /* send a http request and assert a response and error*/
    http.get('/data').subscribe(
      res => { expect(res).toBe(data); },
      error => { expect(error).toBeTruthy(); }
    );

    const req = httpMock.expectOne('/data'); // assert the number of http requests
    expect(req.request.method).toEqual('GET'); // assert the type of http request
    req.flush(data, mockErrorResponse); // complete the request and return the object passed in as parameter

    expect(meldingServiceSpy.toonMelding.calls.count()).toBe(1);
    expect(meldingServiceSpy.toonMelding.calls.mostRecent().args).toEqual([data, GlobaleConstanten.WAARSCHUWING]);

    httpMock.verify(); // verify that there are no outstanding http calls
  }));

  it(`creates an error dialog 'U bent niet geauthoriseerd voor deze actie' when 401 occurs`, inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    const data = 'U bent niet geauthoriseerd voor deze actie.';
    const mockErrorResponse = {
      status: 401, statusText: 'Unauthorized'
    };

    /* send a http request and assert a response and error*/
    http.get('/data').subscribe(
      res => { expect(res).toBe(data); },
      error => { expect(error).toBeTruthy(); }
    );

    const req = httpMock.expectOne('/data'); // assert the number of http requests
    expect(req.request.method).toEqual('GET'); // assert the type of http request
    req.flush(data, mockErrorResponse); // complete the request and return the object passed in as parameter

    expect(meldingServiceSpy.toonMelding.calls.count()).toBe(1);
    expect(meldingServiceSpy.toonMelding.calls.mostRecent().args).toEqual([data, GlobaleConstanten.FOUT]);

    httpMock.verify(); // verify that there are no outstanding http calls
  }));

  it(`creates an error dialog 'Resource niet gevonden' when 404 occurs`, inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    const data = 'Niet gevonden';
    const mockErrorResponse = {
      status: 404, statusText: 'Not found'
    };

    /* send a http request and assert a response and error*/
    http.get('/data').subscribe(
      res => { expect(res).toBe(data); },
        error => { expect(error).toBeTruthy(); }
    );

    const req = httpMock.expectOne('/data'); // assert the number of http requests
    expect(req.request.method).toEqual('GET'); // assert the type of http request
    req.flush(data, mockErrorResponse); // complete the request and return the object passed in as parameter

    expect(meldingServiceSpy.toonMelding.calls.count()).toBe(1);
    expect(meldingServiceSpy.toonMelding.calls.mostRecent().args).toEqual([data, GlobaleConstanten.WAARSCHUWING]);

    httpMock.verify(); // verify that there are no outstanding http calls
  }));

  it(`creates an error dialog 'Er is een onbekende fout opgetreden' when 207 occurs`, inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    const data = 'Er is een onbekende fout opgetreden';
    const mockErrorResponse = {
      status: 418, statusText: `I'm a teapot`
    };

    /* send a http request and assert a response and error*/
    http.get('/data').subscribe(
      res => { expect(res).toBe(data); },
      error => { expect(error).toBeTruthy(); }
    );

    const req = httpMock.expectOne('/data'); // assert the number of http requests
    expect(req.request.method).toEqual('GET'); // assert the type of http request
    req.flush(data, mockErrorResponse); // complete the request and return the object passed in as parameter

    expect(meldingServiceSpy.toonMelding.calls.count()).toBe(1);
    expect(meldingServiceSpy.toonMelding.calls.mostRecent().args).toEqual([data, GlobaleConstanten.FOUT]);

    httpMock.verify(); // verify that there are no outstanding http calls
  }));

});
