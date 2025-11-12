import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Contact({ listing }) {
    const [landlord, setLandlord] = useState(null);  // State to store landlord details fetched from the API
    const API_URL = import.meta.env.VITE_API_URL || '';

    /*
     * Fetch landlord data using the user reference from the listing.
     * This allows easy access to the landlord's email for contacting.
     */
    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                // Fetching landlord data from the backend API
                const res = await fetch(`${API_URL}/api/user/${listing.userRef}`);
                const data = await res.json();
                setLandlord(data); // Store the fetched data in state
            } catch (error) {
                console.log(error); // Log any errors that occur during the fetch
            }
        };
        fetchLandlord();
    }, [listing.userRef]); // Dependency array ensures the effect runs when userRef changes

    /*
     * Render a button that opens the user's email client to contact the landlord.
     * The `mailto` link is dynamically constructed using the landlord's email and listing name.
     * If landlord data is not yet available, the link is disabled.
     */
    return (
        <div className='flex'>
            <Link
                to={landlord ? `mailto:${landlord.email}?subject=Regarding ${listing.name}` : '#'} // Construct email link with subject
                className='w-full px-6 py-3 mt-3 text-sm font-medium tracking-wide text-white uppercase transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50 text-center'
            >
                Contact landlord
            </Link>
        </div>
    );
}
