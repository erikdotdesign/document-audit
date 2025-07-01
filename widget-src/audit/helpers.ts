import { BaseStyleStats, OriginStyleStats } from "./buildStats";

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
    if (styleProp in node && node[styleProp]) {
      styleIds[idType].add(node[styleProp]);
    }
  }
};

export const getStyleBucket = <T>(
  style: BaseStyle,
  stats: OriginStyleStats<T>
): BaseStyleStats<T> => {
  return style.remote ? stats.remote : stats.local;
};