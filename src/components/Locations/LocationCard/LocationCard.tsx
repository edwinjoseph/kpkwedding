export interface LocationCardProps {
    image: string;
    title: string;
    name: string;
    address: Array<string>;
    url: string;
}

const LocationCard = ({ image, title, name, address, url }: LocationCardProps) => (
    <div class="w-full max-w-[488px] bg-white">
        <div class="relative aspect-[343/160] overflow-hidden md:aspect-[488/255]">
            <img src={image} alt={`Image of ${name}`} class="absolute left-1/2 top-0 -translate-x-1/2 object-cover" loading="lazy" />
        </div>
        <div class="px-4 py-6 md:pb-8 md:pt-10">
            <h2 class="mb-4 text-center text-xs font-bold uppercase tracking-[3px] text-pink md:text-base md:tracking-[4px]">{title}</h2>
            <h3 class="mb-4 text-center font-heading text-2xl font-black md:text-[32px]">{name}</h3>
            <div class="mb-4 md:mb-6">
                {address.map(addressLine => (
                    <p class="text-center text-[#555]">{addressLine}</p>
                ))}
            </div>
            <button
                class="mx-auto block border-2 border-pink px-4 py-3 text-sm font-bold uppercase tracking-[2.8px] text-pink"
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