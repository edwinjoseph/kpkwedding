import type { Component } from 'solid-js';

const App: Component = () => (
    <>
        <header className="bg-white fixed w-full z-10">
            <div className="flex justify-between px-4 py-6 max-w-[1440px] mx-auto md:px-10">
                <p className="uppercase font-bold">London</p>
                <p className="uppercase font-bold before:content-['16.08.24'] md:before:content-['16_august_2024']" />
            </div>
        </header>
        <main className="flex flex-col justify-center min-h-[100svh] p-4">
            <h1 className="font-heading my-[30px] text-[64px] leading-[64px] text-center md:text-[120px] md:leading-[120px] relative z-20">Kezia & James</h1>
            <h2 className="uppercase text-2xl text-center font-bold">The wedding - Coming soon</h2>
        </main>
    </>
);

export default App;
