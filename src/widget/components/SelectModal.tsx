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
        display: "flex",
        flexDirection: "column",
        gap: "15px",
      }}
    >
      {skeletonItems.map((_, index) => (
        <div
          key={index}
          style={{
            display: "flex",
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

const SelectionModal = ({ onProceed, onClose, textInfo }) => {
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

  const handleSelect = (id, name, img, desc) => {
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
        { method: "GET" }
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
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          padding: isMobile ? "20px" : "30px",
          borderRadius: "15px",
          width: isMobile ? "80%" : "400px",
          maxWidth: "400px",
          height: isMobile ? "70vh" : "600px", // Fixed height for modal
          display: "flex",
          flexDirection: "column",
          position: "relative",
          fontFamily: "'Mona Sans', sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            position: "relative",
            background: "#262626",
            color: "#ffffff",
            padding: isMobile ? "30px 12px" : "28px 18px",
            borderRadius: "15px 15px 0 0",
            margin: isMobile ? "-20px -20px 20px -20px" : "-30px -30px 25px -30px",
            textAlign: "center",
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
              Select {textInfo} Target
          </div>
          {/* <button
            style={{
              position: "absolute",
              right: isMobile ? "10px" : "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              fontSize: isMobile ? "29px" : "35px",
              color: "#FCCFCF",
              cursor: "pointer",
              fontFamily: "'Lato', sans-serif",
              transition: "color 0.3s, transform 0.2s",
              outline: "none",           
              boxShadow: "none",      
              ...(isCloseButtonHovered && { transform: "translateY(-50%) scale(1.1)" }),

            }}
            onMouseEnter={() => setIsCloseButtonHovered(true)}
            onMouseLeave={() => setIsCloseButtonHovered(false)}
            onClick={onClose}
          >
            ×
          </button> */}

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
            onClick={onClose}
          >
           <svg width={isMobile ? "20px" : "24"} height={isMobile ? "20px" : "24"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#FCCFCF"/>
</svg>

          </div>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            overflow: "hidden", 
            fontFamily: "'Mona Sans', sans-serif",
          }}
        >
          <input
  type="text"
  placeholder="Search by project name  or campaign id..."
  value={searchTerm}
  onChange={(e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }}
  style={{
    width: "100%",
    height: "48px",
    backgroundColor: "white",
    padding: isMobile ? "6px 10px" : "8px 12px",
    border: "1px solid #E2E8F0",
    borderRadius: "6px",
    boxSizing: "border-box",
    color: "#0F172A",
    fontSize: isMobile ? "14px" : "16px",
    outline: "none",       
    boxShadow: "none",   
  }}
  className="focus:outline-none"
/>

          <div
            style={{
              flex: 1,
              maxHeight: "90%",
              overflowY: "auto", // Scrollable campaigns container
              borderRadius: "8px",
              padding: isMobile ? "10px" : "13px",
              border: "1px solid #DBDBDB",
              backgroundColor: "#ffffff",
              scrollbarWidth: "none",      // Firefox
              msOverflowStyle: "none",     // IE/Edge
            }}
          >
            {isLoading ? (
              <SkeletonLoader isMobile={isMobile} />
            ) : displayedItems.length > 0 ? (
              displayedItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: isMobile ? "8px" : "10px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "background 0.2s ease",
                    marginBottom: "15px",
                    ...(selectedCampaign === item.id && {
                      backgroundColor: "#F5F5F5",
                    }),
                  }}
                  onClick={() =>
                    handleSelect(item.id, item.name, item.cover_image_url, item.recipient)
                  }
                >
                  <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                    <div
                      style={{
                        width: isMobile? 50: "60px",
                        height: isMobile? 50:"60px",
                        borderRadius: "50%",
                        backgroundColor: "#F5F5F5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                      }}
                    >
                      <img
                        src={item.cover_image_url}
                        alt={`${item.name} icon`}
                        width={ isMobile? 50:  60}
                        height={isMobile? 50: 60}
                        style={{ borderRadius: "50%" }}
                      />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: isMobile ? "15px" : "16px",
                          color: "#000000",
                          fontFamily: "'Mona Sans', sans-serif",
                          fontWeight: 550,
                          marginBottom: "10px",
                          textAlign: "left",
                        }}
                      >
                        {item.name}
                      </div>
                      <div
                        style={{
                          color: "#525252",
                          fontSize: "15px",
                          fontFamily: "'Mona Sans', sans-serif",
                          textAlign: "left",
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
                  textAlign: "center",
                  color: "#525252",
                  padding: "20px",
                  fontFamily: "'Mona Sans', sans-serif",
                }}
              >
                No campaigns found.
              </div>
            )}
          </div>
        </div>

        {/* Fixed Button */}
        <div
          style={{
            paddingTop: "20px",
            borderTop: "1px solid #e6ecef",
          }}
        >
          <button
            style={{
              width: "100%",
              height: "48px",
              borderRadius: "6px",
              padding: isMobile ? "10px" : "8px 12px",
              backgroundColor: selectedCampaign ? "#000000" : "#00000044",
              color: "#ffffff",
              fontSize: isMobile ? "14px" : "15px",
              fontWeight: 500,
              cursor: selectedCampaign ? "pointer" : "not-allowed",
              border: "none",
              fontFamily: "'Mona Sans', sans-serif",
              textAlign: "center",
              ...(isButtonHovered && selectedCampaign && { opacity: 0.9 }),
            }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            onClick={handleProceed}
            disabled={!selectedCampaign}
          >
            Proceed 
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionModal;









