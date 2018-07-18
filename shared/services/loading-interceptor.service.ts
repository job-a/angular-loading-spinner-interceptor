import { Injectable } from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/finally';

@Injectable()
export class LoadingInterceptorService implements HttpInterceptor {
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const loadingSpinner: HTMLElement = document.getElementById('loadingspinner');
    enableSpinner();

    return next.handle(req)
      .finally(disableSpinner);

    function enableSpinner() {
      if (loadingSpinner) {
        loadingSpinner.style.display = 'block';
      }
    }

    function disableSpinner() {
      if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
      }
    }
  }

}
