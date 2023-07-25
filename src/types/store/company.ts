export default interface Company {
  readonly id: number;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  website: string;
  type: string;
  subscription: string;
}
