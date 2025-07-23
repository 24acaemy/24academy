import React from 'react';
import { CircleLoader } from 'react-spinners';

const CustomLoader = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div
                className="relative flex justify-center items-center"
                style={{ width: '100px', height: '100px' }}
            >
                {/* CircleLoader from react-spinners */}
                <CircleLoader color="#ffffff" size={100} />

                {/* Spinning Logo with custom rotateY animation */}
                <div className="absolute inset-0 animate-spin-y">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                </div>
            </div>
        </div>
    );
};

export default CustomLoader;
