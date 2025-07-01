import { formatDate } from '../helpers';
import style from '../style';
import AuditButton from './AuditButton';

const { widget } = figma;
const { AutoLayout, Text } = widget;

interface FooterProps {
  lastAuditKey: number;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setCurrentAuditKey: (currentAuditKey: number) => void;
}

const Footer = ({ lastAuditKey, loading, setLoading, setCurrentAuditKey }: FooterProps) => {
  return (
    <AutoLayout 
      verticalAlignItems='center'
      width={'fill-parent'}
      spacing={'auto'}
      padding={style.spacing.large}>
      <AutoLayout direction='vertical'>
        <Text 
          fontFamily={style.fontFamily}
          fontSize={style.fontSize.shmedium}
          lineHeight={style.lineHeight.shmedium}
          fontWeight={style.fontWeight.bold}
          fill={style.color.black}>
          Last audit
        </Text>
        <Text 
          fontFamily={style.fontFamily}
          fontSize={style.fontSize.shmedium}
          lineHeight={style.lineHeight.shmedium}
          fontWeight={style.fontWeight.normal}
          fill={style.color.black}>
          {formatDate(lastAuditKey)}
        </Text>
      </AutoLayout>
      <AuditButton
        loading={loading}
        setLoading={setLoading}
        setCurrentAuditKey={setCurrentAuditKey} />
    </AutoLayout>
  );
};

export default Footer;