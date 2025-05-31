import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="flex p-5 h-75 items-center justify-center font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-5xl z-11 text-white">Bienvenidos a Event Board
          
        </h1>
        <video
          autoPlay
          loop
          muted
          className="absolute z-10 w-auto min-w-full min-h-full max-w-none"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-heights-in-a-sunset-26070-large.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
    </main>
  );
}
