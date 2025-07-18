import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import QuitConfirmationModal from "./QuitConfirmationModal";

const Modal2 = ({
  onProceed,
  onClose,
  onGoBack,
  campaignID = 0,
  CampaignName = "",
  CampaignImg = "",
  CampaignDesc = "",
  walletID = null,
  textInfo= ''
}: {
  onProceed: (
    campaignID: number,
    amount: string,
    networkFee: string,
    blockchain: string,
    decimals: string,
    tokenId: string,
    senderAddress: string,
    tokenImg: string
  ) => void;
  onClose: () => void;
  onGoBack: () => void;
  campaignID?: number;
  CampaignName?: string;
  CampaignImg?: string;
  CampaignDesc?: string;
  walletID?: string | null;
  textInfo: string
}) => {
  const [pool, setPool] = useState<any[]>([]);
  const [selectedBlockchain, setBlockchain] = useState("Chain");
  const [selectedToken, setSelectedToken] = useState("Select Token");
  const [price, setPrice] = useState(0);
  const [selectedassetId, setSelectedassetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQueryBlockchain, setSearchQueryBlockchain] = useState("");
  const [searchQueryToken, setSearchQueryToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [showBlockchainDropdown, setShowBlockchainDropdown] = useState(false);
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);
  const [isCloseButtonHovered, setIsCloseButtonHovered] = useState(false);
  const [isGoBackButtonHovered, setIsGoBackButtonHovered] = useState(false);
  const [isProceedButtonHovered, setIsProceedButtonHovered] = useState(false);
  const [decimals, setDecimals] = useState("");
  const [tokenID, setTokenID] = useState("");
  const [tokenImage, settokenImage] = useState('');
  const [blockchainImage, setblockchainImage] = useState('');
  
  const [senderAddress, setSenderAddress] = useState("");
  const [showQuitModal, setShowQuitModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const blockchainDropdownRef = useRef<HTMLDivElement>(null);
  const tokenDropdownRef = useRef<HTMLDivElement>(null);
  const blockchainAddresses = {
    btc: "bc1q0fnht2ngtaeexp3gypd55k5ejfwxtgxmdmx0gh",
    zec: "t1bQtaCMoFhf1654BEZqNXTnwuFGSvQADFH",
    ton: "UQCl-Z6_RKnINhWTZIIzysIGjyZTcJsRscdaKP-Oof-PfOne",
    Doge: "DHpEpCboQcnxNWpVknvc9dpx3Q1TeHmUH",
    sol: "BK3HqkkH9T8QSsiXDvWSdfYEojviAHrhqeCXP1zvADbU",
    near: "potlock.near",
    xrp: "nill",
  };
  const EVM_ADDRESS = "0x88B93d4D440155448fbB3Cf260208b75FC0117C0";
  const evmChains = ["evm", "ethereum", "arb", "arbitrum", "gnosis", "base", "bera"];
  const isMobile = useMediaQuery({ maxWidth: 640 });



  const fetchTokens = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://1click.chaindefuser.com/v0/tokens", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setPool(data);
      if (data.length > 0) {
     
      
      }
      setError(null);
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to fetch tokens. Please try again later.");
      setPool([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  function shortenHash(hash: string): string {
    if (!hash || typeof hash !== "string") {
      return "...";
    }
    if (hash.length < 21) return hash;
    return `${hash.slice(0, 10)}....${hash.slice(-10)}`;
  }

  const uniqueBlockchains = [...new Set(pool.map((token) => token.blockchain))];

  
const tokenAvatars = [
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar.svg", name: "Sol" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(1).svg", name: "NEAR" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(2).svg", name: "USDC" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(3).svg", name: "Stellar" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(4).svg", name: "Base" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(5).svg", name: "Pol" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(6).svg", name: "Sui" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(7).svg", name: "Doge" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(8).svg", name: "Arb" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(9).svg", name: "Eth" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(10).svg", name: "Zec" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(11).svg", name: "BSC" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(12).svg", name: "XRP" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(13).svg", name: "Tron" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(14).svg", name: "USDT" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(15).svg", name: "Aurora" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar%20(16).svg", name: "Aptos" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar17.png", name: "Avax" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar18.png", name: "Op" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar19.png", name: "Btc" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar20.png", name: "ton" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar21.png", name: "gnosis" },
  // { src: "/assets/Avatar22.jpeg", name: "Blockchain" },
  { src: "https://ik.imagekit.io/zjvk6l5gp/Avatar23.jpeg", name: "Bera" },
  
];

  const filteredTokens = pool.filter((token) => token.blockchain === selectedBlockchain);
  const nearToken = pool.find(
    (token) => token.symbol === "wNEAR" || token.assetId === "nep141:wrap.near"
  );
  
  const nearPrice = nearToken?.price || 0;

  const donationAmount = parseFloat(amount) || 0;
  const protocolFeeNear = donationAmount * 0.025;
  const networkFeeNear = 0.08;
  const referralFeeNear = donationAmount * 0.05;
  const totalFeeNear = protocolFeeNear + networkFeeNear;

  const protocolFeeSelectedCurrency = (protocolFeeNear * nearPrice) / price;
  const networkFeeSelectedCurrency = (networkFeeNear * nearPrice) / price;
  const referralFeeSelectedCurrency = (referralFeeNear * nearPrice) / price;
  const totalFeeSelectedCurrency =
    protocolFeeSelectedCurrency + networkFeeSelectedCurrency;

  const handleQuit = () => {
    console.log("User confirmed quit");
    setShowQuitModal(false);
    onClose();
  };

  const handleCancelQuit = () => {
    setShowQuitModal(false);
  };

  const validateForm = () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return false;
    }
    if (!senderAddress || senderAddress.trim() === "") {
      setError("Please provide a valid sender wallet address.");
      return false;
    }
    if (CampaignName.trim() === "") {
      setError("Campaign name is required.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleProceed = () => {
    if (validateForm()) {
      onProceed(
        campaignID,
        `${(donationAmount + totalFeeSelectedCurrency).toFixed(4)} ${selectedToken || "USDC"}`,
        networkFeeSelectedCurrency.toFixed(4),
        selectedBlockchain,
        decimals,
        tokenID,
        senderAddress,
        tokenImage
      );
     
    }
  };

  const isDisabled = loading ||
  senderAddress.trim() === "" ||
  amount.trim() === "" ||
  CampaignName.trim() === ""



  function capitalizeAll(str: string): string {
    if (!str) return '';
    if (str.toUpperCase() === 'GNOSIS') {
      const dat = 'GNO'
      return dat.toUpperCase();
    }else{
      return str.toUpperCase();
    }
    
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showBlockchainDropdown && 
        blockchainDropdownRef.current && 
        !blockchainDropdownRef.current.contains(event.target as Node)
      ) {
        setShowBlockchainDropdown(false);
      }

      if (
        showTokenDropdown && 
        tokenDropdownRef.current && 
        !tokenDropdownRef.current.contains(event.target as Node)
      ) {
        setShowTokenDropdown(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showBlockchainDropdown, showTokenDropdown]);


  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       blockchainDropdownRef.current &&
  //       !blockchainDropdownRef.current.contains(event.target as Node) &&
  //       tokenDropdownRef.current &&
  //       !tokenDropdownRef.current.contains(event.target as Node)
  //     ) {
  //       setShowBlockchainDropdown(false);
  //       setShowTokenDropdown(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

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
        zIndex: 1000,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          background: "#ffffff",
          padding: isMobile ? "20px" : "30px",
          borderRadius: "15px",
          width: isMobile ? "80%" : "400px",
          maxWidth: "400px",
          maxHeight:isMobile ? "70vh" : "80vh",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Mona Sans', sans-serif",
        
        }}
        ref={modalRef}
      >
       
        <div
          style={{
            position: "relative",
            background: "#262626",
            color: "#ffffff",
            padding: isMobile ? "30px 12px" : "28px 18px",
            borderRadius: "15px 15px 0 0",
            margin: isMobile ? "-20px -20px 20px -20px" : "-30px -30px 25px -30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: isMobile ? "16px" : "20px",
              fontFamily: "'Mona Sans', sans-serif",
              fontWeight: 600,
              margin: 0,
              textAlign: "center",
            }}
          >
            Enter {textInfo} Amount
          </div>


          <div
            style={{
              position: "absolute",
              right: isMobile ? "23px" : "30px",
              top: isMobile ?  "53%" : '52%',
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "#FCCFCF",
              cursor: "pointer",
              fontFamily: "'Mona Sans', sans-serif",
              transition: "color 0.3s, transform 0.2s",
              outline: "none",           
              boxShadow: "none",        
              ...(isCloseButtonHovered && { transform: "translateY(-50%) scale(1.1)" }),
            }}
            onMouseEnter={() => setIsCloseButtonHovered(true)}
            onMouseLeave={() => setIsCloseButtonHovered(false)}
            onClick={() => setShowQuitModal(true)}
          >
           <svg width={isMobile ? "20px" : "24"} height={isMobile ? "20px" : "24"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#FCCFCF"/>
</svg>

          </div>
        </div>

       
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "20px",
              padding: "12px",
              border: "1px solid #E5E5E5",
              borderRadius: "6px",
              justifyContent: "left",
              alignItems: "center",
              width: "91.5%"
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "#F5F5F5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                flexShrink: 0,
              }}
            >
              {CampaignImg === "Direct" ? (
                <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFBUlEQVR4nO1ba28bRRTdP8EHICD+DhJU/IdCIaRNQAIJ+gGQ+IAoAgQSj6pQECIU0qqlqpI+ACchbZzSEBLS1Hk4Dz9mnYQ0TeKdVt6duxfdWdtxnOzEphvPrs1KR7Gyu9Y9Z+6ce2e9YxiK4z7DJznDY9yEK9yEaYuBxU0XwwwvRpiWMTM8ej+LTxj1HjyNj3MTTloMhG5CAQgCFoOeBzl8qjbyDJ+zGOR1Bx44GGzxLB7aj3wXKaY92APMBs6wUzXyoDvIhohQnQk8g21Nmfaq6ZDCx7YFMOG09qAaDjhVLnXN4Pb1QnLOYBvN/U7dwWhDDjsMzuCy9kB0gUGvYZkwpz0QbYBpo6XcvwoWg7yhOwjdMHQHoBuG7gB0w9AdQNMJsLXgYuZXgYlvBI697+DwGzYOdhRw4MUCxg4X5OehThtvvmXjxMcOJn9yMBcHtLIRF2B5BPCvDxwcOOIRrRdDXTYmTgvcmIFoCZBPu/j3Z85/Ir0XBtsLmL4soiPA1MngyJfQ/3wBc9dFNAQY7AiWfAm3v3CiIcDou/aBCLBwISIC3J0EvPFasCJQdWhUVTCCKn3k4IMvPRzx4ddtTPUK5Kwx5PlDC8C8ml8pRKpP4MSnjiSzr9kdKeAfb9uY+Fpg7gag1UDigQkQO1yQDQ+5dnXa5lMuro2DPMf6BaavCTSHBOaGAdfv6Gt+AhcgVmpmXrHxzimBmV8E3r1d54gyFzeSrhRmbQLw3jRgfikKZbBd3dTE37Tx1ju2zBIyN/q7cnO72yPS2X7A5FmBM9/vxsJFkF1mPtMEjVD/C4WyZ1D6swHA2R/2Jl4NEuifcQhhK5xxcbLGVni+WNvJG5YuQU3Eq0FmGSoBeBGUpuMf+S+Gxk445ZFXkZ/9UeBSn1qclREIjwBjJxxpXJWlMBsTmPhWyHPx47Y0R2qY6DylvYrc6qh3nVKEboHrCQiHALGi2U1+7uByhbnthY15Vznn6dz6lPcd9F3pqyAzYq9rFy+FSIBYZSnssuVUSJ51MNsvcG1su96T2/uRX/gZcGtx9/ev3PK/pySWVgGuv2rv6/xbKa/O+5U6SaaY0huzIN2+BJVfmIMhECB9Rcj1u58AI8ftcvqr5n6pzid7aq8IlDXaBeDS2ITvivDP9zz3p3RVkanOgOU4YPKcWoC5HhGeMmhlXExfFfK5YOWqcPxDTwCqAsrRvLDbA+hxm0qE2e4QCcArxch6hGlNQKLQ/+4l9m985s4IXOql+2C7GsT975s/F1IB+B6ghU2tc5tAjRXdt6qoAiRWZATgpouLFxUlzaexUTVEK/GICbAyUrsA5AfZ3xQtc7fAzXk3WgJYWXUvQCit+DLX1J5BTVUkfxtcG1cTM38HuVqcP+9/DYkY1MMSo9ECEGhJW48h7kj9M0I+LYr8r8OroyDncT3kqUsMkjzX/fM4GR+t6vYd9W5vzh/EM0JDpwBlIaZALmyot6f2lghTB0h1nvqBINw+1AJwjTB0B6Abhu4AdMPQHYBuGK38oiRnsEmvys5oD0QbIPH/y9Kc4VH9I6EL2G7QvroW3TDhyA0TxS0zX7WgAF/u3ChJG4lCEFhDwGDTWsVHd+wcs0x8uhWmQnHb3LN+ewc7W2Dj5DH17tEsHmrK6UBpn8NnjFqOLRMfsUz4RDplU4w6fLdrztdy8Ay20dYyzqCPuqYotM1ejJCgHWHcxJfLpc7n+BchOsuiJZSRagAAAABJRU5ErkJggg=="
                  alt="Direct Campaign"
                  width={60}
                  height={60}
                  style={{ borderRadius: "50%" }}
                />
              ) : (
                <img
                  src={CampaignImg}
                  alt="icon"
                  width={60}
                  height={60}
                  style={{ borderRadius: "50%" }}
                />
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  color: "black",
                  fontWeight: 600,
                  fontSize: isMobile ? "15px" : "16px",
                  fontFamily: "'Mona Sans', sans-serif",
                  textAlign: "left",
                  marginBottom: "3px",
                }}
              >
                {CampaignName.length > 25 ? `${CampaignName.slice(0, 25)}...` : CampaignName}
              </div>
              <div
                style={{
                  color: "#525252",
                  fontSize: isMobile ? "14px" : "15px",
                  fontFamily: "'Mona Sans', sans-serif",
                  textAlign: "left",
                }}
              >
                {shortenHash(CampaignDesc)}
              </div>
            </div>
          </div>

        
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "91.5%"
            }}
          >
            <div
              style={{
                color: "black",
                fontWeight: 500,
                fontFamily: "'Mona Sans', sans-serif",
                fontSize: isMobile ? "15px" : "16px",
                textAlign: "left",
              }}
            >
              Chain 
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                height: "48px",
                borderRadius: "12px",
                padding: "4px 12px",
                border: "1px solid #DBDBDB",
                alignItems: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  justifyContent:"space-between",
                  cursor: "pointer",
                  flex: 1,
                  maxWidth: blockchainImage !== ''  ? '35%' : "30%",
                  borderRightColor: "#DBDBDB",
                  borderRightStyle: "solid",   
                  borderRightWidth: "1px",      
                  height: "100%",
                  
                }}
                onClick={() => {
                  setShowBlockchainDropdown(!showBlockchainDropdown);
                  setShowTokenDropdown(false);
                  setAmount('')
                }}
              >
               <div style={{
                   display: "flex",
                   alignItems: "center",
                   padding: isMobile ? "6px" : "8px",
                   fontFamily: "'Mona Sans', sans-serif",
                   borderRadius: "8px",
                   color: "#000000",
                   fontSize: isMobile ? "15px" : "16px",
                   gap: isMobile ? "5px": "10px",
                  
               }}>
              {blockchainImage !== '' && <img 
          src={blockchainImage} 
          alt={'blockchain'}
          style={{
            width: isMobile? "20px" : '30px',
            height: isMobile? "20px" : '30px',
            borderRadius: "50%",
            objectFit: "cover"
          }}/>}
               <span style={{ fontWeight: 500,   color: selectedToken === "Select Token" ? "#7B7B7B" : "#000000",fontFamily: "'Mona Sans', sans-serif", }}>{ selectedBlockchain === 'Chain' ? selectedBlockchain :  capitalizeAll(selectedBlockchain)}</span>
               </div>
              
                <span style={{ fontSize: "12px", color: "#666", marginTop: 2, justifyContent: "flex-end", marginRight: 10 }}><svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.59 0.294922L6 4.87492L1.41 0.294922L0 1.70492L6 7.70492L12 1.70492L10.59 0.294922Z" fill="#A6A6A6"/>
