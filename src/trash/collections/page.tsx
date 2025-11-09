// import CollectionsClient from "@/components/CollectionsClient";
// import { publicApi } from "@/lib/api/publicApi";
// import { makeStore } from "@/lib/store";
// import type { Product } from "@/types/product";

// export default async function CollectionsPage() {
//   const store = makeStore();
//   const allProducts: Product[] = [];
//   let page = 1;
//   const limit = 20;
//   const maxPages = 100; // নিরাপত্তা জন্য

//   while (page <= maxPages) {
//     const res = await store.dispatch(
//       publicApi.endpoints.getProducts.initiate({ page, limit })
//     );

//     const products: Product[] = res.data ?? [];
//     if (products.length === 0) break;

//     allProducts.push(...products);
//     page++;
//   }

//   // proxy সমস্যা এড়াতে plain object
//   const initialProducts = JSON.parse(JSON.stringify(allProducts));

//   return (
//     <div className="bg-[#FFEBF0] min-h-screen">
//       <CollectionsClient initialProducts={initialProducts} />

//     </div>
//   );
// }
