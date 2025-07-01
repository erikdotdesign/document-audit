import { OriginStyleStats, TextStyleProps } from "./buildStats";
import { getStyleBucket } from "./helpers";

export const auditTextStyles = (
  textStyles: TextStyle[],
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
        bucket.unboundProperties[key]++;
      }
    }
  }
};