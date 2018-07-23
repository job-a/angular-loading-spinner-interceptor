import {ChangeDetectorRef, ComponentRef, ElementRef, Injector, Type, ViewRef} from '@angular/core';

export class MockComponentRef<C> extends ComponentRef<C> {
  readonly changeDetectorRef: ChangeDetectorRef;
  readonly componentType: Type<any>;
  readonly hostView: ViewRef;
  readonly injector: Injector;
  readonly instance: C;
  readonly location: ElementRef;

  constructor(component: C) {
    super();
    this.instance = component;
  }

  destroy(): void {
  }

  onDestroy(callback: Function): void {
  }

}
