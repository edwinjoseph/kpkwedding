import { Component, Show, JSX, JSXElement } from 'solid-js';
import cx from 'classnames';

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
            class={cx('fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-screen max-h-full bg-gray-800/25 flex justify-center items-center', {
                'hidden': !props.isOpen,
            })}
            onClick={handleClickBackdrop}>
            <div id="modal-inner" class="relative w-full max-w-2xl max-h-full">
                <div class="relative bg-white rounded-lg shadow">
                    {props.children}
                </div>
            </div>
        </div>
    )
}

Modal.Header = (props) => (
    <div class="flex items-start justify-between p-4 border-b rounded-t">
        <h3 class="text-xl font-semibold text-gray-900">
            {props.title}
        </h3>
        <Show when={Boolean(props.closeModal)}>
            <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center" data-modal-hide="defaultModal" onClick={props.closeModal}>
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span class="sr-only">Close modal</span>
            </button>
        </Show>
    </div>
)

Modal.Body = (props) => (
    <div class="p-6 space-y-6">
        {props.children}
    </div>
)

Modal.Footer = (props) => (
    <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
        {props.children}
    </div>
)

export default Modal;