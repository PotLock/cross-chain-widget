import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

const skeletonKeyframes = `
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const injectKeyframes = () => {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = skeletonKeyframes;
  document.head.appendChild(styleSheet);
};

const SkeletonLoader = ({ isMobile }) => {
  const skeletonItems = Array(5).fill(null);
  return (
    <div
      style={{
        display: "flex" as const,
        flexDirection: "column" as const,
        gap: "15px",
      }}
    >
      {skeletonItems.map((_, index) => (
        <div
          key={index}
          style={{
            display: "flex" as const,
            alignItems: "center",
            padding: "10px",
            borderRadius: "10px",
            backgroundColor: "#f3f3f3",
            ...(isMobile && { padding: "8px" }),
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "8px",
              backgroundColor: "#e0e0e0",
              marginRight: "10px",
              animation: "pulse 1.5s ease-in-out infinite",
              ...(isMobile && { fontSize: "20px", marginRight: "8px" }),
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                flex: 1,
                height: "20px",
                borderRadius: "4px",
                backgroundColor: "#e0e0e0",
                animation: "pulse 1.5s ease-in-out infinite",
                ...(isMobile && { fontSize: "15px" }),
              }}
            />
            <div
              style={{
                flex: 1,
                height: "15px",
                borderRadius: "4px",
                backgroundColor: "#e0e0e0",
                marginTop: "8px",
                animation: "pulse 1.5s ease-in-out infinite",
                ...(isMobile && { fontSize: "15px" }),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const SelectionModal = ({ onProceed, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCampaignName, setSelectedCampaignName] = useState(null);
  const [selectedCampaignImg, setSelectedCampaignImg] = useState(null);
  const [selectedCampaignDesc, setSelectedCampaignDesc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isCloseButtonHovered, setIsCloseButtonHovered] = useState(false);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 5;
  const isMobile = useMediaQuery({ maxWidth: 640 });

  const filteredItems = items.filter((item) => {
    const itemID = `${item.id}`;
    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.owner?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itemID?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handleProceed = () => {
    if (selectedCampaign) {
      onProceed(
        selectedCampaign,
        selectedCampaignName,
        selectedCampaignImg,
        selectedCampaignDesc
      );
    }
  };

  const handleSelect = (
    id: number,
    name: string,
    img: string,
    desc: string
  ) => {
    setSelectedCampaign(id);
    setSelectedCampaignName(name);
    setSelectedCampaignImg(img);
    setSelectedCampaignDesc(desc);
  };

  const fetchCampaign = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://us-central1-almond-1b205.cloudfunctions.net/potluck/fetchcampaigns",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setItems(data.data);
      console.log(data.data);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    injectKeyframes();
    fetchCampaign();
  }, []);

  return (
    <div
      style={{
        position: "fixed" as const,
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        background: "rgba(0, 0, 0, 0.65)",
        display: "flex" as const,
        justifyContent: "center" as const,
        alignItems: "center" as const,
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
          ...(isMobile && { width: "80%", padding: "20px" }),
        }}
        onClick={(e) => e.stopPropagation()}
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
            Select Donation Target
          </h2>

          <button
            style={{
              position: "absolute",
              right: isMobile ? "12px" : "18px",
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
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div>
          <input
            type="text"
            placeholder="Search by project name or campaign owner address or campaign id..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              display: "flex" as const,
              flexDirection: "row" as const,
              width: "408px",
              height: "48px",
              minWidth: "80px",
              padding: "8px 12px",
              gap: "4px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "6px",
              boxSizing: "border-box" as const,
              color: "#0F172A",
              ...(isMobile && { width: "100%", padding: "6px 10px" }),
            }}
          />
          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto" as const,
              borderRadius: "8px",
              padding: "13px",
              border: "1px solid #DBDBDB",
              backgroundColor: "#ffffff",
              marginTop: "30px",
              ...(isMobile && { maxHeight: "300px", padding: "10px" }),
            }}
          >
            {isLoading ? (
              <SkeletonLoader isMobile={isMobile} />
            ) : displayedItems.length > 0 ? (
              displayedItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex" as const,
                    alignItems: "center",
                    padding: "10px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "background 0.2s ease",
                    marginBottom: "15px",
                    ...(selectedCampaign === item.id && {
                      backgroundColor: "#F5F5F5",
                    }),
                    ...(isMobile && { padding: "8px", marginBottom: "14px" }),
                  }}
                  onClick={() =>
                    handleSelect(
                      item.id,
                      item.name,
                      item.cover_image_url,
                      item.recipient
                    )
                  }
                >
                  <div
                    style={{
                      display: "flex" as const,
                      flexDirection: "row" as const,
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        backgroundColor: "#F5F5F5",
                        display: "flex" as const,
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                      }}
                    >
                      <img
                        src={item.cover_image_url}
                        alt={`${item.name} icon`}
                        width={60}
                        height={60}
                        style={{ borderRadius: "50%" }}
                      />
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: "16px",
                          marginRight: "10px",
                          color: "#000000",
                          fontFamily: "'Mona Sans', sans-serif",
                          fontWeight: 550,
                          marginBottom: "10px",
                          textAlign: "left" as const,
                          ...(isMobile && { fontSize: "15px" }),
                        }}
                      >
                        {item.name}
                      </div>
                      <div
                        style={{
                          color: "#525252",
                          fontSize: "15px",
                          fontFamily: "sans-serif",
                          textAlign: "left" as const,
                        }}
                      >
                        {item.description?.split(" ").slice(0, 30).join(" ")}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center" as const,
                  color: "#525252",
                  padding: "20px",
                }}
              >
                No campaigns found.
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            display: "flex" as const,
            justifyContent: "space-between",
            marginTop: "25px",
            paddingTop: "20px",
            borderTop: "1px solid #e6ecef",
            ...(isMobile && {
              flexDirection: "column" as const,
              gap: "10px",
              marginTop: "20px",
              paddingTop: "15px",
            }),
          }}
        >
          <button
            style={{
              display: "flex" as const,
              flexDirection: "row" as const,
              alignItems: "center",
              justifyContent: "center",
              width: "438px",
              minWidth: "80px",
              height: "48px",
              gap: "4px",
              borderRadius: "6px",
              padding: "8px 12px",
              backgroundColor: "#000000",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 500,
              cursor: "pointer",
              border: "none",
              textAlign: "center" as const,
              ...(isButtonHovered && { opacity: 0.9 }),
              ...(!selectedCampaign && {
                backgroundColor: "#00000044",
                cursor: "not-allowed",
              }),
              ...(isMobile && {
                width: "100%",
                padding: "10px",
                fontSize: "15px",
              }),
            }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            onClick={handleProceed}
            disabled={!selectedCampaign}
          >
            Confirm Donation
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionModal;
