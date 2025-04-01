"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export default function CoursesFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [openSections, setOpenSections] = useState({
    category: true,
    level: true,
    price: true,
    rating: true,
  });

  // Get current filters from URL
  const category = searchParams.get("category") || "";
  const level = searchParams.get("level") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const minRating = searchParams.get("minRating") || "";

  const categories = [
    { id: "programming", name: "Programming" },
    { id: "data-science", name: "Data Science" },
    { id: "web-development", name: "Web Development" },
    { id: "mobile-development", name: "Mobile Development" },
    { id: "devops", name: "DevOps" },
    { id: "cyber-security", name: "Cyber Security" },
    { id: "artificial-intelligence", name: "Artificial Intelligence" },
    { id: "business", name: "Business" },
    { id: "design", name: "Design" },
    { id: "marketing", name: "Marketing" },
    { id: "other", name: "Other" },
  ];

  const levels = [
    { id: "beginner", name: "Beginner" },
    { id: "intermediate", name: "Intermediate" },
    { id: "advanced", name: "Advanced" },
    { id: "all-levels", name: "All Levels" },
  ];

  const priceRanges = [
    { id: "free", name: "Free", min: "0", max: "0" },
    { id: "paid", name: "Paid", min: "0.01", max: "" },
    { id: "under-50", name: "Under $50", min: "0.01", max: "50" },
    { id: "50-100", name: "$50 - $100", min: "50", max: "100" },
    { id: "over-100", name: "Over $100", min: "100", max: "" },
  ];

  const ratings = [
    { id: "4.5", name: "4.5 & up", value: "4.5" },
    { id: "4.0", name: "4.0 & up", value: "4.0" },
    { id: "3.5", name: "3.5 & up", value: "3.5" },
    { id: "3.0", name: "3.0 & up", value: "3.0" },
  ];

  const toggleSection = (section) => {
    setOpenSections({
      ...openSections,
      [section]: !openSections[section],
    });
  };

  const applyFilter = (filterType, value) => {
    const params = new URLSearchParams(searchParams.toString());

    // Handle price ranges separately
    if (filterType === "price") {
      const priceRange = priceRanges.find((range) => range.id === value);
      if (priceRange) {
        if (priceRange.min) params.set("minPrice", priceRange.min);
        else params.delete("minPrice");

        if (priceRange.max) params.set("maxPrice", priceRange.max);
        else params.delete("maxPrice");
      }
    } else {
      if (value) {
        params.set(filterType, value);
      } else {
        params.delete(filterType);
      }
    }

    router.push(`/courses?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/courses");
  };

  // Check if any filters are applied
  const hasFilters = category || level || minPrice || maxPrice || minRating;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Filters
        </h2>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Applied filters */}
      {hasFilters && (
        <div className="mb-6">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Applied Filters:
          </div>
          <div className="flex flex-wrap gap-2">
            {category && (
              <Badge variant="outline" className="flex items-center">
                {categories.find((c) => c.id === category)?.name || category}
                <button
                  onClick={() => applyFilter("category", "")}
                  className="ml-1 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </Badge>
            )}
            {level && (
              <Badge variant="outline" className="flex items-center">
                {levels.find((l) => l.id === level)?.name || level}
                <button
                  onClick={() => applyFilter("level", "")}
                  className="ml-1 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </Badge>
            )}
            {(minPrice || maxPrice) && (
              <Badge variant="outline" className="flex items-center">
                {minPrice === "0" && maxPrice === "0"
                  ? "Free"
                  : minPrice && maxPrice
                  ? `$${minPrice} - $${maxPrice}`
                  : minPrice
                  ? `From $${minPrice}`
                  : `Up to $${maxPrice}`}
                <button
                  onClick={() => {
                    applyFilter("price", "");
                  }}
                  className="ml-1 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </Badge>
            )}
            {minRating && (
              <Badge variant="outline" className="flex items-center">
                {minRating}+ Stars
                <button
                  onClick={() => applyFilter("minRating", "")}
                  className="ml-1 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
        <button
          className="flex justify-between items-center w-full text-left font-medium text-slate-800 dark:text-white"
          onClick={() => toggleSection("category")}
        >
          <span>Category</span>
          {openSections.category ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {openSections.category && (
          <div className="mt-3 space-y-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${cat.id}`}
                  checked={category === cat.id}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      applyFilter("category", cat.id);
                    } else {
                      applyFilter("category", "");
                    }
                  }}
                />
                <label
                  htmlFor={`category-${cat.id}`}
                  className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer"
                >
                  {cat.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Level filter */}
      <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
        <button
          className="flex justify-between items-center w-full text-left font-medium text-slate-800 dark:text-white"
          onClick={() => toggleSection("level")}
        >
          <span>Level</span>
          {openSections.level ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {openSections.level && (
          <div className="mt-3 space-y-2">
            {levels.map((lvl) => (
              <div key={lvl.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`level-${lvl.id}`}
                  checked={level === lvl.id}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      applyFilter("level", lvl.id);
                    } else {
                      applyFilter("level", "");
                    }
                  }}
                />
                <label
                  htmlFor={`level-${lvl.id}`}
                  className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer"
                >
                  {lvl.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price filter */}
      <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
        <button
          className="flex justify-between items-center w-full text-left font-medium text-slate-800 dark:text-white"
          onClick={() => toggleSection("price")}
        >
          <span>Price</span>
          {openSections.price ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {openSections.price && (
          <div className="mt-3 space-y-2">
            {priceRanges.map((range) => (
              <div key={range.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`price-${range.id}`}
                  checked={
                    minPrice === range.min &&
                    (maxPrice === range.max || (!range.max && !maxPrice))
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      applyFilter("price", range.id);
                    } else {
                      applyFilter("price", "");
                    }
                  }}
                />
                <label
                  htmlFor={`price-${range.id}`}
                  className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer"
                >
                  {range.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating filter */}
      <div>
        <button
          className="flex justify-between items-center w-full text-left font-medium text-slate-800 dark:text-white"
          onClick={() => toggleSection("rating")}
        >
          <span>Rating</span>
          {openSections.rating ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {openSections.rating && (
          <div className="mt-3 space-y-2">
            {ratings.map((rating) => (
              <div key={rating.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating.id}`}
                  checked={minRating === rating.value}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      applyFilter("minRating", rating.value);
                    } else {
                      applyFilter("minRating", "");
                    }
                  }}
                />
                <label
                  htmlFor={`rating-${rating.id}`}
                  className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer"
                >
                  {rating.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
