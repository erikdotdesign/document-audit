export type LayerStats = {
  totalLayers: number;
  frames: number;
  components: number;
  componentInstances: number;
  textLayers: number;
  embeddedImageFills: number;
  linkedImageFills: number;
  brokenImages: number;
  vectorPaths: number;
  hiddenLayers: number;
  lockedLayers: number;
  flattenedLayers: number;
  unflattenedLayers: number;
};

export type ColorStats = {
  uniqueFillColors: number;
  uniqueStrokeColors: number;
  colorTokenUsage: number;
};

export type ComponentStats = {
  localComponents: number;
  externalComponents: number;
  variantSets: number;
  missingInstances: number;
  overriddenInstances: number;
  missingDescriptions: number;
};

export type TextStats = {
  uniqueFonts: number;
  uniqueFontSizes: number;
  textWithoutStyle: number;
  uniqueTextStyles: number;
  localTextStyles: number;
  remoteTextStyles: number;
  unusedTextStyles: number;
};

export type LayoutStats = {
  autoLayoutFrames: number;
  layoutGrids: number;
  spacingTokensUsed: number;
  irregularSpacing: number;
};

export type PerformanceStats = {
  largestImageSize: string;
  approxDocumentSize: string;
  maxNestingDepth: number;
  pageCount: number;
  isHeavy: boolean;
};

