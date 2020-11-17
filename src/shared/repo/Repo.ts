export interface Repo<T> {
  exists: (targetId: string) => Promise<boolean>;
  save: (target: T) => Promise<void>;
}
