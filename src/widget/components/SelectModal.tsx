import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

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
  modalHeaderH2: {
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
  customBox: {
    display: "flex",
    flexDirection: "row",
    width: "408px",
    height: "48px",
    minWidth: "80px",
    padding: "8px 12px",
    gap: "4px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "6px",
    boxSizing: "border-box",
    color: "#0F172A",
  },
  projectList: {
    maxHeight: "400px",
    overflowY: "auto",
    borderRadius: "8px",
    padding: "13px",
    border: "1px solid #DBDBDB",
    backgroundColor: "#ffffff",
    marginTop: "30px",
  },
  projectItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "background 0.2s ease",
    marginBottom: "15px",
  },
  projectItemSelected: {
    backgroundColor: "#F5F5F5",
  },
  projectInfo: {
    display: "flex",
    flexDirection: "row",
    gap: "20px",
  },
  projectIcon: {
    marginRight: "10px",
  },
  projectText: {
    fontSize: "16px",
    marginRight: "10px",
    color: "#000000",
    fontFamily: "'Mona Sans', sans-serif",
    fontWeight: 550,
    marginBottom: "10px",
    textAlign: "left",
  },
  projectType: {
    color: "#525252",
    fontSize: "15px",
    fontFamily: "sans-serif",
    textAlign: "left",
  },
  button: {
    display: "flex",
    flexDirection: "row",
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
  modalHeaderH2Mobile: {
    fontSize: "18px",
  },
  closeButtonMobile: {
    fontSize: "22px",
  },
  customBoxMobile: {
    width: "100%",
    padding: "6px 10px",
  },
  projectListMobile: {
    maxHeight: "300px",
    padding: "10px",
  },
  projectItemMobile: {
    padding: "8px",
    marginBottom: "14px",
  },
  projectIconMobile: {
    fontSize: "20px",
    marginRight: "8px",
  },
  projectTextMobile: {
    fontSize: "15px",
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

  skeletonWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  skeletonItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderRadius: "10px",
    backgroundColor: "#f3f3f3",
  },
  skeletonIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "8px",
    backgroundColor: "#e0e0e0",
    marginRight: "10px",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  skeletonText: {
    flex: 1,
    height: "20px",
    borderRadius: "4px",
    backgroundColor: "#e0e0e0",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  skeletonDescription: {
    flex: 1,
    height: "15px",
    borderRadius: "4px",
    backgroundColor: "#e0e0e0",
    marginTop: "8px",
    animation: "pulse 1.5s ease-in-out infinite",
  },
};

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
    <div style={inlineStyles.skeletonWrapper}>
      {skeletonItems.map((_, index) => (
        <div
          key={index}
          style={{
            ...inlineStyles.skeletonItem,
            ...(isMobile ? inlineStyles.projectItemMobile : {}),
          }}
        >
          <div
            style={{
              ...inlineStyles.skeletonIcon,
              ...(isMobile ? inlineStyles.projectIconMobile : {}),
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                ...inlineStyles.skeletonText,
                ...(isMobile ? inlineStyles.projectTextMobile : {}),
              }}
            />
            <div
              style={{
                ...inlineStyles.skeletonDescription,
                ...(isMobile ? inlineStyles.projectTextMobile : {}),
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
      const response = await fetch("http://localhost:3003/fetchcampaigns", {
        method: "GET",
      });

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
    <div style={inlineStyles.modalOverlay} onClick={onClose}>
      <div
        style={{
          ...inlineStyles.modalContent,
          ...(isMobile ? inlineStyles.modalContentMobile : {}),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            ...inlineStyles.modalHeader,
            ...(isMobile ? inlineStyles.modalHeaderMobile : {}),
          }}
        >
          <h2
            style={{
              ...inlineStyles.modalHeaderH2,
              ...(isMobile ? inlineStyles.modalHeaderH2Mobile : {}),
            }}
          >
            Select Donation Target
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
              ...inlineStyles.customBox,
              ...(isMobile ? inlineStyles.customBoxMobile : {}),
            }}
          />
          <div
            style={{
              ...inlineStyles.projectList,
              ...(isMobile ? inlineStyles.projectListMobile : {}),
            }}
          >
            {isLoading ? (
              <SkeletonLoader isMobile={isMobile} />
            ) : displayedItems.length > 0 ? (
              displayedItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    ...inlineStyles.projectItem,
                    ...(selectedCampaign === item.id
                      ? inlineStyles.projectItemSelected
                      : {}),
                    ...(isMobile ? inlineStyles.projectItemMobile : {}),
                  }}
                  onClick={() =>
                    handleSelect(
                      item.id,
                      item.name,
                      item.cover_image_url,
                      item.description
                    )
                  }
                >
                  <div style={inlineStyles.projectInfo}>
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
                          ...inlineStyles.projectText,
                          ...(isMobile ? inlineStyles.projectTextMobile : {}),
                        }}
                      >
                        {item.name}
                      </div>
                      <div style={inlineStyles.projectType}>
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
                }}
              >
                No campaigns found.
              </div>
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
              ...(!selectedCampaign ? inlineStyles.buttonDisabled : {}),
              ...(isMobile ? inlineStyles.buttonMobile : {}),
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
