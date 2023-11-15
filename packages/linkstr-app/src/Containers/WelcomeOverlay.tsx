import { motion } from "framer-motion";
import { Header } from "../Components/Header";
import background from "../Images/background.png";
import { useEffect, useState } from "react";

// Zindexs - 30 is highest, 20 is for overlays, 10 is for buttons etc.

const WelcomeOverlay = () => {
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(false);

  const handleGetStarted = () => {
    localStorage.setItem("showWelcomeOverlay", "false");
    setShowWelcomeOverlay(false);
  };

  useEffect(() => {
    if (localStorage.getItem("showWelcomeOverlay") === "false") {
      setShowWelcomeOverlay(false);
      return;
    }
    setShowWelcomeOverlay(true);
  }, []);

  if (showWelcomeOverlay === false) return null;

  return (
    <motion.div>
      <div className="absolute left-0 top-0 z-30 w-full bg-white pb-12 md:pb-24">
        <div className="relative mx-auto w-full px-4 lg:w-[60rem] lg:px-0">
          <img
            src={background}
            alt=""
            className="absolute -right-9 -top-[82px] hidden w-[36rem] md:block"
          />
          <Header />
          <div className="flex flex-col">
            <div className="h1 mt-20 w-full md:w-[44rem]">
              Create your perfect link collection and share it with the world.
            </div>
            <button
              className="button mt-16 h-14 w-40 rounded-2xl text-lg"
              onClick={handleGetStarted}
            >
              Get Started
            </button>
            <div className="mt-6 pl-1 text-xs font-medium">
              <span className="text-black/40">No Login Required!</span>
              <span> Learn more</span>
            </div>
          </div>
        </div>
      </div>
      <div
        className="fixed left-0 top-0 z-20 min-h-full min-w-full bg-black/40 backdrop-blur-2xl"
        onClick={handleGetStarted}
      ></div>
    </motion.div>
  );
};

export default WelcomeOverlay;
