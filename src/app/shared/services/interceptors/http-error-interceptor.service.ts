import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import {GlobaleConstanten} from '../../model/globale-constanten';
import {MeldingService} from '../melding.service';

@Injectable()
export class HttpErrorInterceptorService implements HttpInterceptor {

  constructor(private meldingService: MeldingService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).catch(error => this.handle(error));
    }

  private handle(error): Observable<any> {
    const melding: {bericht: string, type: string} = this.getErrorMessage(error);
    this.meldingService.toonMelding(melding.bericht, melding.type);
    return Observable.throw(error);
  }

  private getErrorMessage(error): {bericht: string, type: string} {
    switch (error.status) {
      case 400: return {bericht: 'Er zijn validatiefouten', type: GlobaleConstanten.WAARSCHUWING};
      case 401: return {bericht: 'U bent niet geauthoriseerd voor deze actie.', type: GlobaleConstanten.FOUT};
      case 404: return {bericht: 'Niet gevonden', type: GlobaleConstanten.WAARSCHUWING};
      case 500: return {bericht: 'Er is iets aan de hand met de server. Neem contact op met Functioneel Beheer.', type: GlobaleConstanten.FOUT};
      default: return {bericht: 'Er is een onbekende fout opgetreden', type: GlobaleConstanten.FOUT};
    }
  }

}
