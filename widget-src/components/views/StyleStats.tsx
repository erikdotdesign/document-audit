const { widget } = figma;
const { AutoLayout, Text } = widget;

const StyleStats = ({ style, onOriginClick }) => (
  <AutoLayout direction="vertical" spacing={4}>
    <Text>Viewing: {style}</Text>
    <Text onClick={() => onOriginClick("local")}>Local</Text>
    <Text onClick={() => onOriginClick("remote")}>Remote</Text>
  </AutoLayout>
);

export default StyleStats;