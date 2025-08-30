import React, { useState, useEffect } from "react";
import {
  Play,
  ArrowRight,
  Sparkles,
  Video,
  Scissors,
  Image,
  Wand2,
  Users,
  Clock,
  Trophy,
  ChevronDown,
  Star,
} from "lucide-react";

const GentaHomepage = ({ onStartProject }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [textAnimation, setTextAnimation] = useState({
    showBadge: false,
    showTitle: false,
    showDescription: false,
    showButton: false
  });

  const features = [
    { icon: <Wand2 className="w-8 h-8" />, title: "AI Script Generation", description: "Transform your ideas into detailed scripts with scene-by-scene breakdowns" },
    { icon: <Scissors className="w-8 h-8" />, title: "Smart Cut Planning", description: "Automatically generate professional cut sequences for each scene" },
    { icon: <Image className="w-8 h-8" />, title: "Keyframe Visualization", description: "Preview your shots with AI-generated keyframes before production" },
    { icon: <Video className="w-8 h-8" />, title: "Instant Video Generation", description: "Generate final video segments with a single click" }
  ];

  const workflow = [
    { step: "01", title: "Describe Your Vision", description: "Tell Genesis your video idea through natural conversation" },
    { step: "02", title: "AI Script Creation", description: "Genesis generates a complete script with scenes and timing" },
    { step: "03", title: "Cut & Frame Planning", description: "Break down each scene into cuts and visualize keyframes" },
    { step: "04", title: "Generate & Export", description: "Create your final video with AI-powered generation" }
  ];

  const testimonials = [
    { name: "Sarah Chen", role: "Content Creator", content: "Genesis transformed my workflow. What used to take weeks now takes hours!", rating: 5 },
    { name: "Marcus Rodriguez", role: "Marketing Director", content: "The AI understands creative vision better than most humans I've worked with.", rating: 5 },
    { name: "Emma Thompson", role: "Filmmaker", content: "Revolutionary tool. The keyframe visualization saves so much pre-production time.", rating: 5 }
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Text animation sequence
  useEffect(() => {
    const sequence = [
      { delay: 500, action: () => setTextAnimation(prev => ({ ...prev, showBadge: true })) },
      { delay: 1200, action: () => setTextAnimation(prev => ({ ...prev, showTitle: true })) },
      { delay: 2500, action: () => setTextAnimation(prev => ({ ...prev, showDescription: true })) },
      { delay: 3800, action: () => setTextAnimation(prev => ({ ...prev, showButton: true })) }
    ];

    sequence.forEach(({ delay, action }) => {
      setTimeout(action, delay);
    });
  }, []);

  const handleStartProjectInternal = () => {
    if (onStartProject) onStartProject();
    else alert("Start Project clicked!");
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  // Convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1`;
  };

  return (
    <>
      {/* Navigation - Simplified */}
      <nav className="fixed top-0 left-0 z-50 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-2xl backdrop-blur-sm">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Genta</h1>
            <p className="text-xs text-gray-300">powered by Genesis AI</p>
          </div>
        </div>
      </nav>

      {/* Full Screen Video Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full">
          <iframe
            src={getYouTubeEmbedUrl("https://www.youtube.com/watch?v=EngW7tLk6R8")}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              width: '100vw',
              height: '100vh',
              transform: 'scale(1.1)', // Slight zoom to hide potential black bars
              transformOrigin: 'center center'
            }}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 text-center space-y-8 px-6 max-w-5xl mx-auto">
          <div className="space-y-8">
            {/* Animated Badge */}
            <div className={`transition-all duration-1000 ${textAnimation.showBadge ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 shadow-2xl">
                <Sparkles className="w-5 h-5 text-purple-300 animate-pulse" />
                <span className="text-purple-200 font-medium">Powered by Genesis AI</span>
              </div>
            </div>

            {/* Animated Title with Typewriter Effect */}
            <div className={`transition-all duration-1000 delay-700 ${textAnimation.showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
                Turn Your{' '}
                <span className="relative">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                    Ideas
                  </span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-lg blur-xl animate-pulse"></div>
                </span>
                <br />Into Reality
              </h1>
            </div>

            {/* Animated Description */}
            <div className={`transition-all duration-1000 delay-1200 ${textAnimation.showDescription ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 max-w-4xl mx-auto leading-relaxed font-light">
                Create professional videos with{' '}
                <span className="text-purple-300 font-semibold">AI-powered script generation</span>,{' '}
                <span className="text-pink-300 font-semibold">intelligent cut planning</span>, and{' '}
                <span className="text-blue-300 font-semibold">instant video production</span>
              </p>
            </div>
          </div>

          {/* Animated CTA Button */}
          <div className={`transition-all duration-1000 delay-1800 ${textAnimation.showButton ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
            <button
              onClick={handleStartProjectInternal}
              className="group relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-500 px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl transform hover:scale-105 hover:shadow-purple-500/25"
              style={{
                backgroundSize: '200% 100%',
                animation: 'gradient-shift 3s ease-in-out infinite'
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <span>Start Your Project</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-black/90">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powered by <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Genesis AI</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the future of video creation with intelligent automation and creative assistance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl border transition-all duration-500 ${
                  currentFeature === index
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50 shadow-2xl'
                    : 'bg-white/5 backdrop-blur-sm border-white/10 hover:border-purple-400/50'
                }`}
              >
                <div className="text-purple-300 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-20 px-6 bg-black/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From idea to finished video in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflow.map((step, index) => (
              <div key={index} className="relative">
                {index < workflow.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-purple-400/50 to-transparent"></div>
                )}
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold shadow-2xl">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 bg-black/90">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Loved by <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Creators</span></h2>
          <p className="text-xl text-gray-300 mb-12">See what our users have to say</p>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-400/50 transition-all duration-300">
                <div className="flex items-center mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{t.content}"</p>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-gray-400">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Create Something Amazing?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Join thousands of creators who are already using Genesis AI to bring their visions to life</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartProjectInternal}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-12 py-4 rounded-2xl font-semibold text-lg shadow-2xl"
            >
              Start Your First Project
            </button>

            <div className="text-sm text-gray-400 mt-2 sm:mt-0">No credit card required • Free to start</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-black/90">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold">Genta</div>
              <div className="text-xs text-gray-400">powered by Genesis AI</div>
            </div>
          </div>
          <div className="text-sm text-gray-400">© 2025 Genta. All rights reserved. Built with 💜 for creators.</div>
        </div>
      </footer>
    </>
  );
};

export default GentaHomepage;