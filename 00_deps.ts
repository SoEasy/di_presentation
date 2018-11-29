export interface ITransportService {
  send(request?: any): Promise<any>;
}

export class TransportService implements ITransportService {
  send(): Promise<boolean> {
    return Promise.resolve(Math.random() > 0.5);
  }
}

export class DefaultTransportService implements ITransportService {
  send(): Promise<boolean> {
    return Promise.resolve(true);
  }
}