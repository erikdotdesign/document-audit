import { OriginStyleStats, GridStyleProps } from "./buildStats";
import { getStyleBucket } from "./helpers";

export const auditGridStyles = (
  gridStyles: GridStyle[],
  stats: OriginStyleStats<GridStyleProps>
) => {
  const gridTokenIds: Record<keyof GridStyleProps, Set<string>> = {
    sectionSize: new Set(),
    count: new Set(),
    offset: new Set(),
    gutterSize: new Set()
  };

  for (const style of gridStyles) {
    const bucket = getStyleBucket(style, stats);
    bucket.count++;
    if (!style.description) bucket.missingDescription++;

    for (const grid of style.layoutGrids) {
      const boundVariables = grid.boundVariables || {};
      for (const key of Object.keys(gridTokenIds) as (keyof GridStyleProps)[]) {
        if (key in grid) {
          const token = boundVariables[key];
          if (token?.id) {
            if (!gridTokenIds[key].has(token.id)) {
              gridTokenIds[key].add(token.id);
              bucket.uniquePropertyTokens[key]++;
            }
          } else {
            bucket.unboundProperties[key]++;
          }
        }
      }
    }
  }
};