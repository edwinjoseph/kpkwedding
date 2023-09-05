const LearnMoreIcon = (props) => {
    const text = 'Scroll to learn more';
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
            <g className="animate-spin-slow origin-center">
                <text>
                    <textPath
                        href="#circlePath"
                        textLength={Math.floor(Math.PI * 90 - text.length)}
                        font-family="Montserrat"
                        font-size="16"
                        font-weight="bold"
                        className="uppercase"
                        fill="#555555">
                        {text}
                    </textPath>
                </text>
            </g>
            <path d="M74.5 57L60 72L45.5 57" stroke="black" stroke-width="4"/>
            <rect x="58.5" y="45.5" width="3" height="25" fill="black" stroke="black"/>
        </svg>
    )
}

export default LearnMoreIcon;
