import React from "react";
import Btn from "./Btn";
import { useNavigate } from "react-router-dom";

const GameResult = (props) => {
  const { result, setResult } = props;
  // useNavigate フックを使用
  const navigate = useNavigate();
  const handleAgainClick = () => {
    setResult({
      score: null,
      keyStrokeRate: null,
      accuracy: null,
    });
    navigate("/game");
  };
  const handleMenuClick = () => {
    navigate("/");
  };
  return (
    <div className="gameResult">
      <h1 className="fs-1">結果</h1>
      <div>
        <p>{result.score}点</p>
        <p>{result.keyStrokeRate}打/秒</p>
        <p>{result.accuracy}%</p>
        <div className="d-flex align-items-center justify-content-center">
          <Btn text="もういちど" onClick={handleAgainClick}></Btn>
          <Btn text="メニューへ" onClick={handleMenuClick}></Btn>
        </div>
      </div>
    </div>
  );
};

export default GameResult;
