import type { DrugCard } from "@/lib/types";

/**
 * 神经系统 · 17 张卡片
 *
 * 四条主线：
 * - 抗焦虑/镇静：苯二氮䓬增强 GABA 抑制（地西泮）
 * - 抗癫痫：钠通道阻滞（苯妥英钠）、多靶点广谱（丙戊酸钠）
 * - 抗精神病：D2 阻断（氯丙嗪、氟哌啶醇）、SSRI 抗抑郁（氟西汀、舍曲林）
 * - 镇痛与帕金森：阿片受体（吗啡）、多巴胺补充（左旋多巴）
 */
export const nervousCards: readonly DrugCard[] = [
  {
    id: "diazepam",
    genericName: "地西泮",
    brandNames: [
      "安定",
    ],
    englishName: "Diazepam",
    category: "nervous",
    target: "结合 GABA-A 受体的苯二氮䓬位点，正向调节 GABA 作用",
    mechanismSteps: [
      {
        title: "结合受体调节位点",
        detail: "地西泮结合 GABA-A 受体的苯二氮䓬位点，不是直接替代 GABA 的递质激动药。",
      },
      {
        title: "增强 GABA 抑制作用",
        detail: "在 GABA 存在时增强受体介导的氯离子通道作用，降低神经元兴奋性。",
      },
      {
        title: "产生多种中枢效应",
        detail: "可产生抗焦虑、镇静、肌松及抗惊厥效应，具体用途取决于剂型和治疗情境。",
      },
      {
        title: "效应持续与风险并存",
        detail: "活性代谢物可延续效应；与阿片类或酒精等合用会增加严重镇静和呼吸抑制风险，不能因所谓天花板效应宣称安全。",
      },
    ],
    indications: [
      "焦虑障碍或焦虑症状的短期治疗",
      "骨骼肌痉挛等的辅助治疗",
      "特定癫痫或酒精戒断治疗方案；急救途径须另核对",
    ],
    adverseReactions: [
      "嗜睡、共济失调及跌倒风险",
      "依赖、耐受与戒断反应",
      "呼吸抑制，合并其他中枢抑制剂时风险增加",
      "记忆损害及反常兴奋",
    ],
    memoryTip: "增强 GABA，不等于直接代替 GABA；联用中枢抑制剂风险增加。",
    diagram: {
      title: "地西泮：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "地西泮", role: "drug" },
        { id: "s0", label: "结合苯二氮䓬位点", role: "target" },
        { id: "s1", label: "GABA 介导的通道作用增强", role: "signal" },
        { id: "s2", label: "神经元兴奋性降低", role: "signal" },
        { id: "s3", label: "中枢抑制效应增强", role: "effect" },
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
        "结合苯二氮䓬位点",
        "GABA 介导的通道作用增强",
        "神经元兴奋性降低",
        "中枢抑制效应增强",
      ],
      explanation: "本题选取的上游到下游主线：结合苯二氮䓬位点 → GABA 介导的通道作用增强 → 神经元兴奋性降低 → 中枢抑制效应增强。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "地西泮 VALIUM 口服片说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=260e2041-2bb3-482f-850e-b5d47a7bdbe6",
        sections: "5、6、9、12.1～12.3 节：GABA-A 位点、活性代谢物、中枢反应、依赖与戒断。",
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
    id: "fluoxetine",
    genericName: "氟西汀",
    brandNames: [
      "百忧解",
    ],
    englishName: "Fluoxetine",
    category: "nervous",
    target: "抑制 5-羟色胺转运体（SERT）介导的再摄取",
    mechanismSteps: [
      {
        title: "抑制 5-HT 再摄取",
        detail: "氟西汀属于选择性 5-HT 再摄取抑制剂（SSRI），减少突触前神经元对 5-HT 的回收。",
      },
      {
        title: "增强相关递质信号",
        detail: "再摄取减少可增加突触间隙 5-HT 的可利用性，但这不能等同于即时抗抑郁。",
      },
      {
        title: "疗效形成涉及后续适应",
        detail: "确切治疗机制尚未完全明确；受体调节及神经可塑性是研究解释，不能写成所有患者已证实的唯一因果链。",
      },
      {
        title: "持续评估疗效与风险",
        detail: "临床改善常需一定时间，个体差异明显；应关注治疗初期、调整剂量时的情绪与行为恶化。",
      },
    ],
    indications: [
      "重性抑郁障碍",
      "强迫症、神经性贪食症及惊恐障碍等符合说明书的用途",
    ],
    adverseReactions: [
      "恶心、腹泻等胃肠道反应",
      "失眠或嗜睡、性功能障碍",
      "血清素综合征、低钠血症和出血风险",
      "躁狂转化；儿童、青少年和年轻成人需特别关注自杀想法或行为风险",
    ],
    memoryTip: "SSRI 减少再摄取；分子作用较快，临床改善不一定同步。",
    diagram: {
      title: "氟西汀：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "氟西汀", role: "drug" },
        { id: "s0", label: "SERT 再摄取受抑", role: "target" },
        { id: "s1", label: "突触间隙 5-HT 可利用性增加", role: "signal" },
        { id: "s2", label: "后续神经适应与疗效（未完全阐明）", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "s0", label: "主线环节", kind: "flow" },
        { from: "s0", to: "s1", label: "后续变化", kind: "flow" },
        { from: "s1", to: "s2", label: "后续变化", kind: "flow" },
      ],
    },
    sources: [
      {
        title: "氟西汀口服胶囊说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ab1eec9d-f755-81a2-e053-2a95a90acb3c",
        sections: "1、5.1、5.2、5.4、6、7.7、12.1～12.3 节：SSRI、适应症、嗜睡、精神与血清素风险及地西泮相互作用。",
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
    id: "chlorpromazine",
    genericName: "氯丙嗪",
    brandNames: [
      "冬眠灵",
    ],
    englishName: "Chlorpromazine",
    category: "nervous",
    target: "主要拮抗多巴胺 D2 受体，同时影响其他受体",
    mechanismSteps: [
      {
        title: "阻断多巴胺受体信号",
        detail: "氯丙嗪属于吩噻嗪类抗精神病药，抗精神病作用与中枢多巴胺受体阻断相关，完整治疗机制未完全明确。",
      },
      {
        title: "不同通路产生不同效应",
        detail: "中脑边缘通路、黑质纹状体通路和结节漏斗通路的影响不同，分别联系症状改善、运动副作用和泌乳素变化。",
      },
      {
        title: "避免错误推导第二信使",
        detail: "D2 属 Gi/o 偶联受体，不能把阻断 D2 直接写成腺苷酸环化酶下降；细胞内结果还取决于通路与细胞类型。",
      },
      {
        title: "其他受体参与不良反应",
        detail: "α 肾上腺素、组胺和胆碱受体相关作用参与低血压、镇静及抗胆碱反应。",
      },
    ],
    indications: [
      "精神分裂症等精神病性障碍",
      "特定躁狂、难治性呃逆等符合说明书的情境",
    ],
    adverseReactions: [
      "锥体外系反应及迟发性运动障碍",
      "体位性低血压、镇静和抗胆碱反应",
      "高泌乳素血症",
      "恶性综合征、QT 延长及严重心律失常风险",
    ],
    memoryTip: "D2 阻断需分通路理解；不能由受体阻断直接推导 cAMP 必然下降。",
    diagram: {
      title: "氯丙嗪：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "氯丙嗪", role: "drug" },
        { id: "s0", label: "多巴胺受体被阻断", role: "target" },
        { id: "s1", label: "多巴胺信号受影响", role: "signal" },
        { id: "s2", label: "疗效及通路相关不良反应", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "s0", label: "主线环节", kind: "flow" },
        { from: "s0", to: "s1", label: "后续变化", kind: "flow" },
        { from: "s1", to: "s2", label: "后续变化", kind: "flow" },
      ],
    },
    sources: [
      {
        title: "氯丙嗪说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=41b86f9d-d7e2-4296-8d88-e8257c7cbed2",
        sections: "药理、适应症、警告与不良反应（剂型与适用范围见正文）",
      },
      {
        title: "氯丙嗪口服片说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/3475/smpc",
        sections: "4.1、4.4、4.8、5.1 节：吩噻嗪类、精神病性障碍与躁狂用途、心律及其他受体相关风险。",
      },
      {
        title: "氯丙嗪药物词条 · 美国国家癌症研究所 NCI",
        url: "https://www.cancer.gov/publications/dictionaries/cancer-drug/def/chlorpromazine",
        sections: "药理机制：阻断脑内突触后多巴胺受体与抗精神病作用。",
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
    id: "morphine",
    genericName: "吗啡",
    brandNames: [],
    englishName: "Morphine",
    category: "nervous",
    target: "主要激动 μ 阿片受体",
    mechanismSteps: [
      {
        title: "激动 μ 阿片受体",
        detail: "吗啡是完全阿片受体激动药，主要作用于 μ 受体。",
      },
      {
        title: "影响神经元离子通道",
        detail: "Gi/o 相关信号可减少突触前钙内流、增加突触后钾电导等，降低兴奋性与递质释放。",
      },
      {
        title: "调节痛觉传递",
        detail: "脑和脊髓多个环节参与镇痛，精确的全部镇痛机制仍未完全阐明。",
      },
      {
        title: "同时影响呼吸与肠道",
        detail: "呼吸抑制、便秘等是其他组织中的并行效应，不是疼痛缓解后才必然出现；不能把急性心衰呼吸困难列为常规自用适应症。",
      },
    ],
    indications: [
      "严重到需要阿片类且替代治疗不足的急性或慢性疼痛，按具体制剂评估",
    ],
    adverseReactions: [
      "呼吸抑制、过度镇静",
      "便秘、恶心、呕吐",
      "低血压、尿潴留",
      "依赖、成瘾、耐受及戒断风险",
    ],
    memoryTip: "μ 受体激动能镇痛，也能抑制呼吸；疗效与风险同时评估。",
    diagram: {
      title: "吗啡：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "吗啡", role: "drug" },
        { id: "s0", label: "μ 受体激活", role: "target" },
        { id: "s1", label: "神经元信号与递质释放改变", role: "signal" },
        { id: "s2", label: "痛觉传递受到调节", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "s0", label: "主线环节", kind: "flow" },
        { from: "s0", to: "s1", label: "后续变化", kind: "flow" },
        { from: "s1", to: "s2", label: "后续变化", kind: "flow" },
      ],
    },
    sources: [
      {
        title: "吗啡口服片说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3c847554-3b4b-4d24-a145-2ef7e9b83699",
        sections: "1、5、9、12.1～12.3 节：镇痛用途、中枢与胃肠作用、依赖及葡萄糖醛酸结合代谢。",
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
    id: "levodopa",
    genericName: "左旋多巴",
    brandNames: [],
    englishName: "Levodopa",
    category: "nervous",
    target: "作为多巴胺前体进入脑内，再经脱羧形成多巴胺",
    mechanismSteps: [
      {
        title: "前体通过血脑屏障",
        detail: "多巴胺本身不易进入脑内，左旋多巴作为氨基酸前体可通过血脑屏障；左旋多巴本身不是多巴胺。",
      },
      {
        title: "脑内脱羧形成多巴胺",
        detail: "芳香族 L-氨基酸脱羧酶将其转化为多巴胺，补充相关通路的递质。",
      },
      {
        title: "改善运动症状",
        detail: "可改善帕金森病的运动症状，但不能据此宣称阻止神经退行性病变。",
      },
      {
        title: "区分外周脱羧抑制剂",
        detail: "常与卡比多巴或苄丝肼合用以减少外周转化；复方中抑制外周脱羧的作用不属于左旋多巴本身。",
      },
    ],
    indications: [
      "帕金森病等符合说明书的帕金森综合征运动症状",
    ],
    adverseReactions: [
      "恶心、体位性低血压",
      "异动症和运动波动",
      "幻觉、意识混乱及冲动控制问题",
      "嗜睡或突发睡眠",
    ],
    memoryTip: "前体进脑后变成多巴胺；外周脱羧抑制靠复方另一成分。",
    diagram: {
      title: "左旋多巴：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "左旋多巴", role: "drug" },
        { id: "s0", label: "左旋多巴进入脑内", role: "signal" },
        { id: "s1", label: "脑内脱羧形成多巴胺", role: "signal" },
        { id: "s2", label: "相关递质供应增加", role: "signal" },
        { id: "s3", label: "帕金森运动症状改善", role: "effect" },
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
        "左旋多巴进入脑内",
        "脑内脱羧形成多巴胺",
        "相关递质供应增加",
        "帕金森运动症状改善",
      ],
      explanation: "本题选取的上游到下游主线：左旋多巴进入脑内 → 脑内脱羧形成多巴胺 → 相关递质供应增加 → 帕金森运动症状改善。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "卡比多巴/左旋多巴口服片说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=dd2215a9-ee0f-443a-a2e3-3d0578c8cd8f",
        sections: "药理、适应症、警告与不良反应；不外推到其他剂型",
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
    id: "phenytoin",
    genericName: "苯妥英钠",
    brandNames: [],
    englishName: "Phenytoin Sodium",
    category: "nervous",
    target: "电压依赖性阻断神经元钠通道，限制持续高频放电",
    mechanismSteps: [
      {
        title: "作用于电压门控钠通道",
        detail: "苯妥英的主要机制解释是电压依赖性钠通道阻断，完整治疗机制尚未完全明确。",
      },
      {
        title: "减少持续高频放电",
        detail: "稳定相关通道状态，限制神经元反复高频放电及异常兴奋传播；不能写成对正常神经元完全无影响。",
      },
      {
        title: "用于适合的发作类型",
        detail: "可用于强直阵挛及局灶性发作，不是所有癫痫类型通用药。",
      },
      {
        title: "剂型和药代决定使用边界",
        detail: "有口服和静脉制剂，急救用途须核对具体制剂；代谢可饱和，小幅加量也可能显著提高血药浓度。",
      },
    ],
    indications: [
      "强直阵挛发作及部分局灶性发作",
      "神经外科手术相关发作等符合具体制剂说明书的用途",
    ],
    adverseReactions: [
      "眼震、共济失调及嗜睡",
      "牙龈增生、多毛",
      "严重皮肤反应和肝损伤",
      "静脉制剂可致低血压、心律失常及局部损伤",
    ],
    memoryTip: "钠通道限制高频放电；代谢可饱和，制剂不可混用。",
    diagram: {
      title: "苯妥英钠：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "苯妥英钠", role: "drug" },
        { id: "s0", label: "电压门控钠通道受抑", role: "target" },
        { id: "s1", label: "持续高频放电减少", role: "signal" },
        { id: "s2", label: "异常兴奋传播受限", role: "signal" },
        { id: "s3", label: "适用类型的发作减少", role: "effect" },
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
        "电压门控钠通道受抑",
        "持续高频放电减少",
        "异常兴奋传播受限",
        "适用类型的发作减少",
      ],
      explanation: "本题选取的上游到下游主线：电压门控钠通道受抑 → 持续高频放电减少 → 异常兴奋传播受限 → 适用类型的发作减少。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "苯妥英钠说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=86dd27d1-9cee-48ae-b55d-e2d2f7dbc593&type=display",
        sections: "DILANTIN 的 5、7、12.1、12.3 节：机制、酶诱导、饱和代谢及风险。",
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
    id: "valproate",
    genericName: "丙戊酸钠",
    brandNames: [
      "德巴金",
    ],
    englishName: "Sodium Valproate",
    category: "nervous",
    target: "多环节抗癫痫作用，可能涉及脑内 GABA 增加及离子通道调节",
    mechanismSteps: [
      {
        title: "形成丙戊酸根活性部分",
        detail: "不同盐或制剂释放和暴露不同，不能仅按药名直接替换。",
      },
      {
        title: "可能增强 GABA 相关抑制",
        detail: "说明书提出脑内 GABA 增加可能参与作用；不能把单一酶抑制写成已经完全证实的治疗机制。",
      },
      {
        title: "多条通路共同影响兴奋性",
        detail: "钠通道等离子通道调节也是机制解释，完整治疗机制仍未确立。",
      },
      {
        title: "依据发作类型及生殖风险选择",
        detail: "可用于多种癫痫发作，但不是无条件首选；妊娠及有生育潜能患者需要严格风险评估。",
      },
    ],
    indications: [
      "局灶性、失神等符合具体制剂说明书的癫痫发作",
      "躁狂或偏头痛预防等用途须另核对当地批准的具体制剂",
    ],
    adverseReactions: [
      "肝毒性及胰腺炎",
      "胚胎胎儿畸形与神经发育风险",
      "血小板减少、高氨血症",
      "体重增加、震颤及胃肠道不适",
    ],
    memoryTip: "多机制尚未完全明确；肝、胰腺和生殖风险必须记住。",
    diagram: {
      title: "丙戊酸钠：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "丙戊酸钠", role: "drug" },
        { id: "s0", label: "可能增强 GABA 并调节离子通道", role: "signal" },
        { id: "s1", label: "神经元兴奋性受调节", role: "signal" },
        { id: "s2", label: "适用类型的发作减少", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "s0", label: "主线环节", kind: "flow" },
        { from: "s0", to: "s1", label: "后续变化", kind: "flow" },
        { from: "s1", to: "s2", label: "后续变化", kind: "flow" },
      ],
    },
    sources: [
      {
        title: "丙戊酸钠说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ec41025a-ed7d-48c8-9005-08e3a9417f30",
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
    id: "haloperidol",
    genericName: "氟哌啶醇",
    brandNames: [],
    englishName: "Haloperidol",
    category: "nervous",
    target: "主要拮抗中枢多巴胺 D2 受体",
    mechanismSteps: [
      {
        title: "阻断 D2 受体",
        detail: "氟哌啶醇是丁酰苯类抗精神病药，主要药理作用与多巴胺 D2 受体拮抗有关。",
      },
      {
        title: "调节多巴胺通路",
        detail: "可减轻精神病性症状，完整治疗机制不能用单一细胞内信号概括。",
      },
      {
        title: "不同通路也产生副作用",
        detail: "黑质纹状体和结节漏斗通路受影响，可出现运动障碍及高泌乳素血症。",
      },
      {
        title: "不是仅有一个受体作用",
        detail: "其他受体作用及 QT 风险仍需考虑；谵妄等特殊情境不能作为所有患者的常规适应症。",
      },
    ],
    indications: [
      "精神分裂症等精神病性障碍",
      "特定抽动障碍等用途需按年龄及制剂说明书评估",
    ],
    adverseReactions: [
      "锥体外系反应及迟发性运动障碍",
      "高泌乳素血症",
      "QT 延长及尖端扭转型室速风险",
      "恶性综合征、镇静及体位性低血压",
    ],
    memoryTip: "D2 阻断较突出，但运动、心律和恶性综合征风险不能忽略。",
    diagram: {
      title: "氟哌啶醇：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "氟哌啶醇", role: "drug" },
        { id: "s0", label: "D2 受体被阻断", role: "target" },
        { id: "s1", label: "相关多巴胺通路受影响", role: "signal" },
        { id: "s2", label: "精神症状改善及通路相关副作用", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "s0", label: "主线环节", kind: "flow" },
        { from: "s0", to: "s1", label: "后续变化", kind: "flow" },
        { from: "s1", to: "s2", label: "后续变化", kind: "flow" },
      ],
    },
    sources: [
      {
        title: "氟哌啶醇口服片说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=325d169d-310d-4ada-e063-6294a90afbdd",
        sections: "药理、适应症、警告与不良反应；不外推到其他剂型",
      },
      {
        title: "氟哌啶醇 HALDOL 口服溶液说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/15252/smpc",
        sections: "4.1、4.3～4.5、4.8、5.1 节：丁酰苯、D2 拮抗、治疗用途、帕金森病禁忌及运动与心律风险。",
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
    id: "sertraline",
    genericName: "舍曲林",
    brandNames: [
      "左洛复",
    ],
    englishName: "Sertraline",
    category: "nervous",
    target: "抑制 5-羟色胺转运体（SERT）介导的再摄取",
    mechanismSteps: [
      {
        title: "抑制 5-HT 再摄取",
        detail: "舍曲林属于选择性 5-HT 再摄取抑制剂（SSRI），减少突触前神经元对 5-HT 的回收。",
      },
      {
        title: "增强相关递质信号",
        detail: "再摄取减少可增加突触间隙 5-HT 的可利用性，但这不能等同于即时抗抑郁。",
      },
      {
        title: "疗效形成涉及后续适应",
        detail: "确切治疗机制尚未完全明确；受体调节及神经可塑性是研究解释，不能写成所有患者已证实的唯一因果链。",
      },
      {
        title: "持续评估疗效与风险",
        detail: "临床改善常需一定时间，个体差异明显；应关注治疗初期、调整剂量时的情绪与行为恶化。",
      },
    ],
    indications: [
      "抑郁障碍",
      "强迫症、惊恐障碍及创伤后应激障碍等符合说明书的用途",
    ],
    adverseReactions: [
      "恶心、腹泻等胃肠道反应",
      "失眠或嗜睡、性功能障碍",
      "血清素综合征、低钠血症和出血风险",
      "躁狂转化；儿童、青少年和年轻成人需特别关注自杀想法或行为风险",
    ],
    memoryTip: "SSRI 减少再摄取；分子作用较快，临床改善不一定同步。",
    diagram: {
      title: "舍曲林：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "舍曲林", role: "drug" },
        { id: "s0", label: "SERT 再摄取受抑", role: "target" },
        { id: "s1", label: "突触间隙 5-HT 可利用性增加", role: "signal" },
        { id: "s2", label: "后续神经适应与疗效（未完全阐明）", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "s0", label: "主线环节", kind: "flow" },
        { from: "s0", to: "s1", label: "后续变化", kind: "flow" },
        { from: "s1", to: "s2", label: "后续变化", kind: "flow" },
      ],
    },
    sources: [
      {
        title: "舍曲林说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=91b4c802-9c6b-49bb-b5a7-661e1917ef34",
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
    id: "gabapentin",
    genericName: "加巴喷丁",
    brandNames: [],
    englishName: "Gabapentin",
    category: "nervous",
    target: "高亲和力结合电压门控钙通道 α2δ 亚基；抗癫痫与镇痛的完整机制尚未明确",
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
        title: "结合钙通道 α2δ 亚基",
        detail: "体外研究确认其高亲和力结合 α2δ；虽结构类似 GABA，但不是 GABA 受体激动剂。",
      },
      {
        title: "可能减少兴奋性递质释放",
        detail: "临床前模型提示，α2δ 结合后的效应可能涉及中枢兴奋性神经递质释放减少。",
      },
      {
        title: "可能调节兴奋与痛觉传递",
        detail: "这些变化被认为可能参与动物模型中的抗发作及镇痛效应，人体中的对应关系尚未确定。",
      },
      {
        title: "产生临床抗发作与镇痛效应",
        detail: "临床用于部分性发作辅助治疗及成人带状疱疹后神经痛；不能把上述假说写成已证实的完整因果链。",
      },
    ],
    indications: [
      "成人带状疱疹后神经痛（所引美国 NEURONTIN 说明书）",
      "成人及 3 岁以上儿童部分性发作的辅助治疗，可伴或不伴继发性全身发作",
    ],
    adverseReactions: [
      "嗜睡、头晕、共济失调及外周水肿",
      "合用阿片类等中枢抑制药或已有呼吸功能障碍时，可能发生严重呼吸抑制",
      "抗癫痫药相关自杀意念或行为风险，需关注情绪变化",
      "严重过敏反应及多器官超敏反应；肾功能下降时需调整用药方案",
      "突然停药可使发作增多或出现撤药症状，应由医生制定停药计划",
    ],
    memoryTip: "「加巴喷丁名字像 GABA，靶点却是 α2δ」——结合已知，完整治疗机制仍未明确。",
    diagram: {
      title: "α2δ 结合已知；后续机制为临床前假说",
      nodes: [
        { id: "n0", label: "加巴喷丁", role: "drug" },
        { id: "n1", label: "α2δ 亚基", role: "target" },
        { id: "n2", label: "递质释放或减少", role: "signal" },
        { id: "n3", label: "兴奋传递或减弱", role: "effect" },
      ],
      edges: [
        { from: "n0", to: "n1", label: "作用于", kind: "flow" },
        { from: "n1", to: "n2", kind: "flow", label: "后续变化" },
        { from: "n2", to: "n3", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "DailyMed：NEURONTIN（gabapentin）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=97935fd9-1d4a-43b6-a5d9-de994591187b",
        sections: "第 1、2.3、5、6、12.1 节：美国制剂适应症、肾功能调整、呼吸抑制及机制的不确定性。",
      },
      {
        title: "emc：Gabapentin Tablets 600 mg 产品特性概要",
        url: "https://www.medicines.org.uk/emc/product/101986/smpc",
        sections: "第 5.1 节：α2δ 与递质释放的临床前证据；人体治疗效应的机制尚未明确。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
  },
  {
    id: "donepezil",
    genericName: "多奈哌齐",
    brandNames: [],
    englishName: "Donepezil",
    category: "nervous",
    target: "可逆性抑制乙酰胆碱酯酶，增强胆碱能神经传递",
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
        title: "可逆性抑制乙酰胆碱酯酶",
        detail: "抑制负责水解乙酰胆碱的酶。",
      },
      {
        title: "减少乙酰胆碱水解",
        detail: "乙酰胆碱被清除的速度减慢。",
      },
      {
        title: "增强胆碱能传递",
        detail: "乙酰胆碱浓度增加，增强现有胆碱能信号。",
      },
      {
        title: "改善部分认知相关症状",
        detail: "用于阿尔茨海默病型痴呆的症状治疗，没有证据表明它改变基础痴呆病程。",
      },
    ],
    indications: [
      "阿尔茨海默病型痴呆的症状治疗，证据覆盖轻、中、重度患者",
    ],
    adverseReactions: [
      "恶心、呕吐和腹泻",
      "心动过缓、传导阻滞及晕厥",
      "食欲下降与体重减轻",
      "胃酸增加，需关注消化道出血，尤其已有溃疡或合用 NSAIDs 时",
      "失眠及肌肉痉挛",
    ],
    memoryTip: "「多奈哌齐少拆乙酰胆碱」——帮助传递信号，不能当作逆转痴呆病程的药。",
    diagram: {
      title: "少水解乙酰胆碱 → 增强胆碱能传递",
      nodes: [
        { id: "n0", label: "多奈哌齐", role: "drug" },
        { id: "n1", label: "乙酰胆碱酯酶", role: "target" },
        { id: "n2", label: "乙酰胆碱 ↑", role: "signal" },
        { id: "n3", label: "胆碱能传递 ↑", role: "signal" },
        { id: "n4", label: "症状改善", role: "effect" },
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
        title: "DailyMed：ARICEPT（donepezil）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=98e451e1-e4d7-4439-a675-c5457ba20975",
        sections: "第 1、5～6、12.1 节：症状治疗范围、胆碱酯酶抑制及心率、胃肠道、体重风险。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
  },
  {
    id: "carbamazepine",
    genericName: "卡马西平",
    brandNames: [],
    englishName: "Carbamazepine",
    category: "nervous",
    target: "主要机制被认为是使用与电压依赖性的钠通道阻滞，抑制神经元反复放电",
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
        title: "阻滞电压依赖性钠通道（主要机制推定）",
        detail: "完整机制尚未完全阐明；使用和电压依赖性钠通道阻滞被认为是重要作用基础。",
      },
      {
        title: "稳定过度兴奋的神经膜",
        detail: "降低神经元产生连续高频动作电位的能力。",
      },
      {
        title: "减少反复放电与兴奋传播",
        detail: "异常电活动较难持续并向其他神经元扩散。",
      },
      {
        title: "控制相应癫痫发作和三叉神经痛",
        detail: "适用发作类型需区分；一般不用于失神发作，部分发作类型可能加重。",
      },
    ],
    indications: [
      "局灶性癫痫发作及全面强直阵挛发作的治疗",
      "三叉神经痛",
    ],
    adverseReactions: [
      "头晕、嗜睡、共济失调和复视",
      "低钠血症或水潴留",
      "严重皮肤反应：汉族、泰国等遗传高风险人群开始治疗前应按说明书筛查 HLA-B*15:02",
      "白细胞减少，罕见粒细胞缺乏或再生障碍性贫血，亦需关注肝损伤",
      "酶诱导可产生多种相互作用；妊娠相关风险需专门评估",
    ],
    memoryTip: "「卡马西平让异常放电难以接力」——认清发作类型，关注皮疹、血象和血钠。",
    diagram: {
      title: "主要机制推定：钠通道阻滞 → 反复放电减少",
      nodes: [
        { id: "n0", label: "卡马西平", role: "drug" },
        { id: "n1", label: "电压依赖钠通道", role: "target" },
        { id: "n2", label: "神经膜趋于稳定", role: "signal" },
        { id: "n3", label: "异常放电减少", role: "signal" },
        { id: "n4", label: "相应发作受控", role: "effect" },
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
        title: "emc：Tegretol 卡马西平片说明书",
        url: "https://www.medicines.org.uk/emc/product/7846/smpc",
        sections: "第 4.1～4.6、4.8、5.1 节：发作类型、三叉神经痛、HLA 风险、血液及电解质不良反应与机制不确定性。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
  },
  {
    id: "memantine",
    genericName: "美金刚",
    brandNames: [],
    englishName: "Memantine",
    category: "nervous",
    target: "以低至中等亲和力阻断开放的 NMDA 受体阳离子通道，属于非竞争性通道拮抗作用",
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
        title: "阻断开放的 NMDA 受体通道",
        detail: "优先结合受体控制的开放阳离子通道，属于开放通道阻滞。",
      },
      {
        title: "减弱持续的谷氨酸受体激活效应",
        detail: "限制 NMDA 通道介导的阳离子流动。",
      },
      {
        title: "调节过度兴奋信号（治疗机制推定）",
        detail: "持续 NMDA 激活与症状的关系及其治疗意义属于提出的机制解释，不能等同于已证明保护全部神经元。",
      },
      {
        title: "用于中重度阿尔茨海默病症状治疗",
        detail: "说明书没有证据证明美金刚能够预防或减缓该病的神经退行性过程。",
      },
    ],
    indications: [
      "中度至重度阿尔茨海默型痴呆的治疗",
    ],
    adverseReactions: [
      "头晕、头痛",
      "意识混乱，可出现嗜睡或幻觉",
      "便秘",
      "严重肾功能受损需减量；尿液碱化可降低清除率并增加不良反应风险",
    ],
    memoryTip: "「美金刚拦住过度打开的 NMDA 通道」——用于相应认知症状治疗，不能表述为治愈或逆转病程。",
    diagram: {
      title: "NMDA 通道阻滞；临床作用路径为推定",
      nodes: [
        { id: "n0", label: "美金刚", role: "drug" },
        { id: "n1", label: "开放 NMDA 通道", role: "target" },
        { id: "n2", label: "阳离子内流 ↓", role: "signal" },
        { id: "n3", label: "兴奋信号受调节", role: "signal" },
        { id: "n4", label: "相应症状治疗", role: "effect" },
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
        title: "DailyMed：NAMENDA 美金刚片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=b9f27baf-aa2a-443a-9ef5-e002d23407ba",
        sections: "第 1～2、5～7、8.6、12.1 节：中重度阿尔茨海默型痴呆、肾功能、NMDA 作用假说及无病程改变证据。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
  },
  {
    id: "levetiracetam",
    genericName: "左乙拉西坦",
    brandNames: [],
    englishName: "Levetiracetam",
    category: "nervous",
    target: "结合突触囊泡蛋白 SV2A，可能参与抗癫痫作用；完整机制尚未明确",
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
        title: "结合突触囊泡蛋白 SV2A",
        detail: "实验研究识别出 SV2A 结合位点；该蛋白被认为与囊泡胞吐有关。",
      },
      {
        title: "可能影响囊泡相关传递",
        detail: "SV2A 结合提示其可能调节突触囊泡功能，这是解释抗癫痫作用的一条线索。",
      },
      {
        title: "可能参与抗发作效应",
        detail: "动物研究中结合亲和力与抗发作活性相关，但不能据此把人体完整作用链当作已证实。",
      },
      {
        title: "减少相应类型癫痫发作",
        detail: "临床用于局灶性发作及特定全身性发作的辅助治疗；精确抗癫痫机制仍未明确。",
      },
    ],
    indications: [
      "局灶性起始癫痫发作（所引口服制剂适用于 1 月龄及以上，需选择适龄剂型）",
      "青少年肌阵挛癫痫的肌阵挛发作辅助治疗（12 岁及以上）",
      "特发性全面性癫痫的原发性全面强直阵挛发作辅助治疗（6 岁及以上）",
    ],
    adverseReactions: [
      "嗜睡、乏力、头晕或协调障碍",
      "易激惹、攻击性或精神行为异常；需监测情绪与自杀意念变化",
      "严重皮肤反应及 DRESS 等超敏反应",
      "突然停药可能增加发作；肾功能减退时需调整方案",
    ],
    memoryTip: "「左乙认 SV2A，但机制未全明」——记住结合线索，也记住行为变化和肾功能。",
    diagram: {
      title: "SV2A 结合线索：完整抗癫痫机制未明",
      nodes: [
        { id: "n0", label: "左乙拉西坦", role: "drug" },
        { id: "n1", label: "SV2A 蛋白", role: "target" },
        { id: "n2", label: "可能调节囊泡功能", role: "signal" },
        { id: "n3", label: "可能参与抗发作", role: "signal" },
        { id: "n4", label: "相应癫痫发作减少", role: "effect" },
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
        title: "DailyMed：KEPPRA（左乙拉西坦）口服制剂说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=3ca9df05-a506-4ec8-a4fe-320f1219ab21",
        sections: "第 1、2.5、5、6、12.1 节：发作类型与年龄范围、SV2A 证据及机制未明、行为异常和肾功能调整。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
  {
    id: "duloxetine",
    genericName: "度洛西汀",
    brandNames: [],
    englishName: "Duloxetine",
    category: "nervous",
    target: "抑制 5-HT 与去甲肾上腺素再摄取（SNRI），增强中枢单胺信号",
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
        title: "抑制 5-HT 与去甲肾上腺素再摄取",
        detail: "对两种递质的神经元再摄取具有抑制作用，并非单胺氧化酶抑制剂。",
      },
      {
        title: "增强中枢单胺递质活动",
        detail: "再摄取减少有助于增强 5-HT 和去甲肾上腺素相关传递。",
      },
      {
        title: "可能调节情绪与疼痛通路",
        detail: "其抗抑郁、抗焦虑和中枢疼痛抑制效应被认为与上述活动有关；人体精确机制尚未明确。",
      },
      {
        title: "改善相应情绪或疼痛症状",
        detail: "适用于相应抑郁、焦虑及神经病理性疼痛情境，不以抑制环氧合酶或激动阿片受体为主要机制。",
      },
    ],
    indications: [
      "成人重性抑郁障碍",
      "成人广泛性焦虑障碍",
      "成人糖尿病周围神经病理性疼痛（按所引 CYMBALTA 制剂范围）",
    ],
    adverseReactions: [
      "恶心、口干、嗜睡、便秘或多汗",
      "血清素综合征风险；与 MAOI 合用禁忌，转换需遵守间隔要求",
      "肝损伤、血压升高或体位性低血压；慢性肝病或大量饮酒者应避免",
      "年轻患者需特别监测自杀意念与行为；各年龄均需观察情绪恶化",
      "突然停用可出现停药症状，应按方案逐渐调整",
    ],
    memoryTip: "「度洛双回收：5-HT 加 NE」——既有情绪适应症，也有特定疼痛适应症，不能把止痛等同于消炎。",
    diagram: {
      title: "双再摄取抑制：临床作用链仍有未明环节",
      nodes: [
        { id: "n0", label: "度洛西汀", role: "drug" },
        { id: "n1", label: "5-HT / NE 再摄取", role: "target" },
        { id: "n2", label: "中枢单胺活动 ↑", role: "signal" },
        { id: "n3", label: "可能调节情绪与痛觉", role: "signal" },
        { id: "n4", label: "相应症状改善", role: "effect" },
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
        title: "DailyMed：CYMBALTA（度洛西汀）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2f7d4d67-10c1-4bf4-a7f2-c185fbad64ba",
        sections: "黑框警告与第 1、4～6、12.1～12.2 节：抑郁、焦虑、糖尿病神经痛、SNRI 机制及关键风险。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
  {
    id: "pregabalin",
    genericName: "普瑞巴林",
    brandNames: [],
    englishName: "Pregabalin",
    category: "nervous",
    target: "结合电压门控钙通道的 α2δ 辅助亚基；可能参与镇痛与抗发作作用，完整机制尚未明确",
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
        title: "结合钙通道 α2δ 辅助亚基",
        detail: "与中枢神经系统电压门控钙通道的 α2δ 位点高亲和结合；不是直接激动 GABA 受体。",
      },
      {
        title: "可能影响钙通道转运或钙电流",
        detail: "动物研究提示其可能改变含 α2δ 通道的转运及钙相关活动，不能直接等同于人体完整机制。",
      },
      {
        title: "可能减少促伤害性递质释放",
        detail: "神经损伤动物模型中可减少钙依赖的相关递质释放，为镇痛作用提供线索。",
      },
      {
        title: "改善相应神经痛或发作",
        detail: "用于所引制剂限定的神经病理性疼痛等情境及局灶性发作辅助治疗，精确临床作用机制尚未完全阐明。",
      },
    ],
    indications: [
      "成人糖尿病周围神经病理性疼痛",
      "成人带状疱疹后神经痛",
      "局灶性起始发作的辅助治疗（按适龄剂型和方案）",
    ],
    adverseReactions: [
      "头晕、嗜睡、视物模糊或注意力下降",
      "外周水肿、体重增加",
      "与中枢抑制药联用或存在呼吸功能受损时，呼吸抑制风险增加",
      "血管性水肿及过敏反应；需关注情绪和自杀意念变化",
      "骤停可能诱发戒断或发作增加；肾功能减退需调整，停药需逐渐进行",
    ],
    memoryTip: "「普瑞认 α2δ，不直接激动 GABA」——留意嗜睡、水肿、肾功能与联用镇静药的呼吸风险。",
    diagram: {
      title: "α2δ 结合线索：完整临床机制未明",
      nodes: [
        { id: "n0", label: "普瑞巴林", role: "drug" },
        { id: "n1", label: "钙通道 α2δ 亚基", role: "target" },
        { id: "n2", label: "可能调节钙相关活动", role: "signal" },
        { id: "n3", label: "可能减少相关递质释放", role: "signal" },
        { id: "n4", label: "相应神经痛或发作改善", role: "effect" },
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
        title: "DailyMed：LYRICA（普瑞巴林）口服制剂说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=d4734e7d-5079-455e-8ff5-8f4539c998a9",
        sections: "第 1、2.7、5～6、12.1 节：神经痛与发作范围、α2δ 证据及未明机制、呼吸抑制和停药风险。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
  {
    id: "escitalopram",
    genericName: "艾司西酞普兰",
    brandNames: [],
    englishName: "Escitalopram",
    category: "nervous",
    target: "选择性抑制 5-HT 再摄取，增强血清素相关神经传递（SSRI）",
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
        title: "结合并抑制 5-HT 转运体",
        detail: "对血清素再摄取位点具有高亲和力，属于选择性血清素再摄取抑制剂。",
      },
      {
        title: "减少血清素再摄取",
        detail: "减弱递质被突触前神经元回收的过程。",
      },
      {
        title: "增强血清素相关传递",
        detail: "这种传递变化被认为是其药理和临床效应的重要基础；不是直接激动血清素受体。",
      },
      {
        title: "逐渐改善相应抑郁或焦虑症状",
        detail: "临床疗效通常需持续治疗后评估，不能把再摄取抑制等同于服后立即改善情绪。",
      },
    ],
    indications: [
      "成人重性抑郁发作",
      "成人广泛性焦虑障碍",
      "成人惊恐障碍或强迫症（按所引英国标签范围）",
    ],
    adverseReactions: [
      "恶心、头痛、失眠或嗜睡、性功能障碍",
      "血清素综合征；与 MAOI 等药物合用和转换需遵守禁忌及间隔要求",
      "QT 间期延长及心律失常风险；已知 QT 延长或联用相关药物者需核对禁忌",
      "需监测情绪恶化、自杀意念及行为变化，特别是年轻患者和治疗调整期",
      "突然停用可能发生停药症状，应按方案逐渐减量",
    ],
    memoryTip: "「艾司专管 5-HT 回收」——起效需时间，记住 QT、血清素综合征与渐停。",
    diagram: {
      title: "5-HT 再摄取抑制 → 相关传递增强",
      nodes: [
        { id: "n0", label: "艾司西酞普兰", role: "drug" },
        { id: "n1", label: "5-HT 转运体", role: "target" },
        { id: "n2", label: "5-HT 再摄取 ↓", role: "signal" },
        { id: "n3", label: "血清素相关传递 ↑", role: "signal" },
        { id: "n4", label: "相应情绪症状改善", role: "effect" },
      ],
      edges: [
        { from: "n0", to: "n1", label: "抑制", kind: "inhibit" },
        { from: "n1", to: "n2", kind: "flow", label: "受抑后" },
        { from: "n2", to: "n3", kind: "flow", label: "后续变化" },
        { from: "n3", to: "n4", kind: "flow", label: "治疗联系未完全阐明" },
      ],
    },
    sources: [
      {
        title: "emc：Escitalopram 片产品说明书",
        url: "https://www.medicines.org.uk/emc/product/15007/smpc",
        sections: "第 4.1～4.5、4.8、5.1 节：成人抑郁与焦虑相关适应症、SSRI 机制、QT 与停药风险。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
];
