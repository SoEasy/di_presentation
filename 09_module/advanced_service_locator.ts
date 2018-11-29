export class ServiceLocator {
  private static store = new Map();

  static registerDependency<T>(
    target: new(...args: Array<any>) => T,
    singletonImplementation: T | (() => T)
  ): void {
    // Научили ServiceLocator принимать функцию - это понадобится для реализации стратегии useFactory
    const implementation = typeof singletonImplementation === 'function'
                           ? singletonImplementation()
                           : singletonImplementation;
    ServiceLocator.store.set(target, implementation);
  }

  static resolveDependency<T>(target: new(...args: Array<any>) => T): T {
    return this.store.get(target);
  }
}