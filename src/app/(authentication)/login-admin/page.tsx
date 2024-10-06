/* eslint-disable @next/next/no-img-element */
import { ModeToggle } from "@/app/_components/theme-mode";
import { BookMarked } from "lucide-react";
import { LoginCard } from "./_components/login-card";

const Page = () => {
  return (
    <div className="relative grid min-h-screen overflow-hidden lg:grid-cols-2">
      {/* <ModeToggle className="absolute right-5 top-5 z-10" /> */}
      <div className="relative hidden items-center justify-center bg-sky-500 text-white dark:bg-emerald-900 dark:bg-opacity-50 lg:flex">
        <div className="absolute bottom-0 left-0 right-0 top-0 -z-0 bg-[url('/images/water.jpg')] opacity-20"></div>
        <div className="z-10 w-2/3">
          <p className="flex flex-row items-center gap-2 text-center text-6xl font-bold">
            {/* <BookMarked size={48} strokeWidth={2.5} /> */}
            Water Level Monitoring System
          </p>
          <p className="mt-5 text-center text-xl">
            Keep track of water levels in rivers, lakes, and reservoirs with our
            monitoring system. It uses sensors and wireless tech to provide
            real-time data, making it easy to stay informed.
          </p>
        </div>
      </div>
      <div className="relative flex items-center justify-center bg-emerald-900 bg-opacity-5">
        <img
          src="/images/waterbg.jpeg"
          alt="logo"
          className="absolute -bottom-40 -z-10 w-full"
        />
        <LoginCard />
      </div>
    </div>
  );
};

export default Page;
