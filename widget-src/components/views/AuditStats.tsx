import { RouteStatType, RouteOriginStatType, navigate } from '../../routes';
import style from "../../style";
import { typedKeys, camelCaseToTitleCase, camelCaseToSentence } from "../../helpers";
import { AuditStyleStats } from "../../audit/buildStats";
import AuditStat from './AuditStat';

const { widget } = figma;
const { AutoLayout, Text } = widget;

interface AuditStatsProps {
  stats: AuditStyleStats;
  routeStat: RouteStatType;
  routeOriginStat: RouteOriginStatType;
  setRoute: (route: Route) => void;
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
}

const AuditStats = ({ stats, routeStat, routeOriginStat, setRoute, setBreadcrumbs }: AuditStatsProps) => {

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
          <AuditStat
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

export default AuditStats;