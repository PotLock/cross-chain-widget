
import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";

const Modal2 = ({
  onProceed,
  onClose,
  onGoBack,
  campaignID = 0,
  CampaignName = "",
  CampaignImg = "",
  CampaignDesc = "",
  walletID = null,
}: {
  onProceed: (
    campaignID: number,
    amount: string,
    networkFee: string,
    blockchain: string,
    decimals: string,
    tokenId: string,
    senderAddress: string
  ) => void;
  onClose: () => void;
  onGoBack: () => void;
  campaignID?: number;
  CampaignName?: string;
  CampaignImg?: string;
  CampaignDesc?: string;
  walletID?: string | null;
}) => {
  const [pool, setPool] = useState<any[]>([]);
  const [selectedToken, setSelectedToken] = useState("wNEAR");
  const [selectedBlockchain, setBlockchain] = useState("NEAR");
  const [price, setPrice] = useState(0);
  const [selectedassetId, setSelectedassetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCloseButtonHovered, setIsCloseButtonHovered] = useState(false);
  const [isGoBackButtonHovered, setIsGoBackButtonHovered] = useState(false);
  const [isProceedButtonHovered, setIsProceedButtonHovered] = useState(false);
  const [decimals, setDecimals] = useState("");
  const [tokenID, setTokenID] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tokenSelectorRef = useRef<HTMLDivElement>(null);

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
        setSelectedToken(data[0].symbol || "wNEAR");
        setPrice(data[0].price || 332.5);
        setDecimals(data[0]?.decimals || "");
        setTokenID(data[0]?.contractAddress || "");
        setSelectedassetId(data[0]?.assetId || "nep141:wrap.near");
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

  return (
    <div
      style={{
        position: "fixed" as const,
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
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "30px",
          borderRadius: "15px",
          width: "400px",
          maxHeight: "120vh",
          overflowY: "auto" as const,
          position: "relative",
          fontFamily: "'Lato', sans-serif",
          boxShadow: "0 12px 35px rgba(0, 0, 0, 0.15)",
          border: "1px solid #e6ecef",
          ...(isMobile && { width: "80%", padding: "20px" }),
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
            ...(isMobile && { padding: "20px 12px", margin: "-20px -20px 20px -20px" }),
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
            Make Donation
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
              ...(isCloseButtonHovered && { color: "#a3bffa", transform: "scale(1.1)" }),
              ...(isMobile && { fontSize: "22px" }),
            }}
            onMouseEnter={() => setIsCloseButtonHovered(true)}
            onMouseLeave={() => setIsCloseButtonHovered(false)}
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "380px",
              height: "66px",
              gap: "30px",
              borderRadius: "6px",
              padding: "12px",
              border: "1px solid #E5E5E5",
              ...(isMobile && { width: "93%" }),
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
            <div style={{ marginTop: 10 }}>
              <div
                style={{
                  color: "black",
                  fontWeight: 600,
                  fontSize: 16,
                  fontFamily: "sans-serif",
                  textAlign: "left",
                  marginBottom: 3,
                }}
              >
                {CampaignName.slice(0, 25)}...
              </div>
              <div
                style={{
                  color: "#525252",
                  fontSize: 15,
                  fontFamily: "sans-serif",
                  textAlign: "left",
                }}
              >
                {CampaignDesc.split(" ").slice(0, 5).join(" ")}...
              </div>
            </div>
          </div>
          <div
            style={{
              margin: "20px 0",
            }}
          >
            <div
              style={{
                marginBottom: 10,
                color: "black",
                textAlign: "left",
                fontWeight: 600,
              }}
            >
              Amount
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "380px",
                height: "48px",
                transform: "rotate(0deg)",
                borderRadius: "8px",
                padding: "4px 12px",
                border: "1px solid #DBDBDB",
                backgroundColor: "#FFFFFF",
                marginBottom: 20,
                ...(isMobile && { width: "93%" }),
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  fontWeight: 700,
                  color: "#0F172A",
                  fontFamily: "'Lato', sans-serif",
                  marginRight: "10px",
                }}
                ref={tokenSelectorRef}
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <span>{selectedToken}</span>
                <span
                  style={{
                    fontSize: "12px",
                    marginLeft: "4px",
                  }}
                >
                  ▾
                </span>
              </div>
              <input
                style={{
                  border: "none",
                  outline: "none",
                  fontSize: "16px",
                  width: "100px",
                  background: "transparent",
                  fontFamily: "'Lato', sans-serif",
                  color: "#000000",
                }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
              <div
                style={{
                  fontWeight: 500,
                  color: "#64748B",
                  fontSize: "14px",
                  marginLeft: "auto",
                  marginTop: "14px",
                }}
              >
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(parseFloat(amount || "0") * (price || 0))}
              </div>
            </div>
            <div
              style={{
                marginBottom: 10,
                color: "black",
                textAlign: "left",
                fontWeight: 600,
              }}
            >
              Address
            </div>
            <input
              type="text"
              placeholder="Please provide the sender wallet address"
              style={{
                display: "flex",
                flexDirection: "row",
                width: "380px",
                height: "40px",
                transform: "rotate(0deg)",
                borderRadius: "8px",
                padding: "4px 12px",
                border: "1px solid #DBDBDB",
                backgroundColor: "#FFFFFF",
                outline: "none",
                boxShadow: "none",
                color: "black",
                ...(isMobile && { width: "93%" }),
              }}
              value={senderAddress}
              onChange={(e) => setSenderAddress(e.target.value)}
            />
          </div>
          {showDropdown && (
            <div
              style={{
                position: "absolute",
                display: "flex",
                flexDirection: "column",
                width: "204px",
                overflowY: "auto" as const,
                maxHeight: "25vh",
                top: "290px",
                left: "20px",
                gap: "5px",
                background: "#FFFFFF",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 6px 24px rgba(0, 0, 0, 0.1)",
                padding: "10px",
                zIndex: 10,
                ...(isMobile && { width: "70%", left: "10px", padding: "8px" }),
              }}
              ref={dropdownRef}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "15px",
                  paddingBottom: "8px",
                  borderBottom: "1px solid #eee",
                  marginBottom: "10px",
                  color: "#000000",
                  ...(isMobile && { fontSize: "14px" }),
                }}
              >
                Available Tokens
              </div>
              <input
                type="text"
                placeholder="Search by symbol..."
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  margin: "10px 0",
                  fontSize: "14px",
                  borderRadius: "8px",
                  border: "1px solid #d1d8e0",
                  background: "#f9fafb",
                  fontFamily: "'Lato', sans-serif",
                  boxSizing: "border-box",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  color: "#000000",
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {pool
                ?.filter((token) =>
                  token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((token, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px",
                      cursor: "pointer",
                      borderRadius: "8px",
                      color: "#000000",
                      ...(isMobile && { padding: "6px", fontSize: "14px" }),
                    }}
                    onClick={() => {
                      setSelectedToken(token.symbol);
                      setShowDropdown(false);
                      setBlockchain(token.blockchain);
                      setPrice(token?.price || 332.5);
                      setSelectedassetId(token.assetId);
                      setDecimals(token?.decimals || "");
                      setTokenID(token?.assetId || "");
                    }}
                  >
                    <div>{token.symbol} ({token.blockchain})</div>
                  </div>
                ))}
            </div>
          )}
          {amount !== "" && amount !== null && (
            <div>
              <h3 style={{ fontSize: 16 }}>Fee Breakdown</h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  fontSize: "14px",
                  color: "#1e293b",
                }}
              >
                <span>Protocol Fee (2.5%):</span>
                <span>
                  {protocolFeeSelectedCurrency.toFixed(4)} {selectedToken}
                  {nearPrice > 0 && price > 0 && (
                    <span style={{ color: "#64748B", fontSize: "12px" }}>
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
                  marginBottom: "10px",
                  fontSize: "14px",
                  color: "#1e293b",
                }}
              >
                <span>Network Fee:</span>
                <span>
                  {networkFeeSelectedCurrency.toFixed(4)} {selectedToken}
                  {nearPrice > 0 && price > 0 && (
                    <span style={{ color: "#64748B", fontSize: "12px" }}>
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
                    marginBottom: "10px",
                    fontSize: "14px",
                    color: "#1e293b",
                  }}
                >
                  <span>Referral Fee (5%):</span>
                  <span>
                    {referralFeeSelectedCurrency.toFixed(4)} {selectedToken}
                    {nearPrice > 0 && price > 0 && (
                      <span style={{ color: "#64748B", fontSize: "12px" }}>
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
                  marginBottom: "10px",
                  fontSize: "14px",
                  color: "#1e293b",
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 16 }}>Total (incl. fees):</span>
                <span style={{ fontWeight: 600, fontSize: 16 }}>
                  {(donationAmount + totalFeeSelectedCurrency).toFixed(4)}{" "}
                  {selectedToken}
                  {nearPrice > 0 && price > 0 && (
                    <span style={{ color: "#64748B", fontSize: "12px" }}>
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
            marginTop: "25px",
            paddingTop: "20px",
            borderTop: "1px solid #e6ecef",
            ...(isMobile && { flexDirection: "column", gap: "10px", marginTop: "20px", paddingTop: "15px" }),
          }}
        >
          <button
            style={{
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
              ...(isGoBackButtonHovered && { background: "#d1d8e0", transform: "translateY(-2px)", boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)" }),
              ...(isMobile && { padding: "12px 20px", width: "100%", boxSizing: "border-box", marginRight: "0" }),
            }}
            onMouseEnter={() => setIsGoBackButtonHovered(true)}
            onMouseLeave={() => setIsGoBackButtonHovered(false)}
            onClick={onGoBack}
          >
            Go Back
          </button>
          <button
            style={{
              padding: "14px 30px",
              background: "#000000",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontFamily: "'Lato', sans-serif",
              fontWeight: 700,
              transition: "background 0.3s, transform 0.2s, box-shadow 0.3s",
              ...(isProceedButtonHovered && { background: "#000000", transform: "translateY(-2px)", boxShadow: "0 8px 10px rgba(30, 58, 138, 0.4)" }),
              ...(loading && { background: "#00000044", cursor: "not-allowed", boxShadow: "none" }),
              ...(isMobile && { padding: "12px 20px", width: "100%", boxSizing: "border-box" }),
            }}
            onMouseEnter={() => setIsProceedButtonHovered(true)}
            onMouseLeave={() => setIsProceedButtonHovered(false)}
            onClick={() =>
              onProceed(
                campaignID,
                `${(donationAmount + totalFeeSelectedCurrency).toFixed(4)} ${selectedToken}`,
                networkFeeSelectedCurrency.toFixed(4),
                selectedBlockchain,
                decimals,
                tokenID,
                senderAddress
              )
            }
            disabled={
              loading ||
              senderAddress.trim() === "" ||
              amount.trim() === "" ||
              CampaignName.trim() === ""
            }
          >
            Proceed to donate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal2;





// import React, { useEffect, useRef, useState } from "react";
// import { useMediaQuery } from "react-responsive";

// const inlineStyles = {
//   modalOverlay: {
//     position: "fixed",
//     top: "0",
//     left: "0",
//     right: "0",
//     bottom: "0",
//     background: "rgba(0, 0, 0, 0.65)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//   },
//   modalContent: {
//     background: "#ffffff",
//     padding: "30px",
//     borderRadius: "15px",
//     width: "400px",
//     maxHeight: "120vh",
//     overflowY: "auto",
//     position: "relative",
//     fontFamily: "'Lato', sans-serif",
//     boxShadow: "0 12px 35px rgba(0, 0, 0, 0.15)",
//     border: "1px solid #e6ecef",
//     scrollbarWidth: "none",
//   },
//   modalHeader: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     background: "#262626",
//     color: "#ffffff",
//     padding: "28px 18px",
//     borderRadius: "15px 15px 0 0",
//     margin: "-30px -30px 25px -30px",
//     fontWeight: 700,
//   },
//   modalTitle: {
//     flexGrow: 1,
//     textAlign: "center",
//     fontSize: "20px",
//     fontWeight: 700,
//     marginLeft: "40px",
//   },
//   closeButton: {
//     background: "none",
//     border: "none",
//     fontSize: "26px",
//     color: "#FCCFCF",
//     cursor: "pointer",
//     fontFamily: "'Lato', sans-serif",
//     transition: "color 0.3s, transform 0.2s",
//   },
//   closeButtonHover: {
//     color: "#a3bffa",
//     transform: "scale(1.1)",
//   },
//   recipientBox: {
//     display: "flex",
//     flexDirection: "row",
//     width: "380px",
//     height: "66px",
//     gap: "30px",
//     borderRadius: "6px",
//     padding: "12px",
//     border: "1px solid #E5E5E5",
//   },
//   amountSection: {
//     margin: "20px 0",
//   },
//   amountBox: {
//     display: "flex",
//     flexDirection: "row",
//     width: "380px",
//     height: "48px",
//     transform: "rotate(0deg)",
//     borderRadius: "8px",
//     padding: "4px 12px 4px 12px",
//     border: "1px solid #DBDBDB",
//     backgroundColor: "#FFFFFF",
//     marginBottom: 20,
//   },
//   addressBox: {
//     display: "flex",
//     flexDirection: "row",
//     width: "380px",
//     height: "40px",
//     transform: "rotate(0deg)",
//     borderRadius: "8px",
//     padding: "4px 12px 4px 12px",
//     border: "1px solid #DBDBDB",
//     backgroundColor: "#FFFFFF",
//   },
//   tokenSelector: {
//     display: "flex",
//     alignItems: "center",
//     gap: "6px",
//     cursor: "pointer",
//     fontWeight: 700,
//     color: "#0F172A",
//     fontFamily: "'Lato', sans-serif",
//     marginRight: "10px",
//   },
//   tokenCaret: {
//     fontSize: "12px",
//     marginLeft: "4px",
//   },
//   amountInput: {
//     border: "none",
//     outline: "none",
//     fontSize: "16px",
//     width: "100px",
//     background: "transparent",
//     fontFamily: "'Lato', sans-serif",
//     color: "#000000",
//   },
//   usdValue: {
//     fontWeight: 500,
//     color: "#64748B",
//     fontSize: "14px",
//     marginLeft: "auto",
//     marginTop: "14px",
//   },
//   dropdown: {
//     position: "absolute",
//     display: "flex",
//     flexDirection: "column",
//     width: "204px",
//     overflowY: "auto",
//     maxHeight: "25vh",
//     top: "290px",
//     left: "20px",
//     gap: "5px",
//     background: "#FFFFFF",
//     border: "1px solid #e2e8f0",
//     borderRadius: "12px",
//     boxShadow: "0 6px 24px rgba(0, 0, 0, 0.1)",
//     padding: "10px",
//     zIndex: 10,
//   },
//   dropdownHeader: {
//     fontWeight: "bold",
//     fontSize: "15px",
//     paddingBottom: "8px",
//     borderBottom: "1px solid #eee",
//     marginBottom: "10px",
//     color: "#000000",
//   },
//   dropdownItem: {
//     display: "flex",
//     alignItems: "center",
//     padding: "8px",
//     cursor: "pointer",
//     borderRadius: "8px",
//     color: "#000000",
//   },
//   dropdownItemHover: {
//     backgroundColor: "#f2f2f2",
//   },
//   dropdownSearch: {
//     width: "100%",
//     padding: "10px 12px",
//     margin: "10px 0",
//     fontSize: "14px",
//     borderRadius: "8px",
//     border: "1px solid #d1d8e0",
//     background: "#f9fafb",
//     fontFamily: "'Lato', sans-serif",
//     boxSizing: "border-box",
//     transition: "border-color 0.3s, box-shadow 0.3s",
//     color: "#000000",
//   },
//   feeRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginBottom: "10px",
//     fontSize: "14px",
//     color: "#1e293b",
//   },
//   modalFooter: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginTop: "25px",
//     paddingTop: "20px",
//     borderTop: "1px solid #e6ecef",
//   },
//   goBackButton: {
//     padding: "14px 30px",
//     background: "#e6ecef",
//     color: "#111827",
//     border: "none",
//     borderRadius: "10px",
//     cursor: "pointer",
//     marginRight: "15px",
//     fontFamily: "'Lato', sans-serif",
//     fontWeight: 700,
//     transition: "background 0.3s, transform 0.2s, box-shadow 0.3s",
//     boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
//   },
//   goBackButtonHover: {
//     background: "#d1d8e0",
//     transform: "translateY(-2px)",
//     boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
//   },
//   proceedButton: {
//     padding: "14px 30px",
//     background: "#000000",
//     color: "#ffffff",
//     border: "none",
//     borderRadius: "10px",
//     cursor: "pointer",
//     fontFamily: "'Lato', sans-serif",
//     fontWeight: 700,
//     transition: "background 0.3s, transform 0.2s, box-shadow 0.3s",
//   },
//   proceedButtonHover: {
//     background: "#000000",
//     transform: "translateY(-2px)",
//     boxShadow: "0 8px 10px rgba(30, 58, 138, 0.4)",
//   },
//   proceedButtonDisabled: {
//     background: "#00000044",
//     cursor: "not-allowed",
//     boxShadow: "none",
//   },
//   modalContentMobile: {
//     width: "80%",
//     padding: "20px",
//   },
//   modalHeaderMobile: {
//     padding: "20px 12px",
//     margin: "-20px -20px 20px -20px",
//   },
//   closeButtonMobile: {
//     fontSize: "22px",
//   },
//   recipientBoxMobile: {
//     width: "93%",
//   },
//   amountBoxMobile: {
//     width: "93%",
//   },
//   addressBoxMobile: {
//     width: "93%",
//   },
//   modalFooterMobile: {
//     flexDirection: "column",
//     gap: "10px",
//     marginTop: "20px",
//     paddingTop: "15px",
//   },
//   goBackButtonMobile: {
//     padding: "12px 20px",
//     width: "100%",
//     boxSizing: "border-box",
//     marginRight: "0",
//   },
//   proceedButtonMobile: {
//     padding: "12px 20px",
//     width: "100%",
//     boxSizing: "border-box",
//   },
//   dropdownMobile: {
//     width: "70%",
//     left: "10px",
//     padding: "8px",
//   },
//   dropdownHeaderMobile: {
//     fontSize: "14px",
//   },
//   dropdownItemMobile: {
//     padding: "6px",
//     fontSize: "14px",
//     color: "#000000",
//   },
// };

// const Modal2 = ({
//   onProceed,
//   onClose,
//   onGoBack,
//   campaignID = 0,
//   CampaignName = "",
//   CampaignImg = "",
//   CampaignDesc = "",
//   walletID = null,
// }) => {
//   const [pool, setPool] = useState(null);
//   const [selectedToken, setSelectedToken] = useState("wNEAR");
//   const [selectedBlockchain, setBlockchain] = useState("NEAR");
//   const [price, setPrice] = useState(0);
//   const [selectedassetId, setSelectedassetId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [error, setError] = useState(null);
//   const [amount, setAmount] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [isCloseButtonHovered, setIsCloseButtonHovered] = useState(false);
//   const [isGoBackButtonHovered, setIsGoBackButtonHovered] = useState(false);
//   const [isProceedButtonHovered, setIsProceedButtonHovered] = useState(false);
//   const [Decimals, setDecimals] = useState("");
//   const [tokenID, settokenID] = useState("");
//   const [senderaddress, setsenderaddress] = useState("");
//   const modalRef = useRef(null);
//   const dropdownRef = useRef(null);
//   const tokenSelectorRef = useRef(null);

//   const isMobile = useMediaQuery({ maxWidth: 640 });

//   const fetchTokens = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("https://1click.chaindefuser.com/v0/tokens", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       if (!res.ok) {
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }
//       const data = await res.json();
//       setPool(data);
//       if (data.length > 0) {
//         setSelectedToken(data[0].symbol || "wNEAR");
//         setPrice(data[0].price || 332.5);
//         setDecimals(data[0]?.decimals);
//         settokenID(data[0]?.contractAddress);
//         setSelectedassetId(data[0]?.assetId || "nep141:wrap.near");
//       }
//       setError(null);
//     } catch (error) {
//       console.error("Fetch error:", error);
//       setError("Failed to fetch tokens. Please try again later.");
//       setPool(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTokens();
//   }, []);

