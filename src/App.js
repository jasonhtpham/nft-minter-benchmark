import React, { useState } from "react";
import { onMessageListener } from "./firebase";

import "./styles.css";

export default function App() {
  // const [address, setAddress] = useState("0xa679c6154b8d4619Af9F83f0bF9a13A680e01eCf");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [txId, setTxId] = useState("");
  const [result, setResult] = useState();

  // const getBalance = async () => {
  //   setLoading(true);
  //   setError(null);
  //   setBalance(null);

  //   const tatum = await TatumSDK.init({
  //     network: Network.ETHEREUM,
  //     apiKey: {
  //       v4: "t-66133e85e32260001c2acd61-ff6748c4b97344578e224e67"
  //     }
  //   });

  //   try {
  //     const bal = await tatum.address.getBalance({
  //       addresses: [address],
  //     });

  //     if (!bal || !bal.data) {
  //       const err = bal.error && bal.error.message[0];
  //       setError(err || "Unknown error");
  //     } else {
  //       for (const data of bal.data) {
  //         if (data.type === "native") {
  //           setBalance(`${data.balance} ${data.asset}`);
  //           break;
  //         }
  //       }
  //     }
  //   } catch (e) {
  //     setError(JSON.stringify(e));
  //   }

  //   tatum.destroy();
  //   setLoading(false);
  // }

  const deployNFT = async () => {
    try {
      const resp = await fetch(
        `https://api.tatum.io/v3/nft/deploy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 't-66133e85e32260001c2acd61-ff6748c4b97344578e224e67'
          },
          body: JSON.stringify({
            chain: 'ETH',
            name: 'Benchmark NFT',
            symbol: 'BTK',
            fromPrivateKey: '503105f075adbec67e245f9c99f08ba8889d7bb33810148f4f118f7c34b23a09'
          })
        }
      );

      const data = await resp.json();
      console.log(data);
      setTxId(data.txId);
    } catch (e) {
      setError(JSON.stringify(e));
    }

    setLoading(false);
  }

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
    try {
      const bodyContent = {
        "jobName": "SChare-NFT-ETH",
        "serviceID": "65efa9eb52792c01607abfc3",
        "firebaseMessagingToken": "f2l-nfA6XC7JIdlhAxskBP:APA91bHltzeqStJkmOXGAzV3chI7XqQqEJvFD2FLxcVKTfCAPGpC-lFhQY1LCEnoNZhkD9I0_HXCMUmATogo026_-_VxY_1nmh1INDxu0czbz3SVDkEMBvovY8WAcMs8Sr_UsId4IviE",
        "datafileURL": {
          "url": "",
          "json": {
            "assetName": "SChare NFT",
            "assetUnitName": "SCT",
            "totalSupply": 1,
            "decimals": 0,
            "assetURL": "https://schare-nft.com",
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
      {/* <label>
        <b>Wallet address</b> (Default: Mark Cuban&apos;s address)
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
      </label> */}
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