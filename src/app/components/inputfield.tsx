import React from "react";
import { InputFieldT } from "@/types/FormTypes";  // Ensure you import your types

const InputField: React.FC<InputFieldT> = ({ type, name, placeholder, label, register, error }) => (
    <div className="my-2 flex flex-col">
        {/* Label for accessibility */}
        <label htmlFor={`field_${name}`} className="py-1 text-md text-black/50 font-mono font-medium">
            {label}
        </label>

        {/* Input Field */}
        <input
            {...register(name)}  // Register the input with react-hook-form
            type={type}
            name={name}
            id={`field_${name}`}  // Unique ID for the input
            className={`px-3 py-2 text-black border rounded-md border-black/30 placeholder:text-sm text-sm ${error ? "border-red-500" : ""  // Add red border if there's an error
                }`}
            autoComplete="off"
            placeholder={placeholder}  // Placeholder text
        />

        {/* Error Message */}
        {error && <span className="text-red-500 py-1">{error.message}</span>}
    </div>
);

export default InputField;
