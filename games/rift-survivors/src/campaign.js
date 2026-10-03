export const STAGES=[
{id:1,name:"별빛 유적",boss:"균열의 군주",duration:300,hp:1,bossHp:5600,color:"#c998ed",tint:"#204e3900",pool:["shade","bat","brute","seer"],intro:"첫 군주를 넘어 다섯 균열의 근원을 추적하세요."},
{id:2,name:"잿빛 성채",boss:"철갑의 집행자",duration:150,hp:1.65,bossHp:9000,color:"#f1b473",tint:"#7030153b",pool:["shade","guard","hound","brute","bomber"],intro:"방패병의 정면과 폭발자의 붉은 표식을 피하세요."},
{id:3,name:"월식의 정원",boss:"월식의 사제",duration:150,hp:2.35,bossHp:14500,color:"#b69aff",tint:"#40165c45",pool:["bat","wisp","healer","seer","hound"],intro:"치유사를 먼저 처치하고 유도탄의 궤도를 벗어나세요."},
{id:4,name:"빙하의 왕좌",boss:"서리의 여왕",duration:165,hp:3.2,bossHp:21500,color:"#9ce6ff",tint:"#224e7952",pool:["guard","sniper","frostling","brute","wisp"],intro:"저격 조준선과 서리 지대가 이동 경로를 봉쇄해요."},
{id:5,name:"붕괴의 심연",boss:"심연의 황제",duration:180,hp:4.3,bossHp:32000,color:"#ff879c",tint:"#68112d4b",pool:["hound","bomber","healer","sniper","frostling","guard","wisp"],intro:"모든 군단이 합류해요. 마지막 황제를 쓰러뜨리세요."}
];
export const CAMPAIGN_ENEMIES={
guard:{stats:[90,66,20,"#edb86d"],sprite:"brute",height:91,role:"방패병 · 정면 피해 45% 감소"},
hound:{stats:[38,157,12,"#e48f6e"],sprite:"bat",height:59,role:"추격견 · 예고 후 돌진"},
bomber:{stats:[54,85,16,"#ff9b72"],sprite:"shade",height:70,role:"폭발자 · 0.9초 뒤 폭발"},
wisp:{stats:[42,90,12,"#c6a7ff"],sprite:"seer",height:62,role:"망령 · 느린 유도탄"},
healer:{stats:[65,73,15,"#9de9b9"],sprite:"seer",height:83,role:"치유사 · 주변 적 회복"},
sniper:{stats:[59,74,14,"#c5e5ff"],sprite:"shade",height:77,role:"저격수 · 조준 뒤 직선 사격"},
frostling:{stats:[80,78,17,"#95d6ed"],sprite:"brute",height:84,role:"서리술사 · 지연 얼음 지대"}
};
export const STAGE_SKILL_ROWS=[
["crosscut","교차 월광","#ffe1a0","두 겹의 초승달 참격이 전방을 교차로 베어요",34,3.1,"knight",2,"focus","쌍월의 심판","세 방향 교차 참격","마지막 역방향 참격 추가"],
["explosive","폭렬 화살","#ffa06c","화살이 폭발하고 작은 폭탄이 갈라져요",30,2.9,"ranger",2,"power","홍련의 파편","폭발 뒤 두 개의 파편 폭탄","네 파편 폭탄과 연속 폭발"],
["spirit","혼령의 창","#b7d8ff","떠오른 마력 창들이 차례로 적을 관통해요",26,3.4,"mage",2,"magnet","청혼의 군세","창 다섯 개가 순차 발사","창 일곱 개와 빙결 관통"],
["phantom","섬광 연참","#ffcab0","적의 위치에 잔영이 나타나 연속으로 베어요",29,4.0,"knight",3,"haste","백야의 잔영","네 번의 잔영 참격","여섯 참격 뒤 광역 마무리"],
["falcon","천공 매","#b5f2de","회전하는 매가 적에게 돌진하고 돌아와요",33,4.2,"ranger",3,"boots","폭풍의 사냥꾼","매 두 마리가 교차 돌진","세 마리와 귀환 타격"],
["blackflame","흑염의 길","#e29bff","전방에 이어진 흑염이 적을 계속 태워요",13,4.3,"mage",3,"leech","밤의 행렬","화염 길이가 늘고 적 둔화","세 갈래 흑염의 길"],
["judgment","심판의 거검","#ffdfa0","표식 위로 거대한 검이 내려와 적을 꿰뚫어요",85,5.2,"knight",4,"heart","천문의 대검","거검 세 자루 연속 낙하","다섯 거검과 충격파"],
["stormbow","폭풍의 화살","#b8efff","화살 적중점에서 번개가 주변 적에 퍼져요",28,3.0,"ranger",4,"crit","뇌명의 사수","연쇄 번개 네 갈래","일곱 갈래와 지연 낙뢰"],
["gravity","중력 봉인","#d3adff","적을 안전 거리까지 끌어모은 뒤 중심이 붕괴해요",16,5.0,"mage",4,"focus","공허의 장례","흡인 뒤 두 번 붕괴","붕괴 세 번과 주변 속박"],
["thousand","천검 해방","#ffddbe","적들을 순차 표식해 검의 잔영으로 난도질해요",40,5.5,"knight",5,"power","천검의 왕","표식 여덟 개와 연속 참격","열두 참격 뒤 넓은 일섬"],
["ballista","성좌의 노궁","#baffd9","소환한 거대 노궁이 두꺼운 관통 화살을 쏴요",70,4.4,"ranger",5,"haste","천공의 심판","노궁 두 번 연속 사격","세 발과 관통 충격파"],
["dragon","창룡의 숨결","#a8e8ff","용의 형상을 띤 파동이 굽은 궤도로 적을 휩쓸어요",24,5.2,"mage",5,"power","푸른 종말","파동 길이와 연속 타격 증가","세 갈래 용과 빙결 폭발"]
];
export const STAGE_SKILLS=Object.fromEntries(STAGE_SKILL_ROWS.map(r=>[r[0],{name:r[1],color:r[2],desc:r[3],damage:r[4],cooldown:r[5],hero:r[6],stage:r[7],passive:r[8],evolution:r[9],changes:r.slice(10)}]));
export const stageSkillsFor=(hero,stage)=>STAGE_SKILL_ROWS.filter(r=>r[6]===hero&&r[7]<=stage).map(r=>r[0]);
