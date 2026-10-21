import type { DrugCard } from "@/lib/types";

/**
 * 内分泌系统 · 16 张卡片
 */
export const endocrineCards: readonly DrugCard[] = [
  {
    id: "metformin",
    genericName: "二甲双胍",
    brandNames: [
      "格华止",
      "美迪康",
    ],
    englishName: "Metformin",
    category: "endocrine",
    target: "减少肝糖输出、改善胰岛素敏感性等；完整分子机制未完全明确",
    mechanismSteps: [
      {
        title: "减少肝脏葡萄糖生成",
        detail: "二甲双胍属于双胍类，降低肝糖输出是重要的降糖效应。",
      },
      {
        title: "改善葡萄糖利用",
        detail: "可改善外周胰岛素敏感性和葡萄糖摄取利用，并涉及肠道环节。",
      },
      {
        title: "不以刺激胰岛素分泌为主",
        detail: "单用时低血糖风险通常较低，但不能说任何情况下都不会低血糖。",
      },
      {
        title: "区分机制假说与定论",
        detail: "线粒体复合物 I、AMPK 等是研究涉及的途径，不能把复合物 I—AMPK 写成临床疗效唯一、必需且完全证实的因果链。",
      },
    ],
    indications: [
      "2 型糖尿病的血糖控制，结合饮食运动及个体病情选择",
    ],
    adverseReactions: [
      "胃肠道不适、腹泻",
      "维生素 B12 降低",
      "罕见但严重的乳酸性酸中毒，肾功能和缺氧等影响风险",
      "肾功能不全、急性疾病及造影等情境需按说明书评估",
    ],
    memoryTip: "降肝糖、改善利用；不靠强促分泌，分子机制仍未完全阐明。",
    diagram: {
      title: "二甲双胍：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "二甲双胍", role: "drug" },
        { id: "s0", label: "减少肝糖输出并改善葡萄糖利用", role: "signal" },
        { id: "s1", label: "空腹及餐后血糖降低", role: "signal" },
        { id: "s2", label: "改善 2 型糖尿病血糖控制", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "s0", label: "主线环节", kind: "flow" },
        { from: "s0", to: "s1", label: "后续变化", kind: "flow" },
        { from: "s1", to: "s2", label: "后续变化", kind: "flow" },
      ],
    },
    sources: [
      {
        title: "二甲双胍说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=104b5f5b-cc83-450d-82ec-1fd20c4f7119",
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
    id: "insulin",
    genericName: "胰岛素",
    brandNames: [],
    englishName: "Insulin",
    category: "endocrine",
    target: "激动胰岛素受体（受体酪氨酸激酶）",
    mechanismSteps: [
      {
        title: "结合胰岛素受体",
        detail: "胰岛素结合细胞膜受体，启动受体酪氨酸激酶相关信号。",
      },
      {
        title: "促进葡萄糖摄取",
        detail: "在骨骼肌和脂肪等组织，相关信号促进 GLUT4 向细胞膜转位，增加葡萄糖摄取。",
      },
      {
        title: "同时调节肝脏与合成代谢",
        detail: "抑制肝糖输出、促进储存，并影响脂肪和蛋白质代谢；这些为并行作用。",
      },
      {
        title: "剂型决定给药和时间曲线",
        detail: "本卡所引为注射人胰岛素；不同胰岛素制剂的起效与持续时间不同，不能把所有制剂统一为同一给药方式。",
      },
    ],
    indications: [
      "1 型糖尿病的胰岛素替代",
      "需要胰岛素治疗的 2 型糖尿病等符合具体制剂条件的情境",
    ],
    adverseReactions: [
      "低血糖",
      "体重增加",
      "低钾血症",
      "注射部位反应、脂肪营养不良及过敏",
    ],
    memoryTip: "受体信号促摄糖并抑制肝糖；制剂不同，时间曲线不同。",
    diagram: {
      title: "胰岛素：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "胰岛素", role: "drug" },
        { id: "s0", label: "激活胰岛素受体", role: "target" },
        { id: "s1", label: "相关胞内信号激活", role: "signal" },
        { id: "s2", label: "肌肉脂肪 GLUT4 转位增加", role: "signal" },
        { id: "s3", label: "葡萄糖摄取增加", role: "effect" },
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
        "激活胰岛素受体",
        "相关胞内信号激活",
        "肌肉脂肪 GLUT4 转位增加",
        "葡萄糖摄取增加",
      ],
      explanation: "本题选取的上游到下游主线：激活胰岛素受体 → 相关胞内信号激活 → 肌肉脂肪 GLUT4 转位增加 → 葡萄糖摄取增加。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "胰岛素说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=81199e55-ade9-46de-a5a3-c0415acee403",
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
    id: "glibenclamide",
    genericName: "格列本脲",
    brandNames: [
      "优降糖",
    ],
    englishName: "Glibenclamide",
    category: "endocrine",
    target: "结合胰岛 β 细胞 KATP 通道的 SUR1 亚基",
    mechanismSteps: [
      {
        title: "结合 SUR1",
        detail: "格列本脲是磺脲类促胰岛素分泌药，效应依赖仍有功能的胰岛 β 细胞。",
      },
      {
        title: "关闭 KATP 通道",
        detail: "钾外流减少，使细胞膜去极化，而不是使去极化减弱。",
      },
      {
        title: "促使钙进入 β 细胞",
        detail: "去极化打开电压门控钙通道，胞内钙增加。",
      },
      {
        title: "促进胰岛素释放",
        detail: "钙信号促进分泌颗粒胞吐；低血糖可以较严重且持续较久，老年和肾功能下降者需特别关注。",
      },
    ],
    indications: [
      "仍有 β 细胞功能的 2 型糖尿病；需结合低血糖风险选择",
    ],
    adverseReactions: [
      "低血糖，可较严重或持久",
      "体重增加",
      "胃肠道反应",
      "皮疹及少见血液、肝脏不良反应",
    ],
    memoryTip: "关钾通道会去极化、开钙通道，最后促胰岛素释放。",
    diagram: {
      title: "格列本脲：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "格列本脲", role: "drug" },
        { id: "s0", label: "KATP 通道关闭", role: "target" },
        { id: "s1", label: "细胞膜去极化", role: "signal" },
        { id: "s2", label: "钙内流增加", role: "signal" },
        { id: "s3", label: "胰岛素释放增加", role: "effect" },
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
        "KATP 通道关闭",
        "细胞膜去极化",
        "钙内流增加",
        "胰岛素释放增加",
      ],
      explanation: "本题选取的上游到下游主线：KATP 通道关闭 → 细胞膜去极化 → 钙内流增加 → 胰岛素释放增加。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "格列本脲说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a56f100f-0f42-4188-81ab-04644b824040",
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
    id: "levothyroxine",
    genericName: "左甲状腺素钠",
    brandNames: [
      "优甲乐",
    ],
    englishName: "Levothyroxine Sodium",
    category: "endocrine",
    target: "补充 T4，经转化为 T3 等作用于甲状腺激素核受体",
    mechanismSteps: [
      {
        title: "补充甲状腺激素前体",
        detail: "左甲状腺素是合成 T4；吸收受食物、其他药物和制剂影响，不能只记一个固定吸收百分比。",
      },
      {
        title: "外周脱碘形成 T3",
        detail: "T4 可在外周转化为生物活性更强的 T3，多数生理效应由 T3 介导。",
      },
      {
        title: "核受体调节基因表达",
        detail: "甲状腺激素受体调节相关基因转录及蛋白质合成。",
      },
      {
        title: "恢复或抑制特定内分泌信号",
        detail: "用于替代治疗，部分分化型甲状腺癌可用作 TSH 抑制；不能泛化为所有甲状腺肿、结节或甲状腺癌通用。",
      },
    ],
    indications: [
      "先天或获得性甲状腺功能减退的替代治疗",
      "特定分化型甲状腺癌治疗中的 TSH 抑制，需个体化评估",
    ],
    adverseReactions: [
      "过量可出现心悸、震颤、失眠及体重下降",
      "可诱发心绞痛或心律失常",
      "长期过量可降低骨密度",
      "药物与食物相互作用可改变治疗稳定性",
    ],
    memoryTip: "补 T4 后转 T3 调基因；剂量过量会造成医源性甲亢。",
    diagram: {
      title: "左甲状腺素钠：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "左甲状腺素钠", role: "drug" },
        { id: "s0", label: "T4 转化为 T3", role: "signal" },
        { id: "s1", label: "甲状腺激素受体作用增强", role: "signal" },
        { id: "s2", label: "相关基因转录改变", role: "signal" },
        { id: "s3", label: "代谢与组织效应改变", role: "effect" },
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
        "T4 转化为 T3",
        "甲状腺激素受体作用增强",
        "相关基因转录改变",
        "代谢与组织效应改变",
      ],
      explanation: "本题选取的上游到下游主线：T4 转化为 T3 → 甲状腺激素受体作用增强 → 相关基因转录改变 → 代谢与组织效应改变。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "左甲状腺素钠说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=b8c20f76-3ee6-4b29-b77f-ed4ad1baaed9",
        sections: "1、2.4、5、6、12.1～12.3 节：激素替代、核内受体、T4 转化、监测及过度替代风险。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
    targetQuizDistractorIds: [
      "omeprazole",
      "aciclovir",
      "allopurinol",
    ],
    indicationQuizDistractorIds: [
      "aciclovir",
      "allopurinol",
      "metformin",
    ],
  },
  {
    id: "dexamethasone",
    genericName: "地塞米松",
    brandNames: [],
    englishName: "Dexamethasone",
    category: "endocrine",
    target: "结合细胞内糖皮质激素受体，调节基因表达及炎症反应",
    mechanismSteps: [
      {
        title: "结合糖皮质激素受体",
        detail: "地塞米松是长效合成糖皮质激素；不能将其血浆蛋白结合笼统写成主要结合皮质激素结合球蛋白。",
      },
      {
        title: "调节炎症相关转录",
        detail: "受体相关信号影响多种炎症介质和免疫细胞活动，作用不等同于直接抑制 COX 的 NSAID。",
      },
      {
        title: "产生抗炎与免疫抑制",
        detail: "可减轻特定疾病中的炎症，但不直接消除病原体，也不能泛化为感染性休克的常规选药。",
      },
      {
        title: "同时影响代谢及内分泌轴",
        detail: "可升高血糖并抑制下丘脑—垂体—肾上腺轴；盐皮质激素活性很低。是否需逐渐减量取决于疗程、暴露和病情。",
      },
    ],
    indications: [
      "特定严重炎症、过敏或免疫性疾病的治疗",
      "某些肿瘤相关脑水肿等符合制剂说明书的辅助治疗",
    ],
    adverseReactions: [
      "感染风险增加或感染表现被掩盖",
      "高血糖、骨质疏松及肌病",
      "情绪或精神症状",
      "长期用药可抑制肾上腺轴，停药方案需评估",
      "胃肠道损伤等风险，合用 NSAID 时需关注",
    ],
    memoryTip: "激素调转录、抗炎但不灭菌；减量要看疗程和病情。",
    diagram: {
      title: "地塞米松：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "地塞米松", role: "drug" },
        { id: "s0", label: "结合糖皮质激素受体", role: "target" },
        { id: "s1", label: "炎症相关基因调控改变", role: "signal" },
        { id: "s2", label: "炎症介质活动减弱", role: "signal" },
        { id: "s3", label: "炎症反应减轻", role: "effect" },
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
        "结合糖皮质激素受体",
        "炎症相关基因调控改变",
        "炎症介质活动减弱",
        "炎症反应减轻",
      ],
      explanation: "本题选取的上游到下游主线：结合糖皮质激素受体 → 炎症相关基因调控改变 → 炎症介质活动减弱 → 炎症反应减轻。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "地塞米松说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=11f10a47-1c42-40e4-89d8-bb000fef497c",
        sections: "药理、适应症、警告与不良反应（剂型与适用范围见正文）",
      },
      {
        title: "地塞米松口服片说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/15864/smpc",
        sections: "4.4、4.5、4.8、5.1 节：转录调控、感染表现、肾上腺轴、停药及胃肠道风险。",
      },
      {
        title: "地塞米松药物词典 · 美国国家癌症研究所（NCI）",
        url: "https://www.cancer.gov/publications/dictionaries/cancer-drug/def/dexamethasone",
        sections: "药物定义：合成皮质激素、核类固醇受体及炎症信号调节。",
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
    id: "propylthiouracil",
    genericName: "丙硫氧嘧啶",
    brandNames: [],
    englishName: "Propylthiouracil",
    category: "endocrine",
    target: "抑制甲状腺过氧化物酶（TPO）相关的激素合成，另抑制外周 T4→T3 转化",
    mechanismSteps: [
      {
        title: "抑制激素合成环节",
        detail: "丙硫氧嘧啶抑制 TPO 相关反应，影响碘有机化及碘化酪氨酸偶联。",
      },
      {
        title: "减少新生 T4 与 T3",
        detail: "甲状腺激素新合成减少；已经储存或进入血液的激素不会被直接清除，因此疗效不等同于即刻降激素。",
      },
      {
        title: "区分外周转化作用",
        detail: "PTU 还可抑制外周 T4 向 T3 转化，这是其在甲状腺危象中受到考虑的原因之一。",
      },
      {
        title: "按风险与情境选择",
        detail: "严重肝损伤风险限制常规使用；甲巯咪唑不耐受、妊娠早期或危象等情境由专科按指南选择。",
      },
    ],
    indications: [
      "甲巯咪唑不耐受且其他治疗不合适的甲亢等特定情境",
      "甲状腺手术或放射性碘治疗前的特定准备方案",
    ],
    adverseReactions: [
      "粒细胞缺乏：发热、咽痛时应及时就医检查，不能靠常规血象保证提前发现",
      "严重肝损伤及肝衰竭风险",
      "皮疹、关节痛",
      "甲状腺功能减退及胎儿风险，妊娠期方案需专科管理",
    ],
    memoryTip: "两药抑制新合成；PTU 还影响外周转化，选择差别不止这一点。",
    diagram: {
      title: "丙硫氧嘧啶：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "丙硫氧嘧啶", role: "drug" },
        { id: "s0", label: "TPO 相关反应受抑", role: "target" },
        { id: "s1", label: "碘有机化与偶联受限", role: "signal" },
        { id: "s2", label: "新生甲状腺激素减少", role: "signal" },
        { id: "s3", label: "激素水平逐渐下降", role: "effect" },
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
        "TPO 相关反应受抑",
        "碘有机化与偶联受限",
        "新生甲状腺激素减少",
        "激素水平逐渐下降",
      ],
      explanation: "本题选取的上游到下游主线：TPO 相关反应受抑 → 碘有机化与偶联受限 → 新生甲状腺激素减少 → 激素水平逐渐下降。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "丙硫氧嘧啶说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b0c23a2c-b250-4c0d-9b2a-c1483faa2ca0",
        sections: "药理、适应症、警告与不良反应（剂型与适用范围见正文）",
      },
      {
        title: "ATA · 甲亢及甲状腺毒症指南（2016）",
        url: "https://doi.org/10.1089/thy.2016.0229",
        sections: "抗甲状腺药选择；甲状腺危象治疗表 7；血液与肝脏风险",
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
    id: "methimazole",
    genericName: "甲巯咪唑",
    brandNames: [
      "赛治",
    ],
    englishName: "Methimazole",
    category: "endocrine",
    target: "抑制甲状腺过氧化物酶（TPO）相关的激素合成",
    mechanismSteps: [
      {
        title: "抑制激素合成环节",
        detail: "甲巯咪唑抑制 TPO 相关反应，影响碘有机化及碘化酪氨酸偶联。",
      },
      {
        title: "减少新生 T4 与 T3",
        detail: "甲状腺激素新合成减少；已经储存或进入血液的激素不会被直接清除，因此疗效不等同于即刻降激素。",
      },
      {
        title: "区分外周转化作用",
        detail: "甲巯咪唑不具有 PTU 那样的外周 T4→T3 抑制作用，但不能据此断言甲状腺危象中绝不适用。",
      },
      {
        title: "按风险与情境选择",
        detail: "许多常规甲亢情境优先考虑甲巯咪唑；妊娠、严重不良反应及危象需按指南个体化选择。",
      },
    ],
    indications: [
      "Graves 病等甲状腺功能亢进",
      "甲状腺手术或放射性碘治疗前的特定准备方案",
    ],
    adverseReactions: [
      "粒细胞缺乏：发热、咽痛时应及时就医检查，不能靠常规血象保证提前发现",
      "肝损伤，常涉及胆汁淤积",
      "皮疹、关节痛",
      "甲状腺功能减退及胎儿风险，妊娠期方案需专科管理",
    ],
    memoryTip: "两药抑制新合成；PTU 还影响外周转化，选择差别不止这一点。",
    diagram: {
      title: "甲巯咪唑：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "甲巯咪唑", role: "drug" },
        { id: "s0", label: "TPO 相关反应受抑", role: "target" },
        { id: "s1", label: "碘有机化与偶联受限", role: "signal" },
        { id: "s2", label: "新生甲状腺激素减少", role: "signal" },
        { id: "s3", label: "激素水平逐渐下降", role: "effect" },
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
        "TPO 相关反应受抑",
        "碘有机化与偶联受限",
        "新生甲状腺激素减少",
        "激素水平逐渐下降",
      ],
      explanation: "本题选取的上游到下游主线：TPO 相关反应受抑 → 碘有机化与偶联受限 → 新生甲状腺激素减少 → 激素水平逐渐下降。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "甲巯咪唑说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=acae35a6-dea2-3fa9-e053-2a95a90a3a4d&type=display",
        sections: "临床药理、警告与实验室监测：不使既有激素失活、甲减、粒细胞缺乏及肝损伤。",
      },
      {
        title: "ATA · 甲亢及甲状腺毒症指南（2016）",
        url: "https://doi.org/10.1089/thy.2016.0229",
        sections: "抗甲状腺药选择；甲状腺危象治疗表 7；血液与肝脏风险",
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
    id: "empagliflozin",
    indicationQuizDistractorIds: [
      "aciclovir",
      "phenytoin",
      "sucralfate",
    ],
    genericName: "恩格列净",
    brandNames: [],
    englishName: "Empagliflozin",
    category: "endocrine",
    target: "抑制肾脏钠-葡萄糖协同转运蛋白 2（SGLT2），增加尿糖排泄",
    mechanismSteps: [
      {
        title: "抑制肾脏 SGLT2",
        detail: "SGLT2 负责把滤液中的葡萄糖重新转运入血，恩格列净抑制这一回收过程。",
      },
      {
        title: "减少葡萄糖重吸收",
        detail: "滤液中的葡萄糖回收减少，肾糖阈降低。",
      },
      {
        title: "增加尿糖排出",
        detail: "未被回收的葡萄糖更多地随尿排出；钠重吸收也减少，远端钠递送增加。",
      },
      {
        title: "降低血糖并影响心肾生理",
        detail: "尿糖排泄使血糖下降；钠处理变化可能影响管球反馈等。心衰和肾病用途不能仅按降糖效果理解。",
      },
    ],
    indications: [
      "2 型糖尿病的血糖控制，配合饮食与运动",
      "成人心力衰竭：降低心血管死亡和心衰住院风险",
      "有进展风险的成人慢性肾病：降低肾功能进展等风险，需符合说明书条件",
    ],
    adverseReactions: [
      "酮症酸中毒：血糖未明显升高时也可能发生，禁食、手术等情境需特别评估",
      "容量不足与低血压：尿液丢失增加，老年人或合用利尿药时需关注",
      "生殖器真菌感染及尿路感染",
      "与胰岛素或磺脲类合用时，低血糖风险增加",
    ],
    memoryTip: "「列净让糖从尿走」——记住脱水、感染，以及血糖不很高也可能出现的酮症酸中毒。",
    diagram: {
      title: "SGLT2 抑制：减少肾脏回收葡萄糖",
      nodes: [
        { id: "n0", label: "恩格列净", role: "drug" },
        { id: "n1", label: "SGLT2", role: "target" },
        { id: "n2", label: "糖重吸收 ↓", role: "signal" },
        { id: "n3", label: "尿糖排泄 ↑", role: "signal" },
        { id: "n4", label: "血糖下降", role: "effect" },
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
        title: "DailyMed：JARDIANCE（empagliflozin）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=334f1b3d-5670-6685-e063-6294a90a7e47",
        sections: "第 1、2.4、5、12.1 节：糖尿病、心衰与肾病用途，酮症酸中毒等风险及 SGLT2 机制。",
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
    id: "sitagliptin",
    indicationQuizDistractorIds: [
      "aciclovir",
      "phenytoin",
      "sucralfate",
    ],
    genericName: "西格列汀",
    brandNames: [],
    englishName: "Sitagliptin",
    category: "endocrine",
    target: "抑制二肽基肽酶-4（DPP-4），延长内源性 GLP-1 与 GIP 的作用",
    mechanismSteps: [
      {
        title: "抑制 DPP-4 酶",
        detail: "DPP-4 会使肠促胰素 GLP-1 和 GIP 失活；西格列汀抑制这一步。",
      },
      {
        title: "保留活性肠促胰素",
        detail: "活性 GLP-1、GIP 的浓度和作用时间增加，增强原有的肠促胰素信号。",
      },
      {
        title: "依血糖调节胰岛激素",
        detail: "血糖正常偏高或升高时，促进胰岛素释放，并通过 GLP-1 降低胰高血糖素分泌。",
      },
      {
        title: "减少肝糖输出",
        detail: "胰岛素增加和胰高血糖素减少共同降低肝糖生成，改善血糖控制。",
      },
    ],
    indications: [
      "成人 2 型糖尿病：作为饮食与运动的辅助治疗；不用于 1 型糖尿病",
    ],
    adverseReactions: [
      "急性胰腺炎：上市后有报告，持续剧烈腹痛需及时评估",
      "与胰岛素、磺脲类合用时低血糖风险增加",
      "肾功能恶化：用药前及治疗中评估肾功能，肾功能下降时需调整剂量",
      "严重关节痛、大疱性类天疱疮及严重过敏反应已有报告",
    ],
    memoryTip: "「列汀护住肠促胰素」——抑制 DPP-4，延长 GLP-1 和 GIP 的作用。",
    diagram: {
      title: "抑制肠促胰素降解 → 改善血糖",
      nodes: [
        { id: "n0", label: "西格列汀", role: "drug" },
        { id: "n1", label: "DPP-4", role: "target" },
        { id: "n2", label: "活性肠促胰素 ↑", role: "signal" },
        { id: "n3", label: "肝糖输出 ↓", role: "signal" },
        { id: "n4", label: "血糖下降", role: "effect" },
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
        title: "DailyMed：JANUVIA（sitagliptin）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f85a48d0-0407-4c50-b0fa-7673a160bf01",
        sections: "第 1、2.2、5、12.1 节：成人 2 型糖尿病、肾功能调整与重要风险、DPP-4 机制。",
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
    id: "semaglutide",
    indicationQuizDistractorIds: [
      "aciclovir",
      "phenytoin",
      "sucralfate",
    ],
    genericName: "司美格鲁肽",
    brandNames: [],
    englishName: "Semaglutide",
    category: "endocrine",
    target: "激动 GLP-1 受体，以葡萄糖依赖方式促进胰岛素分泌、减少胰高血糖素",
    mechanismSteps: [
      {
        title: "激活 GLP-1 受体",
        detail: "司美格鲁肽是 GLP-1 类似物，直接结合并激活 GLP-1 受体。",
      },
      {
        title: "依血糖促进胰岛素分泌",
        detail: "血糖升高时，受体激动增强胰岛素分泌；作用具有葡萄糖依赖性。",
      },
      {
        title: "同时减少胰高血糖素分泌",
        detail: "在血糖升高时，胰高血糖素分泌也受到抑制，与胰岛素增加共同参与降糖。",
      },
      {
        title: "空腹与餐后血糖下降",
        detail: "上述激素变化改善血糖；早期餐后胃排空轻度延缓也参与其中。本卡以 OZEMPIC 皮下注射剂为例。",
      },
    ],
    indications: [
      "成人 2 型糖尿病的血糖控制（OZEMPIC 注射剂，配合饮食与运动）",
      "成人 2 型糖尿病合并确诊心血管疾病：降低主要心血管事件风险",
      "成人 2 型糖尿病合并慢性肾病：降低持续肾功能下降等风险；不外推至其他制剂",
    ],
    adverseReactions: [
      "恶心、呕吐、腹泻等胃肠道反应；明显脱水可伴急性肾损伤",
      "急性胰腺炎：持续或剧烈腹痛需及时评估",
      "糖尿病视网膜病变并发症：有既往病变者需监测",
      "与胰岛素或磺脲类合用时，低血糖风险增加",
      "甲状腺 C 细胞肿瘤警示来自啮齿动物，人体相关性未确定；甲状腺髓样癌个人或家族史、MEN2 患者禁用",
    ],
    memoryTip: "「格鲁肽直接激动 GLP-1」——与列汀保护内源性激素区分，用途还要看具体制剂。",
    diagram: {
      title: "GLP-1 受体激动：依血糖调节胰岛激素",
      nodes: [
        { id: "n0", label: "司美格鲁肽", role: "drug" },
        { id: "n1", label: "GLP-1 受体", role: "target" },
        { id: "n2", label: "胰岛素分泌 ↑", role: "signal" },
        { id: "n3", label: "血糖下降", role: "effect" },
      ],
      edges: [
        { from: "n0", to: "n1", label: "作用于", kind: "flow" },
        { from: "n1", to: "n2", kind: "flow", label: "后续变化" },
        { from: "n2", to: "n3", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "DailyMed：OZEMPIC（semaglutide 皮下注射剂）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=42bdd912-2393-44c4-b7e0-47672ca28991",
        sections: "黑框警告及第 1、5、12.1～12.2 节：本制剂用途、重要风险、GLP-1 机制；肾脏获益机制尚未确立。",
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
    id: "acarbose",
    genericName: "阿卡波糖",
    brandNames: [],
    englishName: "Acarbose",
    category: "endocrine",
    target: "抑制小肠刷状缘 α-葡萄糖苷酶及胰 α-淀粉酶，延缓碳水化合物消化",
    targetQuizDistractorIds: [
      "aciclovir",
      "phenytoin",
      "sucralfate",
    ],
    indicationQuizDistractorIds: [
      "aciclovir",
      "phenytoin",
      "sucralfate",
    ],
    mechanismSteps: [
      {
        title: "抑制碳水化合物水解酶",
        detail: "在肠道内抑制 α-葡萄糖苷酶及胰 α-淀粉酶的活性。",
      },
      {
        title: "减慢复杂糖类分解",
        detail: "淀粉、寡糖和双糖转变为可吸收单糖的过程延迟。",
      },
      {
        title: "延迟葡萄糖吸收",
        detail: "葡萄糖进入血液的速度放缓；不直接促进胰岛素分泌。",
      },
      {
        title: "降低餐后血糖峰值",
        detail: "配合饮食和运动改善 2 型糖尿病的血糖控制。",
      },
    ],
    indications: [
      "2 型糖尿病的血糖控制，尤其关注餐后血糖（配合饮食与运动）",
    ],
    adverseReactions: [
      "腹胀、排气增多、腹泻及腹痛",
      "转氨酶升高，少见严重肝脏不良反应",
      "单用通常不致低血糖；与胰岛素或磺脲类合用时风险增加",
      "肠梗阻、炎症性肠病等为重要禁忌；不能仅将明显腹部症状视为普通胀气",
    ],
    memoryTip: "「阿卡波糖让糖慢进门」——合用降糖药发生低血糖时，葡萄糖能直接吸收，蔗糖不能快速纠正。",
    diagram: {
      title: "肠道少分解、慢吸收 → 餐后血糖下降",
      nodes: [
        { id: "n0", label: "阿卡波糖", role: "drug" },
        { id: "n1", label: "糖类水解酶", role: "target" },
        { id: "n2", label: "单糖生成变慢", role: "signal" },
        { id: "n3", label: "糖吸收延迟", role: "signal" },
        { id: "n4", label: "餐后血糖 ↓", role: "effect" },
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
        title: "DailyMed：Acarbose 片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=067c0adc-7322-489d-9baa-1d061b37be36",
        sections: "临床药理、适应症、禁忌、注意事项与不良反应：消化酶抑制、胃肠道风险及葡萄糖与蔗糖的区别。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
  },
  {
    id: "pioglitazone",
    genericName: "吡格列酮",
    brandNames: [],
    englishName: "Pioglitazone",
    category: "endocrine",
    target: "激动核受体 PPARγ，调节基因转录并提高胰岛素敏感性",
    targetQuizDistractorIds: [
      "aciclovir",
      "phenytoin",
      "sucralfate",
    ],
    indicationQuizDistractorIds: [
      "aciclovir",
      "phenytoin",
      "sucralfate",
    ],
    mechanismSteps: [
      {
        title: "激活 PPARγ 核受体",
        detail: "吡格列酮属于噻唑烷二酮类，作用于脂肪、骨骼肌和肝等组织的 PPARγ。",
      },
      {
        title: "调节代谢相关基因转录",
        detail: "受体激活改变参与葡萄糖和脂质代谢的胰岛素反应基因表达。",
      },
      {
        title: "提高胰岛素敏感性",
        detail: "外周组织及肝脏的胰岛素抵抗减轻；它本身不是胰岛素促泌剂。",
      },
      {
        title: "增加葡萄糖利用、减少肝糖输出",
        detail: "发挥降糖作用需要胰岛素存在，因此不用于 1 型糖尿病或糖尿病酮症酸中毒。",
      },
    ],
    indications: [
      "成人 2 型糖尿病的血糖控制（配合饮食与运动）",
    ],
    adverseReactions: [
      "液体潴留、水肿和体重增加，可诱发或加重心衰；NYHA Ⅲ～Ⅳ级心衰禁忌启动治疗",
      "骨折风险增加，女性患者尤其需要关注",
      "与胰岛素或促泌剂合用时低血糖风险增加",
      "上市后有肝损伤报告",
      "膀胱肿瘤风险警示：活动性膀胱癌患者不使用，有既往史时需权衡",
    ],
    memoryTip: "「格列酮让胰岛素更好使」——改善抵抗，但要记住水肿、心衰和骨折。",
    diagram: {
      title: "核受体调控转录 → 改善胰岛素抵抗",
      nodes: [
        { id: "n0", label: "吡格列酮", role: "drug" },
        { id: "n1", label: "PPARγ", role: "target" },
        { id: "n2", label: "代谢基因转录", role: "signal" },
        { id: "n3", label: "胰岛素敏感 ↑", role: "signal" },
        { id: "n4", label: "血糖下降", role: "effect" },
      ],
      edges: [
        { from: "n0", to: "n1", label: "作用于", kind: "flow" },
        { from: "n1", to: "n2", kind: "flow", label: "后续变化" },
        { from: "n2", to: "n3", kind: "flow", label: "后续变化" },
        { from: "n3", to: "n4", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "DailyMed：Pioglitazone 片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=a0846e3e-68b2-fd55-e053-2995a90a673e",
        sections: "黑框警告及第 1、4～6、12.1 节：PPARγ 机制、心衰禁忌及骨折等风险。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
  },
  {
    id: "alendronate",
    genericName: "阿仑膦酸钠",
    brandNames: [],
    englishName: "Alendronate sodium",
    category: "endocrine",
    target: "结合骨羟磷灰石，抑制破骨细胞介导的骨吸收",
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
        title: "结合骨表面羟磷灰石",
        detail: "双膦酸盐对骨矿物质有亲和力，集中于骨吸收活跃的表面。",
      },
      {
        title: "抑制破骨细胞活性",
        detail: "作用于骨吸收细胞，降低其吸收骨组织的能力。",
      },
      {
        title: "减少骨吸收与骨转换",
        detail: "骨组织流失减慢；不是直接刺激成骨细胞造骨。",
      },
      {
        title: "增加骨量并降低相应骨折风险",
        detail: "用于骨质疏松的治疗或特定人群的预防，疗程需根据风险定期评估。",
      },
    ],
    indications: [
      "绝经后骨质疏松的治疗与预防（口服片）",
      "男性骨质疏松的治疗",
      "符合说明书条件的糖皮质激素相关骨质疏松",
    ],
    adverseReactions: [
      "食管炎、食管溃疡和上消化道刺激：食管排空障碍或无法保持直立者禁用",
      "低钙血症：治疗前需纠正低钙并评估维生素 D 状态",
      "肌肉、骨或关节疼痛，个别可较严重",
      "少见但重要：颌骨坏死、非典型股骨骨折",
    ],
    memoryTip: "「阿仑膦酸钠让拆骨慢下来」——清晨空腹用白水送服，至少 30 分钟且进食前保持直立。",
    diagram: {
      title: "结合骨矿物质 → 骨吸收下降",
      nodes: [
        { id: "n0", label: "阿仑膦酸钠", role: "drug" },
        { id: "n1", label: "骨羟磷灰石", role: "target" },
        { id: "n2", label: "破骨细胞活性 ↓", role: "signal" },
        { id: "n3", label: "骨吸收减少", role: "signal" },
        { id: "n4", label: "骨量增加", role: "effect" },
      ],
      edges: [
        { from: "n0", to: "n1", label: "作用于", kind: "flow" },
        { from: "n1", to: "n2", kind: "flow", label: "后续变化" },
        { from: "n2", to: "n3", kind: "flow", label: "后续变化" },
        { from: "n3", to: "n4", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "DailyMed：Alendronate sodium 片说明书",
        url: "https://www.dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ffdd2496-d253-419b-85a6-8c615f7545f1",
        sections: "第 1、2.6、4～5、12.1～12.2 节：骨质疏松、服药方式、食管与骨骼风险、骨吸收机制。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
  },
  {
    id: "repaglinide",
    genericName: "瑞格列奈",
    brandNames: [],
    englishName: "Repaglinide",
    category: "endocrine",
    target: "关闭胰岛 β 细胞 ATP 敏感性钾通道，促进胰岛素释放",
    targetQuizDistractorIds: [
      "aciclovir",
      "phenytoin",
      "sucralfate",
    ],
    indicationQuizDistractorIds: [
      "aciclovir",
      "phenytoin",
      "sucralfate",
    ],
    mechanismSteps: [
      {
        title: "关闭 β 细胞 ATP 敏感性钾通道",
        detail: "与相应位点结合，抑制钾离子经该通道流动。",
      },
      {
        title: "使 β 细胞膜去极化",
        detail: "钾通道关闭改变膜电位，触发后续电活动。",
      },
      {
        title: "开启钙通道并增加钙内流",
        detail: "膜去极化促使电压依赖性钙通道开放，细胞内钙升高。",
      },
      {
        title: "促进胰岛素释放以降低血糖",
        detail: "作用依赖仍有功能的 β 细胞，常围绕进餐发挥作用；仍可导致低血糖。",
      },
    ],
    indications: [
      "成人 2 型糖尿病的血糖控制（配合饮食与运动）",
    ],
    adverseReactions: [
      "低血糖：漏餐时也应跳过相应餐前用药，不能照常服药后不进食",
      "体重增加",
      "与吉非贝齐合用禁忌；应避免与氯吡格雷合用，可能显著增加药物暴露及低血糖风险",
      "肝功能或严重肾功能受损时需谨慎调整与监测",
    ],
    memoryTip: "「瑞格列奈关钾、开钙、促胰岛素」——随餐次安排，漏餐也漏掉对应的一次。",
    diagram: {
      title: "钾通道关闭 → 钙内流 → 胰岛素释放",
      nodes: [
        { id: "n0", label: "瑞格列奈", role: "drug" },
        { id: "n1", label: "β 细胞钾通道", role: "target" },
        { id: "n2", label: "细胞膜去极化", role: "signal" },
        { id: "n3", label: "钙内流增加", role: "signal" },
        { id: "n4", label: "胰岛素释放 ↑", role: "effect" },
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
        title: "DailyMed：Repaglinide 片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=cb995e92-295e-4638-a064-978211f5afe1",
        sections: "第 1～2、4～7、8.6～8.7、12.1 节：2 型糖尿病、餐次和低血糖、相互作用、钾钙通道机制。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
  },
  {
    id: "dapagliflozin",
    genericName: "达格列净",
    brandNames: [],
    englishName: "Dapagliflozin",
    category: "endocrine",
    target: "抑制肾近端小管 SGLT2，减少葡萄糖和钠重吸收，增加尿糖排泄",
    targetQuizDistractorIds: [
      "omeprazole",
      "levothyroxine",
      "aciclovir",
    ],
    indicationQuizDistractorIds: [
      "omeprazole",
      "levothyroxine",
      "aciclovir",
    ],
    mechanismSteps: [
      {
        title: "抑制近端小管 SGLT2",
        detail: "选择性、可逆地抑制钠-葡萄糖协同转运蛋白 2，减少滤过葡萄糖的回收。",
      },
      {
        title: "增加尿糖排泄并改变钠转运",
        detail: "尿糖排泄产生渗透性利尿，远端钠递送增加可增强管球反馈并降低肾小球内压。",
      },
      {
        title: "降低血糖并影响容量负荷",
        detail: "降糖不依赖促进胰岛素分泌；降糖效力受肾功能影响，心肾获益不只来自血糖下降。",
      },
      {
        title: "用于相应糖尿病和心肾疾病",
        detail: "所引 Forxiga 标签包含 2 型糖尿病、成人有症状慢性心衰及成人慢性肾病；不同情境分别评估，不用于治疗 1 型糖尿病。",
      },
    ],
    indications: [
      "控制不佳的 2 型糖尿病，作为饮食和运动的辅助治疗",
      "成人有症状慢性心力衰竭",
      "成人慢性肾病（按具体制剂和临床条件评估）",
    ],
    adverseReactions: [
      "生殖器真菌感染、尿路感染",
      "渗透性利尿可导致容量不足、低血压或头晕",
      "酮症酸中毒可能在血糖不明显升高时发生；手术、急重病等情境需按方案暂停和监测",
      "与胰岛素或促泌剂联用时低血糖风险增加；需结合肾功能评估疗效和用药条件",
    ],
    memoryTip: "「达格拦 SGLT2，糖随尿走」——心肾用途不只看降糖，酮症酸中毒不能只靠血糖排除。",
    diagram: {
      title: "SGLT2 抑制：尿糖排泄与降糖路径",
      nodes: [
        { id: "n0", label: "达格列净", role: "drug" },
        { id: "n1", label: "肾小管 SGLT2", role: "target" },
        { id: "n2", label: "葡萄糖重吸收 ↓", role: "signal" },
        { id: "n3", label: "尿糖排泄 ↑", role: "signal" },
        { id: "n4", label: "血糖降低", role: "effect" },
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
        title: "emc：Forxiga（达格列净）说明书",
        url: "https://www.medicines.org.uk/emc/product/7607/smpc",
        sections: "第 4.1～4.5、4.8、5.1 节：糖尿病、心衰和 CKD、SGLT2 与管球反馈、酮症酸中毒及容量风险。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
  {
    id: "prednisolone",
    genericName: "泼尼松龙",
    brandNames: [],
    englishName: "Prednisolone",
    category: "endocrine",
    target: "激活糖皮质激素受体，改变基因表达，抑制炎症及免疫反应",
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
        title: "激活糖皮质激素受体",
        detail: "泼尼松龙是合成糖皮质激素，进入细胞后通过受体相关作用调节细胞反应。",
      },
      {
        title: "调节基因表达",
        detail: "受体相关信号影响细胞核内转录，改变炎症和免疫相关蛋白的表达。",
      },
      {
        title: "减少促炎介质与免疫活性",
        detail: "促炎细胞因子产生及部分免疫细胞反应受抑，从而减轻炎症。",
      },
      {
        title: "控制适合激素治疗的疾病",
        detail: "用于经评估的炎症、自身免疫或严重过敏性疾病；抗炎和免疫抑制不能代替针对病原体的治疗。",
      },
    ],
    indications: [
      "系统性红斑狼疮等适合全身糖皮质激素治疗的自身免疫性疾病",
      "严重且常规治疗控制不足的过敏性疾病或哮喘",
      "溃疡性结肠炎或克罗恩病的急性加重（按专科方案）",
    ],
    adverseReactions: [
      "感染风险增加，感染表现可被掩盖",
      "高血糖、体液潴留、高血压或体重增加",
      "长期使用可致骨质疏松、肌病、白内障或青光眼",
      "失眠、情绪改变，少见严重精神反应",
      "下丘脑-垂体-肾上腺轴抑制；长期或有抑制风险者不能自行骤停，减量方案需评估",
    ],
    memoryTip: "「泼尼松龙调转录，抗炎也抑免疫」——长期治疗同时关注感染、血糖、骨骼及停药方式。",
    diagram: {
      title: "受体激活 → 转录调节 → 抗炎与免疫抑制",
      nodes: [
        { id: "n0", label: "泼尼松龙", role: "drug" },
        { id: "n1", label: "糖皮质激素受体", role: "target" },
        { id: "n2", label: "基因表达改变", role: "signal" },
        { id: "n3", label: "促炎与免疫反应 ↓", role: "signal" },
        { id: "n4", label: "相应炎症减轻", role: "effect" },
      ],
      edges: [
        { from: "n0", to: "n1", label: "激活", kind: "activate" },
        { from: "n1", to: "n2", kind: "flow", label: "后续变化" },
        { from: "n2", to: "n3", kind: "flow", label: "后续变化" },
        { from: "n3", to: "n4", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "emc：Prednisolone 口服片说明书",
        url: "https://www.medicines.org.uk/emc/product/14314/smpc",
        sections: "第 4.1～4.4、4.8、5.1 节：全身激素适用情境、感染及代谢风险、肾上腺轴抑制和减停药评估。",
      },
      {
        title: "美国国家癌症研究所 NCI：Prednisolone 药物词典",
        url: "https://www.cancer.gov/publications/dictionaries/cancer-drug/def/prednisolone",
        sections: "药物定义：受体相关基因表达调节及促炎细胞因子抑制；用于机制说明，不扩展口服制剂的适应症。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
];
