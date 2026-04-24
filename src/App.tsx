import { useEffect } from "react";
import { BlockHeroDemo } from "@/demo/BlockHeroDemo";
import { BlockQuoteDemo } from "@/demo/BlockQuoteDemo";
import { BlockBlocDemo } from "@/demo/BlockBlocDemo";
import { BlockTextImageDemo } from "@/demo/BlockTextImageDemo";
import { TitleTextDemo } from "@/demo/TitleTextDemo";
import { BlockSliderImageDemo } from "@/demo/BlockSliderImageDemo";
import { BlockVideoDemo } from "@/demo/BlockVideoDemo";
import { BlockWatchesSlideDemo } from "@/demo/BlockWatchesSlideDemo";
import { BlockCharacteristicDemo } from "@/demo/BlockCharacteristicDemo";
import { BlockEditoDemo } from "@/demo/BlockEditoDemo";
import { BlockVariationDemo } from "@/demo/BlockVariationDemo";
import { DiaporamaDemo } from "@/demo/DiaporamaDemo";
import { KeyFiguresDemo } from "@/demo/KeyFiguresDemo";
import { TextColumnsDemo } from "@/demo/TextColumnsDemo";

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
      <BlockHeroDemo />
      <BlockQuoteDemo />
      <BlockBlocDemo />
      <BlockTextImageDemo />
      <BlockEditoDemo />
      <TitleTextDemo />
      <BlockSliderImageDemo />
      <BlockVariationDemo />
      <BlockCharacteristicDemo />
      <KeyFiguresDemo />
      <TextColumnsDemo />
      <DiaporamaDemo />
      <BlockVideoDemo />
      <BlockWatchesSlideDemo />
    </div>
  );
}
