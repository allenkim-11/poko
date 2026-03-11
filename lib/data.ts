export const stats = [
  { label: "포켓몬", value: "300+" },
  { label: "재료", value: "180+" },
  { label: "건축/제작", value: "120+" },
  { label: "작업 특기", value: "12" },
];

export const featuredPokemon = [
  {
    name: "디토",
    role: "만능 보조",
    talent: "변신 작업",
    likes: "부드러운 쿠션",
    habitat: "안개 숲",
  },
  {
    name: "피카츄",
    role: "발전",
    talent: "전기 설비",
    likes: "상큼한 열매",
    habitat: "초원 지대",
  },
  {
    name: "이브이",
    role: "채집",
    talent: "희귀 재료",
    likes: "따뜻한 모닥불",
    habitat: "바람 언덕",
  },
  {
    name: "리자몽",
    role: "건축",
    talent: "고온 가공",
    likes: "뜨거운 화덕",
    habitat: "용암 계곡",
  },
  {
    name: "거북왕",
    role: "수자원",
    talent: "정수",
    likes: "맑은 샘",
    habitat: "호수 숲",
  },
  {
    name: "가디안",
    role: "의식",
    talent: "에너지 봉인",
    likes: "빛나는 크리스탈",
    habitat: "별빛 정원",
  },
];

export const quickGuides = [
  {
    title: "초반 재료 파밍 루트",
    description: "목재, 점토, 섬유를 가장 빨리 모으는 동선.",
    tag: "가이드",
  },
  {
    title: "건축 필수 포켓몬",
    description: "제작 시간을 40% 줄이는 특기 조합.",
    tag: "도감",
  },
  {
    title: "희귀 가구 위치",
    description: "안개 숲과 바람 언덕 숨은 포인트.",
    tag: "맵",
  },
];

export const materials = [
  {
    name: "서리 수정",
    source: "설원 동굴",
    usedIn: "빙결 조명",
    rarity: "희귀",
  },
  {
    name: "별빛 섬유",
    source: "별빛 정원",
    usedIn: "드림 텐트",
    rarity: "희귀",
  },
  {
    name: "단단한 목재",
    source: "초원 지대",
    usedIn: "기본 작업대",
    rarity: "일반",
  },
  {
    name: "훈연 광석",
    source: "용암 계곡",
    usedIn: "강화 용광로",
    rarity: "보통",
  },
  {
    name: "맑은 점토",
    source: "호수 숲",
    usedIn: "수로 블록",
    rarity: "일반",
  },
];

export const crafting = [
  {
    name: "파동 제어탑",
    time: "2시간",
    materials: ["훈연 광석", "서리 수정", "합금 볼트"],
    talent: "고온 가공",
  },
  {
    name: "별빛 정원 게이트",
    time: "1시간 20분",
    materials: ["별빛 섬유", "정제 목재", "청명 유리"],
    talent: "정밀 조립",
  },
  {
    name: "해안 정박소",
    time: "55분",
    materials: ["단단한 목재", "로프", "강화 못"],
    talent: "수로 건축",
  },
];

export const mapHubs = [
  {
    title: "안개 숲",
    description: "디토, 희귀 섬유, 숨은 가구 위치",
    focus: ["포켓몬", "재료", "숨은 위치"],
  },
  {
    title: "용암 계곡",
    description: "고온 가공 특기 포켓몬과 광석 수급",
    focus: ["광석", "건축", "보스"],
  },
  {
    title: "별빛 정원",
    description: "의식 콘텐츠와 스토리 주요 분기",
    focus: ["스토리", "재료", "퍼즐"],
  },
];
