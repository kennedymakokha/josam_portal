export default function Modal({ isOpen, onClose, children }: any) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 text-xl">×</button>
                {children}
            </div>
        </div>
    );
}
