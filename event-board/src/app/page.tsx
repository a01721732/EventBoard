import Image from "next/image";
import CarouselWithProgress from "@/components/customized/carousel/carousel-08";

export default function Home() {
  return (
    <main className="bg-[#444444]">
      <div className="flex p-5 h-75 mb-30 flex-col items-center justify-center font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-5xl z-11 text-white mt-25">Bienvenidos a Event Board</h1>
        <h2 className="text-4xl z-11 text-white mt-10">Tu solución de registro de participantes</h2>
        <video
          autoPlay
          loop
          muted
          className="absolute z-10 w-full h-[480px] object-cover max-w-none"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-heights-in-a-sunset-26070-large.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
      
      <h2 className="mt-40 text-4xl z-11 text-center text-white mt-10">Construido con:</h2>
      <CarouselWithProgress/>
    </main>
  );
}
