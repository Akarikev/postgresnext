"use client";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Image from "next/image";

type productsType = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  images: string[]; // Assuming images is an array of strings (file paths or URLs)
  brand: string;
  category: string;
  stock: number;
};

export default function RandomTest() {
  const [allProducts, setAllProducts] = useState<productsType[]>([]);
  const [searchedItem, setSearchedItem] = useState("");
  const [page, setPage] = useState(1); // Track the current page
  const [mainLoading, setMainLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://dummyjson.com/products?limit=5&skip=${
          (page - 1) * 5
        }&select=title,price,description,stock,discountPercentage,category`
      );
      setAllProducts((prevProducts) => [
        ...prevProducts,
        ...response.data.products,
      ]);

      console.log(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [page]);

  const loadMoreProducts = () => {
    // Toggle the loading state to true when loading more products
    setMainLoading(true);

    setTimeout(() => {
      setPage((prevPage) => prevPage + 1);
      // After 9 seconds (adjust the time as needed), toggle the loading state back to false
      setMainLoading(false);
    }, 4000);
  };

  const submitSearch = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://dummyjson.com/products/search?q=${searchedItem}`
      );
      setAllProducts(response.data.products); // Set the search results as the new products list
    } catch (error) {
      console.error("Error searching products:", error);
    }
  }, [searchedItem]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div>
      <h1 className="text-center mt-3 mb-3 font-extrabold text-2xl md:text-3xl lg:text-4xl text-red-400">
        SOME SHOP
      </h1>
      <div className="flex flex-col justify-center items-center mt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent the form from reloading the page
            submitSearch();
          }}
        >
          <Input
            placeholder="search item"
            className="placeholder:font-bold shadow-md"
            value={searchedItem}
            onChange={(e) => {
              setSearchedItem(e.target.value);
            }}
          />
        </form>

        <div className="px-4 md:px-32 lg:px-42 mt-4">
          <small className="text-center">
            <p>{allProducts.length} item(s) </p>
          </small>
          {allProducts.map((item) => {
            return (
              <div
                key={item.id}
                className="flex flex-col justify-center items-center border shadow-md rounded-md gap-4 p-4 mt-4"
              >
                <div className="flex flex-wrap justify-evenly gap-3">
                  {item.images?.map((imageSrc, index) => (
                    <Image
                      src={imageSrc}
                      key={index}
                      width={120}
                      height={120}
                      alt={`${item.title} Image ${index}`}
                      loading="lazy"
                      className="object-contain w-auto h-auto rounded-md shadow-md"
                    />
                  ))}
                </div>
                <h1 className="font-bold">{item.title.toUpperCase()}</h1>

                <p className="text-muted-foreground">{item.description}</p>
                <p className="font-semibold">
                  {" "}
                  Category : {item.category.toLocaleUpperCase()}
                </p>
                <div className="flex flex-row gap-2">
                  <small className="text-green-500 font-bold">
                    ${item.price}
                  </small>

                  <small className="font-bold text-red-500">
                    - {item.discountPercentage}%
                  </small>

                  <small>{item.stock} in stock</small>
                </div>
              </div>
            );
          })}
        </div>

        <Button onClick={loadMoreProducts} className="mt-3 mb-3">
          {mainLoading ? "Loading More Products..." : "Load More Products"}
        </Button>
      </div>
    </div>
  );
}
