export default interface RequestMetadata {
  page: number;
  prev: null | number;
  next: null | number;
  last: number;
  from: null | number;
  to: number;
  count: number;
}
