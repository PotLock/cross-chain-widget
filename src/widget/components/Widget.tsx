import React, { useState } from "react";
import "../styles/styles.css";
import SelectionModal from "./SelectModal";
import Modal2 from "./Modal2";
import Modal3 from "./Modal3";
import Modal4 from "./Modal4";
import Modal5 from "./Modal5";

interface WidgetProps {
  referralID?: any;
}

const Widget: React.FC<WidgetProps> = ({ referralID = null }) => {
  const [amount, setAmount] = useState<any>(2.0);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [isOpen4, setIsOpen4] = useState(false);
  const [isOpen5, setIsOpen5] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);
  const [donationAmount, setDonationAmount] = useState<string>("");
  const [selectedCampaignName, setSelectedCampaignName] = useState<any>(null);
  const [decimal, setDecimals] = useState<any>("");
  const [tokenId, settokenId] = useState<any>("");
  const [networkFee, setnetworkFee] = useState<any>("");
  const [selectedCampaignImg, setSelectedCampaignImg] = useState<any>(null);
  const [selectedCampaignDesc, setSelectedCampaignDesc] = useState<any>(null);
  const [Blockchain, setBlockchain] = useState<string>("");
  const [depositAddress, setDepositAddress] = useState<string>("");
  const [depositAddress2, setDepositAddress2] = useState<any>(null);
  const [senderAddress, setsenderAddress] = useState<any>("");
  const [campaignName, setcampaignName] = useState<string>("");
  const [txHash, settxHash] = useState<string>("");
  const [usdAmount, setusdAmount] = useState<string>("");

  console.log(referralID);
  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    console.log("handleCloseModal called");
    setIsOpen(false);
    setIsOpen2(false);
    setIsOpen3(false);
    setIsOpen4(false);
    setIsOpen5(false);
  };

  const handleProceedToDonate = (
    campaignID: number,
    campaignName: string,
    img: string,
    desc: string
  ) => {
    console.log("handleProceedToDonate", { campaignID });
    setSelectedCampaign(campaignID);
    setSelectedCampaignName(campaignName);
    setSelectedCampaignImg(img);
    setSelectedCampaignDesc(desc);
    setIsOpen(false);
    setIsOpen2(true);
  };

  const handleProceedToQR = (
    campaignID: number,
    amount: string,
    networkFee: string,
    blockchain: string,
    decimal?: number,
    tokenID?: string,
    senderaddress?: string
  ) => {
    console.log(senderaddress);
    setDonationAmount(amount);
    setBlockchain(blockchain);
    setnetworkFee(networkFee);
    settokenId(tokenID);
    setsenderAddress(senderaddress);
    setDecimals(decimal);
    setIsOpen2(false);
    setIsOpen3(true);
  };

  const handleGoBack = () => {
    if (isOpen3) {
      setIsOpen3(false);
      setIsOpen2(true);
      setDepositAddress2(null);
    } else if (isOpen2) {
      setIsOpen2(false);
      setIsOpen(true);
      setDepositAddress2(null);
    }
  };

  const handleBack = () => {
    if (isOpen5) {
      setIsOpen5(false);
      setIsOpen4(true);
      setDepositAddress2(null);
    } else if (isOpen3) {
      setIsOpen3(false);
      setIsOpen2(true);
      setDepositAddress2(null);
    }
  };

  const handleBack4 = (depositAddress: string) => {
    setIsOpen4(false);
    setIsOpen3(true);
    setDepositAddress2(depositAddress);
  };

  const handleSentFunds = (
    amount: string,
    depositAddress: string,
    campaignID: number
  ) => {
    console.log("handleSentFunds", { amount, depositAddress, campaignID });
    setAmount(amount);
    setDepositAddress(depositAddress);
    setSelectedCampaign(campaignID);
    setIsOpen3(false);
    setIsOpen4(true);
  };

  const handleProcced = (
    txHash: string,
    campaignName: string,
    amount: string,
    usdAmount: string
  ) => {
    setcampaignName(campaignName);
    settxHash(txHash);
    setIsOpen4(false);
    setIsOpen5(true);
    setusdAmount(usdAmount);
  };

  return (
    <div>
      <button
        onClick={handleOpenModal}
        style={{
          backgroundColor: "black",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "12px 24px",
          fontSize: "16px",
          fontWeight: "600",
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

      {isOpen && (
        <>
          <SelectionModal
            onProceed={handleProceedToDonate}
            onClose={handleCloseModal}
          />
        </>
      )}
      {isOpen2 && (
        <>
          <Modal2
            onProceed={handleProceedToQR}
            onClose={handleCloseModal}
            onGoBack={handleGoBack}
            campaignID={selectedCampaign || 0}
            CampaignName={selectedCampaignName || ""}
            CampaignImg={selectedCampaignImg || ""}
            CampaignDesc={selectedCampaignDesc || ""}
            referralID={referralID}
          />
        </>
      )}
      {isOpen3 && (
        <>
          <Modal3
            onClose={handleCloseModal}
            onBack={handleGoBack}
            onSentFunds={handleSentFunds}
            campaignID={selectedCampaign || 0}
            amount={donationAmount}
            blockchain={Blockchain}
            decimal={decimal}
            tokenID={tokenId}
            networkFee={networkFee}
            senderaddress={senderAddress}
            isdeposit={depositAddress2}
            CampaignName={selectedCampaignName || ""}
            CampaignImg={selectedCampaignImg || ""}
            CampaignDesc={selectedCampaignDesc || ""}
          />
        </>
      )}
      {isOpen4 && (
        <>
          <Modal4
            onClose={handleCloseModal}
            onBack={handleBack4}
            onProceed={handleProcced}
            campaignID={selectedCampaign || 0}
            amount={donationAmount}
            depositAddress={depositAddress}
            blockchain={Blockchain}
            CampaignName={selectedCampaignName || ""}
            CampaignImg={selectedCampaignImg || ""}
            CampaignDesc={selectedCampaignDesc || ""}
            referralID={referralID}
          />
        </>
      )}
      {isOpen5 && (
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
          referralID={referralID}
        />
      )}
    </div>
  );
};

export default Widget;
