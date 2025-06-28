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
  const [showQuitModal, setShowQuitModal] = useState(false);
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
        setSelectedToken(data[2].symbol || "USDC");
        setPrice(data[2].price || 332.5);
        setDecimals(data[2]?.decimals || "");
        setTokenID(data[2]?.contractAddress || "");
        setSelectedassetId(data[2]?.assetId || "nep141:17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1");
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
      return "Loading...";
    }
    if (hash.length < 21) return hash;
    return `${hash.slice(0, 10)}....${hash.slice(-10)}`;
  }

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

  const isDisabled =
    loading ||
    senderAddress.trim() === "" ||
    amount.trim() === "" ||
    CampaignName.trim() === "";

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
    >
      <div
        style={{
          background: "#ffffff",
          padding: "30px",
          borderRadius: "15px",
          width: "400px",
          maxHeight: "120vh",
          overflowY: "auto",
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
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#262626",
            color: "#ffffff",
            padding: isMobile ? "20px 12px" : "28px 18px",
            borderRadius: "15px 15px 0 0",
            margin: isMobile
              ? "-20px -20px 20px -20px"
              : "-30px -30px 25px -30px",
            fontWeight: 700,
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? "18px" : "20px",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            Make Donation
          </h2>

          <div
            style={{
              position: "absolute",
              right: isMobile ? "32px" : "38px",
              background: "none",
              border: "none",
              fontSize: isMobile ? "27px" : "30px",
              color: "#FCCFCF",
              cursor: "pointer",
              fontFamily: "'Lato', sans-serif",
              transition: "color 0.3s, transform 0.2s",
              ...(isCloseButtonHovered && {
                transform: "scale(1.1)",
              }),
            }}
            onMouseEnter={() => setIsCloseButtonHovered(true)}
            onMouseLeave={() => setIsCloseButtonHovered(false)}
            onClick={() => setShowQuitModal(true)}
          >
            ×
          </div>
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
              ...(isMobile && { width: "93%", height: "auto" }),
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
                {shortenHash(CampaignDesc)}
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
                type={"number"}
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
                overflowY: "auto",
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
  ?.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) &&
      token.symbol !== "wNEAR"
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
      <div>
        {token.symbol} ({token.blockchain})
      </div>
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
                <span style={{ fontWeight: 600, fontSize: 16 }}>
                  Total (incl. fees):
                </span>
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
            ...(isMobile && {
              flexDirection: "row",
              gap: "10px",
              marginTop: "20px",
              paddingTop: "15px",
            }),
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
              ...(isGoBackButtonHovered && {
                background: "#d1d8e0",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
              }),
              ...(isMobile && {
                padding: "12px 10px",
                width: "100%",
                boxSizing: "border-box",
                marginRight: "0",
              }),
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
              ...(isProceedButtonHovered && {
                background: "#000000",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 10px rgba(30, 58, 138, 0.4)",
              }),
              ...(isDisabled && {
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
            onMouseEnter={() => setIsProceedButtonHovered(true)}
            onMouseLeave={() => setIsProceedButtonHovered(false)}
            onClick={() =>
              onProceed(
                campaignID,
                `${(donationAmount + totalFeeSelectedCurrency).toFixed(
                  4
                )} ${selectedToken}`,
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

      <QuitConfirmationModal
        isOpen={showQuitModal}
        onCancel={handleCancelQuit}
        onConfirm={handleQuit}
      />
    </div>
  );
};

export default Modal2;
