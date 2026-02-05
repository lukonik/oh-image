import { Image } from "../../src/react/index";
import storm from "./image-1.png?oh";
import blur from "./blur.png";
export function App() {
  return (
    <div>
      <Image alt="gtest" src={storm} placeholder blurUrl={blur} />
      <h1>HELO</h1>
    </div>
  );
}
