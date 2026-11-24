import type { DrugCard } from "@/lib/types";

/**
 * 急救与特异性解毒 · 4 张卡片
 *
 * 覆盖四类经典急诊解毒场景：
 * - 阿片过量竞争性拮抗（纳洛酮，警惕半衰期短致再抑制）
 * - 苯二氮䓬拮抗（氟马西尼，警惕慢性依赖与 TCA 混服致痫）
 * - 有机磷中毒双药协作：阿托品（仅拮抗 M 受体）与碘解磷定（老化前重活化 AChE，兼顾 N/M 受体）
 */
export const antidoteCards: readonly DrugCard[] = [
  {
    id: "naloxone",
    genericName: "纳洛酮",
    brandNames: [],
    englishName: "Naloxone",
    category: "antidote",
    target: "竞争性拮抗阿片受体（以 μ 受体亲和力最高），逆转阿片类导致的呼吸与中枢抑制",
    targetQuizDistractorIds: [
      "omeprazole",
      "atorvastatin",
      "levothyroxine",
    ],
    indicationQuizDistractorIds: [
      "omeprazole",
      "atorvastatin",
      "levothyroxine",
    ],
    mechanismSteps: [
      {
        title: "竞争性置换结合阿片受体",
        detail: "纳洛酮为纯粹的阿片受体竞争性拮抗剂，无内在激动活性，以 μ 受体亲和力最强（亦作用于 κ、δ 受体），可将阿片激动剂从受体上置换下来。",
      },
      {
        title: "迅速逆转呼吸抑制与中枢镇静",
        detail: "解除阿片类对延髓呼吸中枢的抑制，迅速恢复自主呼吸频率与通气量，并改善意识抑制与低血压。",
      },
      {
        title: "半衰期短于多数阿片类，警惕再麻醉/再呼吸抑制",
        detail: "纳洛酮血浆半衰期通常仅约 30～90 分钟，作用持续时间短于多数长效或大剂量阿片类药物；初醒后仍可能再次出现致命性呼吸抑制，必须持续监护并在必要时每隔 2～3 分钟或按病情重复给药，不能替代急诊急救。",
      },
      {
        title: "关注阿片依赖者的急性戒断反应",
        detail: "对长期阿片依赖者快速大剂量拮抗可诱发急性阿片戒断综合征（躁动、心动过速、高血压、呕吐甚至肺水肿）；对非阿片类过量引起的呼吸抑制无效。",
      },
    ],
    indications: [
      "已知或疑似阿片类药物过量伴呼吸抑制和/或中枢神经系统抑制的紧急逆转（鼻喷或注射制剂）",
    ],
    adverseReactions: [
      "阿片效应消失后发生呼吸抑制与昏迷复发（再抑制风险，因半衰期短于许多阿片药物）",
      "阿片依赖患者出现急性戒断综合征（烦躁、出汗、恶心呕吐、心动过速、高血压）",
      "术后快速逆转镇痛时可出现疼痛突然复发、交感兴奋、心律失常或非心源性肺水肿",
      "鼻腔制剂偶见鼻黏膜干燥、水肿或充血",
    ],
    memoryTip: "「纳洛酮纯拮抗 μ 受体，急救救呼吸但半衰短」——清醒后别放走，谨防长效阿片再抑制。",
    diagram: {
      title: "竞争性拮抗 μ 受体 → 解除中枢呼吸抑制",
      nodes: [
        { id: "drug", label: "纳洛酮", role: "drug" },
        { id: "mor", label: "μ 阿片受体", role: "target" },
        { id: "disp", label: "置换阿片激动剂", role: "signal" },
        { id: "resp", label: "呼吸中枢抑制解除", role: "signal" },
        { id: "effect", label: "自主呼吸恢复", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "mor", label: "竞争性拮抗", kind: "inhibit" },
        { from: "mor", to: "disp", label: "受体占有置换", kind: "flow" },
        { from: "disp", to: "resp", label: "抑制逆转", kind: "flow" },
        { from: "resp", to: "effect", label: "通气与清醒恢复", kind: "flow" },
      ],
    },
    mechanismQuiz: {
      steps: [
        "高亲和力竞争性结合阿片受体",
        "将阿片类激动剂从 μ 受体置换",
        "解除延髓呼吸中枢受抑状态",
        "自主呼吸与意识迅速恢复",
      ],
      explanation: "本题选取的上游到下游主线：高亲和力竞争性结合阿片受体 → 将阿片类激动剂从 μ 受体置换 → 解除延髓呼吸中枢受抑状态 → 自主呼吸与意识迅速恢复。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "DailyMed：NARCAN（盐酸纳洛酮）鼻喷雾剂说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a0ebc83d-2892-40de-bc0a-775ce90b30db",
        sections: "第 1、2、5、6、12 节：阿片过量紧急逆转、呼吸抑制复发风险、急性戒断与竞争性拮抗药理。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "flumazenil",
    genericName: "氟马西尼",
    brandNames: [],
    englishName: "Flumazenil",
    category: "antidote",
    target: "竞争性拮抗 GABA-A 受体上的苯二氮䓬结合位点",
    targetQuizDistractorIds: [
      "metformin",
      "atorvastatin",
      "allopurinol",
    ],
    indicationQuizDistractorIds: [
      "metformin",
      "atorvastatin",
      "allopurinol",
    ],
    mechanismSteps: [
      {
        title: "竞争性占据 GABA-A 受体苯二氮䓬位点",
        detail: "氟马西尼特异性竞争结合中枢 GABA-A 受体氯离子通道复合物上的苯二氮䓬识别位点，置换苯二氮䓬类及部分非苯二氮䓬类（如唑吡坦）药物。",
      },
      {
        title: "逆转苯二氮䓬介导的镇静作用",
        detail: "减弱苯二氮䓬类对 GABA 抑制性突触传递的增强作用，使镇静和精神运动抑制迅速逆转；但对呼吸抑制的逆转可能不完全且作用时间短于长效苯二氮䓬，仍需防再镇静。",
      },
      {
        title: "高度警惕诱发癫痫发作黑框警告",
        detail: "说明书带有癫痫发作黑框警告：在长期应用苯二氮䓬产生躯体依赖的患者中，突然拮抗可诱发急性戒断与顽固性癫痫；用于控制癫痫持续状态或颅内高压的苯二氮䓬也禁止用氟马西尼逆转。",
      },
      {
        title: "严禁用于三环类抗抑郁药（TCA）混合过量",
        detail: "严重环类/三环类抗抑郁药（TCA）与苯二氮䓬混服过量时，苯二氮䓬对 TCA 的致痫毒性具有缓冲保护；此时给予氟马西尼会解除保护，诱发难治性癫痫及致死性心律失常（明确禁忌）。",
      },
    ],
    indications: [
      "成人或 1 岁及以上儿童意识镇静或全身麻醉后苯二氮䓬类镇静效应的完全或部分逆转（静脉注射）",
      "成人已知或疑似苯二氮䓬类药物过量的处理（须先严格排除 TCA 混服及慢性依赖等禁忌）",
    ],
    adverseReactions: [
      "癫痫发作（黑框警告，尤其见于慢性苯二氮䓬依赖者及 TCA 混合中毒者）",
      "再次出现镇静或换气不足（作用时间常短于长效苯二氮䓬类药物）",
      "室性心律失常或血流动力学波动（尤见于合并三环类抗抑郁药过量时）",
      "恶心、呕吐、头晕、焦虑、情绪不稳及注射部位疼痛",
    ],
    memoryTip: "「氟马西尼逐出苯二氮䓬，慢性依赖与 TCA 混服必致痫」——过量急救切忌盲目推注。",
    diagram: {
      title: "竞争性拮抗苯二氮䓬位点 → 逆转过度镇静",
      nodes: [
        { id: "drug", label: "氟马西尼", role: "drug" },
        { id: "bzd", label: "GABA-A BZD 位点", role: "target" },
        { id: "disp", label: "置换苯二氮䓬类", role: "signal" },
        { id: "gaba", label: "GABA 超极化减弱", role: "signal" },
        { id: "effect", label: "镇静与昏迷逆转", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "bzd", label: "竞争性占据", kind: "inhibit" },
        { from: "bzd", to: "disp", label: "位点置换", kind: "flow" },
        { from: "disp", to: "gaba", label: "过度抑制解除", kind: "flow" },
        { from: "gaba", to: "effect", label: "意识唤醒", kind: "flow" },
      ],
    },
    mechanismQuiz: {
      steps: [
        "竞争性结合 GABA-A 受体苯二氮䓬位点",
        "置换受体上结合的苯二氮䓬类药物",
        "减弱 GABA 介导的过度氯离子内流",
        "中枢镇静效应迅速逆转",
      ],
      explanation: "本题选取的上游到下游主线：竞争性结合 GABA-A 受体苯二氮䓬位点 → 置换受体上结合的苯二氮䓬类药物 → 减弱 GABA 介导的过度氯离子内流 → 中枢镇静效应迅速逆转。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "DailyMed：Flumazenil 静脉注射液说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=11882e93-aa62-4d24-895c-6f01d97fc730",
        sections: "黑框警告、第 1、4、5、6、12.1 节：癫痫警告、TCA 过量禁忌、慢性依赖风险及 BZD 位点拮抗机制。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "atropine",
    genericName: "阿托品",
    brandNames: [],
    englishName: "Atropine",
    category: "antidote",
    target: "竞争性拮抗毒蕈碱型乙酰胆碱（M）受体，阻断节后胆碱能效应",
    targetQuizDistractorIds: [
      "metformin",
      "atorvastatin",
      "omeprazole",
    ],
    indicationQuizDistractorIds: [
      "metformin",
      "atorvastatin",
      "omeprazole",
    ],
    mechanismSteps: [
      {
        title: "竞争性阻断毒蕈碱型（M）胆碱受体",
        detail: "阿托品可逆性、竞争性拮抗副交感神经节后效应器及中枢神经系统上的 M1～M5 毒蕈碱受体，抑制过量乙酰胆碱介导的兴奋效应。",
      },
      {
        title: "逆转有机磷或氨基甲酸酯中毒的毒蕈碱危象",
        detail: "抗胆碱酯酶毒物中毒导致乙酰胆碱大量蓄积；阿托品可迅速减少气道大量分泌物（支气管溢液）、解除支气管痉挛、逆转严重心动过缓并改善中枢呼吸抑制。",
      },
      {
        title: "对烟碱（N）受体无明显作用，不能逆转呼吸肌麻痹",
        detail: "阿托品几乎不拮抗骨骼肌神经肌肉接头及自主神经节的烟碱（N）受体，因此无法解除有机磷中毒引起的肌束震颤与呼吸肌麻痹；抢救有机磷中毒常须尽早联合氯/碘解磷定。",
      },
      {
        title: "监测阿托品化征象及抗胆碱过量不良反应",
        detail: "亦可作为急诊抗迷走神经药用于症状性窦性心动过缓或房室传导阻滞及术前减少分泌物；需注意口干、心动过速、视物模糊、尿潴留、高热及中枢抗胆碱能谵妄。",
      },
    ],
    indications: [
      "有机磷或氨基甲酸酯类杀虫剂及神经毒剂（抗胆碱酯酶药）中毒的解毒治疗（注射制剂）",
      "急性症状性心动过缓或迷走神经张力过高所致房室传导阻滞的急诊处理",
      "全身麻醉前抑制气道及唾液腺分泌（术前抗涎药）",
    ],
    adverseReactions: [
      "口干、皮肤干燥潮红、汗液减少及体温升高",
      "窦性心动过速、心悸或室上性/室性心律失常（心肌缺血者风险增加）",
      "瞳孔散大、视物模糊及眼压升高（闭角型青光眼者易诱发急性发作）",
      "尿潴留、肠蠕动减弱/麻痹性肠梗阻及高剂量下谵妄、幻觉等中枢抗胆碱毒性",
    ],
    memoryTip: "「阿托品只拦 M 受体救气道心跳，管不了 N 受体肌无力」——有机磷抢救常搭解磷定。",
    diagram: {
      title: "竞争性阻断 M 受体 → 解除毒蕈碱危象",
      nodes: [
        { id: "drug", label: "阿托品", role: "drug" },
        { id: "mrec", label: "毒蕈碱 M 受体", role: "target" },
        { id: "sec", label: "腺体分泌与支气管痉挛 ↓", role: "signal" },
        { id: "hr", label: "迷走抑制解除、心率 ↑", role: "signal" },
        { id: "effect", label: "毒蕈碱危象缓解", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "mrec", label: "竞争性拮抗", kind: "inhibit" },
        { from: "mrec", to: "sec", label: "外分泌与平滑肌", kind: "flow" },
        { from: "mrec", to: "hr", label: "心脏 M2 阻断", kind: "flow" },
        { from: "sec", to: "effect", label: "气道通畅改善", kind: "flow" },
        { from: "hr", to: "effect", label: "心动过缓纠正", kind: "flow" },
      ],
    },
    mechanismQuiz: {
      steps: [
        "竞争性结合毒蕈碱型乙酰胆碱（M）受体",
        "阻断蓄积乙酰胆碱对 M 受体的过度激动",
        "气道分泌物减少、支气管舒张且心率回升",
        "有机磷中毒毒蕈碱样危象迅速缓解",
      ],
      explanation: "本题选取的上游到下游主线：竞争性结合毒蕈碱型乙酰胆碱（M）受体 → 阻断蓄积乙酰胆碱对 M 受体的过度激动 → 气道分泌物减少、支气管舒张且心率回升 → 有机磷中毒毒蕈碱样危象迅速缓解。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "DailyMed：Atropine Sulfate（硫酸阿托品）注射液说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b41b73c4-e604-46a7-96b4-073721aa2c1c",
        sections: "第 1、5、6、12.1 节：抗胆碱酯酶中毒解毒与心动过缓适应症、抗胆碱不良反应及 M 受体机制。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "pralidoxime",
    genericName: "碘解磷定",
    brandNames: [],
    englishName: "Pralidoxime",
    category: "antidote",
    target: "肟类胆碱酯酶重活化剂，在酶“老化”前裂解有机磷-AChE 共价键恢复酶活性",
    targetQuizDistractorIds: [
      "levothyroxine",
      "atorvastatin",
      "omeprazole",
    ],
    indicationQuizDistractorIds: [
      "levothyroxine",
      "atorvastatin",
      "omeprazole",
    ],
    mechanismSteps: [
      {
        title: "亲核裂解有机磷与乙酰胆碱酯酶的共价键",
        detail: "有机磷毒物使乙酰胆碱酯酶（AChE）磷酰化失活；解磷定分子中的肟基通过亲核进攻与磷酰基结合，将酶从磷酰化复合物中游离出来而恢复活性。",
      },
      {
        title: "同时改善烟碱样与部分毒蕈碱样症状",
        detail: "恢复 AChE 活性后可加速清除突触间隙蓄积的乙酰胆碱，在神经肌肉接头（烟碱样作用，尤为关键，可解除呼吸肌麻痹）及毒蕈碱位点均发挥解毒效应。",
      },
      {
        title: "必须在酶“老化”前尽早给药",
        detail: "磷酰化 AChE 随时间可脱去烷基发生不可逆“老化（aging）”；一旦老化，解磷定即无法重活化该酶，因此中毒后越早给药越能挽救酶活性并延缓老化。",
      },
      {
        title: "通常与阿托品联合应用以互补覆盖",
        detail: "解磷定对中枢呼吸中枢及早期毒蕈碱症状纠正有限，须与阿托品协同使用（阿托品控 M 样危象及中枢，解磷定保 N 样肌力与重活化酶）；单用或仅对部分氨基甲酸酯类中毒通常不常规推荐，需核对毒物类型与说明书。",
      },
    ],
    indications: [
      "有机磷农药及抗胆碱酯酶神经毒剂中毒的解毒治疗（与阿托品联合使用，注射用氯解磷定/碘解磷定）",
      "治疗重症肌无力胆碱酯酶抑制剂过量所致胆碱能危象（按具体制剂说明书）",
    ],
    adverseReactions: [
      "注射过快可引起心动过速、喉痉挛、肌肉强直及一过性神经肌肉阻滞或血压升高",
      "头晕、视物模糊、复视、头痛及嗜睡",
      "恶心、注射部位疼痛或一过性肝酶升高",
      "肾功能不全者排泄减慢，需适当调整剂量或减慢滴速",
    ],
    memoryTip: "「解磷定抓紧老化前复活胆碱酯酶，主救呼吸肌无力」——有机磷必联阿托品，推注切忌过快。",
    diagram: {
      title: "老化前重活化 AChE → 兼顾 N/M 接头恢复",
      nodes: [
        { id: "drug", label: "碘解磷定", role: "drug" },
        { id: "pache", label: "磷酰化 AChE", role: "target" },
        { id: "ache", label: "恢复 AChE 活性", role: "signal" },
        { id: "clear", label: "蓄积 ACh 水解清除", role: "signal" },
        { id: "effect", label: "呼吸肌麻痹解除", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "pache", label: "老化前裂解", kind: "activate" },
        { from: "pache", to: "ache", label: "酶游离重活化", kind: "flow" },
        { from: "ache", to: "clear", label: "突触递质降解 ↑", kind: "flow" },
        { from: "clear", to: "effect", label: "N/M 接头功能恢复", kind: "flow" },
      ],
    },
    mechanismQuiz: {
      steps: [
        "在酶发生“老化”前与磷酰化胆碱酯酶结合",
        "裂解有机磷-酶键使乙酰胆碱酯酶重活化",
        "加速水解神经肌肉接头与突触蓄积乙酰胆碱",
        "解除烟碱样呼吸肌麻痹并协同缓解中毒症状",
      ],
      explanation: "本题选取的上游到下游主线：在酶发生“老化”前与磷酰化胆碱酯酶结合 → 裂解有机磷-酶键使乙酰胆碱酯酶重活化 → 加速水解神经肌肉接头与突触蓄积乙酰胆碱 → 解除烟碱样呼吸肌麻痹并协同缓解中毒症状。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "DailyMed：PROTOPAM（氯解磷定）注射用粉针剂说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2741d8fd-51c2-46be-880b-99f2b20a6137",
        sections: "适应症、临床药理、警告与用法用量：AChE 重活化、老化窗口、烟碱/毒蕈碱作用及联合阿托品原则。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
];
