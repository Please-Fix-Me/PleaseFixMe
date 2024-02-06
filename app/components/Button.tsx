import React, { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children }) => {
    return (
        <button className="bg-white text-black py-2 px-4 rounded hover:bg-gray-200 cursor-pointer">
            {children}
        </button>
    );
};

export default Button;