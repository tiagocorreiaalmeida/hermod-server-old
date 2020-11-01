export interface Repo<T> {
  exists: (target: T) => Promise<boolean>;
  save: (target: T) => Promise<void>;
}
