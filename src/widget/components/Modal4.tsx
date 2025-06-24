import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";

interface Modal4Props {
  amount: string;
  depositAddress: string;
  campaignID: number;
  blockchain: string;
  CampaignName: string;
  CampaignImg: string;
  CampaignDesc: string;
  walletID: any;
  onClose: () => void;
  onBack: (depositAddress: string) => void;
  onProceed: (
    txHash: string,
    campaignName: string,
    amount: string,
    usdAmount: string
  ) => void;
}

const inlineStyles = {
  modalOverlay: {
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
  },
  modalContent: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "15px",
    width: "400px",
    maxHeight: "80vh",
    overflowY: "auto",
    position: "relative",
    fontFamily: "'Lato', sans-serif",
    boxShadow: "0 12px 35px rgba(0, 0, 0, 0.15)",
    border: "1px solid #e6ecef",
    scrollbarWidth: "none",
  },
  modalHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#262626",
    color: "#ffffff",
    padding: "28px 18px",
    borderRadius: "15px 15px 0 0",
    margin: "-30px -30px 25px -30px",
    fontWeight: 700,
  },
  modalTitle: {
    flexGrow: 1,
    textAlign: "center",
    fontSize: "20px",
    fontWeight: 700,
    marginLeft: "0px",
  },

  modalTitleMobile: {
    flexGrow: 1,
    textAlign: "center",
    fontSize: "18px",
    fontWeight: 700,
    marginLeft: "30px",
  },
  backButtonSvg: {
    cursor: "pointer",
    transition: "transform 0.2s, fill 0.3s",
  },
  backButtonSvgHover: {
    transform: "scale(1.1)",
    fill: "#a3bffa",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "26px",
    color: "#FCCFCF",
    cursor: "pointer",
    fontFamily: "'Lato', sans-serif",
    transition: "color 0.3s, transform 0.2s",
  },
  closeButtonHover: {
    color: "#a3bffa",
    transform: "scale(1.1)",
  },
  modalBody: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  processingTitle: {
    textAlign: "center",
    fontSize: "17px",
    marginBottom: "30px",
    color: "#000000",
    fontFamily: "'Mona Sans', sans-serif",
    fontWeight: 600,
  },
  step: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: "15px",
    width: "70%",
    marginBottom: "20px",
    textAlign: "left",
  },
  stepIconContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "30px",
  },
  stepIconSuccess: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    background: "#00EC97",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 600,
  },
  stepIconPending: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    background: "#A6A6A6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 600,
  },
  stepIconFailed: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    background: "#FF0000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 600,
  },
  stepConnector: {
    width: "1px",
    height: "36px",
  },
  stepContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  stepTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#000000",
    fontFamily: "'Mona Sans', sans-serif",
  },
  stepDesc: {
    fontSize: "14px",
    color: "#333333",
    fontFamily: "'Lato', sans-serif",
  },
  stepDescFailed: {
    fontSize: "14px",
    color: "#FF0000",
    fontFamily: "'Lato', sans-serif",
  },
  txLink: {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    color: "#262626",
    textDecoration: "none",
    fontFamily: "'Lato', sans-serif",
    transition: "color 0.3s",
  },
  txLinkHover: {
    color: "#a3bffa",
  },
  button: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "408px",
    minWidth: "80px",
    height: "48px",
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
  },
  buttonHover: {
    opacity: 0.9,
  },
  buttonDisabled: {
    backgroundColor: "#00000044",
    cursor: "not-allowed",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "25px",
    paddingTop: "20px",
    borderTop: "1px solid #e6ecef",
  },
  // Mobile styles
  modalContentMobile: {
    width: "80%",
    padding: "20px",
  },
  modalHeaderMobile: {
    padding: "20px 12px",
    margin: "-20px -20px 20px -20px",
  },
  closeButtonMobile: {
    fontSize: "22px",
  },
  stepMobile: {
    flexDirection: "row",
    alignItems: "center",
    gap: "15px",
  },
  stepIconContainerMobile: {
    gap: "20px",
  },
  buttonMobile: {
    width: "100%",
    padding: "10px",
    fontSize: "15px",
  },
  modalFooterMobile: {
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px",
    paddingTop: "15px",
  },
};

