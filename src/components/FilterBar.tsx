import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import "../styles/FilterBar.css";

interface FilterBarProps {
  onFilterChange: (filters: { category?: string; tag?: string }) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    fetchFilters();
  }, []);

  async function fetchFilters() {
    // Fetch unique categories
    const { data: categoryData } = await supabase
      .from("blogs")
      .select("category")
      .eq("published", true);

    // Fetch all tags and flatten them
    const { data: tagData } = await supabase
      .from("blogs")
      .select("tags")
      .eq("published", true);

    if (categoryData) {
      const uniqueCategories = [
        ...new Set(categoryData.map((item) => item.category)),
      ];
      setCategories(uniqueCategories);
    }

    if (tagData) {
      const allTags = tagData.flatMap((item) => item.tags);
      const uniqueTags = [...new Set(allTags)];
      setTags(uniqueTags);
    }
  }

  const handleFilterChange = () => {
    onFilterChange({
      category: selectedCategory,
      tag: selectedTag,
    });
  };

  return (
    <div className="filter-bar">
      <select
        value={selectedCategory}
        onChange={(e) => {
          setSelectedCategory(e.target.value);
          handleFilterChange();
        }}
        className="filter-select"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
        value={selectedTag}
        onChange={(e) => {
          setSelectedTag(e.target.value);
          handleFilterChange();
        }}
        className="filter-select"
      >
        <option value="">All Tags</option>
        {tags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
    </div>
  );
}
