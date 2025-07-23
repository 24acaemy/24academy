"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

// Define the structure for payment method data
interface PaymentMethod {
    me_id: string;
    method: string;
    details: string;
    created_at: string;
    updated_at: string | null;
}

const ManagePaymentMethods = () => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // Fetch payment methods from API
    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const response = await axios.get("https://24onlinesystem.vercel.app/payment_methods");
                if (response.data) {
                    setPaymentMethods(response.data);
                }
            } catch {
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentMethods();
    }, []);

    // Edit payment method
    const handleEdit = (paymentMethod: PaymentMethod) => {
        setSelectedPaymentMethod(paymentMethod);
        setIsModalOpen(true);
    };

    // Delete payment method
    const handleDelete = async (paymentMethodId: string) => {
        if (!window.confirm("Are you sure you want to delete this payment method?")) return;

        setLoading(true);

        try {
            const response = await axios.put(`https://24onlinesystem.vercel.app/payment_methods/${paymentMethodId}`);
            if (response.status >= 200 && response.status < 300) {
                alert("Payment method deleted successfully");
                setPaymentMethods(paymentMethods.filter((method) => method.me_id !== paymentMethodId));
            } else {
                alert("Failed to delete the payment method");
            }
        } catch {
            alert("Error while deleting payment method");
        } finally {
            setLoading(false);
        }
    };

    // Submit the edited payment method
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPaymentMethod) return;

        setLoading(true);

        try {
            const response = await axios.put(
                `https://24onlinesystem.vercel.app/payment_methods/${selectedPaymentMethod.me_id}`,
                selectedPaymentMethod
            );

            if (response.status >= 200 && response.status < 300) {
                alert("Payment method updated successfully");
                setPaymentMethods(
                    paymentMethods.map((method) =>
                        method.me_id === selectedPaymentMethod.me_id ? selectedPaymentMethod : method
                    )
                );
                setIsModalOpen(false);
            } else {
                alert("Failed to update the payment method");
            }
        } catch {
            alert("Error while updating payment method");
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes in the modal
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        // Explicitly type the `name` as a valid key in PaymentMethod
        if (selectedPaymentMethod && name in selectedPaymentMethod) {
            setSelectedPaymentMethod((prev) => ({
                ...prev!,
                [name]: value,
            }));
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-[#051568] mb-6 text-center">
                Manage Payment Methods
            </h3>
            {paymentMethods.length === 0 ? (
                <p className="text-center">No payment methods to display.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paymentMethods.map((paymentMethod) => (
                        <div
                            key={paymentMethod.me_id}
                            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
                        >
                            <h4 className="text-xl font-semibold text-[#051568] mb-2">
                                {paymentMethod.method}
                            </h4>
                            <p className="text-gray-600 mb-2">
                                <strong>Details:</strong> {paymentMethod.details}
                            </p>
                            <p className="text-gray-600 mb-2">
                                <strong>Date Added:</strong>{" "}
                                {new Date(paymentMethod.created_at).toLocaleDateString("ar-EG")}
                            </p>
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    onClick={() => handleEdit(paymentMethod)}
                                    className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDelete(paymentMethod.me_id)}
                                    className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600"
                                >
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && selectedPaymentMethod && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
                        <h4 className="text-xl font-semibold text-[#051568] mb-4">
                            Edit Payment Method
                        </h4>
                        <form onSubmit={handleSubmit}>
                            {["method", "details"].map((field) => (
                                <div className="mb-4" key={field}>
                                    <label
                                        className="block text-[#051568] font-semibold capitalize"
                                        htmlFor={field}
                                    >
                                        {field.replace("_", " ")}
                                    </label>
                                    <input
                                        type="text"
                                        id={field}
                                        name={field}
                                        value={selectedPaymentMethod[field as keyof PaymentMethod] || ""}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md mt-2"
                                    />
                                </div>
                            ))}

                            <div className="flex justify-between mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-500 text-white p-2 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white p-2 rounded-md"
                                    disabled={loading}
                                >
                                    {loading ? "Updating..." : "Update Payment Method"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePaymentMethods;
