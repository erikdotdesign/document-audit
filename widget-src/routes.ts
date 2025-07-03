import React from "react";

export type RouteStatType = "layers" | "variables" | "components" | "colorStyles" | "textStyles" | "effectStyles" | "gridStyles";
export type RouteOriginStatType = "local" | "remote";

export type Route =
  | { type: "home" }
  | { type: "stat"; stat: RouteStatType }
  | { type: "originStat"; stat: RouteStatType; origin: RouteOriginStatType };

export type Breadcrumb = {
  label: string;
  route: Route;
};

export const navigate = (
  next: Route,
  label: string,
  setRoute: (r: Route) => void,
  setBreadcrumbs: React.Dispatch<React.SetStateAction<Breadcrumb[]>>
) => {
  setRoute(next);
  setBreadcrumbs((prev: Breadcrumb[]) => [...prev, { label, route: next }]);
};

export const navigateToBreadcrumb = (
  index: number,
  breadcrumbs: Breadcrumb[],
  setRoute: (r: Route) => void,
  setBreadcrumbs: React.Dispatch<React.SetStateAction<Breadcrumb[]>>
) => {
  const target = breadcrumbs[index];
  if (!target) return;

  setRoute(target.route);
  setBreadcrumbs(breadcrumbs.slice(0, index + 1));
};

export const goBack = (
  setRoute: (r: Route) => void,
  setBreadcrumbs: React.Dispatch<React.SetStateAction<Breadcrumb[]>>
) => {
  setBreadcrumbs((prev: Breadcrumb[]) => {
    if (prev.length <= 1) return prev;
    const next = prev.slice(0, -1);
    const last = next[next.length - 1];
    setRoute(last?.route || { type: "home" });
    return next;
  });
};