// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import NxWelcome from "./nx-welcome";
import { Image } from "@lonik/oh-image/react";
import image1 from "./image-1.png";
export function App() {
  return (
    <div>
      <img src={image1} />
      <Image />
      <NxWelcome title="playground" />
    </div>
  );
}

export default App;
