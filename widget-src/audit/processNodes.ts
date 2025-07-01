import { buildAuditStyleStats } from "./buildStats";
import { buildStyleIds, collectStyleIdsFromNode } from "./helpers";
import { auditPaintStyles } from "./auditPaintStyles";
import { auditTextStyles } from "./auditTextStyles";
import { auditEffectStyles } from "./auditEffectStyles";
import { auditGridStyles } from "./auditGridStyles";

export const auditFigmaDocument = async (allNodes: SceneNode[]) => {
  const stats = buildAuditStyleStats();
  const styleIds = buildStyleIds();

  // Traverse nodes once
  for (const node of allNodes) {
    collectStyleIdsFromNode(node, styleIds);
  }

  // Fetch styles after traversal
  const [paintStyles, textStyles, effectStyles, gridStyles] = await Promise.all([
    Promise.all([...styleIds.paintStyleIds].map(id => figma.getStyleByIdAsync(id))) as Promise<PaintStyle[]>,
    Promise.all([...styleIds.textStyleIds].map(id => figma.getStyleByIdAsync(id))) as Promise<TextStyle[]>,
    Promise.all([...styleIds.effectStyleIds].map(id => figma.getStyleByIdAsync(id))) as Promise<EffectStyle[]>,
    Promise.all([...styleIds.gridStyleIds].map(id => figma.getStyleByIdAsync(id))) as Promise<GridStyle[]>
  ]);

  // Tally style stats
  auditPaintStyles(paintStyles, stats.colorStyles);
  auditTextStyles(textStyles, stats.textStyles);
  auditEffectStyles(effectStyles, stats.effectStyles);
  auditGridStyles(gridStyles, stats.gridStyles);

  return stats;
};