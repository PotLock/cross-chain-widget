import React, { useRef } from "react";
import { useMediaQuery } from "react-responsive";

const QuitConfirmationModal = ({
  isOpen,
  onCancel,
  onConfirm,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  const [isCancelButtonHovered, setIsCancelButtonHovered] =
    React.useState(false);
  const [isConfirmButtonHovered, setIsConfirmButtonHovered] =
    React.useState(false);
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
      onClick={onCancel}
    >
      <div
        style={{
          background: "#ffffff",
          padding: isMobile ? "20px" : "30px",
          borderRadius: "15px",
          width: isMobile ? "60%" : "300px",
          maxHeight: "90vh",
          position: "relative",
          fontFamily: "'Mona Sans', sans-serif",
          boxShadow: "0 12px 35px rgba(0, 0, 0, 0.15)",
          border: "1px solid #e6ecef",
        }}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#1e293b",
            fontSize: isMobile ? "14px" : "16px",
            lineHeight: "1.5",
            fontFamily: "'Mona Sans', sans-serif",
          }}
        >
          <p style={{ fontWeight: 600, marginBottom: "10px",  fontFamily: "'Mona Sans', sans-serif", }}>
            Are you sure you want to quit?
          </p>
          <p>
            All your progress will be lost, and you will need to start over.
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
              padding: isMobile ? "12px 10px" : "14px 30px",
              background: "#F1F5F9",
              color: "#111827",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontFamily: "'Mona Sans', sans-serif",
              fontWeight: 700,
              transition: "background 0.3s, transform 0.2s, box-shadow 0.3s",
            
              width: isMobile ? "100%" : "auto",
              ...(isCancelButtonHovered && {
                background: "#d1d8e0",
                transform: "translateY(-2px)",
              
              }),
            }}
            onMouseEnter={() => setIsCancelButtonHovered(true)}
            onMouseLeave={() => setIsCancelButtonHovered(false)}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            style={{
              padding: isMobile ? "12px 10px" : "14px 30px",
              background: "#dc2626",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontFamily: "'Mona Sans', sans-serif",
              fontWeight: 700,
              transition: "background 0.3s, transform 0.2s, box-shadow 0.3s",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              width: isMobile ? "100%" : "auto",
              ...(isConfirmButtonHovered && {
                background: "#b91c1c",
                transform: "translateY(-2px)",
               // boxShadow: "0 6px 15px rgba(220, 38, 38, 0.3)",
              }),
            }}
            onMouseEnter={() => setIsConfirmButtonHovered(true)}
            onMouseLeave={() => setIsConfirmButtonHovered(false)}
            onClick={onConfirm}
          >
            Quit
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuitConfirmationModal;
