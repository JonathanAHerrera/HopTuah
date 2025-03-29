"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Box } from "lucide-react";
import { Fredoka } from 'next/font/google';

// Initialize the Fredoka font
const fredoka = Fredoka({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RoadmapPage() {
  const router = useRouter();
  const [skill, setSkill] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateRoadmap = async () => {
    if (!skill.trim()) {
      setError("Please enter a skill");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // First check if we can generate a roadmap
      const response = await fetch("/api/generateRoadMap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skill }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate roadmap");
      }
      
      // If successful, navigate to the skill-specific roadmap page
      router.push(`/roadmap/${encodeURIComponent(skill.toLowerCase())}`);
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
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
        alt="" 
        style={{
          position: "absolute",
          top: "12%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "120px",
          zIndex: 1,
          opacity: 0.9
        }}
      />
      
      <img 
        src="/cloud.svg" 
        alt="" 
        style={{
          position: "absolute",
          top: "10%",
          right: "15%",
          width: "180px",
          zIndex: 1,
          opacity: 0.9
        }}
      />
      
      <img 
        src="/cloud.svg" 
        alt="" 
        style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: "150px",
          zIndex: 1,
          opacity: 0.9
        }}
      />
      
      <img 
        src="/cloud.svg" 
        alt="" 
        style={{
          position: "absolute",
          bottom: "7%",
          right: "20%",
          width: "130px",
          zIndex: 1,
          opacity: 0.8
        }}
      />
      
      <img 
        src="/cloud.svg" 
        alt="" 
        style={{
          position: "absolute",
          bottom: "10%",
          left: "25%",
          width: "100px",
          zIndex: 1,
          opacity: 0.8
        }}
      />
      
      {/* <img 
        src="/cloud.svg" 
        alt="" 
        style={{
          position: "absolute",
          bottom: "35%",
          left: "45%",
          width: "80px",
          zIndex: 1,
          opacity: 0.7
        }}
      /> */}
      
      {/* Main content */}
      <div
        style={{
          paddingLeft: "40px",
          paddingRight: "40px",
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "transparent",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: "1vw",
            height: "10vh",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <img
            src="/bunnyONTop.svg"
            alt="logo"
            style={{ width: "7vw", height: "7vh", marginRight: "10px" }}
          />
          <img
            src="/Words.svg"
            alt="logo"
            style={{ width: "7vw", height: "7vh" }}
          />
        </div>
        <div>
          <button
            style={{
              backgroundColor: "transparent",
              color: "black",
              border: "3px solid black",
              borderRadius: "20px",
              padding: "6px 12px",
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            onClick={() => (window.location.href = "/login")}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 17L21 12L16 7"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12H9"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
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
        <img
          src="/bunnyLogo.svg"
          alt="logo"
          style={{ width: "30vw", height: "30vh" }}
        />
        <h1 className={fredoka.className} style={{ fontSize: "2.5rem", fontWeight: "600", color: "#24154A" }}> 
          What do you want to learn? 
        </h1>
        <div
          style={{
            paddingLeft: "40px",
            paddingRight: "40px",
            borderRadius: "50px",
            border: "3px solid black",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "70vw",
            height: "10vh",
            gap: "20px",
            backgroundColor: "white",
          }}
        >
          <Input
            placeholder=""
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleGenerateRoadmap();
              }
            }}
            className="rounded-full border-none text-black fredoka"
            style={{
              outline: "none",
              boxShadow: "none",
              backgroundColor: "white",
              color: "black",
              fontSize: "1.5rem",
            }}
          />
          <button
            style={{
              backgroundColor: "white",
              color: "white",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              border: "2px solid black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: "0",
            }}
            onClick={handleGenerateRoadmap}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.5 4.5L21 12L13.5 19.5"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12H3"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        
        {loading && (
          <div className={fredoka.className} style={{ marginTop: "20px", fontSize: "1.5rem", color: "#24154A" }}>
            Generating your roadmap...
          </div>
        )}
        
        {error && (
          <div className={fredoka.className} style={{ 
            marginTop: "20px", 
            padding: "10px 20px", 
            backgroundColor: "rgba(255, 0, 0, 0.1)", 
            borderRadius: "8px",
            color: "red"
          }}>
            {error}
          </div>
        )}
        
        {roadmap && (
          <div style={{ 
            width: "85%", 
            marginTop: "30px",
            maxHeight: "50vh",
            overflowY: "auto",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "20px",
            padding: "20px",
            border: "2px solid #24154A"
          }}>
            <h2 className={fredoka.className} style={{ 
              fontSize: "2rem", 
              color: "#24154A", 
              textAlign: "center",
              marginBottom: "20px" 
            }}>
              Your Roadmap for: {skill}
            </h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {roadmap.map((item, index) => (
                <div key={index} style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "15px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                }}>
                  <h3 className={fredoka.className} style={{ fontSize: "1.2rem", color: "#24154A" }}>
                    {index + 1}. {item.title}
                  </h3>
                  <p style={{ marginTop: "8px", color: "#333" }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );  } 