import { Route, Breadcrumb, navigateToBreadcrumb } from "../routes";
import style from "../style";

const { widget } = figma;
const { AutoLayout, Text } = widget;

interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
  setRoute: (route: Route) => void;
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
}

const Breadcrumbs = ({ breadcrumbs, setRoute, setBreadcrumbs }: BreadcrumbsProps) => {

  const handleNavigate = (index: number) => {
    navigateToBreadcrumb(index, breadcrumbs, setRoute, setBreadcrumbs);
  };

  return (
    <AutoLayout 
      direction="horizontal"
      spacing={style.spacing.small}>
      {
        breadcrumbs.map((crumb, i) => (
          <AutoLayout
            key={crumb.label}
            spacing={style.spacing.small}>
            <Text
              onClick={() => handleNavigate(i)}
              fill={style.color.gray}
              fontFamily={style.fontFamily}
              fontSize={style.fontSize.shmedium}
              fontWeight={style.fontWeight.bold}
              lineHeight={style.lineHeight.small}
              hoverStyle={{
                fill: i !== breadcrumbs.length - 1 ? style.color.black : style.color.gray
              }}>
              {crumb.label}
            </Text>
            {
              i !== breadcrumbs.length - 1
              ? <Text 
                  fill={style.color.gray}
                  fontFamily={style.fontFamily}
                  fontSize={style.fontSize.shmedium}
                  fontWeight={style.fontWeight.bold}
                  lineHeight={style.lineHeight.small}>
                  /
                </Text>
              : null
            }
          </AutoLayout>
        ))
      }
    </AutoLayout>
  )
};

export default Breadcrumbs;