import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { crafting } from "@/lib/data";

export default function CraftingPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6">
      <SectionHeading
        eyebrow="Crafting"
        title="건축/제작 정보"
        description="필요 재료와 추천 특기 포켓몬을 한 화면에 정리합니다."
      />

      <div className="mt-8 rounded-3xl border border-border bg-white/80 p-6 shadow-soft">
        <Input placeholder="건축물/제작 아이템 검색" />
        <div className="mt-4 flex flex-wrap gap-2">
          {"전체, 주거, 생산, 장식, 이동".split(", ").map((item) => (
            <Badge key={item} variant={item === "전체" ? "accent" : "outline"}>
              {item}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {crafting.map((item) => (
          <Card key={item.name} className="section-card">
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">{item.name}</p>
                <Badge variant="accent">{item.time}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>필요 재료: {item.materials.join(" · ")}</p>
                <p>추천 특기: {item.talent}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">재료 보기</Badge>
                <Badge variant="outline">관련 포켓몬</Badge>
                <Badge variant="outline">유사 건축</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
