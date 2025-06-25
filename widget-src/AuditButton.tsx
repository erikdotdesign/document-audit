import style from './style';

const { widget } = figma;
const { AutoLayout, Text } = widget;

interface AuditButtonProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setCurrentAuditKey: (currentAuditKey: number) => void;
}

const AuditButton = ({ loading, setLoading, setCurrentAuditKey }: AuditButtonProps) => {

  const handleClick = () => {
    if (!loading) {
      setLoading(true);
      setCurrentAuditKey(Date.now());
    }
  }

  return (
    <AutoLayout
      verticalAlignItems={'center'}
      horizontalAlignItems={'center'}
      padding={12}
      cornerRadius={8}
      fill={style.color.white}
      stroke={style.color.black}
      strokeWidth={1}
      hoverStyle={{
        fill: style.color.lightGray
      }}
      onClick={handleClick}>
      <Text 
        fontFamily={'Inter'}
        fontSize={16}
        lineHeight={24}
        fontWeight={800}
        fill={style.color.black}>
        Run audit
      </Text>
    </AutoLayout>
  );
};

export default AuditButton;