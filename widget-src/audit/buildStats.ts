export type ColorStyleProps = {
  color: number;
  colorStop: number;
};

const buildColorStyleProperties = (): ColorStyleProps => ({
  color: 0,
  colorStop: 0
});

export type TextStyleProps = {
  fontFamily: number;
	fontSize: number;
	fontStyle: number;
	letterSpacing: number;
	lineHeight: number;
	paragraphSpacing: number;
	paragraphIndent:number;
};

const buildTextStyleProperties = (): TextStyleProps => ({
  fontFamily: 0,
	fontSize: 0,
	fontStyle: 0,
	letterSpacing: 0,
	lineHeight: 0,
	paragraphSpacing: 0,
	paragraphIndent: 0
});

export type EffectStyleProps = {
  radius: number;
	color: number;
	spread: number;
	offsetX: number;
	offsetY:number;
};

const buildEffectStyleProperties = (): EffectStyleProps => ({
  radius: 0,
	color: 0,
	spread: 0,
	offsetX: 0,
	offsetY: 0
});

export type GridStyleProps = {
  sectionSize: number;
	count: number;
	offset: number;
	gutterSize:number;
};

const buildGridStyleProperties = (): GridStyleProps => ({
  sectionSize: 0,
	count: 0,
	offset: 0,
	gutterSize: 0
});

type SharedStyleStats<T> = {
  count: number;
  unboundProperties: T;
  uniquePropertyTokens: T;
  missingDescriptions: number;
};

const buildSharedStyleStats = <T>(propertiesConstructor: () => T): SharedStyleStats<T> => ({
  count: 0,
  unboundProperties: propertiesConstructor(),
  uniquePropertyTokens: propertiesConstructor(),
  missingDescriptions: 0,
});

export type LocalStyleStats<T> = SharedStyleStats<T> & {
  unused: number;
};

export const buildLocalStyleStats = <T>(props: () => T): LocalStyleStats<T> => ({
  ...buildSharedStyleStats(props),
  unused: 0
});

export type RemoteStyleStats<T> = SharedStyleStats<T>;

export const buildRemoteStyleStats = <T>(props: () => T): RemoteStyleStats<T> =>
  buildSharedStyleStats(props);

export type OriginStyleStats<T> = {
  local: LocalStyleStats<T>;
  remote: RemoteStyleStats<T>;
};

export const buildOriginStyleStats = <T>(propertiesConstructor: () => T): OriginStyleStats<T> => ({
  local: buildLocalStyleStats(propertiesConstructor),
  remote: buildRemoteStyleStats(propertiesConstructor)
});

type SharedComponentStats = {
  count: number;
  sets: number;
  instances: number;
  variants: number;
  missingDescriptions: {
    components: number;
    sets: number;
    variants: number;
  };
  overriddenInstances: number;
};

const buildSharedComponentStats = (): SharedComponentStats => ({
  count: 0,
  sets: 0,
  instances: 0,
  variants: 0,
  missingDescriptions: {
    components: 0,
    sets: 0,
    variants: 0
  },
  overriddenInstances: 0
});

export type LocalComponentStats = SharedComponentStats & {
  unused: number;
};

export const buildLocalComponentStats = (): LocalComponentStats => ({
  ...buildSharedComponentStats(),
  unused: 0
});

export type RemoteComponentStats = SharedComponentStats;

export const buildRemoteComponentStats = (): RemoteComponentStats =>
  buildSharedComponentStats();

export type OriginComponentStats = {
  local: LocalComponentStats;
  remote: RemoteComponentStats;
};

export const buildOriginComponentStats = (): OriginComponentStats => ({
  local: buildLocalComponentStats(),
  remote: buildRemoteComponentStats()
});

type SharedVariableStats = {
  count: {
    color: number;
    number: number;
    string: number;
    boolean: number;
  };
  aliases: {
    color: number;
    number: number;
    string: number;
    boolean: number;
  },
  collections: number;
  modes: number;
  missingDescriptions: number;
};

const buildSharedVariableStats = (): SharedVariableStats => ({
  count: {
    color: 0,
    number: 0,
    string: 0,
    boolean: 0
  },
  aliases: {
    color: 0,
    number: 0,
    string: 0,
    boolean: 0
  },
  collections: 0,
  modes: 0,
  missingDescriptions: 0
});

export type LocalVariableStats = SharedVariableStats & {
  unused: number;
};

export const buildLocalVariableStats = (): LocalVariableStats => ({
  ...buildSharedVariableStats(),
  unused: 0
});

export type RemoteVariableStats = SharedVariableStats;

export const buildRemoteVariableStats = (): RemoteVariableStats =>
  buildSharedVariableStats();

export type OriginVariableStats = {
  local: LocalVariableStats;
  remote: RemoteVariableStats;
};

export const buildOriginVariableStats = (): OriginVariableStats => ({
  local: buildLocalVariableStats(),
  remote: buildRemoteVariableStats()
});

export type FrameStats = {
  count: number;
  freeFormLayouts: number;
  autoLayouts: {
    vertical: number;
    horizontal: number;
  };
  fixedDimensions: {
    width: number;
    height: number;
  };
  unboundProperties: {
    padding: number;
    spacing: number;
    strokeWeight: number;
    cornerRadius: number;
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
  };
  uniquePropertyTokens: {
    padding: number;
    spacing: number;
    strokeWeight: number;
    cornerRadius: number;
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
  };
};

export const buildFrameStats = () => ({
  count: 0,
  freeFormLayouts: 0,
  autoLayouts: {
    vertical: 0,
    horizontal: 0,
  },
  fixedDimensions: {
    width: 0,
    height: 0,
  },
  unboundProperties: {
    padding: 0,
    spacing: 0,
    strokeWeight: 0,
    cornerRadius: 0,
    minWidth: 0,
    minHeight: 0,
    maxWidth: 0,
    maxHeight: 0,
  },
  uniquePropertyTokens: {
    padding: 0,
    spacing: 0,
    strokeWeight: 0,
    cornerRadius: 0,
    minWidth: 0,
    minHeight: 0,
    maxWidth: 0,
    maxHeight: 0
  }
});

export type OriginFrameStats = {
  local: FrameStats;
  // remote: FrameStats;
};

export const buildOriginFrameStats = (): OriginFrameStats => ({
  local: buildFrameStats(),
  // remote: buildFrameStats()
});

export type AuditStyleStats = {
  variables: OriginVariableStats;
  colorStyles: OriginStyleStats<ColorStyleProps>;
  textStyles: OriginStyleStats<TextStyleProps>;
  effectStyles: OriginStyleStats<EffectStyleProps>;
  gridStyles: OriginStyleStats<GridStyleProps>;
  frames: OriginFrameStats;
  components: OriginComponentStats;
};

export const buildAuditStyleStats = (): AuditStyleStats => ({
  variables: buildOriginVariableStats(),
  colorStyles: buildOriginStyleStats(buildColorStyleProperties),
  textStyles: buildOriginStyleStats(buildTextStyleProperties),
  effectStyles: buildOriginStyleStats(buildEffectStyleProperties),
  gridStyles: buildOriginStyleStats(buildGridStyleProperties),
  frames: buildOriginFrameStats(),
  components: buildOriginComponentStats()
});