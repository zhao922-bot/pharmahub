import type { DrugCard } from "@/lib/types";

/**
 * 抗菌药物 · 15 张卡片
 *
 * 机制主线：细胞壁合成（β-内酰胺类）、核糖体 50S（大环内酯类）、
 * DNA 回旋酶（喹诺酮类）、厌氧菌 DNA（硝基咪唑类）。
 */
export const antibacterialCards: readonly DrugCard[] = [
  {
    id: "amoxicillin",
    genericName: "阿莫西林",
    brandNames: [
      "阿莫仙",
    ],
    englishName: "Amoxicillin",
    category: "antibacterial",
    target: "结合青霉素结合蛋白（PBP），抑制细菌细胞壁合成",
    mechanismSteps: [
      {
        title: "接触敏感细菌的 PBP",
        detail: "阿莫西林属于氨基青霉素类；在敏感细菌中到达细胞壁合成相关的青霉素结合蛋白。",
      },
      {
        title: "抑制肽聚糖交联",
        detail: "β-内酰胺结构与 PBP 作用，干扰肽聚糖交联，使细胞壁合成受阻。",
      },
      {
        title: "产生杀菌效应",
        detail: "细胞壁完整性受损可导致细菌死亡。对生长中的敏感菌作用较强，但不应写成对所有静止菌绝无作用。",
      },
      {
        title: "用药受耐药性限制",
        detail: "β-内酰胺酶、PBP 改变等可导致耐药。抗菌作用不等于抗病毒，疗效需结合病原体及感染部位。",
      },
    ],
    indications: [
      "敏感细菌所致的耳鼻喉、呼吸道等感染",
      "幽门螺杆菌根除方案中的联合用药；需结合耐药与指南选择方案",
    ],
    adverseReactions: [
      "过敏反应，严重时可发生过敏性休克",
      "腹泻、恶心；可能发生艰难梭菌相关性腹泻",
      "皮疹，传染性单核细胞增多症患者更易出现",
      "少见严重皮肤反应",
    ],
    memoryTip: "PBP—细胞壁是主线；并非所有呼吸道感染都需要阿莫西林。",
    diagram: {
      title: "阿莫西林：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "阿莫西林", role: "drug" },
        { id: "s0", label: "PBP 受抑", role: "target" },
        { id: "s1", label: "肽聚糖交联受阻", role: "signal" },
        { id: "s2", label: "细胞壁完整性受损", role: "signal" },
        { id: "s3", label: "敏感细菌死亡", role: "effect" },
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
        "PBP 受抑",
        "肽聚糖交联受阻",
        "细胞壁完整性受损",
        "敏感细菌死亡",
      ],
      explanation: "本题选取的上游到下游主线：PBP 受抑 → 肽聚糖交联受阻 → 细胞壁完整性受损 → 敏感细菌死亡。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "阿莫西林说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2c395111-c9c1-483e-a542-58b935ede689",
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
    id: "ceftriaxone",
    genericName: "头孢曲松",
    brandNames: [
      "罗氏芬",
    ],
    englishName: "Ceftriaxone",
    category: "antibacterial",
    target: "结合 PBP，抑制细菌细胞壁肽聚糖合成",
    mechanismSteps: [
      {
        title: "第三代头孢菌素到达病灶",
        detail: "头孢曲松用于注射，分布与感染部位、炎症状态有关；脑脊液暴露不能脱离脑膜炎情境概括。",
      },
      {
        title: "结合 PBP",
        detail: "通过 β-内酰胺结构作用于 PBP，抑制细胞壁合成相关反应。",
      },
      {
        title: "细胞壁合成受损",
        detail: "肽聚糖交联受影响后，敏感菌的细胞壁完整性下降，产生杀菌作用。",
      },
      {
        title: "明确抗菌谱边界",
        detail: "并不可靠覆盖铜绿假单胞菌，也不能把第三代等同于不受 β-内酰胺酶影响；选药需结合药敏。",
      },
    ],
    indications: [
      "敏感细菌所致的肺炎、尿路等感染",
      "敏感病原体所致的细菌性脑膜炎等严重感染",
    ],
    adverseReactions: [
      "过敏反应及艰难梭菌相关性腹泻",
      "胆泥或胆石样沉积",
      "免疫性溶血性贫血等少见严重反应",
      "新生儿有特定禁忌；不得与含钙静脉溶液混合或同步输入，顺序给药须遵循年龄相关说明",
    ],
    memoryTip: "第三代头孢抑制 PBP；脑膜炎用途和含钙制剂限制都要看具体条件。",
    diagram: {
      title: "头孢曲松：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "头孢曲松", role: "drug" },
        { id: "s0", label: "PBP 受抑", role: "target" },
        { id: "s1", label: "肽聚糖合成受阻", role: "signal" },
        { id: "s2", label: "细胞壁完整性受损", role: "signal" },
        { id: "s3", label: "敏感细菌死亡", role: "effect" },
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
        "PBP 受抑",
        "肽聚糖合成受阻",
        "细胞壁完整性受损",
        "敏感细菌死亡",
      ],
      explanation: "本题选取的上游到下游主线：PBP 受抑 → 肽聚糖合成受阻 → 细胞壁完整性受损 → 敏感细菌死亡。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "头孢曲松说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=8351aa37-552d-471d-b293-c564dcb6ec29",
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
    id: "azithromycin",
    genericName: "阿奇霉素",
    brandNames: [
      "希舒美",
    ],
    englishName: "Azithromycin",
    category: "antibacterial",
    target: "结合细菌 50S 核糖体的 23S rRNA，抑制蛋白质合成",
    mechanismSteps: [
      {
        title: "在组织与细胞内分布",
        detail: "阿奇霉素是大环内酯类衍生物，可在多种组织及细胞内蓄积。",
      },
      {
        title: "结合 50S 核糖体",
        detail: "药物结合 50S 亚基的 23S rRNA，影响蛋白质合成过程。",
      },
      {
        title: "干扰肽链延伸",
        detail: "肽链延伸及相关核糖体功能受阻，限制敏感菌生长。抗菌效应随病原体及暴露而异。",
      },
      {
        title: "区分非典型病原体",
        detail: "支原体缺乏细胞壁；衣原体、军团菌不能一概描述为没有细胞壁。胞内分布有助于理解相关用途。",
      },
    ],
    indications: [
      "敏感病原体所致的呼吸道等感染",
      "符合诊疗规范的某些衣原体感染",
    ],
    adverseReactions: [
      "恶心、腹痛、腹泻",
      "QT 间期延长及严重心律失常风险",
      "肝损伤",
      "过敏反应及艰难梭菌相关性腹泻",
    ],
    memoryTip: "阿奇作用于 50S；非典型病原体的细胞结构并不相同。",
    diagram: {
      title: "阿奇霉素：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "阿奇霉素", role: "drug" },
        { id: "s0", label: "结合 50S 核糖体", role: "target" },
        { id: "s1", label: "肽链延伸受阻", role: "signal" },
        { id: "s2", label: "蛋白质合成受抑", role: "signal" },
        { id: "s3", label: "敏感菌生长受限", role: "effect" },
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
        "结合 50S 核糖体",
        "肽链延伸受阻",
        "蛋白质合成受抑",
        "敏感菌生长受限",
      ],
      explanation: "本题选取的上游到下游主线：结合 50S 核糖体 → 肽链延伸受阻 → 蛋白质合成受抑 → 敏感菌生长受限。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "阿奇霉素说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=cd01f37d-4392-4d2b-e053-2995a90a721f",
        sections: "5、12.1、12.4 节：心律与肝脏风险、50S / 23S rRNA 靶点及耐药。",
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
    id: "levofloxacin",
    genericName: "左氧氟沙星",
    brandNames: [
      "可乐必妥",
    ],
    englishName: "Levofloxacin",
    category: "antibacterial",
    target: "抑制细菌 DNA 回旋酶和拓扑异构酶 IV",
    mechanismSteps: [
      {
        title: "接触细菌拓扑异构酶",
        detail: "左氧氟沙星是氟喹诺酮类抗菌药，作用于细菌 DNA 回旋酶及拓扑异构酶 IV。",
      },
      {
        title: "干扰 DNA 相关酶功能",
        detail: "酶与 DNA 相关的切割、重接和拓扑调节过程受干扰。",
      },
      {
        title: "抑制复制等核酸过程",
        detail: "DNA 复制、转录等过程受阻，可产生杀菌作用。",
      },
      {
        title: "耐药与严重风险限制用途",
        detail: "靶点突变、外排和通透性变化等均可导致耐药，不能宣称双靶点意味着不易耐药；部分轻症感染需保留给无合适替代选择者。",
      },
    ],
    indications: [
      "经病原体、药敏和风险评估适用的细菌性肺炎等感染",
      "某些复杂性尿路感染等；不能作为所有轻症感染的默认选药",
    ],
    adverseReactions: [
      "肌腱炎或肌腱断裂",
      "周围神经病变及中枢神经系统反应",
      "QT 间期延长、血糖异常",
      "重症肌无力加重等严重风险",
    ],
    memoryTip: "两类拓扑异构酶是靶点；耐药与严重不良反应都不能忽视。",
    diagram: {
      title: "左氧氟沙星：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "左氧氟沙星", role: "drug" },
        { id: "s0", label: "拓扑异构酶受抑", role: "target" },
        { id: "s1", label: "DNA 拓扑调节受扰", role: "signal" },
        { id: "s2", label: "DNA 复制受阻", role: "signal" },
        { id: "s3", label: "敏感细菌死亡", role: "effect" },
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
        "拓扑异构酶受抑",
        "DNA 拓扑调节受扰",
        "DNA 复制受阻",
        "敏感细菌死亡",
      ],
      explanation: "本题选取的上游到下游主线：拓扑异构酶受抑 → DNA 拓扑调节受扰 → DNA 复制受阻 → 敏感细菌死亡。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "左氧氟沙星说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=067e260c-dc47-4957-a9ff-5a79f17b4ca0",
        sections: "警示、5、12.4 节：肌腱与神经风险、QT 间期、拓扑异构酶靶点及耐药。",
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
    id: "metronidazole",
    genericName: "甲硝唑",
    brandNames: [
      "灭滴灵",
    ],
    englishName: "Metronidazole",
    category: "antibacterial",
    target: "经还原活化形成可损伤微生物 DNA 的中间产物",
    mechanismSteps: [
      {
        title: "进入敏感微生物",
        detail: "甲硝唑具有针对敏感厌氧菌及某些原虫的作用，不能泛化为所有细菌通用。",
      },
      {
        title: "硝基被还原活化",
        detail: "在敏感厌氧菌内经电子传递体系还原，产生短寿命活性中间产物。",
      },
      {
        title: "与 DNA 相互作用",
        detail: "还原产物可干扰 DNA 合成并引起损伤；精确机制尚未完全阐明，不把特定共价交联写成已证实的唯一机制。",
      },
      {
        title: "抑制敏感微生物",
        detail: "核酸过程受损最终影响存活；耐药还可涉及活化效率、外排等变化。",
      },
    ],
    indications: [
      "敏感厌氧菌感染",
      "滴虫病、阿米巴病等符合说明书的原虫感染",
    ],
    adverseReactions: [
      "恶心、金属味",
      "周围神经病变或其他神经系统反应",
      "少见血细胞异常及肝损伤",
      "所引说明书要求用药期间及停药后至少 3 天避免酒精；不能把乙醛脱氢酶抑制写成定论",
    ],
    memoryTip: "先还原活化，再损伤 DNA；精确机制仍有未明之处。",
    diagram: {
      title: "甲硝唑：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "甲硝唑", role: "drug" },
        { id: "s0", label: "硝基还原活化", role: "signal" },
        { id: "s1", label: "活性中间产物形成", role: "signal" },
        { id: "s2", label: "DNA 合成受扰与损伤", role: "signal" },
        { id: "s3", label: "敏感微生物存活受限", role: "effect" },
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
        "硝基还原活化",
        "活性中间产物形成",
        "DNA 合成受扰与损伤",
        "敏感微生物存活受限",
      ],
      explanation: "本题选取的上游到下游主线：硝基还原活化 → 活性中间产物形成 → DNA 合成受扰与损伤 → 敏感微生物存活受限。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "甲硝唑口服片说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=f7e5dacd-0bc4-4ac4-e053-6394a90a457a&type=display",
        sections: "微生物学、适应症、警告：硝基还原、机制局限、耐药、厌氧菌与原虫、神经系统风险。",
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
    id: "penicillin-g",
    genericName: "青霉素 G",
    brandNames: [
      "青霉素钠",
      "苄青霉素",
    ],
    englishName: "Penicillin G",
    category: "antibacterial",
    target: "结合 PBP，抑制细菌细胞壁肽聚糖交联",
    mechanismSteps: [
      {
        title: "选择合适的青霉素 G 制剂",
        detail: "水溶性盐与苄星青霉素等长效制剂的途径、暴露和用途不同，不能互换。",
      },
      {
        title: "结合 PBP",
        detail: "β-内酰胺结构作用于细菌 PBP，抑制细胞壁合成。",
      },
      {
        title: "削弱细胞壁完整性",
        detail: "肽聚糖交联受阻，可导致敏感细菌死亡；β-内酰胺酶和靶点改变等可使药物失效。",
      },
      {
        title: "识别治疗相关反应",
        detail: "梅毒治疗后可发生吉海反应，通常在开始治疗后 24 小时内出现发热等症状。它不是青霉素过敏，亦不应简单解释为梅毒螺旋体释放内毒素。",
      },
    ],
    indications: [
      "敏感链球菌、肺炎链球菌等所致感染",
      "梅毒等感染；须依据病期选择青霉素 G 的具体制剂和给药途径",
    ],
    adverseReactions: [
      "过敏反应，包括过敏性休克；过敏史与皮试要求按当地规范核对",
      "高暴露时可发生神经毒性，肾功能下降者风险增加",
      "大量钾盐或钠盐制剂可带来电解质负荷",
      "艰难梭菌相关性腹泻",
    ],
    memoryTip: "青霉素 G 抑制细胞壁；水溶性盐和长效盐不能混用。",
    diagram: {
      title: "青霉素 G：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "青霉素 G", role: "drug" },
        { id: "s0", label: "PBP 受抑", role: "target" },
        { id: "s1", label: "肽聚糖交联受阻", role: "signal" },
        { id: "s2", label: "细胞壁受损", role: "signal" },
        { id: "s3", label: "敏感细菌死亡", role: "effect" },
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
        "PBP 受抑",
        "肽聚糖交联受阻",
        "细胞壁受损",
        "敏感细菌死亡",
      ],
      explanation: "本题选取的上游到下游主线：PBP 受抑 → 肽聚糖交联受阻 → 细胞壁受损 → 敏感细菌死亡。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "青霉素 G说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=e0ced9d8-b9ea-466e-bf2c-10e9cc636f3f",
        sections: "药理、适应症、警告与不良反应（剂型与适用范围见正文）",
      },
      {
        title: "CDC · 梅毒治疗指南",
        url: "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm",
        sections: "吉海反应与青霉素过敏的区分",
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
    id: "gentamicin",
    genericName: "庆大霉素",
    brandNames: [],
    englishName: "Gentamicin",
    category: "antibacterial",
    target: "结合细菌 30S 核糖体亚基，干扰蛋白质合成",
    mechanismSteps: [
      {
        title: "进入敏感细菌",
        detail: "庆大霉素是氨基糖苷类，其跨膜摄取与能量、氧依赖过程有关，对厌氧菌无有效覆盖。",
      },
      {
        title: "结合 30S 亚基",
        detail: "药物作用于核糖体，干扰起始过程并引起 mRNA 解码错误。",
      },
      {
        title: "形成异常蛋白并影响细菌存活",
        detail: "蛋白质合成异常及膜功能受损等参与杀菌作用；不能按胞内或胞外位置一概推断疗效。",
      },
      {
        title: "结合监测理解治疗窗",
        detail: "主要经肾清除。肾功能、暴露水平与合并用药影响肾毒性和耳毒性，需按方案监测。",
      },
    ],
    indications: [
      "敏感革兰阴性菌等所致严重感染；结合感染部位与药敏选择",
      "特定感染联合方案中的用药，不能凭协同机制自行联用",
    ],
    adverseReactions: [
      "肾毒性",
      "耳蜗及前庭毒性，可能不可逆",
      "神经肌肉阻滞及呼吸抑制风险",
      "过敏反应",
    ],
    memoryTip: "30S 读码出错；用药同时看肾功能、听力和暴露。",
    diagram: {
      title: "庆大霉素：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "庆大霉素", role: "drug" },
        { id: "s0", label: "结合 30S 核糖体", role: "target" },
        { id: "s1", label: "mRNA 解码受扰", role: "signal" },
        { id: "s2", label: "异常蛋白形成", role: "signal" },
        { id: "s3", label: "敏感菌功能受损", role: "effect" },
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
        "结合 30S 核糖体",
        "mRNA 解码受扰",
        "异常蛋白形成",
        "敏感菌功能受损",
      ],
      explanation: "本题选取的上游到下游主线：结合 30S 核糖体 → mRNA 解码受扰 → 异常蛋白形成 → 敏感菌功能受损。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "庆大霉素说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=449c9a41-d61e-49fd-b5e3-d76f74b92acf",
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
    id: "vancomycin",
    genericName: "万古霉素",
    brandNames: [
      "稳可信",
    ],
    englishName: "Vancomycin",
    category: "antibacterial",
    target: "结合肽聚糖前体的 D-Ala-D-Ala 末端",
    mechanismSteps: [
      {
        title: "按感染部位选择途径",
        detail: "万古霉素口服吸收通常很低；全身感染与肠腔内感染的给药途径不同，不能混用。",
      },
      {
        title: "结合肽聚糖前体",
        detail: "药物识别 D-Ala-D-Ala 末端，阻碍细胞壁合成；不是直接结合 PBP 的 β-内酰胺药。",
      },
      {
        title: "影响细胞壁组装",
        detail: "肽聚糖延长及交联受影响，产生针对敏感革兰阳性菌的作用。",
      },
      {
        title: "注意耐药与输注反应",
        detail: "MRSA 不等于必然对万古霉素敏感。输注速度可影响输注反应风险，但不能保证慢滴后不会发生任何反应。",
      },
    ],
    indications: [
      "敏感 MRSA 等革兰阳性菌所致严重全身感染（静脉制剂）",
      "特定肠腔内感染如艰难梭菌感染（口服方案，须核对对应制剂）",
    ],
    adverseReactions: [
      "肾毒性",
      "万古霉素输注反应，可有潮红、瘙痒、低血压",
      "耳毒性及血细胞减少",
      "严重过敏或皮肤反应",
    ],
    memoryTip: "万古结合前体末端；途径决定作用部位，慢滴也需观察反应。",
    diagram: {
      title: "万古霉素：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "万古霉素", role: "drug" },
        { id: "s0", label: "结合 D-Ala-D-Ala", role: "target" },
        { id: "s1", label: "肽聚糖组装受阻", role: "signal" },
        { id: "s2", label: "细胞壁合成受损", role: "signal" },
        { id: "s3", label: "敏感细菌存活受限", role: "effect" },
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
        "结合 D-Ala-D-Ala",
        "肽聚糖组装受阻",
        "细胞壁合成受损",
        "敏感细菌存活受限",
      ],
      explanation: "本题选取的上游到下游主线：结合 D-Ala-D-Ala → 肽聚糖组装受阻 → 细胞壁合成受损 → 敏感细菌存活受限。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "万古霉素说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=06dcfd36-942f-4752-86ad-4c5a6fc3e48f",
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
    id: "doxycycline",
    indicationQuizDistractorIds: [
      "amlodipine",
      "levothyroxine",
      "metformin",
    ],
    genericName: "多西环素",
    brandNames: [],
    englishName: "Doxycycline",
    category: "antibacterial",
    target: "结合细菌核糖体 30S 亚基，抑制蛋白质合成",
    mechanismSteps: [
      {
        title: "结合细菌 30S 亚基",
        detail: "多西环素属于四环素类，靶点位于细菌核糖体的小亚基。",
      },
      {
        title: "抑制蛋白质合成",
        detail: "核糖体功能受到干扰，细菌合成蛋白质的过程受抑。",
      },
      {
        title: "细菌所需蛋白质减少",
        detail: "蛋白质合成受限，使敏感细菌维持生长的能力下降。",
      },
      {
        title: "产生抑菌效应",
        detail: "可用于若干立克次体、衣原体及支原体感染；并非所有细菌都敏感，同类交叉耐药常见。",
      },
    ],
    indications: [
      "敏感立克次体感染，如斑疹伤寒类疾病",
      "肺炎支原体所致呼吸道感染",
      "敏感沙眼衣原体所致成人非复杂性尿道、宫颈或直肠感染",
    ],
    adverseReactions: [
      "恶心、腹泻及食管炎或食管溃疡，睡前立即吞服更需注意",
      "光敏反应：日晒后可出现明显皮肤反应",
      "牙齿发育期可能出现永久着色、釉质发育不全；儿童应用需权衡特定感染的获益",
      "颅内压升高及严重皮肤过敏反应已有报告",
    ],
    memoryTip: "「多西环素抓 30S」——记住支原体、衣原体和立克次体，也记住食管刺激与光敏。",
    diagram: {
      title: "30S 核糖体受抑 → 蛋白质合成减少",
      nodes: [
        { id: "n0", label: "多西环素", role: "drug" },
        { id: "n1", label: "30S 亚基", role: "target" },
        { id: "n2", label: "蛋白质合成 ↓", role: "signal" },
        { id: "n3", label: "细菌生长受抑", role: "effect" },
      ],
      edges: [
        { from: "n0", to: "n1", label: "阻断", kind: "inhibit" },
        { from: "n1", to: "n2", kind: "flow", label: "受抑后" },
        { from: "n2", to: "n3", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "DailyMed：Doxycycline hyclate 胶囊说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=fbc1924f-d647-465a-b8b2-25de332c5896",
        sections: "微生物学、适应症、警告及不良反应章节：30S 机制、敏感病原体、牙齿与食管等风险。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
    targetQuizDistractorIds: [
      "omeprazole",
      "levothyroxine",
      "aciclovir",
    ],
  },
  {
    id: "linezolid",
    indicationQuizDistractorIds: [
      "amlodipine",
      "levothyroxine",
      "metformin",
    ],
    genericName: "利奈唑胺",
    brandNames: [],
    englishName: "Linezolid",
    category: "antibacterial",
    target: "结合细菌 50S 亚基的 23S rRNA，阻止功能性 70S 起始复合物形成",
    mechanismSteps: [
      {
        title: "定位 50S 亚基",
        detail: "利奈唑胺属于噁唑烷酮类，结合细菌核糖体 50S 亚基上的 23S rRNA 位点。",
      },
      {
        title: "阻止翻译起始复合物形成",
        detail: "功能性 70S 起始复合物难以建立，蛋白质合成在起始环节受到阻断。",
      },
      {
        title: "抑制蛋白质合成",
        detail: "缺少有效起始复合物，细菌不能正常开展蛋白质翻译。",
      },
      {
        title: "限制敏感细菌生长",
        detail: "主要临床用途为敏感革兰阳性菌感染；不用于治疗革兰阴性菌感染，混合感染需另行覆盖。",
      },
    ],
    indications: [
      "敏感革兰阳性菌所致院内肺炎或复杂性皮肤软组织感染，含特定 MRSA 感染",
      "耐万古霉素屎肠球菌感染，包括伴发菌血症",
    ],
    adverseReactions: [
      "骨髓抑制：可见血小板减少，需监测血常规，较长疗程更需关注",
      "周围及视神经病变：长期使用时风险尤其值得注意",
      "血清素综合征：具有单胺氧化酶抑制作用，与促血清素药合用需评估",
      "乳酸性酸中毒：反复恶心呕吐或不明原因酸中毒需及时评估",
      "艰难梭菌相关腹泻",
    ],
    memoryTip: "「利奈唑胺卡起始」——50S 上挡住 70S 装配，另记血小板、视神经和血清素。",
    diagram: {
      title: "阻断翻译起始 → 抑制敏感细菌",
      nodes: [
        { id: "n0", label: "利奈唑胺", role: "drug" },
        { id: "n1", label: "50S 的 23S rRNA", role: "target" },
        { id: "n2", label: "70S 起始受阻", role: "signal" },
        { id: "n3", label: "蛋白质合成 ↓", role: "signal" },
        { id: "n4", label: "细菌生长受抑", role: "effect" },
      ],
      edges: [
        { from: "n0", to: "n1", label: "阻断", kind: "inhibit" },
        { from: "n1", to: "n2", kind: "flow", label: "受抑后" },
        { from: "n2", to: "n3", kind: "flow", label: "后续变化" },
        { from: "n3", to: "n4", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "DailyMed：Linezolid 片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3e0d868d-f419-47e8-a3bc-41ececac468b",
        sections: "第 1、5、7、12.4 节：革兰阳性菌适应症、骨髓及神经毒性、血清素相互作用和翻译起始机制。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
    targetQuizDistractorIds: [
      "omeprazole",
      "levothyroxine",
      "aciclovir",
    ],
  },
  {
    id: "clindamycin",
    genericName: "克林霉素",
    brandNames: [],
    englishName: "Clindamycin",
    category: "antibacterial",
    target: "结合细菌核糖体 50S 亚基的 23S rRNA，抑制蛋白质合成",
    targetQuizDistractorIds: [
      "amlodipine",
      "levothyroxine",
      "metformin",
    ],
    indicationQuizDistractorIds: [
      "amlodipine",
      "levothyroxine",
      "metformin",
    ],
    mechanismSteps: [
      {
        title: "结合 50S 亚基的 23S rRNA",
        detail: "克林霉素属于林可酰胺类，作用于细菌核糖体的大亚基。",
      },
      {
        title: "干扰核糖体蛋白质合成",
        detail: "核糖体合成蛋白质的过程受抑。",
      },
      {
        title: "减少细菌所需蛋白质",
        detail: "敏感细菌的生长受到限制。",
      },
      {
        title: "产生抑菌效应",
        detail: "需依据病原体及药敏选择；脑脊液浓度不足，不用于细菌性脑膜炎。",
      },
    ],
    indications: [
      "敏感厌氧菌引起的严重感染，如皮肤软组织或腹腔感染（口服胶囊说明书范围）",
      "敏感链球菌、肺炎链球菌或葡萄球菌严重感染，青霉素过敏或不适宜时选用",
    ],
    adverseReactions: [
      "艰难梭菌相关腹泻及结肠炎，可严重甚至致命，停药后仍可能出现",
      "恶心、腹痛、食管炎或食管溃疡",
      "皮疹及严重超敏反应",
      "黄疸或肝功能异常；少见血细胞异常",
    ],
    memoryTip: "「克林霉素卡住 50S」——厌氧菌用途要记，严重腹泻警示更要记。",
    diagram: {
      title: "结合核糖体 → 敏感细菌蛋白质合成受抑",
      nodes: [
        { id: "n0", label: "克林霉素", role: "drug" },
        { id: "n1", label: "50S / 23S rRNA", role: "target" },
        { id: "n2", label: "蛋白质合成 ↓", role: "signal" },
        { id: "n3", label: "细菌生长受抑", role: "effect" },
      ],
      edges: [
        { from: "n0", to: "n1", label: "抑制", kind: "inhibit" },
        { from: "n1", to: "n2", kind: "flow", label: "受抑后" },
        { from: "n2", to: "n3", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "DailyMed：Clindamycin hydrochloride 胶囊说明书",
        url: "https://www.dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b43dc396-17ef-a523-e053-2a95a90ac872",
        sections: "黑框警告、临床药理中的微生物学、适应症、警告与不良反应：50S 机制、感染范围及结肠炎风险。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
  },
  {
    id: "trimethoprim-sulfamethoxazole",
    genericName: "复方磺胺甲噁唑",
    brandNames: [],
    englishName: "Trimethoprim–sulfamethoxazole (TMP-SMX)",
    category: "antibacterial",
    target: "磺胺甲噁唑抑制二氢蝶酸合成酶，甲氧苄啶抑制二氢叶酸还原酶，双重阻断叶酸代谢",
    targetQuizDistractorIds: [
      "amlodipine",
      "levothyroxine",
      "metformin",
    ],
    indicationQuizDistractorIds: [
      "amlodipine",
      "levothyroxine",
      "metformin",
    ],
    mechanismSteps: [
      {
        title: "阻断叶酸代谢的两个酶位点",
        detail: "磺胺甲噁唑（SMX）作用于较前的合成环节，甲氧苄啶（TMP）作用于后续还原环节。",
      },
      {
        title: "减少四氢叶酸供应",
        detail: "两个连续环节均受抑，微生物可利用的还原型叶酸减少。",
      },
      {
        title: "限制核酸及蛋白质合成",
        detail: "叶酸依赖的生物合成受限，影响敏感微生物维持生长。",
      },
      {
        title: "抑制敏感病原体",
        detail: "除部分细菌感染外，还用于耶氏肺孢子菌肺炎的治疗及特定高风险人群预防。",
      },
    ],
    indications: [
      "敏感细菌所致尿路感染",
      "耶氏肺孢子菌肺炎的治疗，及免疫抑制且有发病风险者的预防",
    ],
    adverseReactions: [
      "严重皮疹、史蒂文斯-约翰逊综合征或中毒性表皮坏死松解症",
      "高钾血症：肾功能不全或合用其他升钾药时尤其需要关注",
      "骨髓抑制、血小板减少；G6PD 缺乏者可发生溶血",
      "结晶尿、间质性肾炎或肾功能异常",
      "恶心、呕吐及肝损伤；婴儿、妊娠和叶酸缺乏等情况需按说明书专门评估",
    ],
    memoryTip: "「SMX 拦前段，TMP 拦后段」——叶酸通路双阻断，同时记皮疹、高钾和血细胞异常。",
    diagram: {
      title: "两个酶位点共同减少还原型叶酸",
      nodes: [
        { id: "smx", label: "SMX", role: "drug" },
        { id: "tmp", label: "TMP", role: "drug" },
        { id: "dhps", label: "二氢蝶酸合成酶", role: "target" },
        { id: "dhfr", label: "二氢叶酸还原酶", role: "target" },
        { id: "folate", label: "四氢叶酸供应 ↓", role: "signal" },
        { id: "effect", label: "生物合成受限", role: "effect" },
      ],
      edges: [
        { from: "smx", to: "dhps", label: "前段抑制", kind: "inhibit" },
        { from: "tmp", to: "dhfr", label: "后段抑制", kind: "inhibit" },
        { from: "dhps", to: "folate", kind: "flow", label: "受抑后" },
        { from: "dhfr", to: "folate", kind: "flow", label: "受抑后" },
        { from: "folate", to: "effect", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "DailyMed：BACTRIM（sulfamethoxazole / trimethoprim）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f59d0c04-9c66-4d53-a0e1-cb55570deb62",
        sections: "临床药理中的微生物学、适应症、禁忌、警告、注意事项与不良反应：双重叶酸阻断及肺孢子菌用途。",
      },
      {
        title: "emc：Co-Trimoxazole 80/400mg Tablets 产品特性概要",
        url: "https://www.medicines.org.uk/emc/product/11465/smpc",
        sections: "第 5.1 节：连续叶酸代谢阻断、二氢蝶酸合成酶与二氢叶酸还原酶作用位点。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
  },
  {
    id: "amoxicillin-clavulanate",
    genericName: "阿莫西林克拉维酸钾",
    brandNames: [],
    englishName: "Amoxicillin / clavulanate potassium",
    category: "antibacterial",
    target: "阿莫西林抑制青霉素结合蛋白（PBP）；克拉维酸抑制部分 β-内酰胺酶以保护阿莫西林",
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
        title: "克拉维酸抑制部分 β-内酰胺酶",
        detail: "复方中两种成分协作；该作用只针对部分酶，不能据此认为覆盖所有耐药菌。",
      },
      {
        title: "减少阿莫西林被酶水解",
        detail: "酶抑制剂使阿莫西林对部分产酶菌恢复抗菌活性。",
      },
      {
        title: "阿莫西林抑制 PBP 与细胞壁合成",
        detail: "阿莫西林作用于青霉素结合蛋白，阻碍细菌细胞壁构建。",
      },
      {
        title: "杀灭相应敏感细菌",
        detail: "药物选择需匹配感染部位、病原与敏感性；病毒性感冒不属于用途。",
      },
    ],
    indications: [
      "所引说明书范围内、相应敏感产酶菌引起的下呼吸道感染",
      "相应敏感菌引起的急性细菌性鼻窦炎",
      "符合具体制剂说明书的皮肤软组织感染或尿路感染",
    ],
    adverseReactions: [
      "腹泻、恶心或呕吐；持续或严重腹泻需警惕艰难梭菌相关感染",
      "过敏反应，包括过敏性休克与严重皮肤反应",
      "肝损伤或胆汁淤积性黄疸；既往使用该复方曾引起此类损伤者禁用",
      "不同规格的两种成分比例可能不同，不能仅按阿莫西林含量随意替换",
    ],
    memoryTip: "「克拉维酸护药，阿莫西林破壁」——只保护部分产酶情况，仍要看细菌是否敏感。",
    diagram: {
      title: "抑酶保护阿莫西林 → 抑制细胞壁合成",
      nodes: [
        { id: "clav", label: "克拉维酸", role: "drug" },
        { id: "enzyme", label: "部分 β-内酰胺酶", role: "target" },
        { id: "amox", label: "阿莫西林", role: "drug" },
        { id: "pbp", label: "PBP", role: "target" },
        { id: "wall", label: "细胞壁合成 ↓", role: "signal" },
        { id: "effect", label: "敏感细菌死亡", role: "effect" },
      ],
      edges: [
        { from: "clav", to: "enzyme", label: "抑制", kind: "inhibit" },
        { from: "enzyme", to: "amox", label: "受抑后保护", kind: "flow" },
        { from: "amox", to: "pbp", label: "抑制", kind: "inhibit" },
        { from: "pbp", to: "wall", label: "受抑后", kind: "flow" },
        { from: "wall", to: "effect", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "FDA：AUGMENTIN 阿莫西林／克拉维酸钾说明书（2026）",
        url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/050564s061lbl.pdf",
        sections: "第 1～2、4～6、12.2、12.4 节：制剂适用范围、肝胆与过敏风险、β-内酰胺酶和 PBP 双重作用。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
  },
  {
    id: "cefuroxime-axetil",
    genericName: "头孢呋辛酯",
    brandNames: [],
    englishName: "Cefuroxime axetil",
    category: "antibacterial",
    target: "水解为头孢呋辛后结合青霉素结合蛋白（PBP），抑制细菌细胞壁合成",
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
        title: "前药水解为头孢呋辛",
        detail: "口服头孢呋辛酯经酯酶水解，释放具有抗菌活性的头孢呋辛。",
      },
      {
        title: "结合青霉素结合蛋白",
        detail: "活性成分与细菌 PBP 结合，干扰细胞壁肽聚糖的合成。",
      },
      {
        title: "破坏细胞壁形成",
        detail: "细胞壁生物合成受阻，导致敏感细菌裂解死亡。",
      },
      {
        title: "治疗敏感细菌感染",
        detail: "属于第二代头孢菌素；需考虑感染部位与当地药敏，不能因属于头孢就推断覆盖所有耐药菌。",
      },
    ],
    indications: [
      "敏感细菌引起的急性链球菌性咽炎或扁桃体炎",
      "敏感细菌引起的急性细菌性鼻窦炎",
      "敏感细菌引起的膀胱炎或非复杂性皮肤软组织感染",
    ],
    adverseReactions: [
      "腹泻、恶心、腹痛或念珠菌过度生长",
      "过敏反应，少见严重皮肤反应；需核对头孢及其他 β 内酰胺严重过敏史",
      "艰难梭菌相关结肠炎，治疗中或治疗后明显腹泻需评估",
      "肾功能减退时蓄积可增加神经系统毒性风险，需按肾功能调整",
    ],
    memoryTip: "「呋辛酯先拆酯，再由呋辛堵 PBP」——片剂与口服混悬剂不能简单按毫克对换。",
    diagram: {
      title: "口服前药活化 → PBP → 细胞壁合成受抑",
      nodes: [
        { id: "pro", label: "头孢呋辛酯", role: "drug" },
        { id: "drug", label: "头孢呋辛", role: "drug" },
        { id: "pbp", label: "PBP", role: "target" },
        { id: "wall", label: "细胞壁合成 ↓", role: "signal" },
        { id: "effect", label: "敏感细菌死亡", role: "effect" },
      ],
      edges: [
        { from: "pro", to: "drug", label: "水解活化", kind: "flow" },
        { from: "drug", to: "pbp", label: "结合抑制", kind: "inhibit" },
        { from: "pbp", to: "wall", label: "受抑后", kind: "flow" },
        { from: "wall", to: "effect", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "emc：Zinnat（头孢呋辛酯）片说明书",
        url: "https://www.medicines.org.uk/emc/product/3811/smpc",
        sections: "第 4.1～4.4、4.8、5.1～5.2 节：前药活化与 PBP、感染范围、肾功能及片剂与混悬剂非等效。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
  {
    id: "nitrofurantoin",
    genericName: "呋喃妥因",
    brandNames: [],
    englishName: "Nitrofurantoin",
    category: "antibacterial",
    target: "经细菌黄素蛋白还原为活性中间体，影响核糖体蛋白等大分子，抑制多种细菌代谢过程",
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
        title: "由细菌酶还原活化",
        detail: "细菌黄素蛋白将呋喃妥因还原为反应性中间体。",
      },
      {
        title: "影响核糖体蛋白与其他大分子",
        detail: "活性中间体使多种细菌大分子失活或改变，不局限于一个受体或一种酶。",
      },
      {
        title: "抑制多种关键生化过程",
        detail: "蛋白合成、核酸合成、能量代谢等过程受影响；多靶点不代表细菌永远不会耐药。",
      },
      {
        title: "在尿中发挥抗菌作用",
        detail: "所引单水合物/大结晶胶囊用于敏感菌引起的急性单纯性膀胱炎；组织分布有限，不用于肾盂肾炎或肾周脓肿。",
      },
    ],
    indications: [
      "敏感大肠埃希菌或腐生葡萄球菌引起的急性单纯性膀胱炎（所引 Macrobid 制剂范围）",
    ],
    adverseReactions: [
      "恶心、胃肠道不适，尿液可呈棕色",
      "急性或慢性肺部反应，包括间质性肺炎和肺纤维化",
      "肝炎、胆汁淤积或其他肝损伤",
      "周围神经病变；G6PD 缺乏等情况下可发生溶血",
      "明显肾功能不全及临近分娩等情境有用药禁忌，须核对具体标签与临床条件",
    ],
    memoryTip: "「呋喃经菌活化，多点干扰、尿中抗菌」——膀胱炎的药不能直接套用到肾盂肾炎。",
    diagram: {
      title: "细菌酶还原 → 多靶点干扰 → 尿中抗菌",
      nodes: [
        { id: "drug", label: "呋喃妥因", role: "drug" },
        { id: "active", label: "反应性中间体", role: "drug" },
        { id: "target", label: "细菌核糖体及大分子", role: "target" },
        { id: "process", label: "关键生化过程受抑", role: "signal" },
        { id: "effect", label: "敏感尿路细菌受抑", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "active", label: "细菌酶还原", kind: "flow" },
        { from: "active", to: "target", label: "干扰", kind: "inhibit" },
        { from: "target", to: "process", label: "失活后", kind: "flow" },
        { from: "process", to: "effect", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "DailyMed：MACROBID（呋喃妥因）胶囊说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=28bc9ec9-b8db-4ece-a14a-8bcf618cbf7e",
        sections: "临床药理/微生物学、适应症、禁忌、警告及不良反应：多靶点机制、单纯性膀胱炎范围及肺肝神经风险。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
];
