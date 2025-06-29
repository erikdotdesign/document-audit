import { proccessNode } from "./codeNew";

export type LayerStats = {
  total: number;
  pages: number;
  sections: number;
  groups: number;
  frames: number;
  components: number;
  componentSets: number;
  componentInstances: number;
  text: number;
  shapes: number;
  booleanShapes: number;
  vectors: number;
  slices: number;
  images: number;
};

export type ImageState = {
  embedded: number;
  linked: number;
  broken: number;
  totalSize: string;
  largestSize: string;
  averageSize: string;
};

export type ColorStats = {
  rawFillColorUsage: number;
  rawStrokeColorUsage: number;
  fillColorTokenUsage: number;
  strokeColorTokenUsage: number;
  uniqueFillColorTokens: number;
  uniqueStrokeColorTokens: number;
  uniqueColorTokens: number;
};

export type AppearanceStats = {
  localVariableCollections: number;
  remoteVariableCollections: number;
  localVariableModes: number;
  remoteVariableModes: number;
  cornerRadiusTokenUsage: number;
  rawCornerRadiusUsage: number;
  uniqueCornerRadiusTokens: number;
  strokeWeightTokenUsage: number;
  rawStrokeWeightUsage: number;
  uniqueStrokeWeightTokens: number;
};

export type EffectStats = {
  rawEffectUsage: number;
  rawPropertyUsage: number;
  propertyTokenUsage: number;
  uniquePropertyTokens: number;
  uniqueEffectStyles: number;
  localEffectStyles: number;
  remoteEffectStyles: number;
  unusedLocalEffectStyles: number;
  effectStylesMissingDescriptions: number;
};

export type TextStats = {
  fontFamilies: number;
  uniqueFonts: number;
  uniqueFontSizes: number;
  textWithoutStyle: number;
  uniqueTextStyles: number;
  localTextStyles: number;
  remoteTextStyles: number;
  unusedLocalTextStyles: number;
};

export type ComponentStats = {
  local: number;
  remote: number;
  variants: number;
  localInstances: number;
  remoteInstances: number;
  overriddenInstances: number;
  orphanedInstances: number;
  missingDescriptions: number;
};

export type LayoutStats = {
  autoLayouts: number;
  paddingTokenUsage: number;
  rawPaddingUsage: number;
  uniquePaddingTokens: number;
  spacingTokenUsage: number;
  rawSpacingUsage: number;
  uniqueSpacingTokens: number;
  irregularSpacing: number;
  nonIntegerBounds: number;
};

export type OrganizationStats = {
  averageNestingDepth: number;
  maxNestingDepth: number;
  topLevelUngrouped: number;
  duplicateNames: number;
  unnamedLayers: number;
  hiddenLayers: number;
  lockedLayers: number;
};

export type AuditStats = {
  layers: LayerStats;
  layout: LayoutStats;
  text: TextStats;
  colors: ColorStats;
  appearance: AppearanceStats;
  effects: EffectStats;
  components: ComponentStats;
  images: ImageState;
  organization: OrganizationStats;
};

