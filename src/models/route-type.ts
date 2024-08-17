import { Component } from "vue";

export interface IRouteType {
  path: string;
  alias?: string;
  name?: string;
  component: () => Promise<Component>;
  meta?: {
    title: string;
    guest?: boolean;
    requiresAuth?: boolean;
    description?: string;
    pageMeta?: {
      title: string;
      description: string;
      basePath?: string;
      basePathIcon?: string;
    };
  };
  children?: IRouteType[];
}

export interface IRouteGroupType {
  link: string;
  title: string;
  icon: string;
}

export interface ISidebarRouteType {
  home: IRouteGroupType[];
  payments: IRouteGroupType[];
  transfers: IRouteGroupType[];
  commerce: IRouteGroupType[];
  settings: IRouteGroupType[];
}

export interface ISideNavType {
  routeTitle: string;
  routeIcon: string;
  routeLinkName: string;
}
