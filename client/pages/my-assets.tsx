import React from "react";
import dynamic from "next/dynamic";

const MyAssets = dynamic(() => import("../components/my-assets"), {
  ssr: false,
});

function Home() {
  return (
    <div>
      <MyAssets />
    </div>
  );
}

export default Home;
