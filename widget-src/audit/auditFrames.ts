import { OriginFrameStats } from "./buildStats";
import { FramePropMap } from "./helpers";

export const auditFrames = async (
  node: SceneNode,
  stats: OriginFrameStats,
  propsMap: FramePropMap[]
) => {
  if (node.type === "FRAME" || node.type === "COMPONENT" || node.type === "INSTANCE") {
    const bucket = stats.local;
    bucket.count++;

    if (node.layoutMode === "NONE") bucket.freeFormLayouts++;
    else bucket.autoLayouts[node.layoutMode.toLowerCase() as "horizontal" | "vertical"]++;

    if (node.layoutSizingHorizontal === "FIXED") bucket.fixedDimensions.width++;
    if (node.layoutSizingVertical === "FIXED") bucket.fixedDimensions.height++;

    for (const propMap of propsMap) {
      const variable = node.boundVariables?.[propMap.key as keyof typeof node.boundVariables];
      if (variable) {
        if (!propMap.tokens.has(variable.id)) {
          propMap.tokens.add(variable.id);
          bucket.uniquePropertyTokens[propMap.stat]++;
        }
      } else {
        // make sure not 0
        if (node[propMap.key]) bucket.unboundProperties[propMap.stat]++;
      }
    }
  }
}