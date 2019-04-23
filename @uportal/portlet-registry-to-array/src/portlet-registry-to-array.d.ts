export interface RegistryResponse {
  registry: Registry;
}

export interface Registry {
  categories: Category[];
}

export interface Category {
  name: string;
  description: string;
  id: string;
  portlets: Portlet[];
  subcategories: Category[];
}

export interface Portlet {
  [keys: string]: unknown;
  fname: string;
  keywords: string[];
  averageRating: number;
  name: string;
  description: string;
  ratingCount: number;
  typeId: number;
  id: number;
  portletState: string;
  title: string;
  parameters: {
    [name: string]: PortletParameter;
  };
}

export interface PortletParameter {
  name: string;
  description: string;
  value: string;
}

export function portletRegistryToArray(registry: RegistryResponse): Portlet[];
