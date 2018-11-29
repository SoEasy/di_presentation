import { ServiceLocator } from '00_simple_service_locator';
import 'reflect-metadata';

// Декоратор чтобы пометить класс как внедряемый
export function Injectable(target: any): void {
  ServiceLocator.registerDependency(target, new target());
}

// Декоратор чтобы внедрить экземпляр нужного класса в поле
export function Inject(target, propertyKey): void {
  const constructor = Reflect.getMetadata('design:type', target, propertyKey);
  const descriptor = {
    get(): any {
      return ServiceLocator.resolveDependency(constructor);
    }
  };
  Object.defineProperty(target, propertyKey, descriptor);
}

@Injectable
class TransportService {
  send(): Promise<any> {
    return Promise.resolve(Math.random() > 0.5);
  }
}

class AwesomeService {
  @Inject transport: TransportService;

  action(): void {
    this.transport.send().then(v => console.log(v));
  }
}

const aws = new AwesomeService();
aws.action();