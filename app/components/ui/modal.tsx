"use client";

import { useState, ReactNode } from "react";
import { Button } from "./button";

export default function Modal({ title, children }: { title: string; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Button to Open Modal */}
      <Button
        onClick={() => setIsOpen(true)}
        variant={"outline"}
      >
        {title}
      </Button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white md:w-3/4 w-full max-h-[90vh] p-6 rounded-lg shadow-lg relative overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-bold">{title}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
              {children}
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