export const auditStats: AuditStats = {
  layers: {
    total: 0,
    pages: 0,
    sections: 0,
    groups: 0,
    frames: 0,
    components: 0,
    componentSets: 0,
    componentInstances: 0,
    text: 0,
    shapes: 0,
    booleanShapes: 0,
    vectors: 0,
    slices: 0,
    images: 0,
  },
  layout: {
    autoLayouts: 0,
    paddingTokenUsage: 0,
    rawPaddingUsage: 0,
    uniquePaddingTokens: 0,
    spacingTokenUsage: 0,
    rawSpacingUsage: 0,
    uniqueSpacingTokens: 0,
    irregularSpacing: 0,
    nonIntegerBounds: 0
  },
  text: {
    fontFamilies: 0,
    uniqueFonts: 0,
    uniqueFontSizes: 0,
    textWithoutStyle: 0,
    uniqueTextStyles: 0,
    localTextStyles: 0,
    remoteTextStyles: 0,
    unusedLocalTextStyles: 0,
  },
  appearance: {
    localVariableCollections: 0,
    remoteVariableCollections: 0,
    localVariableModes: 0,
    remoteVariableModes: 0,
    cornerRadiusTokenUsage: 0,
    rawCornerRadiusUsage: 0,
    uniqueCornerRadiusTokens: 0,
    strokeWeightTokenUsage: 0,
    rawStrokeWeightUsage: 0,
    uniqueStrokeWeightTokens: 0
  },
  colors: {
    rawFillColorUsage: 0,
    rawStrokeColorUsage: 0,
    fillColorTokenUsage: 0,
    strokeColorTokenUsage: 0,
    uniqueFillColorTokens: 0,
    uniqueStrokeColorTokens: 0,
    uniqueColorTokens: 0
  },
  effects: {
    rawEffectUsage: 0,
    uniqueEffectStyles: 0,
    localEffectStyles: 0,
    remoteEffectStyles: 0,
    unusedLocalEffectStyles: 0,
    effectStylesMissingDescriptions: 0,
    rawPropertyUsage: 0,
    propertyTokenUsage: 0,
    uniquePropertyTokens: 0,
  },
  components: {
    local: 0,
    remote: 0,
    variants: 0,
    localInstances: 0,
    remoteInstances: 0,
    overriddenInstances: 0,
    orphanedInstances: 0,
    missingDescriptions: 0,
  },
  images: {
    embedded: 0,
    linked: 0,
    broken: 0,
    largestSize: "0 B",
    totalSize: "0 B",
    averageSize: "0 B",
  },
  organization: {
    averageNestingDepth: 0,
    maxNestingDepth: 0,
    topLevelUngrouped: 0,
    duplicateNames: 0,
    unnamedLayers: 0,
    hiddenLayers: 0,
    lockedLayers: 0,
  },
};

