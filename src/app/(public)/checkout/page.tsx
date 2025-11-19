// pages/CheckoutPage.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/atoms/button";
import { useBusiness } from "@/hooks/useBusiness";
import { useCart } from "@/hooks/useCart";
import { usePreorderCart } from "@/hooks/usePreorderCart";
import { useCreateOnlineOrderMutation } from "@/lib/api/publicApi";
import type { TCartItem } from "@/lib/features/cart/cartSlice";
import { formatCurrency } from "@/utils/formatCurrency";
import { trackBeginCheckout, trackPurchase } from "@/utils/gtm";
import DeliveryInfoForm from "./_components/DeliveryInfoForm";
import { CartSummary } from "./_components/CartSummary";
import { normalizePhone } from "@/utils/normalizePhone";

interface OnlineOrderResponse {
  status: number;
  success: boolean;
  message: string;
  data?: {
    _id: string;
    orderId: string;
    selectedGatewayUrl?: string;
    allGatewayUrl?: string;
    message?: string;
  };
}

interface FormData {
  name: string;
  phone: string;
  address: string;
  delivery_area: string;
  note: string;
  paymentMethod: string;
}

interface FormErrors {
  name: string;
  phone: string;
  address: string;
  delivery_area: string;
  note: string;
}

interface PaymentMethod {
  name: string;
  logo: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { businessData } = useBusiness();
  const { items, clearCart, removeItem, updateItemQuantity } = useCart();
  const { item: preorderItem, clearCart: clearPreorderCart, updateItemQuantity: updatePreorderQuantity, itemCount, subtotal: preorderSubtotal } = usePreorderCart();
  const [createOnlineOrder, { isLoading: isOrderLoading }] = useCreateOnlineOrderMutation();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
    delivery_area: "",
    note: "",
    paymentMethod: "cashOnDelivery",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: "",
    phone: "",
    address: "",
    delivery_area: "",
    note: "",
  });

  const [additional_discount_amount, setAdditionalDiscountAmount] = useState(0);

  // Determine available payment methods (পুরানো লজিক)
  const availablePaymentMethods = useMemo<PaymentMethod[]>(() => {
    if (businessData?.ssl_commerz?.account_id && businessData?.ssl_commerz?.isActive_SSLCommerz) {
      if (businessData.ssl_commerz.payment_methods.length > 0) {
        return businessData.ssl_commerz.payment_methods;
      }
      return [{ name: "Pay Now", logo: "/assets/payOnline.jpg" }];
    }
    return [];
  }, [businessData]);

  // bKash discount logic (পুরানো লজিক)
  useEffect(() => {
    if (formData.paymentMethod === "bKash") {
      setAdditionalDiscountAmount(100);
    } else {
      setAdditionalDiscountAmount(0);
    }
  }, [formData.paymentMethod]);

  const currency = businessData?.currency?.[0] ?? "BDT";

  // Delivery charge calculation (পুরানো লজিক)
  const deliveryCharge = useMemo(() => {
    if (!businessData) return 0;
    if (businessData?.defaultCourier === null || businessData?.defaultCourier === "office-delivery") return 0;
    switch (formData.delivery_area) {
      case "inside_dhaka":
        return businessData.insideDhaka;
      case "sub_dhaka":
        return businessData.subDhaka;
      case "outside_dhaka":
        return businessData.outsideDhaka;
      default:
        return 0;
    }
  }, [formData.delivery_area, businessData]);

  // Preorder logic (নতুন থেকে রাখব)
  const isPreorderCheckout = !!(preorderItem && itemCount > 0);
  const displayItems = isPreorderCheckout ? [preorderItem] : items;
  const currentSubtotal = isPreorderCheckout ? preorderSubtotal : items.reduce(
    (sum: number, item: TCartItem) => sum + item.price * item.quantity,
    0
  );

  const total = useMemo(
    () => currentSubtotal + deliveryCharge - additional_discount_amount,
    [currentSubtotal, deliveryCharge, additional_discount_amount]
  );

  // Redirect if no items (পুরানো + নতুন লজিক)
  useEffect(() => {
    if (items.length === 0 && !isPreorderCheckout) {
      toast.warning("Your cart is empty!", {
        description: "Add some items to your cart first",
      });

    }
    trackBeginCheckout(displayItems, total);
  }, [items, total, router, isPreorderCheckout, displayItems]);

  // Form validation (পুরানো লজিক)
  const validateForm = () => {
    const errors: FormErrors = {
      name: "",
      phone: "",
      address: "",
      delivery_area: "",
      note: "",
    };
    let hasError = false;
    let firstErrorField: string | null = null;

    if (!formData.name.trim()) {
      errors.name = "Enter a name with at least 3 characters";
      hasError = true;
      if (!firstErrorField) firstErrorField = "name";
    } else if (formData.name.trim().length < 3) {
      errors.name = "Enter a name with at least 3 characters";
      hasError = true;
      if (!firstErrorField) firstErrorField = "name";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Enter your phone number";
      hasError = true;
      if (!firstErrorField) firstErrorField = "phone";
    } else if (!/^01\d{9}$/.test(formData.phone)) {
      errors.phone = "Enter a valid phone number (01xxxxxxxxx)";
      hasError = true;
      if (!firstErrorField) firstErrorField = "phone";
    }
    if (!formData.address) {
      errors.address = "Enter your address";
      hasError = true;
      if (!firstErrorField) firstErrorField = "address";
    } else if (formData.address.trim().length < 10) {
      errors.address = "Enter a delivery address with at least 10 characters";
      hasError = true;
      if (!firstErrorField) firstErrorField = "address";
    }
    if (!formData.delivery_area) {
      errors.delivery_area = "Select a delivery area";
      hasError = true;
      if (!firstErrorField) firstErrorField = "delivery_area";
    }
    if (formData.note && formData.note.length < 5) {
      errors.note = "Enter a note with at least 5 characters";
      hasError = true;
      if (!firstErrorField) firstErrorField = "note";
    }

    setFormErrors(errors);
    return { hasError, firstErrorField };
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // Normalize phone number for the phone field
    const updatedValue = name === "phone" ? normalizePhone(value) : value;

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }

  };

  const handlePaymentMethodChange = (method: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
  };

  // Preorder item handlers (নতুন থেকে রাখব)
  const handlePreorderRemoveItem = (id: string, variantId?: string) => {
    if (isPreorderCheckout) {
      clearPreorderCart();
      toast.success("Preorder item removed");
    }
  };

  const handlePreorderUpdateQuantity = (id: string, variantId: string | undefined, quantity: number) => {
    if (isPreorderCheckout && preorderItem) {
      updatePreorderQuantity(quantity);
      toast.success(`Preorder quantity updated to ${quantity}`);
    }
  };

  const currentRemoveItem = isPreorderCheckout ? handlePreorderRemoveItem : removeItem;
  const currentUpdateItemQuantity = isPreorderCheckout ? handlePreorderUpdateQuantity : updateItemQuantity;

  // Payment method mapping (পুরানো লজিক)
  const getBackendPaymentMethod = (frontendMethod: string) => {
    switch (frontendMethod) {
      case "cashOnDelivery":
        return "cod";
      case "Pay Now":
        return "ssl";
      default:
        return frontendMethod;
    }
  };

  // Prepare order data (পুরানো লজিক + প্রি-অর্ডার সাপোর্ট)
  const prepareOrderPayload = () => {
    const products = isPreorderCheckout
      ? [{ productId: preorderItem._id, quantity: preorderItem.quantity }]
      : items.map((item: TCartItem) => ({
        productId: item._id,
        quantity: item.quantity,
      }));

    return {
      customer_name: formData.name,
      customer_phone: formData.phone,
      customer_address: formData.address,
      delivery_area: formData.delivery_area,
      customer_note: formData.note || undefined,
      products,
      additional_discount_type: additional_discount_amount > 0 ? "fixed" : undefined,
      additional_discount_amount:
        additional_discount_amount > 0
          ? additional_discount_amount.toString()
          : undefined,
      due: total.toString(),
      payment_method: getBackendPaymentMethod(formData.paymentMethod),
    };
  };

  // Function to smoothly scroll to the first invalid field
  const scrollToFirstError = (fieldName: string) => {
    const fieldElement = document.getElementById(fieldName);
    if (fieldElement) {
      // Check if mobile (viewport width < 768px)
      const isMobile = window.innerWidth < 768;
      const offsetTop = fieldElement.offsetTop;
      const scrollOffset = isMobile ? 120 : 100; // Account for fixed headers/bottom bar

      window.scrollTo({
        top: offsetTop - scrollOffset,
        behavior: 'smooth'
      });

      // Focus the field after scrolling
      setTimeout(() => {
        fieldElement.focus();
      }, 500);
    }
  };

  // Main submit handler (পুরানো লজিক)
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const { hasError, firstErrorField } = validateForm();
    if (hasError) {
      // Scroll to first error field
      if (firstErrorField) {
        scrollToFirstError(firstErrorField);
      }
      return;
    }

    const backendPaymentMethod = getBackendPaymentMethod(formData.paymentMethod);

    if (!backendPaymentMethod) {
      toast.error("Invalid payment method");
      return;
    }

    const orderPayload = prepareOrderPayload();

    try {
      const response = await createOnlineOrder(orderPayload).unwrap();
      if (response.success) {
        const orderId = response.data?.orderId;
        const backendOrderId = response.data?._id;

        // Save to session storage
        sessionStorage.setItem(`orderId-${orderId}`, JSON.stringify(displayItems) || "");

        // Clear carts
        clearCart();
        if (isPreorderCheckout) {
          clearPreorderCart();
        }

        // Track purchase
        trackPurchase(
          backendOrderId,
          displayItems,
          total,
          deliveryCharge,
          formData.name,
          formData.phone,
          formData.address,
          formData.delivery_area,
          formData.paymentMethod,
          formData.note
        );

        // Handle different payment methods
        if (formData.paymentMethod === "cashOnDelivery") {
          const successUrl = new URL("/orderstatus", window.location.origin);
          successUrl.searchParams.set("status", "success");
          successUrl.searchParams.set("orderId", orderId);
          successUrl.searchParams.set("_id", backendOrderId);
          successUrl.searchParams.set(
            "customerName",
            encodeURIComponent(formData.name)
          );
          successUrl.searchParams.set(
            "customerPhone",
            encodeURIComponent(formData.phone)
          );
          successUrl.searchParams.set(
            "customerAddress",
            encodeURIComponent(formData.address)
          );
          successUrl.searchParams.set("total", total.toString());
          successUrl.searchParams.set("deliveryCharge", deliveryCharge.toString());
          successUrl.searchParams.set("itemCount", displayItems.length.toString());
          successUrl.searchParams.set("paymentMethod", "cashOnDelivery");
          successUrl.searchParams.set(
            "additionalDiscount",
            additional_discount_amount.toString()
          );

          displayItems.forEach((item: any, index: number) => {
            successUrl.searchParams.set(
              `itemName${index}`,
              encodeURIComponent(item.name)
            );
            successUrl.searchParams.set(`itemPrice${index}`, item.price.toString());
            successUrl.searchParams.set(`itemQty${index}`, item.quantity.toString());
          });

          window.location.href = successUrl.toString();
          toast.success("Order placed successfully!");
        } else {
          const gatewayUrl =
            response?.data?.selectedGatewayUrl || response?.data?.allGatewayUrl;
          if (gatewayUrl) {
            window.location.href = gatewayUrl;
          } else {
            toast.error("Payment gateway unavailable");
          }
        }
      } else {
        toast.error(response.message || "Order creation failed");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "An error occurred");
    }
  };

  const overlayActive = isOrderLoading;

  return (
    <div className="min-h-screen min-w-screen bg-white dark:bg-secondary relative">
      {overlayActive && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="animate-spin h-14 w-14 border-4 border-white border-t-transparent rounded-full" />
        </div>
      )}

      {/* <div className="md:mt-20">
        <PromotionBikashText />
      </div> */}
      <div className="px-1 pb-24 md:mt-20 lg:pb-16 bg-white dark:bg-secondary md:container md:mx-auto md:px-4 mt-12">
        <div className=" grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 ">
          <section className="lg:col-span-6 space-y-4 flex flex-col order-1 lg:order-2">
            <div className="rounded-xl overflow-hidden shadow-sm border bg-white dark:bg-secondary border-green-100 dark:border-gray-800 flex-1">
              <div className="p-1 lg:p-5">
                <DeliveryInfoForm
                  formData={formData}
                  formErrors={formErrors}
                  insideFee={businessData?.defaultCourier === null || businessData?.defaultCourier === "office-delivery" ? 0 : businessData?.insideDhaka || 0}
                  subDhakaFee={businessData?.defaultCourier === null || businessData?.defaultCourier === "office-delivery" ? 0 : businessData?.subDhaka || 0}
                  outsideFee={businessData?.defaultCourier === null || businessData?.defaultCourier === "office-delivery" ? 0 : businessData?.outsideDhaka || 0}
                  isLoading={isOrderLoading}
                  handleChange={handleChange}
                  handlePaymentMethodChange={handlePaymentMethodChange}
                  handleSubmit={handleSubmit}
                  onBack={() => router.back()}
                  availablePaymentMethods={availablePaymentMethods}
                />
              </div>

            </div>
          </section>
          <section className="lg:col-span-6 flex flex-col order-2">
            <div className="rounded-xl overflow-hidden shadow-sm border border-green-100 dark:border-gray-700 bg-white dark:bg-secondary flex-1">
              <div className="bg-white dark:bg-secondary px-4 py-3">
                <h2 className="text-sm font-semibold text-black dark:text-white">Shopping Items</h2>
              </div>
              <div className="lg:p-4 p-1">
                <CartSummary
                  items={displayItems}
                  deliveryCharge={deliveryCharge}
                  total={total}
                  currency={currency}
                  additional_discount_amount={additional_discount_amount}
                  removeItem={currentRemoveItem}
                  updateItemQuantity={currentUpdateItemQuantity}
                  isLoading={isOrderLoading}
                  handleSubmit={handleSubmit}
                  isPreOrder={isPreorderCheckout}
                />
              </div>
            </div>
          </section>


        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white dark:bg-secondary shadow-2xl border-t px-4 py-4 z-[60]">
          <div className="pb-3">
            <h2 className="text-lg font-semibold text-black dark:text-white">Cart Total</h2>
            <div className="w-full">
              <div className="flex flex-col gap-1 sm:gap-2 sm:mt-2 text-sm">
                {!isPreorderCheckout && (
                  <>
                    <div className="flex justify-between text-black dark:text-white uppercase">
                      <p>subtotal</p>
                      <p>{formatCurrency(currentSubtotal, currency)}</p>
                    </div>
                    <hr />
                  </>
                )}
                <div className="flex justify-between text-black dark:text-white uppercase">
                  <p>Delivery Charge</p>
                  <p>{formatCurrency(deliveryCharge, currency)}</p>
                </div>
                <hr />
                {additional_discount_amount > 0 && !isPreorderCheckout && (
                  <div className="flex justify-between text-black dark:text-white">
                    <p>Bikas Discount</p>
                    <p>[&minus;] {formatCurrency(additional_discount_amount, currency)}</p>
                  </div>
                )}
                {additional_discount_amount > 0 && !isPreorderCheckout && <hr />}
                <div className="flex justify-between text-black dark:text-white uppercase">
                  <p><strong>Total</strong></p>
                  <p className="font-bold">{formatCurrency(total, currency)}</p>
                </div>
              </div>
            </div>
          </div>
          <Button
            title="order"
            type="submit"
            disabled={isOrderLoading}
            variant="edge"
            className="w-full flex items-center justify-center"
          >
            {isOrderLoading ? (
              <div className="flex items-center justify-center ">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                Loading...
              </div>
            ) : (
              <>
                <span className="mr-2">🛒</span> ORDER CONFIRME
              </>
            )}
          </Button>
        </div>
      </form>

      {/* <BkashCashbackModal pageType="checkout" /> */}
    </div>
  );
}