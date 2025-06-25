import style from './style';
import { AuditStats } from './code';

const { widget } = figma;
const { AutoLayout, Text } = widget;

interface StatDetailsProps {
  stats: AuditStats;
  route: string;
}

const StatDetails = ({ stats, route }: StatDetailsProps) => {

  const formatKey = (key) => {
    const result = key.replace(/([a-z])([A-Z])/g, '$1 $2');
    return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
  }

  return (
    <AutoLayout
      direction={'vertical'}
      width={'fill-parent'}
      height={'fill-parent'}
      padding={{
        left: 32,
        right: 32
      }}>
      {
        Object.keys(stats[route]).map((key, index) => (
          <AutoLayout 
            key={key}
            width={'fill-parent'}
            spacing={'auto'}
            padding={16}
            fill={index % 2 ? style.color.white : style.color.lightGray}
            cornerRadius={8}>
            <Text
              fontFamily={'Inter'}
              fontSize={24}
              lineHeight={32}
              fontWeight={800}>
              { formatKey(key) }
            </Text>
            <Text
              fontFamily={'Inter'}
              fontSize={24}
              lineHeight={32}
              fontWeight={800}>
              { `${stats[route][key]}` }
            </Text>
          </AutoLayout>
        ))
      }
    </AutoLayout>
  );
};

export default StatDetails;