//   const nearToken = pool?.find(
//     (token) => token.symbol === "wNEAR" || token.assetId === "nep141:wrap.near"
//   );
//   const nearPrice = nearToken?.price || 0;

//   const donationAmount = parseFloat(amount) || 0;
//   const protocolFeeNear = donationAmount * 0.025;
//   const networkFeeNear = 0.08;
//   const referralFeeNear = donationAmount * 0.05;
//   const totalFeeNear = protocolFeeNear + networkFeeNear;

//   const protocolFeeSelectedCurrency = (protocolFeeNear * nearPrice) / price;
//   const networkFeeSelectedCurrency = (networkFeeNear * nearPrice) / price;
//   const referralFeeSelectedCurrency = (referralFeeNear * nearPrice) / price;
//   const totalFeeSelectedCurrency =
//     protocolFeeSelectedCurrency + networkFeeSelectedCurrency; // Excludes referral fee

//   return (
//     <div style={inlineStyles.modalOverlay} onClick={onClose}>
//       <div
//         style={{
//           ...inlineStyles.modalContent,
//           ...(isMobile ? inlineStyles.modalContentMobile : {}),
//         }}
//         onClick={(e) => e.stopPropagation()}
//         ref={modalRef}
//       >
//         <div
//           style={{
//             ...inlineStyles.modalHeader,
//             ...(isMobile ? inlineStyles.modalHeaderMobile : {}),
//           }}
//         >
//           <h2 style={inlineStyles.modalTitle}>Make Donation</h2>
//           <button
//             style={{
//               ...inlineStyles.closeButton,
//               ...(isCloseButtonHovered ? inlineStyles.closeButtonHover : {}),
//               ...(isMobile ? inlineStyles.closeButtonMobile : {}),
//             }}
//             onMouseEnter={() => setIsCloseButtonHovered(true)}
//             onMouseLeave={() => setIsCloseButtonHovered(false)}
//             onClick={onClose}
//           >
//             ×
//           </button>
//         </div>
//         <div>
//           <div
//             style={{
//               ...inlineStyles.recipientBox,
//               ...(isMobile ? inlineStyles.recipientBoxMobile : {}),
//             }}
//           >
//             <div
//               style={{
//                 width: "60px",
//                 height: "60px",
//                 borderRadius: "50%",
//                 backgroundColor: "#F5F5F5",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//               }}
//             >
//               {/* {CampaignImg === `Direct` ? 
//              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAACYUlEQVR4nNWXS2/TUBCFvSo/gp9Hi1gkFRtgQ8USsWSJBKiLVgIhWmBRRIuSkpbQlEdaCE3Iw5DHTVQIUR72wvYdHxgnrZ0oNKDYsbB0pNiOfL57ZsbyVZTBgTzO6QKLmqA9TZCm1234KX4mP1sXiLKX4j30Cs7rdTrw2/TPojR7uiufqbkL4STBsc/efCCBiKIJSoUFoAl6wwC9EAF6SmjxD6T8FwDH+4TsfYm96yZ2LpuILxhIRAwkr5k4vG2h/EJCqwUEkF2WiM0biF04W6klE101AIBEdLL5iRq70n+AxmtC8qp5pvGrSwaKDy3oIqASdIr9PmCTo7vSqfvnOxa+rEjU4hLdbwE2YXzBwPZFA+9vWsgtS3x9JlHZlGgkybnfzhPqu4TKFkFsE5qH9E9JKJP+kBvThMkrJlo5Qi1OTgqjUp8QOiWfAL6/Ixy/JWTvSezfMJFYNJy+GDUXO4T8A/e89FhCq/hRgnkDH25ZKK1bTuw8ahy717z8nNCr2Pj5iaCuudcZdGqA1NLwBORXLKfmXgA2r8UI1c2RFNbk9ABdtT8J/AZkgPKGRPXlMACvvF200UwT8qvudf49NYDuUeuI0C70u32o8VYlSuvSKU15w71XfOQzgD5Q8+MwQHvQ8QxQ8JSguuVDD+jjJGyoT4chWhlyVuyNn4GCAajb6Ki2M2rj3gNs/uNgsvlUACyecx417nY25QQ49k7h78ynBvBDSugAWogfpbqgTvif5bpANLwEEDnZmqVnD0BpZDDn3ZzOEMKzOT3dnmcwx5FwXYJoTH6mVqcke5yu/LfxL5k/0kcLS0NwAAAAAElFTkSuQmCC" : 
//                <img
//                src={CampaignImg}
//                alt="icon"
//                width={60}
//                height={60}
//                style={{ borderRadius: "50%" }}
//              />
              
