import { Reference } from "@apollo/client";
import Link from "next/link";
import React, { useEffect } from "react";
import { TaskStatus } from "../generated/graphql-backend";
import {
  Task,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "../generated/graphql-frontend";

interface Props {
  task: Task;
}

const TaskListItem: React.FC<Props> = ({ task }) => {
  const [deleteTask, { loading, error }] = useDeleteTaskMutation({
    errorPolicy: "all",
    update: (cache, result) => {
      const deletedTask = result.data?.deleteTask;
      if (deletedTask) {
        cache.modify({
          fields: {
            tasks(taskRefs: Reference[], { readField }) {
              return taskRefs.filter((taskRef) => {
                return readField("id", taskRef) !== deletedTask.id;
              });
            },
          },
        });
      }
    },
  });
  const handleDeleteClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    task: Task
  ) => {
    e.preventDefault();
    try {
      await deleteTask({ variables: { id: task.id } });
    } catch (error) {
      console.log(error);
    }
  };

  const [
    updateTask,
    { loading: updateTaskLoading, error: updateTaskError },
  ] = useUpdateTaskMutation({
    errorPolicy: "all",
  });
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.target.checked
      ? TaskStatus.Completed
      : TaskStatus.Active;
    updateTask({ variables: { input: { id: task.id, status: newStatus } } });
  };

  useEffect(() => {
    if (error) {
      alert("An error has occured, try again please!");
    }
  }, [error]);

  useEffect(() => {
    if (updateTaskError) {
      alert("an error occured");
    }
  }, [updateTaskError]);

  return (
    <li className="task-list-item" key={task.id}>
      <label className="checkbox">
        <input
          type="checkbox"
          onChange={handleStatusChange}
          checked={task.status === TaskStatus.Completed}
          disabled={updateTaskLoading}
        />
        <span className="checkbox-mark">&#10003;</span>
      </label>
      <Link href="/update/[id]" as={`/update/${task.id}`}>
        <a className="task-list-item-title">{task.title} </a>
      </Link>
      <button
        disabled={loading}
        className="task-list-item-delete"
        onClick={(e) => handleDeleteClick(e, task)}
      >
        &times;
      </button>
    </li>
  );
};

export default TaskListItem;
