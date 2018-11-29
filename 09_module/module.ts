import { Injectable, Module, Service } from '09_module/decorators';

@Injectable
class TransportService {
  send(): Promise<any> {
    console.log('Im never execute');
    return Promise.resolve(Math.random() > 0.5);
  }
}

@Injectable
class TestTransportService {
  constructor() {
  }
  send(): Promise<any> {
    console.log('Im always return true');
    return Promise.resolve(true);
  }
}

@Injectable
class EnvService {
  isDevEnv(): boolean {
    return Math.random() > 0.5;
  }
}

@Service
class AwesomeService {
  constructor(private transport: TransportService) {
    this.action();
  }

  action(): void {
    this.transport.send().then(v => console.log(v));
  }
}

@Module({
  entry: AwesomeService,
  providers: [
    {
      provide: TransportService,
      useFactory: (envService: EnvService) => {
        return envService.isDevEnv() ? new TestTransportService() : new TransportService();
      },
      deps: [EnvService]
    }
  ]
})
class AwesomeModule {}
