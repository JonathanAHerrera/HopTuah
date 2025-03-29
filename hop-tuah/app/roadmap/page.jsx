"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Box } from "lucide-react";

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
      }}
    >
      <div
        style={{
          paddingLeft: "40px",
          paddingRight: "40px",
          backgroundColor: "red",
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div> HOPTUAH </div>
        <div> PROFILE </div>
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
        }}
      >
        <img
          src="/bunnyLogo.svg"
          alt="logo"
          style={{ width: "30vw", height: "30vh" }}
        />
        <h1> What do you want to learn? </h1>
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
          }}
        >
          <Input
            placeholder="Enter a skill you want to master..."
            className="rounded-full border-none text-black"
            style={{
              outline: "none",
              boxShadow: "none",
              backgroundColor: "white",
            }}
          />
          <button
            style={{
              backgroundColor: "black",
              color: "white",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: "0"
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
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M21 12H3" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );  } 