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
    {
      id: 'specs',
      label: 'Specs',
      fullLabel: 'Specifications',
      icon: FiShield,
      mobileIcon: FiShield
    },
    {
      id: 'shipping',
      label: 'Shipping',
      fullLabel: 'Shipping Info',
      icon: FiTruck,
      mobileIcon: FiTruck
    }
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




      {/* social media icon */}
      <div className="flex gap-4 text-2xl mt-4 ml-4 text-foregroun dark:text-secondary">
        <a rel="noopener noreferrer" href="https://facebook.com/sharer/sharer.php?u=https%3A%2F%2FAttireIdyll.com%2Fsingleproduct%2Findian-salwar-kameez-unstitched-6870af751199d4aa09b0fdd5" target="_blank">
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path></svg></a><a rel="noopener noreferrer" href="https://instagram.com/?url=https%3A%2F%2FAttireIdyll.com%2Fsingleproduct%2Findian-salwar-kameez-unstitched-6870af751199d4aa09b0fdd5" target="_blank">
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg></a><a rel="noopener noreferrer" href="https://reddit.com/submit?url=https%3A%2F%2FAttireIdyll.com%2Fsingleproduct%2Findian-salwar-kameez-unstitched-6870af751199d4aa09b0fdd5" target="_blank"><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M201.5 305.5c-13.8 0-24.9-11.1-24.9-24.6 0-13.8 11.1-24.9 24.9-24.9 13.6 0 24.6 11.1 24.6 24.9 0 13.6-11.1 24.6-24.6 24.6zM504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zm-132.3-41.2c-9.4 0-17.7 3.9-23.8 10-22.4-15.5-52.6-25.5-86.1-26.6l17.4-78.3 55.4 12.5c0 13.6 11.1 24.6 24.6 24.6 13.8 0 24.9-11.3 24.9-24.9s-11.1-24.9-24.9-24.9c-9.7 0-18 5.8-22.1 13.8l-61.2-13.6c-3-.8-6.1 1.4-6.9 4.4l-19.1 86.4c-33.2 1.4-63.1 11.3-85.5 26.8-6.1-6.4-14.7-10.2-24.1-10.2-34.9 0-46.3 46.9-14.4 62.8-1.1 5-1.7 10.2-1.7 15.5 0 52.6 59.2 95.2 132 95.2 73.1 0 132.3-42.6 132.3-95.2 0-5.3-.6-10.8-1.9-15.8 31.3-16 19.8-62.5-14.9-62.5zM302.8 331c-18.2 18.2-76.1 17.9-93.6 0-2.2-2.2-6.1-2.2-8.3 0-2.5 2.5-2.5 6.4 0 8.6 22.8 22.8 87.3 22.8 110.2 0 2.5-2.2 2.5-6.1 0-8.6-2.2-2.2-6.1-2.2-8.3 0zm7.7-75c-13.6 0-24.6 11.1-24.6 24.9 0 13.6 11.1 24.6 24.6 24.6 13.8 0 24.9-11.1 24.9-24.6 0-13.8-11-24.9-24.9-24.9z"></path></svg></a><a rel="noopener noreferrer" href="https://wa.me/?text=https%3A%2F%2FAttireIdyll.com%2Fsingleproduct%2Findian-salwar-kameez-unstitched-6870af751199d4aa09b0fdd5" target="_blank"><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg></a><a rel="noopener noreferrer" href="https://threads.net/share?text=https%3A%2F%2FAttireIdyll.com%2Fsingleproduct%2Findian-salwar-kameez-unstitched-6870af751199d4aa09b0fdd5" target="_blank"><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M331.5 235.7c2.2 .9 4.2 1.9 6.3 2.8c29.2 14.1 50.6 35.2 61.8 61.4c15.7 36.5 17.2 95.8-30.3 143.2c-36.2 36.2-80.3 52.5-142.6 53h-.3c-70.2-.5-124.1-24.1-160.4-70.2c-32.3-41-48.9-98.1-49.5-169.6V256v-.2C17 184.3 33.6 127.2 65.9 86.2C102.2 40.1 156.2 16.5 226.4 16h.3c70.3 .5 124.9 24 162.3 69.9c18.4 22.7 32 50 40.6 81.7l-40.4 10.8c-7.1-25.8-17.8-47.8-32.2-65.4c-29.2-35.8-73-54.2-130.5-54.6c-57 .5-100.1 18.8-128.2 54.4C72.1 146.1 58.5 194.3 58 256c.5 61.7 14.1 109.9 40.3 143.3c28 35.6 71.2 53.9 128.2 54.4c51.4-.4 85.4-12.6 113.7-40.9c32.3-32.2 31.7-71.8 21.4-95.9c-6.1-14.2-17.1-26-31.9-34.9c-3.7 26.9-11.8 48.3-24.7 64.8c-17.1 21.8-41.4 33.6-72.7 35.3c-23.6 1.3-46.3-4.4-63.9-16c-20.8-13.8-33-34.8-34.3-59.3c-2.5-48.3 35.7-83 95.2-86.4c21.1-1.2 40.9-.3 59.2 2.8c-2.4-14.8-7.3-26.6-14.6-35.2c-10-11.7-25.6-17.7-46.2-17.8H227c-16.6 0-39 4.6-53.3 26.3l-34.4-23.6c19.2-29.1 50.3-45.1 87.8-45.1h.8c62.6 .4 99.9 39.5 103.7 107.7l-.2 .2zm-156 68.8c1.3 25.1 28.4 36.8 54.6 35.3c25.6-1.4 54.6-11.4 59.5-73.2c-13.2-2.9-27.8-4.4-43.4-4.4c-4.8 0-9.6 .1-14.4 .4c-42.9 2.4-57.2 23.2-56.2 41.8l-.1 .1z"></path></svg></a><a rel="noopener noreferrer" href="https://pinterest.com/pin/create/button/?url=https%3A%2F%2FAttireIdyll.com%2Fsingleproduct%2Findian-salwar-kameez-unstitched-6870af751199d4aa09b0fdd5&amp;media=https%3A%2F%2Fcloude.calquick.app%2Fv2%2Fapi%2Ffiles%2Fupload%2Fimages%2FattireIdyll%20BD-761839.webp&amp;description=%3Cp%3E%E0%A6%8F%E0%A6%87%20%E0%A6%87%E0%A6%A8%E0%A7%8D%E0%A6%A1%E0%A6%BF%E0%A7%9F%E0%A6%BE%E0%A6%A8%20%E0%A6%B2%E0%A6%BE%E0%A6%95%E0%A6%9C%E0%A6%BE%E0%A6%B0%E0%A6%BF%20%E0%A6%B6%E0%A6%BF%E0%A6%AB%E0%A6%A8%20%E0%A6%95%E0%A6%BE%E0%A6%AE%E0%A6%BF%E0%A6%9C%E0%A7%87%20%E0%A6%B0%E0%A7%9F%E0%A7%87%E0%A6%9B%E0%A7%87%20%E0%A6%B8%E0%A7%82%E0%A6%95%E0%A7%8D%E0%A6%B7%E0%A7%8D%E0%A6%AE%20%E0%A6%8F%E0%A6%AE%E0%A6%AC%E0%A7%8D%E0%A6%B0%E0%A7%9F%E0%A6%A1%E0%A6%BE%E0%A6%B0%E0%A6%BF%20%E0%A6%93%20%E0%A6%B8%E0%A6%BF%E0%A6%95%E0%A7%81%E0%A7%9F%E0%A7%87%E0%A6%A8%E0%A7%8D%E0%A6%B8%E0%A7%87%E0%A6%B0%20%E0%A6%AE%E0%A6%A8%E0%A7%8B%E0%A6%AE%E0%A7%81%E0%A6%97%E0%A7%8D%E0%A6%A7%E0%A6%95%E0%A6%B0%20%E0%A6%95%E0%A6%BE%E0%A6%9C%2C%20%E0%A6%AF%E0%A6%BE%20%E0%A6%86%E0%A6%AA%E0%A6%A8%E0%A6%BE%E0%A6%95%E0%A7%87%20%E0%A6%8F%E0%A6%A8%E0%A7%87%20%E0%A6%A6%E0%A7%87%E0%A6%AC%E0%A7%87%20%E0%A6%B0%E0%A7%81%E0%A6%9A%E0%A6%BF%E0%A6%B6%E0%A7%80%E0%A6%B2%20%E0%A6%93%20%E0%A6%B0%E0%A6%BE%E0%A6%9C%E0%A6%95%E0%A7%80%E0%A7%9F%20%E0%A6%B2%E0%A7%81%E0%A6%95%E0%A5%A4%3C%2Fp%3E%3Cp%3E%E0%A6%95%E0%A6%BE%E0%A6%AE%E0%A6%BF%E0%A6%9C%3A%20%E0%A6%87%E0%A6%A8%E0%A7%8D%E0%A6%A1%E0%A6%BF%E0%A7%9F%E0%A6%BE%E0%A6%A8%20%E0%A6%B2%E0%A6%BE%E0%A6%95%E0%A6%9C%E0%A6%BE%E0%A6%B0%E0%A6%BF%20%E0%A6%B6%E0%A6%BF%E0%A6%AA%E0%A6%A8%2C%20%E0%A6%AB%E0%A7%81%E0%A6%B2%20%E0%A6%8F%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%AE%E0%A6%AC%E0%A7%8D%E0%A6%B0%E0%A6%A1%E0%A6%BE%E0%A6%B0%E0%A6%BF%20%E0%A6%93%20%E0%A6%B8%E0%A6%BF%E0%A6%95%E0%A7%81%E0%A7%9F%E0%A7%87%E0%A6%A8%E0%A7%8D%E0%A6%B8%20%E0%A6%93%E0%A7%9F%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%95%3C%2Fp%3E%3Cp%3E%E0%A6%93%E0%A7%9C%E0%A6%A8%E0%A6%BE%3A%20%E0%A6%AE%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%9A%E0%A6%BF%E0%A6%82%20%E0%A6%B2%E0%A6%BE%E0%A6%95%E0%A6%9C%E0%A6%BE%E0%A6%B0%E0%A6%BF%20%E0%A6%B6%E0%A6%BF%E0%A6%AA%E0%A6%A8%2C%20%E0%A6%B9%E0%A7%87%E0%A6%AD%E0%A6%BF%20%E0%A6%93%E0%A7%9F%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%95%20%E0%A6%B8%E0%A6%B9%3C%2Fp%3E%3Cp%3E%E0%A6%B8%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2%E0%A7%8B%E0%A7%9F%E0%A6%BE%E0%A6%B0%3A%20%E0%A6%B8%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%A8%E0%A6%9F%E0%A6%A8%20%E0%A6%95%E0%A6%BE%E0%A6%AA%E0%A7%9C%E0%A7%87%E0%A6%B0%2C%20%E0%A6%86%E0%A6%B0%E0%A6%BE%E0%A6%AE%E0%A6%A6%E0%A6%BE%E0%A7%9F%E0%A6%95%20%E0%A6%93%20%E0%A6%B8%E0%A7%8D%E0%A6%9F%E0%A6%BE%E0%A6%87%E0%A6%B2%E0%A6%BF%E0%A6%B6%3C%2Fp%3E%3Cp%3E%E0%A6%B8%E0%A6%BE%E0%A6%87%E0%A6%9C%3A%20%E0%A6%AB%E0%A7%8D%E0%A6%B0%E0%A6%BF%20%E0%A6%B8%E0%A6%BE%E0%A6%87%E0%A6%9C%20(%E0%A6%86%E0%A6%A8%E0%A6%B8%E0%A7%8D%E0%A6%9F%E0%A6%BF%E0%A6%9A%E0%A6%A1%20%E0%A6%85%E0%A6%AA%E0%A6%B6%E0%A6%A8%20%E0%A6%85%E0%A6%A8%E0%A7%81%E0%A6%AF%E0%A6%BE%E0%A7%9F%E0%A7%80)%3C%2Fp%3E" target="_blank"><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 496 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M496 256c0 137-111 248-248 248-25.6 0-50.2-3.9-73.4-11.1 10.1-16.5 25.2-43.5 30.8-65 3-11.6 15.4-59 15.4-59 8.1 15.4 31.7 28.5 56.8 28.5 74.8 0 128.7-68.8 128.7-154.3 0-81.9-66.9-143.2-152.9-143.2-107 0-163.9 71.8-163.9 150.1 0 36.4 19.4 81.7 50.3 96.1 4.7 2.2 7.2 1.2 8.3-3.3.8-3.4 5-20.3 6.9-28.1.6-2.5.3-4.7-1.7-7.1-10.1-12.5-18.3-35.3-18.3-56.6 0-54.7 41.4-107.6 112-107.6 60.9 0 103.6 41.5 103.6 100.9 0 67.1-33.9 113.6-78 113.6-24.3 0-42.6-20.1-36.7-44.8 7-29.5 20.5-61.3 20.5-82.6 0-19-10.2-34.9-31.4-34.9-24.9 0-44.9 25.7-44.9 60.2 0 22 7.4 36.8 7.4 36.8s-24.5 103.8-29 123.2c-5 21.4-3 51.6-.9 71.2C65.4 450.9 0 361.1 0 256 0 119 111 8 248 8s248 111 248 248z">
            </path>
            </svg>
        </a>
      </div>










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


