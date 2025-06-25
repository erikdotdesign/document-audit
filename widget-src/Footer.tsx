import style from './style';
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
      width={'fill-parent'}
      spacing={'auto'}
      padding={32}>
      <AutoLayout direction='vertical'>
        <Text 
          fontFamily={'Inter'}
          fontSize={16}
          lineHeight={24}
          fontWeight={800}
          fill={style.color.black}>
          Last audit
        </Text>
        <Text 
          fontFamily={'Inter'}
          fontSize={16}
          lineHeight={24}
          fontWeight={500}
          fill={style.color.black}>
          {new Date(lastAuditKey).toLocaleString()}
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