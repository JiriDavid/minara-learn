"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  X,
  Check,
  ChevronDown,
  SlidersHorizontal,
  BarChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Fallback categories and levels if metadata is not provided
const defaultCategories = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Geography",
  "Computer Science",
  "Art",
  "Music",
  "Physical Education",
  "Business",
  "Economics",
  "Physics",
  "Chemistry",
  "Biology",
  "Literature",
];

const defaultLevels = ["Beginner", "Intermediate", "Advanced"];

const CourseFilters = ({ onFilterChange, initialFilters, metadata }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Use categories and levels from metadata if available
  const categories = metadata?.categories || defaultCategories;
  const levels = metadata?.levels || defaultLevels;

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    categories:
      searchParams.get("categories")?.split(",").filter(Boolean) || [],
    levels: searchParams.get("levels")?.split(",").filter(Boolean) || [],
    minPrice: parseInt(searchParams.get("minPrice") || "0"),
    maxPrice: parseInt(searchParams.get("maxPrice") || "100"),
    sort: searchParams.get("sort") || "newest",
    hasFreeOption: searchParams.get("hasFreeOption") === "true",
    hasDiscount: searchParams.get("hasDiscount") === "true",
  });

  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([
    filters.minPrice,
    filters.maxPrice,
  ]);

  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Popular", value: "popular" },
    { label: "Top Rated", value: "rating" },
  ];

  // Create an active filter count to display on mobile
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.levels.length > 0) count++;
    if (filters.minPrice > 0 || filters.maxPrice < 100) count++;
    if (filters.hasFreeOption) count++;
    if (filters.hasDiscount) count++;
    return count;
  };

  // Update URL with filters
  useEffect(() => {
    // Only update URL when filters change after initial load
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.categories.length)
      params.set("categories", filters.categories.join(","));
    if (filters.levels.length) params.set("levels", filters.levels.join(","));
    if (filters.minPrice > 0)
      params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice < 100)
      params.set("maxPrice", filters.maxPrice.toString());
    if (filters.sort !== "newest") params.set("sort", filters.sort);
    if (filters.hasFreeOption) params.set("hasFreeOption", "true");
    if (filters.hasDiscount) params.set("hasDiscount", "true");

    const queryString = params.toString();

    // Replace the URL with the new query string
    router.push(queryString ? `?${queryString}` : "/courses", {
      scroll: false,
    });

    // Call the callback to update parent component
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [filters, router, onFilterChange]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    setFilters((prev) => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: newCategories };
    });
  };

  // Handle level selection
  const handleLevelChange = (level) => {
    setFilters((prev) => {
      const newLevels = prev.levels.includes(level)
        ? prev.levels.filter((l) => l !== level)
        : [...prev.levels, level];
      return { ...prev, levels: newLevels };
    });
  };

  // Handle price range change
  const handlePriceChange = (values) => {
    setPriceRange(values);
  };

  // Apply price range when user stops dragging
  const handlePriceChangeEnd = () => {
    setFilters({
      ...filters,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  // Handle sort change
  const handleSortChange = (value) => {
    setFilters({ ...filters, sort: value });
  };

  // Toggle free courses option
  const toggleFreeOption = (checked) => {
    setFilters({ ...filters, hasFreeOption: checked });
  };

  // Toggle discounted courses option
  const toggleDiscountOption = (checked) => {
    setFilters({ ...filters, hasDiscount: checked });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      search: "",
      categories: [],
      levels: [],
      minPrice: 0,
      maxPrice: 100,
      sort: "newest",
      hasFreeOption: false,
      hasDiscount: false,
    });
    setPriceRange([0, 100]);
  };

  // Remove a specific filter
  const removeFilter = (filterType, value) => {
    if (filterType === "category") {
      setFilters({
        ...filters,
        categories: filters.categories.filter((cat) => cat !== value),
      });
    } else if (filterType === "level") {
      setFilters({
        ...filters,
        levels: filters.levels.filter((lvl) => lvl !== value),
      });
    } else if (filterType === "price") {
      setFilters({
        ...filters,
        minPrice: 0,
        maxPrice: 100,
      });
      setPriceRange([0, 100]);
    } else if (filterType === "free") {
      setFilters({ ...filters, hasFreeOption: false });
    } else if (filterType === "discount") {
      setFilters({ ...filters, hasDiscount: false });
    }
  };

  // Filter Pills component to show active filters
  const FilterPills = () => {
    const activeFilters = [];

    filters.categories.forEach((cat) => {
      activeFilters.push({ type: "category", value: cat });
    });

    filters.levels.forEach((lvl) => {
      activeFilters.push({ type: "level", value: lvl });
    });

    if (filters.minPrice > 0 || filters.maxPrice < 100) {
      activeFilters.push({
        type: "price",
        value: `$${filters.minPrice} - $${filters.maxPrice}`,
      });
    }

    if (filters.hasFreeOption) {
      activeFilters.push({ type: "free", value: "Free Courses" });
    }

    if (filters.hasDiscount) {
      activeFilters.push({ type: "discount", value: "Discounted" });
    }

    if (activeFilters.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {activeFilters.map((filter, idx) => (
          <Badge
            key={idx}
            variant="outline"
            className="px-2 py-1 bg-background"
          >
            {filter.value}
            <button
              onClick={() => removeFilter(filter.type, filter.value)}
              className="ml-1"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-7 px-2 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        {/* Search Bar */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses..."
            className="pl-10 w-full"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                <span className="hidden sm:inline-block">Sort by:</span>
                <span className="font-medium">
                  {sortOptions.find((opt) => opt.value === filters.sort)?.label}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={cn(
                    "flex items-center justify-between cursor-pointer",
                    filters.sort === option.value && "font-medium"
                  )}
                >
                  {option.label}
                  {filters.sort === option.value && (
                    <Check className="h-4 w-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Filter Button (Mobile) */}
        <div className="md:hidden">
          <Button
            variant="outline"
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className="flex items-center gap-2 relative"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {getActiveFilterCount() > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                {getActiveFilterCount()}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filters Button (Desktop) */}
        <div className="hidden md:block">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 relative"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
                {getActiveFilterCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm">Filter Courses</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-8 px-2 text-xs"
                  >
                    Clear all
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <Accordion
                    type="multiple"
                    className="w-full"
                    defaultValue={["categories", "levels", "price"]}
                  >
                    {/* Categories */}
                    <AccordionItem value="categories">
                      <AccordionTrigger className="text-sm py-2">
                        Categories
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                          {categories.map((category) => (
                            <div
                              key={category}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`category-${category}`}
                                checked={filters.categories.includes(category)}
                                onCheckedChange={() =>
                                  handleCategoryChange(category)
                                }
                              />
                              <Label
                                htmlFor={`category-${category}`}
                                className="text-sm cursor-pointer"
                              >
                                {category}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Levels */}
                    <AccordionItem value="levels">
                      <AccordionTrigger className="text-sm py-2">
                        Levels
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {levels.map((level) => (
                            <div
                              key={level}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`level-${level}`}
                                checked={filters.levels.includes(level)}
                                onCheckedChange={() => handleLevelChange(level)}
                              />
                              <Label
                                htmlFor={`level-${level}`}
                                className="text-sm cursor-pointer"
                              >
                                {level}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Price Range */}
                    <AccordionItem value="price">
                      <AccordionTrigger className="text-sm py-2">
                        Price Range
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="pt-2">
                            <Slider
                              defaultValue={[
                                filters.minPrice,
                                filters.maxPrice,
                              ]}
                              value={priceRange}
                              max={100}
                              step={1}
                              onValueChange={handlePriceChange}
                              onValueCommit={handlePriceChangeEnd}
                              className="my-4"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">${priceRange[0]}</span>
                            <span className="text-sm">${priceRange[1]}</span>
                          </div>
                          <div className="pt-2 space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="free-courses"
                                checked={filters.hasFreeOption}
                                onCheckedChange={toggleFreeOption}
                              />
                              <Label
                                htmlFor="free-courses"
                                className="text-sm cursor-pointer"
                              >
                                Free Courses
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="discounted"
                                checked={filters.hasDiscount}
                                onCheckedChange={toggleDiscountOption}
                              />
                              <Label
                                htmlFor="discounted"
                                className="text-sm cursor-pointer"
                              >
                                Discounted Courses
                              </Label>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Filter Pills */}
      <FilterPills />

      {/* Mobile Filter Menu */}
      {isFilterMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-background z-50 overflow-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsFilterMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h3 className="font-medium mb-2">Categories</h3>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mobile-category-${category}`}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
                      />
                      <Label
                        htmlFor={`mobile-category-${category}`}
                        className="text-sm cursor-pointer"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Levels */}
              <div>
                <h3 className="font-medium mb-2">Levels</h3>
                <div className="space-y-2">
                  {levels.map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mobile-level-${level}`}
                        checked={filters.levels.includes(level)}
                        onCheckedChange={() => handleLevelChange(level)}
                      />
                      <Label
                        htmlFor={`mobile-level-${level}`}
                        className="text-sm cursor-pointer"
                      >
                        {level}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="space-y-4">
                  <div className="pt-2">
                    <Slider
                      defaultValue={[filters.minPrice, filters.maxPrice]}
                      value={priceRange}
                      max={100}
                      step={1}
                      onValueChange={handlePriceChange}
                      onValueCommit={handlePriceChangeEnd}
                      className="my-4"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">${priceRange[0]}</span>
                    <span className="text-sm">${priceRange[1]}</span>
                  </div>
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mobile-free-courses"
                        checked={filters.hasFreeOption}
                        onCheckedChange={toggleFreeOption}
                      />
                      <Label
                        htmlFor="mobile-free-courses"
                        className="text-sm cursor-pointer"
                      >
                        Free Courses
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mobile-discounted"
                        checked={filters.hasDiscount}
                        onCheckedChange={toggleDiscountOption}
                      />
                      <Label
                        htmlFor="mobile-discounted"
                        className="text-sm cursor-pointer"
                      >
                        Discounted Courses
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="font-medium mb-2">Sort By</h3>
                <RadioGroup
                  value={filters.sort}
                  onValueChange={handleSortChange}
                  className="space-y-2"
                >
                  {sortOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`sort-${option.value}`}
                      />
                      <Label
                        htmlFor={`sort-${option.value}`}
                        className="text-sm cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="pt-4 space-x-2 flex">
                <Button
                  className="flex-1"
                  onClick={() => {
                    setIsFilterMenuOpen(false);
                  }}
                >
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear All
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseFilters;
