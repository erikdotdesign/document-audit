export type LayerStats = {
  totalLayers: number;
  frames: number;
  components: number;
  componentInstances: number;
  textLayers: number;
  imageFills: { embedded: number; linked: number };
  vectorPaths: number;
  hiddenLayers: number;
  lockedLayers: number;
  flattenedLayers: number;
  unflattenedLayers: number;
};

export type ColorStats = {
  uniqueFillColors: Set<string>;
  uniqueStrokeColors: Set<string>;
  uniqueTextStyles: Set<string>;
  localTextStyles: Set<string>;
  remoteTextStyles: Set<string>;
  colorTokenUsage: number;
  unusedStyles: string[];
};

export type ComponentStats = {
  localComponents: number;
  externalComponents: number;
  variantSets: number;
  missingInstances: number;
  overriddenInstances: number;
};

export type TextStats = {
  uniqueFonts: Set<string>;
  uniqueFontSizes: Set<number>;
  textWithoutStyle: number;
  textAlignments: Record<string, number>;
};

export type LayoutStats = {
  autoLayoutFrames: number;
  layoutGrids: number;
  spacingTokensUsed: number;
  irregularSpacing: number;
};

export type PerformanceStats = {
  largestImageSizeKB: number;
  approxDocumentSizeKB: number;
  maxNestingDepth: number;
  pageCount: number;
  isHeavy: boolean;
};

export type NamingStats = {
  unnamedLayers: number;
  framelessLayers: number;
  topLevelUngrouped: number;
  duplicateLayerNames: Record<string, number>;
};

export type AuditStats = {
  layers: LayerStats;
  colors: ColorStats;
  components: ComponentStats;
  text: TextStats;
  layout: LayoutStats;
  performance: PerformanceStats;
  naming: NamingStats;
};

