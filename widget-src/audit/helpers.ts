import { LocalStyleStats, OriginComponentStats, OriginStyleStats, RemoteStyleStats, LocalComponentStats, RemoteComponentStats, OriginVariableStats, LocalVariableStats, RemoteVariableStats } from "./buildStats";

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

export const buildComponentIds = () => ({
  ids: new Set<string>(),
  instancedIds: new Set<string>()
});

export const collectBoundVarsFromNode = (
  node: SceneNode,
  variableIds: Set<string>
) => {
  if (node.boundVariables) {
    for (const key in node.boundVariables) {
      const variableValue = node.boundVariables[key as keyof typeof node.boundVariables];
      if (variableValue) {
        if (Array.isArray(variableValue)) {
          for (const arrayItem of variableValue) {
            variableIds.add(arrayItem.id);
          }
        } else if ("type" in variableValue && variableValue.type === "VARIABLE_ALIAS") {
          variableIds.add((variableValue as VariableAlias).id);
        } else {
          for (const key in variableValue) {
            const nestedValue = (variableValue as {
                readonly [propertyName: string]: VariableAlias;
            })[key];
            variableIds.add(nestedValue.id);
          }
        }
      }
    }
  }
}

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

export const getVariableBucket = (
  variable: Variable | VariableCollection,
  stats: OriginVariableStats
): LocalVariableStats | RemoteVariableStats => {
  return variable.remote ? stats.remote : stats.local;
};