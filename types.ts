export enum CachingType {
  Exact = 'exact',
  Semantic = 'semantic',
}

export interface Message {
  id: string;
  text: string;
  from: 'user' | 'bot';
}