import { useEffect } from "react";
import { ProductHeroDemo } from "@/demo/ProductHeroDemo";
import { BlokQuoteDemo } from "@/demo/BlokQuoteDemo";
import { BlockBlocDemo } from "@/demo/BlockBlocDemo";
import { BlockTextImageDemo } from "@/demo/BlockTextImageDemo";
import { BlockSliderImageDemo } from "@/demo/BlockSliderImageDemo";
import { BlockVideoDemo } from "@/demo/BlockVideoDemo";
import { BlockWatchesSlideDemo } from "@/demo/BlockWatchesSlideDemo";

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add("js");
    const setVh = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  return (
    <div className="antialiased">
      <ProductHeroDemo />
      <BlokQuoteDemo />
      <BlockBlocDemo />
      <BlockTextImageDemo />
      <BlockSliderImageDemo />
      <BlockVideoDemo />
      <BlockWatchesSlideDemo />
    </div>
  );
}
