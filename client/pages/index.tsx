import React from "react";
import dynamic from "next/dynamic";

const Market = dynamic(() => import("../components/market"), {
  ssr: false,
});

function Home() {
  return (
    <div>
      <Market />
    </div>
  );
}

export default Home;
