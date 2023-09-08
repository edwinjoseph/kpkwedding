import Hero from './components/Hero';
import Agenda from './components/Agenda';
import Locations from './components/Locations';
import Gallery from './components/Gallery';
import FAQs from './components/FAQs';
import Final from './components/Final';

const App = () => (
    <>
        <header className="bg-white fixed w-full z-10 top-0">
            <div className="flex justify-between px-4 py-6 max-w-[1440px] mx-auto md:px-10">
                <p className="uppercase font-bold tracking-[3px] md:tracking-[4px]">London</p>
                <p className="uppercase font-bold tracking-[3px] md:tracking-[4px] before:content-['16.08.24'] md:before:content-['16_august_2024']" />
            </div>
        </header>
        <main className="mt-[72px]">
            <Hero />
            <Agenda />
            <Locations />
            <Gallery />
            <FAQs />
            <Final />
        </main>
    </>
);

export default App;
