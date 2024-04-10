import React, { useState } from "react";
import { differenceInMilliseconds } from "date-fns";
import "./styles.css";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [txId, setTxId] = useState("");

  const mintNFT = async () => {
    let end;
    let start = new Date();
    setLoading(true);

    try {
      const resp = await fetch(
        `https://api.tatum.io/v3/nft/mint`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.REACT_APP_TATUM_API_KEY
          },
          body: JSON.stringify({
            chain: 'ETH',
            to: '0x519Ff9BEFa4127688900C31922350103aA5495e6',
            url: 'https://benchmark-nft.com'
          })
        }
      );

      const data = await resp.json();
      end = new Date();

      console.log(data);
      setTxId(data.txId);
    } catch (e) {
      setError(JSON.stringify(e));
    }
    console.log("Duration: ", differenceInMilliseconds(end, start) / 1000)
    setLoading(false);
  }

  return (
    <div className="container">
      <h1>Mint NFT Benchmark</h1>
      <button disabled={loading} onClick={mintNFT} >MINT</button>
      <div className="result">
        {loading && <span id="loader"></span>}
        {txId && <h2 id="txId">{txId}</h2>}
        {error && <div id="error">{error}</div>}
      </div>
    </div>
  )
}