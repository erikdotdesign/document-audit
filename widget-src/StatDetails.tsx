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
        left: style.spacing.large,
        right: style.spacing.large
      }}>
      {
        Object.keys(stats[route]).map((key, index) => (
          <AutoLayout 
            key={key}
            width={'fill-parent'}
            spacing={'auto'}
            padding={style.spacing.medium}
            fill={index % 2 ? style.color.white : style.color.lightGray}
            cornerRadius={style.cornerRadius}>
            <Text
              fontFamily={style.fontFamily}
              fontSize={style.fontSize.shmedium}
              lineHeight={style.lineHeight.shmedium}
              fontWeight={style.fontWeight.bold}>
              { formatKey(key) }
            </Text>
            <Text
              fontFamily={style.fontFamily}
              fontSize={style.fontSize.shmedium}
              lineHeight={style.lineHeight.shmedium}
              fontWeight={style.fontWeight.bold}>
              { `${stats[route][key]}` }
            </Text>
          </AutoLayout>
        ))
      }
    </AutoLayout>
  );
};

export default StatDetails;