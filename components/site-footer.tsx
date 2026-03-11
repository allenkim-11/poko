import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="mt-20">
      <Separator className="mb-8" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 pb-10 text-sm text-muted-foreground sm:px-6">
        <p>포코피아 팬 메이드 정보 허브 · Phase 1 (SEO/도감/재료/제작)</p>
        <p>공식 서비스가 아니며, 데이터는 업데이트될 수 있습니다.</p>
      </div>
    </footer>
  );
}
