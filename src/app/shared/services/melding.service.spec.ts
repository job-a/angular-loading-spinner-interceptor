import { TestBed, inject } from '@angular/core/testing';

import { MeldingService } from './melding.service';
import {DomService} from './dom.service';
import {MeldingComponent} from '../../melding/melding.component';
import {Component, ComponentRef, EventEmitter, Input, Output} from '@angular/core';
import {MockComponentRef} from './mockservices/mock-component-ref';

describe('MeldingService', () => {
  let meldingService: MeldingService;
  let domServiceSpy: jasmine.SpyObj<DomService>;

  beforeEach(() => {
    const domSpy = jasmine.createSpyObj('DomService', ['appendComponentToBody', 'removeComponentFromBody']);
    TestBed.configureTestingModule({
      providers: [
        MeldingService,
        {provide: DomService, useValue: domSpy}
      ]
    });
    meldingService = TestBed.get(MeldingService);
    domServiceSpy = TestBed.get(DomService);
  });

  it('should be created', inject([MeldingService], (service: MeldingService) => {
    expect(service).toBeTruthy();
  }));

  it('should display a notification', () => {
    // given
    const bericht: string = 'testmelding';
    const berichtType: string = 'fout';
    const mockComponentReference: ComponentRef<MockMeldingComponent> = new MockComponentRef(new MockMeldingComponent());
    domServiceSpy.appendComponentToBody.and.returnValue(mockComponentReference);

    // when
    meldingService.toonMelding(bericht, berichtType);

    // then
    expect(domServiceSpy.appendComponentToBody.calls.count()).toBe(1);
    expect(domServiceSpy.appendComponentToBody.calls.mostRecent().args[0]).toBe(MeldingComponent);
    expect(mockComponentReference.instance.bericht).toBe(bericht);
    expect(mockComponentReference.instance.type).toBe(berichtType);
  });

  it('should display a single notification when called twice and the first notification is not closed', () => {
    // given
    const berichtType: string = 'waarschuwing';
    const mockComponentReference: ComponentRef<MockMeldingComponent> = new MockComponentRef(new MockMeldingComponent());
    domServiceSpy.appendComponentToBody.and.returnValue(mockComponentReference);

    // when
    meldingService.toonMelding('testmelding', berichtType);
    meldingService.toonMelding('testmelding2', berichtType);

    // then
    expect(domServiceSpy.appendComponentToBody.calls.count()).toBe(1);
  });

  it(`should display a single notification when called twice and the first notification is of type 'fout'`, () => {
    // given
    const berichtType: string = 'fout';
    const mockComponentReference: ComponentRef<MockMeldingComponent> = new MockComponentRef(new MockMeldingComponent());
    domServiceSpy.appendComponentToBody.and.returnValue(mockComponentReference);

    // when
    meldingService.toonMelding('testmelding', berichtType);
    meldingService.toonMelding('testmelding2', berichtType);

    // then
    expect(domServiceSpy.appendComponentToBody.calls.count()).toBe(1);
  });

  it(`should display subsequent notifications when called twice and the first notification is of type 'waarschuwing' and is closed`, () => {
    // given
    const bericht: string = 'testmelding';
    const bericht2: string = 'testmelding2';
    const berichtType: string = 'waarschuwing';
    const mockComponentReference: ComponentRef<MockMeldingComponent> = new MockComponentRef(new MockMeldingComponent());
    domServiceSpy.appendComponentToBody.and.returnValue(mockComponentReference);

    // when
    meldingService.toonMelding(bericht, berichtType);
    meldingService.toonMelding(bericht2, berichtType);

    // then
    expect(mockComponentReference.instance.bericht).toBe(bericht);
    expect(mockComponentReference.instance.type).toBe(berichtType);

    // and when the first notification is closed
    mockComponentReference.instance.closeButton();

    // then
    expect(mockComponentReference.instance.bericht).toBe(bericht2);
    expect(domServiceSpy.appendComponentToBody.calls.count()).toBe(2);
  });

});

@Component({
  selector: 'cola-mock-melding',
  template: `<div></div>`
})
class MockMeldingComponent {
  @Input() bericht: string;
  @Input() type: string; // voor mogelijke types zie CSS subclasses van dialoog
  @Output() dialoogSluiten: EventEmitter<any> = new EventEmitter<any>();

  closeButton(): void {
    if (this.type === 'fout') {
      window.location.reload();
    } else {
      this.closeModal();
    }
  }
  private closeModal(): void {
    this.dialoogSluiten.emit();
    this.dialoogSluiten.complete();
  }
}
