import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionHeading } from "@/components/section-heading";
import { IconChip } from "@/components/icon-chip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { pokedex, pokedexIconMapping } from "@/lib/game8";

interface DexDetailPageProps {
  params: { dexNo: string };
}

function getTypeIcon(type: string) {
  return type ? pokedexIconMapping[`type${type}`] ?? null : null;
}

function getSpecialtyIcon(specialty: string) {
  const normalized = specialty.replace(/\s+/g, "");
  return pokedexIconMapping[`specialty${normalized}`] ?? null;
}

function getTimeIcon(time: string) {
  const normalized = time.replace(/\s+/g, "");
  return pokedexIconMapping[`time${normalized}`] ?? null;
}

function getWeatherIcon(weather: string) {
  const normalized = weather.replace(/\s+/g, "");
  return pokedexIconMapping[`weather${normalized}`] ?? null;
}

function splitTokens(value: string) {
  return value
    ? value
        .split(":")
        .map((token) => token.trim())
        .filter(Boolean)
    : [];
}

export default function DexDetailPage({ params }: DexDetailPageProps) {
  const dexNo = decodeURIComponent(params.dexNo);
  const pokemon = pokedex.find((item) => item.dexNo === dexNo);

  if (!pokemon) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6">
      <div className="mb-6">
        <Link href="/dex" className="text-sm text-muted-foreground hover:text-foreground">
          ← 도감으로 돌아가기
        </Link>
      </div>

      <SectionHeading
        eyebrow={`No. ${pokemon.dexNo}`}
        title={pokemon.name}
        description="포켓몬 상세 정보 및 서식지 조건"
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="section-card">
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="grid h-20 w-20 place-items-center rounded-3xl bg-white/80 shadow-soft">
                {pokemon.image ? (
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="h-16 w-16 object-contain"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : null}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">도감번호 #{pokemon.dexNo}</p>
                <p className="text-2xl font-semibold">{pokemon.name}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {pokemon.type1 ? (
                    <IconChip label={pokemon.type1} icon={getTypeIcon(pokemon.type1)} />
                  ) : null}
                  {pokemon.type2 ? (
                    <IconChip label={pokemon.type2} icon={getTypeIcon(pokemon.type2)} />
                  ) : null}
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Specialty
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
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

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Favorites
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {pokemon.favorites.length ? (
                  pokemon.favorites.map((favorite) => (
                    <Badge key={favorite} variant="outline">
                      {favorite}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline">TBD</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="section-card">
          <CardContent className="flex h-full flex-col gap-4">
            <p className="text-lg font-semibold">요약</p>
            <div className="text-sm text-muted-foreground">
              <p>
                서식지: {pokemon.habitats.length ? pokemon.habitats.join(" · ") : "-"}
              </p>
            </div>
            <div className="mt-auto self-end px-1 py-0.5 text-[11px] text-muted-foreground/80">
              Game8 기준 정보이며 업데이트될 수 있습니다.
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="mt-16 space-y-6">
        <SectionHeading
          eyebrow="Habitats"
          title="서식지 조건"
          description="서식지별 시간/날씨/재료 요구사항을 확인하세요."
        />

        {pokemon.details.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-white/70 p-8 text-sm text-muted-foreground">
            서식지 상세 정보가 아직 없습니다.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pokemon.details.map((detail, index) => (
              <Card key={`${pokemon.id}-${detail.name}-${index}`} className="section-card">
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="grid h-20 w-20 place-items-center rounded-3xl bg-white/80 shadow-soft">
                      {detail.image ? (
                        <img
                          src={detail.image}
                          alt={detail.name}
                          className="h-16 w-16 object-contain"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      ) : null}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{detail.name}</p>
                      {detail.rarity ? (
                        <p className="text-xs text-muted-foreground">희귀도: {detail.rarity}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                        Time
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {splitTokens(detail.time).length ? (
                          splitTokens(detail.time).map((time) => (
                            <IconChip key={`${detail.name}-${time}`} label={time} icon={getTimeIcon(time)} />
                          ))
                        ) : (
                          <IconChip label="-" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                        Weather
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {splitTokens(detail.weather).length ? (
                          splitTokens(detail.weather).map((weather) => (
                            <IconChip
                              key={`${detail.name}-${weather}`}
                              label={weather}
                              icon={getWeatherIcon(weather)}
                            />
                          ))
                        ) : (
                          <IconChip label="-" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                        Biome
                      </p>
                      <p className="mt-2">{detail.biome || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                        Materials
                      </p>
                      <p className="mt-2">{detail.materials || "-"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
