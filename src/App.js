import { Network, TatumSDK } from "@tatumio/tatum";
import React, { useState } from "react";

import "./styles.css";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [txId, setTxId] = useState("");

  const mintNFT = async () => {
    setLoading(true);

    try {
      const resp = await fetch(
        `https://api.tatum.io/v3/nft/mint`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 't-66133e85e32260001c2acd61-ff6748c4b97344578e224e67'
          },
          body: JSON.stringify({
            chain: 'ETH',
            to: '0x519Ff9BEFa4127688900C31922350103aA5495e6',
            url: 'https://benchmark-nft.com'
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