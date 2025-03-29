"use client";

import { useState, useEffect } from "react";
import { Fredoka } from "next/font/google";
import { useParams, useRouter } from "next/navigation";

// Initialize the Fredoka font
const fredoka = Fredoka({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
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
  const toggleTaskCompletion = (taskIndex) => {
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
      className={fredoka.className}
      style={{
        background: "#F5F7FA",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
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

        <div>
          <span style={{ color: "#24154A", fontWeight: "bold" }}>
            {completedTasks.length} / {tasks.length} Tasks Completed
          </span>
        </div>
      </div>

      {/* Step title */}
      <div
        style={{
          background: "#8FA6C3",
          padding: "30px",
          borderRadius: "15px",
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "2.5rem",
            margin: "0",
            textAlign: "center",
          }}
        >
          {stepTitle}
        </h1>
        <p
          style={{
            color: "#24154A",
            fontSize: "1.2rem",
            margin: "10px 0 0 0",
            textAlign: "center",
            fontWeight: "500",
          }}
        >
          Complete all tasks to master this step
        </p>
      </div>

      {/* Tasks list */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {tasks.map((task, index) => (
          <div
            key={index}
            style={{
              background: "white",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
              border: completedTasks.includes(index)
                ? "2px solid #8FA6C3"
                : "1px solid #eee",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <div
                onClick={() => toggleTaskCompletion(index)}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: completedTasks.includes(index)
                    ? "#8FA6C3"
                    : "white",
                  border: completedTasks.includes(index)
                    ? "none"
                    : "2px solid #24154A",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  marginRight: "15px",
                  flexShrink: 0,
                }}
              >
                {completedTasks.includes(index) && (
                  <svg
                    width="20"
                    height="20"
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
                )}
              </div>
              <div>
                <h3
                  style={{
                    margin: "0 0 10px 0",
                    color: "#24154A",
                    fontSize: "1.3rem",
                    fontWeight: "600",
                    textDecoration: completedTasks.includes(index)
                      ? "line-through"
                      : "none",
                  }}
                >
                  {task.task}
                </h3>
                <p
                  style={{
                    margin: "0 0 10px 0",
                    color: "#666",
                    fontSize: "0.9rem",
                  }}
                >
                  Estimated time: {task.estimatedTime} minutes
                </p>

                {/* Resources */}
                {task.resources && task.resources.length > 0 && (
                  <div>
                    <h4
                      style={{
                        margin: "10px 0",
                        color: "#24154A",
                        fontSize: "1rem",
                      }}
                    >
                      Helpful Resources:
                    </h4>
                    <ul
                      style={{
                        margin: "0",
                        paddingLeft: "20px",
                      }}
                    >
                      {task.resources.map((resource, i) => (
                        <li key={i} style={{ marginBottom: "5px" }}>
                          <a
                            href={
                              typeof resource === "string"
                                ? resource
                                : resource.url || "#"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#8FA6C3",
                              textDecoration: "underline",
                            }}
                          >
                            {typeof resource === "string"
                              ? resource
                              : resource.title || resource.url || resource}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Complete all button */}
      {tasks.length > 0 && completedTasks.length < tasks.length && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "30px",
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

      {/* Back to roadmap button */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "30px",
        }}
      >
        <button
          onClick={goBackToRoadmap}
          style={{
            background:
              completedTasks.length === tasks.length
                ? "#8FA6C3"
                : "transparent",
            color: completedTasks.length === tasks.length ? "white" : "#24154A",
            border:
              completedTasks.length === tasks.length
                ? "none"
                : "2px solid #24154A",
            borderRadius: "50px",
            padding: "15px 30px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {completedTasks.length === tasks.length
            ? "Step Completed! Return to Roadmap"
            : "Return to Roadmap"}
        </button>
      </div>
    </div>
  );
}
