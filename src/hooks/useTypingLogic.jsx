import React from "react";
import { useEffect, useState } from "react";

const useTypingLogic = (
  writings,
  gameStarted,
  soundEffectFlag,
  PlaycorrectSound,
  PlayWrongSound
) => {
  // writingsファイルの文章のストック数
  const writingLength = writings.length;
  // タイプする文章
  const [currentSentence, setCurrentSentence] = useState({
    japanese: "",
    romaji: "",
  });
  // 入力するローマ字リスト
  const romajiArray = currentSentence.romaji.split("");
  // 何文字目か
  const [currentCharId, setCurrentCharId] = useState(0);
  // スコア
  const [score, setScore] = useState(0);
  // ミス
  const [miss, setMiss] = useState(0);
  // ミスを一文字一回まで
  const [missCountable, setMissCountable] = useState(true);
  // 正確さ
  const [accuracy, setAccuracy] = useState(100);
  // 特別な文字の判定フラグ
  const [specialLogic, setSpecialLogic] = useState(null);

  // 文章の更新
  const changeSentence = () => {
    const index = Math.floor(Math.random() * writingLength);
    setCurrentSentence({
      japanese: writings[index].japanese,
      romaji: writings[index].romaji,
    });
    setCurrentCharId(0);
    setScore((prevScore) => prevScore + 1);
  };

  // accuracyの更新
  useEffect(() => {
    if (score + miss > 0) {
      setAccuracy((100 * score) / (score + miss));
    } else {
      setAccuracy(100);
    }
  }, [score, miss]);

  // 入力の判定
  useEffect(() => {
    if (gameStarted) {
      const keyDownHandler = (e) => {
        const expectedChar = romajiArray[currentCharId];
        IsCorrect(e.key, expectedChar);
      };
      window.addEventListener("keydown", keyDownHandler);
      return () => {
        window.removeEventListener("keydown", keyDownHandler);
      };
    }
  }, [
    gameStarted,
    currentCharId,
    currentSentence.romaji,
    missCountable,
    soundEffectFlag,
  ]); //ミスカウントを一回に制御

  // 判定ロジック
  const IsCorrect = (typedChar, expectedChar) => {
    // 正しいキー入力で実行する関数
    const handleCorrectChar = () => {
      setCurrentCharId((prevId) => prevId + 1);
      setScore((prevScore) => prevScore + 1);
      setMissCountable(true);
      if (soundEffectFlag) {
        PlaycorrectSound();
      }
    };

    // 間違えたときに実行される関数
    const handleWrongChar = () => {
      if (missCountable) {
        setMiss((prev) => prev + 1);
        setMissCountable(false);
      }
      if (soundEffectFlag) {
        PlayWrongSound();
      }
    };

    // 特別な判定の文字に対して文章を変更する
    const updateRomajiAndSetSentence = (updateLogic) => {
      setCurrentSentence((prevSentence) => {
        const romajiArray = prevSentence.romaji.split("");
        updateLogic(romajiArray); // 引数の関数をromajiArrayに適用
        const newRomaji = romajiArray.join("");
        return {
          japanese: prevSentence.japanese,
          romaji: newRomaji,
        };
      });
    };

    // 共通ロジックを定義
    const judgeChar = (
      typedChar,
      expectedChar,
      specialLogicChar,
      anotherCorrectChar,
      updateLogic
    ) => {
      if (typedChar === expectedChar) {
        if (currentCharId < romajiArray.length - 1) {
          handleCorrectChar();
          setSpecialLogic(specialLogicChar);
        } else {
          // 文末に到達した場合、次の文をロード
          changeSentence();
          if (soundEffectFlag) {
            PlaycorrectSound();
          }
        }
      } else if (typedChar === anotherCorrectChar) {
        updateRomajiAndSetSentence(updateLogic);
        handleCorrectChar();
        setSpecialLogic(specialLogicChar);
      } else {
        handleWrongChar();
      }
    };

    // 特別な判定
    if (specialLogic) {
      switch (specialLogic) {
        case "shi": //shiとsiのロジック
          judgeChar(typedChar, expectedChar, null, "i", (romajiArray) => {
            romajiArray.splice(currentCharId, 1);
          });
          break;
        case "chi": //chiとciのロジック
          judgeChar(typedChar, expectedChar, null, "i", (romajiArray) => {
            romajiArray.splice(currentCharId, 1);
          });
          break;
        case "tsu": //tsuとtuのロジック
          judgeChar(typedChar, expectedChar, null, "u", (romajiArray) => {
            romajiArray.splice(currentCharId, 1);
          });
          break;
        default:
          if (specialLogic[0] === "n" && specialLogic[1] !== "n") {
            // 一文字目n二文字目n以外のロジック
            judgeChar(typedChar, expectedChar, null, "n", (romajiArray) => {
              romajiArray.splice(currentCharId, 0, "n");
            });
          } else if (["s", "c"].includes(specialLogic[0])) {
            //shaとsya,chaとcyaなどのロジック
            judgeChar(typedChar, expectedChar, null, "y", (romajiArray) => {
              romajiArray.splice(currentCharId, 1, "y");
            });
          } else if (specialLogic[0] === "j") {
            //jaとjyaのロジック
            judgeChar(typedChar, expectedChar, null, "y", (romajiArray) => {
              romajiArray.splice(currentCharId, 0, "y");
            });
          }
          break;
      }
    } else {
      // 普通の判定
      const nextChar = romajiArray[currentCharId + 1];
      const nextNextChar = romajiArray[currentCharId + 2];
      // const specialLogicChar = expectedChar + nextChar + nextNextChar;
      const specialLogicChar =
        romajiArray[currentCharId] +
        romajiArray[currentCharId + 1] +
        romajiArray[currentCharId + 2];

      switch (expectedChar) {
        case "s":
          if (nextChar === "h") {
            judgeChar(typedChar, expectedChar, specialLogicChar);
          } else {
            judgeChar(typedChar, expectedChar);
          }
          break;
        case "c":
          // cchiやcchaのときtti,cciやttya,cchaを許容
          if (nextChar === "c") {
            if (romajiArray[currentCharId + 3] === "i") {
              judgeChar(typedChar, expectedChar, null, "t", (romajiArray) => {
                romajiArray.splice(currentCharId, 2, "t", "t");
                romajiArray.splice(currentCharId + 2, 1);
              });
            } else {
              judgeChar(typedChar, expectedChar, null, "t", (romajiArray) => {
                romajiArray.splice(currentCharId, 2, "t", "t");
                romajiArray.splice(currentCharId + 2, 1, "y");
              });
            }
          } else if (nextNextChar === "i") {
            judgeChar(
              typedChar,
              expectedChar,
              specialLogicChar,
              "t",
              (romajiArray) => {
                romajiArray.splice(currentCharId, 1, "t");
                romajiArray.splice(currentCharId + 1, 1);
              }
            );
          } else {
            judgeChar(
              typedChar,
              expectedChar,
              specialLogicChar,
              "t",
              (romajiArray) => {
                romajiArray.splice(currentCharId, 1, "t");
                romajiArray.splice(currentCharId + 1, 1, "y");
              }
            );
          }
          break;
        case "t":
          if (nextChar === "s") {
            judgeChar(typedChar, expectedChar, specialLogicChar);
          } else {
            judgeChar(typedChar, expectedChar);
          }
          break;
        case "f":
          if (nextChar === "u") {
            judgeChar(typedChar, expectedChar, null, "h", (romajiArray) => {
              romajiArray.splice(currentCharId, 1, "h");
            });
          } else if (specialLogicChar === "ffu") {
            judgeChar(typedChar, expectedChar, null, "h", (romajiArray) => {
              romajiArray.splice(currentCharId, 2, "h", "h");
            });
          } else {
            judgeChar(typedChar, expectedChar);
          }
          break;
        case "j":
          if (nextChar === "j") {
            // jjiやjjaのときzziやzzyaを許容
            if (nextNextChar === "i") {
              judgeChar(typedChar, expectedChar, null, "z", (romajiArray) => {
                romajiArray.splice(currentCharId, 2, "z", "z");
              });
            } else {
              judgeChar(typedChar, expectedChar, null, "z", (romajiArray) => {
                romajiArray.splice(currentCharId, 2, "z", "z");
                romajiArray.splice(currentCharId + 2, 1, "y");
              });
            }
          } else if (nextNextChar === "i") {
            judgeChar(typedChar, expectedChar, null, "z", (romajiArray) => {
              romajiArray.splice(currentCharId, 1, "z");
            });
          } else {
            judgeChar(typedChar, expectedChar, null, "z", (romajiArray) => {
              romajiArray.splice(currentCharId, 1, "z");
              romajiArray.splice(currentCharId + 1, 1, "y");
            });
          }
          break;
        case "n":
          if (["a", "i", "u", "e", "o", "n"].includes(nextChar)) {
            judgeChar(typedChar, expectedChar);
          } else {
            judgeChar(typedChar, expectedChar, specialLogicChar);
          }
          break;
        default:
          judgeChar(typedChar, expectedChar);
          break;
      }
    }
  };

  // 入力された文字の色を変更
  const romajiChars = romajiArray.map((char, index) => {
    const style = index < currentCharId ? { color: "#cccfd2" } : {};
    return (
      <span key={index} style={style}>
        {char}
      </span>
    );
  });

  return {
    score,
    miss,
    accuracy,
    romajiChars,
    currentSentence,
    changeSentence,
  };
};

export default useTypingLogic;
