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
      padding={32}>
      {
        route
        ? <Text
            fontFamily={'Inter'}
            fontSize={32}
            lineHeight={40}
            fontWeight={800}
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
        fontFamily={'Inter'}
        fontSize={32}
        lineHeight={40}
        fontWeight={800}>
        {
          route
          ? ' '
          : null
        }
        <Span fill={route ? style.color.gray : style.color.black}>
          {`Document Audit ${route ? '/' : ''} `}
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