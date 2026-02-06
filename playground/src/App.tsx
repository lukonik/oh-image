import storm from "./image-1.png?oh&placeholder=true";

export function App() {
  console.log(storm);
  return (
    <div>
      <img src={storm.src} alt={storm.alt}/>
      {/* <Image alt="gtest" src={storm} placeholder /> */}
      <h1>HELO</h1>
    </div>
  );
}
