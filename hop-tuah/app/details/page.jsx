"use client";

import { useState } from "react";
import { Fredoka } from 'next/font/google';


// Initialize the Fredoka font
const fredoka = Fredoka({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function HomePage() {
  const [completedTasks, setCompletedTasks] = useState({
    article1: false,
    video1: false,
    video2: false,
    article2: false,
  });

  const handleCheckboxChange = (task) => {
    setCompletedTasks((prevState) => ({
      ...prevState,
      [task]: !prevState[task],
    }));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(to bottom, #8FA6C3 0%, white 50%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Cloud decorations */}
      <img 
        src="/cloud.svg" 
        alt="Cloud"
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "120px",
          zIndex: 1,
          opacity: 0.9
        }}
      />
      
      <img 
        src="/cloud.svg" 
        alt="Cloud"
        style={{
          position: "absolute",
          top: "20%",
          right: "15%",
          width: "180px",
          zIndex: 1,
          opacity: 0.9
        }}
      />
      
      <img 
        src="/cloud.svg" 
        alt="Cloud"
        style={{
          position: "absolute",
          top: "30%",
          left: "10%",
          width: "150px",
          zIndex: 1,
          opacity: 0.9
        }}
      />
      
      {/* Main content */}
      <div
        style={{
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/bunnyONTop.svg"
            alt="logo"
            style={{ width: "7vw", height: "7vh" }}
          />
          <img
            src="/Words.svg"
            alt="logo"
            style={{ width: "7vw", height: "7vh" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/user-icon.svg"
            alt="User Icon"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
            }}
          />
        </div>
      </div>

      <div
        style={{
          width: "100%",
          flex: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          backgroundColor: "transparent",
        }}
      >
        <div
            style={{
                width: "100%", // Ensure it spans the full width
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start", // Align items to the left
                justifyContent: "center",
                paddingLeft: "10vw", // Adjust left padding to move it further left
            }}
        >
            <h1 className={fredoka.className} 
                style={{ fontSize: "4.0rem", fontWeight: "600", color: "#24154A", paddingTop:"10vw" }}>
                Intro
            </h1>

            <div className={fredoka.className}
                style={{
                    fontSize: "2.0rem",
                    color: "#8FA5C3",
                    marginBottom: "20px",
                    fontWeight: "bold",
                    paddingTop:"1w"
                }}
            >
                Checklist:
            </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "70vw",
            backgroundColor: "transparent",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={completedTasks.article1}
              onChange={() => handleCheckboxChange("article1")}
              style={{ marginRight: "10px", borderRadius: "3px" }}
            />
            <label>do this</label>
            <div style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
              <button style={buttonStyle}>Article</button>
              <button style={buttonStyle}>Video</button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={completedTasks.video1}
              onChange={() => handleCheckboxChange("video1")}
              style={{ marginRight: "10px" }}
            />
            <label>do this</label>
            <div style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
              <button style={buttonStyle}>Video</button>
              <button style={buttonStyle}>Article</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: "transparent",
  color: "#24154A",
  border: "2px solid #24154A",
  borderRadius: "20px",
  padding: "6px 12px",
  cursor: "pointer",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

