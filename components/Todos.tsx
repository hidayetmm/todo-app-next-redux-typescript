import { FC, useState } from "react";
import styled from "styled-components";
import {
  useDeleteTaskMutation,
  useEditTaskContentMutation,
  useGetTasksQuery,
  useUpdateTaskStatusMutation,
} from "../store/tasks";
import { Task } from "../store/types";
import { useDispatch } from "react-redux";
import { notificationActions } from "../store/notification-slice";
import { SaveIcon, EditIcon, DeleteIcon } from "../public/icons";

const Text = styled.h5<{ isDone?: boolean }>`
  margin-bottom: 0px;
  flex: 1;
  text-decoration: ${({ isDone }) => (isDone ? "line-through" : "none")};
  color: ${({ isDone }) =>
    isDone ? "var(--secondary-color)" : "var(--font-color)"} !important;
`;

const Button = styled.button`
  width: 30px;
  height: 30px;
  padding: 3px;
  :hover {
    border-color: #151515 !important;
  }
`;

const TasksMain = styled.div`
  padding-top: 25px;
`;

const TaskDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 5px;
  :hover {
    background-color: #727578;
    color: white;
    svg {
      stroke: white;
    }
    ${Text} {
      color: #fff !important;
    }
    ${Button} {
      color: #fff;
      border-color: #fff;
    }
  }
`;

const Div = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const CheckboxGroup = styled.div`
  display: flex;
  margin-bottom: 0px;
`;

const Icon = styled.img`
  width: 32px;
  height: 32px;
`;

const Tbody = styled.tbody`
  tr:hover {
    background-color: rgba(229, 229, 229, 0.3);
  }
`;

const Td = styled.td<{ isDone?: boolean }>`
  text-decoration: ${({ isDone }) => (isDone ? "line-through" : "none")};
  color: ${({ isDone }) => (isDone ? "var(--secondary-color)" : "none")};
`;

const ActionTd = styled.td`
  text-align: center;
  width: 1%;
  white-space: nowrap;
`;

const Todos: FC = () => {
  const { data, isLoading, isFetching, error } = useGetTasksQuery("");
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const [editTaskContent, { isLoading: isEditing }] =
    useEditTaskContentMutation();
  const [updateTaskStatus, { isLoading: isUpdating }] =
    useUpdateTaskStatusMutation();
  const dispatch = useDispatch();

  const [updatingTaskId, setupdatingTaskId] = useState("");
  const [deletingTaskId, setDeletingTaskId] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editedTaskContent, setEditedTaskContent] = useState("");

  const updateTaskHandler = (id: Task["id"], status: Task["status"]) => {
    setupdatingTaskId(id);
    updateTaskStatus({ id, status }).then((res) => {
      dispatch(
        notificationActions.showNotification({
          text: "Task updated!",
          type: "success",
        })
      );
    });
  };

  const deleteTaskHandler = (id: Task["id"]) => {
    setDeletingTaskId(id);
    deleteTask(id).then((res) => {
      dispatch(
        notificationActions.showNotification({
          text: "Task deleted!",
          type: "success",
        })
      );
    });
  };

  const editTaskContentHandler = (
    id: Task["id"],
    task_content: Task["task_content"]
  ) => {
    if (editingId === id) {
      editedTaskContent === task_content
        ? setEditingId("")
        : editTaskContent({ id, task_content: editedTaskContent }).then(
            (res) => {
              setEditingId("");
              dispatch(
                notificationActions.showNotification({
                  text: "Task updated!",
                  type: "success",
                })
              );
            }
          );
    } else {
      setEditingId(id);
      setEditedTaskContent(task_content);
    }
  };

  return (
    <>
      <TasksMain>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>task name</th>
              <th>status</th>
              <th>action</th>
            </tr>
          </thead>
          <Tbody>
            {data &&
              data.map((task) => (
                <tr key={task.id}>
                  <th>
                    <input
                      disabled={
                        (isUpdating || isFetching) && updatingTaskId === task.id
                      }
                      defaultChecked={task.status === "done" ? true : false}
                      value="checkedd"
                      type="checkbox"
                      id="check"
                      onChange={(e) =>
                        updateTaskHandler(
                          task.id,
                          e.target.checked ? "done" : "progress"
                        )
                      }
                    />
                  </th>
                  <Td isDone={task.status === "done"} id="task_content">
                    {editingId === task.id ? (
                      <input
                        required
                        minLength={5}
                        id="task_content"
                        name="task_content"
                        type="text"
                        defaultValue={task.task_content}
                        placeholder={task.task_content}
                        onChange={(e) => setEditedTaskContent(e.target.value)}
                      />
                    ) : (
                      task.task_content
                    )}
                  </Td>
                  <td>{task.status}</td>
                  <ActionTd>
                    <Button
                      id={task.id + "/edit"}
                      className="btn btn-default btn-ghost"
                      onClick={() =>
                        editTaskContentHandler(task.id, task.task_content)
                      }
                      disabled={isFetching || isEditing}
                    >
                      {editingId === task.id ? <SaveIcon /> : <EditIcon />}
                    </Button>
                    <Button
                      id={task.id + "/delete"}
                      className="btn btn-default btn-ghost"
                      onClick={() => deleteTaskHandler(task.id)}
                    >
                      {(isDeleting || isFetching) &&
                      deletingTaskId === task.id ? (
                        "..."
                      ) : (
                        <DeleteIcon />
                      )}
                    </Button>
                  </ActionTd>
                </tr>
              ))}
          </Tbody>
        </table>
      </TasksMain>
      {isLoading && "Loading"}
    </>
  );
};

export default Todos;
