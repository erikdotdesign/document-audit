import { OriginStyleStats, ColorStyleProps, ColorStyleExtras } from "./buildStats";
import { getStyleBucket, screamingSnakeToCamel } from "./helpers";

export const auditPaintStyles = async (
  paintStylesIds: Set<string>,
  stats: OriginStyleStats<ColorStyleProps, ColorStyleExtras>
) => {
  const colorTokenIds = new Set<string>();
  const colorStopTokenIds = new Set<string>();

  const localPaintStyles = await figma.getLocalPaintStylesAsync();

  const paintStyles = await Promise.all(
    [...paintStylesIds].map(id => {
      if (typeof id !== "string") {
        console.warn("Invalid ID passed to getStyleByIdAsync:", id);
      }
      return figma.getStyleByIdAsync(id);
    })
  ) as PaintStyle[];

  const unusedPaintStyles = localPaintStyles.filter(s => !paintStylesIds.has(s.id));

  stats.local.unused = unusedPaintStyles.length;

  for (const style of [...paintStyles, ...unusedPaintStyles]) {
    const bucket = getStyleBucket(style, stats);
    bucket.count++;

    if (!style.description) bucket.missingDescriptions++;

    for (const paint of style.paints) {
      bucket.paints[screamingSnakeToCamel(paint.type)]++;
      
      if (paint.type === "SOLID") {
        const bound = paint.boundVariables?.color;
        if (bound) {
          if (!colorTokenIds.has(bound.id)) {
            colorTokenIds.add(bound.id);
            bucket.uniquePropertyTokens.color++;
          }
        } else {
          bucket.unboundProperties.color++;
        }

      } else if (paint.type.startsWith("GRADIENT")) {
        for (const stop of (paint as GradientPaint).gradientStops) {
          const bound = stop.boundVariables?.color;
          if (bound) {
            if (!colorStopTokenIds.has(bound.id)) {
              colorStopTokenIds.add(bound.id);
              bucket.uniquePropertyTokens.colorStop++;
            }
          } else {
            bucket.unboundProperties.colorStop++;
          }
        }
      }
    }
  }
};