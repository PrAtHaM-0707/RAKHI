import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const AboutPage = () => {
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
              About RakhiMart
            </h1>
            
            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-xl font-semibold mb-3 text-orange-600">Our Story</h2>
                <p className="mb-4">
                  Founded in 2020, RakhiMart began as a small family business with a passion for 
                  preserving the beautiful tradition of Raksha Bandhan. What started as a humble 
                  initiative to create handcrafted rakhis has now blossomed into a trusted platform 
                  serving thousands of customers across India.
                </p>
                <p>
                  We take pride in our artisan-crafted rakhis that blend traditional designs with 
                  contemporary styles, ensuring there's something special for every brother-sister duo.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-orange-600">Our Mission</h2>
                <p className="mb-4">
                  At RakhiMart, we're committed to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Preserving and promoting traditional Indian craftsmanship</li>
                  <li>Providing high-quality, unique rakhi designs</li>
                  <li>Ensuring a seamless shopping experience</li>
                  <li>Supporting local artisans and their families</li>
                  <li>Making Raksha Bandhan celebrations more special</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3 text-orange-600">Our Team</h2>
                <p>
                  Our team consists of passionate individuals who work year-round to bring you the 
                  best collection of rakhis. From skilled artisans who handcraft each piece to our 
                  customer support team that ensures your shopping experience is smooth, we all share 
                  the same dedication to making Raksha Bandhan memorable.
                </p>
              </section>

              <div className="mt-8 bg-orange-50 p-6 rounded-lg border border-orange-100">
                <h3 className="text-lg font-semibold mb-3 text-orange-700">Why Choose Us?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">100% Handmade</h4>
                      <p className="text-sm text-gray-600">Each rakhi is carefully crafted by skilled artisans</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Secure Packaging</h4>
                      <p className="text-sm text-gray-600">Delivered in beautiful, protective packaging</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">On-time Delivery</h4>
                      <p className="text-sm text-gray-600">Guaranteed delivery before Raksha Bandhan</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">24/7 Support</h4>
                      <p className="text-sm text-gray-600">Dedicated customer care for all your queries</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;