</svg>
</span>
              </div>
              <div
                style={{
                  flex: 1,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    marginLeft: 20,
    justifyContent:"space-between",
    height: "100%",
                }}
                onClick={() => {
                  setShowTokenDropdown(!showTokenDropdown);
                  setShowBlockchainDropdown(false);
                  setAmount('')
                }}
              >
         

<div style={{
                   display: "flex",
                   alignItems: "center",
                   padding: isMobile ? "6px" : "8px",
            
                   borderRadius: "8px",
                   color:    "#000000",
                   fontSize: isMobile ? "15px" : "16px",
                   gap: isMobile ? "5px": "10px",
                  
               }}>
              {tokenImage !== '' && <img 
          src={tokenImage} 
          alt={'tokenImage'}
          style={{
            width: isMobile? "20px" : '30px',
            height: isMobile? "20px" : '30px',
            borderRadius: "50%",
            objectFit: "cover"
          }}/>}
               <span style={{ fontWeight: 500,   color: selectedToken === "Select Token" ? "#7B7B7B" : "#000000",fontFamily: "'Mona Sans', sans-serif", }}> {selectedToken === "Select Token" ? selectedToken : capitalizeAll(selectedToken)}</span>
               </div>
                <span style={{ fontSize: "12px", color: "#666", marginLeft: "8px" , justifyContent: "flex-end",}}><svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.59 0.294922L6 4.87492L1.41 0.294922L0 1.70492L6 7.70492L12 1.70492L10.59 0.294922Z" fill="#A6A6A6"/>
