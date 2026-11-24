import type { DrugCard } from "@/lib/types";

/**
 * 免疫与风湿免疫 · 3 张卡片
 *
 * 从细胞内钙调磷酸酶（他克莫司）、JAK-STAT 信号通路（托法替布）
 * 到细胞外抗 TNF-α 单抗（阿达木单抗），理解免疫抑制与靶向调控的分层。
 */
export const immunomodulatorCards: readonly DrugCard[] = [
  {
    id: "tacrolimus",
    genericName: "他克莫司",
    brandNames: [],
    englishName: "Tacrolimus",
    category: "immunomodulator",
    target: "结合 FKBP12 后抑制钙调磷酸酶，阻断 NFAT 去磷酸化与 IL-2 转录",
    targetQuizDistractorIds: [
      "amlodipine",
      "omeprazole",
      "atorvastatin",
    ],
    indicationQuizDistractorIds: [
      "amlodipine",
      "omeprazole",
      "atorvastatin",
    ],
    mechanismSteps: [
      {
        title: "进入 T 细胞并结合 FKBP12",
        detail: "他克莫司为大环内酯类钙调磷酸酶抑制剂，进入 T 淋巴细胞后与胞内免疫亲和素 FKBP12 结合形成复合物。",
      },
      {
        title: "抑制钙调磷酸酶（Calcineurin）活性",
        detail: "药物-FKBP12 复合物抑制钙调磷酸酶的磷酸酶活性，阻止活化 T 细胞核因子（NFAT）去磷酸化并进入细胞核。",
      },
      {
        title: "抑制 IL-2 等细胞因子转录与 T 细胞活化",
        detail: "IL-2 等关键细胞因子基因转录受阻，从而抑制辅助性与细胞毒性 T 细胞活化增殖，预防实体器官移植排斥反应。",
      },
      {
        title: "窄治疗窗需血药谷浓度监测并防肾毒性与 CYP3A4 相互作用",
        detail: "治疗窗窄且个体差异大，须常规监测全血谷浓度（TDM），不同缓释与常释制剂不可随意互换；经 CYP3A4/5 广泛代谢，联用唑类抗真菌药或利福平需严密调量，并监测急慢性肾毒性、高血糖、高钾血症、神经毒性及感染/恶性肿瘤黑框警告。",
      },
    ],
    indications: [
      "异体肝、肾、心及肺移植患者的器官排斥反应预防（通常与其他免疫抑制剂联用）",
    ],
    adverseReactions: [
      "急性或慢性肾毒性（血肌酐升高、肾血管收缩与肾小管间质损伤），与高谷浓度密切相关",
      "神经毒性（震颤、头痛、失眠，严重时见意识障碍或可逆性后部脑病综合征 PRES）",
      "移植后糖尿病/高血糖、高钾血症、低镁血症及高血压",
      "严重细菌、病毒、真菌或机会性感染及淋巴瘤等恶性肿瘤风险升高（黑框警告）",
    ],
    memoryTip: "「他克莫司抱 FKBP12 抑钙调酶，保移植物盯谷浓」——防肾毒、高糖高钾，避开 CYP3A4 剧烈波动。",
    diagram: {
      title: "FKBP12 结合 → 钙调磷酸酶受抑 → IL-2 转录下降",
      nodes: [
        { id: "drug", label: "他克莫司", role: "drug" },
        { id: "cn", label: "钙调磷酸酶", role: "target" },
        { id: "nfat", label: "NFAT 入核受阻", role: "signal" },
        { id: "il2", label: "IL-2 转录与释放 ↓", role: "signal" },
        { id: "effect", label: "T 细胞排斥抑制", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "cn", label: "经 FKBP12 抑制", kind: "inhibit" },
        { from: "cn", to: "nfat", label: "去磷酸化受阻", kind: "flow" },
        { from: "nfat", to: "il2", label: "转录减弱", kind: "flow" },
        { from: "il2", to: "effect", label: "免疫应答受抑", kind: "flow" },
      ],
    },
    mechanismQuiz: {
      steps: [
        "进入 T 细胞并与 FKBP12 结合",
        "抑制钙调磷酸酶磷酸酶活性",
        "阻断 NFAT 去磷酸化入核及 IL-2 转录",
        "T 细胞活化增殖受抑并预防移植排斥",
      ],
      explanation: "本题选取的上游到下游主线：进入 T 细胞并与 FKBP12 结合 → 抑制钙调磷酸酶磷酸酶活性 → 阻断 NFAT 去磷酸化入核及 IL-2 转录 → T 细胞活化增殖受抑并预防移植排斥。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "DailyMed：PROGRAF（他克莫司）胶囊/注射剂说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=7f667de1-9dfa-4bd6-8ba0-15ee2d78873b",
        sections: "黑框警告、第 1、2、5、7、12.1 节：移植排斥适应症、TDM 监测、肾毒性、CYP3A4 相互作用及钙调磷酸酶机制。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "tofacitinib",
    genericName: "托法替布",
    brandNames: [],
    englishName: "Tofacitinib",
    category: "immunomodulator",
    target: "口服抑制 Janus 激酶（JAK），阻断细胞内 JAK-STAT 细胞因子信号转导",
    targetQuizDistractorIds: [
      "levothyroxine",
      "warfarin",
      "oseltamivir",
    ],
    indicationQuizDistractorIds: [
      "levothyroxine",
      "warfarin",
      "oseltamivir",
    ],
    mechanismSteps: [
      {
        title: "竞争性抑制胞内 JAK 激酶 ATP 位点",
        detail: "托法替布为口服小分子 Janus 激酶（JAK）抑制剂，作用于细胞内细胞因子受体偶联的 JAK 激酶结构域（在细胞学层面主要影响配对活化的 JAK1/JAK3 等通路）。",
      },
      {
        title: "阻断 STAT 磷酸化与核转位",
        detail: "抑制 JAK 自身及受体磷酸化后，信号转导及转录激活因子（STAT）无法招募和磷酸化入核，进而下调多种促炎细胞因子信号。",
      },
      {
        title: "调节自身免疫性炎症并注意定位限制",
        detail: "用于中重度类风湿关节炎、银屑病关节炎、溃疡性结肠炎及强直性脊柱炎等；按美国说明书，通常用于对一种或多种 TNF 阻滞剂疗效不足或不耐受的患者。",
      },
      {
        title: "严格评估感染、血栓、心血管与恶性肿瘤黑框警告",
        detail: "带有五大黑框警告：严重感染（含结核及机会性感染）、全因死亡率升高、恶性肿瘤（淋巴瘤及非黑色素瘤皮肤癌等）、主要不良心血管事件（MACE）及动静脉血栓形成（DVT/PE）；用药前需筛查结核并监测血常规、血脂与肝酶。",
      },
    ],
    indications: [
      "对一种或多种 TNF 阻滞剂反应不足或不耐受的成人中重度活动性类风湿关节炎（RA）",
      "对 TNF 阻滞剂反应不足或不耐受的成人活动性银屑病关节炎、强直性脊柱炎或中重度活动性溃疡性结肠炎",
    ],
    adverseReactions: [
      "严重感染（包括结核、带状疱疹及机会性真菌感染，黑框警告）",
      "主要不良心血管事件（MACE）、全因死亡率及动静脉血栓（DVT/PE）风险升高（黑框警告）",
      "恶性肿瘤风险升高（包括淋巴瘤及肺癌等，黑框警告）",
      "淋巴细胞/中性粒细胞减少、贫血、血脂升高、转氨酶升高及胃肠道穿孔风险",
    ],
    memoryTip: "「托法替布口服阻 JAK-STAT，五大黑框警感染栓心癌」——常见于 TNF 抑制剂疗效不足后评估。",
    diagram: {
      title: "抑制胞内 JAK → STAT 磷酸化 ↓ → 促炎信号下调",
      nodes: [
        { id: "drug", label: "托法替布", role: "drug" },
        { id: "jak", label: "胞内 JAK 激酶", role: "target" },
        { id: "stat", label: "STAT 磷酸化 ↓", role: "signal" },
        { id: "cyto", label: "炎症基因转录 ↓", role: "signal" },
        { id: "effect", label: "自身免疫炎症缓解", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "jak", label: "口服胞内抑制", kind: "inhibit" },
        { from: "jak", to: "stat", label: "激酶磷酸化受阻", kind: "flow" },
        { from: "stat", to: "cyto", label: "入核调控减弱", kind: "flow" },
        { from: "cyto", to: "effect", label: "组织炎症减轻", kind: "flow" },
      ],
    },
    mechanismQuiz: {
      steps: [
        "口服进入免疫细胞并结合胞内 JAK 激酶",
        "抑制 JAK 介导的信号磷酸化",
        "阻断 STAT 活化入核与炎性基因转录",
        "细胞因子驱动的自身免疫炎症减轻",
      ],
      explanation: "本题选取的上游到下游主线：口服进入免疫细胞并结合胞内 JAK 激酶 → 抑制 JAK 介导的信号磷酸化 → 阻断 STAT 活化入核与炎性基因转录 → 细胞因子驱动的自身免疫炎症减轻。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "DailyMed：XELJANZ（托法替布）片剂/缓释片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=68e3d6b2-7838-4d2d-a417-09d919b43e13",
        sections: "黑框警告、第 1、5、6、12.1 节：五大黑框警告、TNF 后定位、血液学监测及 JAK-STAT 机制。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "adalimumab",
    genericName: "阿达木单抗",
    brandNames: [],
    englishName: "Adalimumab",
    category: "immunomodulator",
    target: "特异性结合人肿瘤坏死因子 α（TNF-α），阻断其与 p55 和 p75 细胞表面受体结合",
    targetQuizDistractorIds: [
      "metformin",
      "amlodipine",
      "atorvastatin",
    ],
    indicationQuizDistractorIds: [
      "metformin",
      "amlodipine",
      "atorvastatin",
    ],
    mechanismSteps: [
      {
        title: "高亲和力结合可溶性与跨膜型 TNF-α",
        detail: "阿达木单抗为重组全人源 IgG1 单克隆抗体，特异性中和人 TNF-α，而不结合淋巴毒素（TNF-β）。",
      },
      {
        title: "阻断 TNF-α 与细胞表面受体的相互作用",
        detail: "阻止 TNF-α 与 p55（TNFR1）和 p75（TNFR2）受体结合，从而下调白细胞趋化、黏附分子表达及下游促炎细胞因子级联反应。",
      },
      {
        title: "用于多种风湿及自身免疫性炎症疾病",
        detail: "皮下注射给药，覆盖中重度类风湿关节炎、强直性脊柱炎、银屑病关节炎、克罗恩病、溃疡性结肠炎及斑块状银屑病等（须核对具体年龄与人群条件）。",
      },
      {
        title: "用药前必须筛查潜伏结核与乙型肝炎病毒感染",
        detail: "带有严重感染（含潜伏结核再激活及侵袭性真菌感染）与恶性肿瘤（含儿童及青少年肝脾 T 细胞淋巴瘤等）黑框警告；起始治疗前须完成潜伏结核筛查，并评估 HBV 携带者再激活风险。",
      },
    ],
    indications: [
      "成人中重度活动性类风湿关节炎（单用或联合甲氨蝶呤等 DMARDs）",
      "成人强直性脊柱炎及活动性银屑病关节炎",
      "中重度活动性克罗恩病、溃疡性结肠炎或中重度慢性斑块状银屑病（按说明书适龄范围）",
    ],
    adverseReactions: [
      "严重感染及潜伏结核再激活、侵袭性真菌感染（黑框警告，用前必查潜伏结核）",
      "恶性肿瘤，包括淋巴瘤及少见肝脾 T 细胞淋巴瘤（黑框警告）",
      "乙型肝炎病毒（HBV）携带者病毒再激活（用前评估 HBV 状态并监测）",
      "注射部位反应、抗药抗体形成、自身免疫样反应（狼疮样综合征）及少见脱髓鞘或心衰恶化",
    ],
    memoryTip: "「阿达木全人单抗抓 TNF-α，用前必筛结核和乙肝」——结核阳或乙肝携带先规范处理。",
    diagram: {
      title: "中和 TNF-α → 阻断受体结合 → 炎症级联下调",
      nodes: [
        { id: "drug", label: "阿达木单抗", role: "drug" },
        { id: "tnf", label: "TNF-α 配体", role: "target" },
        { id: "rec", label: "TNF 受体信号 ↓", role: "signal" },
        { id: "casc", label: "趋化与炎性介质 ↓", role: "signal" },
        { id: "effect", label: "关节与黏膜炎症缓解", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "tnf", label: "单抗结合中和", kind: "inhibit" },
        { from: "tnf", to: "rec", label: "受体结合受阻", kind: "flow" },
        { from: "rec", to: "casc", label: "下游级联下调", kind: "flow" },
        { from: "casc", to: "effect", label: "组织炎症控制", kind: "flow" },
      ],
    },
    mechanismQuiz: {
      steps: [
        "特异性结合可溶性与膜结合 TNF-α",
        "阻断 TNF-α 与 p55/p75 受体结合",
        "下游黏附分子与促炎介质级联下调",
        "自身免疫性关节与组织炎症减轻",
      ],
      explanation: "本题选取的上游到下游主线：特异性结合可溶性与膜结合 TNF-α → 阻断 TNF-α 与 p55/p75 受体结合 → 下游黏附分子与促炎介质级联下调 → 自身免疫性关节与组织炎症减轻。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "DailyMed：HUMIRA（阿达木单抗）注射液说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=608d4f0d-b19f-46d3-749a-7159aa5f933d",
        sections: "黑框警告、第 1、5.1、5.2、5.4、6、12.1 节：结核与恶性肿瘤黑框警告、HBV 再激活及 TNF-α 中和机制。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
];
