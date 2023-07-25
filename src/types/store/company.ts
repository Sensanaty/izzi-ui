export default interface Company {
  readonly id: number;
  name: string;
  email: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
  number?: string
  type?: string;
  subscription?: string;
}
