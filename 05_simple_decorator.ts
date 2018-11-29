import { ServiceLocator } from '00_simple_service_locator';

// Просто тайпинг
type MethodDecorator = (target: object, propertyKey: string | symbol, descriptor?: TypedPropertyDescriptor<any>) =>
  void;

// Декоратор чтобы пометить класс как внедряемый
export function Injectable(target: any): void {
  ServiceLocator.registerDependency(target, new target());
}

// Декоратор чтобы внедрить экземпляр нужного класса в поле
export function Inject(ServiceConstructor: any): MethodDecorator {
  // tslint:disable-next-line
  return function(target, propertyKey) {
    const descriptor = {
      get(): any {
        return ServiceLocator.resolveDependency(ServiceConstructor);
      }
    };
    Object.defineProperty(target, propertyKey, descriptor);
  };
}

@Injectable
class TransportService {
  send(): Promise<any> {
    return Promise.resolve(Math.random() > 0.5);
  }
}

class AwesomeService {
  @Inject(TransportService) transport: TransportService;

  action(): void {
    this.transport.send().then(v => console.log(v));
  }
}

const aws = new AwesomeService();
aws.action();