"use client";

import { useMemo, useState } from "react";

import { SectionHeading } from "@/components/section-heading";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { items } from "@/lib/pokopiawiki";

export default function MaterialsPage() {
  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category).filter(Boolean))),
    []
  );
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("전체");
  const filteredItems = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory =
        activeCategory === "전체" || item.category === activeCategory;
      const haystack = `${item.name} ${item.description || ""}`.toLowerCase();
      const matchesSearch = !needle || haystack.includes(needle);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6">
      <SectionHeading
        eyebrow="Items"
        title="아이템 도감"
        description="Pokopia Wiki 기준 아이템 데이터를 기반으로 이미지와 함께 제공합니다."
      />

      <div className="mt-8 rounded-3xl border border-border bg-white/80 p-6 shadow-soft">
        <Input
          placeholder="아이템 이름 검색"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("전체")}
            className={cn(
              badgeVariants({
                variant: activeCategory === "전체" ? "accent" : "outline",
              })
            )}
          >
            전체
          </button>
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActiveCategory(item)}
              className={cn(
                badgeVariants({
                  variant: activeCategory === item ? "accent" : "outline",
                })
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.slug || item.name} className="section-card">
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/80 shadow-soft">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 object-contain"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : null}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">아이템</p>
                  <p className="text-lg font-semibold">{item.name}</p>
                </div>
              </div>
              {item.description ? (
                <p className="text-sm text-muted-foreground">{item.description}</p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{item.category || "미분류"}</Badge>
                {item.map ? (
                  <Badge variant="outline">Location: {item.map}</Badge>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
