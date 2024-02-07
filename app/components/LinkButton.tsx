import React, { ReactNode } from 'react';
import Link from 'next/link';

interface ButtonProps {
    children: ReactNode;
    href: string;
}

const Button: React.FC<ButtonProps> = ({ children, href }) => {
    return (
        <Link href={href}>
            <button className="bg-white text-black py-2 px-4 rounded hover:bg-gray-200 cursor-pointer">
                {children}
            </button>
        </Link>
    );
};

export default Button;