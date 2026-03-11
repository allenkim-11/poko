import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { mapHubs } from "@/lib/data";

export default function MapPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:px-6">
      <SectionHeading
        eyebrow="Map Hub"
        title="맵/위치 정보 허브"
        description="Phase 1에서는 핵심 지역 요약과 링크 허브 중심으로 제공합니다."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {mapHubs.map((hub) => (
          <Card key={hub.title} className="section-card">
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">{hub.title}</p>
                <Badge variant="outline">핵심 지역</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{hub.description}</p>
              <div className="flex flex-wrap gap-2">
                {hub.focus.map((item) => (
                  <Badge key={item} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
              <div className="rounded-2xl border border-dashed border-border p-3 text-xs text-muted-foreground">
                인터랙티브 맵은 Phase 2에서 고도화 예정
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <Card className="section-card">
          <CardContent className="space-y-3">
            <p className="text-lg font-semibold">추천 동선</p>
            <p className="text-sm text-muted-foreground">
              초반 파밍 루트를 한 장으로 정리해 제공 예정입니다.
            </p>
            <div className="rounded-2xl bg-muted/70 p-4 text-sm text-muted-foreground">
              준비 중: 지역별 파밍 루트 카드
            </div>
          </CardContent>
        </Card>
        <Card className="section-card">
          <CardContent className="space-y-3">
            <p className="text-lg font-semibold">커뮤니티 지도</p>
            <p className="text-sm text-muted-foreground">
              유저 제보 기반 숨은 아이템 위치가 추가됩니다.
            </p>
            <div className="rounded-2xl bg-muted/70 p-4 text-sm text-muted-foreground">
              준비 중: 제보 폼 & 스크린샷 공유
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
