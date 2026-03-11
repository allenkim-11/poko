"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { IconChip } from "@/components/icon-chip";
import { pokedex, pokedexCount, pokedexIconMapping } from "@/lib/game8";

function getTypeIcon(type: string) {
  return type ? pokedexIconMapping[`type${type}`] ?? null : null;
}

function getSpecialtyIcon(specialty: string) {
  const normalized = specialty.replace(/\s+/g, "");
  return pokedexIconMapping[`specialty${normalized}`] ?? null;
}

export default function DexPage() {
  const [query, setQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  const typeFilters = useMemo(() => {
    const set = new Set<string>();
    pokedex.forEach((pokemon) => {
      if (pokemon.type1) set.add(pokemon.type1);
      if (pokemon.type2) set.add(pokemon.type2);
    });
    return Array.from(set).sort();
  }, []);

  const specialtyFilters = useMemo(() => {
    const set = new Set<string>();
    pokedex.forEach((pokemon) => {
      pokemon.specialties.forEach((specialty) => set.add(specialty));
    });
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return pokedex.filter((pokemon) => {
      const matchesType =
        selectedTypes.length === 0 ||
        [pokemon.type1, pokemon.type2].some((type) =>
          type ? selectedTypes.includes(type) : false
        );
      const matchesSpecialty =
        selectedSpecialties.length === 0 ||
        pokemon.specialties.some((specialty) =>
          selectedSpecialties.includes(specialty)
        );

      if (!matchesType || !matchesSpecialty) return false;

      if (!normalizedQuery) return true;

      const searchBlob = [
        pokemon.name,
        pokemon.dexNo,
        pokemon.type1,
        pokemon.type2,
        pokemon.specialties.join(" "),
        pokemon.habitats.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return searchBlob.includes(normalizedQuery);
    });
  }, [query, selectedTypes, selectedSpecialties]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  };

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((item) => item !== specialty)
        : [...prev, specialty]
    );
  };

  const resetTypes = () => setSelectedTypes([]);
  const resetSpecialties = () => setSelectedSpecialties([]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6">
      <SectionHeading
        eyebrow="Dex"
        title="포켓몬 도감"
        description={`총 ${pokedexCount}종 포켓몬을 도감번호 기준으로 제공합니다.`}
      />

      <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-border bg-white/80 p-6 shadow-soft">
        <div className="flex flex-row items-center gap-3">
          <Input
            placeholder="포켓몬 이름, 특기, 타입 검색"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="flex-1"
          />
          <Button size="lg" onClick={() => setQuery(query)}>
            검색
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Type
              </p>
              <IconChip
                label="전체"
                asButton
                active={selectedTypes.length === 0}
                onClick={resetTypes}
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {typeFilters.map((type) => (
                <IconChip
                  key={type}
                  label={type}
                  icon={getTypeIcon(type)}
                  asButton
                  active={selectedTypes.includes(type)}
                  onClick={() => toggleType(type)}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Specialty
              </p>
              <IconChip
                label="전체"
                asButton
                active={selectedSpecialties.length === 0}
                onClick={resetSpecialties}
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {specialtyFilters.map((specialty) => (
                <IconChip
                  key={specialty}
                  label={specialty}
                  icon={getSpecialtyIcon(specialty)}
                  asButton
                  active={selectedSpecialties.includes(specialty)}
                  onClick={() => toggleSpecialty(specialty)}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">필터 결과: {filtered.length}건</p>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-border bg-white/70 p-10 text-center text-sm text-muted-foreground">
          조건에 맞는 포켓몬이 없습니다.
        </div>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pokemon) => (
            <Card key={pokemon.id} className="section-card">
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/80 shadow-soft">
                    {pokemon.image ? (
                      <img
                        src={pokemon.image}
                        alt={pokemon.name}
                        className="h-12 w-12 object-contain"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : null}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">도감번호 #{pokemon.dexNo}</p>
                    <p className="text-lg font-semibold">{pokemon.name}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Type
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pokemon.type1 ? (
                      <IconChip label={pokemon.type1} icon={getTypeIcon(pokemon.type1)} />
                    ) : null}
                    {pokemon.type2 ? (
                      <IconChip label={pokemon.type2} icon={getTypeIcon(pokemon.type2)} />
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Specialty
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pokemon.specialties.length ? (
                      pokemon.specialties.map((specialty) => (
                        <IconChip
                          key={`${pokemon.id}-${specialty}`}
                          label={specialty}
                          icon={getSpecialtyIcon(specialty)}
                        />
                      ))
                    ) : (
                      <IconChip label="TBD" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Habitat
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pokemon.details.length ? (
                      pokemon.details.slice(0, 2).map((detail, index) => (
                        <IconChip
                          key={`${pokemon.id}-habitat-${detail.name}-${index}`}
                          label={detail.name}
                          icon={detail.image}
                        />
                      ))
                    ) : (
                      <IconChip label={pokemon.habitats.join(" · ") || "-"} />
                    )}
                  </div>
                </div>

                <Button asChild variant="outline" className="w-full">
                  <Link href={`/dex/${encodeURIComponent(pokemon.dexNo)}`}>
                    상세 보기
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
