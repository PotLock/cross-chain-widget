import React, { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useMediaQuery } from "react-responsive";
import QuitConfirmationModal from "./QuitConfirmationModal";
import ErrorPopupModal from "./ErrorPopupModal";

interface Modal3Props {
  onClose: () => void;
  onBack: () => void;
  onSentFunds: (
    amount: string,
    depositAddress: string,
    campaignID: number
  ) => void;
  campaignID?: number;
  amount?: string;
  blockchain?: string;
  decimal?: number;
  tokenID?: string;
  networkFee?: string;
  senderaddress?: string;
  isdeposit?: string | null;
  CampaignName: string;
  CampaignImg: string;
  CampaignDesc: string;
  tokenImg: string;
  textInfo: string
}

const Modal3: React.FC<Modal3Props> = ({
  onClose,
  onBack,
  onSentFunds,
  campaignID = 0,
  amount = "0",
  blockchain = "NEAR",
  networkFee = "",
  decimal = 0,
  tokenID = "nep141:wrap.near",
  senderaddress = "",
  isdeposit = null,
  CampaignName = "",
  CampaignImg = "",
  CampaignDesc = "",
  tokenImg='',
  textInfo =''
}) => {
  const [pool, setPool] = useState<any | null>(null);
  const [isCloseButtonHovered, setIsCloseButtonHovered] = useState(false);
  const [isBackButtonHovered, setIsBackButtonHovered] = useState(false);
  const [isSentFundsButtonHovered, setIsSentFundsButtonHovered] =
    useState(false);
  const [isCopyButtonHovered, setIsCopyButtonHovered] = useState(false);
  const [isCopyButtonHovered2, setIsCopyButtonHovered2] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(!isdeposit);
  const modalRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const [isCopied, setisCopied] = useState(false);
  const [isCopied2, setisCopied2] = useState(false);

  function convertToUnit(amount: string | number, decimals: number): string {
    if (amount === null || amount === undefined || isNaN(Number(amount))) {
      throw new Error(
        "Invalid amount: must be a valid number or string representation of a number"
      );
    }
    if (!Number.isInteger(decimals) || decimals < 0) {
      throw new Error("Invalid decimals: must be a non-negative integer");
    }

    const amountStr =
      typeof amount === "number" ? amount.toString() : amount.trim();

    if (parseFloat(amountStr) === 0) {
      return "0";
    }

    const [integerPart, fractionalPart = ""] = amountStr.split(".");

    const paddedFractional = fractionalPart
      .padEnd(decimals, "0")
      .slice(0, decimals);

    const combined = integerPart + paddedFractional;

    const result = combined.replace(/^0+/, "") || "0";

    return combined;
  }

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function calculateBasisPoints(
    feeAmount: number,
    totalAmount: number
  ): number {
    if (totalAmount === 0) {
      throw new Error("Total amount cannot be zero.");
    }

    const basisPoints = (feeAmount / totalAmount) * 10000;
    return Math.round(basisPoints);
  }

  const fetchTokens2 = async (): Promise<void> => {
    try {
      setIsLoadingAddress(true);
      const [amount_digit, amount_symbol] = amount.includes(" ")
        ? amount.split(" ")
        : [amount, ""];

      const mainAmount = convertToUnit(amount_digit, decimal);

      const feeAmount = calculateBasisPoints(
        parseFloat(networkFee),
        parseFloat(amount_digit)
      );

      const deadline =
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split(".")[0] +
        "Z";

      const response = await fetch("https://1click.chaindefuser.com/v0/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dry: false,
          swapType: "EXACT_INPUT",
          slippageTolerance: 100,
          originAsset: tokenID,
          depositType: "ORIGIN_CHAIN",
          destinationAsset:
            CampaignImg === "Direct" ? CampaignDesc : "nep141:wrap.near",
          amount: mainAmount,
          refundTo: senderaddress,
          refundType: "ORIGIN_CHAIN",
          recipient:
            CampaignImg === "Direct" ? CampaignName : "potluck_intents.near",
          recipientType: "DESTINATION_CHAIN",
          deadline: deadline,
          referral: "referral",
          quoteWaitingTimeMs: 3000,
          appFees: [
            {
              recipient: "potluck_intents.near",
              fee: feeAmount,
            },
          ],
        }),
      });

      if (!response.ok) {
       // const data2 = await response.json();
      //  console.log(data2)
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
 
      setPool(data);
    } catch (error) {
      console.error("Fetch error:", error);
      setShowErrorModal(true);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  useEffect(() => {
    if (!isdeposit) {
      fetchTokens2();
    }
  }, []);

  useEffect(() => {
    if (isCopied || isCopied2) {
      const timer = setTimeout(() => {
        setisCopied(false);
        setisCopied2(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied, isCopied2]);

  function shortenHash(hash: string): string {
    if (!hash || typeof hash !== "string") {
      return "Loading...";
    }
    if (hash.length < 1) return hash;
    return `${hash.slice(0, 7)}....${hash.slice(-7)}`;
  }

  const handleQuit = () => {
    console.log("User confirmed quit");
    setShowQuitModal(false);
    onClose();
  };

  const handleCancelQuit = () => {
    setShowQuitModal(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        background: "rgba(0, 0, 0, 0.65)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "30px",
          borderRadius: "15px",
          width: isMobile ? "80%" : "400px",
          maxHeight:isMobile ? "70vh" : "80vh",
          position: "relative",
          fontFamily: "'Mona Sans', sans-serif",
          display: "flex",
          flexDirection: "column",
          ...(isMobile && { width: "80%", padding: "20px" }),
        }}
        onClick={(e) => e.stopPropagation()}
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
             {textInfo} Amount
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
            paddingBottom: "50px",
            scrollbarWidth: "none",    
            msOverflowStyle: "none",   
          }}
        >
          <div
            style={{
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "19px",
                fontWeight: 600,
                marginBottom: "10px",
                color: "#000000",
                fontFamily: "'Mona Sans', sans-serif",
              }}
            >
              Scan QR Code to Donate
            </div>
            <p
              style={{
                fontSize: "15px",
                color: "#1e293b",
                fontFamily: "'Mona Sans', sans-serif",
              }}
            >
              Send exactly <strong>{amount}</strong> to the address below
            </p>
          </div>

          <div
            style={{
              filter: isLoadingAddress ? "blur(4px)" : "none",
              opacity: isLoadingAddress ? 0.5 : 1,
              transition: "filter 0.3s, opacity 0.3s",
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
              width: 227.0557861328125,
              height: 226.1025390625,
              flexDirection: "column",
              border: "1px solid #7B7B7B",
              padding: "22px",
              alignSelf: "center",
              alignItems: "center",
              borderRadius: "10px",
              marginLeft: "60px",
              ...(isMobile && {
                width: "180px",
                height: "180px",
                padding: "15px",
                marginLeft: "0",
                margin: "0 auto",
              }),
            }}
          >
         
            <QRCodeSVG
  value={pool?.quote?.depositAddress || isdeposit || "placeholder"}
  size={290}
  level="H" 
  imageSettings={{
    src: tokenImg,
    height: 66, 
    width: 66, 
    excavate: true, 
   
    x: undefined,
    y: undefined
  }}
  bgColor="#ffffff" 
  fgColor="#000000" 
/>
          </div>
          {isLoadingAddress && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                color: "#1e293b",
                fontSize: isMobile ? "14px" : "16px",
                fontWeight: 600,
              }}
            >
              <div
                style={{
                  border: "4px solid #f3f3f3",
                  borderTop: "4px solid #262626",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  animation: "spin 1s linear infinite",
                  fontFamily: "'Mona Sans', sans-serif",
                }}
              ></div>
              <span>Generating Address...</span>
            </div>
          )}
          <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "93%",
              minHeight: "48px",
              gap: "12px",
              borderRadius: "4px",
              padding: "12px",
              backgroundColor: "#F7F7F7",
              border: "1px solid #C7C7C7",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "40px",
              ...(isMobile && {
                width: "92%",
                padding: "10px",
                marginTop: "30px",
              }),
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: "14px",
                color: "#1e293b",
                textAlign: "left",
                fontFamily: "'Mona Sans', sans-serif",
              }}
            >
              <div style={{fontWeight: 600}}>Deposit Address ({capitalizeFirstLetter(blockchain)})</div>
              <div>{shortenHash(pool?.quote?.depositAddress || isdeposit)}</div>
            </div>

            {isCopied ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    padding: "8px",
                    borderRadius: "4px",
                    transition: "background 0.3s, transform 0.2s",
                    ...(isCopyButtonHovered && {
                      transform: "translateY(-2px)",
                    }),
                  }}
                  onMouseEnter={() => setIsCopyButtonHovered(true)}
                  onMouseLeave={() => setIsCopyButtonHovered(false)}
                  onClick={() => {
                    navigator.clipboard
                      .writeText(pool?.quote?.depositAddress || "")
                      .then(() => {
                        setisCopied(true);
                      })
                      .catch((err) => {
                        console.error("Failed to copy address:", err);
                        alert("Failed to copy address. Please try again.");
                      });
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="11"
                      strokeWidth="1"
                      fill="none"
                    />
                    <path
                      d="M9 16.17L5.12 12.29L4 13.41L9 18.5L20 7.5L18.88 6.29L9 16.17Z"
                      fill="#292929"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <div
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: "8px",
                  borderRadius: "4px",
                  transition: "background 0.3s, transform 0.2s",
                  ...(isCopyButtonHovered && {
                   
                    transform: "translateY(-2px)",
                  }),
                }}
                onMouseEnter={() => setIsCopyButtonHovered(true)}
                onMouseLeave={() => setIsCopyButtonHovered(false)}
                onClick={() => {
                  navigator.clipboard
                    .writeText(pool?.quote?.depositAddress || isdeposit)
                    .then(() => {
                      setisCopied(true);
                    })
                    .catch((err) => {
                      console.error("Failed to copy address:", err);
                      alert("Failed to copy address. Please try again.");
                    });
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 14.8269C1.9 14.8269 1 13.9269 1 12.8269V2.8269C1 1.7269 1.9 0.826904 3 0.826904H13C14.1 0.826904 15 1.7269 15 2.8269M9 6.8269H19C20.1046 6.8269 21 7.72233 21 8.8269V18.8269C21 19.9315 20.1046 20.8269 19 20.8269H9C7.89543 20.8269 7 19.9315 7 18.8269V8.8269C7 7.72233 7.89543 6.8269 9 6.8269Z"
                    stroke="#292929"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
          <div
      style={{
        background: "#F7F7F7",
        padding: "15px",
        borderRadius: "10px",
        margin: "15px 0",
        fontFamily: "'Mona Sans', sans-serif",
        fontSize: "15px",
        color: "#7B7B7B",
        textAlign: "left",
      }}
    >
      <p>
        <span
          style={{
            fontWeight: 600,
            color: "#000000",
          }}
        >
          Heads up!
        </span>
        <br />• Send exactly <strong>{amount}</strong> {" "}
        {isCopied2 ? (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginLeft: "5px",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="11"
                      strokeWidth="1"
                      fill="none"
                    />
                    <path
                      d="M9 16.17L5.12 12.29L4 13.41L9 18.5L20 7.5L18.88 6.29L9 16.17Z"
                      fill="#292929"
                      strokeWidth="1"
                    />
                  </svg>
          </div>
        ) : (
          <div
            style={{
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              padding: "8px",
              borderRadius: "4px",
              transition: "background 0.3s, transform 0.2s",
              ...(isCopyButtonHovered2 && {
                
                transform: "translateY(-2px)",
              }),
            }}
            onMouseEnter={() => setIsCopyButtonHovered2(true)}
            onMouseLeave={() => setIsCopyButtonHovered2(false)}
            onClick={() => {
              navigator.clipboard
                .writeText(amount)
                .then(() => {
                  setisCopied2(true);
                })
                .catch((err) => {
                  console.error("Failed to copy address:", err);
                  alert("Failed to copy address. Please try again.");
                });
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 14.8269C1.9 14.8269 1 13.9269 1 12.8269V2.8269C1 1.7269 1.9 0.826904 3 0.826904H13C14.1 0.826904 15 1.7269 15 2.8269M9 6.8269H19C20.1046 6.8269 21 7.72233 21 8.8269V18.8269C21 19.9315 20.1046 20.8269 19 20.8269H9C7.89543 20.8269 7 19.9315 7 18.8269V8.8269C7 7.72233 7.89543 6.8269 9 6.8269Z"
                stroke="#292929"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
        <br />• Only send from a wallet you control
        <br />• This address is only valid for this specific donation
        <br />• If this campaign doesn't meet its funding goal, your donation will be redirected to POTLOCKs Community Fund instead of being refunded to your original wallet.
      </p>
    </div>
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
                fontSize: isMobile ? "14px" : "15px",
                transition: "background 0.3s, transform 0.2s, box-shadow 0.3s",
                flex: 1,
                maxWidth: "100%",
                textAlign: "center",
              ...(isBackButtonHovered && {
                background: "#F1F5F9",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 15px #F1F5F9",
              }),
            }}
            onMouseEnter={() => setIsBackButtonHovered(true)}
            onMouseLeave={() => setIsBackButtonHovered(false)}
            onClick={onBack}
          >
            Back
          </button>
          <button
            style={{
              padding: isMobile ? "12px 20px" : "14px 30px",
              background: "#000000",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              cursor:  "pointer",
              fontFamily: "'Mona Sans', sans-serif",
              fontWeight: 500,
              fontSize: isMobile ? "14px" : "15px",
              transition: "background 0.3s, transform 0.2s, box-shadow 0.3s",
              flex: 1,
              maxWidth: "100%",
              textAlign: "center",
              ...(isSentFundsButtonHovered && {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 10px #F1F5F9",
              }),
              ...(!pool?.quote?.depositAddress &&
                !isdeposit && {
                  background: "#00000044",
                  cursor: "not-allowed",
                  boxShadow: "none",
                }),
              ...(isMobile && {
                padding: "12px 10px",
                width: "100%",
                boxSizing: "border-box",
              }),
            }}
            onMouseEnter={() => setIsSentFundsButtonHovered(true)}
            onMouseLeave={() => setIsSentFundsButtonHovered(false)}
            onClick={() =>
              onSentFunds(
                amount,
                pool?.quote?.depositAddress || isdeposit,
                campaignID
              )
            }
            disabled={!pool?.quote?.depositAddress && !isdeposit}
          >
            I've sent the funds
          </button>
        </div>
      </div>

      <QuitConfirmationModal
        isOpen={showQuitModal}
        onCancel={handleCancelQuit}
        onConfirm={handleQuit}
      />

      <ErrorPopupModal isOpen={showErrorModal} onBack={onBack} />
    </div>
  );
};

export default Modal3;





















