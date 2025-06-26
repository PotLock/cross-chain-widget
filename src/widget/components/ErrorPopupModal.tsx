import React, { useRef } from "react";
import { useMediaQuery } from "react-responsive";

const ErrorPopupModal = ({
  isOpen,
  onBack,
}: {
  isOpen: boolean;
  onBack: () => void;
}) => {
  const [isBackButtonHovered, setIsBackButtonHovered] = React.useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery({ maxWidth: 640 });

  if (!isOpen) return null;

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
        zIndex: 1100,
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: isMobile ? "20px" : "30px",
          borderRadius: "15px",
          width: isMobile ? "60%" : "300px",
          maxHeight: "90vh",
          position: "relative",
          fontFamily: "'Lato', sans-serif",
          boxShadow: "0 12px 35px rgba(0, 0, 0, 0.15)",
          border: "1px solid #e6ecef",
        }}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        {/* <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#262626",
            color: "#ffffff",
            padding: isMobile ? "20px 12px" : "28px 18px",
            borderRadius: "15px 15px 0 0",
            margin: isMobile ? "-20px -20px 20px -20px" : "-30px -30px 25px -30px",
            fontWeight: 700,
            height: 30
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? "18px" : "20px",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            Error
          </h2>
        </div> */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#1e293b",
            fontSize: isMobile ? "14px" : "16px",
            lineHeight: "1.5",
          }}
        >
          <p style={{ fontWeight: 600, marginBottom: "10px" }}>
            Failed to Generate Address
          </p>
          <p>
            Please ensure you entered a valid sender wallet address in the previous step.
          </p>
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
            }),
          }}
        >
          <button
            style={{
              padding: isMobile ? "12px 20px" : "14px 30px",
              background: "#e6ecef",
              color: "#111827",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontFamily: "'Lato', sans-serif",
              fontWeight: 700,
              transition: "background 0.3s, transform 0.2s, box-shadow 0.3s",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              width: isMobile ? "100%" : "100%",
              ...(isBackButtonHovered && {
                background: "#d1d8e0",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
              }),
            }}
            onMouseEnter={() => setIsBackButtonHovered(true)}
            onMouseLeave={() => setIsBackButtonHovered(false)}
            onClick={onBack}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPopupModal;