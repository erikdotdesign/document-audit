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

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;

    return `${month}/${day}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
  }

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