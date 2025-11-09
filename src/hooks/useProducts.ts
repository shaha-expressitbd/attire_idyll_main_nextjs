import { useGetProductsQuery } from "@/lib/api/publicApi";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";

export const useProducts = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [skip, setSkip] = useState<boolean>(true);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  const {
    data,
    isLoading,
    isError,
    error: queryError,
    refetch,
  } = useGetProductsQuery({ limit: 500 }, { skip });

  useEffect(() => {
    if (!isLoading && data) {
      setAllProducts(Array.isArray(data) ? data : []);
      setLoading(false);
      setHasFetched(true);
    }
    if (isError) {
      setError(queryError);
      setLoading(false);
    }
  }, [data, isLoading, isError, queryError]);

  const fetchProducts = () => {
    if (hasFetched) return;
    setSkip(false);
    setLoading(true);
  };

  return {
    products: allProducts,
    loading,
    error,
    fetchProducts,
    hasFetched,
  };
};
