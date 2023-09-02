"use client";

import React, { useEffect, useState } from "react";
import { prisma } from "@/lib/prisma";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type UserProps = {
  id: number;
  name: string;
  email: string;
};

const User: React.FC = () => {
  const [sendUserName, setSendUserName] = useState("");
  const [sendUserEmail, setSendUserEmail] = useState("");
  const [user, setUser] = useState<UserProps[]>([]);

  async function createUser() {
    try {
      const newUser = await prisma.user.create({
        data: {
          name: sendUserName,
          email: sendUserEmail,
        },
      });
      // Assuming `newUser` contains the newly created user data.
      setUser((prevUsers) => [...prevUsers, newUser]); // Add the new user to the list
    } catch (error) {
      console.error("Error while creating user:", error);
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/users");
        await new Promise((resolve) => setTimeout(resolve, 3000));
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

        <div>
          {user.map((userData) => {
            return (
              <div key={userData.id}>
                <li>{userData.name}</li>
                <li>{userData.email}</li>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default User;
