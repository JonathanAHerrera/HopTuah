"use client";

import { useState, useEffect } from "react";
import { Fredoka } from 'next/font/google';
import { useParams, useRouter } from 'next/navigation';

// Initialize the Fredoka font
const fredoka = Fredoka({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function SkillRoadmapPage() {
  const params = useParams();
  const router = useRouter();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0); // Initialize at 0, will calculate dynamically

  useEffect(() => {
    if (params.skill) {
      fetchRoadmap(params.skill);
    }
  }, [params.skill]);

  const fetchRoadmap = async (skill) => {
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

      // Use all items instead of just the first 3
      setRoadmap(data.data);
      
      // Calculate progress based on completed items (0 and 1)
      const completedItems = [0, 1, 2, 3 , 4]; // The indices of completed items
      const progressPercentage = data.data.length > 0 
        ? Math.round((completedItems.length / data.data.length) * 100) 
        : 0;
      setProgress(progressPercentage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add this function to handle step click
  const handleStepClick = (stepIndex, stepTitle) => {
    // Store the step title in localStorage for the tasks page to use
    localStorage.setItem(`${params.skill}_step_${stepIndex}_title`, stepTitle);
    
    // Navigate to the tasks page for this step
    router.push(`/roadmap/${params.skill}/tasks/${stepIndex}`);
  };

  if (loading) {
    return (
      <div className={fredoka.className} style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        background: "#8FA6C3"
      }}>
        <h2 style={{ color: "white", fontSize: "2rem" }}>Loading your learning path...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className={fredoka.className} style={{ 
        display: "flex", 
        flexDirection: "column",
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        background: "#8FA6C3", 
        padding: "20px"
      }}>
        <h2 style={{ color: "white", fontSize: "2rem", marginBottom: "20px" }}>
          Oops! Something went wrong
        </h2>
        <p style={{ color: "white", fontSize: "1.2rem", marginBottom: "30px" }}>{error}</p>
        <button 
          onClick={() => router.push('/roadmap')}
          style={{
            background: "white",
            color: "#24154A",
            border: "none",
            borderRadius: "50px",
            padding: "12px 24px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "150vh",
        width: "100%",
        overflow: "hidden",
        position: "relative",
        fontFamily: fredoka.style.fontFamily,
      }}
    >
      {/* Top Section - Blue Background */}
      <div
        style={{
          background: "#8FA6C3",
          height: "35%",
          width: "100%",
          position: "relative",
          padding: "20px 40px",
          borderBottom: "none",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
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

          {/* Profile */}
          <div>
            <button
              onClick={() => router.push("/profile")}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                  stroke="#24154A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                  stroke="#24154A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Cloud decorations */}
        {/* <img 
          src="/cloud.svg" 
          alt="" 
          style={{
            position: "absolute",
            top: "30%",
            left: "10%",
            width: "120px",
            zIndex: 1,
          }}
        />
        
        <img 
          src="/cloud.svg" 
          alt="" 
          style={{
            position: "absolute",
            top: "35%",
            right: "15%",
            width: "150px",
            zIndex: 1,
          }}
        /> */}

        {/* Title section */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h2
            style={{
              color: "white",
              fontSize: "1.8rem",
              marginBottom: "5px",
              fontWeight: "500",
            }}
          >
            Lets hop to learning:
          </h2>
          <h1
            style={{
              color: "#24154A",
              fontSize: "3.5rem",
              fontWeight: "bold",
              maxWidth: "100%",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {params.skill?.toUpperCase().replaceAll("%20", " ")}
          </h1>

          {/* Progress bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <span
              style={{
                color: "white",
                fontSize: "1.5rem",
                marginRight: "20px",
                fontWeight: "bold",
              }}
            >
              PROGRESS
            </span>
            <div
              style={{
                width: "400px",
                height: "25px",
                backgroundColor: "white",
                borderRadius: "50px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor: "#24154A",
                  borderRadius: "50px",
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Wavy border for the blue section */}
        <div
          style={{
            position: "absolute",
            bottom: "-1px" /* Overlap slightly to avoid gaps */,
            left: 0,
            width: "100%",
            height: "50px",
            background: "white",
            borderTopLeftRadius: "100%",
            borderTopRightRadius: "100%",
            transform: "scaleX(1.5)",
          }}
        ></div>
      </div>

      {/* Bottom Section - White Background with Path */}
      <div
        style={{
          background: "white",
          height: "65%",
          width: "100%",
          position: "relative",
          padding: "20px",
          overflowY: "auto", // Add scroll for many steps
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: "2",
          }}
        >
          <h2
            className={fredoka.className}
            style={{
              color: "#24154A",
              fontSize: "1.5rem",
              textAlign: "center",
              marginBottom: "30px",
              fontWeight: "bold",
            }}
          >
            Your 10-Step Learning Path
          </h2>
        </div>

        {/* Path and steps container */}
        <div
          style={{
            maxWidth: "800px",
            margin: "100px auto 50px auto",
            position: "relative",
            paddingLeft: "60px",
          }}
        >
          {/* Vertical Path Line */}
          <div
            style={{
              position: "absolute",
              top: "0",
              bottom: "0",
              left: "20px",
              width: "6px",
              background: "#24154A",
              borderRadius: "3px",
              zIndex: "1",
            }}
          ></div>

          {/* Roadmap Steps */}
          {roadmap &&
            (() => {
              // Define completed items
              const completedItems = [0, 1]; // Indices of completed items
              const firstIncompleteIndex = roadmap.findIndex(
                (_, index) => !completedItems.includes(index)
              );

              return roadmap.map((item, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "50px",
                    position: "relative",
                  }}
                >
                  {/* Step Circle */}
                  <div
                    style={{
                      position: "absolute",
                      left: "-60px",
                      top: "0",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: completedItems.includes(index)
                        ? "#8FA6C3"
                        : "white",
                      border: completedItems.includes(index)
                        ? "none"
                        : "2px solid #24154A",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: "2",
                    }}
                  >
                    {completedItems.includes(index) ? (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="#24154A"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <span
                        style={{
                          color: "#24154A",
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                        }}
                      >
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Step Content - Now clickable */}
                  <div
                    onClick={() => handleStepClick(index, item.title)}
                    style={{
                      background: "white",
                      borderRadius: "10px",
                      padding: "20px",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                      border: completedItems.includes(index)
                        ? "2px solid #8FA6C3"
                        : "1px solid #eee",
                      cursor: "pointer", // Add cursor pointer to indicate it's clickable
                    }}
                  >
                    <h3
                      style={{
                        color: "#24154A",
                        fontSize: "1.4rem",
                        margin: "0 0 10px 0",
                        fontWeight: "600",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        color: completedItems.includes(index)
                          ? "#8FA6C3"
                          : "#555",
                        margin: "0",
                        fontWeight: completedItems.includes(index)
                          ? "bold"
                          : "normal",
                      }}
                    >
                      {completedItems.includes(index)
                        ? "Complete!"
                        : item.description}
                    </p>
                  </div>

                  {/* Bunny animation for first incomplete item */}
                  {index === firstIncompleteIndex && (
                    <img
                      src="/bunnyONTop.svg"
                      alt="bunny"
                      style={{
                        position: "absolute",
                        left: "-70px",
                        top: "50px",
                        width: "60px",
                        height: "60px",
                        zIndex: "3",
                      }}
                    />
                  )}
                </div>
              ));
            })()}
        </div>
      </div>
    </div>
  );
} 