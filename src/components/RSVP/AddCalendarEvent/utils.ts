import { ClientInvite, InvitedTo } from '@lib/supabase/invites';

export const getLocation = (invite: ClientInvite) => {
    if (invite.invitedTo === InvitedTo.RECEPTION) {
        return 'The Lordship Pub, 211 Lordship Ln, London SE22 8HA';
    }

    return 'The Asylum Chapel, Caroline Gardens, Asylum Rd, London SE15 2SQ';
}

export const getStartTime = (invite: ClientInvite) => {
    if (invite.invitedTo === InvitedTo.RECEPTION) {
        return '18:30';
    }

    return '12:00';
}


export const getDescription = (invite: ClientInvite) => {
    const isMultipleUser = invite.users.length === 2;
    const event = invite.invitedTo === InvitedTo.RECEPTION ? 'evening reception' : 'ceremony';
    const time = invite.invitedTo === InvitedTo.RECEPTION ? '6:30pm' : '12pm';
    const isAllComing = invite.users.every((user) => user.isComing);

    if (isMultipleUser && isAllComing) {
        return `Hi ${invite.users[0].firstName}, we're looking forward to see and ${invite.users[1].firstName} at the ${event} at ${time}.`;
    }

    return `Hi ${invite.users[0].firstName}, we're looking forward to see you at the ${event} at ${time}.`
}