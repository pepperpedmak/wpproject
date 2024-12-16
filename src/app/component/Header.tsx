import React from 'react';
import Link from 'next/link';

export default function Header(){
    return(
        <header className="bg-blue-400 w-auto h-16 shadow-md p-2">
          <Link href="/" className='text-white text-4xl font-bold pl-5'>Poo ject</Link>
        </header>
    );
}