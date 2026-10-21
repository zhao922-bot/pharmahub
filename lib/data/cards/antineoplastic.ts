import type { DrugCard } from "@/lib/types";

/**
 * 抗肿瘤药物 · 7 张卡片
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
];
