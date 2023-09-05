import Hero from './components/Hero';

const App = () => (
    <>
        <header className="bg-white fixed w-full z-10 top-0">
            <div className="flex justify-between px-4 py-6 max-w-[1440px] mx-auto md:px-10">
                <p className="uppercase font-bold">London</p>
                <p className="uppercase font-bold before:content-['16.08.24'] md:before:content-['16_august_2024']" />
            </div>
        </header>
        <main className="mt-[72px] px-4 md:px-10">
            <Hero />
        </main>
    </>
);

export default App;
