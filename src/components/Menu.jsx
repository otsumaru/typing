import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Btn from "./Btn";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Menu = (props) => {
  const { title, toggleSoundEffect, soundEffectFlag } = props;
  const { user } = useAuth();
  const [isSettingVisble, setIsSettingVisble] = useState(false);
  const [isRankingVisble, setIsRankingVisble] = useState(false);
  const navigate = useNavigate();
  const handleGameStartClick = () => {
    navigate("/game");
  };
  // TODO モーダル
  const SettingModal = () => {
    const handleShow = () => setIsSettingVisble(true);
    const handleClose = () => setIsSettingVisble(false);

    return (
      <div className="d-grid toggle-setting">
        <Btn onClick={handleShow} text="せってい" className="bi bi-gear"></Btn>
        <Modal show={isSettingVisble} size="sm" onHide={handleClose} centered>
          <div className="p-3">
            <h2 className="my-3">せってい</h2>
            <Form>
              <div key="soundEffect" className="mb-3">
                <Form.Check
                  type={"checkbox"}
                  id="soundEffect"
                  label={
                    <div className="fs-5">
                      <span className="mx-4">こうかおん</span>
                      {soundEffectFlag ? (
                        <i className="bi bi-volume-up"></i>
                      ) : (
                        <i className="bi bi-volume-mute"></i>
                      )}
                    </div>
                  }
                  checked={soundEffectFlag}
                  onChange={toggleSoundEffect}
                />
              </div>
            </Form>
            <div className="d-flex justify-content-center">
              <Button variant="secondary" onClick={handleClose}>
                とじる
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  };

  // メニューボタン作成
  const MenuButton = () => {
    return (
      <div className="d-grid gap-2">
        <Btn
          onClick={handleGameStartClick}
          text="はじめる"
          className="bi bi-keyboard"
        ></Btn>
        <div className="d-grid toggle-setting">
          <SettingModal />
        </div>
        <div className="d-grid toggle-ranking">
          <Btn
            onClick={() => {
              alert("未完成です");
            }}
            text="ランキング"
            className="bi bi-trophy"
          ></Btn>
        </div>
      </div>
    );
  };

  // メニュー画面
  return (
    <div className="menu">
      <h1 className="mt-5 mb-0 fs-1">{title}</h1>
      <p className="mb-0">１日１回１分</p>
      {user ? (
        <p>ようこそ、{user.displayName}さん</p>
      ) : (
        <p>ゲストユーザーとしてログインしています。</p>
      )}
      <div className="BtnContainer">
        <MenuButton />
      </div>
    </div>
  );
};

export default Menu;
