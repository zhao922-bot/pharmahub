import type { DrugCard } from "@/lib/types";

/**
 * 解热镇痛抗炎 · 9 张卡片
 *
 * 共同靶点是环氧合酶（COX），差异在于对 COX-1 与 COX-2 的选择性：
 * 阿司匹林不可逆抑制两者，布洛芬可逆竞争性抑制两者且对 COX-1 影响更大。
 */
export const analgesicCards: readonly DrugCard[] = [
  {
    id: "aspirin",
    genericName: "阿司匹林",
    brandNames: [
      "巴米尔",
    ],
    englishName: "Aspirin",
    category: "analgesic",
    target: "乙酰化环氧化酶；低剂量时不可逆抑制血小板 COX-1",
    mechanismSteps: [
      {
        title: "乙酰化环氧化酶",
        detail: "阿司匹林使环氧化酶乙酰化，影响前列腺素和血栓素相关合成；不同剂量的临床目标不同。",
      },
      {
        title: "减少血小板 TXA2 合成",
        detail: "低剂量抗血小板用途主要联系 COX-1 抑制与血栓素 A2 减少。",
      },
      {
        title: "抑制血小板聚集",
        detail: "受影响的血小板不能重新合成 COX，作用可持续至血小板更新。",
      },
      {
        title: "区分其他用途与风险",
        detail: "其他剂量可用于解热镇痛，但低剂量肠溶片不能直接套用为止痛制剂；抗血小板用途需个体获益风险评估。",
      },
    ],
    indications: [
      "有适应证患者的动脉粥样硬化性心血管事件二级预防",
      "疼痛或发热的对症治疗需核对相应剂型和人群限制",
    ],
    adverseReactions: [
      "胃肠道溃疡与出血",
      "其他部位出血",
      "过敏或呼吸道反应",
      "儿童病毒感染相关雷耶综合征风险",
      "肾损伤和过量水杨酸中毒",
    ],
    memoryTip: "低剂量抑制血小板 COX-1；肠溶也不能消除出血风险。",
    diagram: {
      title: "阿司匹林：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "阿司匹林", role: "drug" },
        { id: "s0", label: "血小板 COX-1 被乙酰化", role: "target" },
        { id: "s1", label: "TXA2 合成减少", role: "signal" },
        { id: "s2", label: "血小板活化减弱", role: "signal" },
        { id: "s3", label: "血小板聚集减少", role: "effect" },
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
        "血小板 COX-1 被乙酰化",
        "TXA2 合成减少",
        "血小板活化减弱",
        "血小板聚集减少",
      ],
      explanation: "本题选取的上游到下游主线：血小板 COX-1 被乙酰化 → TXA2 合成减少 → 血小板活化减弱 → 血小板聚集减少。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "阿司匹林说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c994d693-a505-4794-8803-4b91098b6517",
        sections: "解热镇痛制剂的用途及安全警示；低剂量抗血小板作用另见 emc",
      },
      {
        title: "阿司匹林低剂量肠溶片说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/2614/smpc",
        sections: "4.1、4.3～4.5、4.8、5.1 节：二级预防、不可逆乙酰化、血栓素、血小板聚集及出血风险。",
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
    id: "ibuprofen",
    genericName: "布洛芬",
    brandNames: [
      "芬必得",
      "美林",
    ],
    englishName: "Ibuprofen",
    category: "analgesic",
    target: "抑制环氧化酶 COX-1 与 COX-2",
    mechanismSteps: [
      {
        title: "作用于环氧化酶",
        detail: "布洛芬属于 NSAID，同时影响 COX-1 与 COX-2。完整作用机制不宜只用单个环节概括。",
      },
      {
        title: "减少前列腺素合成",
        detail: "前列腺素合成减少，影响炎症、疼痛敏化及体温调节；不能写成直接消灭致热原。",
      },
      {
        title: "减轻相关症状",
        detail: "可缓解适用疾病中的疼痛与炎症，但不是治疗所有病因，也没有跨药物恒定的最强疗效排名。",
      },
      {
        title: "正常组织也受影响",
        detail: "胃肠道、肾脏及血小板相关作用解释部分风险；不能作为阿司匹林抗血栓用途的直接替代药。",
      },
    ],
    indications: [
      "轻中度疼痛、原发性痛经",
      "类风湿关节炎、骨关节炎的症状缓解；退热需核对对应制剂",
    ],
    adverseReactions: [
      "胃肠溃疡、出血或穿孔",
      "心血管血栓事件风险",
      "肾功能损伤、液体潴留或血压升高",
      "过敏及严重皮肤反应；妊娠期存在用药限制",
    ],
    memoryTip: "COX 受抑可镇痛抗炎；选择性也不能免除胃、肾与心血管风险。",
    diagram: {
      title: "布洛芬：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "布洛芬", role: "drug" },
        { id: "s0", label: "COX 活性受抑", role: "target" },
        { id: "s1", label: "前列腺素合成减少", role: "signal" },
        { id: "s2", label: "疼痛敏化减弱", role: "signal" },
        { id: "s3", label: "疼痛症状缓解", role: "effect" },
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
        "COX 活性受抑",
        "前列腺素合成减少",
        "疼痛敏化减弱",
        "疼痛症状缓解",
      ],
      explanation: "本题选取的上游到下游主线：COX 活性受抑 → 前列腺素合成减少 → 疼痛敏化减弱 → 疼痛症状缓解。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "布洛芬说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=138edf0b-d7da-44b6-b010-d311a37087fe",
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
    id: "paracetamol",
    genericName: "对乙酰氨基酚",
    brandNames: [
      "扑热息痛",
      "泰诺林",
    ],
    englishName: "Paracetamol",
    category: "analgesic",
    target: "解热镇痛涉及中枢等环节，确切机制尚未完全阐明",
    mechanismSteps: [
      {
        title: "影响疼痛和体温调节",
        detail: "对乙酰氨基酚具有解热镇痛作用，显著外周抗炎作用有限。",
      },
      {
        title: "前列腺素相关作用参与解释",
        detail: "中枢前列腺素合成等是常见机制解释，但不能写成已完全确定、只作用于单一 COX 亚型。",
      },
      {
        title: "减轻发热和疼痛",
        detail: "机制解释与临床效应需区分；较少的典型 NSAID 作用不等于完全没有胃肠、过敏或其他风险。",
      },
      {
        title: "肝代谢关联过量毒性",
        detail: "少量反应性代谢物通常由谷胱甘肽解毒；过量等情况下可引起严重肝损伤，需避免多种含同成分制剂重复使用。",
      },
    ],
    indications: [
      "轻中度疼痛",
      "发热的对症治疗",
    ],
    adverseReactions: [
      "超量可致严重肝损伤或肝衰竭",
      "过敏及少见严重皮肤反应",
      "少见血细胞异常",
      "重复成分、肝病及饮酒等可影响用药风险",
    ],
    memoryTip: "解热镇痛机制未完全解明；复方叠加时最要防总量重复。",
    diagram: {
      title: "对乙酰氨基酚：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "对乙酰氨基酚", role: "drug" },
        { id: "s0", label: "疼痛与体温调节相关机制（未完全明确）", role: "signal" },
        { id: "s1", label: "解热镇痛效应", role: "signal" },
        { id: "s2", label: "症状减轻", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "s0", label: "主线环节", kind: "flow" },
        { from: "s0", to: "s1", label: "后续变化", kind: "flow" },
        { from: "s1", to: "s2", label: "后续变化", kind: "flow" },
      ],
    },
    sources: [
      {
        title: "对乙酰氨基酚片说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/100828/smpc",
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
    id: "celecoxib",
    genericName: "塞来昔布",
    brandNames: [
      "西乐葆",
    ],
    englishName: "Celecoxib",
    category: "analgesic",
    target: "临床剂量下选择性抑制 COX-2",
    mechanismSteps: [
      {
        title: "作用于环氧化酶",
        detail: "塞来昔布属于 NSAID，主要抑制 COX-2。完整作用机制不宜只用单个环节概括。",
      },
      {
        title: "减少前列腺素合成",
        detail: "前列腺素合成减少，影响炎症、疼痛敏化及体温调节；不能写成直接消灭致热原。",
      },
      {
        title: "减轻相关症状",
        detail: "可缓解适用疾病中的疼痛与炎症，但不是治疗所有病因，也没有跨药物恒定的最强疗效排名。",
      },
      {
        title: "正常组织也受影响",
        detail: "COX-2 选择性不代表胃肠道安全或无出血风险；心血管、肾脏风险同样需要评估。",
      },
    ],
    indications: [
      "骨关节炎、类风湿关节炎等的症状缓解",
      "特定急性疼痛、原发性痛经等符合说明书的用途",
    ],
    adverseReactions: [
      "胃肠溃疡、出血或穿孔",
      "心血管血栓事件风险",
      "肾功能损伤、液体潴留或血压升高",
      "过敏及严重皮肤反应；妊娠期存在用药限制",
    ],
    memoryTip: "COX 受抑可镇痛抗炎；选择性也不能免除胃、肾与心血管风险。",
    diagram: {
      title: "塞来昔布：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "塞来昔布", role: "drug" },
        { id: "s0", label: "COX-2 受抑", role: "target" },
        { id: "s1", label: "前列腺素合成减少", role: "signal" },
        { id: "s2", label: "疼痛敏化减弱", role: "signal" },
        { id: "s3", label: "疼痛症状缓解", role: "effect" },
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
        "COX-2 受抑",
        "前列腺素合成减少",
        "疼痛敏化减弱",
        "疼痛症状缓解",
      ],
      explanation: "本题选取的上游到下游主线：COX-2 受抑 → 前列腺素合成减少 → 疼痛敏化减弱 → 疼痛症状缓解。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "塞来昔布说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2d6675e4-5859-4be2-8037-a20ce9f707aa",
        sections: "CELEBREX 的警示、5、12.1、12.2 节：COX-2 选择性、血小板作用与风险。",
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
    id: "indomethacin",
    genericName: "吲哚美辛",
    brandNames: [
      "消炎痛",
    ],
    englishName: "Indomethacin",
    category: "analgesic",
    target: "抑制环氧化酶 COX-1 与 COX-2",
    mechanismSteps: [
      {
        title: "作用于环氧化酶",
        detail: "吲哚美辛属于 NSAID，同时影响 COX-1 与 COX-2。完整作用机制不宜只用单个环节概括。",
      },
      {
        title: "减少前列腺素合成",
        detail: "前列腺素合成减少，影响炎症、疼痛敏化及体温调节；不能写成直接消灭致热原。",
      },
      {
        title: "减轻相关症状",
        detail: "可缓解适用疾病中的疼痛与炎症，但不是治疗所有病因，也没有跨药物恒定的最强疗效排名。",
      },
      {
        title: "正常组织也受影响",
        detail: "胃肠道、肾脏及血小板相关作用解释部分风险；不能作为阿司匹林抗血栓用途的直接替代药。",
      },
    ],
    indications: [
      "类风湿关节炎、骨关节炎、强直性脊柱炎的症状缓解",
      "急性痛风性关节炎等；早产儿动脉导管用途属于另行核对的注射制剂",
    ],
    adverseReactions: [
      "胃肠溃疡、出血或穿孔",
      "心血管血栓事件风险",
      "肾功能损伤、液体潴留或血压升高",
      "过敏及严重皮肤反应；妊娠期存在用药限制",
    ],
    memoryTip: "COX 受抑可镇痛抗炎；选择性也不能免除胃、肾与心血管风险。",
    diagram: {
      title: "吲哚美辛：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "吲哚美辛", role: "drug" },
        { id: "s0", label: "COX 活性受抑", role: "target" },
        { id: "s1", label: "前列腺素合成减少", role: "signal" },
        { id: "s2", label: "疼痛敏化减弱", role: "signal" },
        { id: "s3", label: "疼痛症状缓解", role: "effect" },
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
        "COX 活性受抑",
        "前列腺素合成减少",
        "疼痛敏化减弱",
        "疼痛症状缓解",
      ],
      explanation: "本题选取的上游到下游主线：COX 活性受抑 → 前列腺素合成减少 → 疼痛敏化减弱 → 疼痛症状缓解。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "吲哚美辛口服胶囊说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=16238287-d4b0-4afa-8483-1f4ae250a625",
        sections: "1、5.1、5.2、5.6、12.1 节：NSAID、COX-1 / COX-2 与胃肠、心血管、肾脏风险。",
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
    id: "colchicine",
    indicationQuizDistractorIds: [
      "metformin",
      "aciclovir",
      "levothyroxine",
    ],
    genericName: "秋水仙碱",
    brandNames: [],
    englishName: "Colchicine",
    category: "analgesic",
    target: "抑制 β-微管蛋白聚合，干扰中性粒细胞的活化、脱颗粒及迁移",
    mechanismSteps: [
      {
        title: "抑制微管蛋白聚合",
        detail: "秋水仙碱抑制 β-微管蛋白组装成微管，干扰细胞骨架功能。",
      },
      {
        title: "干扰微管依赖的细胞功能",
        detail: "微管组装减少，使依赖细胞骨架的活动受到干扰。",
      },
      {
        title: "限制中性粒细胞活动",
        detail: "中性粒细胞的活化、脱颗粒和向炎症部位迁移减少，炎症反应减弱。",
      },
      {
        title: "减轻痛风相关炎症",
        detail: "用于痛风发作治疗或预防；它不降低尿酸，也不应当作普通止痛药使用。",
      },
    ],
    indications: [
      "急性痛风发作的治疗",
      "痛风发作的预防，包括开始降尿酸治疗时的预防",
      "家族性地中海热（所引片剂说明书范围）",
    ],
    adverseReactions: [
      "腹泻、恶心、呕吐与腹痛：常见，明显胃肠症状可提示毒性",
      "骨髓抑制及血细胞减少",
      "神经肌肉毒性与横纹肌溶解，肾功能不全时更需警惕",
      "CYP3A4 或 P-gp 抑制剂可增加暴露并导致严重毒性；肝或肾功能受损者合用强 CYP3A4 或 P-gp 抑制剂禁忌",
    ],
    memoryTip: "「秋水仙碱拦微管，压炎症不降尿酸」——治疗窗窄，胃肠反应和相互作用要一起记。",
    diagram: {
      title: "微管聚合受抑 → 中性粒细胞反应减弱",
      nodes: [
        { id: "n0", label: "秋水仙碱", role: "drug" },
        { id: "n1", label: "微管蛋白聚合", role: "target" },
        { id: "n2", label: "中性粒活动 ↓", role: "signal" },
        { id: "n3", label: "痛风炎症减轻", role: "effect" },
      ],
      edges: [
        { from: "n0", to: "n1", label: "阻断", kind: "inhibit" },
        { from: "n1", to: "n2", kind: "flow", label: "受抑后" },
        { from: "n2", to: "n3", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "DailyMed：Colchicine 片说明书",
        url: "https://www.dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=5e5d9488-d9d0-4b37-b535-941d66c3430d&type=display",
        sections: "第 1、4、5、7、12.1 节：痛风及家族性地中海热用途、微管机制、血液与肌肉毒性及相互作用。",
      },
      {
        title: "emc：Colchicine 片产品特性概要",
        url: "https://www.medicines.org.uk/emc/product/14362/smpc",
        sections: "第 4.4、5.1 节：治疗窗窄；对尿酸代谢无影响。用途与禁忌仍按上方所引片剂说明书描述。",
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
    id: "allopurinol",
    genericName: "别嘌醇",
    brandNames: [],
    englishName: "Allopurinol",
    category: "analgesic",
    target: "抑制黄嘌呤氧化酶（XO），减少尿酸生成",
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
        title: "抑制黄嘌呤氧化酶",
        detail: "别嘌醇及活性代谢物氧嘌呤醇均可抑制该酶。",
      },
      {
        title: "减少嘌呤向尿酸转化",
        detail: "次黄嘌呤转为黄嘌呤、黄嘌呤转为尿酸的氧化过程受到抑制。",
      },
      {
        title: "降低尿酸生成与血尿酸",
        detail: "减少尿酸来源，而非主要依靠增加肾脏排泄尿酸。",
      },
      {
        title: "逐步减少尿酸盐负荷",
        detail: "长期控制可减少痛风发作；开始治疗时反而可能诱发发作，不能作为急性止痛药。",
      },
    ],
    indications: [
      "有指征的痛风患者的长期降尿酸治疗",
      "肿瘤治疗相关尿酸升高的管理（按所引说明书与具体方案）",
    ],
    adverseReactions: [
      "皮疹及严重皮肤反应（SJS/TEN/DRESS）：出现皮疹应立即停药并就医",
      "HLA-B*58:01 携带者过敏风险更高；汉族等高携带率人群开始治疗前应考虑筛查",
      "开始治疗时可发生痛风发作，需评估预防方案",
      "肝损伤、骨髓抑制；肾功能受损时需调整用药方案",
    ],
    memoryTip: "「别嘌醇关掉尿酸生产线」——长期降尿酸；急性发作时的止痛抗炎另有任务。",
    diagram: {
      title: "抑制 XO → 尿酸生成减少",
      nodes: [
        { id: "n0", label: "别嘌醇", role: "drug" },
        { id: "n1", label: "黄嘌呤氧化酶", role: "target" },
        { id: "n2", label: "尿酸生成 ↓", role: "signal" },
        { id: "n3", label: "血尿酸下降", role: "signal" },
        { id: "n4", label: "尿酸盐负荷 ↓", role: "effect" },
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
        title: "DailyMed：Allopurinol 片说明书",
        url: "https://www.dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=bdbf5ad4-86f2-4e9c-a51a-fb0c7220c480",
        sections: "第 1、2、5、8.6、12.1、12.5 节：降尿酸范围、起始发作、皮肤反应、肾功能与 HLA-B*58:01。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
  },
  {
    id: "febuxostat",
    genericName: "非布司他",
    brandNames: [],
    englishName: "Febuxostat",
    category: "analgesic",
    target: "抑制黄嘌呤氧化酶（XO），减少尿酸生成并降低血尿酸",
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
        title: "抑制黄嘌呤氧化酶",
        detail: "通过抑制 XO，减少嘌呤代谢末端的尿酸生成。",
      },
      {
        title: "减少尿酸生成",
        detail: "作用重点是减少来源，而非直接促进尿酸经肾排出。",
      },
      {
        title: "降低血尿酸水平",
        detail: "持续降尿酸用于痛风的长期管理；开始治疗时尿酸变化反而可能诱发痛风发作。",
      },
      {
        title: "用于经评估的慢性降尿酸治疗",
        detail: "所引美国说明书限于别嘌醇充分调整后效果不足、不耐受或不适合使用的成人痛风患者；不推荐用于无症状高尿酸血症。",
      },
    ],
    indications: [
      "成人痛风的慢性高尿酸血症管理（所引美国说明书限别嘌醇效果不足、不耐受或不宜使用者）",
    ],
    adverseReactions: [
      "起始治疗可诱发痛风发作，不作为急性发作的直接镇痛药",
      "肝功能异常、肝损伤，需监测",
      "皮疹及少见严重皮肤或超敏反应",
      "已有心血管病的痛风患者在一项结局研究中心血管死亡率高于别嘌醇组，需权衡获益风险",
      "禁与硫唑嘌呤或巯嘌呤合用，以免相关药物毒性显著增加",
    ],
    memoryTip: "「非布压 XO，长期降尿酸」——关注心血管风险评估和硫唑嘌呤、巯嘌呤相互作用。",
    diagram: {
      title: "XO 抑制 → 尿酸生成减少",
      nodes: [
        { id: "n0", label: "非布司他", role: "drug" },
        { id: "n1", label: "黄嘌呤氧化酶", role: "target" },
        { id: "n2", label: "尿酸生成 ↓", role: "signal" },
        { id: "n3", label: "血尿酸 ↓", role: "signal" },
        { id: "n4", label: "痛风长期管理", role: "effect" },
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
        title: "DailyMed：Febuxostat 片说明书",
        url: "https://www.dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=41a95424-046e-413b-a121-cd7335e67135",
        sections: "黑框警告与第 1、4～7、12.1～12.2 节：美国标签适用条件、XO 抑制、心血管与肝脏风险及相互作用。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
  {
    id: "diclofenac",
    genericName: "双氯芬酸",
    brandNames: [],
    englishName: "Diclofenac",
    category: "analgesic",
    target: "抑制环氧合酶（COX），减少前列腺素合成，发挥镇痛抗炎作用",
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
        title: "抑制环氧合酶",
        detail: "双氯芬酸属于非甾体抗炎药，抑制前列腺素合成相关的 COX 活性。",
      },
      {
        title: "减少前列腺素生成",
        detail: "炎症部位相关介质减少，同时也可能影响胃肠道和肾脏的生理保护作用。",
      },
      {
        title: "减轻炎症与痛觉敏化",
        detail: "疼痛和炎症反应减轻，不代表关节炎等基础疾病已被治愈。",
      },
      {
        title: "缓解相应疼痛和炎症",
        detail: "本卡按口服系统制剂说明书概括用途；凝胶、贴剂等局部制剂的暴露和使用范围应分别查看。",
      },
    ],
    indications: [
      "类风湿关节炎或骨关节炎的疼痛与炎症症状缓解",
      "急性肌肉骨骼损伤、肌腱炎等相关疼痛",
      "急性痛风发作的疼痛和炎症缓解（经评估适合者）",
    ],
    adverseReactions: [
      "胃肠道溃疡、出血或穿孔，可能没有预警症状",
      "心肌梗死、卒中等动脉血栓风险；已确立心血管疾病者须核对系统制剂禁忌",
      "肾功能损害、体液潴留或血压升高",
      "肝损伤、过敏及 NSAID 相关支气管痉挛；孕晚期禁用",
    ],
    memoryTip: "「双氯压 COX，止痛抗炎也伤保护」——缓释或肠溶不等于消除胃肠、心血管和肾脏风险。",
    diagram: {
      title: "COX 抑制 → 前列腺素减少 → 镇痛抗炎",
      nodes: [
        { id: "n0", label: "双氯芬酸", role: "drug" },
        { id: "n1", label: "环氧合酶 COX", role: "target" },
        { id: "n2", label: "前列腺素合成 ↓", role: "signal" },
        { id: "n3", label: "炎症及痛觉敏化 ↓", role: "signal" },
        { id: "n4", label: "疼痛炎症缓解", role: "effect" },
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
        title: "emc：Diclomax SR（双氯芬酸钠口服缓释制剂）说明书",
        url: "https://www.medicines.org.uk/emc/product/346/smpc",
        sections: "第 4.1～4.6、4.8、5.1 节：系统制剂用途、COX 抑制、胃肠与心血管禁忌、肾肝及妊娠风险。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
];
