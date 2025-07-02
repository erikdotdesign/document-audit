import { LocalComponentStats, OriginComponentStats } from "./buildStats";
import { getComponentBucket } from "./helpers";

export const auditMainComponent = (
  node: ComponentNode,
  stats: OriginComponentStats,
  componentIds: Set<string>
) => {
  if (!componentIds.has(node.id)) {
    componentIds.add(node.id);
    const bucket = getComponentBucket(node, stats);
    const missingDescription = !node.description;
    bucket.count++;
    if (node.parent?.type === "COMPONENT_SET") {
      bucket.variants++;
      if (missingDescription) bucket.missingDescription.variants++;
    } else {
      if (missingDescription) bucket.missingDescription.components++;
    }
  }
}

export const auditComponents = async (
  node: SceneNode,
  stats: OriginComponentStats,
  componentIds: Set<string>,
  instancedComponentIds: Set<string>
) => {
  switch(node.type) {
    case "COMPONENT": {
      auditMainComponent(node, stats, componentIds);
      break;
    }
    case "COMPONENT_SET": {
      const bucket = getComponentBucket(node, stats);
      bucket.sets++;
      if (!node.description) bucket.missingDescription.sets++;
      break;
    }
    case "INSTANCE": {
      const mainComponent = await node.getMainComponentAsync();
      if (mainComponent) {
        instancedComponentIds.add(mainComponent.id);
        auditMainComponent(mainComponent, stats, componentIds);
        const bucket = getComponentBucket(mainComponent, stats);
        bucket.instances++;
        if (node.overrides?.length) bucket.overriddenInstances++;
      }
      break;
    }
  }
}

export const auditUnusedComponents = (
  stats: LocalComponentStats,
  componentIds: Set<string>,
  instancedComponentIds: Set<string>
) => {
  const unusedComponentIds = new Set<string>(
    [...componentIds].filter(id => !instancedComponentIds.has(id))
  );
  stats.unused = unusedComponentIds.size;
}