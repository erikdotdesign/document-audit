import { Route, Breadcrumb, StyleOriginRouteType, StyleRouteType, navigate } from '../routes';
import style from "../style";
import { hexToRGBA } from "../helpers";
import { AuditStyleStats } from "../audit/buildStats";

const { widget } = figma;
const { AutoLayout, Text, Ellipse } = widget;

interface PieChartProps {
  routeStyle: StyleRouteType;
  stats: AuditStyleStats;
};

const PieChart = ({ routeStyle, stats }: PieChartProps) => {

  const totalStyles = stats[routeStyle].local.count + stats[routeStyle].remote.count;
  const localPercent = stats[routeStyle].local.count / totalStyles;
  const remotePercent = stats[routeStyle].remote.count / totalStyles;
  const blue = hexToRGBA(style.color.blue);
  const darkBlue = hexToRGBA(style.color.darkBlue);

  return (
    <AutoLayout
      width="fill-parent"
      padding={64}
      fill={style.color.z1}>
      <AutoLayout
        direction="horizontal"
        width="fill-parent"
        height="fill-parent"
        verticalAlignItems="center"
        horizontalAlignItems="center"
        spacing={style.spacing.large}>
        <Ellipse
          width={232}
          height={232}
          fill={{
            type: "gradient-angular",
            gradientHandlePositions: [
              { x: 0.5, y: 0.5 },
              { x: 1, y: 0.5 },
              { x: 0.5, y: 1 }
            ],
            gradientStops: [
              { position: 0, color: blue },
              { position: localPercent, color: blue },
              { position: localPercent, color: darkBlue },
              { position: 1, color: darkBlue }
            ]
          }} />
        <AutoLayout
          direction="vertical"
          spacing={style.spacing.shmedium}>
          <AutoLayout
            direction="horizontal"
            spacing={style.spacing.shmedium}
            verticalAlignItems="center">
            <Ellipse
              fill={blue}
              width={32}
              height={32} />
            <AutoLayout
              direction="vertical">
              <Text
                fontFamily={style.fontFamily}
                fontSize={style.fontSize.shmedium}
                lineHeight={style.lineHeight.shmedium}
                fontWeight={style.fontWeight.bold}
                fill={style.color.black}>
                Local
              </Text>
              <Text
                fontFamily={style.fontFamily}
                fontSize={style.fontSize.shmedium}
                lineHeight={style.lineHeight.shmedium}
                fontWeight={style.fontWeight.bold}
                fill={style.color.gray}>
                {`${localPercent * 100}%`}
              </Text>
            </AutoLayout>
          </AutoLayout>
          <AutoLayout
            direction="horizontal"
            spacing={style.spacing.shmedium}
            verticalAlignItems="center">
            <Ellipse
              fill={darkBlue}
              width={32}
              height={32} />
            <AutoLayout
              direction="vertical">
              <Text
                fontFamily={style.fontFamily}
                fontSize={style.fontSize.shmedium}
                lineHeight={style.lineHeight.shmedium}
                fontWeight={style.fontWeight.bold}
                fill={style.color.black}>
                Remote
              </Text>
              <Text
                fontFamily={style.fontFamily}
                fontSize={style.fontSize.shmedium}
                lineHeight={style.lineHeight.shmedium}
                fontWeight={style.fontWeight.bold}
                fill={style.color.gray}>
                {`${remotePercent * 100}%`}
              </Text>
            </AutoLayout>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
};

export default PieChart;