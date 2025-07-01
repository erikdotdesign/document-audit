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

export type AuditStats = {
  variables: AuditVariableStats;
};

const createVariableStats = (): VariableStats => ({
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
});

export const auditVariableStats: AuditVariableStats = {
  localVariables: createVariableStats(),
  remoteVariables: createVariableStats()
};