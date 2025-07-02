import { Route, Breadcrumb, StyleOriginRouteType, StyleRouteType, navigate } from '../../routes';
import style from "../../style";
import { camelCaseToTitleCase, camelCaseToSentence, typedKeys, formatNumber } from "../../helpers";
import { AuditStyleStats } from "../../audit/buildStats";
import PieChart from '../PieChart';

const { widget } = figma;
const { AutoLayout, Text } = widget;

interface StyleStatsProps {
  routeStyle: StyleRouteType;
  stats: AuditStyleStats;
  setRoute: (route: Route) => void;
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
};

const StyleStats = ({ routeStyle, stats, setRoute, setBreadcrumbs }: StyleStatsProps) => {

  const handleNavigate = (origin: StyleOriginRouteType) => {
    navigate(
      { type: "styleOrigin", style: routeStyle, origin }, 
      `${camelCaseToTitleCase(origin)} ${camelCaseToTitleCase(routeStyle)}`, 
      setRoute, setBreadcrumbs
    );
  };

  return (
    <AutoLayout
      direction="vertical"
      width="fill-parent"
      height="fill-parent"
      padding={{
        left: style.padding.medium,
        right: style.padding.medium
      }}
      spacing={style.spacing.medium}>
      {/* <PieChart
        stats={stats}
        routeStyle={routeStyle} /> */}
      <AutoLayout
        direction="vertical"
        width="fill-parent">
        {
          typedKeys(stats[routeStyle]).map((key) => (
            <AutoLayout 
              key={key}
              width={'fill-parent'}
              spacing={'auto'}
              padding={{
                vertical: style.padding.shmedium,
                horizontal: style.padding.medium
              }}
              fill={style.color.white}
              hoverStyle={{
                fill: style.color.z1
              }}
              cornerRadius={style.cornerRadius}
              onClick={() => handleNavigate(key)}>
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
                { formatNumber(stats[routeStyle][key].count) } →
              </Text>
            </AutoLayout>
          ))
        }
      </AutoLayout>
    </AutoLayout>
  );
};

export default StyleStats;