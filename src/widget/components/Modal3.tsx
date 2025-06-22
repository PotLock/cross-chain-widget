import React, { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useMediaQuery } from "react-responsive";

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
    marginLeft: "40px",
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
  qrInstruction: {
    marginBottom: "20px",
    textAlign: "center",
  },
  qrInstructionTitle: {
    fontSize: "16px",
    fontWeight: 600,
    marginBottom: "10px",
    color: "#000000",
  },
  qrInstructionText: {
    fontSize: "15px",
    color: "#1e293b",
  },
  qrCodeContainer: {
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
  },

  qrCodeContainerMobile: {
    width: "180px",
    height: "180px",
    padding: "15px",
    marginLeft: "0",
    margin: "0 auto",
  },

  depositAddress: {
    display: "flex",
    flexDirection: "row",
    width: "380px",
    minHeight: "48px",
    gap: "12px",
    borderRadius: "4px",
    padding: "12px",
    backgroundColor: "#F7F7F7",
    border: "1px solid #C7C7C7",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "40px",
  },

  depositAddressMobile: {
    width: "92%",
    padding: "10px",
    marginTop: "30px",
  },
  addressContainer: {
    display: "flex",
    flexDirection: "column",
    fontSize: "14px",
    color: "#1e293b",
    textAlign: "left",
  },
  copyButton: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: "8px",
    borderRadius: "4px",
    transition: "background 0.3s, transform 0.2s",
  },
  copyButtonHover: {
    background: "#f2f2f2",
    transform: "translateY(-2px)",
  },
  importantNote: {
    background: "#F7F7F7",
    padding: "15px",
    borderRadius: "10px",
    margin: "15px 0",
    fontFamily: "Lato, sans-serif",
    fontSize: "15px",
    color: "#7B7B7B",
    borderLeft: "4px solid #262626",
    textAlign: "left",
  },
  importantNoteStrong: {
    fontWeight: 600,
    color: "#000000",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "25px",
    paddingTop: "20px",
    borderTop: "1px solid #e6ecef",
  },
  backButton: {
    padding: "14px 30px",
    background: "#e6ecef",
    color: "#111827",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    marginRight: "15px",
    fontFamily: "'Lato', sans-serif",
    fontWeight: 700,
    transition: "background 0.3s, transform 0.2s, box-shadow 0.3s",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  backButtonHover: {
    background: "#d1d8e0",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
  },
  sentFundsButton: {
    padding: "14px 30px",
    background: "#000000",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontFamily: "'Lato', sans-serif",
    fontWeight: 700,
    transition: "background 0.3s, transform 0.2s, box-shadow 0.3s",
  },
  sentFundsButtonHover: {
    background: "#000000",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 10px rgba(30, 58, 138, 0.4)",
  },

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
  modalFooterMobile: {
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px",
    paddingTop: "15px",
  },
  backButtonMobile: {
    padding: "12px 20px",
    width: "100%",
    boxSizing: "border-box",
    marginRight: "0",
  },
  sentFundsButtonMobile: {
    padding: "12px 20px",
    width: "100%",
    boxSizing: "border-box",
  },
};

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
}) => {
  const [pool, setPool] = useState<any | null>(null);
  const [isCloseButtonHovered, setIsCloseButtonHovered] = useState(false);
  const [isBackButtonHovered, setIsBackButtonHovered] = useState(false);
  const [isSentFundsButtonHovered, setIsSentFundsButtonHovered] =
    useState(false);
  const [isCopyButtonHovered, setIsCopyButtonHovered] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const [isCopied, setisCopied] = useState(false);

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

    return result;
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
          destinationAsset: "nep141:wrap.near",
          amount: mainAmount,
          refundTo: senderaddress,
          refundType: "ORIGIN_CHAIN",
          recipient: "potluck_intents.near",
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

      const data = await response.json();
      console.log(data);
      setPool(data);
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    if (!isdeposit) {
      fetchTokens2();
    }
  }, []);

  function shortenHash(hash: string): string {
    if (!hash || typeof hash !== "string") {
      return "Loading...";
    }
    if (hash.length < 1) return hash;
    return `${hash.slice(0, 7)}....${hash.slice(-7)}`;
  }

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
          <h2 style={inlineStyles.modalTitle}>Confirm Your Donation</h2>
          <button
            style={{
              ...inlineStyles.closeButton,
              ...(isCloseButtonHovered ? inlineStyles.closeButtonHover : {}),
              ...(isMobile ? inlineStyles.closeButtonMobile : {}),
            }}
            onMouseEnter={() => setIsCloseButtonHovered(true)}
            onMouseLeave={() => setIsCloseButtonHovered(false)}
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div>
          <div style={inlineStyles.qrInstruction}>
            <h3 style={inlineStyles.qrInstructionTitle}>
              Scan QR Code to Donate
            </h3>
            <p style={inlineStyles.qrInstructionText}>
              Send exactly <strong>{amount}</strong> to the address below
            </p>
          </div>
          <div
            style={{
              ...inlineStyles.qrCodeContainer,
              ...(isMobile ? inlineStyles.qrCodeContainerMobile : {}),
            }}
          >
            <QRCodeSVG
              value={pool?.quote?.depositAddress || isdeposit}
              size={290}
            />
          </div>
          <div
            style={{
              ...inlineStyles.depositAddress,
              ...(isMobile ? inlineStyles.depositAddressMobile : {}),
            }}
          >
            <div style={inlineStyles.addressContainer}>
              <div>Deposit Address ({capitalizeFirstLetter(blockchain)})</div>
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
                    ...inlineStyles.copyButton,
                    ...(isCopyButtonHovered
                      ? inlineStyles.copyButtonHover
                      : {}),
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
                  ...inlineStyles.copyButton,
                  ...(isCopyButtonHovered ? inlineStyles.copyButtonHover : {}),
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
          <div style={inlineStyles.importantNote}>
            <p>
              <span style={inlineStyles.importantNoteStrong}>Heads up!</span>
              <br />• Send exactly {amount}
              <br />
              • Only send from a wallet you control
              <br />
              • This address is only valid for this specific donation
              <br />• If this campaign doesn't meet its funding goal, your
              donation will be redirected to Potlock's Community Fund instead of
              being refunded to your original wallet.
            </p>
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
              ...inlineStyles.backButton,
              ...(isBackButtonHovered ? inlineStyles.backButtonHover : {}),
              ...(isMobile ? inlineStyles.backButtonMobile : {}),
            }}
            onMouseEnter={() => setIsBackButtonHovered(true)}
            onMouseLeave={() => setIsBackButtonHovered(false)}
            onClick={onBack}
          >
            Back
          </button>
          <button
            style={{
              ...inlineStyles.sentFundsButton,
              ...(isSentFundsButtonHovered
                ? inlineStyles.sentFundsButtonHover
                : {}),
              ...(isMobile ? inlineStyles.sentFundsButtonMobile : {}),
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
    </div>
  );
};

export default Modal3;
