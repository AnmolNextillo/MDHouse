import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";
const DatePickerIcon = (props) => (
  <Svg
    width="800px"
    height="800px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M20 10V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V10M20 10V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V10M20 10H4M8 3V7M16 3V7"
      stroke="#000000"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Rect x={6} y={12} width={3} height={3} rx={0.5} fill="#000000" />
    <Rect x={10.5} y={12} width={3} height={3} rx={0.5} fill="#000000" />
    <Rect x={15} y={12} width={3} height={3} rx={0.5} fill="#000000" />
  </Svg>
);
export default DatePickerIcon;
