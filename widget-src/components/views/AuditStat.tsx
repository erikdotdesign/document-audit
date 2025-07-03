import style from "../../style";
import { camelCaseToSentence, typedKeys, formatNumber, tallyValue } from "../../helpers";

const { widget } = figma;
const { AutoLayout, Text } = widget;

interface AuditStatProps {
  statKey: string;
  keyValue: "object" | number;
  bg: boolean;
}

const AuditStat = ({ statKey, keyValue, bg }: AuditStatProps) => {
  return (
    <AutoLayout
      width="fill-parent"
      direction="vertical"
      padding={{
        vertical: style.padding.shmedium,
        horizontal: style.padding.medium
      }}
      spacing={{
        vertical: style.spacing.shmedium
      }}
      fill={bg ? style.color.z1 : style.color.white}
      cornerRadius={style.cornerRadius}>
      <AutoLayout
        width="fill-parent"
        spacing="auto">
        <Text
          fontFamily={style.fontFamily}
          fontSize={style.fontSize.shmedium}
          lineHeight={style.lineHeight.shmedium}
          fontWeight={style.fontWeight.bold}>
          { camelCaseToSentence(statKey) }
        </Text>
        <Text
          fontFamily={style.fontFamily}
          fontSize={style.fontSize.shmedium}
          lineHeight={style.lineHeight.shmedium}
          fontWeight={style.fontWeight.bold}>
          { formatNumber(tallyValue(keyValue)) }
        </Text>
      </AutoLayout>
      {
        typeof keyValue === "object"
        ? <AutoLayout
            direction="vertical"
            width="fill-parent">
            {
              typedKeys(keyValue).map((kk) => (
                <AutoLayout
                  key={kk}
                  direction="vertical"
                  width="fill-parent">
                  <AutoLayout
                    width="fill-parent"
                    height={1}
                    fill={bg ? style.color.z3 : style.color.z2} />
                  <AutoLayout
                    width="fill-parent"
                    spacing="auto"
                    padding={{
                      left: style.padding.medium
                    }}
                    cornerRadius={style.cornerRadius}>
                    <Text
                      fontFamily={style.fontFamily}
                      fontSize={style.fontSize.small}
                      lineHeight={style.lineHeight.shmedium}
                      fontWeight={style.fontWeight.bold}
                      fill={style.color.gray}>
                      { camelCaseToSentence(kk) }
                    </Text>
                    <Text
                      fontFamily={style.fontFamily}
                      fontSize={style.fontSize.small}
                      lineHeight={style.lineHeight.shmedium}
                      fontWeight={style.fontWeight.bold}
                      fill={style.color.gray}>
                      { formatNumber(tallyValue(keyValue[kk])) }
                    </Text>
                  </AutoLayout>
                </AutoLayout>
              ))
            }
          </AutoLayout>
        : null
      }
    </AutoLayout>
  );
};

export default AuditStat;