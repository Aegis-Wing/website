"use client";

import { useState, useRef, useEffect } from "react";
import { COUNTRIES } from "../lib/countries";

export default function SearchableCountrySelect({
  value,
  onChange,
  error,
  id = "country-select",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  const selectedCountry = COUNTRIES.find((c) => c.code === value);

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase().trim()) ||
      c.code.toLowerCase().includes(search.toLowerCase().trim())
  );

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (code) => {
    onChange(code);
    setIsOpen(false);
    setSearch("");
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < filteredCountries.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCountries.length - 1
      );
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      if (filteredCountries[activeIndex]) {
        handleSelect(filteredCountries[activeIndex].code);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="country-select-wrapper"
      onKeyDown={handleKeyDown}
    >
      <button
        id={id}
        type="button"
        className={`form-control country-select-display ${error ? "has-error" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <span>
          {selectedCountry
            ? `${selectedCountry.name} (${selectedCountry.code})`
            : "- Select a country or region -"}
        </span>
        <span aria-hidden="true" style={{ fontSize: "11px", color: "var(--muted)" }}>
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <div className="country-select-dropdown" role="region" aria-label="Country search options">
          <input
            ref={searchInputRef}
            type="search"
            className="country-search-input"
            placeholder="Search 249 countries / territories..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setActiveIndex(0);
            }}
            aria-label="Filter countries"
          />
          <ul
            ref={listRef}
            className="country-options-list"
            role="listbox"
            aria-label="Countries list"
          >
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c, index) => {
                const isSelected = c.code === value;
                const isActive = index === activeIndex;
                return (
                  <li
                    key={c.code}
                    role="option"
                    aria-selected={isSelected}
                    className={`country-option-item ${
                      isSelected ? "selected" : ""
                    } ${isActive ? "active" : ""}`}
                    onClick={() => handleSelect(c.code)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <span>{c.name}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "11px", opacity: 0.7 }}>
                      {c.code}
                    </span>
                  </li>
                );
              })
            ) : (
              <li style={{ padding: "12px 14px", fontSize: "12px", color: "var(--muted)" }}>
                No countries found matching "{search}"
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
