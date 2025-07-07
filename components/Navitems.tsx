'use client';   
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '../lib/utils'

const navItemsData = [
    {label:'Home', href:'/'},
    {label:'Companions', href:'/Companions'},
    {label:'My journey', href:'my-journey'},
] 

const Navitems = () => {
    const pathname = usePathname();

  return (
    <nav className='flex items-center gap-4'>
        {navItemsData.map(({label, href}) => (
            <Link 
                href={href} 
                key={label} 
                className={cn(pathname === href && 'text-primary font-semibold')}
            >
                {label}
            </Link>
        ))}
    </nav>
  )
}

export default Navitems