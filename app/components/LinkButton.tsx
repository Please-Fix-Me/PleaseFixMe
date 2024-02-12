import React, { ReactNode } from 'react';
import Link from 'next/link';

interface ButtonProps {
    children: ReactNode;
    href: string;
}

const Button: React.FC<ButtonProps> = ({ children, href }) => {
    return (
        <Link href={href}>
            <button className="bg-white text-black py-1 px-3 rounded hover:bg-gray-200 cursor-pointer">
                {children}
            </button>
        </Link>
    );
};

export default Button;