/**
 * Интерфейсы и типы для примера реализации подхода ангуляра
 */

// Базовый интерфейс конфигурируемой зависимости
export interface BaseProvider {
  provide: any;
}

// Интерфейс внедряемой зависимости, подменяющейся другой
export interface UseClassProvider extends BaseProvider {
  useClass: any;
}

// Интерфейс внедряемой зависимости, подменяющейся экземпляром уже аннотированной зависимости
export interface UseExistProvider extends BaseProvider {
  useExist: any;
}

// Интерфейс внедряемой зависимости, являющейся простым объектом
export interface UseValueProvider extends BaseProvider {
  useValue: any;
}

// Интерфейс внедряемой зависимости, конфигурируемой в зависимости от внешних условий
export interface UseFactoryProvider extends BaseProvider {
  useFactory: (...args: Array<any>) => any;
  deps?: Array<any>;
}

// Определение зависимости может быть одним из перечисленных, но не их пересечением
export type IInjectable = UseClassProvider | UseExistProvider | UseValueProvider | UseFactoryProvider;

// Примитивный интерфейс для анонтации модуля
export interface IModuleConfig {
  providers?: Array<IInjectable>;
  entry: any;
}