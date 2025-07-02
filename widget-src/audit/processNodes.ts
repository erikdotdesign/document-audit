import { buildAuditStyleStats } from "./buildStats";
import { buildStyleIds, collectStyleIdsFromNode, buildComponentStore, collectComponents } from "./helpers";
import { auditPaintStyles } from "./auditPaintStyles";
import { auditTextStyles } from "./auditTextStyles";
import { auditEffectStyles } from "./auditEffectStyles";
import { auditGridStyles } from "./auditGridStyles";
import { auditComponents, auditUnusedComponents } from "./auditComponents";

export const auditFigmaDocument = async (allNodes: SceneNode[]) => {
  const stats = buildAuditStyleStats();
  const styleIds = buildStyleIds();
  const componentIds = new Set<string>();
  const instancedComponentIds = new Set<string>();
  const componentNodes = [] as ComponentNode[];

  // Traverse nodes once
  for (const node of allNodes) {
    collectStyleIdsFromNode(node, styleIds);
    await auditComponents(node, stats.components, componentIds, instancedComponentIds, componentNodes);
  }

  // Tally style stats
  await auditPaintStyles(styleIds.paintStyleIds, stats.colorStyles);
  await auditTextStyles(styleIds.textStyleIds, stats.textStyles);
  await auditEffectStyles(styleIds.effectStyleIds, stats.effectStyles);
  await auditGridStyles(styleIds.gridStyleIds, stats.gridStyles);
  // Tally unused components (a lot faster than getInstancesAsync)
  auditUnusedComponents(stats.components, componentIds, instancedComponentIds, componentNodes);

  return stats;
};