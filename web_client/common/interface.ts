
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

export type { NameResolverResponse, LookupHostResponse };
