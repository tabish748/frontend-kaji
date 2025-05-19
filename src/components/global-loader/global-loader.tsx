import React from "react";
import Style from "@/styles/loaders/global-loader.module.scss"
// components/GlobalLoader.tsx
const GlobalLoader = ({ isLoading }: { isLoading: boolean }) => {
    if (!isLoading) return null;
  
    return <div className={Style.loader}></div>;

  };
  
  export default GlobalLoader;
  