
"use client";
import Link from 'next/link';
import { FaFileInvoice, FaHome, FaUsers } from 'react-icons/fa';
import {usePathname} from 'next/navigation';
import { twMerge } from 'tailwind-merge';

const links=[
    {
        name:"Dashboard",
        icon:<FaHome className='w-6'/>,
        href:"/dashboard"
    },
    {
        name:"Invoices",
        icon:<FaFileInvoice className='w-6'/>,
        href:"/dashboard/invoices"
    },
    {
        name:"Users",
        icon:<FaUsers className='w-6'/>,
        href:"/dashboard/customers"
    }

];
const NavLinks = () => {
    const pathname = usePathname();
    return (
        <>
            {links.map(x=>{
                    return (
                    <Link
                        key={x.name}
                       href={x.href} className={twMerge('flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-slate-700 p-3 text-lg text-white font-bold hover:bg-slate-400 hover:text-white md:flex-none md:justify-start md:p.2 md:px-3', pathname===x.href && 'bg-slate-500')}>
                        {x.icon}
                        <p className='hidden md:block'>{x.name}</p>
                        
                    </Link>
                    )
                })}
                
        </>
    );
};

export default NavLinks;