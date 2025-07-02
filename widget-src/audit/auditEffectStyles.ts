import { OriginStyleStats, EffectStyleProps } from "./buildStats";
import { getStyleBucket } from "./helpers";

export const auditEffectStyles = async (
  effectStyleIds: Set<string>,
  stats: OriginStyleStats<EffectStyleProps>
) => {
  const effectTokenIds: Record<keyof EffectStyleProps, Set<string>> = {
    radius: new Set(),
    color: new Set(),
    spread: new Set(),
    offsetX: new Set(),
    offsetY: new Set()
  };

  const localEffectStyles = await figma.getLocalEffectStylesAsync();

  const effectStyles = await Promise.all(
    [...effectStyleIds].map(id => figma.getStyleByIdAsync(id))
  ) as EffectStyle[];

  const unusedEffectStyles = localEffectStyles.filter(s => !effectStyleIds.has(s.id));

  stats.local.unused = unusedEffectStyles.length;

  for (const style of effectStyles) {
    const bucket = getStyleBucket(style, stats);
    bucket.count++;
    if (!style.description) bucket.missingDescription++;

    for (const effect of style.effects) {
      if (effect.type === "NOISE" || effect.type === "TEXTURE") return;
      const boundVariables = effect.boundVariables || {};

      const props: (keyof EffectStyleProps)[] =
        effect.type === "DROP_SHADOW" || effect.type === "INNER_SHADOW"
          ? ["radius", "color", "spread", "offsetX", "offsetY"]
          : effect.type === "LAYER_BLUR" || effect.type === "BACKGROUND_BLUR"
          ? ["radius"]
          : [];

      for (const key of props) {
        const token = boundVariables[key];
        if (token?.id) {
          if (!effectTokenIds[key].has(token.id)) {
            effectTokenIds[key].add(token.id);
            bucket.uniquePropertyTokens[key]++;
          }
        } else {
          bucket.unboundProperties[key]++;
        }
      }
    }
  }
};