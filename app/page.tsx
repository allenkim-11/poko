import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { crafting, featuredPokemon, quickGuides } from "@/lib/data";
import { habitatCount, pokedexCount } from "@/lib/game8";
import { items, itemsCount } from "@/lib/pokopiawiki";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-12 sm:px-6">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <Badge variant="accent">Phase 1 · SEO & 데이터 허브</Badge>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            포코피아 정보를 <span className="text-gradient">가장 빠르게</span>
            <br />찾는 OP.GG형 데이터 허브
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
            포켓몬 도감, 재료 수급, 건축/제작 요구사항을 한 번에 찾는
            포코피아 전용 인덱스. 초반 성장부터 꾸미기까지 필요한 정보를
            구조화합니다.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <Input placeholder="포켓몬, 재료, 건축물 검색" />
            </div>
            <Button size="lg">검색</Button>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span>추천 키워드</span>
            <Badge variant="outline">디토</Badge>
            <Badge variant="outline">건축 필터</Badge>
            <Badge variant="outline">희귀 가구</Badge>
          </div>
        </div>
        <div className="section-card animate-fade-up rounded-[32px] p-6 shadow-soft">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">빠른 탐색</h2>
              <Badge variant="default">Live</Badge>
            </div>
            <div className="grid gap-4">
              {[
                {
                  title: "포켓몬 도감",
                  desc: "특기/역할/서식지 중심 정렬",
                  href: "/dex",
                },
                {
                  title: "서식지 도감",
                  desc: "도감번호 기반 서식지 정보",
                  href: "/habitats",
                },
                {
                  title: "아이템 도감",
                  desc: "이미지 포함 아이템 리스트",
                  href: "/materials",
                },
                {
                  title: "건축/제작",
                  desc: "필요 재료, 추천 포켓몬",
                  href: "/crafting",
                },
                {
                  title: "맵 허브",
                  desc: "지역별 핵심 위치 요약",
                  href: "/map",
                },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-border bg-white/70 p-4 transition hover:-translate-y-0.5 hover:border-primary"
                >
                  <p className="text-sm font-semibold group-hover:text-primary">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </Link>
              ))}
            </div>
            <div className="rounded-2xl bg-muted/70 p-4 text-xs text-muted-foreground">
              커밍순: 섬 자랑 갤러리, 숨은 위치 제보, 글로벌 공유
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "포켓몬", value: `${pokedexCount}` },
          { label: "아이템", value: `${itemsCount}+` },
          { label: "서식지", value: `${habitatCount}` },
          { label: "건축/제작", value: "120+" },
        ].map((stat) => (
          <Card key={stat.label} className="section-card">
            <CardHeader>
              <CardTitle className="text-2xl">{stat.value}</CardTitle>
              <CardDescription>{stat.label}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="mt-20 space-y-8">
        <SectionHeading
          eyebrow="Phase 1"
          title="도감 · 아이템 · 제작 중심의 정보 허브"
          description="PRD 1단계 목표에 맞춰 SEO 랜딩과 핵심 데이터 구조를 빠르게 확보합니다."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "도감/특기 필터",
              desc: "작업 특기별 추천 포켓몬을 빠르게 탐색.",
            },
            {
              title: "아이템 도감",
              desc: "획득처, 사용처를 연결해 파밍 효율 극대화.",
            },
            {
              title: "건축/제작 DB",
              desc: "필요 재료와 권장 특기를 한 화면에 정리.",
            },
          ].map((item) => (
            <Card key={item.title} className="section-card">
              <CardContent className="space-y-3">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="section-card">
          <CardHeader>
            <CardTitle>인기 포켓몬 도감</CardTitle>
            <CardDescription>최근 검색량이 높은 포켓몬</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {featuredPokemon.slice(0, 4).map((pokemon) => (
              <div
                key={pokemon.name}
                className="rounded-2xl border border-border bg-white/80 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{pokemon.name}</p>
                  <Badge variant="outline">{pokemon.role}</Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  특기: {pokemon.talent} · 서식지: {pokemon.habitat}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="section-card">
          <CardHeader>
            <CardTitle>오늘의 제작 추천</CardTitle>
            <CardDescription>건축/제작 인기 항목</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {crafting.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <Badge variant="accent">{item.time}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  재료: {item.materials.join(" · ")} | 추천 특기: {item.talent}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-20 space-y-8">
        <SectionHeading
          eyebrow="Quick Guides"
          title="초반 성장에 바로 쓰는 팁"
          description="검색 유입을 확보하는 핵심 가이드 섹션."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {quickGuides.map((guide) => (
            <Card key={guide.title} className="section-card">
              <CardContent className="space-y-2">
                <Badge variant="outline">{guide.tag}</Badge>
                <h3 className="text-lg font-semibold">{guide.title}</h3>
                <p className="text-sm text-muted-foreground">{guide.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="section-card">
          <CardHeader>
            <CardTitle>최근 추가된 아이템</CardTitle>
            <CardDescription>획득처와 사용처를 한눈에</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.slice(0, 6).map((item) => (
              <div key={item.slug || item.name} className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Pokopia Wiki 기준 아이템 데이터</p>
                </div>
                <Badge variant="outline">{item.category || "미분류"}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="section-card">
          <CardHeader>
            <CardTitle>데이터 요청</CardTitle>
            <CardDescription>추가 정보를 제보해 주세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              포코피아 데이터를 빠르게 확장하기 위해 유저 제보를 수집합니다.
              Phase 2에서 섬 자랑/제보 게시판으로 확장됩니다.
            </p>
            <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              현재는 간단한 구글 폼 또는 디스코드 채널 연결 예정
            </div>
            <Button variant="secondary">제보하러 가기</Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
