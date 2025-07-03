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
	paragraphIndent: number;
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
	offsetY: number;
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
	gutterSize: number;
};

const buildGridStyleProperties = (): GridStyleProps => ({
  sectionSize: 0,
	count: 0,
	offset: 0,
	gutterSize: 0
});

type SharedStyleStats<T, Extras = object> = {
  count: number;
  unboundProperties: T;
  uniquePropertyTokens: T;
  missingDescriptions: number;
} & Extras;

const buildSharedStyleStats = <T, Extras>(
  propertiesConstructor: () => T,
  extrasConstructor: () => Extras
): SharedStyleStats<T, Extras> => ({
  count: 0,
  ...extrasConstructor(),
  unboundProperties: propertiesConstructor(),
  uniquePropertyTokens: propertiesConstructor(),
  missingDescriptions: 0,
});

export type LocalStyleStats<T, Extras> = SharedStyleStats<T, Extras> & {
  unused: number;
};

export const buildLocalStyleStats = <T, Extras>(
  props: () => T,
  extras: () => Extras
): LocalStyleStats<T, Extras> => ({
  ...buildSharedStyleStats(props, extras),
  unused: 0
});

export type RemoteStyleStats<T, Extras> = SharedStyleStats<T, Extras>;

export const buildRemoteStyleStats = <T, Extras>(
  props: () => T,
  extras: () => Extras
): RemoteStyleStats<T, Extras> =>
  buildSharedStyleStats(props, extras);

export type OriginStyleStats<T, Extras> = {
  local: LocalStyleStats<T, Extras>;
  remote: RemoteStyleStats<T, Extras>;
};

export const buildOriginStyleStats = <T, Extras>(
  propertiesConstructor: () => T,
  extrasConstructor: () => Extras
): OriginStyleStats<T, Extras> => ({
  local: buildLocalStyleStats(propertiesConstructor, extrasConstructor),
  remote: buildRemoteStyleStats(propertiesConstructor, extrasConstructor)
});

type SharedComponentStats = {
  count: number;
  sets: number;
  instances: number;
  variants: number;
  missingDescriptions: {
    component: number;
    set: number;
    variant: number;
  };
  overriddenInstances: number;
};

const buildSharedComponentStats = (): SharedComponentStats => ({
  count: 0,
  sets: 0,
  instances: 0,
  variants: 0,
  missingDescriptions: {
    component: 0,
    set: 0,
    variant: 0
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

export const buildFrameStats = (): FrameStats => ({
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

export type LayerStats = {
  count: {
    page: number;
    section: number;
    group: number;
    frame: number;
    component: number;
    componentSet: number;
    componentInstance: number;
    text: number;
    shape: number;
    booleanShape: number;
    vector: number;
    slice: number;
  };
  averageNestingDepth: number;
  maxNestingDepth: number;
  duplicateNames: number;
  unnamedLayers: number;
  hiddenLayers: number;
  lockedLayers: number;
};

export const buildLayerStats = (): LayerStats => ({
  count: {
    page: 0,
    section: 0,
    group: 0,
    frame: 0,
    component: 0,
    componentSet: 0,
    componentInstance: 0,
    text: 0,
    shape: 0,
    booleanShape: 0,
    vector: 0,
    slice: 0
  },
  averageNestingDepth: 0,
  maxNestingDepth: 0,
  duplicateNames: 0,
  unnamedLayers: 0,
  hiddenLayers: 0,
  lockedLayers: 0
})

export type OriginLayerStats = {
  local: LayerStats;
  // remote: FrameStats;
};

export const buildOriginLayerStats = (): OriginLayerStats => ({
  local: buildLayerStats(),
  // remote: buildLayerStats()
});

export type ColorStyleExtras = {
  paints: {
    solid: number;
    gradientLinear: number;
    gradientRadial: number;
    gradientAngular: number;
    gradientDiamond: number;
    pattern: number;
    image: number;
    video: number;
  };
};

const buildColorStyleExtras = (): ColorStyleExtras => ({
  paints: {
    solid: 0,
    gradientLinear: 0,
    gradientRadial: 0,
    gradientAngular: 0,
    gradientDiamond: 0,
    pattern: 0,
    image: 0,
    video: 0
  }
});

export type EffectStyleExtras = {
  effects: {
    dropShadow: number;
    innerShadow: number;
    layerBlur: number;
    backgroundBlur: number;
    noise: number;
    texture: number;
  };
};

const buildEffectStyleExtras = (): EffectStyleExtras => ({
  effects: {
    dropShadow: 0,
    innerShadow: 0,
    layerBlur: 0,
    backgroundBlur: 0,
    noise: 0,
    texture: 0
  }
});

export type GridStyleExtras = {
  grids: {
    grid: number;
    columns: number;
    rows: number;
  };
};

const buildGridStyleExtras = (): GridStyleExtras => ({
  grids: {
    grid: 0,
    columns: 0,
    rows: 0
  }
});

export type AuditStats = {
  layers: OriginLayerStats;
  variables: OriginVariableStats;
  colorStyles: OriginStyleStats<ColorStyleProps, ColorStyleExtras>;
  textStyles: OriginStyleStats<TextStyleProps, null>;
  effectStyles: OriginStyleStats<EffectStyleProps, EffectStyleExtras>;
  gridStyles: OriginStyleStats<GridStyleProps, GridStyleExtras>;
  frames: OriginFrameStats;
  components: OriginComponentStats;
};

export const buildAuditStats = (): AuditStats => ({
  layers: buildOriginLayerStats(),
  variables: buildOriginVariableStats(),
  colorStyles: buildOriginStyleStats<ColorStyleProps, ColorStyleExtras>(buildColorStyleProperties, buildColorStyleExtras),
  textStyles: buildOriginStyleStats(buildTextStyleProperties, () => null),
  effectStyles: buildOriginStyleStats<EffectStyleProps, EffectStyleExtras>(buildEffectStyleProperties, buildEffectStyleExtras),
  gridStyles: buildOriginStyleStats<GridStyleProps, GridStyleExtras>(buildGridStyleProperties, buildGridStyleExtras),
  frames: buildOriginFrameStats(),
  components: buildOriginComponentStats()
});