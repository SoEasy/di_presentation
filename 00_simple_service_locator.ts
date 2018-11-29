export class ServiceLocator {
  private static store = new Map();

  static registerDependency<T>(
    target: new(...args: Array<any>) => T,
    singletonImplementation: T
  ): void {
    ServiceLocator.store.set(target, singletonImplementation);
  }

  static resolveDependency<T>(target: new(...args: Array<any>) => T): T {
    return this.store.get(target);
  }
}