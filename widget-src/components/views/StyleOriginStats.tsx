import { StyleOriginRouteType, StyleRouteType } from '../../routes';
import style from "../../style";
import { camelCaseToSentence, typedKeys, tallyObjectValues, formatNumber } from "../../helpers";
import { AuditStyleStats } from "../../audit/buildStats";

const { widget } = figma;
const { AutoLayout, Text } = widget;

interface StyleOriginStatsProps {
  stats: AuditStyleStats;
  routeStyle: StyleRouteType;
  routeOrigin: StyleOriginRouteType;
}

const StyleOriginStats = ({ stats, routeStyle, routeOrigin }: StyleOriginStatsProps) => {
  return (
    <AutoLayout
      direction="vertical"
      width="fill-parent"
      height="fill-parent"
      padding={{
        left: style.padding.medium,
        right: style.padding.medium
      }}>
      {
        typedKeys(stats[routeStyle][routeOrigin]).map((key, index) => (
          <AutoLayout
            key={key}
            width="fill-parent"
            direction="vertical"
            padding={{
              vertical: style.padding.shmedium,
              horizontal: style.padding.medium
            }}
            spacing={{
              vertical: style.spacing.shmedium
            }}
            fill={index % 2 ? style.color.white : style.color.z1}
            cornerRadius={style.cornerRadius}>
            <AutoLayout
              width="fill-parent"
              spacing="auto">
              <Text
                fontFamily={style.fontFamily}
                fontSize={style.fontSize.shmedium}
                lineHeight={style.lineHeight.shmedium}
                fontWeight={style.fontWeight.bold}>
                { camelCaseToSentence(key) }
              </Text>
              <Text
                fontFamily={style.fontFamily}
                fontSize={style.fontSize.shmedium}
                lineHeight={style.lineHeight.shmedium}
                fontWeight={style.fontWeight.bold}>
                { 
                  typeof stats[routeStyle][routeOrigin][key] === 'object'
                  ? formatNumber(tallyObjectValues(stats[routeStyle][routeOrigin][key]))
                  : formatNumber(stats[routeStyle][routeOrigin][key])
                }
              </Text>
            </AutoLayout>
            {
              typeof stats[routeStyle][routeOrigin][key] === 'object'
              ? <AutoLayout
                  direction="vertical"
                  width="fill-parent">
                  {
                    typedKeys(stats[routeStyle][routeOrigin][key]).map((kk) => (
                      <AutoLayout
                        key={kk}
                        direction="vertical"
                        width="fill-parent">
                        <AutoLayout
                          width="fill-parent"
                          height={1}
                          fill={index % 2 ? style.color.z2 : style.color.z3} />
                        <AutoLayout
                          width="fill-parent"
                          spacing="auto"
                          padding={{
                            left: style.padding.medium
                          }}
                          cornerRadius={style.cornerRadius}>
                          <Text
                            fontFamily={style.fontFamily}
                            fontSize={style.fontSize.small}
                            lineHeight={style.lineHeight.shmedium}
                            fontWeight={style.fontWeight.bold}
                            fill={style.color.gray}>
                            { camelCaseToSentence(kk) }
                          </Text>
                          <Text
                            fontFamily={style.fontFamily}
                            fontSize={style.fontSize.small}
                            lineHeight={style.lineHeight.shmedium}
                            fontWeight={style.fontWeight.bold}
                            fill={style.color.gray}>
                            { formatNumber(stats[routeStyle][routeOrigin][key][kk]) }
                          </Text>
                        </AutoLayout>
                      </AutoLayout>
                    ))
                  }
                </AutoLayout>
              : null
            }
          </AutoLayout>
        ))
      }
    </AutoLayout>
  );
};

export default StyleOriginStats;