export type NamingStats = {
  unnamedLayers: number;
  framelessLayers: number;
  topLevelUngrouped: number;
  duplicateLayerNames: number;
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

export const auditStats: AuditStats = {
  layers: {
    totalLayers: 0,
    frames: 0,
    components: 0,
    componentInstances: 0,
    textLayers: 0,
    embeddedImageFills: 0,
    linkedImageFills: 0,
    brokenImages: 0,
    vectorPaths: 0,
    hiddenLayers: 0,
    lockedLayers: 0,
    flattenedLayers: 0,
    unflattenedLayers: 0,
  },
  colors: {
    uniqueFillColors: 0,
    uniqueStrokeColors: 0,
    colorTokenUsage: 0,
  },
  components: {
    localComponents: 0,
    externalComponents: 0,
    variantSets: 0,
    missingInstances: 0,
    overriddenInstances: 0,
    missingDescriptions: 0,
  },
  text: {
    uniqueFonts: 0,
    uniqueFontSizes: 0,
    textWithoutStyle: 0,
    uniqueTextStyles: 0,
    localTextStyles: 0,
    remoteTextStyles: 0,
    unusedTextStyles: 0,
  },
  layout: {
    autoLayoutFrames: 0,
    layoutGrids: 0,
    spacingTokensUsed: 0,
    irregularSpacing: 0,
  },
  performance: {
    largestImageSize: "0 B",
    approxDocumentSize: "0 B",
    maxNestingDepth: 0,
    pageCount: 0,
    isHeavy: false,
  },
  naming: {
    unnamedLayers: 0,
    framelessLayers: 0,
    topLevelUngrouped: 0,
    duplicateLayerNames: 0,
  },
};

export const auditFigmaDocument = async (allNodes: SceneNode[]): Promise<AuditStats> => {
  const pages = figma.root.children;

  const imageHashes = new Set<string>();
  const textStyleIds = new Set<string>();
  const instanceNodes: InstanceNode[] = [];

  const fillColors = new Set<string>();
  const strokeColors = new Set<string>();
  const textStyles = new Set<string>();
  const localTextStyles = new Set<string>();
  const remoteTextStyles = new Set<string>();
  const fonts = new Set<string>();
  const fontSizes = new Set<number>();
  const duplicateNames = new Map<string, number>();

  const unusedTextStyleNames: string[] = [];

  const stats: AuditStats = {
    ...auditStats
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

  const solidPaintToHex = (paint: SolidPaint): string => {
    const r = Math.round(paint.color.r * 255);
    const g = Math.round(paint.color.g * 255);
    const b = Math.round(paint.color.b * 255);
    const alpha = paint.opacity !== undefined ? paint.opacity : 1;
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, "0")).join("")}${alpha < 1 ? Math.round(alpha * 255).toString(16).padStart(2, "0") : ""}`;
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, index);
    return `${value.toFixed(1)} ${units[index]}`;
  };

  for (const node of allNodes) {
    try {
      stats.layers.totalLayers++;
      if (!node.visible) stats.layers.hiddenLayers++;
      if (node.locked) stats.layers.lockedLayers++;
      if (!node.name) stats.naming.unnamedLayers++;

      const depth = getDepth(node);
      stats.performance.maxNestingDepth = Math.max(stats.performance.maxNestingDepth, depth);

      duplicateNames.set(node.name, (duplicateNames.get(node.name) || 0) + 1);
      if (!node.parent || node.parent.type === "PAGE") stats.naming.topLevelUngrouped++;

      if ("fills" in node && Array.isArray(node.fills)) {
        for (const fill of node.fills) {
          if (fill.type === "SOLID") {
            fillColors.add(solidPaintToHex(fill));
            if (fill.boundVariables?.color) stats.colors.colorTokenUsage++;
          } else if (fill.type === "IMAGE") {
            if (!fill.imageHash) stats.layers.brokenImages++;
            else {
              imageHashes.add(fill.imageHash);
              if (fill.scaleMode === "FILL") stats.layers.embeddedImageFills++;
              else stats.layers.linkedImageFills++;
            }
          }
        }
      }

      if ("strokes" in node && Array.isArray(node.strokes)) {
        for (const stroke of node.strokes) {
          if (stroke.type === "SOLID") {
            strokeColors.add(solidPaintToHex(stroke));
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
          if (!node.description?.trim()) stats.components.missingDescriptions++;
          break;
        case "INSTANCE":
          stats.layers.componentInstances++;
          instanceNodes.push(node);
          break;
        case "TEXT":
          stats.layers.textLayers++;
          fontSizes.add(node.fontSize as number);
          if (typeof node.fontName === "object" && "family" in node.fontName) {
            fonts.add(`${node.fontName.family} ${node.fontName.style}`);
          }
          if (!node.textStyleId) stats.text.textWithoutStyle++;
          else {
            const id = node.textStyleId.toString();
            textStyles.add(id);
            textStyleIds.add(id);
          }
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

  stats.performance.largestImageSize = formatBytes(maxBytes);
  stats.performance.approxDocumentSize = formatBytes(totalBytes);

  for (const node of instanceNodes) {
    try {
      const mainComponent = await node.getMainComponentAsync();
      if (!mainComponent) stats.components.missingInstances++;
      if (node.overrides?.length) stats.components.overriddenInstances++;
      if (!mainComponent?.parent || mainComponent.parent.type === "DOCUMENT") stats.components.localComponents++;
      else stats.components.externalComponents++;
    } catch {}
  }

  for (const styleId of textStyleIds) {
    try {
      const style = await figma.getStyleByIdAsync(styleId);
      if (style?.remote) remoteTextStyles.add(style.name);
      else if (style) localTextStyles.add(style.name);
    } catch {}
  }

  const localStyles = await figma.getLocalTextStylesAsync();
  for (const style of localStyles) {
    if (!localTextStyles.has(style.name)) {
      unusedTextStyleNames.push(style.name);
    }
  }

  stats.text.uniqueTextStyles = textStyles.size;
  stats.text.localTextStyles = localTextStyles.size;
  stats.text.remoteTextStyles = remoteTextStyles.size;
  stats.text.unusedTextStyles = unusedTextStyleNames.length;

  stats.text.uniqueFonts = fonts.size;
  stats.text.uniqueFontSizes = fontSizes.size;

  stats.naming.duplicateLayerNames = Array.from(duplicateNames.values()).filter(v => v > 1).length;

  stats.colors.uniqueFillColors = fillColors.size;
  stats.colors.uniqueStrokeColors = strokeColors.size;

  return stats;
};
