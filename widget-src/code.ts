export type LayerStats = {
  total: number;
  pages: number;
  sections: number;
  groups: number;
  frames: number;
  shapes: number;
  booleanShapes: number;
  vectors: number;
  slices: number;
  components: number;
  componentInstances: number;
  componentSets: number;
  text: number;
  images: number;
};

export type ColorStats = {
  uniqueFillColors: number;
  uniqueStrokeColors: number;
  rawFillUsage: number; // fills without color tokens
  rawStrokeUsage: number; // strokes without color tokens
  uniqueColorTokens: number;
  unusedColorTokens: number;
  colorTokenUsage: number;
};

export type ComponentStats = {
  local: number;
  remote: number;
  localInstances: number;
  remoteInstances: number;
  variants: number;
  missingInstances: number;
  overriddenInstances: number;
  missingDescriptions: number;
};

export type TextStats = {
  fontFamilies: number;
  uniqueFonts: number;
  uniqueFontSizes: number;
  textWithoutStyle: number;
  uniqueTextStyles: number;
  localTextStyles: number;
  remoteTextStyles: number;
  unusedTextStyles: number;
};

export type FrameStats = {
  autoLayouts: number;
  uniqueSpacingTokens: number;
  unusedSpacingTokens: number;
  spacingTokenUsage: number;
  irregularSpacing: number;
  nonIntegerBounds: number; // x, y, width, height not integers
  rawSpacingUsage: number; // auto layout frames without spacing tokens
};

export type OrganizationStats = {
  duplicateNames: number;
  unnamedLayers: number;
  topLevelUngrouped: number;
  maxNestingDepth: number;
  hiddenLayers: number;
};

export type ImageState = {
  embedded: number;
  linked: number;
  broken: number;
  largestSize: string;
  totalSize: string;
};

export type AuditStats = {
  layers: LayerStats;
  colors: ColorStats;
  components: ComponentStats;
  text: TextStats;
  frames: FrameStats;
  organization: OrganizationStats;
  images: ImageState;
};

