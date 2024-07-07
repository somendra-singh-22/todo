import React from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';

const Login = () => {
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      dispatch(setUser(result.user));
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button onClick={handleLogin} className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg">
        Login with Google
      </button>
    </div>
  );
};

export default Login;