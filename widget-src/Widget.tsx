import { AuditStats, buildAuditStats } from './audit/buildStats';
import { auditFigmaDocument } from './audit/processNodes';
import { Route, Breadcrumb } from './routes';
import Header from './components/Header';
import Router from './components/views/Router';
import Footer from './components/Footer';
import style from './style';

const { widget } = figma;
const { useSyncedState, AutoLayout, waitForTask, useEffect } = widget;

export const Widget = () => {
  const defaultRoute: Route = { type: "home" };
  const [stats, setStats] = useSyncedState<AuditStats>('stats', buildAuditStats());
  const [lastAuditKey, setLastAuditKey] = useSyncedState<number>('lastAuditKey', 0);
  const [currentAuditKey, setCurrentAuditKey] = useSyncedState<number>('currentAuditKey', Date.now());
  const [loading, setLoading] = useSyncedState<boolean>('loading', true);
  const [route, setRoute] = useSyncedState<Route>("route", defaultRoute);
  const [breadcrumbs, setBreadcrumbs] = useSyncedState<Breadcrumb[]>("breadcrumbs", [{ route: defaultRoute, label: "Document Audit" }]);

  // Fully recursive hydration
  const hydrateNode = (node: SceneNode) => {
    void node.type;
    void node.name;
    if ("children" in node) {
      for (const child of node.children) {
        hydrateNode(child);
      }
    }
  };

  const hydrateSceneGraph = async () => {
    await figma.loadAllPagesAsync();
    for (const page of figma.root.children) {
      hydrateNode(page);
    }
  };

  const runAuditOnce = async () => {
    if (currentAuditKey === lastAuditKey) {
      console.log("📦 Audit already up to date");
      return;
    }
    
    figma.notify('Auditing 🔎', { timeout: Infinity });
    await new Promise((res) => setTimeout(res, 0)); // allow widget to be painted
    console.log("⏳ Starting scene graph hydration...");
    await hydrateSceneGraph();

    const nodes = figma.root.findAll();
    console.log(`✅ Hydrated ${nodes.length} nodes`);

    const auditStyleStats = await auditFigmaDocument(nodes);
    setStats(auditStyleStats);
    setLastAuditKey(currentAuditKey);
    setLoading(false);
    figma.closePlugin();
  };

  useEffect(() => {
    waitForTask(runAuditOnce().catch(console.error));
  }, [currentAuditKey]);

  return (
    <AutoLayout 
      direction="vertical"
      width={834}
      height={1194}
      fill={style.color.white}
      stroke={style.color.black}
      strokeWidth={8}
      padding={style.padding.small}>
      <Header 
        breadcrumbs={breadcrumbs}
        setRoute={setRoute}
        setBreadcrumbs={setBreadcrumbs} />
      <Router 
        route={route}
        stats={stats}
        setRoute={setRoute}
        setBreadcrumbs={setBreadcrumbs} />
      <Footer 
        lastAuditKey={lastAuditKey}
        loading={loading}
        setLoading={setLoading}
        setCurrentAuditKey={setCurrentAuditKey} />
    </AutoLayout>
  );
};

widget.register(Widget);