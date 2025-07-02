import { OriginStyleStats, GridStyleProps } from "./buildStats";
import { getStyleBucket } from "./helpers";

export const auditGridStyles = async (
  gridStyleIds: Set<string>,
  stats: OriginStyleStats<GridStyleProps>
) => {
  const gridTokenIds: Record<keyof GridStyleProps, Set<string>> = {
    sectionSize: new Set(),
    count: new Set(),
    offset: new Set(),
    gutterSize: new Set()
  };

  const localGridStyles = await figma.getLocalGridStylesAsync();

  const gridStyles = await Promise.all(
    [...gridStyleIds].map(id => figma.getStyleByIdAsync(id))
  ) as GridStyle[];

  const unusedGridStyles = localGridStyles.filter(s => !gridStyleIds.has(s.id));

  stats.local.unused = unusedGridStyles.length;

  for (const style of [...gridStyles, ...unusedGridStyles]) {
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