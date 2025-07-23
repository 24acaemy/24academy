import React from "react";

interface ModalProps {
    isVisible: boolean;
    onClose: () => void;
    title: string; // Modal title
    onSubmit?: () => void; // Optional submit handler
    closeButtonText?: string; // Custom close button text
    submitButtonText?: string; // Custom submit button text
    children: React.ReactNode; // Content to display inside the modal
}

const Modal: React.FC<ModalProps> = ({
    isVisible,
    onClose,
    title,
    onSubmit,

    children,
}) => {
    if (!isVisible) return null; // Do not render if not visible

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose} // Close modal when clicking outside
            aria-hidden="true"
        >
            <div
                className="bg-white p-6 rounded-lg w-96 relative"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                role="dialog" // ARIA role to indicate modal dialog
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <h3 id="modal-title" className="text-2xl font-semibold text-center mb-4">{title}</h3>
                <div id="modal-description">
                    {children} {/* Render dynamic content inside the modal */}
                </div>
                <div className="flex justify-between mt-6">


                </div>
            </div>
        </div>
    );
};

export default Modal;
