import React, { useState } from "react";
import { useProject } from "../../../context/ProjectContext";
import { useClient } from "../../../context/ClientContext";
import { Loader2 } from "lucide-react";

export const Projects = () => {
  const { addProject, isLoading, message } = useProject();
  const [clientId, setClientId] = useState("");
  const { clients } = useClient();
  const [projectName, setProjectName] = useState("");
  const [requirements, setRequirements] = useState("");
  const [budget, setBudget] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      clientId.trim() &&
      projectName.trim() &&
      requirements.trim() &&
      budget.trim()
    ) {
      await addProject(clientId, projectName, requirements, budget);
      setClientId("");
      setProjectName("");
      setRequirements("");
      setBudget("");
      setShowMessage(true);
      setShowModal(false);
    }
  };

  return (
    <div className="overflow-hidden bg-white">
      {/* <h2 className="text-xl font-semibold text-gray-800">Enter Project Details</h2>
      <p className="text-sm text-gray-500 mt-1">Add a new Project to the system</p> */}

      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition text-white"
      >
        Assign Projects
      </button>

    {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800">Enter Project Details</h2>
            <p className="text-sm text-gray-500 mt-1">Add a new Project to the system</p>

            {showMessage && message && (
              <div
                className={`mt-4 p-3 rounded-md text-sm font-medium text-center ${
                  message.includes("successfully")
                    ? "bg-green-50 text-green-800 border border-green-300"
                    : "bg-red-50 text-red-800 border border-red-300"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="clientName" className="block font-medium text-gray-700 text-sm">
                  Client Name
                </label>
                <select
                  id="clientName"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select Client</option>
                  {clients?.data?.map((client) => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="projectName" className="block font-medium text-gray-700 text-sm">
                  Project Name
                </label>
                <input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter Project Name"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="requirements" className="block font-medium text-gray-700 text-sm">
                  Requirements
                </label>
                <input
                  id="requirements"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Enter Requirements"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="budget" className="block font-medium text-gray-700 text-sm">
                  Budget
                </label>
                <input
                  id="budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Enter Budget"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium p-2 rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Adding Project...
                  </>
                ) : (
                  "Submit"
                )}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white font-medium p-2 rounded-md transition-colors duration-150"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div> 
  );
};
