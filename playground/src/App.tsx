import { Image } from "../../src/react/index";
import image1 from "./image-1.png?oh";
console.log("IMAGE IS ", image1);

export function App() {
  console.log(image1);
  return (
    <div>
      {/* <img src={image1.src} /> */}
      <Image src={image1} />
      <h1>HELO</h1>
    </div>
  );
}
