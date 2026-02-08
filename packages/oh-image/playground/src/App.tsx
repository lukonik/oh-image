import storm from "./image-1.png?oh&placeholder=true";
import { Image } from "../../src/react/index";
export function App() {
  console.log(storm);
  return (
    <div>
      <Image src={storm} placeholder asap />
      <h1>HELO</h1>
    </div>
  );
}
