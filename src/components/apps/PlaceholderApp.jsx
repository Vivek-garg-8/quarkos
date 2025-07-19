import React from "react";

const PlaceholderApp = ({ appName }) => (
  <div className="w-full h-full bg-zinc-800 rounded-b-xl flex items-center justify-center">
    <h2 className="text-white text-2xl">{appName} Coming Soon!</h2>
  </div>
);

export default PlaceholderApp;
