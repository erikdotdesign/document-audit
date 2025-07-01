import { Route, Breadcrumb, goBack } from '../routes';
import style from "../style";

const { widget } = figma;
const { Text } = widget;

interface HeaderProps {
  breadcrumbs: Breadcrumb[];
  setRoute: (route: Route) => void;
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
}

const BackButton = ({ breadcrumbs, setRoute, setBreadcrumbs }: HeaderProps) => {

  const handleGoBack = () => {
    goBack(setRoute, setBreadcrumbs);
  };
      
  return (
    breadcrumbs.length - 1 !== 0
    ? <Text
        fontFamily={style.fontFamily}
        fontSize={style.fontSize.large}
        lineHeight={style.lineHeight.large}
        fontWeight={style.fontWeight.bold}
        fill={style.color.gray}
        onClick={handleGoBack}
        hoverStyle={{
          fill: style.color.black
        }}>
        ←
      </Text>
    : null
  );
}

export default BackButton;