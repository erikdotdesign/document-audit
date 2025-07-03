import { OriginLayerStats } from "./buildStats";
import { getLayerDepth, LayerMetaData } from "./helpers";

export const finishLayersAudit = (
  stats: OriginLayerStats,
  totalNodes: number,
  layerProps: LayerMetaData
) => {
  const bucket = stats.local;
  bucket.duplicateNames = Array.from(layerProps.duplicateLayerNames.values()).filter(v => v > 1).length;
  bucket.averageNestingDepth = totalNodes > 0
  ? Math.round(layerProps.totalLayerDepth / totalNodes)
  : 0;
}

export const auditLayers = async (
  node: SceneNode | PageNode,
  stats: OriginLayerStats,
  layerProps: LayerMetaData
) => {
  const bucket = stats.local;
  if ("visible" in node && !node.visible) bucket.hiddenLayers++;
  if (!node.name) bucket.unnamedLayers++;
  if ("locked" in node && node.locked) bucket.lockedLayers++;

  const layerDepth = getLayerDepth(node);
  bucket.maxNestingDepth = Math.max(bucket.maxNestingDepth, layerDepth);
  layerProps.totalLayerDepth += layerDepth;
  layerProps.duplicateLayerNames.set(node.name, (layerProps.duplicateLayerNames.get(node.name) || 0) + 1);

  switch(node.type) {
    case "PAGE":
      bucket.count.page++;
      break;
    case "FRAME":
      bucket.count.frame++;
      break;
    case "COMPONENT_SET":
      bucket.count.componentSet++;
      break;
    case "COMPONENT":
      bucket.count.component++;
      break;
    case "INSTANCE":
      bucket.count.componentInstance++;
      break;
    case "TEXT":
      bucket.count.text++;
      break;
    case "VECTOR":
      bucket.count.vector++;
      break;
    case "BOOLEAN_OPERATION":
      bucket.count.booleanShape++;
      break;
    case "SECTION":
      bucket.count.section++;
      break;
    case "GROUP":
    case "TRANSFORM_GROUP":
      bucket.count.group++;
      break;
    case "ELLIPSE":
    case "LINE":
    case "POLYGON":
    case "RECTANGLE":
    case "SHAPE_WITH_TEXT":
    case "STAR":
      bucket.count.shape++;
      break;
    case "SLICE":
      bucket.count.slice++;
      break;
    default:
      break;
  }
}