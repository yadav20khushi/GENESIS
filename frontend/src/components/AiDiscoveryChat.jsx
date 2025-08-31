import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, MessageCircle, Film, Home, Menu, X, Scissors, Image } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

const AiDiscoveryChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      content: "Hello! I'm here to help you create amazing videos. What kind of video would you like to make today?",
      timestamp: new Date()
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [scenes, setScenes] = useState([]);
  const [cuts, setCuts] = useState([]);
  const [keyframes, setKeyframes] = useState([]);
  const [currentView, setCurrentView] = useState('main'); // 'main', 'scene-1', 'cuts', 'keyframes', etc.
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentScene, setCurrentScene] = useState(null);
  const [currentCut, setCurrentCut] = useState(null);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSendMessage = async (customMessage = null) => {
    const messageToSend = customMessage || inputValue;
    if (!messageToSend.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customMessage) setInputValue('');
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/chat`, {
        message: messageToSend,
      });

      const data = res.data;

      const aiResponse = {
        id: userMessage.id + 1,
        sender: 'ai',
        content: data.reply || 'No reply received.',
        timestamp: new Date(),
        hasScenes: false,
        hasCuts: false,
        hasKeyframes: false
      };

      // Update structured data if available
      if (data.scenes?.length) {
        setScenes(data.scenes);
        aiResponse.hasScenes = true;
      }

      if (data.cuts?.length) {
        setCuts(data.cuts);
        aiResponse.hasCuts = true;
      }

      if (data.keyframes?.length) {
        setKeyframes(data.keyframes);
        aiResponse.hasKeyframes = true;
      }

      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages(prev => [
        ...prev,
        {
          id: userMessage.id + 1,
          sender: 'ai',
          content: 'Oops! Something went wrong contacting the assistant. Please try again.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSceneClick = (scene) => {
    setCurrentScene(scene);
    setCurrentView(`scene-${scene.id}`);
    setCuts([]);
    setKeyframes([]);

    const sceneMessage = `Give me cuts for scene ${scene.id}: ${scene.title}`;
    setMessages([
      {
        id: 1,
        sender: 'ai',
        content: `Let's work on Scene ${scene.id}: ${scene.title}. I'll generate cuts for this scene.`,
        timestamp: new Date()
      }
    ]);

    // Send message to get cuts for this scene
    setTimeout(() => {
      handleSendMessage(sceneMessage);
    }, 500);
  };

  const handleCutClick = (cut) => {
    setCurrentCut(cut);
    setCurrentView('keyframes');
    setKeyframes([]);

    const cutMessage = `Give me 3 keyframes for cut ${cut.id}: ${cut.description}`;
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      sender: 'user',
      content: cutMessage,
      timestamp: new Date()
    }]);

    // Send message to get keyframes for this cut
    setTimeout(() => {
      handleSendMessage(cutMessage);
    }, 500);
  };

  const handleKeyframeClick = async (keyframe) => {
    try {
      setIsLoading(true);
      const res = await axios.post(`${API_BASE}/api/generate-video`, {
        keyframe_id: keyframe.id,
      });

      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'ai',
        content: `Video generated successfully! You can view it at: ${res.data.video_url}`,
        timestamp: new Date()
      }]);
    } catch (err) {
      console.error('Error generating video:', err);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'ai',
        content: 'Sorry, there was an error generating the video. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const SceneCard = ({ scene }) => (
    <div
      onClick={() => handleSceneClick(scene)}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-purple-400/50 group"
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-white font-semibold text-lg group-hover:text-purple-200 transition-colors">
          Scene {scene.id}: {scene.title}
        </h4>
        {scene.duration && (
          <span className="text-blue-200 text-sm bg-purple-500/20 px-2 py-1 rounded-lg">
            {scene.duration}
          </span>
        )}
      </div>
      {scene.description && (
        <p className="text-gray-300 text-sm leading-relaxed">{scene.description}</p>
      )}
    </div>
  );

  const CutCard = ({ cut }) => (
    <div
      onClick={() => handleCutClick(cut)}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-blue-400/50 group"
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-white font-semibold text-lg group-hover:text-blue-200 transition-colors">
          Cut {cut.id}
        </h4>
        {cut.duration && (
          <span className="text-green-200 text-sm bg-blue-500/20 px-2 py-1 rounded-lg">
            {cut.duration}
          </span>
        )}
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">{cut.description}</p>
    </div>
  );

  const KeyframeCard = ({ keyframe }) => (
    <div
      onClick={() => handleKeyframeClick(keyframe)}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-green-400/50 group relative overflow-hidden"
    >
      {keyframe.image_url ? (
        <img
          src={keyframe.image_url}
          alt={`Keyframe ${keyframe.id}`}
          className="w-full h-32 object-cover rounded-lg mb-3"
        />
      ) : (
        <div className="w-full h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg mb-3 flex items-center justify-center">
          <Image size={32} className="text-white/50" />
        </div>
      )}
      <h4 className="text-white font-semibold text-sm group-hover:text-green-200 transition-colors">
        Keyframe {keyframe.id}
      </h4>
      {keyframe.description && (
        <p className="text-gray-300 text-xs mt-1 leading-relaxed">{keyframe.description}</p>
      )}
    </div>
  );

  const Sidebar = () => (
    <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-black/20 backdrop-blur-sm border-r border-white/10 flex flex-col transition-all duration-300`}>
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        {!sidebarCollapsed && <h2 className="text-white font-bold text-xl">Genesis AI</h2>}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="text-gray-300 hover:text-white transition-colors p-1"
        >
          {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => {
            setCurrentView('main');
            setCurrentScene(null);
            setCurrentCut(null);
            setMessages([{
              id: 1,
              sender: 'ai',
              content: "Hello! I'm here to help you create amazing videos. What kind of video would you like to make today?",
              timestamp: new Date()
            }]);
            setScenes([]);
            setCuts([]);
            setKeyframes([]);
          }}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
            currentView === 'main'
              ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30'
              : 'text-gray-300 hover:bg-white/5 hover:text-white'
          } ${sidebarCollapsed ? 'justify-center' : ''}`}
          title={sidebarCollapsed ? 'Main Chat' : ''}
        >
          <Home size={20} />
          {!sidebarCollapsed && <span>Main Chat</span>}
        </button>

        {scenes.length > 0 && (
          <>
            {!sidebarCollapsed && (
              <div className="px-4 py-2 text-gray-400 text-sm font-medium">Scenes</div>
            )}
            {scenes.map(scene => (
              <button
                key={scene.id}
                onClick={() => handleSceneClick(scene)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  currentView === `scene-${scene.id}`
                    ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
                title={sidebarCollapsed ? `Scene ${scene.id}` : ''}
              >
                <Film size={20} />
                {!sidebarCollapsed && <span>Scene {scene.id}</span>}
              </button>
            ))}
          </>
        )}

        {cuts.length > 0 && currentScene && (
          <>
            {!sidebarCollapsed && (
              <div className="px-4 py-2 text-gray-400 text-sm font-medium">Cuts</div>
            )}
            {cuts.map(cut => (
              <button
                key={cut.id}
                onClick={() => handleCutClick(cut)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-gray-300 hover:bg-white/5 hover:text-white"
                title={sidebarCollapsed ? `Cut ${cut.id}` : ''}
              >
                <Scissors size={20} />
                {!sidebarCollapsed && <span>Cut {cut.id}</span>}
              </button>
            ))}
          </>
        )}
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-pink-950">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold"></h1>
            {currentScene && (
              <p className="text-gray-300 text-sm mt-1">Working on: Scene {currentScene.id} - {currentScene.title}</p>
            )}
          </div>
        </div>

        {/* Chat Container */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
        >
          {messages.map((message) => (
            <div key={message.id} className="space-y-4">
              <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-4xl">
                  {message.sender === 'ai' ? (
                    <div className="text-gray-400 text-sm mb-2 flex items-center space-x-2">
                      <MessageCircle size={16} />
                      <span>AI Assistant</span>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm mb-2 text-right">
                      <span>You</span>
                    </div>
                  )}
                  <div className={`rounded-2xl px-6 py-4 ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white ml-auto'
                      : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
                  }`}>
                    <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>

              {/* Scene Cards */}
              {message.hasScenes && scenes.length > 0 && (
                <div className="space-y-4 max-w-4xl">
                  <div className="text-purple-200 text-lg font-semibold mb-4">Script Scenes</div>
                  <div className="grid gap-4">
                    {scenes.map(scene => (
                      <SceneCard key={scene.id} scene={scene} />
                    ))}
                  </div>
                </div>
              )}

              {/* Cut Cards */}
              {message.hasCuts && cuts.length > 0 && (
                <div className="space-y-4 max-w-4xl">
                  <div className="text-blue-200 text-lg font-semibold mb-4">Scene Cuts</div>
                  <div className="grid gap-4">
                    {cuts.map(cut => (
                      <CutCard key={cut.id} cut={cut} />
                    ))}
                  </div>
                </div>
              )}

              {/* Keyframe Cards */}
              {message.hasKeyframes && keyframes.length > 0 && (
                <div className="space-y-4 max-w-4xl">
                  <div className="text-green-200 text-lg font-semibold mb-4">Keyframes</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {keyframes.map(keyframe => (
                      <KeyframeCard key={keyframe.id} keyframe={keyframe} />
                    ))}
                  </div>
                  <div className="text-gray-400 text-sm mt-2">
                    Click on a keyframe to generate the video
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-white/80 text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-black/20 backdrop-blur-sm border-t border-white/10 p-6">
          <div className="flex space-x-4">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tell me about your video idea..."
              className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none"
              rows="1"
              style={{minHeight: '60px'}}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 text-white rounded-2xl px-8 py-4 font-semibold transition-all duration-200 flex items-center space-x-2 disabled:cursor-not-allowed"
            >
              <Send size={20} />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiDiscoveryChat;