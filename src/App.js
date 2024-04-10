import React, { useState } from "react";
import { onMessageListener, fetchToken } from "./firebase";
import { differenceInMilliseconds } from "date-fns";

import "./styles.css";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [txId, setTxId] = useState("");
  const [result, setResult] = useState();
  const [startTime, setStartTime] = useState();
  let endTime;

  onMessageListener()
    .then((payload) => {
      endTime = new Date();
      let results = {};
      if (payload.data.status === "SUCCESS") {
        results.returnData = payload.data?.returnData ? JSON.parse(payload.data.returnData) : null;
        results.status = "SUCCESSFUL";
        results.duration = differenceInMilliseconds(
          startTime,
          endTime
        ) / 1000;
        setResult(results);
        console.log("Results via message", results);
      } else {
        console.log(payload);
      }
    })
    .catch((err) => console.log("failed: ", err)
    );

  const mintNFT = async () => {
    setStartTime(new Date());

    setLoading(true);
    try {
      const fbToken = await fetchToken();
      const bodyContent = {
        "jobName": "SChare-NFT-ETH",
        "serviceID": "6613c2f94d24e801605270b3",
        "firebaseMessagingToken": fbToken,
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
            'X-API-KEY': process.env.REACT_APP_SCHARE_API_KEY,
            'X-SIGNATURE': process.env.REACT_APP_SCHARE_SIGNATURE,
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
      <h1>Sepolia NFT Minter</h1>
      <button disabled={loading} onClick={mintNFT} >MINT</button>
      <div className="result">
        {loading && <span id="loader"></span>}
        {txId && <h2 id="txId">Job ID on SChare {txId.data.toString()}</h2>}
        {result && <h2 id="result">{JSON.stringify(result, undefined, 2)}</h2>}

        {error && <div id="error">{error}</div>}
      </div>
    </div>
  )
}