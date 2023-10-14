import { onMount, onCleanup } from 'solid-js';
import LearnMoreIcon from '../LearnMoreIcon';
import Section from '../Section';
import Title from './Title.svg';
import TitleMobile from './TitleMobile.svg';

function fixedRange(min: number, max: number) {
    return function (val: number) {
        return Math.min(max, Math.max(min, val));
    }
}

function normalize(min: number, max: number) {
    const delta = max - min;
    return function (val: number) {
        return fixedRange(0, 1)((val - min) / delta);
    };
}

function createSettings() {
    const titleEl = document.getElementById('hero-title');
    const subtitleEl = document.getElementById('hero-subtitle');

    if (!titleEl || !subtitleEl) {
        return null;
    }

    const paths = Array.from(titleEl.querySelectorAll('path'));
    const currentWindowWidth = window.innerWidth;
    const currentPosition = window.scrollY;
    const isMediaMD = currentWindowWidth > 767;

    titleEl.setAttribute('style', '');
    subtitleEl.setAttribute('style', '');

    for (const path of paths) {
        path.setAttribute('style', '');
    }

    const titleTop = titleEl.getBoundingClientRect().top;
    const titleBottom = titleEl.getBoundingClientRect().bottom;
    
    return {
        title: {
            ref: titleEl,
            paths: paths,
            getInitialBoundingRect: () => {
                return {
                    top: titleTop + currentPosition,
                    bottom: titleBottom - currentPosition,
                }
            },
            animation: {
                fixedPosition: isMediaMD ? 18 : 12,
                width: {
                    max: isMediaMD ? 800 : 400,
                    min: isMediaMD ? 300 : 140,
                },
            }
        },
        subtitle: {
            ref: subtitleEl,
        },
        reset: () => {
            titleEl.setAttribute('style', '');
            subtitleEl.setAttribute('style', '');

            for (const path of paths) {
                path.setAttribute('style', '');
            }
        }
    }
}

const Hero = () => {
    onMount(() => {
        let settings = createSettings();

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        mediaQuery.addEventListener('change', () => {
            if (mediaQuery.matches && settings) {
                settings.reset();
            }
        });

        const handleTitleAnimation = () => {
            if (!settings) {
                return;
            }

            const initialTitlePosition = settings.title.getInitialBoundingRect().top + settings.title.ref.getBoundingClientRect().height;
            const scrollTitleTop = fixedRange(0, initialTitlePosition)(window.scrollY);
            const scrollTitleTopPercentage = normalize(0, initialTitlePosition)(window.scrollY) * 100;

            if (scrollTitleTopPercentage < 25) {
                settings.title.ref.style.maxWidth = `${settings.title.animation.width.max}px`;
            }

            if (scrollTitleTopPercentage >= 25) {
                const titleAnimationScale = normalize(initialTitlePosition / 4, initialTitlePosition - settings.title.animation.fixedPosition)(scrollTitleTop) * 100;
                const subtitleAnimationScale = normalize(25, 80)(titleAnimationScale) * 100;
                const isTitleAnimationComplete = titleAnimationScale === 100;
                const width = ((100 - titleAnimationScale) / 100) * (settings.title.animation.width.max - settings.title.animation.width.min) + settings.title.animation.width.min;

                settings.title.ref.style.maxWidth = `${width}px`;
                settings.title.ref.style.position = isTitleAnimationComplete ? 'fixed' : 'static';
                settings.title.ref.style.top = isTitleAnimationComplete ? `${settings.title.animation.fixedPosition}px` : 'initial';
                settings.title.ref.style.left = isTitleAnimationComplete ? '50%' : 'initial';
                settings.title.ref.style.transform = isTitleAnimationComplete ? 'translateX(-50%)' : 'none';

                for (const path of settings.title.paths) {
                    path.style.fill = scrollTitleTop < (initialTitlePosition - (settings.title.ref.getBoundingClientRect().height * 1.5)) ? '#FFF' : '#000';
                }

                settings.subtitle.ref.style.opacity = `${((100 - subtitleAnimationScale) / 100)}`;
            }
        }


        handleTitleAnimation();


        window.addEventListener('scroll', handleTitleAnimation);
        window.addEventListener('resize', () => {
            setTimeout(() => {
                settings = createSettings();
                handleTitleAnimation();
            }, 10)
        })

        onCleanup(() => {
            window.removeEventListener('scroll', handleTitleAnimation);
            window.removeEventListener('resize', () => {
                setTimeout(() => {
                    settings = createSettings();
                    handleTitleAnimation();
                }, 10)
            })
        })
    });

    return (
        <Section class="mt-0 md:mt-0">
            <Section.Container>
                <div class={`mx-auto flex aspect-[343/540] max-w-[1369px] flex-col justify-center bg-[url('/assets/hero-mobile.jpg')] bg-cover bg-top md:aspect-[377/505] md:bg-[url('/assets/hero-tablet.jpg')] lg:aspect-[413/234] lg:bg-[url('/assets/hero.jpg')]`}>
                    <div id="hero-title" class="z-20 px-6 mb-6 w-full transition-[top] ease-in-out delay-150 max-w-[400px] mx-auto md:mb-4 md:max-w-[802px]">
                        {/* @ts-ignore */}
                        <Title class="hidden md:block" />
                        {/* @ts-ignore */}
                        <TitleMobile class="block md:hidden" />
                    </div>
                    <h2 id="hero-subtitle" class="text-center text-lg font-bold uppercase tracking-[4px] text-white md:text-2xl">The wedding</h2>
                </div>
                <LearnMoreIcon class="z-20 mx-auto mt-[-30px]" />
            </Section.Container>
        </Section>
    )
}

export default Hero