import { ITransportService, TransportService, DefaultTransportService } from '00_deps';

class AwesomeService {
  private transportService: ITransportService;

  constructor(transportServiceImpl?: ITransportService) {
    this.transportService = transportServiceImpl || new DefaultTransportService();
  }

  action(): void {
    this.transportService.send().then(
      response => console.log(response)
    )
  }
}

const transportInstance = new TransportService();
const awsWithDep = new AwesomeService(transportInstance); // использована переданная зависимость
const awsWithoutDep = new AwesomeService(); // использована зависимость по умолчанию
