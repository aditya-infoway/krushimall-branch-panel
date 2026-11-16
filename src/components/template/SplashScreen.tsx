// Local Imports

import { Progress } from "@/components/ui";

// ----------------------------------------------------------------------

export function SplashScreen() {
  return (
    <>
      <div className="fixed grid h-full w-full place-content-center">
       <img
          src={`${import.meta.env.BASE_URL}fevicon.png`}
          alt="KrushiMall"
          className="mx-auto size-28 object-contain"
        />
        <Progress
          color="primary"
          isIndeterminate
          animationDuration="1s"
          className="mt-2 h-1"
        />
      </div>
    </>
  );
}