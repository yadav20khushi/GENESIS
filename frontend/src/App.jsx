import { useState } from "react";
import Home from "./components/home";
import AiDiscoveryChat from "./components/AiDiscoveryChat";

export default function App() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Home Page */}
      <Home onStartProject={() => setShowChat(true)} />

      {/* Modal */}
      {showChat && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center">
          <div className="relative w-full h-full bg-[#0a0a0a] flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setShowChat(false)}
              className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-medium transition-all"
            >
              Close ✕
            </button>

            {/* AiDiscoveryChat */}
            <AiDiscoveryChat />
          </div>
        </div>
      )}
    </div>
  );
}