const solidPaintToHex = (paint: SolidPaint): string => {
  const r = Math.round(paint.color.r * 255);
  const g = Math.round(paint.color.g * 255);
  const b = Math.round(paint.color.b * 255);
  const alpha = paint.opacity !== undefined ? paint.opacity : 1;
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, "0")).join("")}${
    alpha < 1 ? Math.round(alpha * 255).toString(16).padStart(2, "0") : ""
  }`;
};

export const auditStats: AuditStats = {
  layers: {
    totalLayers: 0,
    frames: 0,
    components: 0,
    componentInstances: 0,
    textLayers: 0,
    imageFills: { embedded: 0, linked: 0 },
    vectorPaths: 0,
    hiddenLayers: 0,
    lockedLayers: 0,
    flattenedLayers: 0,
    unflattenedLayers: 0,
  },
  colors: {
    uniqueFillColors: new Set(),
    uniqueStrokeColors: new Set(),
    uniqueTextStyles: new Set(),
    localTextStyles: new Set(),
    remoteTextStyles: new Set(),
    colorTokenUsage: 0,
    unusedStyles: [],
  },
  components: {
    localComponents: 0,
    externalComponents: 0,
    variantSets: 0,
    missingInstances: 0,
    overriddenInstances: 0,
  },
  text: {
    uniqueFonts: new Set(),
    uniqueFontSizes: new Set(),
    textWithoutStyle: 0,
    textAlignments: {},
  },
  layout: {
    autoLayoutFrames: 0,
    layoutGrids: 0,
    spacingTokensUsed: 0,
    irregularSpacing: 0,
  },
  performance: {
    largestImageSizeKB: 0,
    approxDocumentSizeKB: 0,
    maxNestingDepth: 0,
    pageCount: 0,
    isHeavy: false,
  },
  naming: {
    unnamedLayers: 0,
    framelessLayers: 0,
    topLevelUngrouped: 0,
    duplicateLayerNames: {},
  },
};

export const auditFigmaDocument = async (allNodes: SceneNode[]): Promise<AuditStats> => {
  const pages = figma.root.children;
  const imageHashes = new Set<string>();
  const textStyleIds = new Set<string>();
  const instanceNodes: InstanceNode[] = [];

  const stats: AuditStats = {
    ...auditStats,
  };

  stats.performance.pageCount = pages.length;
  stats.performance.isHeavy = allNodes.length > 10000;

  const getDepth = (node: SceneNode): number => {
    let depth = 0;
    let parent = node.parent;
    while (parent && parent.type !== "PAGE") {
      depth++;
      parent = parent.parent;
    }
    return depth;
  };

  for (const node of allNodes) {
    try {
      stats.layers.totalLayers++;
      if (!node.visible) stats.layers.hiddenLayers++;
      if (node.locked) stats.layers.lockedLayers++;
      if (!node.name) stats.naming.unnamedLayers++;
      const depth = getDepth(node);
      stats.performance.maxNestingDepth = Math.max(stats.performance.maxNestingDepth, depth);
      stats.naming.duplicateLayerNames[node.name] = (stats.naming.duplicateLayerNames[node.name] || 0) + 1;
      if (!node.parent || node.parent.type === "PAGE") stats.naming.topLevelUngrouped++;

      if ("fills" in node && Array.isArray(node.fills)) {
        for (const fill of node.fills) {
          if (fill.type === "SOLID") {
            stats.colors.uniqueFillColors.add(solidPaintToHex(fill));
            if (fill.boundVariables?.color) stats.colors.colorTokenUsage++;
          } else if (fill.type === "IMAGE" && fill.imageHash) {
            imageHashes.add(fill.imageHash);
            stats.layers.imageFills[fill.scaleMode === "FILL" ? "embedded" : "linked"]++;
          }
        }
      }

      if ("strokes" in node && Array.isArray(node.strokes)) {
        for (const stroke of node.strokes) {
          if (stroke.type === "SOLID") {
            stats.colors.uniqueStrokeColors.add(solidPaintToHex(stroke));
            if (stroke.boundVariables?.color) stats.colors.colorTokenUsage++;
          }
        }
      }

      if ("layoutAlign" in node && node.layoutAlign !== "INHERIT") {
        if (node.x % 2 !== 0) stats.layout.irregularSpacing++;
      }

      if ("boundVariables" in node) {
        for (const key in node.boundVariables) {
          if (key.toLowerCase().includes("spacing") || key.toLowerCase().includes("padding")) {
            stats.layout.spacingTokensUsed++;
          }
        }
      }

      switch (node.type) {
        case "FRAME":
          stats.layers.frames++;
          if (node.layoutMode !== "NONE") stats.layout.autoLayoutFrames++;
          if (node.layoutGrids.length > 0) stats.layout.layoutGrids++;
          break;
        case "COMPONENT":
          stats.layers.components++;
          stats.components.localComponents++;
          if (node.parent?.type === "COMPONENT_SET") stats.components.variantSets++;
          break;
        case "INSTANCE":
          stats.layers.componentInstances++;
          instanceNodes.push(node);
          break;
        case "TEXT":
          stats.layers.textLayers++;
          stats.text.uniqueFontSizes.add(node.fontSize as number);
          if (typeof node.fontName === "object" && "family" in node.fontName) {
            stats.text.uniqueFonts.add(`${node.fontName.family} ${node.fontName.style}`);
          }
          if (!node.textStyleId) stats.text.textWithoutStyle++;
          else {
            const id = node.textStyleId.toString();
            stats.colors.uniqueTextStyles.add(id);
            textStyleIds.add(id);
          }
          stats.text.textAlignments[node.textAlignHorizontal] = (stats.text.textAlignments[node.textAlignHorizontal] || 0) + 1;
          break;
        case "VECTOR":
          stats.layers.vectorPaths++;
          break;
        case "BOOLEAN_OPERATION":
          stats.layers.flattenedLayers++;
          break;
        default:
          stats.layers.unflattenedLayers++;
          break;
      }
    } catch (err) {
      console.warn("Node audit failed:", node.name, err);
    }
  }

  // Batch image sizes
  let totalBytes = 0;
  let maxBytes = 0;
  await Promise.allSettled([...imageHashes].map(async (hash) => {
    try {
      const image = figma.getImageByHash(hash);
      if (image) {
        const bytes = await image.getBytesAsync();
        const len = bytes.length;
        totalBytes += len;
        if (len > maxBytes) maxBytes = len;
      }
    } catch {}
  }));
  stats.performance.largestImageSizeKB = Math.round(maxBytes / 1024);
  stats.performance.approxDocumentSizeKB = Math.round(totalBytes / 1024);

  // Instance linkage stats
  for (const node of instanceNodes) {
    try {
      const mainComponent = await node.getMainComponentAsync();
      if (!mainComponent) stats.components.missingInstances++;
      if (node.overrides?.length) stats.components.overriddenInstances++;
      if (!mainComponent?.parent || mainComponent.parent.type === "DOCUMENT") stats.components.localComponents++;
      else stats.components.externalComponents++;
    } catch {}
  }

  // Text style resolution
  for (const styleId of textStyleIds) {
    try {
      const style = await figma.getStyleByIdAsync(styleId);
      if (style?.remote) stats.colors.remoteTextStyles.add(style.name);
      else if (style) stats.colors.localTextStyles.add(style.name);
    } catch {}
  }

  const localStyles = await figma.getLocalTextStylesAsync();
  for (const style of localStyles) {
    if (!stats.colors.localTextStyles.has(style.name)) {
      stats.colors.unusedStyles.push(style.name);
    }
  }

  return stats;
};
