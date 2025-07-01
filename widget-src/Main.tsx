import { AuditStyleStats, buildAuditStyleStats } from './audit/buildStats';
import { auditFigmaDocument } from './audit/processNodes';
import { Route, Breadcrumb } from './routes';
import Header from './components/Header';
import Router from './components/Router';
import Footer from './components/Footer';
import style from './style';

const { widget } = figma;
const { useSyncedState, AutoLayout, waitForTask, useEffect } = widget;

export const Widget = () => {
  const defaultRoute: Route = { type: "home" };
  const [stats, setStats] = useSyncedState<AuditStyleStats>('stats', buildAuditStyleStats());
  const [lastAuditKey, setLastAuditKey] = useSyncedState<number>('lastAuditKey', 0);
  const [currentAuditKey, setCurrentAuditKey] = useSyncedState<number>('currentAuditKey', Date.now());
  const [loading, setLoading] = useSyncedState<boolean>('loading', true);
  const [route, setRoute] = useSyncedState<Route>("route", defaultRoute);
  const [breadcrumbs, setBreadcrumbs] = useSyncedState<Breadcrumb[]>("breadcrumbs", [{ route: defaultRoute, label: "Document Audit" }]);

  // 🔁 Fully recursive hydration
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
      console.log(stats);
      return;
    }
    
    figma.notify('Auditing 🔎', { timeout: Infinity });
    await new Promise((res) => setTimeout(res, 0)); // defer until Figma's graph is ready
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
  }, [currentAuditKey]); // 🔁 Rerun only if the trigger changes

  return (
    <AutoLayout 
      direction="vertical"
      width={834}
      height={1194}
      fill={style.color.white}
      stroke={style.color.black}
      strokeWidth={8}
      padding={style.spacing.small}>
      <Header 
        breadcrumbs={breadcrumbs}
        setRoute={setRoute}
        setBreadcrumbs={setBreadcrumbs} />
      <AutoLayout
        direction="vertical"
        height={"fill-parent"}
        width={"fill-parent"}>
        <Router 
          route={route}
          setRoute={setRoute}
          setBreadcrumbs={setBreadcrumbs} />
      </AutoLayout>
      <Footer 
        lastAuditKey={lastAuditKey}
        loading={loading}
        setLoading={setLoading}
        setCurrentAuditKey={setCurrentAuditKey} />
    </AutoLayout>
  );
};

widget.register(Widget);