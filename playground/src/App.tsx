import image1 from "./image-1.png";

export function App() {
  console.log(image1)
  return (
    <>
    <img src={image1.src} width={image1.width} height={image1.height} />
      <h1>HELO</h1>
    </>
  );
}
