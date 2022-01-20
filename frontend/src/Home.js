import "./App.css";

import { useCallback } from "react";

function Home() {
  const authorize_endpoint =
    "https://upload-user-pool.auth.ap-northeast-2.amazoncognito.com/oauth2/authorize";
  const client_id = "53kmmobgd8cc887mm79sd77m1h";
  const redirect_uri = "http://localhost:3000/callback";
  const scope = "openid email get-signed-url-api/read_signed_url";

  const goToLoginPage = useCallback(() => {
    window.location.replace(
      `${authorize_endpoint}?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`
    );
  }, []);

  return (
    <div>
      <button type="button" onClick={goToLoginPage}>
        로그인
      </button>
    </div>
  );
}

export default Home;
