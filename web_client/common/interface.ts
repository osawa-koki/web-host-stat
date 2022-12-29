
type NameResolverResponse = {
  address: string;
  message: string;
  domain: string;
}

type LookupHostResponse = {
  address: string[];
  message: string;
  domain: string;
}

type PortscanResponse = {
  host: string;
  from: number;
  to: number;
  open: number[];
  message: string;
}

export type { NameResolverResponse, LookupHostResponse, PortscanResponse };
