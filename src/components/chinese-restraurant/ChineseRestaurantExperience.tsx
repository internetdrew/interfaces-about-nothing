import { useMemo, useState } from "react";

export const ChineseRestaurantExperience = () => {
  const [view, setView] = useState("idle");

  const content = useMemo(() => {
    switch (view) {
      case "idle":
        return <div className="h-8" />;
    }
  }, [view]);

  return (
    <div className="flex h-40 justify-center">
      <div className="h-fit min-w-24 overflow-hidden rounded-full bg-black">
        {content}
      </div>
    </div>
  );
};
