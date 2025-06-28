import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const ReturnPolicyPage = () => {
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
              Return & Refund Policy
            </h1>
            
            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-xl font-semibold mb-3 text-orange-600">Our Return Policy</h2>
                <p className="mb-4">
                  We want you to be completely satisfied with your purchase. If you're not happy with 
                  your order, we accept returns within 7 days of delivery.
                </p>
                <p>
                  To be eligible for a return, your item must be unused and in the same condition 
                  that you received it, with all original tags and packaging intact.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-orange-600">How to Initiate a Return</h2>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Contact our customer support within 7 days of receiving your order</li>
                  <li>Provide your order number and reason for return</li>
                  <li>We'll email you a return authorization and instructions</li>
                  <li>Package the item securely and ship it back to us</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-orange-600">Refund Process</h2>
                <p className="mb-4">
                  Once we receive your return, we will inspect it and notify you of the approval or 
                  rejection of your refund. If approved:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Refunds will be processed to the original payment method</li>
                  <li>Processing may take 5-10 business days after approval</li>
                  <li>Shipping costs are non-refundable</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-orange-600">Non-Returnable Items</h2>
                <p className="mb-4">
                  Certain items cannot be returned due to their nature:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Custom or personalized orders</li>
                  <li>Gift cards</li>
                  <li>Items marked as "Final Sale"</li>
                  <li>Damaged items due to customer misuse</li>
                </ul>
              </section>

              <div className="mt-8 bg-orange-50 p-6 rounded-lg border border-orange-100">
                <h3 className="text-lg font-semibold mb-4 text-orange-700">Damaged or Defective Items</h3>
                <p className="mb-4">
                  If you receive a damaged or defective item, please contact us immediately with 
                  photos of the product and packaging. We will arrange for a replacement or refund 
                  at no additional cost to you.
                </p>
                <p>
                  Please report damaged items within 48 hours of delivery for fastest resolution.
                </p>
              </div>

              <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                <h3 className="text-lg font-semibold mb-3 text-red-700">Special Note for Rakhi Orders</h3>
                <p>
                  Due to the seasonal nature of rakhi products, returns after Raksha Bandhan may not 
                  be possible. We recommend checking your order immediately upon receipt and 
                  contacting us well before the festival if there are any issues.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;