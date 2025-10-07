import React, { useContext, useEffect, useState, useRef } from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";

const ChevronIcon = ({ open }) => (
  <svg
    className={`h-5 transition-transform ${open ? "rotate-180" : ""}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

// Custom Dropdown
const CustomDropdown = ({
  format = "",
  setFormat = () => {},
  formats = [],
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="bg-transparent w-40 border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer text-center"
      >
        <div className="flex justify-between">
          <p>{format}</p>
          <ChevronIcon open={open} />
        </div>
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute rounded-xl z-50 mt-1 w-40 bg-white border border-zinc-250 shadow-lg"
        >
          {formats.map((fmt) => (
            <div
              key={fmt}
              role="menuitem"
              tabIndex={0}
              onClick={() => {
                setFormat(fmt);
                setOpen(false);
              }}
              className="text-black px-8 py-3 rounded-xl hover:bg-zinc-200 cursor-pointer text-center"
            >
              {fmt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Result = () => {
  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [format, setFormat] = useState("PNG");
  const { generateImage } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (input) {
      const img = await generateImage(input);
      if (img) {
        setImage(img);
        setIsImageLoaded(true);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Convert and download image
  const convertImage = (input, format) => {
    const extension = format.toLowerCase();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const imageElement = new Image();
    imageElement.crossOrigin = "anonymous"; // Fix CORS
    imageElement.src = input;
    imageElement.onload = () => {
      canvas.width = imageElement.width;
      canvas.height = imageElement.height;
      ctx.drawImage(imageElement, 0, 0);

      const downloadImage = (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `image.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      };

      if (extension === "svg") {
        const dataUrl = canvas.toDataURL("image/png");
        const svgContent = `
          <svg xmlns='http://www.w3.org/2000/svg' width='${imageElement.width}' height='${imageElement.height}'>
            <image href='${dataUrl}' width='${imageElement.width}' height='${imageElement.height}'/>
          </svg>`;
        const blob = new Blob([svgContent], { type: "image/svg+xml" });
        downloadImage(blob);
      } else {
        canvas.toBlob((blob) => {
          if (blob) downloadImage(blob);
          else console.error("Failed to convert canvas to blob.");
        }, `image/${extension}`);
      }
    };
  };

  return (
    <motion.form
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={onSubmitHandler}
      className="flex flex-col min-h-[90vh] justify-center items-center"
    >
      <div className="relative">
        <img src={image} alt="" className="max-w-sm rounded" />
        <span
          className={`absolute bottom-0 h-1 bg-blue-500 ${
            loading ? "w-full transition-all duration-[10s]" : "w-0"
          }`}
        ></span>
      </div>
      {loading && <p>Loading...</p>}

      {!isImageLoaded && (
        <div className="flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full">
          <input
            type="text"
            placeholder="Describe what you want to generate"
            className="flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-color"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="bg-zinc-900 px-10 sm:px-16 py-3 rounded-full"
          >
            Generate
          </button>
        </div>
      )}

      {isImageLoaded && (
        <div className="flex flex-col items-center">
          <div className="flex gap-5 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full">
            <p
              onClick={() => setIsImageLoaded(false)}
              className="bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer"
            >
              Generate Another
            </p>
            <CustomDropdown
              format={format}
              setFormat={setFormat}
              formats={["JPEG", "PNG", "WebP", "SVG"]}
            />
          </div>
          <div className="flex sm:justify-end justify-center mt-5 p-0.5 text-white">
            <div
              onClick={(e) => {
                e.preventDefault();
                convertImage(image, format);
              }}
              className="w-40 bg-zinc-900 px-10 py-3 rounded-full cursor-pointer"
            >
              Download
            </div>
          </div>
        </div>
      )}
    </motion.form>
  );
};

export default Result;
