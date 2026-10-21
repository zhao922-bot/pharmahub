import type { DrugCard } from "@/lib/types";

/**
 * 抗真菌药 · 5 张卡片
 *
 * 核心矛盾是「选择性难题」：真菌是真核生物，与人体细胞结构接近，
 * 可攻击的特异性靶点比抗菌药少得多。这正是抗真菌药数量少、
 * 且多数毒性较大的根本原因。
 *
 * 两张卡分别代表两种思路：
 * - 氟康唑：靶向真菌特有的麦角固醇合成酶（选择性较好）
 * - 两性霉素 B：直接结合麦角固醇（选择性差，毒性大，但抗菌谱最广）
 */
export const antifungalCards: readonly DrugCard[] = [
  {
    id: "fluconazole",
    genericName: "氟康唑",
    brandNames: [
      "大扶康",
    ],
    englishName: "Fluconazole",
    category: "antifungal",
    target: "抑制真菌羊毛甾醇 14α-去甲基化酶，影响麦角固醇合成",
    mechanismSteps: [
      {
        title: "作用于真菌甾醇合成酶",
        detail: "氟康唑是三唑类，抑制真菌细胞色素 P450 相关的 14α-去甲基化酶。",
      },
      {
        title: "改变真菌膜甾醇组成",
        detail: "麦角固醇合成减少，异常甾醇积累，影响细胞膜结构和功能。",
      },
      {
        title: "抑制敏感真菌生长",
        detail: "通常表现为抑菌作用，效应取决于菌种和暴露；耐药机制包括靶点改变与外排等。",
      },
      {
        title: "不能按同类药推断抗菌谱",
        detail: "对曲霉和毛霉目等不适用；其他唑类各有抗菌谱，不能把伏立康唑等统一写成覆盖所有霉菌。",
      },
    ],
    indications: [
      "敏感念珠菌所致黏膜或特定系统感染",
      "隐球菌感染的特定治疗阶段或方案；需结合病情选择",
    ],
    adverseReactions: [
      "肝损伤",
      "QT 延长及药物相互作用",
      "胃肠道不适、皮疹及少见严重皮肤反应",
      "妊娠相关风险与剂量、疗程及情境有关",
    ],
    memoryTip: "氟康唑抑制麦角固醇合成；同为唑类也不能外推抗真菌谱。",
    diagram: {
      title: "氟康唑：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "氟康唑", role: "drug" },
        { id: "s0", label: "14α-去甲基化酶受抑", role: "target" },
        { id: "s1", label: "膜甾醇组成改变", role: "signal" },
        { id: "s2", label: "真菌膜功能受损", role: "signal" },
        { id: "s3", label: "敏感真菌生长受限", role: "effect" },
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
        "14α-去甲基化酶受抑",
        "膜甾醇组成改变",
        "真菌膜功能受损",
        "敏感真菌生长受限",
      ],
      explanation: "本题选取的上游到下游主线：14α-去甲基化酶受抑 → 膜甾醇组成改变 → 真菌膜功能受损 → 敏感真菌生长受限。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "氟康唑说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=98ac5455-d26c-4780-a5a3-bf8d85917626",
        sections: "药理、适应症、警告与不良反应（剂型与适用范围见正文）",
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
    id: "amphotericin-b",
    genericName: "两性霉素 B",
    brandNames: [],
    englishName: "Amphotericin B",
    category: "antifungal",
    target: "结合真菌细胞膜麦角固醇，改变膜通透性",
    mechanismSteps: [
      {
        title: "识别膜中的甾醇",
        detail: "两性霉素 B 是多烯类，对麦角固醇亲和力较高，但也可影响哺乳动物膜中的胆固醇，选择性并不完全。",
      },
      {
        title: "改变膜通透性",
        detail: "与膜甾醇作用形成通道等，导致离子外漏。",
      },
      {
        title: "损害敏感真菌存活",
        detail: "膜功能受损可产生杀真菌作用；实际作用与菌种和暴露等有关。",
      },
      {
        title: "制剂影响安全性与使用",
        detail: "脂质体和去氧胆酸盐制剂剂量、药代及毒性不同，不可直接互换。肾毒性不是人人必然发生，也不能因脑脊液浓度低就推导必须鞘内给药。",
      },
    ],
    indications: [
      "严重侵袭性真菌感染，按病原体及具体制剂选择",
      "隐球菌脑膜炎等特定方案的静脉治疗；所引为脂质体制剂",
    ],
    adverseReactions: [
      "肾毒性与低钾、低镁",
      "输注相关寒战、发热等反应",
      "贫血",
      "过敏及其他严重输注反应",
    ],
    memoryTip: "结合麦角固醇损膜；脂质体和常规制剂不能按同一剂量互换。",
    diagram: {
      title: "两性霉素 B：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "两性霉素 B", role: "drug" },
        { id: "s0", label: "结合膜麦角固醇", role: "target" },
        { id: "s1", label: "膜通透性增加", role: "signal" },
        { id: "s2", label: "离子外漏", role: "signal" },
        { id: "s3", label: "敏感真菌存活受损", role: "effect" },
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
        "结合膜麦角固醇",
        "膜通透性增加",
        "离子外漏",
        "敏感真菌存活受损",
      ],
      explanation: "本题选取的上游到下游主线：结合膜麦角固醇 → 膜通透性增加 → 离子外漏 → 敏感真菌存活受损。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "两性霉素 B说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a96a734f-d1c4-4d42-93c2-7c336da7f7b9",
        sections: "药理、适应症、警告与不良反应（剂型与适用范围见正文）",
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
    id: "terbinafine",
    genericName: "特比萘芬",
    brandNames: [],
    englishName: "Terbinafine",
    category: "antifungal",
    target: "抑制真菌角鲨烯环氧化酶，导致角鲨烯积聚并减少麦角固醇合成",
    targetQuizDistractorIds: [
      "amlodipine",
      "metformin",
      "levothyroxine",
    ],
    indicationQuizDistractorIds: [
      "amlodipine",
      "metformin",
      "levothyroxine",
    ],
    mechanismSteps: [
      {
        title: "抑制角鲨烯环氧化酶",
        detail: "特比萘芬属于烯丙胺类，阻断真菌甾醇合成通路中的这一酶。",
      },
      {
        title: "角鲨烯积聚、麦角固醇合成减少",
        detail: "底物不能正常向下游转化，细胞内角鲨烯浓度升高。",
      },
      {
        title: "破坏真菌细胞膜功能",
        detail: "所引说明书强调，高浓度角鲨烯积聚导致膜通透性增加是细胞死亡的重要原因。",
      },
      {
        title: "抑制或杀灭敏感真菌",
        detail: "效应与浓度和菌种有关；本卡以治疗皮肤癣菌性甲真菌病的口服片为例。",
      },
    ],
    indications: [
      "皮肤癣菌引起的手指甲或足趾甲真菌病（口服片，应先获得真菌学诊断）",
    ],
    adverseReactions: [
      "肝损伤，少数可严重；慢性或活动性肝病禁用口服片",
      "味觉或嗅觉改变，可能持续很久，需及时评估",
      "头痛、腹泻、消化不良及恶心",
      "严重皮肤反应及超敏反应",
      "中性粒细胞减少；抑制 CYP2D6，可影响部分合用药物浓度",
    ],
    memoryTip: "「特比萘芬拦角鲨烯，唑类拦另一酶」——口服还要记肝损伤与味嗅觉变化。",
    diagram: {
      title: "角鲨烯积聚 → 真菌细胞膜功能受损",
      nodes: [
        { id: "n0", label: "特比萘芬", role: "drug" },
        { id: "n1", label: "角鲨烯环氧化酶", role: "target" },
        { id: "n2", label: "角鲨烯积聚", role: "signal" },
        { id: "n3", label: "膜通透性 ↑", role: "signal" },
        { id: "n4", label: "真菌细胞受损", role: "effect" },
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
        title: "DailyMed：Terbinafine 口服片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=5de4c245-7086-453b-b90a-7a1242ec2c0b&version=9",
        sections: "第 1、4～7、12.4 节：口服甲真菌病用途、角鲨烯环氧化酶机制及肝脏、味嗅觉风险。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
  },
  {
    id: "clotrimazole",
    genericName: "克霉唑",
    brandNames: [],
    englishName: "Clotrimazole",
    category: "antifungal",
    target: "抑制真菌麦角固醇合成，破坏细胞膜结构与功能（本卡为皮肤外用制剂）",
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
        title: "抑制真菌麦角固醇合成",
        detail: "克霉唑属于咪唑类抗真菌药；麦角固醇是其作用路径的关键。",
      },
      {
        title: "影响真菌细胞膜组成",
        detail: "麦角固醇合成减少，使膜结构的正常维持受到干扰。",
      },
      {
        title: "损害膜结构与功能",
        detail: "真菌生长受抑，具体抑菌或杀菌表现与局部浓度等条件有关。",
      },
      {
        title: "控制相应浅表真菌感染",
        detail: "本卡对应 1% 皮肤用乳膏，主要在局部作用；不能将其当作治疗侵袭性真菌感染的系统用药。",
      },
    ],
    indications: [
      "皮肤癣菌引起的浅表皮肤真菌感染（如足癣、体癣或股癣，外用乳膏）",
      "皮肤念珠菌感染（外用制剂）",
    ],
    adverseReactions: [
      "局部灼热、刺痛、瘙痒或红斑",
      "接触性皮炎、刺激、脱屑或局部水肿",
      "过敏反应；出现明显刺激或过敏需停止使用并评估",
    ],
    memoryTip: "「克霉卡住麦角固醇，皮肤局部抗真菌」——乳膏、阴道制剂与口腔制剂的范围不能互相套用。",
    diagram: {
      title: "麦角固醇合成受抑 → 真菌膜功能受损",
      nodes: [
        { id: "n0", label: "克霉唑乳膏", role: "drug" },
        { id: "n1", label: "麦角固醇合成", role: "target" },
        { id: "n2", label: "膜组成改变", role: "signal" },
        { id: "n3", label: "膜结构与功能受损", role: "signal" },
        { id: "n4", label: "局部真菌生长受抑", role: "effect" },
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
        title: "emc：Clotrimazole 1% 皮肤用乳膏说明书",
        url: "https://www.medicines.org.uk/emc/product/102509/smpc",
        sections: "第 4.1～4.4、4.8、5.1～5.2 节：皮肤外用范围、麦角固醇机制、浓度相关效应及局部不良反应。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
  {
    id: "nystatin",
    genericName: "制霉菌素",
    brandNames: [],
    englishName: "Nystatin",
    category: "antifungal",
    target: "结合真菌细胞膜甾醇，改变膜通透性，使细胞内成分外漏（本卡为口服混悬液）",
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
        title: "结合真菌细胞膜甾醇",
        detail: "制霉菌素属于多烯类抗真菌药，直接影响含甾醇的真菌膜。",
      },
      {
        title: "改变细胞膜通透性",
        detail: "膜的屏障功能受到破坏；不是通过抑制麦角固醇合成起效。",
      },
      {
        title: "使细胞内成分外漏",
        detail: "细胞内容物漏出使敏感真菌受到抑制。",
      },
      {
        title: "局部控制口腔念珠菌感染",
        detail: "口服后胃肠道吸收很少，所引混悬液用于口腔白色念珠菌感染，不能用于系统性真菌感染。",
      },
    ],
    indications: [
      "白色念珠菌引起的口腔感染，如鹅口疮（口服混悬液局部作用）",
    ],
    adverseReactions: [
      "口腔灼热或局部刺激",
      "恶心、呕吐、腹泻或胃肠不适",
      "皮疹、瘙痒或过敏样反应，发生明显敏感反应需停用评估",
    ],
    memoryTip: "「制霉结合膜甾醇，漏出去；口服难吸收，局部起作用」——别与唑类的合成抑制混淆。",
    diagram: {
      title: "膜甾醇结合 → 通透性改变 → 成分外漏",
      nodes: [
        { id: "n0", label: "制霉菌素", role: "drug" },
        { id: "n1", label: "真菌膜甾醇", role: "target" },
        { id: "n2", label: "膜通透性改变", role: "signal" },
        { id: "n3", label: "细胞内成分外漏", role: "signal" },
        { id: "n4", label: "局部念珠菌受抑", role: "effect" },
      ],
      edges: [
        { from: "n0", to: "n1", label: "结合", kind: "flow" },
        { from: "n1", to: "n2", kind: "flow", label: "后续变化" },
        { from: "n2", to: "n3", kind: "flow", label: "后续变化" },
        { from: "n3", to: "n4", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "DailyMed：Nystatin 口服混悬液说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=9954118e-abe6-4388-98c9-4473d39b2e28",
        sections: "临床药理、适应症、注意事项及不良反应：膜甾醇结合、吸收很少、口腔念珠菌范围及局部风险。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
];
