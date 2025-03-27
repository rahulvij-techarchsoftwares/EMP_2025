import React, { useEffect, useState } from "react";
import { useTeam } from "../../../context/TeamContext";
import { Edit, Save, Trash2, Loader2, Eye } from "lucide-react";
import { exportToExcel } from "../../../components/excelUtils";
import { Teams } from './Teams'
export const Teamtable = () => {
  const { teams, fetchTeams, deleteTeam, updateTeam, isLoading } = useTeam();
  const [editingTeam, setEditingTeam] = useState(null);
  const [newName, setNewName] = useState("");
  const [deleteclient, setDeleteclient] = useState(null);
  // const [editid, setEditid] = useState(null);
  const [teamId, setteamId] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleEdit = (team) => {
    setEditingTeam(team.id);
    setNewName(team.name);
  };

  const handleUpdate = async (teamId) => {
    await updateTeam(teamId, newName);
    setEditingTeam(null);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm p-4 mb-3.5">
      <div className="">
        <h2 className="text-xl font-semibold text-gray-800">Team Management</h2>
        <p className="text-sm text-gray-500 mt-1">Manage teams and update details</p>
        <div className="flex justify-between items-center gap-2">
          <Teams />
          <button
            onClick={() => exportToExcel(teams, "teams.xlsx")}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Export to Excel
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="border-b border-gray-800 bg-black text-white">
            <tr>
              <th className="px-4 py-2 text-center">Created Date</th>
              <th className="px-4 py-2 text-center">Updated Date</th>
              <th className="px-4 py-2 text-center">Team Name</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" className="px-4 py-3 text-center text-gray-500">
                  <Loader2 className="h-5 w-5 animate-spin inline-block" /> Loading teams...
                </td>
              </tr>
            ) : teams.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-3 text-center text-gray-500">No teams found</td>
              </tr>
            ) : (
              teams.map((team) => (
                <tr key={team.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 text-center">{team.created_at || "-"}</td>
                  <td className="px-4 py-3 text-gray-700 text-center">{team.updated_at || "-"}</td>
                  <td className="px-4 py-3 text-gray-700 text-center">
                    {editingTeam === team.id ? (
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="border border-gray-300 p-1 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    ) : (
                      team.name
                    )}
                  </td>
                  <td className="px-4 py-3 flex items-center justify-center">
                    <div className="flex items-center justify-center space-x-2">
                      {editingTeam === team.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(team.id)}
                            className="flex justify-center text-base items-center px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md transition"
                          ><Save className="h-4 w-4 mr-1" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingTeam(null)}
                            className="flex items-center justify-center px-3 py-1.5 border border-gray-500 text-gray-500 hover:bg-gray-50 rounded-md transition"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(team)}
                            className="flex justify-between text-base items-center px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-md mr-2 transition"
                          ><Edit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setEditingTeam(team.id);

                              setDeleteclient(true);
                            }}
                            className="flex justify-between text-base items-center px-3 py-1.5 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition"
                          ><Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {deleteclient && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="deleteModalLabel"
          aria-describedby="deleteModalDescription"
        >
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full m-2">
            <div className="flex justify-between items-center mb-4">
              <h2 id="deleteModalLabel" className="text-lg font-semibold">
                Are you sure you want to delete this folder?
              </h2>
            </div>
            <div
              id="deleteModalDescription"
              className="text-sm text-gray-600 mb-4"
            >
              This action cannot be undone. Please confirm if you'd like to
              proceed.
            </div>            <div className="flex justify-end gap-2 my-2">
              <button
                onClick={() => setDeleteclient(false)}
                className="border-2 border-blue-500 text-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>              
              <button
                onClick={() => {
                  deleteTeam(editingTeam);
                  
                  setDeleteclient(false);
                }}
                className="bg-blue-500 text-white px-6 py-2 rounded flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
