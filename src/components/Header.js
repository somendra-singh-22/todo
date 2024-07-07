import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from '../firebase';
import { clearUser } from '../store/authSlice';

const Header = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    auth.signOut();
    dispatch(clearUser());
  };

  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Todo App</h1>
        {user && (
          <div className="flex items-center">
            <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
            <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;