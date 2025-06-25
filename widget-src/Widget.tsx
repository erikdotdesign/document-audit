import { auditFigmaDocument, AuditStats, auditStats } from './code';
import style from './style';
import DisplayStat from './DisplayStat';
import Header from './Header';
import Footer from './Footer';
import StatDetails from './StatDetails';

const { widget } = figma;
const {
  useSyncedState,
  AutoLayout,
  useEffect,
  waitForTask,
} = widget;

const Widget = () => {
  const [stats, setStats] = useSyncedState<AuditStats>('stats', auditStats);
  const [lastAuditKey, setLastAuditKey] = useSyncedState<number>('lastAuditKey', 0);
  const [currentAuditKey, setCurrentAuditKey] = useSyncedState<number>('currentAuditKey', Date.now());
  const [loading, setLoading] = useSyncedState<boolean>('loading', true);
  const [route, setRoute] = useSyncedState<string>('route', '');

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

    await new Promise((res) => setTimeout(res, 0)); // defer until Figma's graph is ready
    console.log("⏳ Starting scene graph hydration...");
    await hydrateSceneGraph();

    const nodes = figma.root.findAll();
    console.log(`✅ Hydrated ${nodes.length} nodes`);

    const auditStats = await auditFigmaDocument(nodes);
    setStats(auditStats);
    setLastAuditKey(currentAuditKey);
    setLoading(false);
  };

  useEffect(() => {
    waitForTask(runAuditOnce().catch(console.error));
  }, [currentAuditKey]); // 🔁 Rerun only if the trigger changes

  const displayStats = [{
    highlight: stats?.layers.totalLayers,
    label: 'total layers',
    route: 'layers'
  },{
    highlight: stats?.colors.uniqueFillColors,
    label: 'colors',
    route: 'colors'
  },{
    highlight: stats?.layers.components,
    label: 'components',
    route: 'components'
  },{
    highlight: stats?.layers.textLayers,
    label: 'text layers',
    route: 'text'
  },{
    highlight: stats?.layout.autoLayoutFrames,
    label: 'auto layout frames',
    route: 'layout'
  },{
    highlight: stats?.performance.approxDocumentSize,
    label: 'document size',
    route: 'performance'
  },{
    highlight: stats?.naming.unnamedLayers,
    label: 'unnamed layers',
    route: 'naming'
  }];

  return (
    <AutoLayout
      direction="vertical"
      width={834}
      height={1194}
      fill={style.color.white}>
      <Header 
        route={route}
        setRoute={setRoute} />
      {
        route === ''
        ? <>
            <AutoLayout
              direction="vertical"
              height={"fill-parent"}
              width={'fill-parent'}>
              {
                displayStats.map((stat) => (
                  <DisplayStat
                    key={stat.label}
                    highlight={stat.highlight}
                    label={stat.label}
                    route={stat.route}
                    setRoute={setRoute} />
                ))
              }
            </AutoLayout>
            <Footer 
              lastAuditKey={lastAuditKey}
              loading={loading}
              setLoading={setLoading}
              setCurrentAuditKey={setCurrentAuditKey} />
          </>
        : <StatDetails 
            stats={stats}
            route={route} />
      }
    </AutoLayout>
  );
};

widget.register(Widget);