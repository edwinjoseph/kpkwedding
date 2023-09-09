export interface LocationCardProps {
    image: string;
    title: string;
    name: string;
    address: Array<string>;
    url: string;
}

const LocationCard = ({ image, title, name, address, url }: LocationCardProps) => (
    <div class="bg-white w-full max-w-[488px]">
        <div class="relative aspect-[343/160] md:aspect-[488/255] overflow-hidden">
            <img src={image} alt={`Image of ${name}`} class="absolute w-auto h-full top-0 left-1/2 -translate-x-1/2" loading="lazy" />
        </div>
        <div class="px-4 py-6 md:pt-10 md:pb-8">
            <h2 class="uppercase text-pink mb-4 text-xs font-bold text-center tracking-[3px] md:text-base md:tracking-[4px]">{title}</h2>
            <h3 class="font-heading mb-4 text-2xl font-black text-center md:text-[32px]">{name}</h3>
            <div class="mb-4 md:mb-6">
                {address.map(addressLine => (
                    <p class="text-center text-[#555]">{addressLine}</p>
                ))}
            </div>
            <button
                class="px-4 py-3 border-2 text-sm tracking-[2.8px] font-bold text-pink border-pink uppercase mx-auto block"
                onClick={() => {
                    if (url) {
                        window.open(url)
                    }
                }}>
                Get directions
            </button>
        </div>
    </div>
)

export default LocationCard;