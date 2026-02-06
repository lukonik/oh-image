import storm from "./image-1.png?oh&placeholder=true&breakpoints=200,400,600";
import { Image } from "../../src/react/index";
export function App() {
  console.log(storm);
  return (
    <div>
      <Image src={storm} />
      <h1>HELO</h1>
    </div>
  );
}
