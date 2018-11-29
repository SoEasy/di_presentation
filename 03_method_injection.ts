import { ITransportService, TransportService, DefaultTransportService } from '00_deps';

class AwesomeService {
  action(transport?: ITransportService) {
    transport = transport || new DefaultTransportService();
    return transport.send().then(/* process response */);
  }
}

const t = new TransportService();
const a=  new AwesomeService();
a.action(t);