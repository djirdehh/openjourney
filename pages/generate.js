import { useState } from "react";
import Head from "next/head";
import Image from "next/image";

import Illustration from "../public/images/auth-illustration.svg";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Generate() {
  const [prompt, setPrompt] = useState("");
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);

  const [loading, setLoading] = useState(false);

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        width,
        height,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setLoading(false);
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        setLoading(false);
        return;
      }
      setPrediction(prediction);
      setLoading(false);
    }
  };

  const renderRightColumn = () => {
    const initialContent = (
      <>
        <ul className="inline-flex flex-col text-lg text-slate-500 space-y-3">
          <li className="flex items-center">
            <svg
              className="w-3 h-3 fill-current text-emerald-500 mr-3 shrink-0"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
            </svg>
            <span>Follow the prompts</span>
          </li>
          <li className="flex items-center">
            <svg
              className="w-3 h-3 fill-current text-emerald-500 mr-3 shrink-0"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
            </svg>
            <span>Duis aute irure dolor in reprehenderit in voluptate.</span>
          </li>
          <li className="flex items-center">
            <svg
              className="w-3 h-3 fill-current text-emerald-500 mr-3 shrink-0"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
            </svg>
            <span>
              Eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </span>
          </li>
        </ul>
      </>
    );

    const loadingContent = (
      <div
        className="w-24 h-24 rounded-full animate-spin
    border-y-8 border-solid border-indigo-500 border-t-transparent shadow-md ml-12"
      ></div>
    );

    let content = initialContent;

    if (loading) {
      content = loadingContent;
    }

    if (prediction && prediction?.output?.length) {
      const imageList = prediction.output.map((outputImage, idx) => {
        return (
          <div class="w-full rounded" key={idx}>
            <Image src={outputImage} width="150" height="125" alt="" />
          </div>
        );
      });
      content = <div class="grid grid-cols-2 gap-2">{imageList}</div>;
    }

    return (
      <div className="grow w-5/6 mb-12 lg:mb-0 flex flex-col items-center lg:items-start align-middle lg:min-w-[470px]">
        {content}
      </div>
    );
  };

  console.log("prediction", prediction);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <main className="grow">
        <section className="relative">
          {/* Illustration */}
          <div
            className="hidden md:block absolute left-1/2 -translate-x-1/2 pointer-events-none -z-10"
            aria-hidden="true"
          >
            <Image
              src={Illustration}
              className="max-w-none"
              width="1440"
              height="332"
              alt="Page Illustration"
            />
          </div>
          <div className="flex min-h-screen">
            <div className="relative mx-auto my-auto">
              <div className="lg:flex lg:space-x-20">
                {/* Left side */}
                <div className="relative w-full max-w-xl mx-auto">
                  {/* Bg gradient */}
                  <div
                    className="absolute inset-0 opacity-40 bg-gradient-to-t from-transparent to-slate-800 -z-10"
                    aria-hidden="true"
                  />
                  <div className="p-6 md:p-8 sm:min-w-[555px]">
                    {/* Form */}
                    <form>
                      <div className="space-y-4">
                        <div>
                          <label
                            className="block text-sm text-slate-400 font-medium mb-1"
                            htmlFor="prompt"
                          >
                            Prompt <span className="text-rose-500">*</span>
                          </label>
                          <textarea
                            id="prompt"
                            className="form-textarea text-sm py-2 w-full"
                            rows="5"
                            required
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                          />
                        </div>
                        <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
                          <div className="sm:w-1/2">
                            <label
                              className="block text-sm text-slate-400 font-medium mb-1"
                              htmlFor="width"
                            >
                              Width (px)
                            </label>
                            <input
                              id="width"
                              className="form-input text-sm py-2 w-full"
                              type="text"
                              placeholder="512"
                              value={width}
                              onChange={(e) => setWidth(e.target.value)}
                            />
                          </div>
                          <div className="sm:w-1/2">
                            <label
                              className="block text-sm text-slate-400 font-medium mb-1"
                              htmlFor="height"
                            >
                              Height (px)
                            </label>
                            <input
                              id="height"
                              className="form-input text-sm py-2 w-full"
                              type="text"
                              placeholder="512"
                              value={height}
                              onChange={(e) => setHeight(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <button
                          onClick={handleSubmit}
                          className="btn-sm text-sm text-white bg-indigo-500 hover:bg-indigo-600 w-full shadow-sm group"
                        >
                          Generate
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                {/* Right side */}
                {renderRightColumn()}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
