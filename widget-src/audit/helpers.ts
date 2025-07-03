import { 
  LocalStyleStats, 
  OriginComponentStats, 
  OriginStyleStats, 
  RemoteStyleStats, 
  LocalComponentStats, 
  RemoteComponentStats, 
  OriginVariableStats, 
  LocalVariableStats, 
  RemoteVariableStats
} from "./buildStats";

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

export type FrameStrokeWeightProps = "strokeTopWeight" | "strokeBottomWeight" | "strokeLeftWeight" | "strokeRightWeight";
export type FrameCornerRadiusProps = "topLeftRadius" | "topRightRadius" | "bottomLeftRadius" | "bottomRightRadius";
export type FramePaddingProps = "paddingTop" | "paddingBottom" | "paddingLeft" | "paddingRight";
export type FrameSpacingProps = "itemSpacing" | "counterAxisSpacing";
export type FrameMinMaxProps = "minWidth" | "minHeight" | "maxWidth" | "maxHeight";
export type FrameStatProp = "strokeWeight" | "cornerRadius" | "padding" | "spacing" | FrameMinMaxProps;

export type FramePropMap = {
  key: FrameStrokeWeightProps | FrameCornerRadiusProps | FramePaddingProps | FrameSpacingProps | FrameMinMaxProps;
  tokens: Set<string>;
  stat: FrameStatProp;
};

export const buildFramePropsMap = (): FramePropMap[] => {
  const strokeWeightProps = ["strokeTopWeight", "strokeBottomWeight", "strokeLeftWeight", "strokeRightWeight"] as FrameStrokeWeightProps[];
  const cornerRadiusProps = ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"] as FrameCornerRadiusProps[];
  const paddingProps = ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"] as FramePaddingProps[];
  const spacingProps = ["itemSpacing", "counterAxisSpacing"] as FrameSpacingProps[];
  const minMaxProps = ["minWidth", "minHeight", "maxWidth", "maxHeight"] as FrameMinMaxProps[];

  const strokeWeightTokenIds = new Set<string>();
  const strokeWeightPropsMap = strokeWeightProps.map((prop) => ({
    key: prop,
    tokens: strokeWeightTokenIds,
    stat: "strokeWeight"
  })) as FramePropMap[];

  const cornerRadiusTokenIds = new Set<string>();
  const cornerRadiusPropsMap = cornerRadiusProps.map((prop) => ({
    key: prop,
    tokens: cornerRadiusTokenIds,
    stat: "cornerRadius"
  })) as FramePropMap[];

  const paddingTokenIds = new Set<string>();
  const paddingPropsMap = paddingProps.map((prop) => ({
    key: prop,
    tokens: paddingTokenIds,
    stat: "padding"
  })) as FramePropMap[];

  const spacingTokenIds = new Set<string>();
  const spacingPropsMap = spacingProps.map((prop) => ({
    key: prop,
    tokens: spacingTokenIds,
    stat: "spacing"
  })) as FramePropMap[];

  const minMaxPropsMap = minMaxProps.map((prop) => ({
    key: prop,
    tokens: new Set<string>(),
    stat: prop
  })) as FramePropMap[];

  return [
    ...strokeWeightPropsMap,
    ...cornerRadiusPropsMap,
    ...paddingPropsMap, 
    ...spacingPropsMap, 
    ...minMaxPropsMap
  ];
}

export const getStyleBucket = <T, Extras>(
  style: BaseStyle,
  stats: OriginStyleStats<T, Extras>
): LocalStyleStats<T, Extras> | RemoteStyleStats<T, Extras> => {
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

export const getLayerDepth = (node: SceneNode | PageNode): number => {
  let depth = 0;
  if (node.type !== "PAGE") {
    let parent = node.parent;
    while (parent && parent.type !== "PAGE") {
      depth++;
      parent = parent.parent;
    }
  }
  return depth;
};

export type LayerMetaData = {
  totalLayerDepth: number;
  duplicateLayerNames: Map<string, number>;
};

export const buildLayerMetaData = () => ({
  totalLayerDepth: 0,
  duplicateLayerNames: new Map<string, number>()
});

export const screamingSnakeToCamel = (input: string): string => {
  return input
    .toLowerCase()
    .split('_')
    .map((word, index) =>
      index === 0 ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join('');
};