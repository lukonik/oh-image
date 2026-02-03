// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import NxWelcome from "./nx-welcome";
import { Image } from "@lonik/oh-image/react";
export function App() {
  return (
    <div>
      <Image />
      <NxWelcome title="playground" />
    </div>
  );
}

export default App;
