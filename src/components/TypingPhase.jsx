import React, { useState, useEffect } from "react";
import { writings } from "../writings/writings";
import { Modal } from "react-bootstrap";
import useSound from "use-sound";
import correctSound from "../sounds/press-correct-key.mp3";
import wrongSound from "../sounds/press-wrong-key.mp3";
import useTypingLogic from "../hooks/useTypingLogic";
import { useAuth } from "../context/AuthContext";
import Btn from "./Btn";
import { useNavigate } from "react-router-dom";
import useSaveGameData from "../hooks/useSaveGameData";

const TypingPhase = (props) => {
  // stateと変数
  const { soundEffectFlag, setResult } = props;
  // ユーザー情報
  const { user } = useAuth();
  // useNavigate フックを使用
  const navigate = useNavigate();
  // ゲーム開始フラグ
  const [gameStarted, setGameStarted] = useState(false);
  // 効果音
  const [PlaycorrectSound] = useSound(correctSound);
  const [PlayWrongSound] = useSound(wrongSound);
  // 時間
  const [timer, setTimer] = useState(60);
  // モーダル
  const [isOpen, setIsOpen] = useState(true);
  // カスタムフックスから
  const {
    score,
    miss,
    accuracy,
    romajiChars,
    currentSentence,
    changeSentence,
  } = useTypingLogic(
    writings,
    gameStarted,
    soundEffectFlag,
    PlaycorrectSound,
    PlayWrongSound
  );
  const { saveScore } = useSaveGameData();

  // モーダル閉じると同時に実行する
  const handleGameStarted = () => {
    changeSentence();
    setGameStarted(true);
    setTimer(60);
  };

  // カウントダウンの制御
  useEffect(() => {
    if (gameStarted) {
      const interval = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(interval); // タイマーを停止
            setGameStarted(false); // ゲーム終了の状態にする
            return 0; // タイマーを0に設定
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStarted]);

  // 開始前
  const BeforeGameModal = ({ isOpen, setIsOpen }) => {
    // カウントダウンの状態を管理するためのState
    const [countdown, setCountdown] = useState(null);
    // カウントダウンが開始されたかの状態
    const [isCountdownStarted, setIsCountdownStarted] = useState(false);
    // キーボードイベントを処理する関数
    const handleKeyDown = (event) => {
      // スペースキーかエンターキーが押された場合
      if (
        (event.keyCode === 32 || event.keyCode === 13) &&
        !isCountdownStarted
      ) {
        startCountdown();
      }
    };
    const startCountdown = () => {
      setIsCountdownStarted(true);
      let counter = 3;
      setCountdown(counter);
      const interval = setInterval(() => {
        counter--;
        setCountdown(counter);
        if (counter === 0) {
          clearInterval(interval);
          setIsOpen(false); // モーダルを即座に閉じる
          handleGameStarted(); // ゲーム開始関数を呼び出し
        }
      }, 1000);
    };

    useEffect(() => {
      // コンポーネントがマウントされたらキーボードイベントのリスナーを追加
      document.addEventListener("keydown", handleKeyDown);
      // コンポーネントがアンマウントされる前にリスナーを削除
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, []); // 空の依存配列を指定して、エフェクトをコンポーネントのマウント時とアンマウント時にのみ実行

    // モーダルを閉じたらカウント開始
    if (!isOpen) return null;

    return (
      <Modal size="lg" show={isOpen} centered id="beforeGamingModal">
        <div className="modal">
          {countdown === null && (
            <p className="fs-3 soft-blink">
              スペースキーまたはエンターキーを押して開始
            </p>
          )}
          {/* カウントダウンが進行中であれば表示 */}
          {countdown > 0 && (
            <p className="fs-1">ゲーム開始まで {countdown}...</p>
          )}
        </div>
      </Modal>
    );
  };

  // ゲーム中
  const Gaming = () => {
    return (
      <div className="typingPhase">
        <p className="text-end">残り時間：{timer}</p>
        <p className="text-end">点数：{score}</p>
        <p className="text-end">ミス：{miss}</p>
        <p className="text-end">精度：{accuracy.toFixed(2)}%</p>
        <h1 className="mt-5">{currentSentence.japanese}</h1>
        <p className="custom-letter-spacing">{romajiChars}</p>
      </div>
    );
  };

  // TODO終了後
  const AfterGame = () => {
    // url遷移
    const handleResultClick = async () => {
      await saveScore(user, score);
      setResult({
        score: score,
        keyStrokeRate: (score / 60).toFixed(2),
        accuracy: accuracy.toFixed(2),
      });
      navigate("/result");
    };
    return (
      <div>
        <h1 className="mb-5">おわり！</h1>
        <Btn text={"けっかをみる"} onClick={handleResultClick} />
      </div>
    );
  };

  // 表示画面
  if (gameStarted) {
    return <Gaming />;
  } else {
    return timer === 0 ? (
      <AfterGame />
    ) : (
      <BeforeGameModal isOpen={isOpen} setIsOpen={setIsOpen} />
    );
  }
};

export default TypingPhase;
