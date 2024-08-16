import React from 'react';
import { usePinData } from '../context/PinContext.jsx';
import PinCard from '../components/PinCard.jsx';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserData } from '../context/UserContext.jsx'; // Ensure this is the correct import
import axios from 'axios'; // Import axios

const Account = ({ user }) => {
    const { pins } = usePinData();

    // Filter pins for the current user
    const userPins = pins ? pins.filter((pin) => pin.owner === user._id) : [];

    const navigate = useNavigate();
    const { setIsAuth, setUser } = UserData(); // Use the hook correctly

    const logoutHandler = async () => {
        try {
            const { data } = await axios.get("/api/user/logout");
            toast.success(data.message);
            setIsAuth(false);
            setUser(null); // Clear user data
            navigate("/login");
        } catch (error) {
            toast.error(error.response.data.message || "Logout failed");
        }
    };

    return (
        <div>
            <div className='flex flex-col items-center justify-center'>
                <div className='p-6 w-full'>
                    <div className='flex items-center justify-center'>
                        <div className='w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center'>
                            <span className='text-3xl text-gray-700'>{user.name.slice(0, 1)}</span>
                        </div>
                    </div>
                    <h1 className='text-center text-2xl font-bold mt-4'>{user.name}</h1>
                    <p className='text-center text-gray-600 mt-2'>{user.email}</p>
                    <div className='flex justify-center mt-4 space-x-2'>
                        <button onClick={logoutHandler} className='bg-gray-200 px-4 py-2 rounded'>Logout</button>
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
        </div>
    );
};

export default Account;
