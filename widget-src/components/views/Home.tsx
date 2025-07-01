const { widget } = figma;
const { AutoLayout, Text } = widget;

const Home = ({ onStyleClick }) => (
  <AutoLayout direction="vertical" spacing={4}>
    {['colorStyles', 'textStyles', 'effectStyles', 'gridStyles'].map(style => (
      <Text key={style} onClick={() => onStyleClick(style)}>{style}</Text>
    ))}
  </AutoLayout>
);

export default Home;