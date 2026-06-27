import React, { useEffect } from "react";
import MainPage from "../display/pages/MainPage/MainPage";
import smoothScroll from "smoothscroll-polyfill";
import { ThemePictureSeason } from "../display/components/ThemePicture/types";

const App: React.FC = () => {
  useEffect(() => {
    smoothScroll.polyfill();
  }, []);

  // Season color changes are driven by CSS custom properties set on document.documentElement.dataset.season
  const handleSeasonThemeChange = (_season: ThemePictureSeason): void => {
    /* no-op: CSS vars handle colors */
  };

  return (
    <div className="h-full w-full flex flex-col flex-nowrap">
      <MainPage handleSeasonThemeChange={handleSeasonThemeChange} />
    </div>
  );
};

export default App;

