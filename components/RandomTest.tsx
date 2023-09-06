"use client";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://dummyjson.com/products?limit=5&skip=${
          (page - 1) * 5
        }&select=title,price,description`
      );
      setAllProducts((prevProducts) => [
        ...prevProducts,
        ...response.data.products,
      ]);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [page]);

  const loadMoreProducts = () => {
    // Increment the page when loading more products
    setPage((prevPage) => prevPage + 1);
  };

  const submitSearch = useCallback(async () => {
    await axios
      .get(`https://dummyjson.com/products/search?q=${searchedItem}`)
      .then((res) => {
        console.log(res.data);
      });
  }, [searchedItem]);

  useEffect(() => {
    fetchProducts();
    submitSearch();
  }, [submitSearch, fetchProducts]);

  return (
    <div className="flex flex-col justify-center items-center mt-4">
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent the form from reloading the page
          submitSearch();
        }}
      >
        <Input placeholder="search item" className="placeholder:italic" />
      </form>

      <div className="px-4 md:px-32 lg:px-42 mt-4">
        <small className="text-center">
          <p>{allProducts.length} item(s) in stock</p>
        </small>
        {allProducts.map((item) => {
          return (
            <div
              key={item.id}
              className="flex flex-col justify-center items-center border shadow-md rounded-md gap-4 p-4 mt-4"
            >
              <h1>{item.title.toUpperCase()}</h1>

              <p className="text-muted-foreground">{item.description}</p>
              <p>{item.category}</p>
              <div className="flex flex-row gap-2">
                <small className="text-green-500 font-bold">
                  ${item.price}
                </small>

                <small className="font-bold text-red-500">
                  - {item.discountPercentage}%
                </small>

                <small>{item.stock}</small>
              </div>
            </div>
          );
        })}
      </div>

      <Button onClick={loadMoreProducts}>Load More Products</Button>
    </div>
  );
}
