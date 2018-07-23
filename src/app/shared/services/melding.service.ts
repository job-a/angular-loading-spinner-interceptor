import {ComponentRef, Injectable} from '@angular/core';
import {MeldingComponent} from '../../melding/melding.component';
import {DomService} from './dom.service';

@Injectable()
export class MeldingService {
  private meldingenQueue: {bericht: string, type: string}[] = [];
  private openstaandeMelding: boolean = false;

  constructor(private domService: DomService) {}

  toonMelding(bericht: string, type: string): void {
    this.meldingenQueue.push({bericht: bericht, type: type});
    if (this.openstaandeMelding === false) {
      this.openstaandeMelding = true;
      this.toonEerstVolgendeMeldingVanQueue();
    }
  }

  private toonEerstVolgendeMeldingVanQueue(): void {
    const inhoudVanEerstvolgendeMelding: {bericht: string, type: string} = this.meldingenQueue.shift();
    const referentieNaarComponent: ComponentRef<MeldingComponent> = this.domService.appendComponentToBody(MeldingComponent);
    this.vulMelding(inhoudVanEerstvolgendeMelding, referentieNaarComponent);
  }

  private vulMelding(melding: {bericht: string, type: string}, referentieNaarComponent: ComponentRef<MeldingComponent>): void {
    referentieNaarComponent.instance.bericht = melding.bericht;
    referentieNaarComponent.instance.type = melding.type;
    this.meldingSluitenCallback(referentieNaarComponent);
  }

  private meldingSluitenCallback(referentieNaarComponent: ComponentRef<MeldingComponent>): void {
    referentieNaarComponent.instance.dialoogSluiten.subscribe(
      () => {},
      () => {},
      () => {
        this.domService.removeComponentFromBody(referentieNaarComponent);
        this.openstaandeMelding = false;
        if (this.meldingenQueue.length > 0) {
          this.toonEerstVolgendeMeldingVanQueue();
        }
      }
    );
  }

}
