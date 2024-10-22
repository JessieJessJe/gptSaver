import React from 'react';
import AmbientBackground from "./AmbientBackground"

interface ClickToTypeProps {}

const ClickToType: React.FC<ClickToTypeProps> = () => {
  return (
    <div className="flex flex-col mt-8 text-xs text-center w-[92px]">
      <button className="px-2.5 pt-2 pb-3.5 bg-zinc-300 bg-opacity-20 max-sm:mx-auto">
        click to type
      </button>
    </div>
  );
};


interface WhatsOnYourMindProps {}

const WhatsOnYourMind: React.FC<WhatsOnYourMindProps> = () => {
  return (
    <section className="flex overflow-hidden flex-col py-5 px-5 mx-auto w-full bg-black max-w-[1211px] max-sm:pl-1">
      <div className="flex flex-col items-center mx-auto w-full text-white max-w-[287px]">
        <h1 className="px-px  max-w-full text-4xl rounded-none w-[181px]">
          WHAT'S ON YOUR MIND?
        </h1>
        {/* <ClickToType /> */}
        {/* <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6d494e0d5ab7580a1df5f81275710fcc9b00ae44aa2f291d85a29f3571c52a9f?placeholderIfAbsent=true&apiKey=034b6e042797496aa23a2438c0356cea"
          alt=""
          className="object-contain mt-0 w-full aspect-[1] max-sm:mx-auto"
        /> */}
      </div>
    </section>
  );
};

const LandingPage: React.FC = () => {
    return(
      <>
    <WhatsOnYourMind />
        <div className="flex flex-col items-center justify-center w-[100vw] gap-5 bg-black py-5">
        <AmbientBackground index={0}/>
        <AmbientBackground index={1}/>
        <AmbientBackground index={2}/>
        <AmbientBackground index={3}/>
        <AmbientBackground index={4}/>
      </div>
      </>
    )
}

export default LandingPage;