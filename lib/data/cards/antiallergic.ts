import type { DrugCard } from "@/lib/types";

/**
 * 抗过敏药 · 4 张卡片
 *
 * 核心是「第一代 vs 第二代」的分野：
 * 两代都阻断 H1 受体，差别在于能否透过血脑屏障。
 * 这个差别决定了镇静作用、抗胆碱作用，也决定了各自的适用场景。
 */
export const antiallergicCards: readonly DrugCard[] = [
  {
    id: "loratadine",
    genericName: "氯雷他定",
    brandNames: [
      "开瑞坦",
    ],
    englishName: "Loratadine",
    category: "antiallergic",
    target: "拮抗组胺 H1 受体，以外周作用为主",
    mechanismSteps: [
      {
        title: "作用于 H1 受体",
        detail: "氯雷他定减少组胺在 H1 受体介导的相关效应，不是通过中和组胺或治疗所有过敏机制起效。",
      },
      {
        title: "减弱过敏相关表现",
        detail: "可减少组胺相关的毛细血管通透性增加、瘙痒等表现。",
      },
      {
        title: "理解中枢作用差异",
        detail: "中枢影响通常较少，但仍有人嗜睡；不能保证服药后驾驶一定安全。",
      },
      {
        title: "注意个体风险",
        detail: "肝功能和相互作用可改变暴露；相对少镇静不等于完全没有中枢或抗胆碱相关不良反应。",
      },
    ],
    indications: [
      "过敏性鼻炎相关症状",
      "荨麻疹等过敏相关皮肤症状",
    ],
    adverseReactions: [
      "头痛、疲乏或嗜睡",
      "口干等胃肠道反应",
      "少见心悸或心动过速",
      "罕见严重过敏及肝功能异常",
    ],
    memoryTip: "第二代通常少困，但不等于绝不困；驾驶需看个体反应。",
    diagram: {
      title: "氯雷他定：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "氯雷他定", role: "drug" },
        { id: "s0", label: "H1 受体被阻断", role: "target" },
        { id: "s1", label: "组胺相关信号减弱", role: "signal" },
        { id: "s2", label: "通透性增加等反应减轻", role: "signal" },
        { id: "s3", label: "过敏相关症状缓解", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "s0", label: "主线环节", kind: "flow" },
        { from: "s0", to: "s1", label: "后续变化", kind: "flow" },
        { from: "s1", to: "s2", label: "后续变化", kind: "flow" },
        { from: "s2", to: "s3", label: "后续变化", kind: "flow" },
      ],
    },
    mechanismQuiz: {
      steps: [
        "H1 受体被阻断",
        "组胺相关信号减弱",
        "通透性增加等反应减轻",
        "过敏相关症状缓解",
      ],
      explanation: "本题选取的上游到下游主线：H1 受体被阻断 → 组胺相关信号减弱 → 通透性增加等反应减轻 → 过敏相关症状缓解。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "氯雷他定 10 mg 片说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/14580/smpc",
        sections: "4.1 适应症、4.4–4.8 风险与不良反应、5.1 药效学",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
    targetQuizDistractorIds: [
      "omeprazole",
      "levothyroxine",
      "aciclovir",
    ],
    indicationQuizDistractorIds: [
      "levothyroxine",
      "aciclovir",
      "allopurinol",
    ],
  },
  {
    id: "chlorpheniramine",
    genericName: "氯苯那敏",
    brandNames: [
      "扑尔敏",
    ],
    englishName: "Chlorpheniramine",
    category: "antiallergic",
    target: "拮抗组胺 H1 受体，并有较明显的中枢及抗胆碱作用",
    mechanismSteps: [
      {
        title: "作用于 H1 受体",
        detail: "氯苯那敏减少组胺在 H1 受体介导的相关效应，不是通过中和组胺或治疗所有过敏机制起效。",
      },
      {
        title: "减弱过敏相关表现",
        detail: "可减少组胺相关的毛细血管通透性增加、瘙痒等表现。",
      },
      {
        title: "理解中枢作用差异",
        detail: "较易产生中枢镇静；作用维持时间不等同于血浆半衰期，不能因嗜睡就当作助眠药。",
      },
      {
        title: "注意个体风险",
        detail: "抗胆碱作用可引起口干、视物模糊和排尿困难，老年人更应关注。",
      },
    ],
    indications: [
      "过敏性鼻炎相关症状",
      "荨麻疹等过敏相关皮肤症状",
    ],
    adverseReactions: [
      "嗜睡、注意力下降及驾驶风险",
      "口干、视物模糊及尿潴留",
      "儿童或老年人可出现反常兴奋、意识混乱",
      "与酒精、镇静药等合用可增加中枢抑制",
    ],
    memoryTip: "第一代较易困、抗胆碱作用较突出；不应为了嗜睡而自行助眠。",
    diagram: {
      title: "氯苯那敏：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "氯苯那敏", role: "drug" },
        { id: "s0", label: "H1 受体被阻断", role: "target" },
        { id: "s1", label: "组胺相关信号减弱", role: "signal" },
        { id: "s2", label: "通透性增加等反应减轻", role: "signal" },
        { id: "s3", label: "过敏相关症状缓解", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "s0", label: "主线环节", kind: "flow" },
        { from: "s0", to: "s1", label: "后续变化", kind: "flow" },
        { from: "s1", to: "s2", label: "后续变化", kind: "flow" },
        { from: "s2", to: "s3", label: "后续变化", kind: "flow" },
      ],
    },
    mechanismQuiz: {
      steps: [
        "H1 受体被阻断",
        "组胺相关信号减弱",
        "通透性增加等反应减轻",
        "过敏相关症状缓解",
      ],
      explanation: "本题选取的上游到下游主线：H1 受体被阻断 → 组胺相关信号减弱 → 通透性增加等反应减轻 → 过敏相关症状缓解。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "氯苯那敏 4 mg 片说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/14298/smpc",
        sections: "4.1 适应症、4.4–4.8 风险与不良反应、5.1 药效学",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
    targetQuizDistractorIds: [
      "omeprazole",
      "levothyroxine",
      "aciclovir",
    ],
    indicationQuizDistractorIds: [
      "levothyroxine",
      "aciclovir",
      "allopurinol",
    ],
  },
  {
    id: "epinephrine",
    genericName: "肾上腺素",
    brandNames: [],
    englishName: "Epinephrine (Adrenaline)",
    category: "antiallergic",
    target: "激动 α 和 β 肾上腺素能受体，减轻严重过敏反应中的血管扩张和支气管痉挛",
    targetQuizDistractorIds: [
      "metformin",
      "levothyroxine",
      "aciclovir",
    ],
    indicationQuizDistractorIds: [
      "metformin",
      "levothyroxine",
      "aciclovir",
    ],
    mechanismSteps: [
      {
        title: "激动 α、β 肾上腺素能受体",
        detail: "肾上腺素属于非选择性肾上腺素能受体激动剂，本卡聚焦严重过敏反应急救。",
      },
      {
        title: "同时作用于血管和支气管",
        detail: "α 受体作用减轻血管扩张及通透性增加；β 受体作用舒张支气管平滑肌，两条路径并行。",
      },
      {
        title: "改善低血压与支气管痉挛",
        detail: "血管内液体丢失和气道阻力得到改善，有助于缓解循环及呼吸障碍。",
      },
      {
        title: "快速缓解严重过敏反应",
        detail: "注射后起效快而持续时间短，使用自动注射器后仍需立即寻求急救医疗处理。",
      },
    ],
    indications: [
      "严重全身过敏反应（包括过敏性休克）的紧急治疗，以 EpiPen 自动注射器说明书为例",
    ],
    adverseReactions: [
      "心悸、心动过速、震颤及焦虑",
      "头痛、头晕、出汗、恶心或呕吐",
      "可诱发心律失常、心肌缺血或明显血压升高",
      "误注入手指、手足等部位可引起缺血损伤；此类风险不构成延误严重过敏急救的理由",
    ],
    memoryTip: "「肾上腺素同时救循环、通气」——不是 H1 阻断药，急救后仍须继续医疗观察与处理。",
    diagram: {
      title: "α 与 β 两条路径共同缓解严重过敏",
      nodes: [
        { id: "drug", label: "肾上腺素", role: "drug" },
        { id: "alpha", label: "α 受体", role: "target" },
        { id: "beta", label: "β 受体", role: "target" },
        { id: "vascular", label: "扩张、渗漏减轻", role: "signal" },
        { id: "airway", label: "支气管舒张", role: "signal" },
        { id: "effect", label: "循环、通气改善", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "alpha", label: "激动 α", kind: "activate" },
        { from: "drug", to: "beta", label: "激动 β", kind: "activate" },
        { from: "alpha", to: "vascular", kind: "flow", label: "后续变化" },
        { from: "beta", to: "airway", kind: "flow", label: "后续变化" },
        { from: "vascular", to: "effect", kind: "flow", label: "后续变化" },
        { from: "airway", to: "effect", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "DailyMed：EPIPEN（epinephrine）自动注射器说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=311af6d9-20c0-4b87-b236-4185bfa49988",
        sections: "第 1、5～6、12.1～12.2、17 节：严重过敏急救、α/β 作用、不良反应及后续急救要求。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
  },
  {
    id: "cetirizine",
    genericName: "西替利嗪",
    brandNames: [],
    englishName: "Cetirizine",
    category: "antiallergic",
    target: "选择性拮抗外周组胺 H1 受体，减轻组胺介导的过敏症状",
    targetQuizDistractorIds: [
      "amlodipine",
      "metformin",
      "aciclovir",
    ],
    indicationQuizDistractorIds: [
      "amlodipine",
      "metformin",
      "aciclovir",
    ],
    mechanismSteps: [
      {
        title: "拮抗外周 H1 受体",
        detail: "属于第二代抗组胺药，选择性作用于组胺 H1 受体。",
      },
      {
        title: "减弱组胺引起的局部反应",
        detail: "组胺介导的风团、红晕等反应受到抑制。",
      },
      {
        title: "缓解鼻眼与皮肤过敏症状",
        detail: "有助于减轻过敏性鼻炎的鼻眼症状及荨麻疹症状。",
      },
      {
        title: "发挥症状控制作用",
        detail: "作用以缓解症状为主；第二代也可能嗜睡，不能视为完全没有中枢影响。",
      },
    ],
    indications: [
      "季节性和常年性过敏性鼻炎的鼻眼症状缓解",
      "慢性特发性荨麻疹的症状缓解",
    ],
    adverseReactions: [
      "嗜睡、疲乏或头晕，驾驶前应了解个人反应",
      "口干、头痛或胃肠道不适",
      "有尿潴留危险因素者需谨慎；肾功能下降时需调整方案",
      "停药后可能发生瘙痒或荨麻疹，个别症状较重",
    ],
    memoryTip: "「西替利嗪拦 H1，鼻痒风团会减轻」——第二代仍可能困倦，肾功能也要考虑。",
    diagram: {
      title: "外周 H1 拮抗 → 鼻眼及皮肤症状减轻",
      nodes: [
        { id: "n0", label: "西替利嗪", role: "drug" },
        { id: "n1", label: "外周 H1 受体", role: "target" },
        { id: "n2", label: "组胺反应减弱", role: "signal" },
        { id: "n3", label: "风团与鼻眼症状 ↓", role: "signal" },
        { id: "n4", label: "过敏症状缓解", role: "effect" },
      ],
      edges: [
        { from: "n0", to: "n1", label: "抑制", kind: "inhibit" },
        { from: "n1", to: "n2", kind: "flow", label: "受抑后" },
        { from: "n2", to: "n3", kind: "flow", label: "后续变化" },
        { from: "n3", to: "n4", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "emc：Cetirizine hydrochloride 片说明书",
        url: "https://www.medicines.org.uk/emc/product/12956/smpc",
        sections: "第 4.1～4.4、4.7～4.8、5.1 节：鼻炎与荨麻疹、H1 作用、嗜睡和肾功能；所引 10 mg 片适用于成人及 6 岁以上儿童。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
  },
];
