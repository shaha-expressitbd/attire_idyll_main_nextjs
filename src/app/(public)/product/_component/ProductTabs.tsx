import {
  FiMessageSquare,
  FiFileText,
  FiShield,
  FiTruck,
  FiInfo,
  FiHome
} from "react-icons/fi";

interface ProductTabsProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  shortDescription?: string;
  longDescription?: string;
  stock: number;
  variantsCount: number;
}

export default function ProductTabs({
  activeTab,
  setActiveTab,
  shortDescription,
  longDescription,
  stock,
  variantsCount
}: ProductTabsProps) {
  const allTabs = [
    {
      id: 'Short-Description',
      label: 'Short Desc',
      fullLabel: 'Short Description',
      icon: FiInfo,
      mobileIcon: FiMessageSquare
    },
    {
      id: 'Long-Description',
      label: 'Long Desc',
      fullLabel: 'Long Description',
      icon: FiFileText,
      mobileIcon: FiFileText
    },

  ];

  // Mobile view will show 2 tabs at a time with horizontal scroll
  return (
    <div className=" rounded-lg md:rounded-xl overflow-hidden -ml-4">


      {/* Short Description Tab */}
      <button
        onClick={() =>
          setActiveTab((prev) =>
            prev === "Short-Description" ? "" : "Short-Description"
          )
        }
        className="w-full flex items-center justify-between px-4 py-3 text-left dark:text-white"
      >
        <span className="font-medium text-gray-800 dark:text-gray-200">
          Short Description
        </span>
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 320 512"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ${activeTab === "Short-Description" ? "rotate-180" : ""
            }`}
        >
          <path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"></path>
        </svg>

      </button>

      {activeTab === "Short-Description" && shortDescription && (
        <div className="px-4 pb-4 text-sm text-gray-700 dark:text-gray-300">
          <div
            dangerouslySetInnerHTML={{ __html: shortDescription }}
          />
        </div>
      )}




      {/* Long Description Tab */}
      <button
        onClick={() =>
          setActiveTab((prev) => (prev === "Long-Description" ? "" : "Long-Description"))
        }
        className="w-full flex items-center justify-between px-4 py-3 text-left dark:text-white"
      >
        <span className="font-medium text-gray-800 dark:text-gray-200">
          Long Description
        </span>


        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 320 512"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ${activeTab === "Long-Description" ? "rotate-180" : ""
            }`}
        >
          <path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"></path>
        </svg>


      </button>
      {activeTab === "Long-Description" && longDescription && (
        <div className="px-4 pb-4 text-sm text-gray-700 dark:text-gray-300">
          <div
            dangerouslySetInnerHTML={{ __html: longDescription }}
          />
        </div>
      )}














    </div>
  );
}




{/* Tab Content */ }


{/* <div className="p-4 md:p-6 bg-white dark:bg-secondary">
          
                {activeTab === 'Short-Description' && shortDescription && (
                    <div className="pgreen pgreen-sm dark:pgreen-invert max-w-none text-gray-700 dark:text-gray-300">
                        <div dangerouslySetInnerHTML={{ __html: shortDescription }} />
                    </div>
                )}

                
                {activeTab === 'Long-Description' && longDescription && (
                    <div className="pgreen pgreen-sm dark:pgreen-invert max-w-none text-gray-700 dark:text-gray-300">
                        <div dangerouslySetInnerHTML={{ __html: longDescription }} />
                    </div>
                )}

                
                {activeTab === 'specs' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                            <span className="font-medium text-sm text-gray-600 dark:text-gray-400">Stock:</span>
                            <span className="text-sm dark:text-gray-300">{stock} units</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                            <span className="font-medium text-sm text-gray-600 dark:text-gray-400">Variants:</span>
                            <span className="text-sm dark:text-gray-300">{variantsCount} options</span>
                        </div>
                    </div>
                )}

              
                {activeTab === 'shipping' && (
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <FiHome className="flex-shrink-0 w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-200">Inside Dhaka</h4>
                                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">৳80 (1-2 business days)</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <FiTruck className="flex-shrink-0 w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-sm text-green-800 dark:text-green-200">Outside Dhaka</h4>
                                <p className="text-sm text-green-700 dark:text-green-300 mt-1">৳150 (3-5 business days)</p>
                            </div>
                        </div>
                    </div>
                )}
            </div> */}


