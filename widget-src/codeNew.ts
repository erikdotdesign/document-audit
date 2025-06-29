type VariableStats = {
  variables: {
    color: number;
    number: number;
    string: number;
    boolean: number;
    colorAlias: number;
    numberAlias: number;
    stringAlias: number;
    booleanAlias: number;
  };
  variableCollections: number;
  variableModes: number;
  unusedVariables: number;
};

export type AuditVariableStats = {
  localVariables: VariableStats;
  remoteVariables: VariableStats;
};

export type FillStyleStats = {
  fillStyles?: number;
  fillPaints: {
    solid: number;
    linearGradient: number;
    radialGradient: number;
    angularGradient: number;
    diamondGradient: number;
    pattern: number;
    image: number;
  };
  rawPropertyValues: {
    color: number;
    colorStop: number;
  };
  uniquePropertyTokens: {
    color: number;
    colorStop: number;
  };
  missingDescriptions?: number;
};

export type AuditFillsStats = {
  localFillStyles: FillStyleStats;
  remoteFillStyles: FillStyleStats;
  rawFills: FillStyleStats;
};

export type AuditStats = {
  fills: AuditFillsStats;
  variables: AuditVariableStats;
};

const variableStats: VariableStats = {
  variables: {
    color: 0,
    number: 0,
    string: 0,
    boolean: 0,
    colorAlias: 0,
    numberAlias: 0,
    stringAlias: 0,
    booleanAlias: 0
  },
  variableCollections: 0,
  variableModes: 0,
  unusedVariables: 0
};

const createFillStyleStats = ({
  includeFillStyles = true,
  includeDescription = true
}): FillStyleStats => ({
  ...includeFillStyles
  ? { fillStyles: 0 }
  : {},
  fillPaints: {
    solid: 0,
    linearGradient: 0,
    radialGradient: 0,
    angularGradient: 0,
    diamondGradient: 0,
    pattern: 0,
    image: 0
  },
  rawPropertyValues: {
    color: 0,
    colorStop: 0,
  },
  uniquePropertyTokens: {
    color: 0,
    colorStop: 0,
  },
  ...includeDescription
  ? { missingDescriptions: 0 }
  : {}
});

export const auditStats: AuditStats = {
  fills: {
    localFillStyles: createFillStyleStats({}),
    remoteFillStyles: createFillStyleStats({}),
    rawFills: createFillStyleStats({ 
      includeDescription: false,
      includeFillStyles: false
    })
  },
  variables: {
    localVariables: variableStats,
    remoteVariables: variableStats
  }
};

const solidFillColorTokenIds = new Set<string>();
const gradientFillColorStopTokenIds = new Set<string>();

const processFills = async (node: SceneNode) => {
  let fillStyle = null;
  if ("fillStyleId" in node && node.fillStyleId !== figma.mixed && node.fillStyleId) {
    fillStyle = await figma.getStyleByIdAsync(node.fillStyleId);
  }
  if ("fills" in node && Array.isArray(node.fills)) {
    for (const fill of (node.fills as Paint[])) {
      if (fill.type.startsWith("GRADIENT")) {
        for (const stop of (fill as GradientPaint).gradientStops) {
          const boundVariable = stop.boundVariables && stop.boundVariables.color;
          if (boundVariable) {
            gradientFillColorStopTokenIds.add(boundVariable.id);
          }
          if (fillStyle) {
            if (fillStyle.remote) {
              if (!boundVariable) {
                auditStats.fills.remoteFillStyles.rawPropertyValues.colorStop++;
              }
            } else {
              if (!boundVariable) {
                auditStats.fills.localFillStyles.rawPropertyValues.colorStop++;
              }
            }
          }
        }
      }
      switch(fill.type) {
        case "SOLID": {
          const boundVariable = fill.boundVariables?.color;
          if (boundVariable) {
            solidFillColorTokenIds.add(boundVariable.id);
          }
          if (fillStyle) {
            if (fillStyle.remote) {
              auditStats.fills.remoteFillStyles.fillPaints.solid++;
              if (!boundVariable) {
                auditStats.fills.remoteFillStyles.rawPropertyValues.color++;
              }
            } else {
              auditStats.fills.localFillStyles.fillPaints.solid++;
              if (!boundVariable) {
                auditStats.fills.localFillStyles.rawPropertyValues.color++;
              }
            }
          } else {
            auditStats.fills.rawFills.fillPaints.solid++;
            if (!boundVariable) {
              auditStats.fills.rawFills.rawPropertyValues.color++;
            }
          }
          break;
        }
        case "GRADIENT_LINEAR":
          if (fillStyle) {
            if (fillStyle.remote) {
              auditStats.fills.remoteFillStyles.fillPaints.linearGradient++;
            } else {
              auditStats.fills.localFillStyles.fillPaints.linearGradient++;
            }
          } else {
            auditStats.fills.rawFills.fillPaints.linearGradient++;
          }
          break;
        case "GRADIENT_RADIAL":
          if (fillStyle) {
            if (fillStyle.remote) {
              auditStats.fills.remoteFillStyles.fillPaints.radialGradient++;
            } else {
              auditStats.fills.localFillStyles.fillPaints.radialGradient++;
            }
          } else {
            auditStats.fills.rawFills.fillPaints.radialGradient++;
          }
          break;
        case "GRADIENT_ANGULAR":
          if (fillStyle) {
            if (fillStyle.remote) {
              auditStats.fills.remoteFillStyles.fillPaints.angularGradient++;
            } else {
              auditStats.fills.localFillStyles.fillPaints.angularGradient++;
            }
          } else {
            auditStats.fills.rawFills.fillPaints.angularGradient++;
          }
          break;
        case "GRADIENT_DIAMOND":
          if (fillStyle) {
            if (fillStyle.remote) {
              auditStats.fills.remoteFillStyles.fillPaints.diamondGradient++;
            } else {
              auditStats.fills.localFillStyles.fillPaints.diamondGradient++;
            }
          } else {
            auditStats.fills.rawFills.fillPaints.diamondGradient++;
          }
          break;
        case "IMAGE":
          if (fillStyle) {
            if (fillStyle.remote) {
              auditStats.fills.remoteFillStyles.fillPaints.image++;
            } else {
              auditStats.fills.localFillStyles.fillPaints.image++;
            }
          } else {
            auditStats.fills.rawFills.fillPaints.image++;
          }
          break;
        default:
          break;
      }
    }
  }
};

export const proccessNode = async (node: SceneNode) => {
  await processFills(node);
  console.log(auditStats);
};

// export const auditFigmaDocument = async (allNodes: SceneNode[]): Promise<AuditStats> => {

//   for (const node of allNodes) {
//     try {

//       switch(node.type) {
//         case "FRAME":
//           break;
//         case "COMPONENT_SET":
//           break;
//         case "COMPONENT":
//           break;
//         case "INSTANCE":
//           break;
//         case "TEXT":
//           break;
//         case "VECTOR":
//           break;
//         case "BOOLEAN_OPERATION":
//           break;
//         case "SECTION":
//           break;
//         case "GROUP":
//         case "TRANSFORM_GROUP":
//           break;
//         case "ELLIPSE":
//         case "LINE":
//         case "POLYGON":
//         case "RECTANGLE":
//         case "SHAPE_WITH_TEXT":
//         case "STAR":
//           break;
//         case "SLICE":
//           break;
//         default:
//           break;
//       }
//     } catch (err) {
//       console.warn("Node audit failed:", node.name, err);
//     }
//   }

//   return stats;
// };
