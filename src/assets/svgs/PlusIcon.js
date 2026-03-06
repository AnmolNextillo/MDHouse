import * as React from "react"
import Svg, { Path } from "react-native-svg"
const PlusIcon = ({ fill }) => (
  <Svg xmlns="http://www.w3.org/2000/svg">
    <Path
      fill={fill}
      d="M48.2 6.219c6.853 4.7 11.986 11.503 13.55 19.761 1.11 8.968-.27 16.584-5.223 24.32-5.75 7.22-13.523 10.894-22.597 11.938-8.286.3-15.803-2.184-22.305-7.363-6.183-5.879-9.672-13.95-9.938-22.438.13-8.736 3.226-16.382 9.247-22.714C21.794.669 35.852-.624 48.199 6.219ZM30 17v13H17v4h13v13h4V34h13v-4H34V17h-4Z"
    />
  </Svg>
)
export default PlusIcon
