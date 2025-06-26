import React, { useState } from "react";
import "../styles/styles.css";
import SelectionModal from "./SelectModal";
import Modal2 from "./Modal2";
import Modal3 from "./Modal3";
import Modal4 from "./Modal4";
import Modal5 from "./Modal5";

interface WidgetProps {
  DonationType: string;
  walletID?: string;
  color?: string;
  AssetName?: string;
  textColor?: string;
  fontType?: string;
}

const Widget: React.FC<WidgetProps> = ({
  DonationType = "POTLOCK Campaigns",
  walletID = null,
  color = "black",
  AssetName = "nep141:wrap.near",
  textColor = "white",
  fontType = "",
}) => {
  const [step, setStep] = useState<number>(0);
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);
  const [donationAmount, setDonationAmount] = useState<string>("");
  const [selectedCampaignName, setSelectedCampaignName] = useState<
    string | null
  >(null);
  const [decimal, setDecimals] = useState<any>("");
  const [tokenId, setTokenId] = useState<string>("");
  const [networkFee, setNetworkFee] = useState<string>("");
  const [selectedCampaignImg, setSelectedCampaignImg] = useState<string | null>(
    null
  );
  const [selectedCampaignDesc, setSelectedCampaignDesc] = useState<
    string | null
  >(null);
  const [blockchain, setBlockchain] = useState<string>("");
  const [depositAddress, setDepositAddress] = useState<string>("");
  const [depositAddress2, setDepositAddress2] = useState<string | null>(null);
  const [senderAddress, setSenderAddress] = useState<string>("");
  const [campaignName, setCampaignName] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [usdAmount, setUsdAmount] = useState<string>("");

  const handleOpenModal = () => setStep(1);
  const handleCloseModal = () => setStep(0);

  const handleProceedToDonate = (
    campaignID: number,
    campaignName: string,
    img: string,
    desc: string
  ) => {
    setSelectedCampaign(campaignID);
    setSelectedCampaignName(campaignName);
    setSelectedCampaignImg(img);
    setSelectedCampaignDesc(desc);
    setStep(2);
  };

  const handleProceedToQR = (
    campaignID: number,
    amount: string,
    fee: string,
    chain: string,
    decimals?: number,
    tokenID?: string,
    sender?: string
  ) => {
    setDonationAmount(amount);
    setBlockchain(chain);
    setNetworkFee(fee);
    setTokenId(tokenID || "");
    setSenderAddress(sender || "");
    setDecimals(decimals);
    setStep(DonationType === "POTLOCK Campaigns" ? 3 : 2);
  };

  const handleGoBack = () => {
    if (DonationType === "POTLOCK Campaigns") {
      if (step === 3) setStep(2);
      else if (step === 2) setStep(1);
    } else {
      if (step === 2) setStep(1);
      else if (step === 1) setStep(0);
    }
    setDepositAddress2(null);
  };

  const handleBack = () => {
    if (step === 5) setStep(4);
    else if (step === 3) setStep(2);
    setDepositAddress2(null);
  };

  const handleBack4 = (address: string) => {
    if (DonationType === "POTLOCK Campaigns") setStep(3);
    else setStep(2);
    setDepositAddress2(address);
  };

  const handleSentFunds = (
    amount: string,
    address: string,
    campaignID: number
  ) => {
    setDepositAddress(address);
    setSelectedCampaign(campaignID);
    setStep(4);
  };

  const handleProcced = (
    hash: string,
    name: string,
    amount: string,
    usd: string
  ) => {
    setCampaignName(name);
    setTxHash(hash);
    setUsdAmount(usd);
    setStep(5);
  };

  return (
    <div>
      <button
        onClick={handleOpenModal}
        style={{
          backgroundColor: color,
          color: textColor ? textColor : "white",
          border: "none",
          borderRadius: "8px",
          padding: "12px 24px",
          fontSize: "16px",
          fontWeight: "600",
          fontFamily: fontType ? fontType : "",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.25)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
        }}
      >
        ❤️ Donate
      </button>

      {DonationType === "POTLOCK Campaigns" ? (
        <>
          {step === 1 && (
            <SelectionModal
              onProceed={handleProceedToDonate}
              onClose={handleCloseModal}
            />
          )}
          {step === 2 && (
            <Modal2
              onProceed={handleProceedToQR}
              onClose={handleCloseModal}
              onGoBack={handleGoBack}
              campaignID={selectedCampaign || 0}
              CampaignName={selectedCampaignName || ""}
              CampaignImg={selectedCampaignImg || ""}
              CampaignDesc={selectedCampaignDesc || ""}
              walletID={walletID}
            />
          )}
          {step === 3 && (
            <Modal3
              onClose={handleCloseModal}
              onBack={handleGoBack}
              onSentFunds={handleSentFunds}
              campaignID={selectedCampaign || 0}
              amount={donationAmount}
              blockchain={blockchain}
              decimal={decimal}
              tokenID={tokenId}
              networkFee={networkFee}
              senderaddress={senderAddress}
              isdeposit={depositAddress2}
              CampaignName={selectedCampaignName || ""}
              CampaignImg={selectedCampaignImg || ""}
              CampaignDesc={selectedCampaignDesc || ""}
            />
          )}

          {step === 4 && (
            <Modal4
              onClose={handleCloseModal}
              onBack={handleBack4}
              onProceed={handleProcced}
              campaignID={selectedCampaign || 0}
              amount={donationAmount}
              depositAddress={depositAddress}
              blockchain={blockchain}
              CampaignName={selectedCampaignName || ""}
              CampaignImg={selectedCampaignImg || ""}
              CampaignDesc={selectedCampaignDesc || ""}
              walletID={walletID}
            />
          )}

          {step === 5 && (
            <Modal5
              onClose={handleCloseModal}
              onBack={handleBack}
              txHash={txHash}
              campaignName={campaignName}
              amount={donationAmount}
              usdAmount={usdAmount}
              CampaignName={selectedCampaignName || ""}
              CampaignImg={selectedCampaignImg || ""}
              CampaignDesc={selectedCampaignDesc || ""}
              walletID={walletID}
            />
          )}
        </>
      ) : (
        <>
          {step === 1 && (
            <Modal2
              onProceed={handleProceedToQR}
              onClose={handleCloseModal}
              onGoBack={handleGoBack}
              campaignID={selectedCampaign || 0}
              CampaignName={walletID || ""}
              CampaignImg={"Direct"}
              CampaignDesc={selectedCampaignDesc || ""}
              walletID={null}
            />
          )}
          {step === 2 && (
            <Modal3
              onClose={handleCloseModal}
              onBack={handleGoBack}
              onSentFunds={handleSentFunds}
              campaignID={selectedCampaign || 0}
              amount={donationAmount}
              blockchain={blockchain}
              decimal={decimal}
              tokenID={tokenId}
              networkFee={networkFee}
              senderaddress={senderAddress}
              isdeposit={depositAddress2}
              CampaignName={walletID || ""}
              CampaignImg={"Direct"}
              CampaignDesc={AssetName}
            />
          )}

          {step === 4 && (
            <Modal4
              onClose={handleCloseModal}
              onBack={handleBack4}
              onProceed={handleProcced}
              campaignID={selectedCampaign || 0}
              amount={donationAmount}
              depositAddress={depositAddress}
              blockchain={blockchain}
              CampaignName={walletID || ""}
              CampaignImg={"Direct"}
              CampaignDesc={AssetName}
              walletID={null}
            />
          )}

          {step === 5 && (
            <Modal5
              onClose={handleCloseModal}
              onBack={handleBack}
              txHash={txHash}
              campaignName={campaignName}
              amount={donationAmount}
              usdAmount={usdAmount}
              CampaignName={walletID || ""}
              CampaignImg={"Direct"}
              CampaignDesc={AssetName}
              walletID={null}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Widget;
