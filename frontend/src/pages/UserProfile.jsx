import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Make sure you have axios imported
import { usePinData } from '../context/PinContext';
import PinCard from '../components/PinCard';
import { UserData } from '../context/UserContext';

const UserProfile = ({ user: loggedInUser }) => {
    const params = useParams();
    const [user, setUser] = useState(null);  // Initialize with null
    const [isFollow, setIsFollow] = useState(false);

    const { followUser } = UserData();

    // Fetch user data
    async function fetchUser() {
        try {
            const { data } = await axios.get(`/api/user/${params.id}`);
            setUser(data);
        } catch (error) {
            console.log(error);
        }
    };

    // Toggle follow state
    const followHandler = () => {
        setIsFollow(!isFollow);
        followUser(user._id, fetchUser);
    };

    useEffect(() => {
        if (user && user.followers && loggedInUser) {
            if (user.followers.includes(loggedInUser._id)) {
                setIsFollow(true);
            }
        }
    }, [user, loggedInUser]);

    const { pins } = usePinData();

    // Filter pins for the current user, checking if user is not null
    const userPins = user ? (pins ? pins.filter((pin) => pin.owner === user._id) : []) : [];

    useEffect(() => {
        fetchUser();
    }, [params.id]);

    if (!user) {
        return <div>Loading...</div>;  // Display a loading message while fetching data
    }

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='p-6 w-full'>
                <div className='flex items-center justify-center'>
                    <div className='w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center'>
                        <span className='text-3xl text-gray-700'>{user.name ? user.name.slice(0, 1) : ''}</span>
                    </div>
                </div>
                <h1 className='text-center text-2xl font-bold mt-4'>{user.name}</h1>
                <p className='text-center text-gray-600 mt-2'>{user.email}</p>
                <div className='flex justify-center items-center text-center gap-3 text-gray-600 mt-2'>
                    {user.followers && <p>{user.followers.length} followers</p>}
                    {user.following && <p>{user.following.length} following</p>}
                </div>
                <div className='flex justify-center mt-4 space-x-2'>
                    <button onClick={followHandler} className='bg-gray-200 px-4 py-2 rounded'>
                        {isFollow ? "Unfollow" : "Follow"}
                    </button>
                </div>
                <div className='mt-4 flex flex-wrap justify-center gap-4'>
                    {userPins.length > 0 ? (
                        userPins.map((pin) => (
                            <PinCard key={pin._id} pin={pin} />
                        ))
                    ) : (
                        <p>No pins yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
