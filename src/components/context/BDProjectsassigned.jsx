import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/ApiConfig";
import axios from "axios";
import { useAlert } from "./AlertContext";
const BDProjectsAssignedContext = createContext();
export const BDProjectsAssignedProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
  const [assignedData, setAssignedData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("userToken");
    const { showAlert } = useAlert(); 
  const navigate = useNavigate();
  const [performanceSheets, setPerformanceSheets] = useState([]);
  const handleUnauthorized = (response) => {
    if (response.status === 401) {
      localStorage.removeItem("userToken");
      navigate("/");
      return true;
    }
    return false;
  };
  const fetchAssigned = async () => {
    setIsLoading(true);
    try {
        const response = await axios.get(`${API_URL}/api/assigned-all-projects`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        setAssignedData(response.data.data);
    } catch (error) {
        console.error("Error fetching assigned projects:", error);
    } finally {
        setIsLoading(false);
    }
};

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (handleUnauthorized(response)) return;
      const data = await response.json();
      if (response.ok) {
        setProjects(data.data || []);
      } else {
        setMessage("Failed to fetch projects.");
      }
    } catch (error) {
      setMessage("An error occurred while fetching projects.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjectManagers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projectManager`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (handleUnauthorized(response)) return;
      const data = await response.json();
      if (response.ok) {
        setProjectManagers(data.data || []);
      } else {
        setMessage("Failed to fetch project managers.");
      }
    } catch (error) {
      setMessage("An error occurred while fetching project managers.");
    }
  };

  const assignProject = async (projectId, managerIds) => { 
    setIsLoading(true);
    setMessage("");
    console.log("Assigning project:", projectId, "to managers:", managerIds);
    try {
        const response = await fetch(`${API_URL}/api/assign-project-manager`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ 
                project_id: projectId, 
                project_manager_ids: managerIds  
            }),
        });
        console.log("Response Status:", response.status);
        const data = await response.json();
        console.log("Response Data:", data); 
        if (handleUnauthorized(response)) return;
        if (response.ok) {
            showAlert({ variant: "success", title: "Success", message: "Project assigned successfully!" });
        } else {
            showAlert({ variant: "error", title: "Error", message: "Something went wrong!" });
        }
    } catch (error) {

        showAlert({ variant: "error", title: "Error", message: "Failed to assign project. Please try again." });
    } finally {
        setIsLoading(false);
    }
};
const fetchPerformanceDetails = async () => {
  setIsLoading(true);
  try {
    const response = await axios.get(`${API_URL}/api/get-all-performa-sheets`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    setPerformanceData(response.data.data);
  } catch (error) {
    console.error("Error fetching performance details:", error);
  } finally {
    setIsLoading(false);
  }
};

 const approvePerformanceSheet = async (id) => {
  try {
      const response = await fetch(`${API_URL}/api/get-approval-performa-sheets`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
              data: [{ id, status: "approved" }]
          })
      });
      if (response.ok) {
          setPerformanceSheets(prevSheets =>
              prevSheets.map(sheet =>
                  sheet.id === id ? { ...sheet, status: "approved" } : sheet
              )
          );
      }
      showAlert({ variant: "success", title: "Success", message: "performance sheet Approved" });
  } catch (error) {
      showAlert({ variant: "error", title: "Error", message: error });
  }
};
const rejectPerformanceSheet = async (id) => {
  try {
      const response = await fetch(`${API_URL}/api/get-approval-performa-sheets`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
              data: [{ id, status: "rejected" }]
          })
      });
      if (response.ok) {
          setPerformanceSheets(prevSheets =>
              prevSheets.map(sheet =>
                  sheet.id === id ? { ...sheet, status: "rejected" } : sheet
              )
          );
      }
      showAlert({ variant: "success", title: "Success", message: "performance sheet Rejected" });
  } catch (error) {
      showAlert({ variant: "error", title: "Error", message: error });
  }
};


const removeProjectManagers = async (project_id, manager_ids, token) => {
  try {
    setLoading(true);
    const response = await fetch(`${API_URL}/api/remove-project-managers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Pass the Bearer token
      },
      body: JSON.stringify({ project_id, manager_ids }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to remove managers");

    return data;
  } catch (error) {
    console.error("Error removing project managers:", error);
    return { success: false, message: error.message };
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchProjects();
    fetchProjectManagers();
    fetchPerformanceDetails();
  }, []);
  return (
    <BDProjectsAssignedContext.Provider value={{ 
      projects, 
      projectManagers, 
      isLoading, 
      assignedData,
      performanceData,
      assignProject,
      fetchAssigned, 
      fetchPerformanceDetails,
      performanceSheets, 
      approvePerformanceSheet, 
      rejectPerformanceSheet,
      removeProjectManagers,
      message 
    }}>
      {children}
    </BDProjectsAssignedContext.Provider>
  );
};
export const useBDProjectsAssigned = () => {
  return useContext(BDProjectsAssignedContext);
};