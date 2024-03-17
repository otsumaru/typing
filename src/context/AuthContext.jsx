import { signInWithPopup, signOut } from "firebase/auth";
import React, { useContext } from "react";
import { createContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, provider } from "../firebaseInit";

const AuthContext = createContext();
// AuthContextProvider (Provider)
export const AuthContextProvider = ({ children }) => {
  // ユーザ管理
  const [user, loading, error] = useAuthState(auth);

  // サインイン処理
  const SigninWithGoogle = async () => {
    try {
      // Google ログインのポップアップ表示して認証結果取得
      const result = await signInWithPopup(auth, provider);
      const signedInUser = result.user;
      console.log("サインイン成功:", signedInUser.displayName);
    } catch (error) {
      console.error("サインインエラー:", error.message);
    }
  };

  // サインアウト処理
  const signOutUser = () => {
    signOut(auth);
    console.log("サインアウト成功");
  };

  // ログイン情報設定したProvider
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        SigninWithGoogle,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