//             } */}

//               {CampaignImg === "Direct" ? (
//                 <img
//                   src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFBUlEQVR4nO1ba28bRRTdP8EHICD+DhJU/IdCIaRNQAIJ+gGQ+IAoAgQSj6pQECIU0qqlqpI+ACchbZzSEBLS1Hk4Dz9mnYQ0TeKdVt6duxfdWdtxnOzEphvPrs1KR7Gyu9Y9Z+6ce2e9YxiK4z7DJznDY9yEK9yEaYuBxU0XwwwvRpiWMTM8ej+LTxj1HjyNj3MTTloMhG5CAQgCFoOeBzl8qjbyDJ+zGOR1Bx44GGzxLB7aj3wXKaY92APMBs6wUzXyoDvIhohQnQk8g21Nmfaq6ZDCx7YFMOG09qAaDjhVLnXN4Pb1QnLOYBvN/U7dwWhDDjsMzuCy9kB0gUGvYZkwpz0QbYBpo6XcvwoWg7yhOwjdMHQHoBuG7gB0w9AdQNMJsLXgYuZXgYlvBI697+DwGzYOdhRw4MUCxg4X5OehThtvvmXjxMcOJn9yMBcHtLIRF2B5BPCvDxwcOOIRrRdDXTYmTgvcmIFoCZBPu/j3Z85/Ir0XBtsLmL4soiPA1MngyJfQ/3wBc9dFNAQY7AiWfAm3v3CiIcDou/aBCLBwISIC3J0EvPFasCJQdWhUVTCCKn3k4IMvPRzx4ddtTPUK5Kwx5PlDC8C8ml8pRKpP4MSnjiSzr9kdKeAfb9uY+Fpg7gag1UDigQkQO1yQDQ+5dnXa5lMuro2DPMf6BaavCTSHBOaGAdfv6Gt+AhcgVmpmXrHxzimBmV8E3r1d54gyFzeSrhRmbQLw3jRgfikKZbBd3dTE37Tx1ju2zBIyN/q7cnO72yPS2X7A5FmBM9/vxsJFkF1mPtMEjVD/C4WyZ1D6swHA2R/2Jl4NEuifcQhhK5xxcbLGVni+WNvJG5YuQU3Eq0FmGSoBeBGUpuMf+S+Gxk445ZFXkZ/9UeBSn1qclREIjwBjJxxpXJWlMBsTmPhWyHPx47Y0R2qY6DylvYrc6qh3nVKEboHrCQiHALGi2U1+7uByhbnthY15Vznn6dz6lPcd9F3pqyAzYq9rFy+FSIBYZSnssuVUSJ51MNsvcG1su96T2/uRX/gZcGtx9/ev3PK/pySWVgGuv2rv6/xbKa/O+5U6SaaY0huzIN2+BJVfmIMhECB9Rcj1u58AI8ftcvqr5n6pzid7aq8IlDXaBeDS2ITvivDP9zz3p3RVkanOgOU4YPKcWoC5HhGeMmhlXExfFfK5YOWqcPxDTwCqAsrRvLDbA+hxm0qE2e4QCcArxch6hGlNQKLQ/+4l9m985s4IXOql+2C7GsT975s/F1IB+B6ghU2tc5tAjRXdt6qoAiRWZATgpouLFxUlzaexUTVEK/GICbAyUrsA5AfZ3xQtc7fAzXk3WgJYWXUvQCit+DLX1J5BTVUkfxtcG1cTM38HuVqcP+9/DYkY1MMSo9ECEGhJW48h7kj9M0I+LYr8r8OroyDncT3kqUsMkjzX/fM4GR+t6vYd9W5vzh/EM0JDpwBlIaZALmyot6f2lghTB0h1nvqBINw+1AJwjTB0B6Abhu4AdMPQHYBuGK38oiRnsEmvys5oD0QbIPH/y9Kc4VH9I6EL2G7QvroW3TDhyA0TxS0zX7WgAF/u3ChJG4lCEFhDwGDTWsVHd+wcs0x8uhWmQnHb3LN+ewc7W2Dj5DH17tEsHmrK6UBpn8NnjFqOLRMfsUz4RDplU4w6fLdrztdy8Ay20dYyzqCPuqYotM1ejJCgHWHcxJfLpc7n+BchOsuiJZSRagAAAABJRU5ErkJggg=="
//                   alt="Direct Campaign"
//                   width={60}
//                   height={60}
//                   style={{ borderRadius: "50%" }}
//                 />
//               ) : (
//                 <img
//                   src={CampaignImg}
//                   alt="icon"
//                   width={60}
//                   height={60}
//                   style={{ borderRadius: "50%" }}
//                 />
//               )}
//             </div>
//             <div style={{ marginTop: 10 }}>
//               <div
//                 style={{
//                   color: "black",
//                   fontWeight: 600,
//                   fontSize: 16,
//                   fontFamily: "sans-serif",
//                   textAlign: "left",
//                   marginBottom: 3,
//                 }}
//               >
//                 {CampaignName.slice(0, 25)}...
//               </div>
//               <div
//                 style={{
//                   color: "#525252",
//                   fontSize: 15,
//                   fontFamily: "sans-serif",
//                   textAlign: "left",
//                 }}
//               >
//                 {CampaignDesc.split(" ").slice(0, 5).join(" ")}...
//               </div>
//             </div>
//           </div>
//           <div style={inlineStyles.amountSection}>
//             <div
//               style={{
//                 marginBottom: 10,
//                 color: "black",
//                 textAlign: "left",
//                 fontWeight: 600,
//               }}
//             >
//               Amount
//             </div>
//             <div
//               style={{
//                 ...inlineStyles.amountBox,
//                 ...(isMobile ? inlineStyles.amountBoxMobile : {}),
//               }}
//             >
//               <div
//                 style={inlineStyles.tokenSelector}
//                 ref={tokenSelectorRef}
//                 onClick={() => setShowDropdown((prev) => !prev)}
//               >
//                 <span>{selectedToken}</span>
//                 <span style={inlineStyles.tokenCaret}>▾</span>
//               </div>
//               <input
//                 style={inlineStyles.amountInput}
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 placeholder="0.00"
//               />
//               <div style={inlineStyles.usdValue}>
//                 {new Intl.NumberFormat("en-US", {
//                   style: "currency",
//                   currency: "USD",
//                 }).format(parseFloat(amount || "0") * (price || 0))}
//               </div>
//             </div>
//             <div
//               style={{
//                 marginBottom: 10,
//                 color: "black",
//                 textAlign: "left",
//                 fontWeight: 600,
//               }}
//             >
//               Address
//             </div>
//             <input
//               type="text"
//               placeholder="Please provide the sender wallet address"
//               style={{
//                 ...inlineStyles.addressBox,
//                 ...(isMobile ? inlineStyles.addressBoxMobile : {}),
//                 outline: "none",
//                 boxShadow: "none",
//                 color: "black",
//               }}
//               value={senderaddress}
//               onChange={(e) => setsenderaddress(e.target.value)}
//             />
//           </div>
//           {showDropdown && (
//             <div
//               style={{
//                 ...inlineStyles.dropdown,
//                 ...(isMobile ? inlineStyles.dropdownMobile : {}),
//               }}
//               ref={dropdownRef}
//             >
//               <div
//                 style={{
//                   ...inlineStyles.dropdownHeader,
//                   ...(isMobile ? inlineStyles.dropdownHeaderMobile : {}),
//                 }}
//               >
//                 Available Tokens
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by symbol..."
//                 style={inlineStyles.dropdownSearch}
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//               {pool
//                 ?.filter((token) =>
//                   token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
//                 )
//                 .map((token, index) => (
//                   <div
//                     key={index}
//                     style={{
//                       ...inlineStyles.dropdownItem,
//                       ...(isMobile ? inlineStyles.dropdownItemMobile : {}),
//                     }}
//                     onClick={() => {
//                       setSelectedToken(token.symbol);
//                       setShowDropdown(false);
//                       setBlockchain(token.blockchain);
//                       setPrice(token?.price || 332.5);
//                       setSelectedassetId(token.assetId);
//                       setDecimals(token?.decimals);
//                       settokenID(token?.assetId);
//                     }}
//                   >
//                     <div>
//                       {token.symbol} ({token.blockchain})
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           )}
//           {amount !== "" && amount !== null && (
//             <div>
//               <h3 style={{ fontSize: 16 }}>Fee Breakdown</h3>
//               <div style={inlineStyles.feeRow}>
//                 <span>Protocol Fee (2.5%):</span>
//                 <span>
//                   {protocolFeeSelectedCurrency.toFixed(4)} {selectedToken}
//                   {nearPrice > 0 && price > 0 && (
//                     <span style={{ color: "#64748B", fontSize: "12px" }}>
//                       {" "}
//                       ({protocolFeeNear.toFixed(4)} NEAR)
//                     </span>
//                   )}
//                 </span>
//               </div>
//               <div style={inlineStyles.feeRow}>
//                 <span>Network Fee:</span>
//                 <span>
//                   {networkFeeSelectedCurrency.toFixed(4)} {selectedToken}
//                   {nearPrice > 0 && price > 0 && (
//                     <span style={{ color: "#64748B", fontSize: "12px" }}>
//                       {" "}
//                       (0.08 NEAR)
//                     </span>
//                   )}
//                 </span>
//               </div>
//               {walletID && (
//                 <div style={inlineStyles.feeRow}>
//                   <span>Referral Fee (5%):</span>
//                   <span>
//                     {referralFeeSelectedCurrency.toFixed(4)} {selectedToken}
//                     {nearPrice > 0 && price > 0 && (
//                       <span style={{ color: "#64748B", fontSize: "12px" }}>
//                         {" "}
//                         ({referralFeeNear.toFixed(4)} NEAR)
//                       </span>
//                     )}
//                   </span>
//                 </div>
//               )}
//               <div style={inlineStyles.feeRow}>
//                 <span style={{ fontWeight: 600, fontSize: 16 }}>
//                   Total (incl. fees):
//                 </span>
//                 <span style={{ fontWeight: 600, fontSize: 16 }}>
//                   {(donationAmount + totalFeeSelectedCurrency).toFixed(4)}{" "}
//                   {selectedToken}
//                   {nearPrice > 0 && price > 0 && (
//                     <span style={{ color: "#64748B", fontSize: "12px" }}>
//                       {" "}
//                       ({(donationAmount + totalFeeNear).toFixed(4)} NEAR)
//                     </span>
//                   )}
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>
//         <div
//           style={{
//             ...inlineStyles.modalFooter,
//             ...(isMobile ? inlineStyles.modalFooterMobile : {}),
//           }}
//         >
//           <button
//             style={{
//               ...inlineStyles.goBackButton,
//               ...(isGoBackButtonHovered ? inlineStyles.goBackButtonHover : {}),
//               ...(isMobile ? inlineStyles.goBackButtonMobile : {}),
//             }}
//             onMouseEnter={() => setIsGoBackButtonHovered(true)}
//             onMouseLeave={() => setIsGoBackButtonHovered(false)}
//             onClick={onGoBack}
//           >
//             Go Back
//           </button>
//           <button
//             style={{
//               ...inlineStyles.proceedButton,
//               ...(isProceedButtonHovered
//                 ? inlineStyles.proceedButtonHover
//                 : {}),
//               ...(loading ? inlineStyles.proceedButtonDisabled : {}),
//               ...(isMobile ? inlineStyles.proceedButtonMobile : {}),
//             }}
//             onMouseEnter={() => setIsProceedButtonHovered(true)}
//             onMouseLeave={() => setIsProceedButtonHovered(false)}
//             onClick={() =>
//               onProceed(
//                 campaignID,
//                 `${(donationAmount + totalFeeSelectedCurrency).toFixed(
//                   4
//                 )} ${selectedToken}`,
//                 networkFeeSelectedCurrency.toFixed(4),
//                 selectedBlockchain,
//                 Decimals,
//                 tokenID,
//                 senderaddress
//               )
//             }
//             disabled={
//               loading ||
//               senderaddress.trim() === "" ||
//               amount.trim() === "" ||
//               CampaignName.trim() === ""
//             }
//           >
//             Proceed to donate
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal2;
