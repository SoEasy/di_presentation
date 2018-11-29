import { TransportService } from '00_deps';

// Где-то выше в приложении
ServiceLocator.registerDependency(TransportService, new TransportService());

// Где-то в месте использования

class AwesomeService {
  loadData() {
    const transport = ServiceLocator.resolveDependency(TransportService);
    return transport.send().then(/* process response */);
  }
}