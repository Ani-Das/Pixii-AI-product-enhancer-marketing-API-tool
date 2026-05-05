import { useState } from "react";
import ReactCompareImage from "react-compare-image";

function App() {
  const [imageUrl, setImageUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [aiImage, setAiImage] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setSelectedStyle(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/upgrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        setResult(null);
      } else {
        setResult(data);
        setAiImage(null); // reset
      }
    } catch (err) {
      alert("Server busy. Try again.");
    }

    setLoading(false);
  };

  const handleDownload = (img) => {
  if (!img) return;

  const link = document.createElement("a");
  link.href = img;
  link.download = "premium-product.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  };

  return (
  <div className="h-screen w-full bg-black relative flex flex-col items-center justify-center overflow-y-auto">

  {/* TOP SPOTLIGHT */}
  <div className="absolute top-[-150px] w-[800px] h-[800px] bg-purple-500 opacity-20 blur-[200px] rounded-full"></div>

  {/* MID GRADIENT GLOW */}
  <div className="absolute top-[20%] w-[600px] h-[600px] bg-pink-500 opacity-10 blur-[150px] rounded-full"></div>

  {/* FLOOR GRADIENT */}
  <div className="absolute bottom-[-100px] w-[900px] h-[300px] bg-purple-600 opacity-20 blur-[120px] rounded-full"></div>

  {/* CONTENT */}
  <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">

      {/* TITLE */}
      <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-2">
        Turn Your Product Into a{" "}
        <span className="text-purple-400">Premium Listing</span>
      </h1>

      <p className="text-gray-400 mb-6 text-center text-sm">
        AI-powered hooks + instant product mockups
      </p>

      {/* INPUT */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-4 rounded-xl w-full max-w-md">
        <input
          type="text"
          placeholder="Paste image URL..."
          className="w-full p-3 rounded-lg text-black text-sm"
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full mt-3 bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg font-semibold text-sm"
        >
          {loading ? "Generating..." : "Upgrade Listing 🚀"}
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div className="mt-6 w-full max-w-md bg-white/10 p-4 rounded-xl">

          {/* HOOK */}
          <p className="text-white text-center mb-4 text-sm">
            {result.hook}
          </p>

          {/* BEFORE AFTER */}
          <div className="relative rounded-lg overflow-hidden">
            <span className="absolute top-2 left-2 text-xs text-white z-10">
              Before
            </span>
            <span className="absolute top-2 right-2 text-xs text-white z-10">
              After
            </span>

            <ReactCompareImage
              leftImage={imageUrl}
              rightImage={result.enhancedImage}
            />
          </div>

          {/* STYLE SELECTOR */}
          <div className="mt-5">

            <p className="text-gray-400 text-xs text-center mb-2">
              Choose a style
            </p>

            {/* NO SCROLLBAR, CLEAN FIT */}
            <div className="flex justify-between gap-2">

              {/* STUDIO */}
              <div
                onClick={() => setSelectedStyle("studio")}
                className={`flex-1 h-10 text-xs flex items-center justify-center rounded-md cursor-pointer transition-all
                bg-gradient-to-br from-gray-300 to-gray-600 text-black
                ${
                  selectedStyle === "studio"
                    ? "border border-purple-400 scale-105"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                studio
              </div>

              {/* LUXURY */}
              <div
                onClick={() => setSelectedStyle("luxury")}
                className={`flex-1 h-10 text-xs flex items-center justify-center rounded-md cursor-pointer transition-all
                bg-gradient-to-br from-yellow-600 to-yellow-400 text-black
                ${
                  selectedStyle === "luxury"
                    ? "border border-purple-400 scale-105"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                luxury
              </div>

              {/* DARK */}
              <div
                onClick={() => setSelectedStyle("dark")}
                className={`flex-1 h-10 text-xs flex items-center justify-center rounded-md cursor-pointer transition-all
                bg-gradient-to-br from-gray-800 to-black text-white
                ${
                  selectedStyle === "dark"
                    ? "border border-purple-400 scale-105"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                dark
              </div>

            </div>
          </div>

          <button
            onClick={() => setAiImage(result.aiImage)}
            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-md text-xs"
          >
            Generate with AI ✨
          </button>

          {/* FINAL PREVIEW */}
          {selectedStyle && (
            <div className="mt-5 text-center">

              <p className="text-purple-400 text-xs mb-2">
                Selected: {selectedStyle}
              </p>

              <div
                className={`p-4 rounded-lg flex justify-center items-center transition-all
                ${
                  selectedStyle === "studio"
                    ? "bg-gradient-to-br from-gray-300 to-gray-600"
                    : selectedStyle === "luxury"
                    ? "bg-gradient-to-br from-yellow-500 to-yellow-900"
                    : "bg-gradient-to-br from-gray-800 to-black"
                }`}
              >
                <img
                  src={result.enhancedImage}
                  className={`max-h-40 transition-all
                    ${
                      selectedStyle === "studio"
                        ? "drop-shadow-md"
                        : selectedStyle === "luxury"
                        ? "scale-105 drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
                        : "drop-shadow-2xl brightness-110"
                    }
                  `}
                />
              </div>
            </div>
          )}

          {aiImage && (
            <div className="mt-5 text-center">

              <p className="text-blue-400 text-xs mb-2">
                AI Generated Version
              </p>

              <div className="p-4 rounded-lg bg-black flex justify-center">
                <img src={aiImage} className="max-h-48 rounded-lg" />
              </div>

            </div>
          )}

          <button
          onClick={() => handleDownload(aiImage)}
          className="mt-4 flex items-center justify-center gap-2 mx-auto px-4 py-2 text-sm
          bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white
          hover:scale-105 transition-all"
        >
          Download Image
          <span>⬇️</span>
        </button>

        </div>
      )}
    </div></div>
  );
}

export default App;