export const auditStats: AuditStats = {
  layers: {
    total: 0,
    pages: 0,
    sections: 0,
    groups: 0,
    frames: 0,
    shapes: 0,
    booleanShapes: 0,
    vectors: 0,
    slices: 0,
    components: 0,
    componentInstances: 0,
    componentSets: 0,
    text: 0,
    images: 0
  },
  colors: {
    uniqueFillColors: 0,
    uniqueStrokeColors: 0,
    rawFillUsage: 0,
    rawStrokeUsage: 0,
    uniqueColorTokens: 0,
    unusedColorTokens: 0,
    colorTokenUsage: 0
  },
  components: {
    local: 0,
    remote: 0,
    localInstances: 0,
    remoteInstances: 0,
    variants: 0,
    missingInstances: 0,
    overriddenInstances: 0,
    missingDescriptions: 0,
  },
  text: {
    fontFamilies: 0,
    uniqueFonts: 0,
    uniqueFontSizes: 0,
    textWithoutStyle: 0,
    uniqueTextStyles: 0,
    localTextStyles: 0,
    remoteTextStyles: 0,
    unusedTextStyles: 0,
  },
  frames: {
    autoLayouts: 0,
    uniqueSpacingTokens: 0,
    unusedSpacingTokens: 0,
    spacingTokenUsage: 0,
    irregularSpacing: 0,
    nonIntegerBounds: 0,
    rawSpacingUsage: 0
  },
  organization: {
    duplicateNames: 0,
    unnamedLayers: 0,
    topLevelUngrouped: 0,
    maxNestingDepth: 0,
    hiddenLayers: 0
  },
  images: {
    embedded: 0,
    linked: 0,
    broken: 0,
    largestSize: "0 B",
    totalSize: "0 B"
  }
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
  const fontFamilies = new Set<string>();
  const fonts = new Set<string>();
  const fontSizes = new Set<number>();
  const unusedTextStyleNames: string[] = [];

  const uniqueColorTokens = new Set<string>();

  const uniqueSpacingTokens = new Set<string>();

  const duplicateNames = new Map<string, number>();

  const stats: AuditStats = {
    ...auditStats,
    layers: {
      ...auditStats.layers,
      pages: pages.length
    }
  };

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
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, "0")).join("")}${
      alpha < 1 ? Math.round(alpha * 255).toString(16).padStart(2, "0") : ""
    }`;
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, index);
    return `${value.toFixed(1)} ${units[index]}`;
  };

  const isOffGrid = (value: number): boolean => {
    return value % 4 !== 0;
  };

  for (const node of allNodes) {
    try {
      stats.layers.total++;
      if (!node.visible) stats.organization.hiddenLayers++;
      if (!node.name) stats.organization.unnamedLayers++;

      const depth = getDepth(node);
      stats.organization.maxNestingDepth = Math.max(stats.organization.maxNestingDepth, depth);
      duplicateNames.set(node.name, (duplicateNames.get(node.name) || 0) + 1);

      if (!node.parent || node.parent.type === "PAGE") stats.organization.topLevelUngrouped++;

      // Check non-integer bounds
      const { x, y, width, height } = node;
      if ([x, y, width, height].some((n) => !Number.isInteger(n))) {
        stats.frames.nonIntegerBounds++;
      }

      if ("fills" in node && Array.isArray(node.fills)) {
        for (const fill of node.fills) {
          if (fill.type === "SOLID") {
            fillColors.add(solidPaintToHex(fill));
            if (fill.boundVariables?.color) {
              stats.colors.colorTokenUsage++;
              uniqueColorTokens.add(fill.boundVariables.color.id);
            } else {
              stats.colors.rawFillUsage++;
            }
          } else if (fill.type === "IMAGE") {
            if (!fill.imageHash) stats.images.broken++;
            else {
              imageHashes.add(fill.imageHash);
              if (fill.scaleMode === "FILL") stats.images.embedded++;
              else stats.images.linked++;
            }
          }
        }
      }

      if ("strokes" in node && Array.isArray(node.strokes)) {
        for (const stroke of node.strokes) {
          if (stroke.type === "SOLID") {
            strokeColors.add(solidPaintToHex(stroke));
            if (stroke.boundVariables?.color) {
              stats.colors.colorTokenUsage++;
              uniqueColorTokens.add(stroke.boundVariables.color.id);
            } else {
              stats.colors.rawStrokeUsage++;
            }
          }
        }
      }

      switch (node.type) {
        case "FRAME":
          stats.layers.frames++;
          if (node.layoutMode !== "NONE") {
            stats.frames.autoLayouts++;

            // Padding checks
            const paddings = [
              { key: "paddingLeft", value: node.paddingLeft },
              { key: "paddingRight", value: node.paddingRight },
              { key: "paddingTop", value: node.paddingTop },
              { key: "paddingBottom", value: node.paddingBottom },
            ];

            for (const { key, value } of paddings) {
              const variableRef = node.boundVariables?.[key];
              if (variableRef) {
                stats.frames.spacingTokenUsage++;
                uniqueSpacingTokens.add(variableRef.id);
              } else {
                stats.frames.rawSpacingUsage++;
              }
              if (isOffGrid(value)) {
                stats.frames.irregularSpacing++;
              }
            }

            // Primary axis spacing
            const itemSpacing = node.itemSpacing;
            const itemRef = node.boundVariables?.itemSpacing;
            if (itemRef) {
              stats.frames.spacingTokenUsage++;
              uniqueSpacingTokens.add(itemRef.id);
            } else {
              stats.frames.rawSpacingUsage++;
            }

            if (
              node.primaryAxisSizingMode === "FIXED" && 
              node.primaryAxisAlignItems !== 'SPACE_BETWEEN' && 
              isOffGrid(itemSpacing)
            ) {
              stats.frames.irregularSpacing++;
            }

            // Cross axis spacing
            const counterAxisSpacing = node.counterAxisSpacing;
            const counterRef = node.boundVariables?.counterAxisSpacing;
            if (counterAxisSpacing != null) {
              if (counterRef) {
                stats.frames.spacingTokenUsage++;
                uniqueSpacingTokens.add(counterRef.id);
              } else {
                stats.frames.rawSpacingUsage++;
              }

              if (
                node.counterAxisSizingMode === "FIXED" && 
                node.counterAxisAlignContent !== 'SPACE_BETWEEN'  && 
                isOffGrid(counterAxisSpacing)
              ) {
                stats.frames.irregularSpacing++;
              }
            }
          }
          break;
        case "COMPONENT_SET":
          stats.layers.componentSets++;
          if (!node.description) stats.components.missingDescriptions++;
          break;
        case "COMPONENT":
          stats.layers.components++;
          if (node.remote) stats.components.remote++;
          else stats.components.local++;
          if (node.parent?.type === "COMPONENT_SET") stats.components.variants++;
          if (!node.description) stats.components.missingDescriptions++;
          break;
        case "INSTANCE":
          stats.layers.componentInstances++;
          instanceNodes.push(node);
          break;
        case "TEXT":
          stats.layers.text++;
          fontSizes.add(node.fontSize as number);
          if (typeof node.fontName === "object" && "family" in node.fontName) {
            fontFamilies.add(node.fontName.family);
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
          stats.layers.vectors++;
          break;
        case "BOOLEAN_OPERATION":
          stats.layers.booleanShapes++;
          break;
        case "SECTION":
          stats.layers.sections++;
          break;
        case "GROUP":
        case "TRANSFORM_GROUP":
          stats.layers.groups++;
          break;
        case "ELLIPSE":
        case "LINE":
        case "POLYGON":
        case "RECTANGLE":
        case "SHAPE_WITH_TEXT":
        case "STAR":
          stats.layers.shapes++;
          break;
        case "SLICE":
          stats.layers.slices++;
          break;
        default:
          break;
      }
    } catch (err) {
      console.warn("Node audit failed:", node.name, err);
    }
  }

  let totalBytes = 0;
  let maxBytes = 0;

  await Promise.allSettled(
    [...imageHashes].map(async (hash) => {
      try {
        const image = figma.getImageByHash(hash);
        if (image) {
          const bytes = await image.getBytesAsync();
          const len = bytes.length;
          totalBytes += len;
          if (len > maxBytes) maxBytes = len;
        }
      } catch {}
    })
  );

  stats.images.largestSize = formatBytes(maxBytes);
  stats.images.totalSize = formatBytes(totalBytes);

  for (const node of instanceNodes) {
    try {
      const mainComponent = await node.getMainComponentAsync();
      if (!mainComponent) stats.components.missingInstances++;
      if (node.overrides?.length) stats.components.overriddenInstances++;
      if (mainComponent?.remote) stats.components.remoteInstances++;
      else stats.components.localInstances++;
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
  stats.text.fontFamilies = fontFamilies.size;
  stats.text.uniqueFonts = fonts.size;
  stats.text.uniqueFontSizes = fontSizes.size;

  const allVariables = await figma.variables.getLocalVariablesAsync();
  const colorVariables = allVariables.filter(v => v.resolvedType === "COLOR");
  const spacingVariables = allVariables.filter(v => v.resolvedType === "FLOAT");
  const unusedColorTokens = colorVariables.filter(v => !uniqueColorTokens.has(v.id));
  const unusedSpacingTokens = spacingVariables.filter(v => !uniqueSpacingTokens.has(v.id));

  stats.colors.uniqueFillColors = fillColors.size;
  stats.colors.uniqueStrokeColors = strokeColors.size;
  stats.colors.uniqueColorTokens = uniqueColorTokens.size;
  stats.colors.unusedColorTokens = unusedColorTokens.length;

  stats.frames.uniqueSpacingTokens = uniqueSpacingTokens.size;
  stats.frames.unusedSpacingTokens = unusedSpacingTokens.length;

  stats.layers.images = imageHashes.size;

  stats.organization.duplicateNames = Array.from(duplicateNames.values()).filter(v => v > 1).length;

  return stats;
};
