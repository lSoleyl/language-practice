
export interface NavigationEntry {
  id: string,
  description: string
}

export interface NavigationState {
  activeView: string | undefined;
  views: NavigationEntry[];
}


export const initialState: NavigationState = {
  activeView: undefined,
  views: []
};

