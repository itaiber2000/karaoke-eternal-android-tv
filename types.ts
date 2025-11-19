export interface ServerConfig {
  id: string;
  name: string;
  url: string;
  isDefault: boolean;
}

export enum ScreenState {
  HOME = 'HOME',
  ADD_EDIT = 'ADD_EDIT',
  VIEWER = 'VIEWER'
}