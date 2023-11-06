import { createSignal, For } from 'solid-js';
import Section from '../Section';
import FAQItem from './FAQItem';

const FAQs = () => {
    const [activeAccordion, setActiveAccordion] = createSignal<string | null>(null);
    const questions = [
        {
            title: 'Why are you getting married in an Asylum?',
            content: [
                'Not actually a psychiatric facility, the Asylum Chapel was established in 1827 as one of London’s largest almshouses. Long before the introduction of social housing, almshouses were charitable housing where residents were entitled to a small weekly cash payment & medical care.',
                'The Asylum Chapel provided a safe home for elderly, retired pub landlords, reflected in the name ‘asylum’ which traditionally meant ‘sanctuary’.'
            ]
        },
        {
            title: 'When should I RSVP by?',
            content: [
                'To help with our planning please RSVP by May 1, 2024'
            ]
        },
        {
            title: 'Is there a dress code?',
            content: ['Yes, the dress code is summer formal. That outfit you’ve been looking for an occasion to wear? This is the occasion. No jeans please!']
        },
        {
            title: 'Can I bring my children?',
            content: [
                'We love your little ones as much as you do! However we are only able to accommodate the children of immediate family and hope you can enjoy a date night on us.'
            ]
        },
        {
            title: 'Will Jackson be there?',
            content: ["We couldn't get married without him! Jackson will be there at the ceremony to give everyone a high-five, fist bump or handshake."]
        },
        {
            title: 'Will there be an open bar?',
            content: ['Sadly not but don’t worry the drinks will be flowing ']
        },
        {
            title: 'Can I take photos during the ceremony?',
            content: ['We ask that you please do not take photos *during* the ceremony as we want to see all your lovely faces! After that feel free to snap and share. ']
        },
        {
            title: 'Is there a gift registry?',
            content: [
                'After over a decade together all we really want is all our friends and family present to celebrate with us.',
                'However, if you would like to gift us an experience for our honeymoon in Bali, you can do so [here](https://withjoy.com/kezia-and-james-eclm3mihbj000101xx5gyaesfss/registry)'
            ]
        },
        {
            title: 'Can I drive?',
            content: [
                'We are providing transport between ceremony and reception venue and request that you do not drive as there is no parking available at either venue.',
                'Peckham and the surrounding areas are very well connected by public transport - including the 24hr London Overground, bus and trains.',
                '[Get directions](https://www.google.com/maps/dir/?api=1&destination=Asylum+Chapel,+Caroline+Gardens,+Asylum+Rd,+London+SE15+2SQ&travelmode=transit)'
            ]
        },
        {
            title: 'Where can I stay?',
            content: [
                'There are a wide selection of hotels & Airbnb’s in East Dulwich and Peckham.',
                'We recommend staying local to experience the underrated part of London we’ve chosen to make our home!',
                'However, there is plenty of affordable accommodation further afield in London Bridge, Brixton, Camberwell, Clapham and Waterloo.'
            ]
        },
        {
            title: 'What is there to do in the area?',
            content: [
                'Here’s a few bits to get you started on a perfect weekend in Peckham & Dulwich – our favourite part of London!',
                '**Farmers markets:**',
                '- [North Cross Road Saturday market](https://www.google.com/maps/search/?api=1&query=North+Cross+Road+Market) (East Dulwich)',
                '- [Telegraph Hill market](https://www.google.com/maps/search/?api=1&query=Telegraph+Hill+Market)',
                '**Brunch:**',
                '- [Megan’s on the Lordship](https://www.google.com/maps/search/?api=1&query=Megan\'s+on+the+Lordship+Restaurant+(East+Dulwich))',
                '- [Good Neighbour Peckham](https://www.google.com/maps/search/?api=1&query=Good+Neighbour+Peckham)',
                '- [Boulangerie Jade](https://www.google.com/maps/search/?api=1&query=Boulangerie+Jade,+145+Lordship+Ln,+London+SE22+8HX)',
                '**Favourite bars:**',
                '- [Funkidory](https://www.google.com/maps/search/?api=1&query=Funkidory,+Peckham+Rye,+London) (Kez loves the mezcal old fashioned)',
                '- [La Cave de Bruno](https://www.google.com/maps/search/?api=1&query=La+Cave+de+Bruno,+Lordship+Lane,+London) (James loves the saucisson)',
                '- [Zapoi](https://www.google.com/maps/search/?api=1&query=Zapoi,+Rye+Lane,+London)',
                '**Favourite restaurants:**',
                '- [Levan](https://www.google.com/maps/search/?api=1&query=Levan+European+Restaurant+and+Bar+Peckham)',
                '- [Yama Momo](https://www.google.com/maps/search/?api=1&query=Yama+Momo,+Lordship+Lane,+London)',
                '- [Kudu Grill](https://www.google.com/maps/search/?api=1&query=Kudu+Grill,+Nunhead+Lane,+London) (James loves the lamb)',
                '**Favourite pubs:**',
                '- [East Dulwich Tavern](https://www.google.com/maps/search/?api=1&query=East+Dulwich+Tavern,+Lordship+Lane,+London)',
                '- [White Horse Peckham](https://www.google.com/maps/search/?api=1&query=White=Horse+Peckham)',
                '- [The Old Nuns Head](https://www.google.com/maps/search/?api=1&query=The+Old+Nuns+Head,+Nunhead+Green,+London)',
                '**Favourite bakeries:**',
                '- [Söderberg](https://www.google.com/maps/search/?api=1&query=Söderberg+East+Dulwich,+Lordship+Lane,+London)',
                '- [Blackbird](https://www.google.com/maps/search/?api=1&query=Blackbird+Bakery,+Grove+Vale,+London)',
                '- [Gails](https://www.google.com/maps/search/?api=1&query=GAIL\'s+Bakery+East+Dulwich)'
            ]
        }
    ];

    return (
        <Section>
            <Section.Container>
                <Section.Title text="FAQs" centered />
                <div class="mx-auto max-w-[680px]">
                    <For each={questions}>
                        {(question) => (
                            <FAQItem
                                title={question.title}
                                content={question.content}
                                isOpen={() => activeAccordion() === question.title}
                                onClick={() => setActiveAccordion(activeAccordion() === question.title ? null : question.title)}
                            />
                        )}
                    </For>
                </div>
            </Section.Container>
        </Section>
    )
}

export default FAQs;
