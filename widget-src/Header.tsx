import style from './style';

const { widget } = figma;
const { AutoLayout, Text, Span } = widget;

interface HeaderProps {
  route: string;
  setRoute: (route: string) => void;
}

const Header = ({ route, setRoute }: HeaderProps) => {

  const handleClick = () => {
    setRoute('');
  }
  
  return (
    <AutoLayout 
      width={'fill-parent'}
      padding={style.spacing.large}>
      {
        route
        ? <Text
            fontFamily={style.fontFamily}
            fontSize={style.fontSize.medium}
            lineHeight={style.lineHeight.medium}
            fontWeight={style.fontWeight.bold}
            fill={style.color.gray}
            onClick={handleClick}
            hoverStyle={{
              fill: style.color.black
            }}>
            ←
          </Text>
        : null
      }
      <Text 
        fontFamily={style.fontFamily}
        fontSize={style.fontSize.medium}
        lineHeight={style.lineHeight.medium}
        fontWeight={style.fontWeight.bold}>
        <Span fill={route ? style.color.gray : style.color.black}>
          {`${route ? ' ' : ''}Document Audit ${route ? '/' : ''} `}
        </Span>
        {
          route
          ? <Span fill={style.color.black}>
              {route.charAt(0).toUpperCase() + route.slice(1)}
            </Span>
          : null
        }
      </Text>
    </AutoLayout>
  );
};

export default Header;