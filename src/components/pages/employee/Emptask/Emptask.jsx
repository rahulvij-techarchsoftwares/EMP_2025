
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Overview } from "../../../components/RichTextEditor";
import { useTask } from "../../../context/TaskContext"; 


export default function Emptask() {
  const [openTask, setOpenTask] = useState(null);
  const [statusDropdown, setStatusDropdown] = useState(null);

  const { project_id } = useParams();
  console.log("project_id izzs", project_id);

  const { empTasks, fetchEmpTasks } = useTask();
  console.log("tasks", empTasks);

  useEffect(() => {
    if (project_id) {
      fetchEmpTasks(project_id);
    }
  }, [project_id]);

  const toggleTask = (id) => {
    setOpenTask(openTask === id ? null : id);
  };

  const toggleStatusDropdown = (id) => {
    setStatusDropdown(statusDropdown === id ? null : id);
  };

  return (
    <div className="flex items-center justify-center relative">



      <div className="w-full bg-white shadow-2xl rounded-3xl p-4">
        <h2 className="text-4xl font-extrabold text-blue-800 mb-8 text-center">Project Details</h2>
        {empTasks.project && (
  <div className="mb-8 p-6 rounded-lg shadow-md bg-[#292929]">
    <p className="text-2xl font-bold text-gray-900 text-white">{empTasks.project.name}</p>

    <p className="text-lg text-gray-700 text-white">
      <strong>Deadline:</strong> {empTasks.project.deadline}
    </p>
    <p className="text-lg text-gray-700 text-white">
      <strong>Total Hours:</strong> {empTasks.project.total_hours}
    </p>
    <p className="text-lg text-gray-700 text-white">
      <strong>Assigned By:</strong> {empTasks.project_manager.name}
    </p>
  </div>
)}

        <h2 className="text-2xl font-bold text-blue-800 mb-6">Project Tasks</h2>
        <div className="relative border-l-4 border-black ml-9 space-y-4">
        {empTasks?.data?.length > 0 ? (
            empTasks.data.map((task) => (
              <div key={task.id} className="relative px-5 py-1 border-b border-[#e1e1e1] pb-5">
                <div className="absolute w-5 h-5 bg-[#292929] rounded-full -left-[0.7rem] top-3"></div>
                <div className="flex justify-between items-center">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="w-full text-left text-2xl font-bold text-gray-900 hover:text-blue-700 focus:outline-none transition-all"
                    >
                      {task.title}
                    </button>
                  <div className="relative flex items-center gap-2">
                    <p
                      className="px-4 py-2 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition-all whitespace-nowrap"
                    >
                      {task.status}
                    </p>
                  </div>
                </div>


                {openTask === task.id && (
                  <div className="mt-5 p-6 bg-blue-50 rounded-2xl shadow-lg border border-blue-300">

                    <p className="text-lg text-gray-800 font-semibold">
                      <strong>Deadline:</strong>
                        <span className="ml-2">{task.deadline}</span>
                    </p>

                    <p className="text-lg text-gray-800 font-semibold">
                      <strong>Hours:</strong>
                        <span className="ml-2">{task.hours}</span>
                    </p>

                    <p className="text-lg text-gray-800 font-semibold">
                      <strong>Assigned By:</strong> {task.project_manager?.name}
                    </p>

                    <p className="text-gray-900 mt-5 leading-relaxed border-t pt-4 text-justify text-lg font-medium">
                        {task.description}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-lg text-gray-800 font-semibold">
              No tasks available for this project.
            </p>
          )}

        </div>

      </div>

    </div>
  );
} 
