import React, { useState } from "react";
import { onMessageListener } from "./firebase";

import "./styles.css";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [txId, setTxId] = useState("");
  const [result, setResult] = useState();

  onMessageListener()
    .then((payload) => {
      let results = {};
      if (payload.data.status === "SUCCESS") {
        results.returnData = payload.data?.returnData ? JSON.parse(payload.data.returnData) : null;
        results.status = "SUCCESSFUL";
        setResult(results);
        console.log("Results via message", results);
      } else {
        console.log(payload);
      }
    })
    .catch((err) => console.log("failed: ", err)
    );

  const mintNFT = async () => {
    setLoading(true);
    try {
      const bodyContent = {
        "jobName": "SChare-NFT-ETH",
        "serviceID": "6613c2f94d24e801605270b3",
        "firebaseMessagingToken": "f2l-nfA6XC7JIdlhAxskBP:APA91bHltzeqStJkmOXGAzV3chI7XqQqEJvFD2FLxcVKTfCAPGpC-lFhQY1LCEnoNZhkD9I0_HXCMUmATogo026_-_VxY_1nmh1INDxu0czbz3SVDkEMBvovY8WAcMs8Sr_UsId4IviE",
        "datafileURL": {
          "url": "",
          "json": {
            "url": "https://schare-nft.com",
            "receiver": "0x519Ff9BEFa4127688900C31922350103aA5495e6"
          }
        }
      };

      const resp = await fetch(
        `https://baas-be.fly.dev/api/job/createJob`,
        {
          method: 'POST',
          headers: {
            'X-API-KEY': '0N6QC62FNRQR9QGPK9XG7ZXEZL70ZQ9K',
            'X-SIGNATURE': '1d79dd04fa4bafc97c07161f6a82810807b1d1eb5b140f19f318d7abbf5929c7',
            'Content-Type': 'application/json' // Make sure to set the content type to 'application/json'
          },
          body: JSON.stringify(bodyContent)
        }
      );

      const data = await resp.json();
      console.log(data);
      setTxId(data);
    } catch (e) {
      setError(JSON.stringify(e));
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Mint Sepolia NFT</h1>
      <button disabled={loading} onClick={mintNFT} >MINT</button>
      <div className="result">
        {loading && <span id="loader"></span>}
        {txId && <h2 id="txId">{txId.toString()}</h2>}
        {result && <h2 id="result">{JSON.stringify(result, undefined, 2)}</h2>}
        {error && <div id="error">{error}</div>}
      </div>
    </div>
  )
}