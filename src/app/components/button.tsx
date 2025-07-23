import { SubmitButtonT } from "@/types/ButtonTypes";

const SubmitButton = ({ label }: SubmitButtonT) => {
    return (
        <div className="flex justify-center mt-6 mb-3">
            <button
                type="submit"
                className="bg-blue-500 text-white rounded-md py-2 px-6 text-sm font-medium hover:bg-blue-600 transition-colors"
            >
                {label}
            </button>
        </div>
    );
};

export default SubmitButton;
