import { Route, Breadcrumb, RouteStatType, navigate } from '../../routes';
import style from "../../style";
import { formatNumber, camelCaseToTitleCase, camelCaseToSentenceLower, typedKeys, tallyValue } from "../../helpers";
import { AuditStats } from "../../audit/buildStats";

const { widget } = figma;
const { AutoLayout, Text, Span } = widget;

interface HomeProps {
  stats: AuditStats;
  setRoute: (route: Route) => void;
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
}

const Home = ({ stats, setRoute, setBreadcrumbs }: HomeProps) => {

  const handleNavigate = (routeStat: RouteStatType) => {
    navigate({ type: "stat", stat: routeStat }, camelCaseToTitleCase(routeStat), setRoute, setBreadcrumbs);
  };

  const getHighlightCount = (routeStat: RouteStatType) => {
    const localValues = stats[routeStat].local ? tallyValue(stats[routeStat].local.count) : 0;
    const remoteValues = stats[routeStat].remote ? tallyValue(stats[routeStat].remote.count) : 0;
    return formatNumber(localValues + remoteValues);
  };

  return (
    <AutoLayout
      direction="vertical"
      height={"fill-parent"}
      width={"fill-parent"}>
      {
        typedKeys(stats).map((key) => (
          <AutoLayout
            key={key}
            width={'fill-parent'}
            height={'fill-parent'}
            verticalAlignItems={'center'}
            fill={style.color.white}
            padding={{
              left: style.spacing.large,
              right: style.spacing.large
            }}
            hoverStyle={{
              fill: style.color.z1
            }}
            onClick={() => handleNavigate(key)}>
            <Text 
              fontFamily={style.fontFamily}
              fontSize={style.fontSize.display}
              fontWeight={style.fontWeight.bold}>
              <Span 
                fill={style.color.black}
                fontWeight={style.fontWeight.black}>
                {getHighlightCount(key)}
              </Span>
                {` `}
              <Span fill={style.color.gray}>
                {`${camelCaseToSentenceLower(key)} →`}
              </Span>
            </Text>
          </AutoLayout>
        ))
      }
    </AutoLayout>
  );
};

export default Home;