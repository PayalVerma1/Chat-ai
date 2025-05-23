"use client";

import * as React from "react";
import { useChatStore } from "./chatStore";

const Hydration = () => {
  React.useEffect(() => {
    useChatStore.persist.rehydrate();
  }, []);

  return null;
};

export default Hydration;