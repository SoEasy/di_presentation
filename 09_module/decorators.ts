import 'reflect-metadata';
import { ServiceLocator } from '09_module/advanced_service_locator';
import { IModuleConfig, UseClassProvider, UseExistProvider, UseValueProvider, UseFactoryProvider } from './types';

export function Module(config: IModuleConfig): (target: any) => void {
  // В данном примере обойдемся без использования target, хотя его конструктор так же можно пропатчить по примеру
  // 08-09 и передать туда зависимости
  return function(target: any): void {
    // Если ни одна зависимость не конфигурируется для хитрого использования - просто запускам модуль
    if (!config.providers) {
      new config.entry();
      return;
    }

    // useValue - самый ранний провайдер - просто предоставляет значение
    config.providers.filter((provider: UseValueProvider) => !!provider.useValue).forEach(
      (provider: UseValueProvider) => {
        ServiceLocator.registerDependency(provider.provide, provider.useValue);
      }
    );

    // useClass - второй провайдер - подменяет зависимость другим классом, создавая его экземпляр заново
    config.providers.filter((provider: UseClassProvider) => !!provider.useClass).forEach(
      (provider: UseClassProvider) => {
        ServiceLocator.registerDependency(provider.provide, new provider.useClass());
      }
    );

    // useExists - третий провайдер - подменяет зависимость экземпляром уже сущестующей подменной зависимости
    config.providers.filter((provider: UseExistProvider) => !!provider.useExist).forEach(
      (provider: UseExistProvider) => {
        ServiceLocator.registerDependency(provider.provide, ServiceLocator.resolveDependency(provider.useExist));
      }
    );

    // useFactory - последний провайдер - предоставляет место для конфигурации выбора зависимости
    config.providers.filter((provider: UseFactoryProvider) => !!provider.useFactory).forEach(
      (provider: UseFactoryProvider) => {
        const factoryDeps = provider.deps ? provider.deps.map(dep => ServiceLocator.resolveDependency(dep)) :[];
        ServiceLocator.registerDependency(provider.provide, provider.useFactory.bind(null, ...factoryDeps));
      }
    );

    // запускаем модуль
    new config.entry();

    // Можно улучшить модуль, чтобы он тоже определял зависимости и подставлял их в свой конструктор
  }
}

// Декоратор чтобы пометить класс как внедряемый
export function Injectable(target: any): void {
  ServiceLocator.registerDependency(target, new target());
}

// Декоратор, который умеет патчить конструктор
export function Service(target: any): any {
  function resolveDependencies(targetClass: any): Array<any> {
    // Получаем все типы аргументов в конструкторе
    const constructors = Reflect.getMetadata('design:paramtypes', targetClass);

    // для каждого получаем экземпляр из севрислокатора
    return constructors.map(constr => {
      const impl = ServiceLocator.resolveDependency(constr);
      if (!impl) {
        throw new Error(`Не должно быть дырок в DI, а у вас не находится ${constr.name}`);
      }
      return impl;
    });
  }

  // common code для переопределения конструктора
  const originalConstructor = target;
  function construct(constructor: any, args: Array<any>): any {
    const c: any = function () {
      return constructor.apply(this, args);
    };

    c.prototype = constructor.prototype;
    return new c();
  }

  const newConstructor = function () {
    const deps = resolveDependencies(target);
    // Создаем экземпляр с полученными ранее зависимостями
    const newInstance = construct(originalConstructor, deps);
    return newInstance;
  };
  newConstructor.prototype = originalConstructor.prototype;
  return newConstructor;
}