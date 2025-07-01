import style from '../style';
import { formatNumber } from './StatDetails';

const { widget } = figma;
const { AutoLayout, Text, Span } = widget;

interface DisplayStatProps {
  highlight: string | number | undefined;
  label: string;
  route: string;
  setRoute: (route: string) => void;
}

const DisplayStat = ({ highlight = 0, label, route, setRoute }: DisplayStatProps) => {

  const handleClick = () => {
    setRoute(route);
  }

  return (
    <AutoLayout
      width={'fill-parent'}
      height={'fill-parent'}
      verticalAlignItems={'center'}
      fill={style.color.white}
      padding={{
        left: style.spacing.large,
        right: style.spacing.large
      }}
      hoverStyle={{
        fill: style.color.lightGray
      }}
      onClick={handleClick}>
      <Text 
        fontFamily={style.fontFamily}
        fontSize={style.fontSize.large}
        fontWeight={style.fontWeight.bold}>
        <Span 
          fill={style.color.black}
          fontWeight={style.fontWeight.black}>
          {formatNumber(highlight)}
        </Span>
          {` `}
        <Span fill={style.color.gray}>
          {`${label} →`}
        </Span>
      </Text>
    </AutoLayout>
  );
};

export default DisplayStat;