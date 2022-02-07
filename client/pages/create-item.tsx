import React from "react";
import dynamic from "next/dynamic";

const CreateItem = dynamic(() => import("../components/create-item"), {
  ssr: false,
});

function Home() {
  return (
    <div>
      <CreateItem />
    </div>
  );
}

export default Home;
