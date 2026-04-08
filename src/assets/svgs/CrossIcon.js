import * as React from "react";
import Svg, { Path } from "react-native-svg";
const CrossIcon = ({ fill }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.59 7.1 5.7a1 1 0 1 0-1.4 1.4L10.59 12l-4.9 4.9a1 1 0 1 0 1.4 1.4L12 13.41l4.9 4.9a1 1 0 0 0 1.4-1.4L13.41 12l4.9-4.9a1 1 0 0 0 0-1.4Z"
      fill={fill}
    />
  </Svg>
);
export default CrossIcon;
