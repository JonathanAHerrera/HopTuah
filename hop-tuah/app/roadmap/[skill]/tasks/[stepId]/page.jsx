"use client";

import { useState, useEffect } from "react";
import { Fredoka, Open_Sans } from "next/font/google";
import { useParams, useRouter } from "next/navigation";

// Initialize the fonts
const fredoka = Fredoka({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const open_sans = Open_Sans({ 
  subsets: ["latin"], 
  display: "swap"
});

export default function TasksPage() {
  const params = useParams();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [stepTitle, setStepTitle] = useState("");
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get step title from localStorage
    const savedStepTitle = localStorage.getItem(
      `${params.skill}_step_${params.stepId}_title`
    );
    if (savedStepTitle) {
      setStepTitle(savedStepTitle);
      fetchTasks(params.skill, savedStepTitle, params.stepId);
    }

    // Load completed tasks from localStorage
    const savedCompletedTasks = localStorage.getItem(
      `${params.skill}_step_${params.stepId}_completed_tasks`
    );
    if (savedCompletedTasks) {
      setCompletedTasks(JSON.parse(savedCompletedTasks));
    }
  }, [params.skill, params.stepId]);

  const fetchTasks = async (skill, title, stepIndex) => {
    setLoading(true);
    setError(null);

    try {
      // Check if we have cached tasks
      const cachedTasks = localStorage.getItem(
        `${skill}_step_${stepIndex}_tasks`
      );

      if (cachedTasks) {
        setTasks(JSON.parse(cachedTasks));
        setLoading(false);
        return;
      }

      // If no cached tasks, fetch new ones
      const response = await fetch("/api/generateTasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skill,
          stepTitle: title,
          stepIndex: parseInt(stepIndex),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate tasks");
      }

      // Set tasks data
      setTasks(data.tasks);

      // Cache tasks in localStorage
      localStorage.setItem(
        `${skill}_step_${stepIndex}_tasks`,
        JSON.stringify(data.tasks)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle task completion
  const handleCheckboxChange = (taskIndex) => {
    let updatedCompletedTasks = [...completedTasks];

    if (completedTasks.includes(taskIndex)) {
      updatedCompletedTasks = updatedCompletedTasks.filter(
        (index) => index !== taskIndex
      );
    } else {
      updatedCompletedTasks.push(taskIndex);
    }

    setCompletedTasks(updatedCompletedTasks);

    // Save to localStorage
    localStorage.setItem(
      `${params.skill}_step_${params.stepId}_completed_tasks`,
      JSON.stringify(updatedCompletedTasks)
    );

    // Check if all tasks are completed
    if (updatedCompletedTasks.length === tasks.length) {
      // Mark the step as completed in the roadmap
      updateStepCompletion(true);
    } else if (
      updatedCompletedTasks.length < tasks.length &&
      completedTasks.length === tasks.length
    ) {
      // If we had all tasks completed before but now we don't
      updateStepCompletion(false);
    }
  };

  // Update step completion status in the roadmap
  const updateStepCompletion = (isCompleted) => {
    // Get current completed steps
    const savedCompletedSteps = localStorage.getItem(
      `${params.skill}_completed_steps`
    );
    let completedSteps = savedCompletedSteps
      ? JSON.parse(savedCompletedSteps)
      : [];
    const stepId = parseInt(params.stepId);

    if (isCompleted && !completedSteps.includes(stepId)) {
      completedSteps.push(stepId);
    } else if (!isCompleted && completedSteps.includes(stepId)) {
      completedSteps = completedSteps.filter((id) => id !== stepId);
    }

    // Save updated completed steps
    localStorage.setItem(
      `${params.skill}_completed_steps`,
      JSON.stringify(completedSteps)
    );
  };

  // Go back to roadmap
  const goBackToRoadmap = () => {
    router.push(`/roadmap/${params.skill}`);
  };

  // Helper function to get the resource URL for a task
  const getResourceUrl = (task, index) => {
    // For debugging - log the task resources
    console.log(`Task ${index} resources:`, task.resources);

    // Check if this task has resources
    if (task.resources && task.resources.length > 0) {
      // Handle different resource formats
      if (typeof task.resources[0] === 'object' && task.resources[0].url) {
        // It's an object with a url property
        return task.resources[0].url;
      } else if (typeof task.resources[0] === 'string') {
        // It's a string URL
        return task.resources[0];
      }
    }
    
    // Fallback search query for this specific task
    const searchQuery = `${params.skill} ${stepTitle} ${task.task}`;
    return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  };

  if (loading) {
    return (
      <div
        className={fredoka.className}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#8FA6C3",
        }}
      >
        <h2 style={{ color: "white", fontSize: "2rem" }}>Loading tasks...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={fredoka.className}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#8FA6C3",
          padding: "20px",
        }}
      >
        <h2 style={{ color: "white", fontSize: "2rem", marginBottom: "20px" }}>
          Oops! Something went wrong
        </h2>
        <p style={{ color: "white", fontSize: "1.2rem", marginBottom: "30px" }}>
          {error}
        </p>
        <button
          onClick={goBackToRoadmap}
          style={{
            background: "white",
            color: "#24154A",
            border: "none",
            borderRadius: "50px",
            padding: "12px 24px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            cursor: "pointer",
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
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
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
          top: "26%",
          right: "7%",
          width: "150px",
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
          left: "5%",
          width: "150px",
          zIndex: 1,
          opacity: 0.9
        }}
      />

      {/* Main content */}
      <div
        style={{
          width: "100%",
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

        <button
          onClick={goBackToRoadmap}
          style={{
            background: "#8FA6C3",
            color: "white",
            border: "none",
            borderRadius: "50px",
            padding: "10px 20px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ marginRight: "5px" }}>←</span> Back to Roadmap
        </button>
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          padding: "0 5%",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            marginTop: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1 
            className={fredoka.className} 
            style={{ 
              fontSize: "4.0rem", 
              fontWeight: "600", 
              color: "#24154A", 
              paddingTop: "2vw",
              textAlign: "center"
            }}
          >
            {stepTitle} 
          </h1>

          <div 
            className={fredoka.className}
            style={{
              fontSize: "2.0rem",
              color: "#8FA5C3",
              marginBottom: "20px",
              fontWeight: "bold",
              paddingTop: "1vw"
            }}
          >
            Checklist: {completedTasks.length}/{tasks.length} completed
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            width: "80vw",
            margin: "0 auto",
            paddingBottom: "50px",
          }}
        >
          {tasks.map((task, index) => (
            <div 
              key={index} 
              style={{ 
                display: "flex", 
                alignItems: "center",
                backgroundColor: "white",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
              }}
            >
              <input
                type="checkbox"
                checked={completedTasks.includes(index)}
                onChange={() => handleCheckboxChange(index)}
                style={{ 
                  marginRight: "15px", 
                  width: "20px",
                  height: "20px",
                  accentColor: "#24154A"
                }}
              />
              <label 
                className={open_sans.className} 
                style={{ 
                  fontSize: "1.5rem", 
                  color: "#24154A",
                  textDecoration: completedTasks.includes(index) ? "line-through" : "none",
                  flex: 1
                }}
              >
                {task.task}
              </label>
              
              {/* Resource button with specific URL for each task */}
              <button style={buttonStyle}>
                <a
                  href={getResourceUrl(task, index)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={fredoka.className}
                  style={{
                    color: "#24154A",
                    textDecoration: "none",
                    fontSize: "1.5rem",
                  }}
                >
                  Resource
                </a>
              </button>
            </div>
          ))}
        </div>

        {/* Complete all button */}
        {tasks.length > 0 && completedTasks.length < tasks.length && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
              marginBottom: "30px",
            }}
          >
            <button
              onClick={() => {
                // Mark all tasks as completed
                const allTaskIndices = Array.from(
                  { length: tasks.length },
                  (_, i) => i
                );
                setCompletedTasks(allTaskIndices);
                localStorage.setItem(
                  `${params.skill}_step_${params.stepId}_completed_tasks`,
                  JSON.stringify(allTaskIndices)
                );
                updateStepCompletion(true);
              }}
              className={fredoka.className}
              style={{
                background: "#24154A",
                color: "white",
                border: "none",
                borderRadius: "50px",
                padding: "15px 30px",
                fontSize: "1.2rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Mark All Tasks Complete
            </button>
          </div>
        )}

        {/* Back to roadmap button - shown when all tasks completed */}
        {completedTasks.length === tasks.length && tasks.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
              marginBottom: "30px",
            }}
          >
            <button
              onClick={goBackToRoadmap}
              className={fredoka.className}
              style={{
                background: "#8FA6C3",
                color: "white",
                border: "none",
                borderRadius: "50px",
                padding: "15px 30px",
                fontSize: "1.2rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Step Completed! Return to Roadmap
            </button>
          </div>
        )}

        {/* Add this after the "Step Completed! Return to Roadmap" button */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
          <button
            onClick={() => {
              // Clear the cached tasks for this step
              localStorage.removeItem(`${params.skill}_step_${params.stepId}_tasks`);
              // Refetch the tasks
              fetchTasks(params.skill, stepTitle, params.stepId);
            }}
            className={fredoka.className}
            style={{
              background: "#f1f1f1",
              color: "#666",
              border: "none",
              borderRadius: "50px",
              padding: "10px 20px",
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            Regenerate Tasks
          </button>
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
  fontSize: "1rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
