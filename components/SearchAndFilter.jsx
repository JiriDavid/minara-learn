"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchAndFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    } else {
      params.delete("q");
    }

    router.push(`/courses?${params.toString()}`);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");

    router.push(`/courses?${params.toString()}`);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-6">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search courses by title, category, or keyword..."
            className="pl-10 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit" variant="primary">
          Search
        </Button>
      </form>
    </div>
  );
}