const Modal4: React.FC<Modal4Props> = ({
  onProceed,
  onClose,
  onBack,
  amount = "",
  depositAddress = "",
  campaignID = "",
  blockchain = "",
  CampaignName = "",
  CampaignImg = "",
  CampaignDesc = "",
  walletID = null,
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
  const modalRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const refreshTransaction = async (): Promise<void> => {
    setFundReceived(false);
    setFundReceivedFailed(false);
    setFundConverted(false);
    setFundDeposited(false);
    setFundDonated(false);
    sendfunds();
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
      console.log("Status check response:", statusData);
      setSwapData(statusData);
      if (statusData.status === "SUCCESS") {
        setFundReceived(true);

        await new Promise((resolve) => setTimeout(resolve, 2000));
        setFundConverted(true);

        await new Promise((resolve) => setTimeout(resolve, 1500));
        setFundDeposited(true);
        if (CampaignImg !== "Direct") {
          try {
            const donateResponse = await fetch("https://us-central1-almond-1b205.cloudfunctions.net/potluck/donate", {
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
            });

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

        onProceed(
          statusData.swapDetails.nearTxHashes[1],
          CampaignName,
          amount,
          statusData.swapDetails.amountInUsd
        );
      } else {
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
    sendfunds();
  }, []);

  return (
    <div style={inlineStyles.modalOverlay} onClick={onClose}>
      <div
        style={{
          ...inlineStyles.modalContent,
          ...(isMobile ? inlineStyles.modalContentMobile : {}),
        }}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <div
          style={{
            ...inlineStyles.modalHeader,
            ...(isMobile ? inlineStyles.modalHeaderMobile : {}),
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              ...inlineStyles.backButtonSvg,
              ...(isBackSvgHovered ? inlineStyles.backButtonSvgHover : {}),
            }}
            onMouseEnter={() => setIsBackSvgHovered(true)}
            onMouseLeave={() => setIsBackSvgHovered(false)}
            onClick={(e) => {
              e.stopPropagation();
              console.log("Back button clicked in Modal4");
              onBack(depositAddress);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                console.log("Back button activated via keyboard in Modal4");
                onBack(depositAddress);
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
          <h2
            style={{
              ...inlineStyles.modalTitle,
              ...inlineStyles.modalTitleMobile,
            }}
          >
            Confirm Your Donation
          </h2>
          <button
            style={{
              ...inlineStyles.closeButton,
              ...(isCloseButtonHovered ? inlineStyles.closeButtonHover : {}),
              ...(isMobile ? inlineStyles.closeButtonMobile : {}),
            }}
            onMouseEnter={() => setIsCloseButtonHovered(true)}
            onMouseLeave={() => setIsCloseButtonHovered(false)}
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div style={inlineStyles.modalBody}>
          <h2 style={inlineStyles.processingTitle}>
            Processing Your Cross-Chain Donation
          </h2>
          <div
            style={{
              ...inlineStyles.step,
              ...(isMobile ? inlineStyles.stepMobile : {}),
            }}
          >
            <div
              style={{
                ...inlineStyles.stepIconContainer,
                ...(isMobile ? inlineStyles.stepIconContainerMobile : {}),
              }}
            >
              {FundReceived ? (
                FundReceivedFailed ? (
                  <div style={inlineStyles.stepIconFailed}>
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
                  <div style={inlineStyles.stepIconSuccess}>
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
                <div style={inlineStyles.stepIconPending}>1</div>
              )}
              <div style={inlineStyles.stepConnector}>
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
            <div style={inlineStyles.stepContent}>
              <div style={inlineStyles.stepTitle}>
                Receiving funds from {blockchain}
              </div>
              {FundReceived ? (
                FundReceivedFailed ? (
                  <div style={inlineStyles.stepDescFailed}>
                    Failed to receive the deposited amount. Please ensure the
                    funds were sent to the correct address
                  </div>
                ) : (
                  <>
                    <div style={inlineStyles.stepDesc}>
                      Received {amount} sent from your wallet
                    </div>
                    <a
                      href={`https://nearblocks.io/txns/${swapData?.swapDetails?.nearTxHashes[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        ...inlineStyles.txLink,
                        ...(isTxLink1Hovered ? inlineStyles.txLinkHover : {}),
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
                <div style={inlineStyles.stepDesc}>
                  Awaiting confirmation of received funds....
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              ...inlineStyles.step,
              ...(isMobile ? inlineStyles.stepMobile : {}),
            }}
          >
            <div
              style={{
                ...inlineStyles.stepIconContainer,
                ...(isMobile ? inlineStyles.stepIconContainerMobile : {}),
              }}
            >
              {FundConverted ? (
                <div style={inlineStyles.stepIconSuccess}>
                  <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                    <path d="M9 16.17l-3.88-3.88-1.41 1.41L9 19 20.29 7.71l-1.41-1.41z" />
                  </svg>
                </div>
              ) : (
                <div style={inlineStyles.stepIconPending}>2</div>
              )}
              <div style={inlineStyles.stepConnector}>
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
            <div style={inlineStyles.stepContent}>
              <div style={inlineStyles.stepTitle}>
                Withdrawing to NEAR Intent
              </div>
              {FundConverted ? (
                <>
                  <div style={inlineStyles.stepDesc}>
                    Withdrawal completed successfully
                  </div>
                  <a
                    href={`https://nearblocks.io/txns/${swapData?.swapDetails?.nearTxHashes[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      ...inlineStyles.txLink,
                      ...(isTxLink2Hovered ? inlineStyles.txLinkHover : {}),
                    }}
                    onMouseEnter={() => setIsTxLink2Hovered(true)}
                    onMouseLeave={() => setIsTxLink2Hovered(false)}
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
                          stroke={isTxLink2Hovered ? "#a3bffa" : "#262626"}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </a>
                </>
              ) : (
                <div style={inlineStyles.stepDesc}>
                  Waiting for withdrawal.....
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              ...inlineStyles.step,
              ...(isMobile ? inlineStyles.stepMobile : {}),
            }}
          >
            <div
              style={{
                ...inlineStyles.stepIconContainer,
                ...(isMobile ? inlineStyles.stepIconContainerMobile : {}),
              }}
            >
              {FundDeposited ? (
                <div style={inlineStyles.stepIconSuccess}>
                  <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                    <path d="M9 16.17l-3.88-3.88-1.41 1.41L9 19 20.29 7.71l-1.41-1.41z" />
                  </svg>
                </div>
              ) : (
                <div style={inlineStyles.stepIconPending}>3</div>
              )}
              <div style={inlineStyles.stepConnector}>
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
            <div style={inlineStyles.stepContent}>
              <div style={inlineStyles.stepTitle}>Converting to Near</div>
              {FundDeposited ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontWeight: 550, color: "#000000" }}>
                    {amount} ➝
                  </span>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <svg
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ marginRight: "6px" }}
                    >
                      <path
                        d="M24 12.5C24 5.87258 18.6274 0.5 12 0.5C5.37258 0.5 0 5.87258 0 12.5C0 19.1274 5.37258 24.5 12 24.5C18.6274 24.5 24 19.1274 24 12.5Z"
                        fill="black"
                      />
                      <path
                        d="M15.5159 7.26259L13.0785 10.8792C12.9118 11.1292 13.2368 11.4209 13.4702 11.2167L15.5951 9.13341C15.6577 9.07924 15.7492 9.11674 15.7492 9.20841V15.7292C15.7492 15.8167 15.6326 15.8541 15.5826 15.7917L8.59933 7.10843C8.48532 6.96809 8.34097 6.85545 8.17714 6.77894C8.01333 6.70244 7.83428 6.66408 7.6535 6.66676C6.90351 6.66676 6.16602 7.04592 6.16602 7.91258V17.0833C6.16759 17.3535 6.25697 17.6159 6.42067 17.8309C6.58437 18.0458 6.81352 18.2018 7.07358 18.2751C7.33363 18.3485 7.61048 18.3353 7.8624 18.2375C8.1143 18.1398 8.32762 17.9629 8.47016 17.7333L10.9035 14.1167C11.0702 13.8667 10.7493 13.575 10.516 13.7792L8.4035 15.9042C8.34099 15.9584 8.24933 15.9209 8.24933 15.8292V9.32507C8.24933 9.23341 8.366 9.20007 8.416 9.26257L15.3868 17.8916C15.6201 18.1792 15.9701 18.3333 16.3325 18.3333C17.0868 18.3333 17.8326 17.9583 17.8326 17.0875V7.91675C17.8322 7.64439 17.7428 7.37961 17.5782 7.16267C17.4136 6.94574 17.1824 6.78852 16.9202 6.71494C16.658 6.64136 16.3789 6.65545 16.1255 6.75506C15.8719 6.85467 15.658 7.03434 15.5159 7.26676V7.26259Z"
                        fill="#00EC97"
                      />
                    </svg>
                    <span style={{ fontWeight: 550, color: "#000000" }}>
                      {(swapData?.swapDetails?.amountOutFormatted
                        ? parseFloat(swapData.swapDetails.amountOutFormatted)
                        : 0
                      ).toFixed(2)}{" "}
                      Near
                    </span>
                  </span>
                </div>
              ) : (
                <div style={inlineStyles.stepDesc}>
                  Awaiting funds withdrawal for conversion.....
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              ...inlineStyles.step,
              ...(isMobile ? inlineStyles.stepMobile : {}),
            }}
          >
            <div
              style={{
                ...inlineStyles.stepIconContainer,
                ...(isMobile ? inlineStyles.stepIconContainerMobile : {}),
              }}
            >
              {FundDonated ? (
                <div style={inlineStyles.stepIconSuccess}>
                  <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                    <path d="M9 16.17l-3.88-3.88-1.41 1.41L9 19 20.29 7.71l-1.41-1.41z" />
                  </svg>
                </div>
              ) : (
                <div style={inlineStyles.stepIconPending}>4</div>
              )}
            </div>
            <div style={inlineStyles.stepContent}>
              <div style={inlineStyles.stepTitle}>Donating to campaign</div>
              {FundDonated ? (
                <div style={inlineStyles.stepDesc}>
                  Successfully deposited {amount} Near to{" "}
                  <strong style={{ fontWeight: 600, color: "#000000" }}>
                    {CampaignName}
                  </strong>
                </div>
              ) : (
                <div style={inlineStyles.stepDesc}>Donation Pending.....</div>
              )}
            </div>
          </div>
          <div
            style={{
              ...inlineStyles.modalFooter,
              ...(isMobile ? inlineStyles.modalFooterMobile : {}),
            }}
          >
            <button
              style={{
                ...inlineStyles.button,
                ...(isButtonHovered ? inlineStyles.buttonHover : {}),
                ...(isMobile ? inlineStyles.buttonMobile : {}),
              }}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              onClick={refreshTransaction}
            >
              Refresh Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal4;
