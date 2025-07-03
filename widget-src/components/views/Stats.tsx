import { RouteStatType, RouteOriginStatType, navigate, Route, Breadcrumb } from '../../routes';
import style from "../../style";
import { typedKeys, camelCaseToTitleCase, camelCaseToSentence } from "../../helpers";
import { AuditStats } from "../../audit/buildStats";
import Stat from './Stat';

const { widget } = figma;
const { AutoLayout, Text } = widget;

interface StatsProps {
  stats: AuditStats;
  routeStat: RouteStatType;
  routeOriginStat: RouteOriginStatType;
  setRoute: (route: Route) => void;
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
}

const Stats = ({ stats, routeStat, routeOriginStat, setRoute, setBreadcrumbs }: StatsProps) => {

  const handleNavigate = (originStat: RouteOriginStatType) => {
    navigate(
      { type: "originStat", stat: routeStat, origin: routeOriginStat }, 
      `${camelCaseToTitleCase(originStat)} ${camelCaseToTitleCase(routeStat)}`, 
      setRoute, setBreadcrumbs
    );
  };

  const remoteBg = Object.keys(stats[routeStat][routeOriginStat]).length % 2 === 0;
  
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
        typedKeys(stats[routeStat][routeOriginStat]).map((key, index) => (
          <Stat
            key={key}
            statKey={key}
            keyValue={stats[routeStat][routeOriginStat][key]}
            bg={index % 2 === 0} />
        ))
      }
      {
        routeOriginStat === "local" && stats[routeStat].remote
        ? <AutoLayout 
            width={'fill-parent'}
            spacing={'auto'}
            padding={{
              vertical: style.padding.shmedium,
              horizontal: style.padding.medium
            }}
            fill={remoteBg ? style.color.z1 : style.color.white}
            hoverStyle={{
              stroke: style.color.black,
            }}
            strokeWidth={2}
            cornerRadius={style.cornerRadius}
            onClick={() => handleNavigate("remote")}>
            <Text
              fontFamily={style.fontFamily}
              fontSize={style.fontSize.shmedium}
              lineHeight={style.lineHeight.shmedium}
              fontWeight={style.fontWeight.bold}>
              { camelCaseToSentence("remote") }
            </Text>
            <Text
              fontFamily={style.fontFamily}
              fontSize={style.fontSize.shmedium}
              lineHeight={style.lineHeight.shmedium}
              fontWeight={style.fontWeight.bold}>
              →
            </Text>
          </AutoLayout>
        : null
      }
    </AutoLayout>
  );
};

export default Stats;