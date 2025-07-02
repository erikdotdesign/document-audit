import { LocalStyleStats, OriginComponentStats, OriginStyleStats, RemoteStyleStats, LocalComponentStats, RemoteComponentStats } from "./buildStats";

type NodeStyleId = "fillStyleId" | "strokeStyleId" | "textStyleId" | "effectStyleId" | "gridStyleId";

export const buildStyleIds = () => ({
  paintStyleIds: new Set<string>(),
  textStyleIds: new Set<string>(),
  effectStyleIds: new Set<string>(),
  gridStyleIds: new Set<string>(),
});

export const collectStyleIdsFromNode = (
  node: SceneNode,
  styleIds: ReturnType<typeof buildStyleIds>
) => {
  const entries: [keyof typeof styleIds, NodeStyleId][] = [
    ["paintStyleIds", "fillStyleId"],
    ["paintStyleIds", "strokeStyleId"],
    ["textStyleIds", "textStyleId"],
    ["effectStyleIds", "effectStyleId"],
    ["gridStyleIds", "gridStyleId"]
  ];

  for (const [idType, styleProp] of entries) {
    if (styleProp in node && node[styleProp] && node[styleProp] !== figma.mixed) {
      styleIds[idType].add(node[styleProp]);
    }
  }
};

export const getStyleBucket = <T>(
  style: BaseStyle,
  stats: OriginStyleStats<T>
): LocalStyleStats<T> | RemoteStyleStats<T> => {
  return style.remote ? stats.remote : stats.local;
};

export const getComponentBucket = (
  componentNode: ComponentNode | ComponentSetNode,
  stats: OriginComponentStats
): LocalComponentStats | RemoteComponentStats => {
  return componentNode.remote ? stats.remote : stats.local;
};