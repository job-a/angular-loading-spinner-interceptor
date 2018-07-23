import {TestBed, inject} from '@angular/core/testing';
import {DomService} from './dom.service';
import {Component, ComponentRef, NgModule} from '@angular/core';

describe('DOM service', () => {
  let domService: DomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DomService],
      imports: [MockNgModule]
    });

    domService = TestBed.get(DomService);
  });

  it('should be created', inject([DomService], (service: DomService) => {
    expect(service).toBeTruthy();
  }));

  it('should be able to inject a component into the DOM and then remove that component from the DOM', () => {
    // when
    const mockComponentRef: ComponentRef<MockComponent> = domService.appendComponentToBody(MockComponent);
    // then
    expect(document.getElementById('mockdiv')).toBeTruthy();

    // when
    domService.removeComponentFromBody(mockComponentRef);
    // then
    expect(document.getElementById('mockdiv')).toBeFalsy();
  });

});

@Component({
  selector: 'mock',
  template: `<div id="mockdiv">Mock</div>`,
})
class MockComponent {}

@NgModule({
  declarations: [
    MockComponent
  ],
  exports: [MockComponent],
  entryComponents: [
    MockComponent
  ]
})
class MockNgModule {}
