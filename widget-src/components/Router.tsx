import { Route, Breadcrumb } from '../routes';
import { AuditStyleStats } from '../audit/buildStats';
import Home from './views/Home';
import StyleStats from './views/StyleStats';
import StyleOriginStats from './views/StyleOriginStats';

interface RouterProps {
  stats: AuditStyleStats;
  route: Route;
  setRoute: (route: Route) => void;
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
}

const Router = ({stats, route, setRoute, setBreadcrumbs}: RouterProps) => {
  switch(route.type) {
    case "home": 
      return (
        <Home
          stats={stats}
          setBreadcrumbs={setBreadcrumbs}
          setRoute={setRoute} />
      )
    case "style":
      return (
        <StyleStats
          stats={stats}
          routeStyle={route.style}
          setRoute={setRoute}
          setBreadcrumbs={setBreadcrumbs}/>
      )
    case "styleOrigin":
      return (
        <StyleOriginStats
          stats={stats}
          routeStyle={route.style}
          routeOrigin={route.origin} />
      )
  }
};

export default Router;