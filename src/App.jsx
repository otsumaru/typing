import "./App.css";
import React, { useState, Suspense, lazy } from "react";
import Header from "./Header/Header";
import Menu from "./components/Menu";
import { useRoutes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// 遅延読み込みするコンポーネント
const TypingPhase = lazy(() => import("./components/TypingPhase"));
const GameResult = lazy(() => import("./components/GameResult"));

function App() {
  const { user } = useAuth();
  const [soundEffectFlag, setSoundEffectFlag] = useState(true);
  const title = "タイピングゲーム";

  const toggleSoundEffect = () => {
    setSoundEffectFlag(!soundEffectFlag);
  };

  const [result, setResult] = useState({
    score: null,
    keyStrokeRate: null,
    accuracy: null,
  });

  const routes = [
    {
      path: "/",
      element: (
        <Menu
          title={title}
          toggleSoundEffect={toggleSoundEffect}
          soundEffectFlag={soundEffectFlag}
        />
      ),
    },
    {
      path: "/game",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <TypingPhase
            soundEffectFlag={soundEffectFlag}
            setResult={setResult}
            result={result}
          />
        </Suspense>
      ),
    },
    {
      path: "/result",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <GameResult setResult={setResult} result={result} />
        </Suspense>
      ),
    },
  ];

  const element = useRoutes(routes);

  return (
    <>
      <Header
        soundEffectFlag={soundEffectFlag}
        toggleSoundEffect={toggleSoundEffect}
        title={title}
        user={user}
      />
      <div className="game-layout">
        <div className="gameContainer">{element}</div>
      </div>
    </>
  );
}

export default App;
