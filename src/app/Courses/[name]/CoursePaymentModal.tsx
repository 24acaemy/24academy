"use client";

import React, { useEffect, useMemo } from 'react';
import Modal from '@/app/components/modal/Modal';
import CustomLoader from '@/app/components/spinned';

interface PaymentMethod {
  me_id: string;
  method: string;
  details: string;
}

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  paymentMethods: PaymentMethod[];
  paymentMethodsLoading: boolean;
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (val: string) => void;
  accountNumber: string;
  setAccountNumber: (val: string) => void;
  transactionNumber: string;
  setTransactionNumber: (val: string) => void;
  amountPaid: string;
  setAmountPaid: (val: string) => void;
  wantedTime: string;
  setWantedTime: (val: string) => void;
  errorMessage: string;
  isSubmitting: boolean;
  isSubmitDisabled: boolean;
  requiredPrice: number;
  currencyLabel: string;
}

const CoursePaymentModal: React.FC<Props> = ({
  isVisible,
  onClose,
  onSubmit,
  paymentMethods,
  paymentMethodsLoading,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  accountNumber,
  setAccountNumber,
  transactionNumber,
  setTransactionNumber,
  amountPaid,
  setAmountPaid,
  wantedTime,
  setWantedTime,
  errorMessage,
  isSubmitting,
  isSubmitDisabled,
  requiredPrice,
  currencyLabel,
}) => {
  // Reset fields when modal opens
  useEffect(() => {
    if (isVisible && requiredPrice !== undefined && requiredPrice !== null) {
      setSelectedPaymentMethod('');
      setAccountNumber('');
      setTransactionNumber('');
      setAmountPaid(String(requiredPrice));
      setWantedTime('');
    }
  }, [isVisible, requiredPrice, setSelectedPaymentMethod, setAccountNumber, setTransactionNumber, setAmountPaid, setWantedTime]);

  // Validate amount
  const isAmountValid = useMemo(
    () => Math.abs(Number(amountPaid) - requiredPrice) < 0.01,
    [amountPaid, requiredPrice]
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    onSubmit(e);
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      title="التسجيل في الدورة"
      closeButtonText="إغلاق"
      submitButtonText="تقديم"
    >
      {/* عرض السعر المحدد من تفاصيل الدورة */}
      <div className="mb-4 p-4 bg-blue-50 rounded-md border border-blue-200">
        <p className="text-lg">
          <strong>سعر الدورة:</strong> {requiredPrice} {currencyLabel}
        </p>
      </div>

      <form onSubmit={handleFormSubmit} aria-label="نموذج تسجيل الدفع">
        {/* Payment method */}
        <div className="mb-4">
          <label htmlFor="payment-method" className="block text-lg">
            طريقة الدفع
          </label>
          {paymentMethodsLoading ? (
            <div className="w-full p-2 border border-gray-300 rounded-md bg-gray-100">
              <CustomLoader size="small" />
            </div>
          ) : (
            <select
              id="payment-method"
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">اختر طريقة الدفع</option>
              {paymentMethods.map((method) => (
                <option key={method.me_id} value={method.method}>
                  {method.method} ({method.details})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Account number */}
        {selectedPaymentMethod && (
          <>
            <div className="mb-4">
              <label htmlFor="account-number" className="block text-lg">
                رقم الحساب الذي تم الدفع منه
              </label>
              <input
                type="text"
                id="account-number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Transaction number */}
            <div className="mb-4">
              <label htmlFor="transaction-number" className="block text-lg">
                رقم العملية
              </label>
              <input
                type="text"
                id="transaction-number"
                value={transactionNumber}
                onChange={(e) => setTransactionNumber(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Amount paid */}
            <div className="mb-4">
              <label htmlFor="amount-paid" className="block text-lg">
                المبلغ المدفوع ({currencyLabel})
              </label>
              <input
                type="number"
                id="amount-paid"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className={`w-full p-2 rounded-md mt-2 ${
                  !isAmountValid && amountPaid !== '' ? 'border-red-500' : 'border-gray-300'
                }`}
                required
                aria-describedby="price-help"
              />
              <p id="price-help" className="text-gray-600 mt-1">
                الرجاء إدخال: <strong>{requiredPrice} {currencyLabel}</strong>
              </p>
              {!isAmountValid && amountPaid !== '' && (
                <p className="text-red-600 mt-1">
                  يرجى إدخال المبلغ الصحيح.
                </p>
              )}
            </div>

            {/* Wanted time */}
            <div className="mb-4">
              <label htmlFor="wanted-time" className="block text-lg">
                الوقت المطلوب
              </label>
              <input
                type="time"
                id="wanted-time"
                value={wantedTime}
                onChange={(e) => setWantedTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <p className="text-red-500 text-sm mb-4">
              <strong>تنويه:</strong> في حالة وجود اختلاف في البيانات لن يتم قبول عملية الدفع.
            </p>
          </>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700" role="alert">
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className={`flex-1 py-2 px-6 bg-blue-600 text-white font-semibold rounded-md flex justify-center items-center ${
              isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitDisabled}
          >
            {isSubmitting ? 'جارٍ المعالجة...' : 'تقديم'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-6 bg-red-600 text-white font-semibold rounded-md"
            disabled={isSubmitting}
          >
            إلغاء
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CoursePaymentModal;
