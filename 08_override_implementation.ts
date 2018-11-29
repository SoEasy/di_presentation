import { ServiceLocator } from '00_simple_service_locator';
import 'reflect-metadata';

// Декоратор чтобы пометить класс как внедряемый
export function Injectable(target: any): void {
  ServiceLocator.registerDependency(target, new target());
}

export function Override(superclass: any): (target: any) => void  {
  return function(target: any): void {
    ServiceLocator.registerDependency(superclass, new target());
  }
}

function Service(target: any): any {
  // Получаем все типы аргументов в конструкторе
  const constructors = Reflect.getMetadata('design:paramtypes', target);

  // для каждого получаем экземпляр из севрислокатора
  const deps = constructors.map(constr => {
    const impl = ServiceLocator.resolveDependency(constr);
    if (!impl) {
      throw new Error(`Не должно быть дырок в DI, а у вас не находится ${constr.name}`);
    }
    return impl;
  });

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
    // Создаем экземпляр с полученными ранее зависимостями
    const newInstance = construct(originalConstructor, deps);
    return newInstance;
  };
  newConstructor.prototype = originalConstructor.prototype;
  return newConstructor;
}

@Injectable
class TransportService {
  send(): Promise<any> {
    console.log('Im never execute');
    return Promise.resolve(Math.random() > 0.5);
  }
}

@Override(TransportService)
class TestTransportService {
  send(): Promise<any> {
    console.log('Im always return true');
    return Promise.resolve(true);
  }
}

@Service
class AwesomeService {
  constructor(private transport?: TransportService) {}

  action(): void {
    this.transport.send().then(v => console.log(v));
  }
}

const aws = new AwesomeService();
aws.action();