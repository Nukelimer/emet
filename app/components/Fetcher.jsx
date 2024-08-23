"use client";

import React, { useState, useEffect } from "react";
import { queryTransactionsGQL } from "arweavekit/graphql";
import { DropdownMenuFilter } from "./Filter";
import { Skeleton } from "@/components/ui/skeleton";

function Fetcher() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownVal, setDropdownVal] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const queryString = `
        query {
          transactions(
            first: 200,
            tags: [
              {
                name: "Derivation",
                values: [
                  "Allowed-With-Indication",
                   "Allowed-With-Credit",
                   "Allowed-With-License-Passthrough",
                  "Allowed-With-RevenueShare-[.0-9+]%",
                  "[Before/After]-[0-9+]-Years-Derivation"
                
                 
                ]
              }
            ]
          ) {
            edges {
              node {
                id
                tags {
                  name
                  value
                }
              }
            }
          }
        }
      `;

      const options = { gateway: "arweave.net", filter: {} };

      try {
        setLoading(true);

        const response = await queryTransactionsGQL(queryString, options);
        console.log("Raw Response:", response);

        setData(response);
      } catch (err) {
        setError(
          "An error occurred while fetching data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = data?.data?.filter(
    (edge) =>
      dropdownVal === "" ||
      edge.node.tags.some(
        (tag) => tag.name === "Derivation" && tag.value === dropdownVal
      )
  );

  return (
    <div className="container flex flex-col items-center mx-auto p-4 gap-6">
      <h1 className="pt-6 text-3xl text-center">
        Fetched Arweave UDL Transactions:{" "}
        <span className="font-bold">{data?.data?.length}</span>.
      </h1>
      <DropdownMenuFilter setDropdownVal={setDropdownVal} className="w-fit" />
      {loading ? (
        <div className="text-center text-gray-500 flex items-center flex-col">
          <div className="flex flex-col space-y-3 gap-6">
            {Array.from({ length: 20 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-[325px] w-[800px] rounded-xl container"
              />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : data?.data?.length > 0 ? (
        <>
          {dropdownVal && (
            <p>
              {dropdownVal} results: {filteredData?.length || 0}
            </p>
          )}
          <ul className="space-y-4">
            {filteredData?.map((edge) => (
              <li
                key={edge.node.id}
                className="border p-4 rounded bg-gray-100 shadow-md">
                <strong className="block mb-2">Transaction ID:</strong>
                <span className="text-blue-600">{edge.node.id}</span>
                <ul className="mt-2">
                  {edge.node.tags.map((tag, tagIdx) => (
                    <li key={tagIdx} className="text-gray-700">
                      {tag.name}:{" "}
                      <span className="font-medium">
                        {tag.name === "Unix-Time"
                          ? new Date(tag.value * 1000).toLocaleString("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                              second: "numeric",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour12: true,
                            })
                          : tag.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="text-center text-gray-500">No transactions found.</div>
      )}
    </div>
  );
}

export default Fetcher;
