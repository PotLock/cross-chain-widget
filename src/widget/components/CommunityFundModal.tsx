import React, { useRef } from "react";
import { useMediaQuery } from "react-responsive";

const blockchainAddresses: Record<string, string> = {
  btc: "bc1q0fnht2ngtaeexp3gypd55k5ejfwxtgxmdmx0gh",
  zec: "t1bQtaCMoFhf1654BEZqNXTnwuFGSvQADFH",
  ton: "UQCl-Z6_RKnINhWTZIIzysIGjyZTcJsRscdaKP-Oof-PfOne",
  doge: "DHpEpCboQcnxNWpVknvc9dpx3Q1TeHmUH",
  sol: "BK3HqkkH9T8QSsiXDvWSdfYEojviAHrhqeCXP1zvADbU",
  near: "potlock.near",
  xrp: "rsGvT1oyqRx5Ls6qmq6Q3Tuh8GCFLZVPxM",
  sui: "0x27e5a115617a8c2c4dfb5da3f3a88d70cfae7bf59cfc739a60792db15e31656c",
};

const EVM_ADDRESS = "0x88B93d4D440155448fbB3Cf260208b75FC0117C0";
const evmChains = ["eth", "arb", "arbitrum", "gnosis", "base", "bera", "pol", "tron", "avax", "op"];

// Define how to generate explorer links for each chain
const explorerLinks: Record<string, (address: string) => string> = {
  btc: (addr) => `https://blockchair.com/bitcoin/address/${addr}`,
  zec: (addr) => `https://zecblockexplorer.com/address/${addr}`,
  ton: (addr) => `https://tonviewer.com/${addr}`,
  doge: (addr) => `https://dogechain.info/address/${addr}`,
  sol: (addr) => `https://solscan.io/address/${addr}`,
  near: (addr) => `https://nearblocks.io/address/${addr}`,
  xrp: (addr) => `https://xrpscan.com/account/${addr}`,
  sui: (addr) => `https://suiscan.xyz/mainnet/address/${addr}`,
  eth: (addr) => `https://etherscan.io/address/${addr}`,
  arb: (addr) => `https://arbiscan.io/address/${addr}`,
  arbitrum: (addr) => `https://arbiscan.io/address/${addr}`,
  gnosis: (addr) => `https://gnosisscan.io/address/${addr}`,
  base: (addr) => `https://basescan.org/address/${addr}`,
  bera: (addr) => `https://berascan.com/address/${addr}`,
  pol: (addr) => `https://polygonscan.com/address/${addr}`,
  tron: (addr) => `https://tronscan.org/#/address/${addr}`,
  avax: (addr) => `https://snowtrace.io/address/${addr}`,
  op: (addr) => `https://optimistic.etherscan.io/address/${addr}`,
};

const CommunityFundModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery({ maxWidth: 640 });

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.65)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          padding: isMobile ? "20px" : "30px",
          borderRadius: "15px",
          width: isMobile ? "75%" : "300px",
          maxHeight: "55vh",
          overflowY: "auto",
          position: "relative",
          fontFamily: "'Mona Sans', sans-serif",
          boxShadow: "0 12px 35px rgba(0, 0, 0, 0.15)",
          border: "1px solid #e6ecef",
          color: "#000000",
          scrollbarWidth: "none",    
          msOverflowStyle: "none", 
        }}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 600,
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Potlock Community Fund Links
        </h2>

        {Object.entries(blockchainAddresses).map(([chain, address]) => (
          <a
            key={chain}
            href={explorerLinks[chain]?.(address)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              textAlign: "center",
             background: "#000000",
            color: "#ffffff",
              padding: "13px",
              borderRadius: "30px",
              textDecoration: "none",
              marginBottom: "12px",
              fontWeight: 500,
              transition: "all 0.2s",
              border: "1px solid #e2e8f0",
              width: "150px",
              marginLeft: "auto",
              marginRight: "auto",
              fontFamily: "'Mona Sans', sans-serif",
                fontSize: 15
            }}
            onMouseOver={(e) => {
              (e.currentTarget.style.background = "#111827");
            }}
            onMouseOut={(e) => {
              (e.currentTarget.style.background = "#000000");
            }}
          >
            {chain.toUpperCase()}
          </a>
        ))}
        {evmChains.map((chain) => (
          <a
            key={chain}
            href={explorerLinks[chain](EVM_ADDRESS)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                display: "block",
                textAlign: "center",
               background: "#000000",
              color: "#ffffff",
                padding: "13px",
                borderRadius: "30px",
                textDecoration: "none",
                marginBottom: "12px",
                fontWeight: 500,
                transition: "all 0.2s",
                border: "1px solid #e2e8f0",
                width: "150px",
                marginLeft: "auto",
                marginRight: "auto",
                fontFamily: "'Mona Sans', sans-serif",
                fontSize: 15
            }}
            onMouseOver={(e) => {
                (e.currentTarget.style.background = "#111827");
              }}
              onMouseOut={(e) => {
                (e.currentTarget.style.background = "#000000");
              }}
          >
            {chain.toUpperCase()}
          </a>
        ))}

     
      </div>
    </div>
  );
};

export default CommunityFundModal;