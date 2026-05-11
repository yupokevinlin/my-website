import React, { useEffect, useState } from "react";
import { Breakpoint } from "@/components/types";
import useWidth from "../../../../hooks/useWidth";

export interface FireflyData {
  top: string;
  left: string;
  type: "1" | "2";
  animationDelay: string;
}

export interface FirefliesProps {
  children?: React.ReactNode;
}

const Fireflies: React.FC<FirefliesProps> = (props) => {
  const width: Breakpoint = useWidth();

  const [fireflyArray, setFireflyArray] = useState<Array<FireflyData>>([]);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

  const getCount = (): number => {
    switch (width) {
      case "xl":
      case "lg":
        return 50;
      case "md":
        return 40;
      case "sm":
      case "xs":
      default:
        return 20;
    }
  };

  useEffect(() => {
    const newFireflyArray: Array<FireflyData> = [];
    const count = getCount();
    for (let i = 0; i < count; i++) {
      const type: "1" | "2" = Math.random() > 0.5 ? "1" : "2";
      const animationDelay = type === "1" ? `${Math.random() * 10}s` : `${Math.random() * 8}s`;
      newFireflyArray.push({ type, animationDelay, top: `${Math.random() * 95}%`, left: `${Math.random() * 95}%` });
    }
    setFireflyArray(newFireflyArray);
    setTimeout(() => {
      setFireflyArray(prev => prev.map(f => ({ ...f, top: `${Math.random() * 95}%`, left: `${Math.random() * 95}%` })));
    }, 500);
    setInterval(() => {
      setFireflyArray(prev => prev.map(f => ({ ...f, top: `${Math.random() * 95}%`, left: `${Math.random() * 95}%` })));
    }, 25000);
  }, []);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
    } else {
      const count = getCount();
      const diff = count - fireflyArray.length;
      if (diff > 0) {
        const extras: Array<FireflyData> = [];
        for (let i = 0; i < diff; i++) {
          const type: "1" | "2" = Math.random() > 0.5 ? "1" : "2";
          const animationDelay = type === "1" ? `${Math.random() * 10}s` : `${Math.random() * 8}s`;
          extras.push({ type, animationDelay, top: `${Math.random() * 95}%`, left: `${Math.random() * 95}%` });
        }
        setFireflyArray(prev => [...prev, ...extras]);
      }
      if (diff < 0) {
        setFireflyArray(prev => prev.filter((_f, i) => i < count - 1));
      }
    }
  }, [width]);

  return (
    <div className="h-full w-full">
      <div className="h-full w-full block relative top-0 left-0 z-[1]">
        {fireflyArray.map((firefly, index) => (
          <div
            key={`firefly-${index}`}
            className={`rounded-full absolute ${firefly.type === "1" ? "h-[4px] w-[4px]" : "h-[5px] w-[5px]"}`}
            style={{
              left: firefly.left,
              top: firefly.top,
              animation: firefly.type === "1"
                ? `firefly-flash 10s linear ${firefly.animationDelay} infinite`
                : `firefly-flash 8s linear ${firefly.animationDelay} infinite`,
              transition: "top 30s, left 30s",
            }}
          />
        ))}
      </div>
      <div className="h-full w-full relative top-[-100%] left-0 z-0">
        {props.children}
      </div>
    </div>
  );
};

export default Fireflies;

