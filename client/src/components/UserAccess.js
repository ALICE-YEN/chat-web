// 可以縮寫 rfc，產生模板

import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function UserAccess({ onIdSubmit }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <>
      {showLogin ? (
        <Login setShowLogin={setShowLogin} onIdSubmit={onIdSubmit} />
      ) : (
        <Register setShowLogin={setShowLogin} onIdSubmit={onIdSubmit} />
      )}
    </>
  );
}
