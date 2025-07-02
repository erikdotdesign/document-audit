import { OriginStyleStats, TextStyleProps } from "./buildStats";
import { getStyleBucket } from "./helpers";

export const auditTextStyles = async (
  textStyleIds: Set<string>,
  stats: OriginStyleStats<TextStyleProps>
) => {
  const textTokenIds: Record<keyof TextStyleProps, Set<string>> = {
    fontFamily: new Set(),
    fontSize: new Set(),
    fontStyle: new Set(),
    letterSpacing: new Set(),
    lineHeight: new Set(),
    paragraphSpacing: new Set(),
    paragraphIndent: new Set()
  };

  const localTextStyles = await figma.getLocalTextStylesAsync();

  const textStyles = await Promise.all(
    [...textStyleIds].map(id => figma.getStyleByIdAsync(id))
  ) as TextStyle[];

  const unusedTextStyles = localTextStyles.filter(s => !textStyleIds.has(s.id));

  stats.local.unused = unusedTextStyles.length;

  for (const style of textStyles) {
    const bucket = getStyleBucket(style, stats);
    bucket.count++;
    if (!style.description) bucket.missingDescription++;

    const boundVariables = style.boundVariables || {};

    for (const key of Object.keys(textTokenIds) as (keyof TextStyleProps)[]) {
      const token = boundVariables[key];
      if (token?.id) {
        if (!textTokenIds[key].has(token.id)) {
          textTokenIds[key].add(token.id);
          bucket.uniquePropertyTokens[key]++;
        }
      } else {
        // Only count as unbound if the property exists on the style with a meaningful value
        const value = style[key];
        const isMeaningful = value !== undefined && value !== 0;

        if (isMeaningful) {
          bucket.unboundProperties[key]++;
        }
      }
    }
  }
};