"use client";

import { useState } from "react";
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
      const response = await fetch("/api/generateRoadMap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skill }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate roadmap");
      }

      setRoadmap(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
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
        backgroundColor: "white",
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
            style={{ width: "7vw", height: "7vh" }}
          />
          <img
            src="/Words.svg"
            alt="logo"
            style={{ width: "7vw", height: "7vh" }}
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
        <img
          src="/bunnyLogo.svg"
          alt="logo"
          style={{ width: "20vw", height: "20vh" }}
        />
        <h1 className={fredoka.className} style={{ fontSize: "6rem", fontWeight: "600", color: "#24154A" }}> 
          LOGIN 
        </h1>
        <div
          style={{
            paddingLeft: "100px",
            paddingRight: "100px",
            borderRadius: "50px",
            border: "0px solid black",
            display: "flex",
            flexDirection: "column", // Stack items vertically
            justifyContent: "space-evenly", // Distribute the items evenly
            alignItems: "center", // Center items horizontally
            width: "50vw",
            height: "40vh",
            gap: "2vh", // Maintain spacing between elements
            backgroundColor: "#8FA6C3",
          }}
        >
          <Input
            placeholder="Username"
            type="username"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                window.location.href = "/roadmap";
              }
            }}
            className="rounded-full border-none text-black fredoka"
            style={{
              outline: "none",
              boxShadow: "none",
              backgroundColor: "white",
              color: "black",
              fontSize: "1.5rem",
              height: "5vh",
              paddingLeft: "1vw"
            }}
            
          
          />
          <Input
            placeholder="Password"
            type="password"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                window.location.href = "/roadmap";
              }
            }}
            className="rounded-full border-none text-black fredoka"
            style={{
              outline: "none",
              boxShadow: "none",
              backgroundColor: "white",
              color: "black",
              fontSize: "1.5rem",
              height: "5vh",
              paddingLeft: "1vw"
            }}
            
          
          />
          <button
            style={{
              backgroundColor: "white",
              color: "black", // Set text color to black to ensure visibility
              width: "120px", // Adjust width to fit the "Enter" text
              height: "60px",
              borderRadius: "20%",
              border: "0px solid black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: "0",
              fontFamily: "Fredoka, sans-serif", // Apply Fredoka font here
              fontSize: "25px", // Adjust the font size if needed
              fontWeight: "500",
            }}
            onClick={() => window.location.href = "/roadmap"} // Redirect to login page
          >
            Enter
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