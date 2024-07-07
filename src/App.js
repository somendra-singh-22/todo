import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from './firebase';
import { setUser } from './store/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Login from './components/Login';
import TodoList from './components/TodoList';

function App() {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(setUser(null));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer />
      <Header />
      {user ? <TodoList /> : <Login />}
    </div>
  );
}

export default App;