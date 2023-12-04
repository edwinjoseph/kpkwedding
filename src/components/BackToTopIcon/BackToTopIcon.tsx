import { JSX } from 'solid-js';

export interface BackToTopIconProps extends JSX.DOMAttributes<SVGSVGElement> {
    class?: string;
}

const BackToTopIcon = (props: BackToTopIconProps) => {
    const text = 'Back to top';
    return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                id="circlePath"
                d="
              M 15, 60
              a 35,35 0 1,1 90,0
              35,35 0 1,1 -90,0
            "
            />
            <g class="origin-center motion-safe:animate-spin-slow">
                {[...new Array(2)].map((_, index) => (
                    <text textLength={Math.floor(Math.PI * 45 - text.length)}>
                        <textPath
                            href="#circlePath"
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            textLength={Math.floor(Math.PI * 45 - text.length)}
                            startOffset={Math.floor(Math.PI * 45) * index + 15}
                            font-family="Montserrat"
                            font-size="16"
                            font-weight="bold"
                            class="uppercase"
                            fill="#555555">
                            {text}
                        </textPath>
                    </text>
                ))}
            </g>
            <path d="M74.5 60L60 75L45.5 60" stroke="black" transform="rotate(180 60 60)" stroke-width="4"/>
            <rect x="58.5" y="48" width="3" height="25" fill="black" stroke="black"/>
        </svg>
    );
}

export default BackToTopIcon;
