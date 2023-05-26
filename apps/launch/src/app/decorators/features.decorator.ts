import { Injector, Type, inject } from "@angular/core";

// const injector = Symbol('injector');
const injectorSymbol = '___injector';

export const Features = (feature: string[] | string) => {
  return <T extends Type<any>>(constructor: T) => {
    Object.defineProperty(constructor.prototype, '___injector', {
      value: inject(Injector)
    });

    // Object.defineProperty(constructor.prototype, 'constructor', {
    //   value: function () {
    //   }
    // });

    return constructor;
  }
}
