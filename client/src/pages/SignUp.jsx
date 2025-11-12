import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {

  // State for managing form data, errors and loading status
  const [formData, setFormData] = useState ({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); // Navigate to sign in page after registration
  const API_URL = import.meta.env.VITE_API_URL || '';

  // Handle changes in form field and update form data
  const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
  };

  // Hanlde form submition, make API request, and handle response/errors
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        console.log(data);
        if(data.success === false) {
          setLoading(false);
          setError(data.message);
          return;
        }
        setLoading(false);
        setError(null);
        navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
   
  };
 
  return (
    <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg lg:max-w-4xl">
    {/* Image next to sign up only for big screens */}
    <div
      className="hidden bg-cover lg:block lg:w-1/2"
       style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1721294104781-4f00f6ffef99?q=80&w=2786&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
     ></div>

    <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
      <div className="flex justify-center mx-auto">
        <img className="w-auto h-7 sm:h-8" src="https://logowik.com/content/uploads/images/geometric-buildings5691.logowik.com.webp" alt="Logo" />
      </div>

      <p className="mt-3 text-xl text-center text-gray-600">
        Sign up in seconds
      </p>

      {/* Form to sign up with functionality on change and submit */}
      <form className="mt-4" onSubmit={handleSubmit}>
        {/* Button to sign in with Google and SVG for Google logo */}
        <OAuth/>

        <div className="flex items-center justify-between mt-4 pb-4">
          <span className="w-1/5 border-b lg:w-1/4"></span>

          <label className="text-xs text-center text-gray-500 uppercase">
            or sign up with email
          </label>

          <span className="w-1/5 border-b lg:w-1/4"></span>
        </div>

        {/* Username Input */}
        <label className="block mb-2 text-sm font-medium text-gray-600">
          Username
        </label>
        <input
          id="username"
          className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
          type="text" 
          onChange={handleChange}
        />

        {/* Email Input */}
        <label className="block mb-2 text-sm font-medium text-gray-600 pt-2">
          Email Address
        </label>
        <input
          id="email"
          className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
          type="email" 
          onChange={handleChange}
        />

        {/* Password Input */}
        <label className="block mb-2 text-sm font-medium text-gray-600 pt-2">
          Password
        </label>
        <input
          id="password"
          className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
          type="password" 
          onChange={handleChange}
        />

        <div className="mt-6">
          <button disabled={loading} className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
            {loading ? 'Loading...' : 'Sign Up'} {/* Change text when loading */}
          </button>
        </div>
      </form>

      <div className="flex items-center justify-between mt-4">
        <span className="w-1/5 border-b md:w-1/4"></span>

        <Link to="/sign-in" className="text-xs text-gray-500 uppercase hover:underline">
            or sign in
        </Link>

        <span className="w-1/5 border-b md:w-1/4"></span>
      </div>
      {/* Text to show error to user */}
      {error && <p className='text-red-500 - mt-5'>{error}</p>} 
    </div>
  </div>
  );
}
