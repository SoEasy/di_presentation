import { ITransportService, TransportService, DefaultTransportService } from '00_deps';

class AwesomeService {
  private _transportService: ITransportService;

  get transportService(): ITransportService {
    if (!this._transportService) {
      // Тут можно кинуть ошибку
      this._transportService = new DefaultTransportService();
    }
    return this._transportService;
  }

  set transportService(dependency: ITransportService) {
    this._transportService = dependency;
  }

  action(): void {
    this.transportService.send().then(
      response => console.log(response)
    )
  }
}

const transportInstance = new TransportService();
const awsWithDep = new AwesomeService();
awsWithDep.transportService = transportInstance; // использована переданная зависимость
