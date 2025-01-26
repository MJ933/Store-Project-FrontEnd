import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
const Hero = () => {
  const navigate = useNavigate("/products/ShowAllProducts");

  return (
    <div className="relative bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-[2.5rem]">
            New Season Arrivals
          </h1>
          <p className="mt-4 max-w-md mx-auto text-base text-gray-300">
            Discover our curated collection of premium products
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate("/products/ShowAllProducts")}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              Shop Now
              <ChevronRightIcon className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
