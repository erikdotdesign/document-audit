import { buildAuditStyleStats } from "./buildStats";
import { buildStyleIds, collectStyleIdsFromNode, collectBoundVarsFromNode, buildComponentIds } from "./helpers";
import { auditPaintStyles } from "./auditPaintStyles";
import { auditTextStyles } from "./auditTextStyles";
import { auditEffectStyles } from "./auditEffectStyles";
import { auditGridStyles } from "./auditGridStyles";
import { auditComponents, auditUnusedComponents } from "./auditComponents";
import { auditVariables } from "./auditVariables";

export const auditFigmaDocument = async (allNodes: SceneNode[]) => {
  const stats = buildAuditStyleStats();
  const styleIds = buildStyleIds();
  const variableIds = new Set<string>();
  const componentIds = buildComponentIds();

  // Traverse nodes once
  for (const node of allNodes) {
    collectStyleIdsFromNode(node, styleIds);
    collectBoundVarsFromNode(node, variableIds);
    await auditComponents(node, stats.components, componentIds.ids, componentIds.instancedIds);
  }

  // Tally style stats
  await auditPaintStyles(styleIds.paintStyleIds, stats.colorStyles);
  await auditTextStyles(styleIds.textStyleIds, stats.textStyles);
  await auditEffectStyles(styleIds.effectStyleIds, stats.effectStyles);
  await auditGridStyles(styleIds.gridStyleIds, stats.gridStyles);
  // Tally variables
  await auditVariables(variableIds, stats.variables);
  // Tally unused components (a lot faster than getInstancesAsync)
  auditUnusedComponents(stats.components.local, componentIds.ids, componentIds.instancedIds);

  return stats;
};