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

export type BaseStyleStats<T> = {
  count: number;
  missingDescription: number;
  unboundProperties: T;
  uniquePropertyTokens: T;
};

export const buildBaseStyleStats = <T>(propertiesConstructor: () => T): BaseStyleStats<T> => ({
  count: 0,
  missingDescription: 0,
  unboundProperties: propertiesConstructor(),
  uniquePropertyTokens: propertiesConstructor()
});

export type OriginStyleStats<T> = {
  local: BaseStyleStats<T>;
  remote: BaseStyleStats<T>;
};

export const buildOriginStyleStats = <T>(propertiesConstructor: () => T): OriginStyleStats<T> => ({
  local: buildBaseStyleStats(propertiesConstructor),
  remote: buildBaseStyleStats(propertiesConstructor)
});

export type AuditStyleStats = {
  colorStyles: OriginStyleStats<ColorStyleProps>;
  textStyles: OriginStyleStats<TextStyleProps>;
  effectStyles: OriginStyleStats<EffectStyleProps>;
  gridStyles: OriginStyleStats<GridStyleProps>;
};

export const buildAuditStyleStats = (): AuditStyleStats => ({
  colorStyles: buildOriginStyleStats(buildColorStyleProperties),
  textStyles: buildOriginStyleStats(buildTextStyleProperties),
  effectStyles: buildOriginStyleStats(buildEffectStyleProperties),
  gridStyles: buildOriginStyleStats(buildGridStyleProperties)
});