import Section from '@components/Section';
import RSVPForm from '@components/RSVP/RSVPForm';

const RSVP = (props: { isAuthenticated: boolean}) => {
    return (
        <Section>
            <Section.Container>
                <Section.Title text="RSVP" class="mb-[16px] md:mb-[16px]" centered />
                <RSVPForm isAuthenticated={props.isAuthenticated} />
            </Section.Container>
        </Section>
    );
}

export default RSVP;
