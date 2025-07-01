const { widget } = figma;
const { AutoLayout, Text } = widget;

const StyleOriginStats = ({ style, origin }) => (
  <AutoLayout direction="vertical" spacing={4}>
    <Text>{origin} stats for {style}</Text>
    {/* Render audit data here */}
  </AutoLayout>
);

export default StyleOriginStats;