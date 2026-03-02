"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Button, Input, Chip } from "@heroui/react";
import { Search, X } from "lucide-react";

interface BlogFilterProps {
  tags: string[];
  currentTag?: string;
  currentQ?: string;
}

export default function BlogFilter({
  tags,
  currentTag,
  currentQ,
}: BlogFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(currentQ ?? "");

  function push(q: string, tag: string | undefined) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (tag) params.set("tag", tag);
    router.push(`${pathname}${params.size ? "?" + params.toString() : ""}`);
  }

  const hasFilter = !!query || !!currentTag;

  return (
    <div className="mb-8 flex flex-col gap-4">
      {/* Search row */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Search articles…"
          value={query}
          onValueChange={setQuery}
          onKeyDown={(e) => e.key === "Enter" && push(query, currentTag)}
          startContent={<Search size={14} className="text-gray-400" />}
          radius="full"
          classNames={{ base: "max-w-sm", inputWrapper: "border border-gray-200 bg-white shadow-none" }}
        />
        <Button
          color="primary"
          radius="full"
          onPress={() => push(query, currentTag)}
        >
          Search
        </Button>
        {hasFilter && (
          <Button
            variant="bordered"
            radius="full"
            size="sm"
            startContent={<X size={12} />}
            onPress={() => {
              setQuery("");
              push("", undefined);
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Tag pills */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Chip
            onClick={() => push(query, undefined)}
            variant={!currentTag ? "solid" : "flat"}
            color={!currentTag ? "primary" : "default"}
            className="cursor-pointer"
          >
            All
          </Chip>
          {tags.map((tag) => (
            <Chip
              key={tag}
              onClick={() => push(query, tag === currentTag ? undefined : tag)}
              variant={tag === currentTag ? "solid" : "flat"}
              color={tag === currentTag ? "primary" : "default"}
              className="cursor-pointer"
            >
              {tag}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}
