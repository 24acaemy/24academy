import { ErrorOption, UseFormRegister } from "react-hook-form";

export type InputFieldT = {
    type: string;
    placeholder: string;
    label: string;
    name: string;
    register: UseFormRegister<any>;  // Use `UseFormRegister` from react-hook-form
    error: undefined | ErrorOption;
};