</svg>
</span>
              </div>
            </div>
            {showBlockchainDropdown && (
              <div
                style={{
                  position: "absolute",
                  width: isMobile ? "40%" : "165px",
                  maxHeight: "25vh",
                  overflowY: "auto",
                  top: isMobile ? "55%" : "53%",
                  left: isMobile ? "32%" : "calc(50% - 110px)",
                  transform: "translateX(-50%)",
                  background: "#FFFFFF",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: isMobile ? "8px" : "10px",
                  zIndex: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  scrollbarWidth: "none",    
                  msOverflowStyle: "none",    
                }}
                ref={blockchainDropdownRef}
              >
                
                <div
                  style={{
                    fontSize: isMobile ? "14px" : "15px",
                    paddingBottom: "8px",
                    borderBottom: "1px solid #eee",
                    marginBottom: "10px",
                    color: "#000000",
                    fontWeight: 600,
                    fontFamily: "'Mona Sans', sans-serif",
                    textAlign: "center",
                  }}
                >
                  Available Blockchains
                </div>
                <input
                  type="text"
                  placeholder="Search by blockchain..."
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    margin: "10px 0",
                    fontSize: isMobile ? "13px" : "14px",
                    borderRadius: "8px",
                    border: "1px solid #d1d8e0",
                    background: "#f9fafb",
                    fontFamily: "'Mona Sans', sans-serif",
                    boxSizing: "border-box",
                    transition: "border-color 0.3s, box-shadow 0.3s",
                    color: "#000000",
                  }}
                  value={searchQueryBlockchain}
                  onChange={(e) => setSearchQueryBlockchain(e.target.value)}
                />
               
                  {uniqueBlockchains
  .filter((blockchain) =>
    blockchain.toLowerCase().includes(searchQueryBlockchain.toLowerCase())
  )
  .map((blockchain, index) => {
    const blockchainAvatar = tokenAvatars.find(a => 
      a.name.toLowerCase() === blockchain.toLowerCase()
    );
   
    const avatarSrc = blockchainAvatar?.src ||  "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar22.jpeg";

    return (
      <div
        key={index}
        style={{
          display: "flex",
          alignItems: "center",
          padding: isMobile ? "6px" : "8px",
          fontWeight: 500,
          fontFamily: "'Mona Sans', sans-serif",
          cursor: "pointer",
          borderRadius: "8px",
          color: "#000000",
          fontSize: isMobile ? "15px" : "16px",
          gap: "12px",
        }}
        onClick={() => {
          const normalized = blockchain.toLowerCase();
          setBlockchain(blockchain); 
          setShowBlockchainDropdown(false);
        
          const defaultToken = pool.find(t => t.blockchain.toLowerCase() === normalized);
          if (defaultToken) {
            setSelectedToken(defaultToken.symbol === "wNEAR" ? '' : defaultToken.symbol);
            setPrice(defaultToken.price || 0);
            setDecimals(defaultToken.decimals || "");
            setTokenID(defaultToken.assetId || "");
            setSelectedassetId(defaultToken.assetId || "");
          }
        
          if (evmChains.includes(normalized)) {
            setSenderAddress(EVM_ADDRESS);
          } else {
            const address = blockchainAddresses[normalized];
            if (address) {
              setSenderAddress(address);
            }
          }
          setblockchainImage(avatarSrc)
          settokenImage('')
        }}
      >
        <img 
          src={avatarSrc} 
          alt={blockchain}
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            objectFit: "cover"
          }}
        />
        {capitalizeAll(blockchain)}
      </div>
    );
  })}
              </div>
            )}

            {showTokenDropdown && (
  <div
    style={{
      position: "absolute",
      width: isMobile ? "40%" : "180px",
      maxHeight: "25vh",
      overflowY: "auto",
      top: isMobile ? "55%" : "53%",
      left: isMobile ? "62%" : "calc(50% - -50px)",
      transform: "translateX(-50%)",
      background: "#FFFFFF",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
   //   boxShadow: "0 6px 24px rgba(0, 0, 0, 0.1)",
      padding: isMobile ? "8px" : "10px",
      zIndex: 10,
      display: "flex",
      flexDirection: "column",
      gap: "5px",
      scrollbarWidth: "none",     
      msOverflowStyle: "none",     
    }}
    ref={tokenDropdownRef}
  >
    <div
      style={{
        fontWeight: 600,
        fontFamily: "'Mona Sans', sans-serif",
        fontSize: isMobile ? "14px" : "15px",
        paddingBottom: "8px",
        borderBottom: "1px solid #eee",
        marginBottom: "10px",
        color: "#000000",
        textAlign: "center",
      }}
    >
      Available Tokens
    </div>
    <input
      type="text"
      placeholder="Search by token..."
      style={{
        width: "100%",
        padding: "10px 12px",
        margin: "10px 0",
        fontSize: isMobile ? "13px" : "14px",
        borderRadius: "8px",
        border: "1px solid #d1d8e0",
        background: "#f9fafb",
       
        boxSizing: "border-box",
        transition: "border-color 0.3s, box-shadow 0.3s",
        color: "#000000",
      }}
      value={searchQueryToken}
      onChange={(e) => setSearchQueryToken(e.target.value)}
    />
    {filteredTokens
      .filter((token) =>
        token.symbol.toLowerCase().includes(searchQueryToken.toLowerCase()) &&
        token.symbol !== "wNEAR"
      )
      .map((token, index) => {
        // Find token avatar or fall back to blockchain avatar
        const tokenAvatar = tokenAvatars.find(a => 
          a.name.toLowerCase() === token.symbol.toLowerCase()
        );
        
        const blockchainAvatar = tokenAvatars.find(a => 
          a.name.toLowerCase() === token.blockchain.toLowerCase()
        );

        const avatarSrc = tokenAvatar?.src || blockchainAvatar?.src ||  "https://ik.imagekit.io/zjvk6l5gp/assets/Avatar22.jpeg"
      
        return (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              padding: isMobile ? "6px" : "8px",
              cursor: "pointer",
              borderRadius: "8px",
              color: "#000000",
              fontSize: isMobile ? "13px" : "14px",
              gap: "8px",
              fontFamily: "'Mona Sans', sans-serif",
              fontWeight: 600,
            }}
            onClick={() => {
              setSelectedToken(token.symbol);
              setShowTokenDropdown(false);
              setPrice(token.price || 0);
              setDecimals(token.decimals || "");
              setTokenID(token.assetId || "");
              setSelectedassetId(token.assetId || "");
              settokenImage(avatarSrc)
            }}
          >
            <img 
              src={avatarSrc} 
              alt={token.symbol}
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                objectFit: "cover"
              }}
            />
            {token.symbol}
          </div>
        );
      })}
  </div>
)}
          </div>

          {/* Amount Input */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "91.5%"
            }}
          >
            <div
              style={{
                color: "black",
               
                fontSize: isMobile ? "15px" : "16px",
                textAlign: "left",
                fontFamily: "'Mona Sans', sans-serif",
                fontWeight: 500,
              }}
            >
              Amount
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                height: "48px",
                borderRadius: "8px",
                padding: "4px 12px",
                border: "1px solid #DBDBDB",
                backgroundColor: "#FFFFFF",
                alignItems: "center",
              }}
            >
             <input
  style={{
    border: "none",
    outline: "none",
    fontSize: isMobile ? "14px" : "16px",
    width: "100%",
    background: "transparent",
    fontFamily: "'Mona Sans', sans-serif",
    color: "#000000",
  }}
  type="number"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  onKeyDown={(e) => {
    
    if (
      ["e", "E", "+", "-"].includes(e.key) 
     
    ) {
      e.preventDefault();
    }
  }}
  placeholder="0.00"
