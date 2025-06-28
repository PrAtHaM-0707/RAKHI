import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const ShippingPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6 border-orange-200 hover:border-orange-400"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Shipping Policy
            </h1>
            
            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-xl font-semibold mb-3 text-orange-600">Domestic Shipping</h2>
                <p className="mb-4">
                  We ship to all major cities and towns across India. Our standard delivery time is 
                  3-7 business days from the date of order confirmation.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Metro cities: 3-5 business days</li>
                  <li>Other cities: 5-7 business days</li>
                  <li>Remote areas: 7-10 business days</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-orange-600">Shipping Methods</h2>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-2">Standard Shipping</h3>
                    <p className="text-sm text-gray-600 mb-2">Delivery in 5-7 business days</p>
                    <p className="text-orange-600 font-medium">Free on orders above ₹500</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-2">Express Shipping</h3>
                    <p className="text-sm text-gray-600 mb-2">Delivery in 2-3 business days</p>
                    <p className="text-orange-600 font-medium">₹99 extra</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-orange-600">Order Processing</h2>
                <p className="mb-4">
                  Orders are processed within 24-48 hours of being placed. During peak seasons 
                  (especially around Raksha Bandhan), processing may take slightly longer.
                </p>
                <p>
                  You will receive an email with tracking information once your order has been shipped.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-orange-600">International Shipping</h2>
                <p className="mb-4">
                  We currently offer international shipping to select countries. International orders 
                  typically take 7-15 business days to arrive, depending on the destination.
                </p>
                <p>
                  Please contact our customer support for international shipping rates and availability.
                </p>
              </section>

              <div className="mt-8 bg-orange-50 p-6 rounded-lg border border-orange-100">
                <h3 className="text-lg font-semibold mb-4 text-orange-700">Important Notes</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <svg className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Delivery times are estimates and not guaranteed, especially during peak seasons</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <svg className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>We are not responsible for delays caused by customs, natural disasters, or other unforeseen circumstances</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <svg className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Please ensure your shipping address is complete and accurate</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;