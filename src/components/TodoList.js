import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { setTodos, addTodo, updateTodo, deleteTodo } from "../store/todoSlice";
import { toast } from "react-toastify";

const TodoList = () => {
  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const todos = useSelector((state) => state.todos.items);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, `users/${user.uid}/todos`),
        orderBy("createdAt", "desc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const todosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(setTodos(todosData));
      });
      return () => unsubscribe();
    }
  }, [user, dispatch]);

  const handleAddTodo = useCallback(
    async (e) => {
      e.preventDefault();
      if (newTodo.trim() === "" || isSubmitting) return;

      if (todos.some((todo) => todo.text.toLowerCase() === newTodo.trim().toLowerCase())) {
        toast.warn("This todo already exists!");
        return;
      }

      setIsSubmitting(true);

      try {
        await addDoc(collection(db, `users/${user.uid}/todos`), {
          text: newTodo.trim(),
          status: "Not Started",
          createdAt: new Date(),
        });
        setNewTodo("");
        toast.success("Todo added successfully!");
      } catch (error) {
        console.error("Error adding todo:", error);
        toast.error("Failed to add todo");
      } finally {
        setIsSubmitting(false);
      }
    },
    [newTodo, isSubmitting, todos, user]
  );

  const handleUpdateTodoStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, `users/${user.uid}/todos`, id), {
        status: newStatus,
      });
      dispatch(updateTodo({ id, status: newStatus }));
      toast.success("Todo status updated successfully!");
    } catch (error) {
      console.error("Error updating todo status:", error);
      toast.error("Failed to update todo status");
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, `users/${user.uid}/todos`, id));
      dispatch(deleteTodo(id));
      toast.success("Todo deleted successfully!");
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Failed to delete todo");
    }
  };

  const handleUpdateTodoText = async (id, newText) => {
    if (newText.trim() === "") {
      toast.error("Todo text cannot be empty");
      return;
    }

    if (todos.some((todo) => todo.id !== id && todo.text.toLowerCase() === newText.trim().toLowerCase())) {
      toast.warn("This todo already exists!");
      return;
    }

    try {
      await updateDoc(doc(db, `users/${user.uid}/todos`, id), {
        text: newText.trim(),
      });
      dispatch(updateTodo({ id, text: newText.trim() }));
      setEditingTodo(null);
      setEditText("");
      toast.success("Todo updated successfully!");
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Failed to update todo");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Complete":
        return "bg-green-200 text-green-800";
      case "Pending":
        return "bg-yellow-200 text-yellow-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <form
        onSubmit={handleAddTodo}
        className="mb-8 flex flex-col sm:flex-row gap-2"
      >
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Todo"}
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {todos.map((todo) => (
          <div key={todo.id} className="bg-white p-4 rounded-lg shadow-md">
            {editingTodo === todo.id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => handleUpdateTodoText(todo.id, editText)}
                className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            ) : (
              <p className="mb-4 break-words">{todo.text}</p>
            )}
            <div className="flex justify-between items-center mb-4">
              <span
                className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                  todo.status
                )}`}
              >
                {todo.status}
              </span>
              <select
                value={todo.status}
                onChange={(e) => handleUpdateTodoStatus(todo.id, e.target.value)}
                className="p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Not Started">Not Started</option>
                <option value="Pending">Pending</option>
                <option value="Complete">Complete</option>
              </select>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setEditingTodo(todo.id);
                  setEditText(todo.text);
                }}
                className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
