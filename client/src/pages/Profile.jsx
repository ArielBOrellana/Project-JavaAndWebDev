import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Profile() {
  const {currentUser} = useSelector((state) => state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || '';  // Get the API URL (Render URL)

  {/* onClick function for deleting user with dispatch and navigate */}
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${API_URL}/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      navigate('/sign-in');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  {/* onClick function for signing out user with dispatch and navigate */}
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`${API_URL}/api/auth/signout`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      navigate('sign-in');
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  }

  {/* Function to show the users listings */}
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);

      // Get the token from Local Storage (persists session)
        const token = localStorage.getItem('jwt_token'); 
        
        // Authorization Check (for token existence)
        if (!token) {
            console.error('Authentication token is missing.');
            setShowListingsError(true);
            // Optionally, dispatch a sign-out/redirect here if no token is found
            return;
        }

      // Prepare the request with the Authorization header
      const res = await fetch(`${API_URL}/api/user/listings/${currentUser._id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
                // Send the token in the Authorization header
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json',
            },
      });
      const data = await res.json();
      if (data.success === false){
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  }

  {/* Function to delete user listing */}
  const handleDeleteListing = async (listingID) => {
    try {
      const res = await fetch(`${API_URL}/api/listing/delete/${listingID}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();

      if (data.success === false){
        console.log(data.message);
        return;
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== listingID));
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
  <div className="flex flex-col md:flex-row md:max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-3">
    {/* Left Section*/}
    <div className="bg-beige-light p-6 flex flex-col items-center justify-start text-center text-white md:w-1/3 rounded-lg">
      <img src={currentUser.avatar} alt="https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
      className="w-24 h-24 rounded-full border-2 border-black"/>
      <h2 className="text-2xl font-bold mt-4 text-black">Profile</h2>
    </div>
    {/* Right Section*/}
    <div className="p-6 md:w-2/3">
      <h3 className="text-xl font-semibold mb-4">Information</h3>
      <div className="mb-4">
        <h4 className="text-md font-medium">Username</h4>
        <p className="text-gray-600">{currentUser.username.slice(0, -4)}</p>

        <h4 className="text-md font-medium pt-7">Email</h4>
        <p className="text-gray-600 pb-5">{currentUser.email}</p>
      </div>
      <hr className='pb-4'></hr>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 pb-4">
        <button onClick={handleSignOut} className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
          sign out
        </button>

        <button onClick={handleDeleteUser} className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-500 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
          delete account
        </button>
      </div>
      <Link to='/create-listing'>
        <button className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-dark rounded-lg hover:opacity-95 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
          create listing
        </button>
      </Link> 

      {/* If user has listings, they are shown here */}
      <button onClick={handleShowListings} className='w-full pt-3'>Show listings</button>
      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Error showing listing' : ''}
      </p>

      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-3'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='flex-1 text-gray-600 font-semibold hover:underline truncate'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleDeleteListing(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>);
}