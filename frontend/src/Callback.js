import "./App.css";

import { useCallback, useEffect } from "react";

import axios from "axios";
import queryString from "query-string";
import { useSearchParams } from "react-router-dom";

function Callback() {
  let [params] = useSearchParams();
  const code = params.get("code");

  const authorize_endpoint =
    "https://upload-user-pool.auth.ap-northeast-2.amazoncognito.com/oauth2/token";
  const client_id = "2km9v2t54el6t0g06pbg8ukd4t";
  const redirect_uri = "http://localhost:3000/callback";
  const scope = "openid email get-signed-url-api/read_signed_url";

  const qs = queryString.stringify({
    grant_type: "authorization_code",
    code,
    redirect_uri,
    client_id,
    scope
  });

  const getAccessToken = useCallback(async () => {
    try {
      const url = `${authorize_endpoint}`;
      const {
        data: { access_token, expires_in, id_token, refresh_token }
      } = await axios.post(url, qs, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      window.location.replace("/");
    } catch (e) {
      window.location.replace("/");
    }
  }, [qs]);

  useEffect(() => {
    getAccessToken();
  }, [getAccessToken]);

  return <div>{code}</div>;
}

export default Callback;
