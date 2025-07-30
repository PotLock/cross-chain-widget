import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import QuitConfirmationModal from "./QuitConfirmationModal";

interface Modal4Props {
  amount: string;
  depositAddress: string;
  campaignID: number;
  blockchain: string;
  CampaignName: string;
  CampaignImg: string;
  CampaignDesc: string;
  walletID: any;
  tokenImg: string;
  textInfo: string;
  walletbalance : string;
  tokenID: string;
  donateAmount: string;
  Dollaramount: string;
  onClose: () => void;
  onBack: (depositAddress: string, walletbalance: string) => void;
  onProceed: (
    txHash: string,
    campaignName: string,
    amount: string,
    usdAmount: string,
    nearAmount: string
  ) => void;
}

const Modal4: React.FC<Modal4Props> = ({
  onProceed,
  onClose,
  onBack,
  amount = "",
  depositAddress = "",
  campaignID = 0,
  blockchain = "",
  CampaignName = "",
  CampaignImg = "",
  CampaignDesc = "",
  walletID = null,
  tokenImg='',
  textInfo='',
  walletbalance='',
  tokenID='',
  donateAmount='',
  Dollaramount=''
}) => {
  const [FundReceived, setFundReceived] = useState<boolean | null>(false);
  const [FundReceivedFailed, setFundReceivedFailed] = useState<boolean | null>(
    false
  );
  const [FundConverted, setFundConverted] = useState<boolean | null>(false);
  const [FundDeposited, setFundDeposited] = useState<boolean | null>(false);
  const [FundDonated, setFundDonated] = useState<boolean | null>(false);
  const [swapData, setSwapData] = useState<any | null>(null);
  const [isBackSvgHovered, setIsBackSvgHovered] = useState(false);
  const [isCloseButtonHovered, setIsCloseButtonHovered] = useState(false);
  const [isTxLink1Hovered, setIsTxLink1Hovered] = useState(false);
  const [isTxLink2Hovered, setIsTxLink2Hovered] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [bal, setbal] = useState(null);
  const [Errorinfo, setErrorinfo] = useState<string | null>('Receive Failed, refresh after some time.');
  const refreshTransaction = async (): Promise<void> => {
    setFundReceived(false);
    setFundReceivedFailed(false);
    setFundConverted(false);
    setFundDeposited(false);
    setFundDonated(false);
    sendfunds();
    // if (tokenID === 'nep141:wrap.near'){
    //   fetchBalance();
    // }else{
    //   sendfunds();
    // }

  };

  function toHumanReadable(
    amount: string,
    tokenType: "token" | "near" = "token"
  ): string {
    const power = tokenType.toLowerCase() === "near" ? 24 : 18;
    const amountStr = String(amount).padStart(power + 1, "0");
    const integerPart = amountStr.slice(0, -power);
    const fractionalPart = amountStr.slice(-power);

    const humanReadable = `${integerPart}.${fractionalPart}`;
    return humanReadable;
  }



  const fetchBalance = async () => {
    if (!depositAddress) {
      setErrorinfo("No deposit address provided.");
      return;
    }
    const [amount_digit, amount_symbol] = donateAmount.includes(" ")
    ? amount.split(" ")
    : [amount, "NEAR"];

    const dollarAmount = Dollaramount.replace("$", "");
    try {
      const res = await fetch("https://us-central1-almond-1b205.cloudfunctions.net/potluck/fetchbalance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId: depositAddress }),
      });
  
      if (!res.ok) throw new Error(`Failed to fetch balance: ${res.status}`);
      const data = await res.json();

      const latestBalance = toHumanReadable(data.data.available, 'near');
      setbal(latestBalance); 
  
    
      const expectedBalance = parseFloat(walletbalance) + parseFloat(donateAmount);
      const actualBalance = parseFloat(latestBalance);
  
     
      const isCompleteDeposit = actualBalance >= expectedBalance - 0.0001; // Allow tiny difference
  
      if (isCompleteDeposit) {
        setFundReceived(true);
        setFundReceivedFailed(false);

        await new Promise((resolve) => setTimeout(resolve, 2000));
        setFundConverted(true);
  
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setFundDeposited(true);
        if (CampaignImg !== "Direct") {
          console.log(parseFloat(amount_digit) - 0.0800)
          try {
            const donateResponse = await fetch(
              "https://us-central1-almond-1b205.cloudfunctions.net/potluck/donate2",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  username: `${depositAddress.slice(0, 6)}-${depositAddress.slice(-6)}`.toLowerCase(),
                  deposit: `${parseFloat(amount_digit) - 0.0800}`,
                  campaign_id: String(campaignID),
                  walletID: walletID ?? null,
                }),
              }
            );
            if (!donateResponse.ok) throw new Error("Donation API failed"); setFundDonated(false);
            setFundDonated(true);
         await new Promise((resolve) => setTimeout(resolve, 2000));
          onProceed('', CampaignName, amount, dollarAmount, donateAmount);
            console.log("Donation recorded:", await donateResponse.json());
          } catch (err) {
            console.error("Donation error:", err);
          }
        }
  
        
      } else {
        const remainingAmount = expectedBalance - actualBalance;
        setErrorinfo(`Incomplete deposit. Send ${remainingAmount.toFixed(4)} more NEAR.`);
        setFundReceived(true);
        setFundReceivedFailed(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorinfo("Failed to check balance. Try again.");
      setFundReceivedFailed(true);
    }
  };


  const sendfunds = async (): Promise<void> => {
    try {
      const donatorName = depositAddress
        ? `${depositAddress.slice(0, 6)}-${depositAddress.slice(
            -6
          )}`.toLowerCase()
        : "";



      const statusResponse = await fetch(
        `https://1click.chaindefuser.com/v0/status?depositAddress=${depositAddress}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!statusResponse.ok) {
        throw new Error(`Failed to check status: ${statusResponse.statusText}`);
      }

      const statusData = await statusResponse.json();
   
      setSwapData(statusData);
      if (statusData.status === "SUCCESS") {
        setFundReceived(true);
        setFundReceivedFailed(false);

        await new Promise((resolve) => setTimeout(resolve, 2000));
        setFundConverted(true);

        await new Promise((resolve) => setTimeout(resolve, 1500));
        setFundDeposited(true);
        if (CampaignImg !== "Direct") {
          try {
            const donateResponse = await fetch(
              "https://us-central1-almond-1b205.cloudfunctions.net/potluck/donate",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username: donatorName,
                  deposit: statusData.swapDetails.amountOutFormatted,
                  campaign_id: String(campaignID),
                  walletID: walletID ?? null,
                }),
              }
            );

            if (!donateResponse.ok) {
              const errorText = await donateResponse.text();
              throw new Error(
                `Donation failed: ${donateResponse.status} - ${errorText}`
              );
            }

            const donateData = await donateResponse.json();
            console.log("Donation response:", donateData);
          } catch (err) {
            console.error("Error during donation:", err);
          }
        }

        setFundDonated(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        onProceed(
          statusData.swapDetails.nearTxHashes[1],
          CampaignName,
          amount,
          statusData.swapDetails.amountInUsd,
          statusData.quote.amountOutFormatted
        );
      } else if (statusData.status === "INCOMPLETE_DEPOSIT") {
        setErrorinfo('Incomplete deposit. Send the exact amount.');
        setFundReceived(true);
        setFundReceivedFailed(true);
      }else{
        setFundReceived(true);
        setFundReceivedFailed(true);
      }
    } catch (error) {
      console.error("Error in sendfunds:", error);

      if (error instanceof Error) {
        alert(`Transaction failed: ${error.message}`);
      } else {
        alert("An unknown error occurred during the transaction");
      }

      throw error;
    }
  };

  useEffect(() => {
    // if (tokenID === 'nep141:wrap.near' && CampaignImg !== "Direct"){
    //   fetchBalance();
    // }else{
    //   sendfunds();
    // }

    sendfunds();
  }, []);

  const handleQuit = () => {
    console.log("User confirmed quit in Modal4");
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
          width: "400px",
          maxHeight: "80vh",
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

<svg
            width="16"
            height="16"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: "absolute",
              left: isMobile ? "28px" : "28px",
              cursor: "pointer",
              transition: "transform 0.2s, fill 0.3s",
              ...(isBackSvgHovered && {
                transform: "scale(1.1)",
                fill: "#a3bffa",
              }),
            }}
            onMouseEnter={() => setIsBackSvgHovered(true)}
            onMouseLeave={() => setIsBackSvgHovered(false)}
            onClick={(e) => {
              e.stopPropagation();
              console.log("Back button clicked in Modal4");
              onBack(depositAddress, walletbalance);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                console.log("Back button activated via keyboard in Modal4");
                onBack(depositAddress, walletbalance);
              }
            }}
            aria-label="Back"
            role="button"
            tabIndex={0}
          >
            <path
              d="M16 7.5L3.83 7.5L9.42 1.91L8 0.5L0 8.5L8 16.5L9.41 15.09L3.83 9.5L16 9.5L16 7.5Z"
              fill={isBackSvgHovered ? "#a3bffa" : "#FCCFCF"}
            />
          </svg>

          <div
            style={{
              fontSize: isMobile ? "16px" : "20px",
              fontFamily: "'Mona Sans', sans-serif",
              fontWeight: 600,
              margin: 0,
              textAlign: "center",
            }}
          >
              Confirm Deposit
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
            paddingBottom: "80px", 
            scrollbarWidth: "none",    
            msOverflowStyle: "none",    
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                fontSize: isMobile ? "16px" : "18px",
                marginBottom: "30px",
                color: "#000000",
                fontFamily: "'Mona Sans', sans-serif",
                fontWeight: 600,
              
              }}
            >
            
              Processing Your Cross-Chain Deposit
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                gap: "15px",
                width:isMobile ?  "90%" : "70%",
              //  marginBottom: "20px",
                textAlign: "left",
                ...(isMobile && {
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "15px",
                }),
                marginTop: 20
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "30px",
                  ...(isMobile && { gap: "20px" }),
                }}
              >
                {FundReceived ? (
                  FundReceivedFailed ? (
                    <div
                      style={{
                        width:isMobile ? "35px" : "45px",
                        height:isMobile ? "35px" : "45px",
                        borderRadius: "50%",
                        background: "#FF0000",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#ffffff",
                        fontSize: "14px",
                        fontWeight: 600,
                      
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="white"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 0 0-1.41 1.41L10.59 12l-4.89 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z" />
                      </svg>
                    </div>
                  ) : (
                    <div
                      style={{
                        width:isMobile ? "35px" : "45px",
                        height:isMobile ? "35px" : "45px",
                        borderRadius: "50%",
                        background: "#00EC97",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#ffffff",
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="white"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 16.17l-3.88-3.88-1.41 1.41L9 19 20.29 7.71l-1.41-1.41z" />
                      </svg>
                    </div>
                  )
                ) : (
                  <div
                    style={{
                      width:isMobile ? "35px" : "45px",
                      height:isMobile ? "35px" : "45px",
                      borderRadius: "50%",
                      background: "#737373",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 600,
                      fontFamily: "'Mona Sans', sans-serif",
                     marginTop: isMobile ? 0 :8,

                    }}
                  >
                    1
                  </div>
                )}
                <div
                  style={{
                    width: "1px",
                    marginTop:"-30%"
                   
                  }}
                >
                  <svg
                    width="1"
                    height="36"
                    viewBox="0 0 1 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      x1="0.5"
                      y1="0.5"
                      x2="0.499998"
                      y2="35.5"
                      stroke="#A6A6A6"
                    />
                  </svg>
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <div
                  style={{
                    fontSize: isMobile ? "15px" : "16px",
                    fontWeight: 600,
                    color: "#000000",
                    fontFamily: "'Mona Sans', sans-serif",
                    marginTop : isMobile ?  '-15%' : ''
                  }}
                >
                  Receiving funds from {blockchain}
                </div>
                {FundReceived ? (
                  FundReceivedFailed ? (
                    <div
                      style={{
                        fontSize: isMobile ? "13px" : "14px",
                        color: "#FF0000",
                        fontFamily: "'Mona Sans', sans-serif",
                      }}
                    >
                     {Errorinfo}
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          fontSize: isMobile ? "13px" : "14px",
                          color: "#333333",
                          fontFamily: "'Mona Sans', sans-serif",
                        }}
                      >
                        Received {amount} sent from your wallet
                      </div>
                      <a
                        href={`https://nearblocks.io/txns/${swapData?.swapDetails?.nearTxHashes[0]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: isMobile ? "13px" : "14px",
                          color: "#262626",
                          textDecoration: "none",
                          fontFamily: "'Mona Sans', sans-serif",
                          transition: "color 0.3s",
                          ...(isTxLink1Hovered && { color: "#a3bffa" }),
                        }}
                        onMouseEnter={() => setIsTxLink1Hovered(true)}
                        onMouseLeave={() => setIsTxLink1Hovered(false)}
                      >
                        View Transaction
                        <span style={{ marginLeft: 5 }}>
                          <svg
                            width="24"
                            height="25"
                            viewBox="0 0 24 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M15 3.5H21M21 3.5V9.5M21 3.5L10 14.5M18 13.5V19.5C18 20.0304 17.7893 20.5391 17.4142 20.9142C17.0391 21.2893 16.5304 21.5 16 21.5H5C4.46957 21.5 3.96086 21.2893 3.58579 20.9142C3.21071 20.5391 3 20.0304 3 19.5V8.5C3 7.96957 3.21071 7.46086 3.58579 7.08579C3.96086 6.71071 4.46957 6.5 5 6.5H11"
                              stroke={isTxLink1Hovered ? "#a3bffa" : "#262626"}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </a>
                    </>
                  )
                ) : (
                  <div
                    style={{
                      fontSize: isMobile ? "13px" : "14px",
                      color: "#737373",
                      fontFamily: "'Mona Sans', sans-serif",
                    }}
                  >
                    Awaiting confirmation of received funds....
                  </div>
                )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                gap: "15px",
                width:isMobile ?  "90%" : "70%",
                marginBottom: "20px",
                textAlign: "left",
                ...(isMobile && {
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "15px",
                }),
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "30px",
                  ...(isMobile && { gap: "20px" }),
                }}
              >
                {FundConverted ? (
                  <div
                    style={{
                      width:isMobile ? "35px" : "45px",
                      height:isMobile ? "35px" : "45px",
                      borderRadius: "50%",
                      background: "#00EC97",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      fill="white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.17l-3.88-3.88-1.41 1.41L9 19 20.29 7.71l-1.41-1.41z" />
                    </svg>
                  </div>
                ) : (
                  <div
                    style={{
                      width:isMobile ? "35px" : "45px",
                        height:isMobile ? "35px" : "45px",
                      borderRadius: "50%",
                      background: "#737373",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 600,
                     marginTop: 5,
                    }}
                  >
                    2
                  </div>
                )}
                <div
                  style={{
                    width: "1px",
                    marginTop:"-30%"
                  }}
                >
                  <svg
                    width="1"
                    height="36"
                    viewBox="0 0 1 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      x1="0.5"
                      y1="0.5"
                      x2="0.499998"
                      y2="35.5"
                      stroke="#A6A6A6"
                    />
                  </svg>
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <div
                  style={{
                    fontSize: isMobile ? "15px" : "16px",
                    fontWeight: 600,
                    color: "#000000",
                    fontFamily: "'Mona Sans', sans-serif",
                    marginTop : isMobile ?  '-15%' : '3%'
                  }}
                >
                  Withdrawing to NEAR Intent
                </div>
                {FundConverted ? (
                  <>
                    <div
                      style={{
                        fontSize: isMobile ? "13px" : "14px",
                        color: "#333333",
                        fontFamily: "'Mona Sans', sans-serif",
                      }}
                    >
                      Withdrawal completed successfully
                    </div>
                    <a
                      href={`https://nearblocks.io/txns/${swapData?.swapDetails?.nearTxHashes[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: isMobile ? "13px" : "14px",
                        color: "#262626",
                        textDecoration: "none",
                        fontFamily: "'Mona Sans', sans-serif",
                        transition: "color 0.3s",
                        ...(isTxLink2Hovered && { color: "#a3bffa" }),
                      }}
                      onMouseEnter={() => setIsTxLink2Hovered(true)}
                      onMouseLeave={() => setIsTxLink2Hovered(false)}
                    >
                      View Transaction
                      <span style={{ marginLeft: 25 }}>
                        <svg
                          width="24"
                          height="25"
                          viewBox="0 0 24 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15 3.5H21M21 3.5V9M21 3.5L10 14.5M18 13.5V19.5C18 20.0304 17.7893 20.5391 17.4142 20.9142C17.0391 21.2893 16.5304 21.5 16 21.5H5C4.46957 21.5 3.96086 21.2943 3.58579 20.9142C3.21071 20.5391 3 20.0304 3 19.5V8.5C3 7.96957 3.21071 7.46086 3.58579 7.08579C3.96086 6.71071 4.46957 6.5 5 6.5H11"
                            stroke={isTxLink2Hovered ? "#a3bffa" : "#262626"}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </a>
                  </>
                ) : (
                  <div
                    style={{
                      fontSize: isMobile ? "13px" : "14px",
                      color: "#737373",
                      fontFamily: "'Mona Sans', sans-serif",
                    }}
                  >
                    Waiting for withdrawal.....
                  </div>
                )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                gap: "15px",
                width:isMobile ?  "90%" : "70%",
                marginBottom: "20px",
                textAlign: "left",
                ...(isMobile && {
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "15px",
                }),
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "30px",
                  ...(isMobile && { gap: "10px" }),
                }}
              >
                {FundDeposited ? (
                  <div
                    style={{
                      width:isMobile ? "35px" : "45px",
                      height:isMobile ? "35px" : "45px",
                      borderRadius: "50%",
                      background: "#00EC97",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      fill="white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.17l-3.88-3.88-1.41 1.41L9 19 20.29 7.71l-1.41-1.41z" />
                    </svg>
                  </div>
                ) : (
                  <div
                    style={{
                      width:isMobile ? "35px" : "45px",
                        height:isMobile ? "35px" : "45px",
                      borderRadius: "50%",
                      background: "#737373",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 600,
                      fontFamily: "'Mona Sans', sans-serif",
                      marginTop: isMobile ? 0: 5,
                    }}
                  >
                    3
                  </div>
                )}
                <div
                  style={{
                    width: "1px",
                    marginTop: isMobile ? '' :"-30%"
                  }}
                >
                  <svg
                    width="1"
                    height="36"
                    viewBox="0 0 1 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      x1="0.5"
                      y1="0.5"
                      x2="0.499998"
                      y2="35.5"
                      stroke="#A6A6A6"
                    />
                  </svg>
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <div
                  style={{
                    fontSize: isMobile ? "15px" : "16px",
                    fontWeight: 600,
                    color: "#000000",
                    fontFamily: "'Mona Sans', sans-serif",
                    marginTop : isMobile ?  '-15%' : '3%'
                  }}
                >
                  Converting to Near
                </div>
                {FundDeposited ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      flexWrap: "wrap",
                      fontSize: isMobile ? "13px" : "14px",
                    }}
                  >
                      <span style={{ display: "flex", alignItems: "center", gap: '7px' }}>
                      <img 
              src={tokenImg} 
              alt={'image'}
              style={{
                width: "21px",
                height: "21px",
                borderRadius: "50%",
                objectFit: "cover"
              }}/>
                      <span style={{ fontWeight: 550, color: "#000000" }}>
                      {parseFloat(amount).toFixed(2)} ➝
                    </span>
                      </span>
                    
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <svg
                        width="21"
                        height="21"
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ marginRight: "6px" }}
                      >
                        <path
                          d="M24 12.5C24 5.37258 18.6274 0.5 12 0.5C5.37258 0.5 0 5.37258 0 12.5C0 19.1274 5.37258 24.5 12 24.5C18.6274 24.5 24 19.1274 24 12.5Z"
                          fill="black"
                        />
                        <path
                          d="M15.5159 7.26259L13.0785 10.8792C12.9118 11.1292 13.2368 11.4209 13.4702 11.2167L15.5951 9.13341C15.6577 9.07924 15.7492 9.11674 15.7492 9.20841V15.7292C15.7492 15.8167 15.6326 15.8541 15.5826 15.7917L8.59933 7.10843C8.48532 6.96875 8.34097 6.85545 8.17714 6.77894C8.01333 6.70244 7.83428 6.66408 7.6535 6.66676C6.90351 6.66676 6.16602 7.04592 6.16602 7.91258V17.0833C6.16759 17.3535 6.25697 17.6159 6.42067 17.8309C6.58437 18.0458 6.81352 18.2018 7.07358 18.2751C7.33363 18.3485 7.61048 18.3353 7.8624 18.2375C8.1143 18.1398 8.32762 17.9629 8.47016 17.7333L10.9035 14.1167C11.07015 13.8667 10.7493 13.57543 10.516 13.7792L8.4035 15.9042C8.34094 15.9584 8.24933 15.9209 8.24933 15.8292V9.32507C8.24933 9.23341 8.366 9.2000 8.416 9.26257L15.3868 17.8916C15.6201 18.1792 15.9701 18.3333 16.3325 18.3333C17.0868 18.3333 17.8326 17.9583 17.8326 17.0875V7.91675C17.8325 7.44439 17.7428 7.37961 17.5782 7.16267C17.4136 6.94574 17.1824 6.78852 16.9202 6.71494C16.658 6.64136 16.3789 6.65545 16.1255 6.75506C15.8719 6.85467 15.658 7.03434 15.5159 7.26676V7.26259Z"
                          fill="#00EC97"
                        />
                      </svg>
                      <span style={{ fontWeight: 550, color: "#000000" }}>
                        {(swapData?.swapDetails?.amountOutFormatted
                          ? parseFloat(swapData.swapDetails.amountOutFormatted)
                          : 0
                        ).toFixed(2)}{" "}
                        NEAR
                      </span>
                    </span>
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: isMobile ? "13px" : "14px",
                      color: "#737373",
                      fontFamily: "'Mona Sans', sans-serif",
                    }}
                  >
                    Awaiting funds withdrawal for conversion.....
                  </div>
                )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                gap: "15px",
                width:isMobile ?  "90%" : "70%",
                marginBottom: "20px",
                textAlign: "left",
                ...(isMobile && {
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "15px",
                }),
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "30px",
                  ...(isMobile && { gap: "10px" }),
                }}
              >
                {FundDonated ? (
                  <div
                    style={{
                      width:isMobile ? "35px" : "45px",
                      height:isMobile ? "35px" : "45px",
                      borderRadius: "50%",
                      background: "#00EC97",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      fill="white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.17l-3.88-3.88-1.41 1.41L9 19 20.29 7.71l-1.41-1.41z" />
                    </svg>
                  </div>
                ) : (
                  <div
                    style={{
                      width:isMobile ? "35px" : "45px",
                      height:isMobile ? "35px" : "45px",
                      borderRadius: "50%",
                      background: "#737373",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 600,
                     marginTop: 5,
                    }}
                  >
                    4
                  </div>
                )}
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <div
                  style={{
                    fontSize: isMobile ? "15px" : "16px",
                    fontWeight: 600,
                    color: "#000000",
                    fontFamily: "'Mona Sans', sans-serif",
                    marginTop : isMobile ?  '' : '3%'
                  }}
                >
                  Depositing
                </div>
                {FundDonated ? (
                  <div
                    style={{
                      fontSize: isMobile ? "13px" : "14px",
                      color: "#737373",
                      fontFamily: "'Mona Sans', sans-serif",
                    }}
                  >
                    Successfully deposited {amount} Near to{" "}
                    <strong style={{ fontWeight: 600, color: "#000000" }}>
                      {CampaignName}
                    </strong>
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: isMobile ? "13px" : "14px",
                      color: "#737373",
                      fontFamily: "'Mona Sans', sans-serif",
                    }}
                  >
                    {textInfo} Pending.....
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            position: "sticky",
            bottom: 0,
            background: "#ffffff",
            paddingTop: "20px",
            borderTop: "1px solid #e6ecef",
            ...(isMobile && {
              paddingTop: "15px",
            }),
          }}
        >
          <button
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Mona Sans', sans-serif",
              width: "408px",
              minWidth: "320px",
              height: "55px",
              gap: "4px",
              borderRadius: "16px",
              padding: "8px 12px",
              backgroundColor: "#000000",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 500,
              cursor: "pointer",
              border: "none",
              textAlign: "center",
              ...(isButtonHovered && { opacity: 0.9 }),
              ...(isMobile && {
                width: "100%",
                padding: "10px",
                fontSize: "15px",
              }),
            }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            onClick={(refreshTransaction)}
            
          >
            Refresh Transaction
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

export default Modal4;















