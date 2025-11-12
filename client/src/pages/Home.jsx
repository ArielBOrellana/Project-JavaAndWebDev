import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [saleListings, setSaleListings] = useState([]); // Holds recent sale listings fetched from the API
  const [rentListings, setRentListings] = useState([]); // Holds recent rental listings fetched from the API
  const API_URL = import.meta.env.VITE_API_URL || ''; // Define API URL
  console.log(saleListings); // Debugging: Logs the fetched sale listings to the console

  {/* Functions for fetching listings for sale and rent */}
  useEffect(() => {
    const fetchRentListings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/listing/get?type=rent&limit=4`); // Fetches up to 4 rental listings
        const data = await res.json();
        setRentListings(data); // Updates the state with rental listings
        fetchSaleListings(); // Fetches sale listings after rent listings are fetched
      } catch (error) {
        console.log(error); // Logs any errors encountered during the fetch
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/listing/get?type=sell&limit=4`); // Fetches up to 4 sale listings
        const data = await res.json();
        setSaleListings(data); // Updates the state with sale listings
      } catch (error) {
        console.log(error); // Logs any errors encountered during the fetch
      }
    }

    fetchRentListings(); // Initiates the process of fetching rent and sale listings
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <div className=''>
      {/* Top section: Hero image with title */}
      <div className="relative w-full h-[400px] sm:h-[450px] border shadow-lg">
        <img 
          src='/images/BackgroundPic.png' // Path to the hero background image
          alt="Background"
          className='w-full h-full object-cover' // Ensures the image covers the entire container
        />
        <h1 className="absolute top-14 left-10 sm:top-1/4 sm:left-16 transform text-white text-3xl lg:text-6xl font-bold">
          Real estate
          <br/>
          for you
        </h1>
      </div>

      {/* Main content section */}
      <div className='flex flex-col max-w-7xl mx-auto p-3 gap-8 my-10'>

        {/* Section for recent sale listings */}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold'>Recent listings for sale</h2>
              <Link 
                className='text-sm text-green-light hover:underline'
                to={'/search?type=sell'} // Navigates to the search page with a filter for sale listings
              >
                Show more listings for sale
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id}/> // Maps each sale listing to a ListingItem component
              ))}
            </div>
          </div>
        )}

        {/* Section for recent rental listings */}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold'>Recent listings for rent</h2>
              <Link 
                className='text-sm text-green-light hover:underline'
                to={'/search?type=rent'} // Navigates to the search page with a filter for rental listings
              >
                Show more listings for rent
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id}/> // Maps each rental listing to a ListingItem component
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

