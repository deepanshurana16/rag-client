"use client";
import Image from "next/image";
import { Typewriter } from "react-simple-typewriter";
import { useState } from "react";
import homepage from "../../assets/homepage.png";

const Hero = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <section className="overflow-hidden pb-20 pt-35 md:pt-40 xl:pb-25 xl:pt-46">
        <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
          <div className="flex lg:items-center lg:gap-8 xl:gap-32.5">
            <div className=" md:w-1/2">
              <h4 className="mb-4.5 text-lg font-medium text-black dark:text-white">
                <Typewriter
                  words={[
                    "GoDeskless - Your Intelligent knowledge base Assistant","Simplify Ticket Resolution Through Smart Knowledge Sharing","AI-Driven Knowledge Base for Effortless Ticket Resolution"
                  ]}
                  loop={false}
                  cursor
                  cursorStyle="|"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1000}
                />
              </h4>
              <h1 className="mb-5 pr-16 text-3xl font-bold text-black dark:text-white xl:text-hero ">
                <span className="relative inline-block before:absolute before:bottom-2.5 before:left-0 before:-z-1 before:h-3 before:w-full before:bg-titlebg dark:before:bg-titlebgdark ">
                  AI-Driven
                </span>{" "}
                Knowledge Base for Effortless{" "}
                <span className="relative inline-block before:absolute before:bottom-2.5 before:left-0 before:-z-1 before:h-3 before:w-full before:bg-titlebg dark:before:bg-titlebgdark ">
                  Ticket Resolution
                </span>
              </h1>
              <p>
                GoDeskless's I·S·R·A enables seamless interaction with your knowledge
                base. Ask questions, search for information, and retrieve
                answers—all within a user-friendly, intuitive interface. Ideal
                for customers, support teams, service agents, and anyone seeking
                to deliver fast, knowledge base based responses powered by AI.
              </p>

              <div className="mt-10"></div>
            </div>

            <div className="animate_right hidden md:w-1/2 lg:block">
              <div className="relative 2xl:-mr-7.5">
                <Image
                  src="/images/shape/shape-02.svg"
                  alt="shape"
                  width={36.9}
                  height={36.7}
                  className="absolute bottom-0 right-0 z-10"
                />
                <Image
                  src="/images/shape/shape-03.svg"
                  alt="shape"
                  width={21.64}
                  height={21.66}
                  className="absolute -right-6.5 bottom-0 z-1"
                />
                <div className=" relative aspect-[700/444] w-full">
                  <Image
                    className="rounded-xl shadow-solid-l dark:hidden"
                    src={homepage}
                    alt="Hero"
                    fill
                  />
                  <Image
                    className="hidden rounded-xl shadow-solid-l dark:block"
                    src={homepage}
                    alt="Hero"
                    fill
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
