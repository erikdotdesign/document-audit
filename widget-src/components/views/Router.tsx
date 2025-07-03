import { Route, Breadcrumb } from '../../routes';
import { AuditStats } from '../../audit/buildStats';
import Home from './Home';
import Stats from './Stats';

interface RouterProps {
  stats: AuditStats;
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
    case "stat":
      return (
        <Stats
          stats={stats}
          routeStat={route.stat}
          routeOriginStat="local"
          setRoute={setRoute}
          setBreadcrumbs={setBreadcrumbs} />
      )
    case "originStat":
      return (
        <Stats
          stats={stats}
          routeStat={route.stat}
          routeOriginStat="remote"
          setRoute={setRoute}
          setBreadcrumbs={setBreadcrumbs} />
      )
  }
};

export default Router;