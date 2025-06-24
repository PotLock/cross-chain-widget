import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";

interface Modal5Props {
  onClose: () => void;
  onBack: () => void;
  txHash: string;
  campaignName: string;
  amount: string;
  usdAmount: string;
  CampaignName: string;
  CampaignImg: string;
  CampaignDesc: string;
  walletID?: any;
}

const Modal5: React.FC<Modal5Props> = ({
  onClose,
  onBack,
  txHash = "",
  campaignName = "",
  amount = "",
  usdAmount = "",
  CampaignName = "",
  CampaignImg = "",
  CampaignDesc = "",
  walletID = null,
}) => {
  const [isCloseButtonHovered, setIsCloseButtonHovered] = useState(false);
  const [isCopyButtonHovered, setIsCopyButtonHovered] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery({ maxWidth: 640 });

  const [amount_digit, amount_symbol] = amount.includes(" ")
    ? amount.split(" ")
    : [amount, "NEAR"];
  console.log(amount_digit);
  function shortenHash(hash: string): string {
    if (!hash || hash.length < 12) return hash;
    return `${hash.slice(0, 6)}....${hash.slice(-6)}`;
  }

  const donationAmount = parseFloat(amount_digit) || 0;
  const protocolFee = donationAmount * 0.025;
  const networkFee = 0.08;
  const referralFee = donationAmount * 0.05;
  const totalFee = protocolFee + networkFee;

  return (
    <div
      style={{
        position: "fixed" as const,
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
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "30px",
          borderRadius: "15px",
          width: "400px",
          maxHeight: "80vh",
          overflowY: "auto" as const,
          position: "relative",
          fontFamily: "'Lato', sans-serif",
          boxShadow: "0 12px 35px rgba(0, 0, 0, 0.15)",
          border: "1px solid #e6ecef",
          ...(isMobile && { width: "83%", padding: "20px" }),
        }}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <div
          style={{
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
            ...(isMobile && {
              padding: "20px 12px",
              margin: "-20px -20px 20px -20px",
            }),
          }}
        >
          <h2
            style={{
              flexGrow: 1,
              textAlign: "center",
              fontSize: "20px",
              fontWeight: 700,
              marginLeft: "40px",
            }}
          >
            Donation Confirmed
          </h2>
          <button
            style={{
              background: "none",
              border: "none",
              fontSize: "26px",
              color: "#FCCFCF",
              cursor: "pointer",
              fontFamily: "'Lato', sans-serif",
              transition: "color 0.3s, transform 0.2s",
              ...(isCloseButtonHovered && {
                color: "#a3bffa",
                transform: "scale(1.1)",
              }),
              ...(isMobile && { fontSize: "22px" }),
            }}
            onMouseEnter={() => setIsCloseButtonHovered(true)}
            onMouseLeave={() => setIsCloseButtonHovered(false)}
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              textAlign: "center",
              width: "80%",
              padding: "20px",
              minHeight: "400px",
              ...(isMobile && { minHeight: "300px" }),
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "449px",
                height: "592px",
                zIndex: 0,
                opacity: 0.5,
                ...(isMobile && {
                  top: 330,
                  left: 140,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  overflow: "hidden",
                }),
              }}
            >
              <svg
                width="449"
                height="592"
                viewBox="0 0 449 592"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="291.004"
                  y="104.871"
                  width="30.482"
                  height="5.28"
                  transform="rotate(-153 291.004 104.871)"
                  fill="#ECB43C"
                />
                <rect
                  x="80.6426"
                  y="328.871"
                  width="11.482"
                  height="9.28"
                  transform="rotate(30 80.6426 328.871)"
                  fill="#FDA5A5"
                  fillOpacity="0.85"
                />
                <rect
                  x="324.004"
                  y="592.871"
                  width="17.482"
                  height="8.28"
                  transform="rotate(-25 324.004 592.871)"
                  fill="#56B8A5"
                  fillOpacity="0.75"
                />
                <rect
                  x="401.004"
                  y="272.871"
                  width="15.482"
                  height="7.28"
                  transform="rotate(-27 401.004 272.871)"
                  fill="#56B8A5"
                  fillOpacity="0.85"
                />
                <rect
                  x="92.002"
                  y="394.871"
                  width="8.482"
                  height="4.28"
                  transform="rotate(-168 92.002 394.871)"
                  fill="#ECB43C"
                  fillOpacity="0.35"
                />
                <rect
                  x="17.002"
                  y="403.871"
                  width="16.482"
                  height="4.28"
                  transform="rotate(-176 17.002 403.871)"
                  fill="#56B8A5"
                />
                <rect
                  x="152.283"
                  y="298.567"
                  width="14.482"
                  height="8.28"
                  transform="rotate(-148 152.283 298.567)"
                  fill="#56B8A5"
                  fillOpacity="0.35"
                />
                <rect
                  x="272.004"
                  y="34.8711"
                  width="37.482"
                  height="5.28"
                  transform="rotate(6 272.004 34.8711)"
                  fill="#56B8A5"
                  fillOpacity="0.9"
                />
                <rect
                  x="115.002"
                  y="12.8711"
                  width="9.482"
                  height="7.28"
                  transform="rotate(-131 115.002 12.8711)"
                  fill="#3DBD96"
                  fillOpacity="0.65"
                />
                <rect
                  x="373.004"
                  y="412.871"
                  width="22.482"
                  height="8.28"
                  transform="rotate(-159 373.004 412.871)"
                  fill="#3DBD96"
                />
                <rect
                  x="136.002"
                  y="98.8711"
                  width="25.482"
                  height="4.28"
                  transform="rotate(-171 136.002 98.8711)"
                  fill="#ECB43C"
                />
                <rect
                  x="388.004"
                  y="572.871"
                  width="29.482"
                  height="4.28"
                  transform="rotate(-178 388.004 572.871)"
                  fill="#FDA5A5"
                  fillOpacity="0.65"
                />
                <rect
                  x="360.48"
                  y="140.718"
                  width="32.482"
                  height="4.28"
                  transform="rotate(-179 360.48 140.718)"
                  fill="#ECB43C"
                  fillOpacity="0.85"
                />
                <rect
                  x="109.432"
                  y="280.84"
                  width="36.482"
                  height="4.28"
                  transform="rotate(158 109.432 280.84)"
                  fill="#3DBD96"
                  fillOpacity="0.9"
                />
                <rect
                  x="32.002"
                  y="137.871"
                  width="16.482"
                  height="7.28"
                  transform="rotate(90 32.002 137.871)"
                  fill="#3DBD96"
                  fillOpacity="0.9"
                />
                <rect
                  x="334.004"
                  y="608.871"
                  width="31.482"
                  height="6.28"
                  transform="rotate(-136 334.004 608.871)"
                  fill="#56B8A5"
                  fillOpacity="0.75"
                />
                <rect
                  x="201"
                  y="309.871"
                  width="11.482"
                  height="7.28"
                  transform="rotate(74 201 309.871)"
                  fill="#ECB43C"
                  fillOpacity="0.75"
                />
                <rect
                  x="94.002"
                  y="28.8711"
                  width="29.482"
                  height="6.28"
                  transform="rotate(133 94.002 28.8711)"
                  fill="#ECB43C"
                  fillOpacity="0.85"
                />
                <rect
                  x="218.002"
                  y="595.34"
                  width="23.482"
                  height="8.28"
                  transform="rotate(-35 218.002 595.34)"
                  fill="#FDA5A5"
                  fillOpacity="0.85"
                />
                <rect
                  x="377.004"
                  y="273.871"
                  width="36.482"
                  height="4.28"
                  transform="rotate(62 377.004 273.871)"
                  fill="#56B8A5"
                  fillOpacity="0.75"
                />
                <rect
                  x="363.004"
                  y="567.871"
                  width="17.482"
                  height="7.28"
                  transform="rotate(-91 363.004 567.871)"
                  fill="#FDA5A5"
                />
                <rect
                  x="405.004"
                  y="287.871"
                  width="27.482"
                  height="8.28"
                  transform="rotate(-68 405.004 287.871)"
                  fill="#56B8A5"
                  fillOpacity="0.35"
                />
                <rect
                  x="28.002"
                  y="558.871"
                  width="8.482"
                  height="8.28"
                  transform="rotate(-52 28.002 558.871)"
                  fill="#3DBD96"
                  fillOpacity="0.6"
                />
                <rect
                  x="444.004"
                  y="413.871"
                  width="28.482"
                  height="6.28"
                  transform="rotate(-133 444.004 413.871)"
                  fill="#3DBD96"
                  fillOpacity="0.6"
                />
                <rect
                  x="401.004"
                  y="340.871"
                  width="29.482"
                  height="6.28"
                  transform="rotate(109 401.004 340.871)"
                  fill="#ECB43C"
                  fillOpacity="0.85"
                />
                <rect
                  x="415.004"
                  y="112.871"
                  width="14.482"
                  height="4.28"
                  transform="rotate(99 415.004 112.871)"
                  fill="#ECB43C"
                  fillOpacity="0.45"
                />
                <rect
                  x="194.002"
                  y="6.87109"
                  width="6.482"
                  height="5.28"
                  transform="rotate(-93 194.002 6.87109)"
                  fill="#56B8A5"
                  fillOpacity="0.75"
                />
                <rect
                  x="328.273"
                  y="286.33"
                  width="36.482"
                  height="4.28"
                  transform="rotate(-149 328.273 286.33)"
                  fill="#ECB43C"
                  fillOpacity="0.85"
                />
                <rect
                  x="407.004"
                  y="588.871"
                  width="33.482"
                  height="4.28"
                  transform="rotate(-115 407.004 588.871)"
                  fill="#FDA5A5"
                  fillOpacity="0.75"
                />
                <rect
                  x="64.002"
                  y="155.871"
                  width="36.482"
                  height="8.28"
                  transform="rotate(57 64.002 155.871)"
                  fill="#ECB43C"
                  fillOpacity="0.85"
                />
                <rect
                  x="130.725"
                  y="229.501"
                  width="7.482"
                  height="8.28"
                  transform="rotate(116 130.725 229.501)"
                  fill="#3DBD96"
                  fillOpacity="0.65"
                />
                <rect
                  x="26.002"
                  y="263.871"
                  width="20.482"
                  height="4.28"
                  transform="rotate(-19 26.002 263.871)"
                  fill="#56B8A5"
                  fillOpacity="0.9"
                />
                <rect
                  x="41.002"
                  y="386.871"
                  width="25.482"
                  height="7.28"
                  transform="rotate(7 41.002 386.871)"
                  fill="#3DBD96"
                  fillOpacity="0.6"
                />
                <rect
                  x="315.004"
                  y="22.8711"
                  width="10.482"
                  height="9.28"
                  transform="rotate(170 315.004 22.8711)"
                  fill="#ECB43C"
                  fillOpacity="0.75"
                />
                <rect
                  x="146.002"
                  y="157.871"
                  width="10.482"
                  height="6.28"
                  transform="rotate(-129 146.002 157.871)"
                  fill="#56B8A5"
                  fillOpacity="0.35"
                />
                <rect
                  x="320.004"
                  y="183.871"
                  width="18.482"
                  height="8.28"
                  transform="rotate(92 320.004 183.871)"
                  fill="#FDA5A5"
                  fillOpacity="0.85"
                />
                <rect
                  x="43.002"
                  y="186.871"
                  width="27.482"
                  height="4.28"
                  transform="rotate(-27 43.002 186.871)"
                  fill="#56B8A5"
                />
                <rect
                  x="275.004"
                  y="169.556"
                  width="8.482"
                  height="9.28"
                  transform="rotate(-52 275.004 169.556)"
                  fill="#3DBD96"
                  fillOpacity="0.35"
                />
                <rect
                  x="326.004"
                  y="203.871"
                  width="32.482"
                  height="6.28"
                  transform="rotate(71 326.004 203.871)"
                  fill="#ECB43C"
                />
                <rect
                  x="359.004"
                  y="402.871"
                  width="20.482"
                  height="5.28"
                  transform="rotate(66 359.004 402.871)"
                  fill="#ECB43C"
                  fillOpacity="0.6"
                />
                <rect
                  x="377.004"
                  y="25.8711"
                  width="35.482"
                  height="7.28"
                  transform="rotate(52 377.004 25.8711)"
                  fill="#FDA5A5"
                  fillOpacity="0.45"
                />
                <circle
                  cx="210.817"
                  cy="126.686"
                  r="6.815"
                  fill="#3DBD96"
                  fillOpacity="0.65"
                />
                <circle
                  cx="90.817"
                  cy="543.686"
                  r="6.815"
                  fill="#3DBD96"
                  fillOpacity="0.35"
                />
                <circle cx="44.817" cy="223.686" r="5.815" fill="#FDA5A5" />
                <circle
                  cx="317.319"
                  cy="198.186"
                  r="6.315"
                  fill="#FDA5A5"
                  fillOpacity="0.75"
                />
                <circle
                  cx="253.817"
                  cy="331.686"
                  r="2.815"
                  fill="#56B8A5"
                  fillOpacity="0.6"
                />
                <circle
                  cx="63.817"
                  cy="369.686"
                  r="4.815"
                  fill="#56B8A5"
                  fillOpacity="0.6"
                />
                <circle
                  cx="336.319"
                  cy="56.1861"
                  r="5.315"
                  fill="#ECB43C"
                  fillOpacity="0.6"
                />
                <circle
                  cx="136.817"
                  cy="450.686"
                  r="3.815"
                  fill="#FDA5A5"
                  fillOpacity="0.35"
                />
                <circle
                  cx="370.319"
                  cy="393.186"
                  r="3.315"
                  fill="#56B8A5"
                  fillOpacity="0.85"
                />
                <circle
                  cx="370.319"
                  cy="175.186"
                  r="3.315"
                  fill="#3DBD96"
                  fillOpacity="0.75"
                />
                <circle
                  cx="48.817"
                  cy="287.686"
                  r="5.815"
                  fill="#56B8A5"
                  fillOpacity="0.65"
                />
                <circle
                  cx="379.819"
                  cy="531.686"
                  r="2.815"
                  fill="#56B8A5"
                  fillOpacity="0.9"
                />
                <circle
                  cx="165.317"
                  cy="9.18609"
                  r="3.315"
                  fill="#3DBD96"
                  fillOpacity="0.9"
                />
                <circle
                  cx="439.819"
                  cy="502.686"
                  r="3.815"
                  fill="#ECB43C"
                  fillOpacity="0.75"
                />
                <circle
                  cx="345.319"
                  cy="114.186"
                  r="2.315"
                  fill="#FDA5A5"
                  fillOpacity="0.65"
                />
                <circle
                  cx="68.817"
                  cy="80.6861"
                  r="6.815"
                  fill="#ECB43C"
                  fillOpacity="0.85"
                />
                <circle
                  cx="152.317"
                  cy="160.186"
                  r="3.315"
                  fill="#ECB43C"
                  fillOpacity="0.6"
                />
                <circle
                  cx="267.319"
                  cy="258.186"
                  r="2.315"
                  fill="#ECB43C"
                  fillOpacity="0.45"
                />
                <circle
                  cx="403.319"
                  cy="526.186"
                  r="3.315"
                  fill="#3DBD96"
                  fillOpacity="0.45"
                />
                <circle cx="179.317" cy="154.186" r="3.315" fill="#FDA5A5" />
                <circle
                  cx="143.317"
                  cy="484.186"
                  r="6.315"
                  fill="#ECB43C"
                  fillOpacity="0.75"
                />
                <circle
                  cx="280.319"
                  cy="449.186"
                  r="6.315"
                  fill="#56B8A5"
                  fillOpacity="0.65"
                />
                <circle
                  cx="190.317"
                  cy="563.186"
                  r="4.315"
                  fill="#ECB43C"
                  fillOpacity="0.35"
                />
                <circle
                  cx="437.319"
                  cy="195.186"
                  r="4.315"
                  fill="#3DBD96"
                  fillOpacity="0.85"
                />
                <circle
                  cx="186.817"
                  cy="459.686"
                  r="6.815"
                  fill="#FDA5A5"
                  fillOpacity="0.65"
                />
                <circle
                  cx="262.319"
                  cy="137.186"
                  r="5.315"
                  fill="#FDA5A5"
                  fillOpacity="0.65"
                />
                <circle
                  cx="422.819"
                  cy="479.686"
                  r="5.815"
                  fill="#ECB43C"
                  fillOpacity="0.9"
                />
                <circle
                  cx="63.317"
                  cy="438.186"
                  r="4.315"
                  fill="#3DBD96"
                  fillOpacity="0.45"
                />
                <circle
                  cx="184.817"
                  cy="546.686"
                  r="4.815"
                  fill="#56B8A5"
                  fillOpacity="0.65"
                />
                <circle
                  cx="188.317"
                  cy="48.1861"
                  r="2.315"
                  fill="#56B8A5"
                  fillOpacity="0.85"
                />
                <circle
                  cx="322.819"
                  cy="20.6861"
                  r="6.815"
                  fill="#3DBD96"
                  fillOpacity="0.35"
                />
                <circle
                  cx="127.817"
                  cy="177.686"
                  r="2.815"
                  fill="#ECB43C"
                  fillOpacity="0.45"
                />
                <circle
                  cx="127.317"
                  cy="14.1861"
                  r="4.315"
                  fill="#FDA5A5"
                  fillOpacity="0.35"
                />
                <circle
                  cx="38.817"
                  cy="429.686"
                  r="5.815"
                  fill="#FDA5A5"
                  fillOpacity="0.75"
                />
              </svg>
            </div>
            <div
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px 0",
              }}
            >
              <div
                style={{
                  ...(isMobile && { width: "80px", height: "80px" }),
                }}
              >
                <svg
                  width={isMobile ? 80 : 100}
                  height={isMobile ? 80 : 100}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="11"
                    stroke="#22C55E"
                    strokeWidth="1"
                    fill="none"
                  />
                  <path
                    d="M9 16.17L5.12 12.29L4 13.41L9 18.5L20 7.5L18.88 6.29L9 16.17Z"
                    fill="#22C55E"
                    strokeWidth="1"
                  />
                </svg>
              </div>
              <h2
                style={{
                  fontSize: "20px",
                  color: "#000000",
                  fontFamily: "'Mona Sans', sans-serif",
                  fontWeight: 600,
                  margin: "0",
                  ...(isMobile && { fontSize: "18px" }),
                }}
                aria-live="polite"
              >
                Donation Successful!
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  color: "#333333",
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    color: "#000000",
                  }}
                >
                  {amount_digit} {amount_symbol}
                </span>{" "}
                ~
                <span
                  style={{
                    fontWeight: 600,
                    color: "#000000",
                  }}
                >
                  ${usdAmount}
                </span>
              </p>
              <p
                style={{
                  fontSize: "14px",
                  color: "#333333",
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                has been donated to{" "}
                <strong
                  style={{
                    fontWeight: 600,
                    color: "#000000",
                  }}
                >
                  {campaignName}
                </strong>
              </p>
              <div
                style={{
                  width: "100%",
                  marginTop: "20px",
                  padding: "15px",
                  border: "1px solid #e6ecef",
                  borderRadius: "8px",
                  background: "#f9f9f9",
                  ...(isMobile && { padding: "10px" }),
                }}
              >
                <h4
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#000000",
                    fontFamily: "'Mona Sans', sans-serif",
                    marginBottom: "10px",
                  }}
                >
                  Fee Breakdown
                </h4>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    color: "#333333",
                    fontFamily: "'Lato', sans-serif",
                    marginBottom: "5px",
                  }}
                >
                  <span>Protocol Fee (2.5%):</span>
                  <span>{protocolFee.toFixed(4)} NEAR</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    color: "#333333",
                    fontFamily: "'Lato', sans-serif",
                    marginBottom: "5px",
                  }}
                >
                  <span>Network Fee:</span>
                  <span>0.08 NEAR</span>
                </div>
                {walletID && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "14px",
                      color: "#333333",
                      fontFamily: "'Lato', sans-serif",
                      marginBottom: "5px",
                    }}
                  >
                    <span>Referral Fee (5%):</span>
                    <span>{referralFee.toFixed(4)} NEAR</span>
                  </div>
                )}
                <hr
                  style={{
                    border: "none",
                    borderTop: "1px solid #e6ecef",
                    margin: "10px 0",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#000000",
                    fontFamily: "'Lato', sans-serif",
                    marginTop: "10px",
                  }}
                >
                  <strong>Total (incl. fees):</strong>
                  <strong>{(donationAmount + totalFee).toFixed(4)} NEAR</strong>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "20px",
                  fontSize: "14px",
                  color: "#333333",
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                <span>Txn Hash:</span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      color: "#000000",
                      fontWeight: 600,
                    }}
                  >
                    {shortenHash(txHash)}
                  </span>
                  <div
                    style={{
                      cursor: "pointer",
                      padding: "5px",
                      borderRadius: "4px",
                      transition: "background 0.3s, transform 0.2s",
                      ...(isCopyButtonHovered && {
                        background: "#f2f2f2",
                        transform: "translateY(-2px)",
                      }),
                    }}
                    onMouseEnter={() => setIsCopyButtonHovered(true)}
                    onMouseLeave={() => setIsCopyButtonHovered(false)}
                    onClick={() => {
                      navigator.clipboard
                        .writeText(`https://nearblocks.io/txns/${txHash}`)
                        .catch((err) => {
                          console.error("Failed to copy address:", err);
                          alert("Failed to copy address. Please try again.");
                        });
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 14.8269C1.9 14.8269 1 13.9269 1 12.8269V2.8269C1 1.7269 1.9 0.826904 3 0.826904H13C14.1 0.826904 15 1.7269 15 2.8269M9 6.8269H19C20.1046 6.8269 21 7.72233 21 8.8269V18.8269C21 19.9315 20.1046 20.8269 19 20.8269H9C7.89543 20.8269 7 19.9315 7 18.8269V8.8269C7 7.72233 7.89543 6.8269 9 6.8269Z"
                        stroke={isCopyButtonHovered ? "#a3bffa" : "#292929"}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal5;
