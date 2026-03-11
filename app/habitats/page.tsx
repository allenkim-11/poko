import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { habitats, pokedex } from "@/lib/game8";

const pokemonImageMap = new Map(
  pokedex.map((pokemon) => [pokemon.name, pokemon.image])
);

export default function HabitatsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6">
      <SectionHeading
        eyebrow="Habitat Dex"
        title="서식지 도감"
        description="도감번호 순으로 정리된 서식지, 재료, 출현 포켓몬 정보를 제공합니다."
      />

      <div className="mt-8 rounded-3xl border border-border bg-white/80 p-6 shadow-soft">
        <Input placeholder="서식지 이름, 포켓몬 검색" />
        <div className="mt-4 flex flex-wrap gap-2">
          {"전체, 초원, 숲, 바다, 동굴, 특수".split(", ").map((item) => (
            <Badge key={item} variant={item === "전체" ? "accent" : "outline"}>
              {item}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {habitats.map((habitat) => (
          <Card key={habitat.dexNo} className="section-card">
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/80 shadow-soft">
                  {habitat.image ? (
                    <img
                      src={habitat.image}
                      alt={habitat.name}
                      className="h-12 w-12 object-contain"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : null}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">도감번호 #{habitat.dexNo}</p>
                  <p className="text-lg font-semibold">{habitat.name}</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>재료: {habitat.materials.join(" · ")}</p>
                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Pokemon
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {habitat.pokemon.slice(0, 8).map((name) => (
                      <div
                        key={`${habitat.dexNo}-${name}`}
                        className="flex items-center gap-3 rounded-2xl border border-border bg-white/80 px-3 py-2"
                      >
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-white shadow-soft">
                          {pokemonImageMap.get(name) ? (
                            <img
                              src={pokemonImageMap.get(name) ?? ""}
                              alt={name}
                              className="h-10 w-10 object-contain"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                          ) : null}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{name}</p>
                        </div>
                      </div>
                    ))}
                    {habitat.pokemon.length > 8 ? (
                      <div className="flex items-center justify-center rounded-2xl border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
                        +{habitat.pokemon.length - 8} 더 보기
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
