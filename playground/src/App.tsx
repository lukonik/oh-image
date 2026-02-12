import forestImage from "./transparent-img.avif?oh&placeholder=true";
import { Image } from "../../src/react/image";
import helloImage from "./hello.png?oh&placeholder=true";

export function App() {
  return (
    <div>
      <Image src={helloImage} style={{width:'400px',height:'400px'}} asap={true} loading="lazy" alt="forest image" />;
      <Image src={forestImage} alt="forest image" />;
    </div>
  );
}
