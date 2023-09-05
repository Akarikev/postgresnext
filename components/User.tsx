"use client";

import React, { useEffect, useState, useCallback } from "react";
import { prisma } from "@/lib/prisma";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";

type UserProps = {
  id: number;
  name: string;
  email: string;
};

const User: React.FC = () => {
  const [sendUserName, setSendUserName] = useState("");
  const [searchUserName, setSearchUserName] = useState("");
  const [searchResults, setSearchResults] = useState<UserProps[]>([]);
  const [sendUserEmail, setSendUserEmail] = useState("");
  const [user, setUser] = useState<UserProps[]>([]);

  async function createUser() {
    axios
      .post(`api/users`, {
        name: sendUserName,
        email: sendUserEmail,
      })
      .then((response) => {
        setSendUserEmail("");
        setSendUserName("");
        console.log(response.data);
      });
  }

  const searchUser = useCallback(async () => {
    try {
      const response = await axios.get(`api/users?search=${searchUserName}`);
      setSearchResults(response.data); // Replace previous results with the new results
      console.log(response.data);
    } catch (error) {
      console.error("Error searching for users:", error);
    }
  }, [searchUserName]);

  async function deleteUser(id: any) {
    try {
      const response = await axios.delete(`api/users/${id}`);
      console.log(response.data);

      // Update the user state to remove the deleted user
      setUser((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error: any) {
      // Handle errors as you were doing previously
    }
  }

  useEffect(() => {
    searchUser();
  }, [searchUser]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/users", { cache: "no-store" });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error while fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <form
        className="flex mt-4 flex-col mb:4 gap-y-3 md:px-32 lg:px-42 px-12"
        onSubmit={(e) => {
          e.preventDefault(); // Prevent the form from reloading the page
          searchUser();
        }}
      >
        <Input
          placeholder="search"
          className="mb-4"
          value={searchUserName}
          onChange={(e) => {
            setSearchUserName(e.target.value);
            console.log(e.target.value);
          }}
        />

        <Button type="submit">Search</Button>
      </form>
      <h2 className="text-center">Search Results:</h2>
      <ul className="shadow-md text-center mt-4 mb-4 rounded-md border lg:ml-10 lg:mr-10 flex flex-col justify-center items-center">
        {searchResults
          .filter((user) => searchUserName === user.name)
          .map((user) => (
            <div key={user.id}>
              <li>{user.name}</li>
            </div>
          ))}
        <small>{`${
          searchResults.filter((u) => u.name === searchUserName).length
        } result found`}</small>
      </ul>
      <div>
        <h1 className="text-3xl font-bold text-center uppercase mb-4">
          Submit Details
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent the form from reloading the page
            createUser();
          }}
          className="flex flex-col gap-y-3 md:px-32 lg:px-42 px-12"
        >
          <Input
            type="text"
            onChange={(e) => {
              setSendUserName(e.target.value);
            }}
            value={sendUserName}
            placeholder="Name"
          />
          <Input
            type="email"
            onChange={(e) => {
              setSendUserEmail(e.target.value);
            }}
            value={sendUserEmail}
            placeholder="Email"
          />
          <Button type="submit">Submit Details</Button>
        </form>

        <h1 className="text-3xl font-bold text-center uppercase mb-4 mt-3">
          USERS
        </h1>

        <div className="flex flex-col justify-center items-center gap-4">
          {user.map((userData) => {
            return (
              <div key={userData.id}>
                <p>Name: {userData.name}</p>
                <li> Email: {userData.email}</li>
                <Button onClick={() => deleteUser(userData.id)}>
                  Delete user
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default User;
