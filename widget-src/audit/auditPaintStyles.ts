import { OriginStyleStats, ColorStyleProps } from "./buildStats";
import { getStyleBucket } from "./helpers";

export const auditPaintStyles = (
  paintStyles: PaintStyle[],
  stats: OriginStyleStats<ColorStyleProps>
) => {
  const colorTokenIds = new Set<string>();
  const colorStopTokenIds = new Set<string>();

  for (const style of paintStyles) {
    const bucket = getStyleBucket(style, stats);
    bucket.count++;

    if (!style.description) bucket.missingDescription++;

    for (const paint of style.paints) {
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