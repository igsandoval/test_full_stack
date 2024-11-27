import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/globals.module.css";

type Task = {
  id: number;
  name: string;
  state: "pending" | "completed";
};

const GetList: React.FC = () => {
  const [list, setList] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<Task[]>("http://127.0.0.1:8000/tasks");
        setList(response.data);
      } catch (error) {
        console.error("Error al cargar las tareas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTasks();
  }, []);

  const handleAddTask = async () => {
    if (newTask.trim() === "") return;
    const newTaskObj: Omit<Task, "id"> = { name: newTask, state: "pending" };
    try {
      const response = await axios.post<Task>(
        "http://127.0.0.1:8000/tasks",
        newTaskObj
      );
      setList([...list, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("Error al añadir la tarea:", error);
    }
  };

  const handleToggleState = async (id: number) => {
    const task = list.find((task) => task.id === id);
    if (!task) return;

    const updatedTask = {
      ...task,
      state: task.state === "completed" ? "pending" : "completed",
    };
    try {
      await axios.patch(`http://127.0.0.1:8000/tasks/${id}`, {
        state: updatedTask.state,
      });
      setList(list.map((task) => (task.id === id ? updatedTask : task)));
    } catch (error) {
      console.error("Error al cambiar el estado de la tarea:", error);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmation = window.confirm(
      "¿Estás seguro que deseas eliminar esta tarea?"
    );
    if (!confirmation) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/tasks/${id}`);
      setList(list.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  const handleFilterChange = (newFilter: "all" | "pending" | "completed") => {
    setFilter(newFilter);
  };

  const filteredList =
    filter === "all" ? list : list.filter((task) => task.state === filter);

  return (
    <div className={styles.container}>
      <div style={{ width: "100%", marginBottom: "10px" }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nueva tarea"
          style={{
            width: "calc(100% - 110px)",
            padding: "8px",
            marginRight: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleAddTask}
          className={styles.create}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "8px 12px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Añadir
        </button>
      </div>

      <div className={styles.filter}>
        <button
          onClick={() => handleFilterChange("all")}
          className={`${styles["filter-btn"]} ${
            filter === "all" ? styles.active : ""
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => handleFilterChange("pending")}
          className={`${styles["filter-btn"]} ${
            filter === "pending" ? styles.active : ""
          }`}
          style={{
            backgroundColor: filter === "pending" ? "#ffeb3b" : "#f4f4f4",
            border: "1px solid #ccc",
          }}
        >
          Pendientes
        </button>
        <button
          onClick={() => handleFilterChange("completed")}
          className={`${styles["filter-btn"]} ${
            filter === "completed" ? styles.active : ""
          }`}
          style={{
            backgroundColor: filter === "completed" ? "#4caf50" : "#f4f4f4",
            border: "1px solid #ccc",
          }}
        >
          Completadas
        </button>
      </div>

      <div className={styles["task-list"]}>
        {isLoading ? (
          <p>Cargando tareas...</p>
        ) : filteredList.length > 0 ? (
          filteredList.map((task) => (
            <div
              key={task.id}
              className={`${styles["task-item"]} ${
                task.state === "completed" ? styles.completed : styles.pending
              }`}
              style={{
                backgroundColor:
                  task.state === "completed" ? "#d1ffd1" : "#ffd1d1",
              }}
            >
              <p style={{ flex: 1, margin: 0 }}>{task.name}</p>
              <button
                onClick={() => handleToggleState(task.id)}
                style={{
                  backgroundColor:
                    task.state === "completed" ? "#2196f3" : "#ff9800",
                  color: "#fff",
                  padding: "5px 10px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {task.state === "completed" ? "Completo" : "Pendiente"}
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className={styles["delete-btn"]}
                style={{
                  backgroundColor: "#f44336",
                  color: "#fff",
                  padding: "5px 10px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginLeft: "2%",
                }}
              >
                Eliminar
              </button>
            </div>
          ))
        ) : (
          <p>No hay tareas para mostrar</p>
        )}
      </div>
    </div>
  );
};

export default GetList;
