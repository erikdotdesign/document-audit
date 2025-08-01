import style from '../style';

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
      padding={style.spacing.shmedium}
      cornerRadius={style.cornerRadius}
      fill={style.color.white}
      stroke={style.color.black}
      strokeWidth={2}
      hoverStyle={{
        fill: style.color.lightGray
      }}
      onClick={handleClick}>
      <Text 
        fontFamily={style.fontFamily}
        fontSize={style.fontSize.small}
        lineHeight={style.lineHeight.small}
        fontWeight={style.fontWeight.bold}
        fill={style.color.black}>
        Run audit
      </Text>
    </AutoLayout>
  );
};

export default AuditButton;