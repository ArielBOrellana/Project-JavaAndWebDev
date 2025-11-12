import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking
} from 'react-icons/fa'
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation]); // Enable Swiper navigation functionality

  const [listing, setListing] = useState(null); // Stores the fetched listing data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const API_URL = import.meta.env.VITE_API_URL || ''; // Define API URL

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/listing/get/${params.listingId}`); // API call to get a specific listing by ID
        const data = await res.json();
        if (data.success === false) { // Handle case where the API returns an error flag
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data); // Populate listing data on success
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true); // Handle network or other fetch-related errors
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]); // Refetch when the listing ID changes

  return (
    <div className="bg-white rounded-lg m-2">
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && <p className="text-center my-7 text-2xl">Something went wrong!</p>}

      {listing && !loading && !error && (
        <div className="p-5">
          <Swiper
            className="relative w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl rounded-lg overflow-hidden"
            modules={[Navigation]}
            navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }} // Navigation buttons
            preventInteractionOnTransition={true}
          >
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div className="flex justify-center items-center px-2">
                  <img className="-auto w-full sm:w-[80%] md:w-[90%] lg:w-[95%] xl:w-full max-w-4xl rounded-lg" src={url} alt="Listing" /> {/* Display listing images */}
                </div>
              </SwiperSlide>
            ))}
            {/* Custom Swiper navigation buttons */}
            <div className="swiper-button-next absolute items-center transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-lg p-2 hover:bg-opacity-70 z-10"></div>
            <div className="swiper-button-prev absolute items-center transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-lg p-2 hover:bg-opacity-70 z-10"></div>
          </Swiper>

          <div className="flex flex-col max-w-4xl mx-auto p-3 my-2 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${listing.price.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <hr />
            <p className="flex items-center mt-3 gap-2 text-slate-600 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address} {/* Show the address */}
            </p>

            <div>
              <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'} {/* Label for rent or sale */}
              </p>
            </div>
            <hr />
            <p className="text-gray-600">{listing.description}</p> {/* Show the description */}

            <ul className="flex flex-wrap items-center gap-4 sm:gap-6 text-green-900 font-semibold text-sm">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaChair className="text-lg" />
                {listing.furnished ? 'Furnished' : 'Not Furnished'}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking className="text-lg" />
                {listing.parking ? 'Parking' : 'No Parking'}
              </li>
            </ul>

            {currentUser && listing.userRef !== currentUser._id && (
              <Contact listing={listing} /> // Show contact form if the logged-in user is not the owner
            )}
          </div>
        </div>
      )}
    </div>
  );
}