export const auditFigmaDocument = async (allNodes: SceneNode[]): Promise<AuditStats> => {
  const pages = figma.root.children;

  // const imageHashes = new Set<string>();
  // const instanceNodes: InstanceNode[] = [];

  // const uniqueFillColorTokens = new Set<string>();
  // const uniqueStrokeColorTokens = new Set<string>();

  // const uniqueTextStyles = new Set<string>();
  // const localTextStyles = new Set<string>();
  // const remoteTextStyles = new Set<string>();
  // const fontFamilies = new Set<string>();
  // const uniqueFonts = new Set<string>();
  // const uniqueFontSizes = new Set<number>();
  // const unusedLocalTextStyles = new Set<string>();
  // const uniquePaddingTokens = new Set<string>();
  // const uniqueSpacingTokens = new Set<string>();
  // const uniqueStrokeWeightTokens = new Set<string>();
  // const uniqueCornerRadiusTokens = new Set<string>();

  // const localEffectStyles = new Set<string>();
  // const remoteEffectStyles = new Set<string>();
  // const unusedLocalEffectStyles = new Set<string>();
  // const uniqueEffectStyles = new Set<string>();
  // const uniqueEffectPropertyTokens = new Set<string>();

  // const remoteComponents = new Set<string>();

  // const duplicateNames = new Map<string, number>();

  const stats: AuditStats = {
    ...auditStats,
    layers: {
      ...auditStats.layers,
      pages: pages.length
    }
  };

  // const getDepth = (node: SceneNode): number => {
  //   let depth = 0;
  //   let parent = node.parent;
  //   while (parent && parent.type !== "PAGE") {
  //     depth++;
  //     parent = parent.parent;
  //   }
  //   return depth;
  // };

  // const formatBytes = (bytes: number): string => {
  //   if (bytes === 0) return "0 B";
  //   const units = ["B", "KB", "MB", "GB", "TB"];
  //   const index = Math.floor(Math.log(bytes) / Math.log(1024));
  //   const value = bytes / Math.pow(1024, index);
  //   return `${value.toFixed(1)} ${units[index]}`;
  // };

  // const isOffGrid = (value: number): boolean => {
  //   return value % 4 !== 0;
  // };

  // let totalDepth = 0;
  // let imageFillCount = 0;

  for (const node of allNodes) {
    try {
      proccessNode(node);
      // stats.layers.total++;
      // if (!node.visible) stats.organization.hiddenLayers++;
      // if (!node.name) stats.organization.unnamedLayers++;
      // if (node.locked) stats.organization.lockedLayers++;

      // const depth = getDepth(node);
      // stats.organization.maxNestingDepth = Math.max(stats.organization.maxNestingDepth, depth);
      // totalDepth += depth;
      // duplicateNames.set(node.name, (duplicateNames.get(node.name) || 0) + 1);

      // if (!node.parent || node.parent.type === "PAGE") stats.organization.topLevelUngrouped++;

      // const variablesIds = new Set<string>();
      // const variableCollectionIds = new Set<string>();

      // const styleIds = [
      //   "fillStyleId",
      //   "strokeStyleId",
      //   "textStyleId",
      //   "effectStyleId",
      //   "gridStyleId"
      // ];

      // if ("effectStyleId" in node && node.effectStyleId !== '') {
      //   const effectStyle = await figma.getStyleByIdAsync(node.effectStyleId);
      //   if (effectStyle) {
      //     console.log(node.name, effectStyle.effects);
      //   }
      // }

      // // if ("gridStyleId" in node) {
      // //   const gridStyle = await figma.getStyleByIdAsync(node.gridStyleId);
      // //   if (gridStyle) {
      // //     // console.log(gridStyle.boundVariables);
      // //   }
      // // }

      // if ("fillStyleId" in node && node.fillStyleId !== '') {
      //   const fillStyle = await figma.getStyleByIdAsync(node.fillStyleId);
      //   if (fillStyle) {
      //     // console.log(node.name, fillStyle.paints);
      //   }
      // }

      // if (node.boundVariables) {
      //   for (const key in node.boundVariables) {
      //     const variableValue = node.boundVariables[key as keyof typeof node.boundVariables];
      //     if (variableValue) {
      //       if (Array.isArray(variableValue)) {
      //         for (const arrayItem of variableValue) {
      //           variablesIds.add(arrayItem.id);
      //         }
      //       } else if ("type" in variableValue && variableValue.type === "VARIABLE_ALIAS") {
      //         variablesIds.add((variableValue as VariableAlias).id);
      //       } else {
      //         for (const key in variableValue) {
      //           const nestedValue = (variableValue as {
      //               readonly [propertyName: string]: VariableAlias;
      //           })[key];
      //           variablesIds.add(nestedValue.id);
      //         }
      //       }
      //     }
      //   }
      //   for (const variableId of variablesIds) {
      //     const variable = await figma.variables.getVariableByIdAsync(variableId);
      //     if (variable) {
      //       variableCollectionIds.add(variable.variableCollectionId);
      //     }
      //   }
      //   for (const variableCollectionId of variableCollectionIds) {
      //     const variableCollection = await figma.variables.getVariableCollectionByIdAsync(variableCollectionId);
      //     if (variableCollection) {
      //       // console.log(variableCollection.name);
      //     }
      //   }
      // }


      // // Check non-integer bounds
      // const boundsKeys = ["x", "y", "width", "height"];
      // for (const key of boundsKeys) {
      //   if (!Number.isInteger(node[key])) {
      //     stats.layout.nonIntegerBounds++;
      //   }
      // }

      // // Stroke weight
      // if ("strokeWeight" in node) {
      //   const strokeWeightKeys = ["strokeTopWeight", "strokeBottomWeight", "strokeLeftWeight", "strokeRightWeight"];
      //   for (const key of strokeWeightKeys) {
      //     const variable = node.boundVariables?.[key as keyof typeof node.boundVariables];
      //     if (variable) {
      //       uniqueStrokeWeightTokens.add(variable.id);
      //       stats.appearance.strokeWeightTokenUsage++;
      //     } else {
      //       if (node[key]) {
      //         stats.appearance.rawStrokeWeightUsage++;
      //       }
      //     }
      //   }
      // }

      // // Corner radius
      // if ("cornerRadius" in node) {
      //   const radiusKeys = ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"];
      //   for (const key of radiusKeys) {
      //     const variable = node.boundVariables?.[key as keyof typeof node.boundVariables];
      //     if (variable) {
      //       uniqueCornerRadiusTokens.add(variable.id);
      //       stats.appearance.cornerRadiusTokenUsage++;
      //     } else {
      //       if (node[key]) {
      //         stats.appearance.rawCornerRadiusUsage++;
      //       }
      //     }
      //   }
      // }

      // if ("fills" in node && Array.isArray(node.fills)) {
      //   // if ("fillStyleId" in node && node.fillStyleId !== '') {
      //   //   for (const fill of node.fills) {
      //   //     console.log(node.boundVariables);
      //   //   }
      //   // }
      //   for (const fill of node.fills) {
      //     if (fill.type === "SOLID") {
      //       if (fill.boundVariables?.color) {
      //         stats.colors.fillColorTokenUsage++;
      //         uniqueFillColorTokens.add(fill.boundVariables.color.id);
      //       } else {
      //         stats.colors.rawFillColorUsage++;
      //       }
      //     } else if (fill.type === "IMAGE") {
      //       imageFillCount++;
      //       if (!fill.imageHash) stats.images.broken++;
      //       else {
      //         imageHashes.add(fill.imageHash);
      //         if (fill.scaleMode === "FILL") stats.images.embedded++;
      //         else stats.images.linked++;
      //       }
      //     }
      //   }
      // }

      // if ("strokes" in node && Array.isArray(node.strokes)) {
      //   for (const stroke of node.strokes) {
      //     if (stroke.type === "SOLID") {
      //       if (stroke.boundVariables?.color) {
      //         stats.colors.strokeColorTokenUsage++;
      //         uniqueStrokeColorTokens.add(stroke.boundVariables.color.id);
      //       } else {
      //         stats.colors.rawStrokeColorUsage++;
      //       }
      //     }
      //   }
      // }

      // if ("effects" in node && node.effects.length > 0) {
      //   if ("effectStyleId" in node && typeof node.effectStyleId === "string" && node.effectStyleId !== "") {
      //     uniqueEffectStyles.add(node.effectStyleId);
      //   } else {
      //     stats.effects.rawEffectUsage++;
      //   }
      //   for (const effect of node.effects) {
      //     const effectKeys = ["radius", "color", "spread", "offsetX", "offsetY"];
      //     for (const key of effectKeys) {
      //       const variable = effect.boundVariables[key as keyof typeof effect.boundVariables];
      //       if (variable) {
      //         uniqueEffectPropertyTokens.add(variable.id);
      //         stats.effects.propertyTokenUsage++;
      //       } else {
      //         if (key in effect) {
      //           stats.effects.rawPropertyUsage++;
      //         }
      //       }
      //     }
      //   }
      // }

      // switch (node.type) {
      //   case "FRAME":
      //     stats.layers.frames++;
      //     if (node.layoutMode !== "NONE") {
      //       stats.layout.autoLayouts++;

      //       // Padding checks
      //       const paddingKeys = ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"];
      //       for (const key of paddingKeys) {
      //         const variable = node.boundVariables?.[key as keyof typeof node.boundVariables];
      //         if (variable) {
      //           stats.layout.paddingTokenUsage++;
      //           uniquePaddingTokens.add(variable.id);
      //         } else {
      //           stats.layout.rawPaddingUsage++;
      //         }
      //         if (isOffGrid(node[key])) {
      //           stats.layout.irregularSpacing++;
      //         }
      //       }

      //       // Primary axis spacing
      //       const itemSpacing = node.itemSpacing;
      //       const itemRef = node.boundVariables?.itemSpacing;
      //       if (itemRef) {
      //         stats.layout.spacingTokenUsage++;
      //         uniqueSpacingTokens.add(itemRef.id);
      //       } else {
      //         stats.layout.rawSpacingUsage++;
      //       }
      //       if (
      //         node.primaryAxisSizingMode === "FIXED" && 
      //         node.primaryAxisAlignItems !== 'SPACE_BETWEEN' && 
      //         isOffGrid(itemSpacing)
      //       ) {
      //         stats.layout.irregularSpacing++;
      //       }

      //       // Cross axis spacing
      //       const counterAxisSpacing = node.counterAxisSpacing;
      //       const counterRef = node.boundVariables?.counterAxisSpacing;
      //       if (counterAxisSpacing != null) {
      //         if (counterRef) {
      //           stats.layout.spacingTokenUsage++;
      //           uniqueSpacingTokens.add(counterRef.id);
      //         } else {
      //           stats.layout.rawSpacingUsage++;
      //         }
      //         if (
      //           node.counterAxisSizingMode === "FIXED" && 
      //           node.counterAxisAlignContent !== 'SPACE_BETWEEN'  && 
      //           isOffGrid(counterAxisSpacing)
      //         ) {
      //           stats.layout.irregularSpacing++;
      //         }
      //       }
      //     }
      //     break;
      //   case "COMPONENT_SET":
      //     stats.layers.componentSets++;
      //     if (!node.description) stats.components.missingDescriptions++;
      //     break;
      //   case "COMPONENT":
      //     stats.components.local++;
      //     if (node.parent?.type === "COMPONENT_SET") stats.components.variants++;
      //     if (!node.description) stats.components.missingDescriptions++;
      //     break;
      //   case "INSTANCE":
      //     stats.layers.componentInstances++;
      //     instanceNodes.push(node);
      //     break;
      //   case "TEXT":
      //     stats.layers.text++;
      //     uniqueFontSizes.add(node.fontSize as number);
      //     if (typeof node.fontName === "object" && "family" in node.fontName) {
      //       fontFamilies.add(node.fontName.family);
      //       uniqueFonts.add(`${node.fontName.family} ${node.fontName.style}`);
      //     }
      //     if (!node.textStyleId) stats.text.textWithoutStyle++;
      //     else uniqueTextStyles.add(node.textStyleId.toString());
      //     break;
      //   case "VECTOR":
      //     stats.layers.vectors++;
      //     break;
      //   case "BOOLEAN_OPERATION":
      //     stats.layers.booleanShapes++;
      //     break;
      //   case "SECTION":
      //     stats.layers.sections++;
      //     break;
      //   case "GROUP":
      //   case "TRANSFORM_GROUP":
      //     stats.layers.groups++;
      //     break;
      //   case "ELLIPSE":
      //   case "LINE":
      //   case "POLYGON":
      //   case "RECTANGLE":
      //   case "SHAPE_WITH_TEXT":
      //   case "STAR":
      //     stats.layers.shapes++;
      //     break;
      //   case "SLICE":
      //     stats.layers.slices++;
      //     break;
      //   default:
      //     break;
      // }
    } catch (err) {
      console.warn("Node audit failed:", node.name, err);
    }
  }

  // let totalBytes = 0;
  // let maxBytes = 0;

  // await Promise.allSettled(
  //   [...imageHashes].map(async (hash) => {
  //     try {
  //       const image = figma.getImageByHash(hash);
  //       if (image) {
  //         const bytes = await image.getBytesAsync();
  //         const len = bytes.length;
  //         totalBytes += len;
  //         if (len > maxBytes) maxBytes = len;
  //       }
  //     } catch {}
  //   })
  // );

  // stats.images.largestSize = formatBytes(maxBytes);
  // stats.images.totalSize = formatBytes(totalBytes);
  // stats.images.averageSize =
  // imageFillCount > 0 ? formatBytes(totalBytes / imageFillCount) : "0 B";

  // for (const node of instanceNodes) {
  //   try {
  //     const mainComponent = await node.getMainComponentAsync();
  //     if (mainComponent) {
  //       const mainComponentParent = mainComponent.parent;
  //       // orphaned instance
  //       if (!mainComponentParent) stats.components.orphanedInstances++;
  //       // orphaned variant
  //       if (mainComponentParent?.type === 'COMPONENT_SET' && !mainComponent.remote) {
  //         if (!mainComponentParent.parent) stats.components.orphanedInstances++;
  //       }
  //       // remove vs local instance
  //       if (mainComponent?.remote) {
  //         remoteComponents.add(mainComponent.id);
  //         stats.components.remoteInstances++;
  //       } else {
  //         stats.components.localInstances++;
  //       }
  //       // overridden instances
  //       if (node.overrides?.length) stats.components.overriddenInstances++;
  //     }
  //   } catch {}
  // }

  // for (const styleId of uniqueTextStyles) {
  //   try {
  //     const style = await figma.getStyleByIdAsync(styleId);
  //     if (style) {
  //       if (style.remote) remoteTextStyles.add(styleId);
  //       else localTextStyles.add(styleId);
  //     }
  //   } catch {}
  // }

  // const localTextStylesAsync = await figma.getLocalTextStylesAsync();
  // for (const textStyle of localTextStylesAsync) {
  //   if (!localTextStyles.has(textStyle.id)) {
  //     unusedLocalTextStyles.add(textStyle.id);
  //   }
  // }

  // for (const effectStyleId of uniqueEffectStyles) {
  //   try {
  //     const effectStyle = await figma.getStyleByIdAsync(effectStyleId);
  //     if (effectStyle) {
  //       if (!effectStyle.description) stats.effects.effectStylesMissingDescriptions++;
  //       if (effectStyle.remote) remoteEffectStyles.add(effectStyle.id);
  //       else localEffectStyles.add(effectStyle.id);
  //     }
  //   } catch {}
  // }

  // const localEffectStylesAsync = await figma.getLocalEffectStylesAsync();
  // for (const effectStyle of localEffectStylesAsync) {
  //   if (!localEffectStyles.has(effectStyle.id)) {
  //     unusedLocalEffectStyles.add(effectStyle.id);
  //   }
  // }

  // stats.layers.images = imageHashes.size;
  // stats.layers.components = stats.components.local + remoteComponents.size;

  // stats.text.uniqueTextStyles = uniqueTextStyles.size;
  // stats.text.localTextStyles = localTextStyles.size;
  // stats.text.remoteTextStyles = remoteTextStyles.size;
  // stats.text.unusedLocalTextStyles = unusedLocalTextStyles.size;
  // stats.text.fontFamilies = fontFamilies.size;
  // stats.text.uniqueFonts = uniqueFonts.size;
  // stats.text.uniqueFontSizes = uniqueFontSizes.size;

  // stats.colors.uniqueFillColorTokens = uniqueFillColorTokens.size;
  // stats.colors.uniqueStrokeColorTokens = uniqueStrokeColorTokens.size;
  // stats.colors.uniqueColorTokens = new Set([
  //   ...uniqueFillColorTokens,
  //   ...uniqueStrokeColorTokens,
  // ]).size;

  // stats.appearance.uniqueStrokeWeightTokens = uniqueStrokeWeightTokens.size;
  // stats.appearance.uniqueCornerRadiusTokens = uniqueCornerRadiusTokens.size;

  // stats.effects.uniquePropertyTokens = uniqueEffectPropertyTokens.size;
  // stats.effects.uniqueEffectStyles = uniqueEffectStyles.size;
  // stats.effects.localEffectStyles = localEffectStyles.size;
  // stats.effects.remoteEffectStyles = remoteEffectStyles.size;
  // stats.effects.unusedLocalEffectStyles = unusedLocalEffectStyles.size;

  // stats.layout.uniqueSpacingTokens = uniqueSpacingTokens.size;
  // stats.layout.uniquePaddingTokens = uniquePaddingTokens.size;

  // stats.components.remote = remoteComponents.size;

  // stats.organization.duplicateNames = Array.from(duplicateNames.values()).filter(v => v > 1).length;
  // stats.organization.averageNestingDepth = allNodes.length > 0
  // ? Math.round(totalDepth / allNodes.length)
  // : 0;

  // try {
  //   const collections = await figma.variables.getLocalVariableCollectionsAsync();
  //   const localCollections = collections.filter(c => !c.remote);

  //   const localVariableModes = new Set<string>();
  //   for (const collection of localCollections) {
  //     for (const mode of collection.modes) {
  //       localVariableModes.add(mode.modeId);
  //     }
  //   }

  //   stats.appearance.localVariableCollections = localCollections.length;
  //   stats.appearance.localVariableModes = localVariableModes.size;
  // } catch (err) {
  //   console.warn("Failed to audit variables:", err);
  // }

  return stats;
};
