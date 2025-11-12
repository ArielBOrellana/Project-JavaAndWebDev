import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});  {/* State to manage form data */}
  const { loading, error } = useSelector((state) => state.user);  {/* Access loading and error state from Redux */}
  const navigate = useNavigate(); {/* Navigate to home page after successful sign in */}
  const dispatch = useDispatch(); {/* Dispatch actions to update Redux state */}
  const API_URL = import.meta.env.VITE_API_URL || '';

  {/* Handle changes in form fields */}
  const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
  };

  {/* Handle form submission with error checking and dispatching actions */}
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());  {/* Dispatch sign in start action */}
      const res = await fetch(`${API_URL}/api/auth/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),  // Send form data as request body
        });
        const data = await res.json();
        console.log(data);
        if(data.success === false) {
          dispatch(signInFailure(data.message));  {/* Dispatch failure action if sign in fails */}
          return;
        }
        
        dispatch(signInSuccess(data));  {/* Dispatch success action and save data */}
        navigate('/');  {/* Navigate to home page */}
    } catch (error) {
      dispatch(signInFailure(error.message));  // Dispatch failure action if error occurs
    }
  };

  return (
    <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg lg:max-w-4xl">
      {/* Image section for larger screens */}
      <div
        className="hidden bg-cover lg:block lg:w-1/2"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1721294104781-4f00f6ffef99?q=80&w=2786&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      ></div>

      <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
        {/* Logo section */}
        <div className="flex justify-center mx-auto">
          <img className="w-auto h-7 sm:h-8" src="https://logowik.com/content/uploads/images/geometric-buildings5691.logowik.com.webp" alt="Logo" />
        </div>

        <p className="mt-3 text-xl text-center text-gray-600">
          Welcome back!
        </p>

        <form className="mt-4" onSubmit={handleSubmit}>

          {/* Google authentication button */}
          <OAuth/>

          {/* Divider and text for email login */}
          <div className="flex items-center justify-between mt-4 pb-4">
            <span className="w-1/5 border-b lg:w-1/4"></span>
            <label className="text-xs text-center text-gray-500 uppercase">
              or login with email
            </label>
            <span className="w-1/5 border-b lg:w-1/4"></span>
          </div>

          {/* Email input field */}
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Email Address
          </label>
          <input
            id="email"
            className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
            type="email"
            onChange={handleChange}  // Call handleChange to update formData
          />

          {/* Password input field */}
          <label className="block mb-2 text-sm font-medium text-gray-600 pt-2">
            Password
          </label>
          <input
            id="password"
            className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
            type="password"
            onChange={handleChange}  // Call handleChange to update formData
          />

          {/* Sign in button */}
          <div className="mt-6">
            <button disabled={loading} className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
              {loading ? 'Loading...' : 'Sign In'} {/* Change text when loading */}
            </button>
          </div>
        </form>

        {/* Link to sign-up page */}
        <div className="flex items-center justify-between mt-4">
          <span className="w-1/5 border-b md:w-1/4"></span>
          <Link to="/sign-up" className="text-xs text-gray-500 uppercase hover:underline">
            or sign up
          </Link>
          <span className="w-1/5 border-b md:w-1/4"></span>
        </div>

        {/* Display error message if any */}
        {error && <p className='text-red-500 mt-5'>{error}</p>}
      </div>
    </div>
  )
}
