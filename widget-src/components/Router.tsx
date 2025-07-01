import { Route, Breadcrumb, StyleRouteType, StyleOriginRouteType, navigate } from '../routes';
import { AuditStyleStats } from '../audit/buildStats';
import Home from './views/Home';
import StyleStats from './views/StyleStats';
import StyleOriginStats from './views/StyleOriginStats';

interface RouterProps {
  route: Route;
  stats: AuditStyleStats;
  setRoute: (route: Route) => void;
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
}

const Router = ({route, setRoute, setBreadcrumbs}: RouterProps) => {

  const handleNavigate = (next: Route, label: string) => {
    navigate(next, label, setRoute, setBreadcrumbs);
  };

  const camelCaseToTitleCase = (str: string): string => {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, s => s.toUpperCase());
  };

  switch(route.type) {
    case "home": 
      return (
        <Home
          stats={stats}
          onStyleClick={(style: StyleRouteType) => handleNavigate(
            { type: "style", style }, 
            camelCaseToTitleCase(style))
          } />
      )
    case "style":
      return (
        <StyleStats
          stats={stats[route.style]}
          style={route.style}
          onOriginClick={(origin: StyleOriginRouteType) => handleNavigate(
            { type: "styleOrigin", style: route.style, origin }, 
            `${camelCaseToTitleCase(origin)} ${camelCaseToTitleCase(route.style)}`)
          }/>
      )
    case "styleOrigin":
      return (
        <StyleOriginStats
          stats={stats[route.style][route.origin]}
          style={route.style}
          origin={route.origin} />
      )
  }
};

export default Router;