import type { DrugCard } from "@/lib/types";

/**
 * 抗肿瘤药物 · 11 张卡片
 *
 * 三条主线：烷化剂（DNA 交联）、抗代谢药（叶酸循环）、
 * 分子靶向（HER2 单抗、BCR-ABL 与 EGFR 酪氨酸激酶抑制剂）。
 */
export const antineoplasticCards: readonly DrugCard[] = [
  {
    id: "cyclophosphamide",
    genericName: "环磷酰胺",
    brandNames: [
      "安道生",
    ],
    englishName: "Cyclophosphamide",
    category: "antineoplastic",
    target: "活性烷化代谢物损伤 DNA，包括形成交联",
    mechanismSteps: [
      {
        title: "经肝代谢活化",
        detail: "环磷酰胺是前药，转化为 4-羟基环磷酰胺并与醛磷酰胺相互转化。",
      },
      {
        title: "生成烷化活性物及副产物",
        detail: "醛磷酰胺可分解产生磷酰胺氮芥和丙烯醛；丙烯醛不是由磷酰胺氮芥继续转化而来。",
      },
      {
        title: "损伤肿瘤细胞 DNA",
        detail: "磷酰胺氮芥等活性物参与 DNA 烷化及交联，干扰细胞增殖；通常归为细胞周期非特异性药，不能限定只作用于 G2 期。",
      },
      {
        title: "同时损伤正常组织",
        detail: "骨髓、生殖系统和膀胱等也可受损；美司钠用于特定方案的尿路保护，不是消除所有毒性的解毒药。",
      },
    ],
    indications: [
      "淋巴瘤、乳腺癌等恶性肿瘤的特定治疗方案",
      "符合条件的难治性儿童微小病变肾病综合征等，需专科评估",
    ],
    adverseReactions: [
      "骨髓抑制及感染",
      "出血性膀胱炎等尿路毒性",
      "恶心、呕吐及脱发，强度与方案有关",
      "生殖毒性、继发恶性肿瘤及心肺毒性风险",
    ],
    memoryTip: "前药活化后烷化 DNA；磷酰胺氮芥和丙烯醛是分支产物。",
    diagram: {
      title: "环磷酰胺：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "环磷酰胺", role: "drug" },
        { id: "s0", label: "肝代谢活化", role: "signal" },
        { id: "s1", label: "形成烷化活性物", role: "signal" },
        { id: "s2", label: "DNA 交联等损伤", role: "signal" },
        { id: "s3", label: "细胞增殖受阻", role: "effect" },
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
        "肝代谢活化",
        "形成烷化活性物",
        "DNA 交联等损伤",
        "细胞增殖受阻",
      ],
      explanation: "本题选取的上游到下游主线：肝代谢活化 → 形成烷化活性物 → DNA 交联等损伤 → 细胞增殖受阻。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "环磷酰胺说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=5bad5bfc-12c0-46a2-8355-1028f108ecbf",
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
    id: "methotrexate",
    genericName: "甲氨蝶呤",
    brandNames: [],
    englishName: "Methotrexate",
    category: "antineoplastic",
    target: "抑制二氢叶酸还原酶（DHFR）等叶酸相关过程",
    mechanismSteps: [
      {
        title: "进入细胞并影响叶酸代谢",
        detail: "甲氨蝶呤可形成细胞内多聚谷氨酸代谢物；DHFR 抑制是其抗代谢作用的重要环节。",
      },
      {
        title: "减少还原叶酸供应",
        detail: "二氢叶酸向四氢叶酸的还原受阻，影响一碳单位转移。",
      },
      {
        title: "干扰核苷酸与 DNA 合成",
        detail: "嘌呤和胸苷酸合成受影响，限制增殖细胞；低剂量抗炎作用不能完全用这条抗肿瘤机制解释。",
      },
      {
        title: "区分解救与常规补充",
        detail: "亚叶酸是 5-甲酰四氢叶酸，可绕过 DHFR 环节；解救须按具体方案。非肿瘤用途常按周给药，误作每日服用可致严重甚至致命毒性。",
      },
    ],
    indications: [
      "特定白血病、淋巴瘤等抗肿瘤方案",
      "类风湿关节炎、严重银屑病等非肿瘤用途，给药周期须严格核对",
    ],
    adverseReactions: [
      "骨髓抑制与黏膜损伤",
      "肝毒性、肾毒性",
      "肺炎或其他肺损伤",
      "胚胎胎儿毒性；给药频次错误可致命",
    ],
    memoryTip: "DHFR 阻断影响核酸；亚叶酸是解救环节，按周不能记成每日。",
    diagram: {
      title: "甲氨蝶呤：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "甲氨蝶呤", role: "drug" },
        { id: "s0", label: "DHFR 受抑", role: "target" },
        { id: "s1", label: "还原叶酸供应减少", role: "signal" },
        { id: "s2", label: "核苷酸合成受扰", role: "signal" },
        { id: "s3", label: "DNA 合成受限", role: "effect" },
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
        "DHFR 受抑",
        "还原叶酸供应减少",
        "核苷酸合成受扰",
        "DNA 合成受限",
      ],
      explanation: "本题选取的上游到下游主线：DHFR 受抑 → 还原叶酸供应减少 → 核苷酸合成受扰 → DNA 合成受限。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "甲氨蝶呤说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=aafd97c1-3a0a-42b2-845a-a9db9bb7d876",
        sections: "药理、适应症、警告与不良反应（剂型与适用范围见正文）",
      },
      {
        title: "亚叶酸钙注射剂说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=79d023ab-7d77-48c1-8f47-ea322fd58c2b",
        sections: "叶酸拮抗药解救与氟尿嘧啶联用用途的区分",
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
    id: "trastuzumab",
    genericName: "曲妥珠单抗",
    brandNames: [
      "赫赛汀",
    ],
    englishName: "Trastuzumab",
    category: "antineoplastic",
    target: "结合 HER2 受体胞外结构域，并可介导 ADCC",
    mechanismSteps: [
      {
        title: "识别 HER2 胞外结构域",
        detail: "曲妥珠单抗是人源化单克隆抗体，用药选择依赖相应癌种与 HER2 检测。",
      },
      {
        title: "抑制 HER2 相关增殖",
        detail: "说明书支持其抑制 HER2 过表达肿瘤细胞增殖；不能将阻断二聚化写成与帕妥珠单抗相同的特异机制。",
      },
      {
        title: "介导免疫效应",
        detail: "可通过抗体依赖的细胞介导细胞毒作用（ADCC）参与抗肿瘤效应，与信号影响不是固定先后关系。",
      },
      {
        title: "监测正常组织风险",
        detail: "HER2 相关作用并非只发生在肿瘤，需关注心肌病、输注反应和肺毒性。",
      },
    ],
    indications: [
      "符合 HER2 检测及治疗条件的乳腺癌",
      "HER2 阳性转移性胃或胃食管结合部腺癌的特定联合方案",
    ],
    adverseReactions: [
      "心肌病、左室功能下降",
      "输注反应及严重过敏",
      "肺毒性",
      "胚胎胎儿毒性",
    ],
    memoryTip: "抗体识别 HER2，并可借助 ADCC；不能把作用只记成二聚化阻断。",
    diagram: {
      title: "曲妥珠单抗：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "曲妥珠单抗", role: "drug" },
        { id: "s0", label: "结合 HER2 胞外结构域", role: "target" },
        { id: "s1", label: "影响增殖并介导 ADCC", role: "signal" },
        { id: "s2", label: "HER2 阳性肿瘤生长受抑", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "s0", label: "主线环节", kind: "flow" },
        { from: "s0", to: "s1", label: "后续变化", kind: "flow" },
        { from: "s1", to: "s2", label: "后续变化", kind: "flow" },
      ],
    },
    sources: [
      {
        title: "曲妥珠单抗 HERCEPTIN 静脉制剂说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=492dbdb2-077e-4064-bff3-372d6af0a7a2",
        sections: "1、2.1、2.2、5、11、12.1 节：HER2 检测、抗体与胞外结合、ADCC 及心肺风险。",
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
    id: "imatinib",
    genericName: "伊马替尼",
    brandNames: [
      "格列卫",
    ],
    englishName: "Imatinib",
    category: "antineoplastic",
    target: "抑制 BCR-ABL、KIT、PDGFR 等酪氨酸激酶",
    mechanismSteps: [
      {
        title: "识别相关激酶靶点",
        detail: "伊马替尼是小分子酪氨酸激酶抑制剂；除 BCR-ABL 外，还作用于 KIT、PDGFR 等。",
      },
      {
        title: "抑制激酶信号",
        detail: "相关蛋白磷酸化与下游增殖、生存信号受到抑制。",
      },
      {
        title: "抑制依赖该通路的肿瘤细胞",
        detail: "可降低增殖并诱导凋亡；效应取决于疾病与分子特征，不能保证血象必然恢复正常。",
      },
      {
        title: "按分子结果选择情境",
        detail: "Ph+ CML 与特定 GIST 的依据不同；突变、耐药和疾病阶段影响治疗选择，不是所有同类肿瘤都适用。",
      },
    ],
    indications: [
      "符合条件的 Ph+（BCR-ABL 阳性）慢性髓性白血病",
      "特定 KIT 阳性不可切除或转移性 GIST 等符合说明书的情境",
    ],
    adverseReactions: [
      "液体潴留及水肿",
      "血细胞减少",
      "恶心、腹泻及肌肉痉挛",
      "肝毒性及其他少见严重器官损伤",
    ],
    memoryTip: "伊马替尼看 BCR-ABL、KIT 等分子背景，不能只记一个靶点。",
    diagram: {
      title: "伊马替尼：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "伊马替尼", role: "drug" },
        { id: "s0", label: "相关酪氨酸激酶受抑", role: "target" },
        { id: "s1", label: "下游磷酸化信号减弱", role: "signal" },
        { id: "s2", label: "肿瘤增殖信号减弱", role: "signal" },
        { id: "s3", label: "敏感肿瘤生长受限", role: "effect" },
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
        "相关酪氨酸激酶受抑",
        "下游磷酸化信号减弱",
        "肿瘤增殖信号减弱",
        "敏感肿瘤生长受限",
      ],
      explanation: "本题选取的上游到下游主线：相关酪氨酸激酶受抑 → 下游磷酸化信号减弱 → 肿瘤增殖信号减弱 → 敏感肿瘤生长受限。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "伊马替尼说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c0611fc0-b217-4988-acd4-b8c629ce489b",
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
    id: "cisplatin",
    genericName: "顺铂",
    brandNames: [],
    englishName: "Cisplatin",
    category: "antineoplastic",
    target: "与 DNA 结合形成链内和链间交联",
    mechanismSteps: [
      {
        title: "进入细胞并发生配体交换",
        detail: "顺铂在细胞内形成更易与生物分子反应的形式。",
      },
      {
        title: "结合 DNA",
        detail: "主要与 DNA 反应形成链内和链间交联，造成结构与功能损伤。",
      },
      {
        title: "干扰复制和转录",
        detail: "DNA 损伤触发细胞毒性过程，最终可导致细胞死亡；不能限定为某一细胞周期阶段。",
      },
      {
        title: "同时影响正常组织",
        detail: "肾、听觉和神经组织等也可受损，治疗需要水化及相应监测；不能将特定肿瘤方案疗效推广成所有癌种的高治愈率。",
      },
    ],
    indications: [
      "睾丸癌、卵巢癌等特定联合化疗方案",
      "符合说明书条件的晚期膀胱癌等",
    ],
    adverseReactions: [
      "肾毒性和电解质丢失",
      "耳毒性",
      "明显恶心、呕吐",
      "周围神经病变及骨髓抑制",
    ],
    memoryTip: "铂类形成 DNA 交联；肾、耳和神经是重要风险。",
    diagram: {
      title: "顺铂：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "顺铂", role: "drug" },
        { id: "s0", label: "形成反应性铂化合物", role: "signal" },
        { id: "s1", label: "DNA 交联形成", role: "signal" },
        { id: "s2", label: "复制与转录受扰", role: "signal" },
        { id: "s3", label: "细胞毒性与细胞死亡", role: "effect" },
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
        "形成反应性铂化合物",
        "DNA 交联形成",
        "复制与转录受扰",
        "细胞毒性与细胞死亡",
      ],
      explanation: "本题选取的上游到下游主线：形成反应性铂化合物 → DNA 交联形成 → 复制与转录受扰 → 细胞毒性与细胞死亡。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "顺铂注射液说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a440f077-46f6-4688-a209-65bce38d1c92",
        sections: "5.1～5.6、12.1、12.3 节：DNA 交联、化学取代及肾、耳、神经和骨髓毒性。",
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
    id: "fluorouracil",
    genericName: "氟尿嘧啶",
    brandNames: [],
    englishName: "Fluorouracil",
    category: "antineoplastic",
    target: "代谢物抑制胸苷酸合成酶，并可掺入 RNA 或 DNA",
    mechanismSteps: [
      {
        title: "细胞内形成活性代谢物",
        detail: "氟尿嘧啶转化为 FdUMP、FUTP、FdUTP 等，作用不止一条路径。",
      },
      {
        title: "FdUMP 抑制胸苷酸合成",
        detail: "FdUMP 与胸苷酸合成酶及还原叶酸形成复合物，减少 dTMP 合成。",
      },
      {
        title: "其他代谢物影响核酸功能",
        detail: "FUTP 可掺入 RNA，FdUTP 可掺入 DNA，影响核酸功能；这些是并行分支。",
      },
      {
        title: "注意 DPD 相关风险",
        detail: "DPD 是重要分解途径，完全或部分缺陷可增加严重毒性风险；评估按说明书及临床方案进行。",
      },
    ],
    indications: [
      "结直肠癌等特定抗肿瘤方案（系统制剂）",
      "乳腺癌、胃癌、胰腺癌等符合方案的情境；外用制剂另有用途",
    ],
    adverseReactions: [
      "骨髓抑制、口腔炎及腹泻",
      "手足综合征",
      "心脏毒性和神经毒性",
      "DPD 缺陷可能导致早发、严重甚至致命毒性",
    ],
    memoryTip: "5-FU 既影响胸苷酸，也影响 RNA/DNA；DPD 风险不能漏。",
    diagram: {
      title: "氟尿嘧啶：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "氟尿嘧啶", role: "drug" },
        { id: "s0", label: "形成 FdUMP", role: "signal" },
        { id: "s1", label: "胸苷酸合成酶受抑", role: "signal" },
        { id: "s2", label: "dTMP 合成减少", role: "signal" },
        { id: "s3", label: "DNA 合成受限", role: "effect" },
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
        "形成 FdUMP",
        "胸苷酸合成酶受抑",
        "dTMP 合成减少",
        "DNA 合成受限",
      ],
      explanation: "本题选取的上游到下游主线：形成 FdUMP → 胸苷酸合成酶受抑 → dTMP 合成减少 → DNA 合成受限。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "氟尿嘧啶注射液说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=8eff167f-203a-4a81-b2fc-d8773bc3555e",
        sections: "黑框警告、2.1、5.1～5.8、12.1、12.5 节：DPD / DPYD、活性代谢物、核酸作用及严重毒性。",
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
    id: "gefitinib",
    genericName: "吉非替尼",
    brandNames: [
      "易瑞沙",
    ],
    englishName: "Gefitinib",
    category: "antineoplastic",
    target: "可逆抑制 EGFR 酪氨酸激酶活性",
    mechanismSteps: [
      {
        title: "结合 EGFR 激酶环节",
        detail: "吉非替尼是小分子酪氨酸激酶抑制剂，在激酶结构域影响 ATP 相关作用。",
      },
      {
        title: "减少 EGFR 自磷酸化",
        detail: "抑制 EGFR 激酶活性，阻断相关下游信号。",
      },
      {
        title: "限制依赖 EGFR 的增殖",
        detail: "特定敏感 EGFR 突变背景下可产生治疗效应，选择需结合癌种、分期及分子检测。",
      },
      {
        title: "正常组织也可受影响",
        detail: "皮疹、腹泻等属于不良反应，不能作为药物有效的证明；耐药后需重新评估，不能仅凭一个名称自行换药。",
      },
    ],
    indications: [
      "所引说明书限定的 EGFR 外显子 19 缺失或 21 L858R 突变的转移性非小细胞肺癌",
    ],
    adverseReactions: [
      "皮疹及其他皮肤反应",
      "腹泻",
      "间质性肺病，可能严重",
      "肝损伤及少见胃肠穿孔",
    ],
    memoryTip: "EGFR 敏感突变指导选择；皮疹仍是不良反应，不是疗效证明。",
    diagram: {
      title: "吉非替尼：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "吉非替尼", role: "drug" },
        { id: "s0", label: "EGFR 激酶受抑", role: "target" },
        { id: "s1", label: "受体自磷酸化减少", role: "signal" },
        { id: "s2", label: "下游增殖信号减弱", role: "signal" },
        { id: "s3", label: "EGFR 依赖性增殖受限", role: "effect" },
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
        "EGFR 激酶受抑",
        "受体自磷酸化减少",
        "下游增殖信号减弱",
        "EGFR 依赖性增殖受限",
      ],
      explanation: "本题选取的上游到下游主线：EGFR 激酶受抑 → 受体自磷酸化减少 → 下游增殖信号减弱 → EGFR 依赖性增殖受限。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "吉非替尼口服片说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1a3c0ce7-06a1-4e04-9106-14ddb2a866a5",
        sections: "1、2.1、5、6、12.1 节：EGFR 突变、适用癌种、可逆激酶抑制及肺、肝等风险。",
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
    id: "pembrolizumab",
    genericName: "帕博利珠单抗",
    brandNames: [
      "可瑞达",
    ],
    englishName: "Pembrolizumab",
    category: "antineoplastic",
    target: "结合 T 细胞表面 PD-1 受体，阻断其与 PD-L1/PD-L2 结合以解除免疫抑制",
    mechanismSteps: [
      {
        title: "结合 T 细胞 PD-1 免疫检查点",
        detail: "帕博利珠单抗是人源化单克隆抗体，高亲和力结合 T 细胞表面的程序性死亡受体-1（PD-1）。",
      },
      {
        title: "阻断 PD-L1 / PD-L2 配体结合",
        detail: "部分肿瘤细胞上调 PD-L1/PD-L2 以逃避免疫监视；阻断 PD-1 与配体相互作用可解除该通路对 T 细胞增殖与细胞因子分泌的抑制。",
      },
      {
        title: "恢复抗肿瘤 T 细胞免疫应答",
        detail: "增强机体内源性抗肿瘤 T 细胞免疫反应，而非直接对肿瘤细胞发挥细胞毒杀伤。",
      },
      {
        title: "按生物标志物和获批情境用药，警惕免疫相关不良反应",
        detail: "多种瘤种需依据经验证检测评估 PD-L1（TPS/CPS）或 MSI-H/dMMR 等标志物；免疫系统被激活后可攻击正常器官，引起潜在致命的免疫介导不良反应，多需糖皮质激素干预。",
      },
    ],
    indications: [
      "符合相应分期及生物标志物检测条件（如 PD-L1 表达）的黑色素瘤、非小细胞肺癌、头颈部鳞癌等获批实体瘤及经典霍奇金淋巴瘤",
      "经检测确认为微卫星高度不稳定（MSI-H）或错配修复缺陷（dMMR）的特定不可切除或转移性实体瘤",
    ],
    adverseReactions: [
      "免疫介导性肺炎、结肠炎及肝炎（可严重甚至致命，需监测并按分级使用糖皮质激素）",
      "免疫介导性内分泌病变：甲状腺功能减退/亢进、垂体炎、肾上腺皮质功能不全及 1 型糖尿病",
      "免疫介导性肾炎伴肾功能异常，及严重皮肤反应（包括 SJS/TEN）",
      "疲劳、肌肉骨骼疼痛、输注反应及异体造血干细胞移植相关并发症风险",
    ],
    memoryTip: "帕博利珠单抗松开 T 细胞的 PD-1 刹车；按标志物（PD-L1/MSI-H）选人，全身器官都要防免疫误伤。",
    diagram: {
      title: "帕博利珠单抗：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "帕博利珠单抗", role: "drug" },
        { id: "s0", label: "PD-1 检查点", role: "target" },
        { id: "s1", label: "阻断 PD-L1 结合", role: "signal" },
        { id: "s2", label: "T 细胞抑制解除", role: "signal" },
        { id: "s3", label: "抗肿瘤免疫增强", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "s0", label: "结合阻断", kind: "inhibit" },
        { from: "s0", to: "s1", label: "屏蔽配体", kind: "flow" },
        { from: "s1", to: "s2", label: "解除刹车", kind: "activate" },
        { from: "s2", to: "s3", label: "免疫杀伤", kind: "flow" },
      ],
    },
    mechanismQuiz: {
      steps: [
        "单抗结合 T 细胞 PD-1 受体",
        "阻断 PD-1 与 PD-L1/PD-L2 结合",
        "解除 PD-1 通路对 T 细胞的抑制",
        "增强内源性抗肿瘤 T 细胞应答",
      ],
      explanation: "本题选取的上游到下游主线：单抗结合 T 细胞 PD-1 受体 → 阻断 PD-1 与 PD-L1/PD-L2 结合 → 解除 PD-1 通路对 T 细胞的抑制 → 增强内源性抗肿瘤 T 细胞应答。它是简化的作用关系，临床使用需结合特定瘤种、标志物检测及免疫相关不良反应监测。",
    },
    sources: [
      {
        title: "KEYTRUDA（pembrolizumab）说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=295058cb-4654-460d-9b19-33aa822d564a",
        sections: "第 1、2.1、5.1、6、12.1 节：PD-1 通路阻断、PD-L1/MSI-H 标志物检测要求及免疫介导性器官毒性。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
    targetQuizDistractorIds: [
      "omeprazole",
      "levothyroxine",
      "amlodipine",
    ],
    indicationQuizDistractorIds: [
      "levothyroxine",
      "metformin",
      "omeprazole",
    ],
  },
  {
    id: "paclitaxel",
    genericName: "紫杉醇",
    brandNames: [
      "泰素",
    ],
    englishName: "Paclitaxel",
    category: "antineoplastic",
    target: "促进微管蛋白聚合并稳定微管、抑制其解聚，将细胞阻滞于 G2/M 期",
    mechanismSteps: [
      {
        title: "结合微管并抑制解聚",
        detail: "紫杉醇属于紫杉烷类抗肿瘤药，促进微管蛋白二聚体组装为微管，并通过阻止微管解聚使其过度稳定（与长春碱类抑制聚合方向相反）。",
      },
      {
        title: "破坏微管网络动态重组",
        detail: "微管正常动态重组受阻，在细胞周期中形成异常微管束，有丝分裂期出现多极纺锤体星状体。",
      },
      {
        title: "诱导 G2/M 期阻滞与细胞凋亡",
        detail: "分裂期细胞无法完成正常染色体分离，停滞于 G2/M 期并触发程序性细胞死亡。",
      },
      {
        title: "关注剂量限制性毒性与溶媒预处理",
        detail: "常规紫杉醇注射液含聚氧乙烯蓖麻油溶媒，易引发严重超敏反应，须规范给予糖皮质激素及 H1/H2 拮抗剂预处理；且存在骨髓抑制和累积性周围神经病变。",
      },
    ],
    indications: [
      "晚期卵巢癌的一线（联合顺铂）及后续治疗（常规紫杉醇注射液）",
      "特定乳腺癌辅助治疗及联合化疗失败后的转移性乳腺癌",
      "不适合手术或放疗的非小细胞肺癌联合顺铂一线治疗，及艾滋病相关卡波西肉瘤二线治疗",
    ],
    adverseReactions: [
      "剂量限制性骨髓抑制（主要为重度中性粒细胞减少及感染风险，黑框警告）",
      "严重超敏反应（呼吸困难、低血压、血管性水肿，需严格预处理，黑框警告）",
      "剂量累积性周围神经病变（肢端麻木、感觉异常）",
      "脱发、关节痛/肌痛、心动过缓及消化道黏膜炎",
    ],
    memoryTip: "紫杉醇“把微管冻住不拆伙”，阻在 G2/M 期；谨防中性粒细胞下降、手脚麻木和蓖麻油过敏。",
    diagram: {
      title: "紫杉醇：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "紫杉醇", role: "drug" },
        { id: "s0", label: "微管聚合稳定", role: "target" },
        { id: "s1", label: "阻止微管解聚", role: "signal" },
        { id: "s2", label: "G2/M 期阻滞", role: "signal" },
        { id: "s3", label: "肿瘤细胞凋亡", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "s0", label: "促进稳定", kind: "activate" },
        { from: "s0", to: "s1", label: "动态丧失", kind: "inhibit" },
        { from: "s1", to: "s2", label: "有丝分裂受阻", kind: "flow" },
        { from: "s2", to: "s3", label: "诱发凋亡", kind: "flow" },
      ],
    },
    mechanismQuiz: {
      steps: [
        "结合微管并促进组装稳定",
        "阻止微管正常解聚与重组",
        "有丝分裂受阻停滞于 G2/M 期",
        "触发细胞凋亡与抗肿瘤效应",
      ],
      explanation: "本题选取的上游到下游主线：结合微管并促进组装稳定 → 阻止微管正常解聚与重组 → 有丝分裂受阻停滞于 G2/M 期 → 触发细胞凋亡与抗肿瘤效应。需区分长春碱类（抑制微管聚合）与紫杉烷类（稳定微管、防解聚）。",
    },
    sources: [
      {
        title: "Paclitaxel 注射液说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ea28753a-8631-460a-bfdc-b101eb8ac84a",
        sections: "黑框警告、第 1、5、6、12.1 节：微管稳定与 G2/M 期阻滞、卵巢/乳腺/NSCLC 适应症、中性粒细胞减少与超敏反应。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
    targetQuizDistractorIds: [
      "omeprazole",
      "levothyroxine",
      "amlodipine",
    ],
    indicationQuizDistractorIds: [
      "levothyroxine",
      "metformin",
      "omeprazole",
    ],
  },
  {
    id: "osimertinib",
    genericName: "奥希替尼",
    brandNames: [
      "泰瑞沙",
    ],
    englishName: "Osimertinib",
    category: "antineoplastic",
    target: "第三代不可逆 EGFR 酪氨酸激酶抑制剂，共价结合并抑制 EGFR 敏感突变及 T790M 耐药突变",
    mechanismSteps: [
      {
        title: "不可逆共价结合突变型 EGFR",
        detail: "奥希替尼为第三代 EGFR-TKI，与特定突变型 EGFR 激酶结构域形成不可逆共价结合（区别于吉非替尼的可逆结合）。",
      },
      {
        title: "同时覆盖敏感突变与 T790M 突变",
        detail: "既抑制外显子 19 缺失或 21 L858R 等敏感激活突变，又可抑制第一/二代 TKI 耐药常见的 T790M 突变，且对野生型 EGFR 亲和力相对较低。",
      },
      {
        title: "阻断下游增殖信号通路",
        detail: "抑制 EGFR 磷酸化及下游增殖生存信号转导，抑制相应基因突变 NSCLC 细胞生长。",
      },
      {
        title: "必须以分子检测为依据并监测心肺毒性",
        detail: "用药前须经临床验证检测确认 EGFR 19del、L858R 或耐药后 T790M 突变存在；并需密切监测间质性肺病、QTc 延长及心肌病等严重不良反应。",
      },
    ],
    indications: [
      "经检测确认存在 EGFR 外显子 19 缺失或 21 L858R 突变的成人非小细胞肺癌（术后辅助治疗、转移性一线单药或局晚/转移性一线联合培美曲塞及铂类）",
      "经既往 EGFR-TKI 治疗进展后、经检测确认存在 EGFR T790M 突变的转移性成人非小细胞肺癌",
    ],
    adverseReactions: [
      "间质性肺病（ILD）/非感染性肺炎，可致命，出现呼吸异常需及时停药评估",
      "QTc 间期延长及心肌病/左室射血分数下降，需定期心电图与心功能监测",
      "腹泻、皮疹、皮肤干燥及甲沟/甲毒性",
      "角膜炎、多形性红斑/SJS 及胚胎胎儿毒性",
    ],
    memoryTip: "三代奥希不可逆，既打 19del/L858R 又打 T790M；用药前必测突变，治疗中盯紧间质性肺炎与心脏 QT/LVEF。",
    diagram: {
      title: "奥希替尼：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "奥希替尼", role: "drug" },
        { id: "s0", label: "突变型 EGFR", role: "target" },
        { id: "s1", label: "共价抑制激酶", role: "signal" },
        { id: "s2", label: "下游信号阻断", role: "signal" },
        { id: "s3", label: "突变肿瘤生长 ↓", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "s0", label: "不可逆结合", kind: "inhibit" },
        { from: "s0", to: "s1", label: "包含 T790M", kind: "flow" },
        { from: "s1", to: "s2", label: "磷酸化受抑", kind: "flow" },
        { from: "s2", to: "s3", label: "增殖受限", kind: "flow" },
      ],
    },
    mechanismQuiz: {
      steps: [
        "不可逆共价结合突变型 EGFR",
        "抑制敏感突变与 T790M 激酶活性",
        "阻断下游增殖生存信号转导",
        "抑制 EGFR 突变 NSCLC 细胞增殖",
      ],
      explanation: "本题选取的上游到下游主线：不可逆共价结合突变型 EGFR → 抑制敏感突变与 T790M 激酶活性 → 阻断下游增殖生存信号转导 → 抑制 EGFR 突变 NSCLC 细胞增殖。用药前必须有相应分子检测依据，并警惕 ILD 与心脏不良反应。",
    },
    sources: [
      {
        title: "TAGRISSO（osimertinib）说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=5e81b4a7-b971-45e1-9c31-29cea8c87ce7",
        sections: "第 1、2.1、5.1～5.6、6、12.1 节：辅助/一线/T790M 二线适应症、突变检测要求、不可逆共价结合及心肺毒性。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
    targetQuizDistractorIds: [
      "omeprazole",
      "levothyroxine",
      "amlodipine",
    ],
    indicationQuizDistractorIds: [
      "levothyroxine",
      "metformin",
      "omeprazole",
    ],
  },
  {
    id: "letrozole",
    genericName: "来曲唑",
    brandNames: [
      "弗隆",
    ],
    englishName: "Letrozole",
    category: "antineoplastic",
    target: "选择性、非甾体类芳香化酶（CYP19A1）竞争性抑制剂，阻断雄激素向雌激素转化",
    mechanismSteps: [
      {
        title: "竞争性抑制芳香化酶",
        detail: "来曲唑是非甾体类芳香化酶抑制剂，可逆性竞争抑制 CYP19A1（芳香化酶）活性，阻断雌激素生物合成的最后一步。",
      },
      {
        title: "降低外周雌激素水平",
        detail: "阻断肾上腺来源雄烯二酮和睾酮在脂肪等外周组织中向雌酮、雌二醇的转化；在绝经后女性中外周转化是主要雌激素来源，因此说明书适应症限定于绝经后状态。",
      },
      {
        title: "剥夺激素依赖性肿瘤生长信号",
        detail: "雌激素水平显著下降，减少雌激素受体激活，从而抑制激素受体阳性乳腺癌细胞增殖；不适用于绝经前卵巢功能完整者单药抑制雌激素。",
      },
      {
        title: "监测骨密度与血脂变化",
        detail: "长期深度抑制雌激素可导致骨密度下降、骨质疏松与骨折风险升高，并可引起胆固醇升高及潮热、关节痛；妊娠期禁用。",
      },
    ],
    indications: [
      "绝经后激素受体阳性（HR+）早期乳腺癌的辅助治疗及他莫昔芬标准辅助治疗后的延伸辅助治疗",
      "绝经后 HR+ 或激素受体未知局部晚期/转移性乳腺癌一线治疗，以及抗雌激素治疗进展后的绝经后晚期乳腺癌",
    ],
    adverseReactions: [
      "骨密度下降、骨质疏松及骨折风险升高（需评估并监测骨密度）",
      "潮热、出汗及关节痛/骨痛/肌痛等雌激素缺乏表现",
      "高胆固醇血症及疲劳、头晕",
      "胚胎胎儿毒性（妊娠期禁用）",
    ],
    memoryTip: "来曲唑专卡绝经后芳香化酶，断绝雄转雌路径；长期服药记住查骨密度和血脂。",
    diagram: {
      title: "来曲唑：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "来曲唑", role: "drug" },
        { id: "s0", label: "芳香化酶", role: "target" },
        { id: "s1", label: "雄转雌过程受阻", role: "signal" },
        { id: "s2", label: "血雌激素水平 ↓", role: "signal" },
        { id: "s3", label: "HR+ 乳腺癌受抑", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "s0", label: "竞争抑制", kind: "inhibit" },
        { from: "s0", to: "s1", label: "阻断合成", kind: "flow" },
        { from: "s1", to: "s2", label: "水平显著下降", kind: "flow" },
        { from: "s2", to: "s3", label: "剥夺生长信号", kind: "flow" },
      ],
    },
    mechanismQuiz: {
      steps: [
        "竞争性抑制芳香化酶（CYP19A1）",
        "阻断外周雄激素向雌激素转化",
        "绝经后体内雌激素水平显著下降",
        "抑制 HR+ 乳腺癌细胞增殖",
      ],
      explanation: "本题选取的上游到下游主线：竞争性抑制芳香化酶（CYP19A1） → 阻断外周雄激素向雌激素转化 → 绝经后体内雌激素水平显著下降 → 抑制 HR+ 乳腺癌细胞增殖。需注意其乳腺癌说明书适应症限定于绝经后女性，长期应关注骨密度及血脂。",
    },
    sources: [
      {
        title: "FEMARA（letrozole）说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=82b77d74-085f-45ac-a7dd-1f5c038bf406",
        sections: "第 1、4、5、6、12.1 节：绝经后 HR+ 乳腺癌辅助/延伸辅助/晚期适应症、芳香化酶机制、骨密度与血脂及妊娠禁忌。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
    targetQuizDistractorIds: [
      "omeprazole",
      "levothyroxine",
      "amlodipine",
    ],
    indicationQuizDistractorIds: [
      "levothyroxine",
      "metformin",
      "omeprazole",
    ],
  },
];
