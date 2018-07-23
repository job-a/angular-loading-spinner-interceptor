import {ComponentRef, Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import {DomService} from '../dom.service';
import {LoadingSpinnerComponent} from '../../../loading-spinner/loading-spinner.component';


@Injectable()
export class LoadingInterceptorService implements HttpInterceptor {

  constructor(private domService: DomService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const componentReference: ComponentRef<any> = this.domService.appendComponentToBody(LoadingSpinnerComponent);

    return next.handle(req)
      .finally( () => this.domService.removeComponentFromBody(componentReference));
  }

}
