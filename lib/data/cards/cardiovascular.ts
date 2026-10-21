import type { DrugCard } from "@/lib/types";

/**
 * 心血管系统 · 24 张卡片
 *
 * 条目按所列说明书与指南整理。机制为教学简化；并行作用及未明机制不能强排为时间顺序。
 *
 * 五条主线：降压（美托洛尔、氨氯地平、氯沙坦、卡托普利、氢氯噻嗪、呋塞米）、
 * 调脂（阿托伐他汀）、抗心绞痛（硝酸甘油）、强心（地高辛）、
 * 抗栓（华法林、氯吡格雷）。
 */
export const cardiovascularCards: readonly DrugCard[] = [
  {
    id: "metoprolol",
    genericName: "美托洛尔",
    brandNames: [
      "倍他乐克",
    ],
    englishName: "Metoprolol",
    category: "cardiovascular",
    target: "相对选择性阻断 β1 肾上腺素受体",
    mechanismSteps: [
      {
        title: "阻断 β1 受体",
        detail: "美托洛尔拮抗儿茶酚胺的 β1 受体作用；选择性是相对的，高暴露时也可影响 β2 受体。药物可进入中枢，不能记成不透过血脑屏障。",
      },
      {
        title: "减弱心脏交感反应",
        detail: "心脏 β1 受体相关的 cAMP 信号减弱，使儿茶酚胺引起的心率、收缩力和房室结传导增加受到限制。",
      },
      {
        title: "降低心肌耗氧",
        detail: "心率和收缩反应下降可减轻心肌耗氧，解释其抗心绞痛作用；过度抑制也可引起心动过缓或心功能恶化。",
      },
      {
        title: "并行影响肾素释放",
        detail: "肾脏 β1 受体阻断可减少肾素释放，也是降压的相关环节。它与心脏作用并行，不是耗氧下降之后才发生。",
      },
    ],
    indications: [
      "高血压",
      "慢性稳定型心绞痛",
      "所引酒石酸盐制剂用于特定稳定患者的心肌梗死治疗；心衰用途需另核对琥珀酸盐缓释制剂",
    ],
    adverseReactions: [
      "心动过缓、房室传导阻滞或心功能恶化",
      "选择性有限，仍可能发生支气管痉挛",
      "可掩盖低血糖的心动过速等警示表现",
      "骤停可能加重心绞痛，需按医嘱调整",
    ],
    memoryTip: "β1 阻断使心脏反应减弱；选择性和心衰用途都要看条件。",
    diagram: {
      title: "美托洛尔：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "美托洛尔", role: "drug" },
        { id: "s0", label: "β1 受体被阻断", role: "target" },
        { id: "s1", label: "儿茶酚胺心脏效应减弱", role: "signal" },
        { id: "s2", label: "心率与收缩反应下降", role: "signal" },
        { id: "s3", label: "心肌耗氧减少", role: "effect" },
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
        "β1 受体被阻断",
        "儿茶酚胺心脏效应减弱",
        "心率与收缩反应下降",
        "心肌耗氧减少",
      ],
      explanation: "本题选取的上游到下游主线：β1 受体被阻断 → 儿茶酚胺心脏效应减弱 → 心率与收缩反应下降 → 心肌耗氧减少。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "美托洛尔说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c0e147a8-36a6-1e61-e053-2a95a90afd62",
        sections: "4、5.1、6.1、12.1、12.2 节：β1 选择性、心率与传导、降压机制及停药风险。",
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
    id: "amlodipine",
    genericName: "氨氯地平",
    brandNames: [
      "络活喜",
    ],
    englishName: "Amlodipine",
    category: "cardiovascular",
    target: "抑制血管平滑肌 L 型钙通道介导的钙内流",
    mechanismSteps: [
      {
        title: "作用于 L 型钙通道",
        detail: "氨氯地平是二氢吡啶类钙通道阻滞药，对血管平滑肌的作用强于心肌。",
      },
      {
        title: "减少平滑肌钙内流",
        detail: "跨膜钙内流减少，钙依赖的收缩过程受到抑制。不能将阻滞通道理解为降低血清钙浓度。",
      },
      {
        title: "小动脉舒张",
        detail: "外周小动脉张力下降、外周阻力降低，使血压下降；扩血管也可引起踝部水肿。",
      },
      {
        title: "减轻心绞痛相关负荷",
        detail: "降低后负荷可减少心肌耗氧，也可缓解冠状动脉痉挛。口服达峰约 6～12 小时，生物利用度约 64%～90%，不用于即时解除急性胸痛。",
      },
    ],
    indications: [
      "高血压",
      "慢性稳定型心绞痛",
      "血管痉挛性心绞痛",
    ],
    adverseReactions: [
      "外周水肿，常表现为踝部水肿",
      "头痛、面部潮红、头晕",
      "心悸或低血压",
      "少见牙龈增生",
    ],
    memoryTip: "血管钙内流减少，阻力随之下降；降压平稳不等于急救起效。",
    diagram: {
      title: "氨氯地平：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "氨氯地平", role: "drug" },
        { id: "s0", label: "L 型钙通道受抑", role: "target" },
        { id: "s1", label: "平滑肌钙内流减少", role: "signal" },
        { id: "s2", label: "小动脉舒张", role: "signal" },
        { id: "s3", label: "外周阻力下降", role: "effect" },
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
        "L 型钙通道受抑",
        "平滑肌钙内流减少",
        "小动脉舒张",
        "外周阻力下降",
      ],
      explanation: "本题选取的上游到下游主线：L 型钙通道受抑 → 平滑肌钙内流减少 → 小动脉舒张 → 外周阻力下降。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "氨氯地平说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=6e9a6c82-9f25-4c71-b09a-929bd5d7b1cf",
        sections: "临床药理与不良反应章节：钙通道、血管舒张、心脏电生理及水肿等风险。",
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
    id: "losartan",
    genericName: "氯沙坦",
    brandNames: [
      "科素亚",
    ],
    englishName: "Losartan",
    category: "cardiovascular",
    target: "氯沙坦及活性代谢物阻断血管紧张素 II 的 AT1 受体",
    mechanismSteps: [
      {
        title: "原药与代谢物共同发挥作用",
        detail: "氯沙坦本身有活性，肝代谢形成的羧酸代谢物也有活性。约 33% 指口服全身生物利用度，不能写成只有 33% 被吸收。",
      },
      {
        title: "阻断 AT1 受体",
        detail: "两者抑制血管紧张素 II 的 AT1 受体效应，而不是抑制 ACE；原药与代谢物的受体结合特征不宜都概括为竞争性。",
      },
      {
        title: "减弱血管收缩及醛固酮效应",
        detail: "血管收缩和醛固酮分泌刺激减弱，有助于降压；肾功能变化和高钾风险需随访。",
      },
      {
        title: "区分反馈与缓激肽",
        detail: "AT1 阻断可因负反馈解除而使肾素及血管紧张素 II 水平上升；不直接抑制 ACE 对缓激肽的降解。",
      },
    ],
    indications: [
      "高血压",
      "伴高血压、蛋白尿等符合说明书条件的 2 型糖尿病肾病",
    ],
    adverseReactions: [
      "高钾血症",
      "低血压，容量不足时风险增加",
      "肾功能恶化，肾动脉狭窄等患者需特别评估",
      "胎儿毒性；妊娠期禁用",
      "少见血管性水肿",
    ],
    memoryTip: "ARB 堵住 AT1；血管紧张素 II 水平不一定下降。",
    diagram: {
      title: "氯沙坦：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "氯沙坦", role: "drug" },
        { id: "s0", label: "AT1 受体被阻断", role: "target" },
        { id: "s1", label: "血管紧张素 II 收缩效应减弱", role: "signal" },
        { id: "s2", label: "血管张力下降", role: "signal" },
        { id: "s3", label: "血压下降", role: "effect" },
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
        "AT1 受体被阻断",
        "血管紧张素 II 收缩效应减弱",
        "血管张力下降",
        "血压下降",
      ],
      explanation: "本题选取的上游到下游主线：AT1 受体被阻断 → 血管紧张素 II 收缩效应减弱 → 血管张力下降 → 血压下降。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "氯沙坦说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a959c71b-d658-4871-b303-073234b9fa84",
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
    id: "hydrochlorothiazide",
    genericName: "氢氯噻嗪",
    brandNames: [
      "双氢克尿噻",
    ],
    englishName: "Hydrochlorothiazide",
    category: "cardiovascular",
    target: "抑制远曲小管 Na+/Cl− 同向转运体（NCC）",
    mechanismSteps: [
      {
        title: "到达肾小管作用部位",
        detail: "氢氯噻嗪主要以原形经肾排泄，在远曲小管管腔侧抑制钠氯重吸收；不能将肾脏递送仅归因于肾小球滤过。",
      },
      {
        title: "抑制 NCC",
        detail: "远曲小管的 Na+/Cl− 同向转运受抑，钠和氯的重吸收减少。",
      },
      {
        title: "增加钠水排出",
        detail: "钠排出带动水排出，起始阶段降低细胞外液量；后续降压还涉及外周阻力变化，完整机制并未完全阐明。",
      },
      {
        title: "注意电解质与代谢影响",
        detail: "远端钠递送增加等因素可促进钾丢失；还可发生低钠、高尿酸和血糖变化，不能将所有不良反应归为单一机制。",
      },
    ],
    indications: [
      "高血压",
      "心衰、肝硬化或某些肾脏疾病相关水肿的辅助治疗",
    ],
    adverseReactions: [
      "低钾、低钠及容量不足",
      "高尿酸血症或痛风发作",
      "血糖升高",
      "光敏反应；长期暴露的皮肤风险需按说明书关注",
    ],
    memoryTip: "噻嗪抑制远曲小管 NCC，降压同时要监测钠、钾和代谢变化。",
    diagram: {
      title: "氢氯噻嗪：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "氢氯噻嗪", role: "drug" },
        { id: "s0", label: "NCC 受抑", role: "target" },
        { id: "s1", label: "钠氯重吸收减少", role: "signal" },
        { id: "s2", label: "尿钠排出增加", role: "signal" },
        { id: "s3", label: "水排出增加", role: "effect" },
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
        "NCC 受抑",
        "钠氯重吸收减少",
        "尿钠排出增加",
        "水排出增加",
      ],
      explanation: "本题选取的上游到下游主线：NCC 受抑 → 钠氯重吸收减少 → 尿钠排出增加 → 水排出增加。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "氢氯噻嗪说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=31a3d1cb-0f52-4818-965d-7584374bb23e",
        sections: "药理、适应症、警告与不良反应（剂型与适用范围见正文）",
      },
      {
        title: "氢氯噻嗪成分说明 · emc",
        url: "https://www.medicines.org.uk/emc/product/100496/smpc",
        sections: "缬沙坦/氢氯噻嗪复方的 4.4、5.1 节：仅引用氢氯噻嗪的远曲小管、NCC 及尿钙作用。",
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
    id: "atorvastatin",
    genericName: "阿托伐他汀",
    brandNames: [
      "立普妥",
    ],
    englishName: "Atorvastatin",
    category: "cardiovascular",
    target: "竞争性抑制 HMG-CoA 还原酶",
    mechanismSteps: [
      {
        title: "抑制胆固醇合成限速酶",
        detail: "阿托伐他汀抑制 HMG-CoA 还原酶，减少甲羟戊酸生成。",
      },
      {
        title: "降低肝内胆固醇合成",
        detail: "肝细胞内胆固醇供应减少，触发调节反应。",
      },
      {
        title: "增加肝细胞 LDL 受体",
        detail: "细胞表面 LDL 受体数量增加，促进循环 LDL 的摄取与分解。",
      },
      {
        title: "降低 LDL 胆固醇",
        detail: "降脂幅度取决于剂量与个体情况；特定人群可减少心血管事件，但需逐人权衡获益、风险和相互作用。",
      },
    ],
    indications: [
      "原发性高胆固醇血症、混合型血脂异常",
      "符合风险条件人群的心血管事件预防",
    ],
    adverseReactions: [
      "肌痛、肌病，罕见横纹肌溶解",
      "肝酶升高及少见严重肝损伤",
      "血糖或糖化血红蛋白升高",
      "与某些 CYP3A4 抑制剂等合用可增加肌毒性风险",
    ],
    memoryTip: "抑制合成、增加 LDL 清除；肌毒性不能简单归因于辅酶 Q10 缺乏。",
    diagram: {
      title: "阿托伐他汀：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "阿托伐他汀", role: "drug" },
        { id: "s0", label: "HMG-CoA 还原酶受抑", role: "target" },
        { id: "s1", label: "肝内胆固醇合成减少", role: "signal" },
        { id: "s2", label: "LDL 受体增加", role: "signal" },
        { id: "s3", label: "血液 LDL 清除增加", role: "effect" },
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
        "HMG-CoA 还原酶受抑",
        "肝内胆固醇合成减少",
        "LDL 受体增加",
        "血液 LDL 清除增加",
      ],
      explanation: "本题选取的上游到下游主线：HMG-CoA 还原酶受抑 → 肝内胆固醇合成减少 → LDL 受体增加 → 血液 LDL 清除增加。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "阿托伐他汀 LIPITOR 说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a60cc18b-0631-4cf0-b021-9f52224ece65",
        sections: "1、5.1～5.3、7、12.1、12.2 节：调脂用途、HMG-CoA 还原酶、LDL 及肌肉与肝脏风险。",
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
    id: "furosemide",
    genericName: "呋塞米",
    brandNames: [
      "速尿",
    ],
    englishName: "Furosemide",
    category: "cardiovascular",
    target: "抑制髓袢升支粗段 Na+/K+/2Cl− 同向转运体（NKCC2）",
    mechanismSteps: [
      {
        title: "到达髓袢管腔侧",
        detail: "呋塞米经肾小管分泌到达管腔，在髓袢升支粗段发挥主要作用。",
      },
      {
        title: "抑制 NKCC2",
        detail: "钠、钾、氯的共同转运受抑，减少该段钠氯重吸收，并影响髓质渗透梯度。",
      },
      {
        title: "产生较强利尿作用",
        detail: "钠和水的排出增加，可缓解容量超负荷；钙、镁排出也可增加。",
      },
      {
        title: "区分利尿与肾功能恢复",
        detail: "尿量增加不等于急性肾损伤得到逆转。KDIGO 不建议用利尿剂预防或治疗 AKI 本身，容量超负荷处理除外。",
      },
    ],
    indications: [
      "心衰、肝硬化或肾脏疾病相关水肿",
      "伴容量超负荷的肺水肿等情境；急性处理需核对注射制剂与整体方案",
    ],
    adverseReactions: [
      "低钾、低钠、低镁及容量不足",
      "低血压和肾前性肾功能恶化",
      "耳毒性，快速静脉给药或合并耳毒性药物时风险增加",
      "高尿酸血症和代谢性碱中毒",
    ],
    memoryTip: "袢利尿排钠排水；尿量上升不等于肾损伤治愈。",
    diagram: {
      title: "呋塞米：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "呋塞米", role: "drug" },
        { id: "s0", label: "NKCC2 受抑", role: "target" },
        { id: "s1", label: "髓袢钠氯重吸收减少", role: "signal" },
        { id: "s2", label: "尿钠排出增加", role: "signal" },
        { id: "s3", label: "水排出增加", role: "effect" },
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
        "NKCC2 受抑",
        "髓袢钠氯重吸收减少",
        "尿钠排出增加",
        "水排出增加",
      ],
      explanation: "本题选取的上游到下游主线：NKCC2 受抑 → 髓袢钠氯重吸收减少 → 尿钠排出增加 → 水排出增加。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "呋塞米说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=48d8f490-e9d1-4c95-ab2f-414d3f4a9df4",
        sections: "药理、适应症、警告与不良反应（剂型与适用范围见正文）",
      },
      {
        title: "KDIGO · AKI 指南（2012 正式版）",
        url: "https://kdigo.org/wp-content/uploads/2016/10/KDIGO-2012-AKI-Guideline-English.pdf",
        sections: "3.4.1–3.4.2：利尿剂不用于预防或治疗 AKI 本身，容量超负荷除外；非 2026 征求意见稿",
      },
      {
        title: "呋塞米说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/12129/smpc",
        sections: "4.4、4.8、5.1 节：电解质风险、作用部位、NKCC2 与钙镁排泄。",
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
    id: "nitroglycerin",
    genericName: "硝酸甘油",
    brandNames: [],
    englishName: "Nitroglycerin",
    category: "cardiovascular",
    target: "经生物转化产生 NO 相关信号，激活可溶性鸟苷酸环化酶",
    mechanismSteps: [
      {
        title: "生物转化产生 NO 相关活性",
        detail: "硝酸甘油在组织内经生物转化产生 NO 相关活性，并非直接阻断钙通道。",
      },
      {
        title: "增加 cGMP",
        detail: "NO 激活可溶性鸟苷酸环化酶，使平滑肌内 cGMP 增加。",
      },
      {
        title: "血管平滑肌舒张",
        detail: "相关信号促进肌球蛋白轻链去磷酸化，降低收缩张力；通常静脉扩张作用较明显。",
      },
      {
        title: "降低心脏前负荷",
        detail: "静脉回流及心室充盈压力下降可减少心肌耗氧，也有利于心内膜下灌注条件；冠脉扩张亦参与抗心绞痛。",
      },
    ],
    indications: [
      "冠心病心绞痛急性发作的缓解（舌下制剂）",
      "诱发活动前短期预防心绞痛（舌下制剂）",
    ],
    adverseReactions: [
      "头痛、潮红",
      "低血压、头晕或晕厥",
      "反射性心动过速；持续暴露可产生耐受",
      "禁止与 PDE5 抑制剂或利奥西呱合用，以免严重低血压",
    ],
    memoryTip: "NO—cGMP—舒张静脉—降低前负荷；注意严重低血压的联用禁忌。",
    diagram: {
      title: "硝酸甘油：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "硝酸甘油", role: "drug" },
        { id: "s0", label: "NO 相关信号增加", role: "signal" },
        { id: "s1", label: "鸟苷酸环化酶激活", role: "signal" },
        { id: "s2", label: "cGMP 增加", role: "signal" },
        { id: "s3", label: "血管平滑肌舒张", role: "effect" },
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
        "NO 相关信号增加",
        "鸟苷酸环化酶激活",
        "cGMP 增加",
        "血管平滑肌舒张",
      ],
      explanation: "本题选取的上游到下游主线：NO 相关信号增加 → 鸟苷酸环化酶激活 → cGMP 增加 → 血管平滑肌舒张。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "硝酸甘油舌下片 NITROSTAT 说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f7059ff7-bf74-48b4-811d-6eb1c26bfd8b",
        sections: "1、4.1、5.2、12.1～12.3 节：舌下剂型、NO—cGMP、前负荷、心率及合用禁忌。",
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
    id: "digoxin",
    genericName: "地高辛",
    brandNames: [],
    englishName: "Digoxin",
    category: "cardiovascular",
    target: "抑制细胞膜 Na+/K+-ATP 酶",
    mechanismSteps: [
      {
        title: "抑制钠钾泵",
        detail: "地高辛抑制 Na+/K+-ATP 酶，使心肌细胞内钠浓度增加。",
      },
      {
        title: "减少钙外排",
        detail: "钠梯度减小影响 Na+/Ca2+ 交换，增加细胞内及肌浆网可利用的钙。",
      },
      {
        title: "增强心肌收缩",
        detail: "收缩时可利用的钙增加产生正性肌力作用；治疗窗窄，过量可致多种心律失常。",
      },
      {
        title: "并行影响房室结传导",
        detail: "自主神经作用、包括迷走活动增强，可减慢房室结传导，用于特定房颤患者的心室率控制；不是所有室上速的通用药。",
      },
    ],
    indications: [
      "部分心力衰竭患者的症状治疗；不能据此宣称降低死亡率",
      "成人慢性房颤的静息心室率控制",
    ],
    adverseReactions: [
      "恶心、呕吐、食欲下降",
      "视觉异常、意识或精神症状",
      "心动过缓、房室传导阻滞及室性心律失常",
      "肾功能下降、电解质紊乱及相互作用可增加中毒风险",
    ],
    memoryTip: "抑制钠钾泵增强收缩；控心室率是并行作用，治疗窗窄。",
    diagram: {
      title: "地高辛：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "地高辛", role: "drug" },
        { id: "s0", label: "Na+/K+-ATP 酶受抑", role: "target" },
        { id: "s1", label: "细胞内钠增加", role: "signal" },
        { id: "s2", label: "钙外排减少、可用钙增加", role: "signal" },
        { id: "s3", label: "心肌收缩力增强", role: "effect" },
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
        "Na+/K+-ATP 酶受抑",
        "细胞内钠增加",
        "钙外排减少、可用钙增加",
        "心肌收缩力增强",
      ],
      explanation: "本题选取的上游到下游主线：Na+/K+-ATP 酶受抑 → 细胞内钠增加 → 钙外排减少、可用钙增加 → 心肌收缩力增强。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "地高辛口服片说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=dfac7f13-28be-423d-9389-9089da29da17",
        sections: "2、5.2、5.3、8.6、12.1～12.3 节：钠钾泵、正性肌力、传导、肾排泄及毒性监测。",
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
    id: "captopril",
    genericName: "卡托普利",
    brandNames: [
      "开博通",
    ],
    englishName: "Captopril",
    category: "cardiovascular",
    target: "抑制血管紧张素转化酶（ACE，亦称激肽酶 II）",
    mechanismSteps: [
      {
        title: "抑制 ACE",
        detail: "卡托普利含巯基，可抑制 ACE，减少血管紧张素 I 向 II 的转化；含巯基不是它在全部 ACEI 中独有的特征。",
      },
      {
        title: "减少血管紧张素 II 效应",
        detail: "血管收缩刺激和醛固酮分泌刺激减弱，有助于降低血压。",
      },
      {
        title: "减少缓激肽降解",
        detail: "ACE 同时参与缓激肽降解，抑制后可增加相关信号；干咳及血管性水肿与此有关，但不是人人发生。",
      },
      {
        title: "结合临床状态理解作用",
        detail: "降压与心衰、梗死后用途需结合具体条件；肾功能和血钾需监测，不能把肾保护理解为没有肾脏风险。",
      },
    ],
    indications: [
      "高血压",
      "心力衰竭",
      "特定心肌梗死后左室功能障碍患者及符合条件的糖尿病肾病",
    ],
    adverseReactions: [
      "干咳",
      "高钾、低血压及肾功能恶化",
      "血管性水肿，可危及气道",
      "皮疹、味觉改变；少见粒细胞减少",
      "胎儿毒性，妊娠期禁用",
    ],
    memoryTip: "ACE 同时涉及 Ang II 与缓激肽；降压和干咳需分清。",
    diagram: {
      title: "卡托普利：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "卡托普利", role: "drug" },
        { id: "s0", label: "ACE 受抑", role: "target" },
        { id: "s1", label: "血管紧张素 II 生成减少", role: "signal" },
        { id: "s2", label: "血管收缩刺激减弱", role: "signal" },
        { id: "s3", label: "血压下降", role: "effect" },
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
        "ACE 受抑",
        "血管紧张素 II 生成减少",
        "血管收缩刺激减弱",
        "血压下降",
      ],
      explanation: "本题选取的上游到下游主线：ACE 受抑 → 血管紧张素 II 生成减少 → 血管收缩刺激减弱 → 血压下降。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "卡托普利说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1395ba5b-2fc9-41ff-9c43-e0740d781dee",
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
    id: "warfarin",
    genericName: "华法林",
    brandNames: [],
    englishName: "Warfarin",
    category: "cardiovascular",
    target: "抑制维生素 K 环氧化物还原酶复合体（VKORC1）",
    mechanismSteps: [
      {
        title: "抑制维生素 K 再循环",
        detail: "华法林减少还原型维生素 K 的再生，干扰维生素 K 依赖蛋白的活化。",
      },
      {
        title: "减少功能性凝血因子形成",
        detail: "凝血因子 II、VII、IX、X 的 γ-羧化受影响，蛋白 C、S 也受影响；不是直接溶解已有血栓。",
      },
      {
        title: "等待既有因子清除",
        detail: "已有活性因子逐渐代谢后抗凝效应才充分显现。急性静脉血栓使用华法林时的起始联合方案需按规范实施。",
      },
      {
        title: "依据 INR 与风险调整",
        detail: "需要 INR 监测并关注饮食、疾病和相互作用；维生素 K 摄入重在相对稳定。术前停药或桥接须个体评估，不能一律桥接。",
      },
    ],
    indications: [
      "静脉血栓栓塞的治疗与预防",
      "符合抗凝指征的房颤及机械心脏瓣膜相关血栓栓塞预防",
    ],
    adverseReactions: [
      "出血，包括消化道和颅内出血",
      "少见皮肤坏死及紫趾综合征",
      "妊娠期有胚胎毒性和出血风险；机械瓣膜等特殊情境须专科权衡",
      "多种食物、药物和疾病变化可改变抗凝强度",
    ],
    memoryTip: "华法林影响新生成因子的功能，起效慢、需监测 INR；桥接不是固定动作。",
    diagram: {
      title: "华法林：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "华法林", role: "drug" },
        { id: "s0", label: "VKORC1 受抑", role: "target" },
        { id: "s1", label: "还原型维生素 K 再生减少", role: "signal" },
        { id: "s2", label: "凝血因子有效羧化减少", role: "signal" },
        { id: "s3", label: "功能性凝血因子减少", role: "effect" },
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
        "VKORC1 受抑",
        "还原型维生素 K 再生减少",
        "凝血因子有效羧化减少",
        "功能性凝血因子减少",
      ],
      explanation: "本题选取的上游到下游主线：VKORC1 受抑 → 还原型维生素 K 再生减少 → 凝血因子有效羧化减少 → 功能性凝血因子减少。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "华法林说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=cdbbc317-35d3-42ba-94f0-c83891358529",
        sections: "药理、适应症、警告与不良反应（剂型与适用范围见正文）",
      },
      {
        title: "CHEST · 围手术期抗栓指南（2022）",
        url: "https://www.chestnet.org/guidelines-and-topic-collections/guidelines/pulmonary-vascular/perioperative-management-of-antithrombotic-therapy",
        sections: "关键建议：中断 VKA 时的桥接评估",
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
    id: "clopidogrel",
    genericName: "氯吡格雷",
    brandNames: [
      "波立维",
    ],
    englishName: "Clopidogrel",
    category: "cardiovascular",
    target: "活性代谢物不可逆抑制血小板 ADP 的 P2Y12 受体",
    mechanismSteps: [
      {
        title: "肝代谢形成活性物",
        detail: "氯吡格雷是前药，经包括 CYP2C19 在内的酶转化；遗传差异与相互作用可改变活性物暴露。",
      },
      {
        title: "不可逆抑制 P2Y12",
        detail: "活性代谢物抑制血小板 ADP 的 P2Y12 受体介导信号。",
      },
      {
        title: "减少血小板活化与聚集",
        detail: "下游糖蛋白 IIb/IIIa 活化受到限制，使血小板聚集减少。",
      },
      {
        title: "作用持续至血小板更新",
        detail: "受影响的血小板功能恢复依赖新血小板生成。是否围手术期停药须权衡出血与支架血栓风险，不能自行套用固定天数。",
      },
    ],
    indications: [
      "急性冠脉综合征等情境的抗血小板治疗",
      "近期心肌梗死、缺血性卒中或确诊外周动脉疾病的事件预防",
    ],
    adverseReactions: [
      "出血",
      "皮疹及过敏反应",
      "罕见血栓性血小板减少性紫癜（TTP）",
      "与奥美拉唑等相互作用可能降低活化，合用方案需评估",
    ],
    memoryTip: "前药活化后阻断 P2Y12；抗血小板治疗不能随意停。",
    diagram: {
      title: "氯吡格雷：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "氯吡格雷", role: "drug" },
        { id: "s0", label: "形成活性代谢物", role: "signal" },
        { id: "s1", label: "P2Y12 受体受抑", role: "signal" },
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
        "形成活性代谢物",
        "P2Y12 受体受抑",
        "血小板活化减弱",
        "血小板聚集减少",
      ],
      explanation: "本题选取的上游到下游主线：形成活性代谢物 → P2Y12 受体受抑 → 血小板活化减弱 → 血小板聚集减少。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "氯吡格雷说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ab32a331-2cea-453b-bba1-5451d38edd73",
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
    id: "spironolactone",
    indicationQuizDistractorIds: [
      "aciclovir",
      "levothyroxine",
      "phenytoin",
    ],
    genericName: "螺内酯",
    brandNames: [],
    englishName: "Spironolactone",
    category: "cardiovascular",
    target: "竞争性拮抗醛固酮受体（盐皮质激素受体），排钠保钾",
    mechanismSteps: [
      {
        title: "拮抗醛固酮受体",
        detail: "螺内酯及活性代谢物竞争性占据肾远端醛固酮作用部位的受体。",
      },
      {
        title: "削弱醛固酮介导的钠钾交换",
        detail: "醛固酮促进钠重吸收、钾排出的效应减弱，肾脏保钠作用随之下降。",
      },
      {
        title: "增加钠和水排出",
        detail: "钠与水排泄增加，有助于减轻水肿及降低血压。",
      },
      {
        title: "水肿减轻、血压下降",
        detail: "钠水潴留减轻产生利尿和降压效应；钾排泄同时减少，因此还需监测血钾。",
      },
    ],
    indications: [
      "射血分数降低的 NYHA Ⅲ～Ⅳ级心力衰竭（所引说明书范围）",
      "高血压的加用治疗、符合说明书条件的水肿",
      "原发性醛固酮增多症",
    ],
    adverseReactions: [
      "高钾血症：肾功能不全、合用补钾或其他升钾药时风险增加",
      "低血压与肾功能恶化：与过度利尿、容量不足有关",
      "男性乳房发育及其他内分泌相关不良反应",
      "低钠血症等水电解质紊乱",
    ],
    memoryTip: "「螺内酯：拦醛固酮，排钠留钾」——记住高钾和男性乳房发育。",
    diagram: {
      title: "醛固酮拮抗：排钠、排水，同时保钾",
      nodes: [
        { id: "n0", label: "螺内酯", role: "drug" },
        { id: "n1", label: "醛固酮受体", role: "target" },
        { id: "n2", label: "钠重吸收 ↓", role: "signal" },
        { id: "n3", label: "排钠排水 ↑", role: "signal" },
        { id: "n4", label: "水肿减轻", role: "effect" },
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
        title: "DailyMed：Spironolactone 片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=c1c5fdab-3ff7-414b-8e25-beed8311b8ad",
        sections: "第 1、5、6、12.1 节：适应症、高钾与内分泌不良反应、醛固酮拮抗机制。",
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
    id: "apixaban",
    indicationQuizDistractorIds: [
      "aciclovir",
      "levothyroxine",
      "phenytoin",
    ],
    genericName: "阿哌沙班",
    brandNames: [],
    englishName: "Apixaban",
    category: "cardiovascular",
    target: "直接选择性抑制凝血因子 Xa，减少凝血酶生成",
    mechanismSteps: [
      {
        title: "直接抑制因子 Xa",
        detail: "阿哌沙班作用于游离及血栓结合的 Xa 因子，发挥作用不需要抗凝血酶参与。",
      },
      {
        title: "削弱凝血酶原酶活性",
        detail: "Xa 因子所在的凝血酶原酶复合物受抑，使凝血酶生成减少。",
      },
      {
        title: "凝血酶生成减少",
        detail: "凝血酶原转变为凝血酶的过程减弱，后续凝血过程受到限制。",
      },
      {
        title: "减少血栓形成",
        detail: "抗凝同时影响正常止血；它不直接抑制血小板聚集，PT、INR 也不能可靠评估其抗凝强度。",
      },
    ],
    indications: [
      "非瓣膜性房颤的卒中与体循环栓塞风险降低",
      "深静脉血栓、肺栓塞的治疗及复发风险降低",
      "髋或膝关节置换术后的深静脉血栓预防",
    ],
    adverseReactions: [
      "出血：可发生消化道、颅内等严重出血",
      "椎管内操作相关血肿：硬膜外或脊髓麻醉、穿刺时需专门评估",
      "过敏反应：包括血管性水肿，虽不常见仍需识别",
      "相互作用：抗血小板药、NSAIDs 或强 CYP3A4/P-gp 抑制剂可增加出血风险",
    ],
    memoryTip: "「沙班拦 Xa，少造凝血酶」——抗凝要记出血风险，不能照搬华法林的 INR 监测方法。",
    diagram: {
      title: "直接抑制 Xa → 凝血酶生成减少",
      nodes: [
        { id: "n0", label: "阿哌沙班", role: "drug" },
        { id: "n1", label: "凝血因子 Xa", role: "target" },
        { id: "n2", label: "凝血酶生成 ↓", role: "signal" },
        { id: "n3", label: "血栓形成 ↓", role: "effect" },
      ],
      edges: [
        { from: "n0", to: "n1", label: "阻断", kind: "inhibit" },
        { from: "n1", to: "n2", kind: "flow", label: "受抑后" },
        { from: "n2", to: "n3", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "DailyMed：ELIQUIS（apixaban）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=a454cd24-0c6d-46e8-b1e4-197388606175",
        sections: "第 1、5、6、7、12.1～12.2 节：抗凝用途、出血和相互作用、Xa 抑制及监测局限。",
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
    id: "ezetimibe",
    indicationQuizDistractorIds: [
      "aciclovir",
      "levothyroxine",
      "phenytoin",
    ],
    genericName: "依折麦布",
    brandNames: [],
    englishName: "Ezetimibe",
    category: "cardiovascular",
    target: "抑制小肠刷状缘 NPC1L1 介导的胆固醇吸收",
    mechanismSteps: [
      {
        title: "作用于小肠 NPC1L1",
        detail: "依折麦布抑制肠道胆固醇及植物甾醇摄取所涉及的 NPC1L1 转运蛋白。",
      },
      {
        title: "减少肠源胆固醇入肝",
        detail: "小肠刷状缘吸收受限，进入肝脏的胆固醇减少，肝胆固醇储备下降。",
      },
      {
        title: "增加肝 LDL 受体",
        detail: "肝胆固醇储备下降，促使肝脏增加 LDL 受体。",
      },
      {
        title: "增强血液 LDL 清除",
        detail: "受体增加使血液中 LDL 胆固醇清除增多。这条吸收途径与他汀抑制合成的作用互补。",
      },
    ],
    indications: [
      "原发性高脂血症：配合饮食，与他汀联用或在其他降 LDL 治疗不适用时单用",
      "纯合子家族性植物甾醇血症（所引说明书范围）",
    ],
    adverseReactions: [
      "腹泻、腹部不适等胃肠道反应",
      "转氨酶升高：与他汀联用时需关注",
      "肌病与横纹肌溶解：已有报告，不能因其不是他汀而忽视肌痛",
      "过敏反应：包括皮疹、血管性水肿",
    ],
    memoryTip: "「依折麦布堵肠门，他汀压合成」——两条途径都能帮助降低 LDL。",
    diagram: {
      title: "肠道少吸收 → 肝脏多清除 LDL",
      nodes: [
        { id: "n0", label: "依折麦布", role: "drug" },
        { id: "n1", label: "NPC1L1", role: "target" },
        { id: "n2", label: "胆固醇吸收 ↓", role: "signal" },
        { id: "n3", label: "肝 LDL 受体 ↑", role: "signal" },
        { id: "n4", label: "血 LDL-C ↓", role: "effect" },
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
        title: "DailyMed：ZETIA（ezetimibe）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=174e45e0-45bb-48b7-9e60-8f6cfc1d22bb",
        sections: "第 1、5、6、12.1 节：降脂用途、肝酶与肌病风险、NPC1L1 机制。",
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
    id: "diltiazem",
    genericName: "地尔硫䓬",
    brandNames: [],
    englishName: "Diltiazem",
    category: "cardiovascular",
    target: "阻滞心肌与血管平滑肌的 L 型钙通道，属于非二氢吡啶类",
    targetQuizDistractorIds: [
      "aciclovir",
      "levothyroxine",
      "metformin",
    ],
    indicationQuizDistractorIds: [
      "aciclovir",
      "levothyroxine",
      "metformin",
    ],
    mechanismSteps: [
      {
        title: "阻滞 L 型钙通道",
        detail: "抑制心肌及血管平滑肌细胞去极化时的钙离子内流。",
      },
      {
        title: "减少细胞钙内流",
        detail: "钙内流减少使血管平滑肌收缩减弱，也影响窦房结和房室结功能。",
      },
      {
        title: "舒张血管并减慢心率",
        detail: "外周阻力下降，心率减慢，房室传导延缓；这些作用可并行发生。",
      },
      {
        title: "降低血压与心肌耗氧",
        detail: "减轻心脏负荷有助于缓解心绞痛。本卡适应症以口服缓释片说明书为范围。",
      },
    ],
    indications: [
      "高血压（口服缓释片）",
      "慢性稳定型心绞痛（口服缓释片）",
    ],
    adverseReactions: [
      "心动过缓、房室传导阻滞：合用 β 受体阻滞剂或洋地黄时风险叠加",
      "外周水肿、头晕及低血压",
      "心室功能受损者可能出现心力衰竭加重",
      "转氨酶升高，少见急性肝损伤或严重皮肤反应",
    ],
    memoryTip: "「地尔硫䓬：血管能舒张，心率也会慢」——与以血管作用为主的二氢吡啶类区分。",
    diagram: {
      title: "钙内流减少 → 血管舒张、心率减慢",
      nodes: [
        { id: "n0", label: "地尔硫䓬", role: "drug" },
        { id: "n1", label: "L 型钙通道", role: "target" },
        { id: "n2", label: "钙内流 ↓", role: "signal" },
        { id: "n3", label: "阻力与心率 ↓", role: "signal" },
        { id: "n4", label: "血压、耗氧 ↓", role: "effect" },
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
        title: "DailyMed：Diltiazem hydrochloride 缓释片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=73b3607a-99d0-44d8-92ef-0074684c9d7d",
        sections: "第 1、4～6、12.1～12.2 节：缓释片用途、传导与心衰风险、钙通道机制。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
  },
  {
    id: "amiodarone",
    genericName: "胺碘酮",
    brandNames: [],
    englishName: "Amiodarone",
    category: "cardiovascular",
    target: "阻滞心肌钾通道、延长复极与不应期，同时具有钠通道、钙通道阻滞及抗交感作用",
    targetQuizDistractorIds: [
      "aciclovir",
      "levothyroxine",
      "metformin",
    ],
    indicationQuizDistractorIds: [
      "aciclovir",
      "levothyroxine",
      "metformin",
    ],
    mechanismSteps: [
      {
        title: "阻滞心肌钾通道",
        detail: "以 Ⅲ 类抗心律失常作用为主，同时还有其他离子通道及抗交感作用。",
      },
      {
        title: "延长动作电位复极",
        detail: "钾通道阻滞参与延长心肌动作电位持续时间。",
      },
      {
        title: "延长心肌不应期",
        detail: "心肌组织再次被激发前所需的恢复时间延长，同时自律性与传导受到影响。",
      },
      {
        title: "抑制严重室性心律失常",
        detail: "用于严格选择的患者；也可能诱发或加重心律失常，起始治疗需监护。",
      },
    ],
    indications: [
      "其他治疗无效或不能耐受的反复、危及生命的心室颤动（所引口服片说明书）",
      "其他治疗无效或不能耐受、伴血流动力学不稳定的反复室性心动过速",
    ],
    adverseReactions: [
      "肺毒性：可出现肺炎或肺纤维化，需关注新发咳嗽、呼吸困难",
      "肝损伤：治疗前及治疗中需监测肝功能",
      "甲状腺功能减退或亢进",
      "心动过缓、QT 延长及心律失常加重",
      "角膜微沉积、视觉异常与光敏反应；药物清除缓慢，相互作用可持续较久",
    ],
    memoryTip: "「胺碘酮拖长复极」——记心律，也记肺、肝、甲状腺。",
    diagram: {
      title: "延长复极与不应期：Ⅲ 类作用主线",
      nodes: [
        { id: "n0", label: "胺碘酮", role: "drug" },
        { id: "n1", label: "心肌钾通道", role: "target" },
        { id: "n2", label: "复极时间 ↑", role: "signal" },
        { id: "n3", label: "不应期延长", role: "signal" },
        { id: "n4", label: "异常节律受抑", role: "effect" },
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
        title: "DailyMed：Amiodarone hydrochloride 片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=f4532f12-3b7a-42ab-9a6c-36fd2a3f192c",
        sections: "黑框警告及第 1、5、7、12.1～12.3 节：口服片适应症、多通道作用与重要器官毒性。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
  },
  {
    id: "adenosine",
    genericName: "腺苷",
    brandNames: [],
    englishName: "Adenosine",
    category: "cardiovascular",
    target: "短暂抑制房室结传导，打断依赖房室结的折返环路",
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
        title: "作用于房室结",
        detail: "静脉注射后迅速影响房室结传导；在血中清除很快，作用短暂。",
      },
      {
        title: "暂时减慢房室传导",
        detail: "传导延缓或短暂阻滞，使冲动难以继续通过房室结。",
      },
      {
        title: "中断房室结参与的折返",
        detail: "当房室结是心动过速折返环路的一部分时，传导中断可终止环路。",
      },
      {
        title: "使相应室上速恢复窦律",
        detail: "用于适合的阵发性室上性心动过速；不能据此认为它能将房颤、房扑或室速转复。",
      },
    ],
    indications: [
      "依赖房室结传导的阵发性室上性心动过速的快速转复（院内静脉用药）",
    ],
    adverseReactions: [
      "潮红、胸部不适、呼吸困难，常短暂出现",
      "心动过缓、房室传导阻滞，少见严重心律失常或心脏停搏",
      "低血压；严重低血压患者禁用",
      "可诱发支气管痉挛；伴支气管痉挛的气道疾病为所引制剂禁忌",
    ],
    memoryTip: "「腺苷让房室结短暂停一下」——只适合相应室上速，须在心电监护和复苏条件下使用。",
    diagram: {
      title: "短暂延缓房室传导 → 中断折返",
      nodes: [
        { id: "n0", label: "腺苷", role: "drug" },
        { id: "n1", label: "房室结传导", role: "target" },
        { id: "n2", label: "传导短暂减慢", role: "signal" },
        { id: "n3", label: "折返环路中断", role: "signal" },
        { id: "n4", label: "相应室上速终止", role: "effect" },
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
        title: "emc：Adenosine 注射液产品说明书",
        url: "https://www.medicines.org.uk/emc/product/4766/smpc",
        sections: "第 4.1～4.4、4.8、5.1～5.2 节：阵发性室上速、监护要求、房室结作用及短效特点。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
  },
  {
    id: "heparin",
    genericName: "普通肝素",
    brandNames: [],
    englishName: "Unfractionated heparin",
    category: "cardiovascular",
    target: "结合抗凝血酶，增强其对凝血因子 Xa 与凝血酶（Ⅱa）的抑制",
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
        title: "结合并增强抗凝血酶作用",
        detail: "普通肝素与抗凝血酶结合，使其更有效地抑制凝血蛋白酶。",
      },
      {
        title: "加快 Xa 与凝血酶失活",
        detail: "同时影响凝血酶的生成与活性，减少凝血级联向下游推进。",
      },
      {
        title: "减少纤维蛋白形成",
        detail: "纤维蛋白原向纤维蛋白的转化受到抑制，血凝块形成减少。",
      },
      {
        title: "防止新血栓及血栓扩展",
        detail: "发挥抗凝作用；本身没有纤溶活性，不能直接溶解已经形成的血栓。",
      },
    ],
    indications: [
      "静脉血栓和肺栓塞的预防与治疗",
      "体外循环及透析过程中的抗凝",
    ],
    adverseReactions: [
      "出血：需按治疗方案监测凝血指标并观察出血表现",
      "肝素诱导的血小板减少症（HIT），可伴严重血栓形成",
      "长期大剂量使用可发生骨质疏松",
      "过敏反应、注射部位刺激；不同浓度与封管制剂混淆可造成严重用药错误",
    ],
    memoryTip: "「肝素借抗凝血酶，压住 Xa 和 Ⅱa」——抗凝防扩展，不是直接溶栓。",
    diagram: {
      title: "增强抗凝血酶 → 同时抑制 Xa 与 Ⅱa",
      nodes: [
        { id: "drug", label: "普通肝素", role: "drug" },
        { id: "at", label: "抗凝血酶", role: "target" },
        { id: "xa", label: "凝血因子 Xa", role: "target" },
        { id: "iia", label: "凝血酶 Ⅱa", role: "target" },
        { id: "fibrin", label: "纤维蛋白形成 ↓", role: "signal" },
        { id: "effect", label: "血栓形成受抑", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "at", label: "增强作用", kind: "activate" },
        { from: "at", to: "xa", label: "抑制", kind: "inhibit" },
        { from: "at", to: "iia", label: "抑制", kind: "inhibit" },
        { from: "xa", to: "fibrin", label: "失活后", kind: "flow" },
        { from: "iia", to: "fibrin", label: "失活后", kind: "flow" },
        { from: "fibrin", to: "effect", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "DailyMed：Heparin sodium 注射液说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=07438e10-1589-4683-9f26-e5494d076cf0",
        sections: "第 1、4～6、12.1 节：静脉血栓与体外循环抗凝、HIT、出血、抗凝血酶机制及无直接纤溶作用。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
  },
  {
    id: "bisoprolol",
    genericName: "比索洛尔",
    brandNames: [],
    englishName: "Bisoprolol",
    category: "cardiovascular",
    target: "选择性阻断 β1 肾上腺素能受体，减弱心脏对交感刺激的反应",
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
        title: "阻断心脏 β1 受体",
        detail: "比索洛尔具有较高 β1 选择性，但选择性并不意味着完全没有支气管或外周血管作用。",
      },
      {
        title: "减慢心率并减弱收缩反应",
        detail: "减弱交感刺激对心脏的作用，减少心率与心脏做功。",
      },
      {
        title: "降低心肌耗氧",
        detail: "心脏负荷与耗氧需求下降，有助于缓解稳定型心绞痛。",
      },
      {
        title: "用于相应慢性心血管疾病",
        detail: "可用于高血压、稳定型心绞痛及稳定的收缩功能减退性慢性心衰；心衰应用需在稳定状态下逐步调整并监测。",
      },
    ],
    indications: [
      "高血压",
      "稳定型心绞痛",
      "稳定的左室收缩功能减退性慢性心力衰竭（联合标准治疗）",
    ],
    adverseReactions: [
      "心动过缓、低血压、头晕或乏力",
      "心衰可在起始或调整阶段加重；急性失代偿心衰不适用",
      "手足发冷；有气道疾病者仍可能出现支气管痉挛",
      "可掩盖低血糖的部分警示症状；缺血性心脏病患者不宜突然停药",
    ],
    memoryTip: "「比索偏 β1，让心脏慢下来」——慢性心衰需稳定后使用，选择性不等于无呼吸风险。",
    diagram: {
      title: "β1 阻断 → 心率与耗氧下降",
      nodes: [
        { id: "n0", label: "比索洛尔", role: "drug" },
        { id: "n1", label: "心脏 β1 受体", role: "target" },
        { id: "n2", label: "心率及做功 ↓", role: "signal" },
        { id: "n3", label: "心肌耗氧 ↓", role: "signal" },
        { id: "n4", label: "稳定型心绞痛缓解", role: "effect" },
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
        title: "emc：Bisoprolol 片产品说明书",
        url: "https://www.medicines.org.uk/emc/product/3090/smpc",
        sections: "第 4.1～4.4、4.8、5.1 节：高血压、稳定型心绞痛与稳定慢性心衰，β1 阻断及用药风险。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
  {
    id: "sacubitril-valsartan",
    genericName: "沙库巴曲缬沙坦",
    brandNames: [],
    englishName: "Sacubitril / valsartan",
    category: "cardiovascular",
    target: "沙库巴曲活性代谢物抑制脑啡肽酶，缬沙坦阻断血管紧张素Ⅱ的 AT1 受体",
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
        title: "沙库巴曲转为活性代谢物",
        detail: "沙库巴曲是前药，转化为 LBQ657 后发挥脑啡肽酶抑制作用。",
      },
      {
        title: "减少利钠肽等底物的降解",
        detail: "脑啡肽酶受抑，使利钠肽等肽类的水平升高，增强相应心血管与肾脏效应。",
      },
      {
        title: "缬沙坦同步阻断 AT1 受体",
        detail: "这是并行的另一条通路：减少血管紧张素Ⅱ经 AT1 引起的作用，包括醛固酮释放。",
      },
      {
        title: "共同改善慢性心衰结局",
        detail: "两条通路共同作用；用于成人慢性心衰降低心血管死亡和心衰住院风险，左室射血分数低于正常者获益最明确。",
      },
    ],
    indications: [
      "成人慢性心力衰竭：降低心血管死亡与心衰住院风险，射血分数低于正常者获益最明确",
    ],
    adverseReactions: [
      "低血压、头晕；需结合容量状态评估",
      "高钾血症、肾功能恶化，需监测血钾和肾功能",
      "血管性水肿；不得与 ACEI 同用，与 ACEI 相互转换需至少间隔 36 小时",
      "胎儿毒性：妊娠应避免；已经含有缬沙坦，不应再叠加其他 ARB",
    ],
    memoryTip: "「一边护住利钠肽，一边挡住 AT1」——ARNI 的两条通路并行；记住 ACEI 转换间隔。",
    diagram: {
      title: "脑啡肽酶抑制 + AT1 阻断的并行通路",
      nodes: [
        { id: "sac", label: "沙库巴曲", role: "drug" },
        { id: "val", label: "缬沙坦", role: "drug" },
        { id: "nep", label: "脑啡肽酶", role: "target" },
        { id: "at1", label: "AT1 受体", role: "target" },
        { id: "np", label: "利钠肽作用 ↑", role: "signal" },
        { id: "raas", label: "血管紧张素效应 ↓", role: "signal" },
        { id: "effect", label: "改善慢性心衰结局", role: "effect" },
      ],
      edges: [
        { from: "sac", to: "nep", label: "经 LBQ657 抑制", kind: "inhibit" },
        { from: "val", to: "at1", label: "阻断", kind: "inhibit" },
        { from: "nep", to: "np", label: "降解减少", kind: "flow" },
        { from: "at1", to: "raas", label: "阻断后", kind: "flow" },
        { from: "np", to: "effect", kind: "flow", label: "后续变化" },
        { from: "raas", to: "effect", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "DailyMed：ENTRESTO（沙库巴曲缬沙坦）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=000dc81d-ab91-450c-8eae-8eb74e72296f",
        sections: "第 1、2.1、4～7、12.1～12.2 节：成人心衰范围、LBQ657 与 AT1 双通路、ACEI 间隔及胎儿毒性。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
  {
    id: "rivaroxaban",
    genericName: "利伐沙班",
    brandNames: [],
    englishName: "Rivaroxaban",
    category: "cardiovascular",
    target: "直接选择性抑制凝血因子 Xa，减少凝血酶生成；不依赖抗凝血酶",
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
        title: "直接抑制凝血因子 Xa",
        detail: "抑制游离 Xa 及凝血酶原酶活性，不需要抗凝血酶作为辅助因子。",
      },
      {
        title: "减少凝血酶生成",
        detail: "凝血酶原向凝血酶的转化减少；其主要靶点是 Xa，而非直接抑制凝血酶。",
      },
      {
        title: "减少纤维蛋白形成",
        detail: "下游凝血反应减弱，使血栓形成与扩展受到抑制。",
      },
      {
        title: "发挥抗凝作用",
        detail: "用于相应血栓栓塞疾病的治疗或预防；抗凝不等于直接溶解现有血栓。",
      },
    ],
    indications: [
      "非瓣膜性房颤患者的卒中和全身性栓塞风险降低",
      "深静脉血栓与肺栓塞的治疗及复发风险降低",
      "髋或膝关节置换术后的静脉血栓预防",
    ],
    adverseReactions: [
      "出血，可严重或致命；活动性病理性出血禁用",
      "出血可伴贫血、头晕或乏力",
      "椎管内麻醉或穿刺相关血肿风险，需专门评估",
      "自行过早停药可增加血栓风险；肾肝功能和强 P-gp/CYP3A 相互作用会影响用药选择",
    ],
    memoryTip: "「利伐直接压 Xa，不借抗凝血酶」——与普通肝素区分，也不能当成溶栓药。",
    diagram: {
      title: "直接抑制 Xa → 凝血酶生成减少",
      nodes: [
        { id: "n0", label: "利伐沙班", role: "drug" },
        { id: "n1", label: "凝血因子 Xa", role: "target" },
        { id: "n2", label: "凝血酶生成 ↓", role: "signal" },
        { id: "n3", label: "纤维蛋白形成 ↓", role: "signal" },
        { id: "n4", label: "血栓形成受抑", role: "effect" },
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
        title: "DailyMed：XARELTO（利伐沙班）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=10db92f9-2300-4a80-836b-673e1ae91610",
        sections: "黑框警告与第 1、4～7、12.1 节：非瓣膜性房颤、静脉血栓、直接 Xa 抑制、出血及停药风险。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
  {
    id: "rosuvastatin",
    genericName: "瑞舒伐他汀",
    brandNames: [],
    englishName: "Rosuvastatin",
    category: "cardiovascular",
    target: "竞争性抑制 HMG-CoA 还原酶，减少肝内胆固醇合成并增加 LDL 受体介导的清除",
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
        title: "抑制 HMG-CoA 还原酶",
        detail: "主要在肝脏抑制胆固醇合成的限速酶，减少 HMG-CoA 向甲羟戊酸转化。",
      },
      {
        title: "减少肝内胆固醇合成",
        detail: "胆固醇合成受到抑制，同时可减少肝脏 VLDL 的生成。",
      },
      {
        title: "增加肝细胞表面 LDL 受体",
        detail: "更多 LDL 受体促进血中 LDL 的摄取与分解代谢。",
      },
      {
        title: "降低 LDL 胆固醇",
        detail: "用于相应血脂异常及高危人群心血管事件预防；不是直接抗凝或立即缓解心绞痛的药物。",
      },
    ],
    indications: [
      "原发性高胆固醇血症或混合型血脂异常（饮食等措施效果不足时）",
      "家族性高胆固醇血症",
      "经评估属高危人群的首次重大心血管事件预防（同时纠正其他危险因素）",
    ],
    adverseReactions: [
      "肌痛，可发生肌病、横纹肌溶解或免疫介导坏死性肌病",
      "转氨酶升高及肝损伤，活动性肝病需按禁忌评估",
      "可出现血糖升高；部分人群糖尿病风险增加",
      "肾功能、亚洲人群药物暴露及转运体相关相互作用可影响方案；按具体制剂评估妊娠与哺乳禁忌",
    ],
    memoryTip: "「瑞舒关合成、增受体、清 LDL」——与依折麦布的肠道吸收抑制机制分清。",
    diagram: {
      title: "合成减少 → LDL 受体增多 → LDL 清除",
      nodes: [
        { id: "n0", label: "瑞舒伐他汀", role: "drug" },
        { id: "n1", label: "HMG-CoA 还原酶", role: "target" },
        { id: "n2", label: "肝内胆固醇合成 ↓", role: "signal" },
        { id: "n3", label: "LDL 受体与清除 ↑", role: "signal" },
        { id: "n4", label: "血 LDL 胆固醇 ↓", role: "effect" },
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
        title: "emc：Rosuvastatin 片产品说明书",
        url: "https://www.medicines.org.uk/emc/product/8863/smpc",
        sections: "第 4.1～4.5、4.8、5.1 节：降脂与心血管预防范围、合成和受体机制、肌肉及肝脏风险。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
  {
    id: "ticagrelor",
    genericName: "替格瑞洛",
    brandNames: [],
    englishName: "Ticagrelor",
    category: "cardiovascular",
    target: "直接、可逆地拮抗血小板 P2Y12 受体，阻断 ADP 诱导的信号转导与聚集",
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
        title: "直接结合 P2Y12 受体",
        detail: "母药本身即可发挥作用，并非必须先转化才能起效的前药；结合可逆。",
      },
      {
        title: "阻断 ADP 诱导的信号转导",
        detail: "不以阻止 ADP 结合为必要条件，而是在结合受体后抑制其下游信号。",
      },
      {
        title: "减弱血小板活化与聚集",
        detail: "减少血小板参与动脉粥样硬化血栓形成的能力。",
      },
      {
        title: "降低相应动脉血栓事件风险",
        detail: "用于急性冠脉综合征等成人患者的抗血小板治疗，通常与低剂量阿司匹林配合；疗程和联用方案需个体化。",
      },
    ],
    indications: [
      "成人急性冠脉综合征的动脉粥样硬化血栓事件预防（按抗血小板方案使用）",
      "既往心肌梗死且血栓事件风险较高成人的延长治疗（须采用相应规格与方案）",
    ],
    adverseReactions: [
      "出血，可严重或致命；活动性出血及既往颅内出血为所引制剂禁忌",
      "呼吸困难，出现或加重时需评估其他病因",
      "心动过缓或心室停搏间期，易感患者需谨慎",
      "强 CYP3A4 抑制剂可显著增加暴露；自行停药可能增加心血管事件风险",
    ],
    memoryTip: "「替格直接、可逆，挡住 P2Y12 信号」——区别于氯吡格雷的前药特点，也区别于抗凝药。",
    diagram: {
      title: "P2Y12 拮抗 → 血小板聚集减少",
      nodes: [
        { id: "n0", label: "替格瑞洛", role: "drug" },
        { id: "n1", label: "血小板 P2Y12 受体", role: "target" },
        { id: "n2", label: "ADP 下游信号 ↓", role: "signal" },
        { id: "n3", label: "血小板聚集 ↓", role: "signal" },
        { id: "n4", label: "动脉血栓风险降低", role: "effect" },
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
        title: "emc：Ticagrelor 片产品说明书",
        url: "https://www.medicines.org.uk/emc/product/101008/smpc",
        sections: "第 4.1～4.5、4.8、5.1 节：ACS 与既往心梗的不同方案、直接可逆 P2Y12 拮抗、出血和呼吸困难。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
  {
    id: "enoxaparin",
    genericName: "依诺肝素",
    brandNames: [],
    englishName: "Enoxaparin",
    category: "cardiovascular",
    target: "通过抗凝血酶增强对 Xa 与Ⅱa 因子的抑制，抗 Xa 活性强于抗Ⅱa 活性",
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
        title: "增强抗凝血酶的抑制作用",
        detail: "依诺肝素属于低分子肝素，抗凝活性主要经抗凝血酶介导。",
      },
      {
        title: "以抗 Xa 活性为主",
        detail: "同时具有较弱的抗Ⅱa（凝血酶）活性，不能简化成只作用于 Xa。",
      },
      {
        title: "抑制凝血级联与纤维蛋白形成",
        detail: "减少凝血酶生成和相关凝血反应，降低血凝块形成与扩展。",
      },
      {
        title: "用于相应血栓预防或治疗",
        detail: "适用于经评估的静脉血栓风险和部分急性冠脉综合征；不直接溶栓，不能与普通肝素或其他低分子肝素按单位简单互换。",
      },
    ],
    indications: [
      "中高危手术患者或急性疾病伴活动受限患者的静脉血栓预防",
      "成人深静脉血栓及肺栓塞治疗（不包括预计需溶栓或手术的肺栓塞）",
      "特定急性冠脉综合征的抗凝治疗",
    ],
    adverseReactions: [
      "出血、出血性贫血、注射部位血肿",
      "肝素诱导的血小板减少症（HIT），可伴血栓；需核对既往 HIT 史",
      "椎管内麻醉或穿刺相关血肿，需专门安排给药间隔",
      "肾功能减退可导致蓄积并增加出血风险；可见肝酶升高",
    ],
    memoryTip: "「依诺借抗凝血酶，偏 Xa 也抗Ⅱa」——低分子不等于没有 HIT，更不能与其他肝素直接换算。",
    diagram: {
      title: "抗凝血酶介导：抗 Xa 强于抗Ⅱa",
      nodes: [
        { id: "drug", label: "依诺肝素", role: "drug" },
        { id: "at", label: "抗凝血酶", role: "target" },
        { id: "xa", label: "Xa 因子", role: "target" },
        { id: "iia", label: "Ⅱa 因子", role: "target" },
        { id: "fibrin", label: "凝血及纤维蛋白形成 ↓", role: "signal" },
        { id: "effect", label: "血栓形成受抑", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "at", label: "增强作用", kind: "activate" },
        { from: "at", to: "xa", label: "较强抑制", kind: "inhibit" },
        { from: "at", to: "iia", label: "较弱抑制", kind: "inhibit" },
        { from: "xa", to: "fibrin", label: "受抑后", kind: "flow" },
        { from: "iia", to: "fibrin", label: "受抑后", kind: "flow" },
        { from: "fibrin", to: "effect", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "emc：Clexane（依诺肝素钠）注射剂说明书",
        url: "https://www.medicines.org.uk/emc/product/1695/smpc",
        sections: "第 4.1～4.5、4.8、5.1 节：静脉血栓与 ACS、抗凝血酶介导的 Xa/Ⅱa 抑制、出血和 HIT。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
];