/>

              <div
                style={{
                  fontWeight: 500,
                  color: "#64748B",
                  fontSize: isMobile ? "12px" : "14px",
                  marginLeft: "auto",
                  whiteSpace: "nowrap",
                  fontFamily: "'Mona Sans', sans-serif",
                }}
              >
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(parseFloat(amount || "0") * (price || 0))}
              </div>
            </div>
          </div>

         
        

{amount !== "" && amount !== null && (
            <div
              style={{
        
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                padding: "8px",
                backgroundColor: "#F7F7F7",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <h3
                style={{
                  fontSize: isMobile ? "15px" : "16px",
                  fontWeight: 600,
                  textAlign: "left",
                  margin: 0,
                  color: "black",
                  fontFamily: "'Mona Sans', sans-serif",
                }}
              >
                Fee Breakdown
              </h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: isMobile ? "13px" : "14px",
                  color: "#1e293b",
                  fontFamily: "'Mona Sans', sans-serif",
                }}
              >
                <span>Protocol Fee (2.5%):</span>
                <span>
                  {protocolFeeSelectedCurrency.toFixed(4)} {selectedToken || "USDC"}
                  {nearPrice > 0 && price > 0 && (
                    <span style={{ color: "#64748B", fontSize: isMobile ? "11px" : "12px" }}>
                      {" "}
                      ({protocolFeeNear.toFixed(4)} NEAR)
                    </span>
                  )}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: isMobile ? "13px" : "14px",
                  color: "#1e293b",
                  fontFamily: "'Mona Sans', sans-serif",
                }}
              >
                <span>Network Fee:</span>
                <span>
                  {networkFeeSelectedCurrency.toFixed(4)} {selectedToken || "USDC"}
                  {nearPrice > 0 && price > 0 && (
                    <span style={{ color: "#64748B", fontSize: isMobile ? "11px" : "12px" }}>
                      {" "}
                      (0.08 NEAR)
                    </span>
                  )}
                </span>
              </div>
              {walletID && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: isMobile ? "13px" : "14px",
                    color: "#1e293b",
                    fontFamily: "'Mona Sans', sans-serif",
                  }}
                >
                  <span>Referral Fee (5%):</span>
                  <span>
                    {referralFeeSelectedCurrency.toFixed(4)} {selectedToken || "USDC"}
                    {nearPrice > 0 && price > 0 && (
                      <span style={{ color: "#64748B", fontSize: isMobile ? "11px" : "12px" }}>
                        {" "}
                        ({referralFeeNear.toFixed(4)} NEAR)
                      </span>
                    )}
                  </span>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: isMobile ? "15px" : "16px",
                  color: "#1e293b",
                  fontWeight: 600,
                  borderTop: "1px solid #e6ecef",
                  marginTop: "10px",
                  fontFamily: "'Mona Sans', sans-serif",
                }}
              >
              
                <span style={{marginTop: "10px",}} >Total (incl. fees):</span>
                <span  style={{marginTop: "10px",}}>
                  {(donationAmount + totalFeeSelectedCurrency).toFixed(4)} {selectedToken || "USDC"}
                  {nearPrice > 0 && price > 0 && (
                    <span style={{ color: "#64748B", fontSize: isMobile ? "11px" : "12px",  }}>
                      {" "}
                      ({(donationAmount + totalFeeNear).toFixed(4)} NEAR)
                    </span>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>


        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "15px",
            marginTop: "20px",
            paddingTop: "15px",
            borderTop: "1px solid #e6ecef",
            flexWrap: "wrap",
          }}
        >
          <button
            style={{
              padding: isMobile ? "12px 20px" : "14px 30px",
              background: "#F1F5F9",
              color: "#111827",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontFamily: "'Mona Sans', sans-serif",
              fontWeight: 500,
              fontSize: isMobile ? "12px" : "16px",
              transition: "background 0.3s, transform 0.2s, box-shadow 0.3s",
              flex: 1,
              maxWidth: "100%",
              textAlign: "center",
              ...(isGoBackButtonHovered && {
                background: "#F1F5F9",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 15px #F1F5F9",
              }),
            }}
            onMouseEnter={() => setIsGoBackButtonHovered(true)}
            onMouseLeave={() => setIsGoBackButtonHovered(false)}
            onClick={onGoBack}
          >
            Back
          </button>
          <button
            style={{
            //  padding: isMobile ? "12px 20px" : "14px 30px",
              background: isDisabled ? "#00000044" : "#000000",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              cursor: isDisabled ? "not-allowed" : "pointer",
              fontFamily: "'Mona Sans', sans-serif",
              fontWeight: 500,
              fontSize: isMobile ? "12px" : "15px",
              transition: "background 0.3s, transform 0.2s, box-shadow 0.3s",
              flex: 1,
              maxWidth: "100%",
              textAlign: "center",
              ...(isProceedButtonHovered && !isDisabled && {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 10px #F1F5F9",
              }),
            }}
            onMouseEnter={() => setIsProceedButtonHovered(true)}
            onMouseLeave={() => setIsProceedButtonHovered(false)}
            onClick={handleProceed}
            disabled={isDisabled}
          >
            Proceed to {textInfo}
          </button>
        </div>
      </div>

      <QuitConfirmationModal
        isOpen={showQuitModal}
        onCancel={handleCancelQuit}
        onConfirm={handleQuit}
      />
    </div>
  );
};

export default Modal2;













