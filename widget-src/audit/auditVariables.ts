import { OriginVariableStats } from "./buildStats";
import { getVariableBucket } from "./helpers";

export const auditVariables = async (
  variableIds: Set<string>,
  stats: OriginVariableStats
) => {
  const variableCollectionIds = new Set<string>();

  const localVariables = await figma.variables.getLocalVariablesAsync();

  const variables = await Promise.all(
    [...variableIds].map(id => figma.variables.getVariableByIdAsync(id))
  ) as Variable[];

  const unusedVariables = localVariables.filter(v => !variableIds.has(v.id));

  stats.local.unused = unusedVariables.length;

  for (const variable of [...variables, ...unusedVariables]) {
    if (variable) {
      const bucket = getVariableBucket(variable, stats);
      if (variable.resolvedType === "FLOAT") bucket.count.number++;
      else bucket.count[variable.resolvedType.toLowerCase() as "color" | "boolean" | "string"]++;
      for (const key in variable.valuesByMode) {
        const modeValue = variable.valuesByMode[key];
        if (modeValue.type && modeValue.type === "VARIABLE_ALIAS") {
          const resolvedVariable = await figma.variables.getVariableByIdAsync(modeValue.id);
          if (resolvedVariable) {
            if (resolvedVariable.resolvedType === "FLOAT") bucket.aliases.number++;
            else bucket.aliases[resolvedVariable.resolvedType.toLowerCase() as "color" | "boolean" | "string"]++;
          }
        }
      }
      if (!variable.description) bucket.missingDescriptions++;
      variableCollectionIds.add(variable.variableCollectionId);
    }
  }

  const variableCollections = await Promise.all(
    [...variableCollectionIds].map(id => figma.variables.getVariableCollectionByIdAsync(id))
  ) as VariableCollection[];

  for (const variableCollection of variableCollections) {
    if (variableCollection) {
      const bucket = getVariableBucket(variableCollection, stats);
      bucket.collections++;
      bucket.modes = bucket.modes + variableCollection.modes.length;
    }
  }
}