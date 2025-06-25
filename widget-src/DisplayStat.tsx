import style from './style';

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
      fill={style.color.white}
      padding={{
        left: 32,
        right: 32
      }}
      hoverStyle={{
        fill: style.color.lightGray
      }}
      onClick={handleClick}>
      <Text 
        fontFamily={'Inter'}
        fontSize={56}
        lineHeight={128}
        fontWeight={800}>
        <Span fill={style.color.black}>
          {highlight}
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