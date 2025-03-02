"use client";

import Link from "next/link";
import { useState, useEffect, ReactNode } from "react";
import Modal from "./modal";

interface TableProps<T> {
  data: T[];
  columns: (keyof T)[];
  itemsPerPage?: number;
  title:string
  renderModalContent?: (row: T) => React.ReactNode;
}

export default function Table<
  T extends {
    [x: string]: ReactNode;
    _id: string | number;
  }
>({ data, columns,title, itemsPerPage = 5, renderModalContent }: TableProps<T>) {
  const [sortedData, setSortedData] = useState<T[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let filteredData = data.filter((row) =>
      Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    if (sortConfig.key !== null) {
      filteredData = [...filteredData].sort((a, b) => {
        const key = sortConfig.key as keyof T;
        const valueA = a[key];
        const valueB = b[key];

        // Ensure values are not null/undefined
        if (valueA == null) return 1; // Move null/undefined to the end
        if (valueB == null) return -1;

        return sortConfig.direction === "asc"
          ? valueA > valueB
            ? 1
            : -1
          : valueA < valueB
          ? 1
          : -1;
      });
    }

    setSortedData(filteredData);
  }, [data, searchQuery, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (column: keyof T) => {
    setSortConfig((prev) => ({
      key: column,
      direction:
        prev.key === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Product List</h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded-lg w-64 shadow-sm focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              {columns.map((column) => (
                <th
                  key={String(column)}
                  className="px-6 py-3 text-left uppercase font-semibold text-sm cursor-pointer"
                  onClick={() => handleSort(column)}
                >
                  {String(column)}{" "}
                  {sortConfig.key === column
                    ? sortConfig.direction === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-100 transition duration-200"
              >
                {columns.map((column, idx) => (
                  <td key={idx} className="px-6 py-4 text-gray-700">
                    {column === "modalContent" ? (
                      <Modal title={title}>{row.modalContent}</Modal>
                    ) : (
                      String(row[column])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
