import { Component, Show, JSX, JSXElement } from 'solid-js';
import twcx from '@utils/tailwind-cx';

type ModalComponent = Component<{
    isOpen: boolean;
    closeModal: () => void;
    children: JSXElement
}> & {
    Header: Component<{ title: string; closeModal?: () => void }>;
    Body: Component<{ children: JSXElement}>;
    Footer: Component<{ children: JSXElement}>;
}

const Modal: ModalComponent = (props) => {
    const handleClickBackdrop: JSX.EventHandler<HTMLDivElement, MouseEvent> = (event) => {
        const isOutside = !event.target.closest('#modal-inner');
        if (isOutside) {
            props.closeModal()
        }
    }

    return (
        <div
            id="modal-backdrop"
            tabindex={props.isOpen ? '0' : '-1'}
            aria-hidden={props.isOpen ? 'false' : 'true'}
            class={twcx('fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-screen max-h-full bg-gray-800/25 flex justify-center items-center', {
                'hidden': !props.isOpen,
            })}
            onClick={handleClickBackdrop}>
            <div id="modal-inner" class="relative max-h-full w-full max-w-2xl">
                <div class="relative rounded-lg bg-white shadow">
                    {props.children}
                </div>
            </div>
        </div>
    )
}

Modal.Header = (props) => (
    <div class="flex items-start justify-between rounded-t border-b p-4">
        <h3 class="text-xl font-semibold text-gray-900">
            {props.title}
        </h3>
        <Show when={Boolean(props.closeModal)}>
            <button type="button" class="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900" data-modal-hide="defaultModal" onClick={props.closeModal}>
                <svg class="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span class="sr-only">Close modal</span>
            </button>
        </Show>
    </div>
)

Modal.Body = (props) => (
    <div class="space-y-6 p-6">
        {props.children}
    </div>
)

Modal.Footer = (props) => (
    <div class="flex items-center space-x-2 rounded-b border-t border-gray-200 p-6">
        {props.children}
    </div>
)

export default Modal;