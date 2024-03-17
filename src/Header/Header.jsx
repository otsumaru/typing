import React from "react";
import { useAuth } from "../context/AuthContext"; // 正しいパスを確認してください

const Header = ({ title, soundEffectFlag, toggleSoundEffect }) => {
  // useContextをuseAuthフックに置き換えます。
  const { user, SigninWithGoogle, signOutUser } = useAuth();

  return (
    <header className="header">
      <h1 className="d-flex align-items-center">{title}</h1>
      <div className="d-flex">
        <button onClick={toggleSoundEffect} className="headerButton">
          <i
            className={
              soundEffectFlag ? "bi bi-volume-up" : "bi bi-volume-mute"
            }
          ></i>
        </button>
        <button className="headerButton">
          <i className="bi bi-trophy"></i>
        </button>
        {user ? (
          <>
            <button className="headerButton" onClick={signOutUser}>
              サインアウト
            </button>
            <button className="headerButton">
              <img
                className="userIcon"
                src={user.photoURL}
                alt="プロフィール画像"
              />
            </button>
          </>
        ) : (
          <button className="headerButton" onClick={SigninWithGoogle}>
            サインイン
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
