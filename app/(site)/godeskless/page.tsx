import React from "react";
import Contact from "@/components/Contact";
import GoDeskless from "@/components/Godeskless";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GoDeskless Intelligent Support & Resolution Assistant (ISRA)",
  description: "RAG Pipeline built for processing documents and quering data",
};

const GoDesklessPlayground = () => {
  return (
    <div className="mt-[0em]">
      <GoDeskless />
    </div>
  );
};

export default GoDesklessPlayground;
