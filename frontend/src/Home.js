import "./App.css";

import { useCallback, useEffect, useMemo, useState } from "react";

import axios from "axios";

const MAX_IMAGE_SIZE = 1000000;
const API_ENDPOINT =
  "https://rdkch656t6.execute-api.ap-northeast-2.amazonaws.com/prod/uploads";

function Home() {
  const authorize_endpoint =
    "https://upload-user-pool.auth.ap-northeast-2.amazoncognito.com/oauth2/authorize";
  const client_id = "2km9v2t54el6t0g06pbg8ukd4t";
  const redirect_uri = "http://localhost:3000/callback";
  const scope = "openid email get-signed-url-api/read_signed_url";

  const goToLoginPage = useCallback(() => {
    window.location.replace(
      `${authorize_endpoint}?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`
    );
  }, []);

  const isLogined = useMemo(() => {
    return typeof localStorage.getItem("access_token") === "string";
  }, []);

  const [image, setImage] = useState(null);
  const [uploadURL, setUploadURL] = useState("");

  const createImage = useCallback(file => {
    let reader = new FileReader();
    reader.onload = e => {
      console.log(`length: ${e.target.result.includes("data:image/jpeg")}`);
      if (!e.target.result.includes("data:image/jpeg"))
        return alert("Wrong file type - JPG only");
      if (e.target.result.length > MAX_IMAGE_SIZE)
        return alert("Image is too large");
      setImage(e.target.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const uploadImage = useCallback(
    async e => {
      console.log("Upload clicked");

      const accessToken = localStorage.getItem("access_token");
      console.log(accessToken);
      let resp;
      try {
        resp = await axios({
          url: API_ENDPOINT,
          method: "GET",
          headers: {
            'Access-Control-Allow-Origin': '*',
            Authorization: accessToken
          }
        });
      } catch (e) {
        console.log(`${JSON.stringify(e)}`);
      }
      console.log(`Response: ${resp}`);
      console.log(`Uploading: ${image}`);

      const binary = atob(image.split(",")[1]);
      const array = binary.map((b, i) => b.charCodeAt(i));

      const blobData = new Blob([new Uint8Array(array)], {
        type: "image/jpeg"
      });
      console.log(`Uploading to: ${resp.uploadURL}`);

      const result = await axios.put(resp.uploadURL, {
        method: "PUT",
        body: blobData
      });
      console.log(`Result: ${result}`);

      setUploadURL(resp.uploadURL.split("?")[0]);
    },
    [image]
  );

  const removeImage = useCallback(() => {
    console.log("Remove Clicked");
    setImage(null);
  }, []);

  const onFileChange = useCallback(
    e => {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      createImage(files[0]);
    },
    [createImage]
  );

  useEffect(() => {
    console.log(image, uploadURL);
  }, [image, uploadURL]);

  return (
    <div>
      {!isLogined ? (
        <button type="button" onClick={goToLoginPage}>
          로그인
        </button>
      ) : (
        <div>
          <h1>S3 Uploader Test</h1>
          {image === null ? (
            <div>
              <h2>Select an image</h2>
              <input type="file" onChange={onFileChange} />
            </div>
          ) : (
            <div>
              <img src={image} />
              {!uploadURL ? (
                <>
                  <button onClick={uploadImage}>Upload image</button>
                  <button onClick={removeImage}>Remove image</button>
                </>
              ) : (
                <h2>Success! Image uploaded to bucket.</h2>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
