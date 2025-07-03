import { Route, Breadcrumb } from '../../routes';
import { AuditStyleStats } from '../../audit/buildStats';
import Home from './Home';
import AuditStats from './AuditStats';

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
    case "stat":
      return (
        <AuditStats
          stats={stats}
          routeStat={route.stat}
          routeOriginStat="local"
          setRoute={setRoute}
          setBreadcrumbs={setBreadcrumbs} />
      )
    case "originStat":
      return (
        <AuditStats
          stats={stats}
          routeStat={route.stat}
          routeOriginStat="remote"
          setRoute={setRoute}
          setBreadcrumbs={setBreadcrumbs} />
      )
  }
};

export default Router;