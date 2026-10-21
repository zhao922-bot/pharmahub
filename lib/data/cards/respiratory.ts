import type { DrugCard } from "@/lib/types";

/**
 * 呼吸系统 · 8 张卡片
 *
 * 两条主线，对应哮喘治疗的两类角色：
 * - 缓解药（沙丁胺醇）：激动 β2 受体，几分钟起效，用于急性发作
 * - 控制药（布地奈德、氨茶碱）：长期使用降低气道炎症与高反应性
 *
 * 「缓解 vs 控制」的分野是本分类最重要的认知框架，
 * 比记住单个药物更重要——用错会导致哮喘控制不良甚至死亡。
 */
export const respiratoryCards: readonly DrugCard[] = [
  {
    id: "salbutamol",
    genericName: "沙丁胺醇",
    brandNames: [
      "万托林",
    ],
    englishName: "Salbutamol",
    category: "respiratory",
    target: "相对选择性激动支气管平滑肌 β2 肾上腺素受体",
    mechanismSteps: [
      {
        title: "激动 β2 受体",
        detail: "沙丁胺醇是短效 β2 受体激动药（SABA），具有较快的支气管舒张作用。",
      },
      {
        title: "增加 cAMP 信号",
        detail: "受体经 Gs 激活腺苷酸环化酶，使 cAMP 增加，带动相关蛋白激酶信号。",
      },
      {
        title: "舒张支气管平滑肌",
        detail: "钙与收缩相关过程改变，降低气道平滑肌张力，缓解支气管痉挛。",
      },
      {
        title: "不能替代抗炎方案",
        detail: "GINA 不推荐哮喘仅靠 SABA 治疗，应包含吸入激素相关方案；具体缓解药选择还取决于年龄和治疗轨道。",
      },
    ],
    indications: [
      "可逆性气道阻塞相关支气管痉挛的缓解或预防（吸入制剂）",
      "运动诱发支气管痉挛的预防",
    ],
    adverseReactions: [
      "震颤、心悸或心动过速",
      "低钾血症",
      "反常性支气管痉挛",
      "过量或频繁需求提示风险，不能只靠不断增加缓解药",
    ],
    memoryTip: "β2—cAMP—舒张气道；SABA 缓解痉挛不能替代哮喘抗炎治疗。",
    diagram: {
      title: "沙丁胺醇：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "沙丁胺醇", role: "drug" },
        { id: "s0", label: "β2 受体被激活", role: "target" },
        { id: "s1", label: "cAMP 信号增加", role: "signal" },
        { id: "s2", label: "支气管平滑肌舒张", role: "signal" },
        { id: "s3", label: "支气管痉挛缓解", role: "effect" },
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
        "β2 受体被激活",
        "cAMP 信号增加",
        "支气管平滑肌舒张",
        "支气管痉挛缓解",
      ],
      explanation: "本题选取的上游到下游主线：β2 受体被激活 → cAMP 信号增加 → 支气管平滑肌舒张 → 支气管痉挛缓解。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "沙丁胺醇（albuterol）VENTOLIN HFA 说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=2ed73618-be3a-4331-9509-6401258f791f",
        sections: "2、5.1～5.8、12.1、17 节及使用说明：吸入剂型、β2—cAMP、症状恶化、炎症控制与不良反应。",
      },
      {
        title: "GINA · 2026 哮喘策略概要",
        url: "https://ginasthma.org/2026-gina-summary-guide/",
        sections: "含 ICS 的治疗原则；SABA、ICS 单方与 ICS/福莫特罗的角色",
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
    id: "budesonide",
    genericName: "布地奈德",
    brandNames: [
      "普米克令舒",
    ],
    englishName: "Budesonide",
    category: "respiratory",
    target: "激动细胞内糖皮质激素受体，调节气道炎症",
    mechanismSteps: [
      {
        title: "吸入后作用于气道",
        detail: "本卡讨论吸入布地奈德；鼻用、口服及复方制剂的用途不能直接互换。",
      },
      {
        title: "结合糖皮质激素受体",
        detail: "受体相关转录调节影响多种炎症细胞和介质。",
      },
      {
        title: "减轻气道炎症",
        detail: "规律使用可改善控制并降低急性加重风险；起效与最大效应时间不同，不能说使用后前两周绝无作用。",
      },
      {
        title: "区分单药与复方角色",
        detail: "布地奈德单药不直接快速舒张支气管；含福莫特罗的特定复方在相应方案中可作缓解药，不能混为一谈。",
      },
    ],
    indications: [
      "哮喘维持治疗（所引吸入单方制剂）",
    ],
    adverseReactions: [
      "口咽念珠菌感染",
      "声音嘶哑、咽部刺激",
      "高暴露或长期使用可产生全身激素效应",
      "儿童生长速度及肾上腺功能等需按情境关注",
    ],
    memoryTip: "吸入激素管炎症；单方布地奈德与含福莫特罗复方的角色不同。",
    diagram: {
      title: "布地奈德：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "布地奈德", role: "drug" },
        { id: "s0", label: "糖皮质激素受体激活", role: "target" },
        { id: "s1", label: "炎症相关基因调控改变", role: "signal" },
        { id: "s2", label: "气道炎症减轻", role: "signal" },
        { id: "s3", label: "哮喘控制改善", role: "effect" },
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
        "糖皮质激素受体激活",
        "炎症相关基因调控改变",
        "气道炎症减轻",
        "哮喘控制改善",
      ],
      explanation: "本题选取的上游到下游主线：糖皮质激素受体激活 → 炎症相关基因调控改变 → 气道炎症减轻 → 哮喘控制改善。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "布地奈德 PULMICORT FLEXHALER 吸入粉雾剂说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ae1105cd-69fc-4c15-937f-c535304341c2",
        sections: "药理、适应症、警告与不良反应；不外推到其他剂型",
      },
      {
        title: "GINA · 2026 哮喘策略概要",
        url: "https://ginasthma.org/2026-gina-summary-guide/",
        sections: "含 ICS 的治疗原则；SABA、ICS 单方与 ICS/福莫特罗的角色",
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
    id: "aminophylline",
    genericName: "氨茶碱",
    brandNames: [],
    englishName: "Aminophylline",
    category: "respiratory",
    target: "释放茶碱，可能经磷酸二酯酶等多条途径发挥作用",
    mechanismSteps: [
      {
        title: "茶碱是主要活性部分",
        detail: "氨茶碱为茶碱与乙二胺的复合物，药理作用主要来自茶碱。",
      },
      {
        title: "可能影响 PDE 等环节",
        detail: "PDE 抑制可参与支气管舒张；腺苷受体及其他途径也涉及作用和毒性，机制并非完全确定。",
      },
      {
        title: "产生舒张及其他效应",
        detail: "可舒张气道并影响心脏、中枢等；治疗窗窄，清除受年龄、疾病、吸烟状态及合并药物影响。",
      },
      {
        title: "区分旧说明书与现行策略",
        detail: "部分注射说明书仍列急性气流受限的辅助用途，但 GINA 不推荐在哮喘急性加重中使用静脉氨茶碱；浓度低于某个阈值也不保证安全。",
      },
    ],
    indications: [
      "特定可逆性气流受限的辅助治疗；需按具体制剂和现行指南评估，不作为哮喘急性加重的常规选择",
    ],
    adverseReactions: [
      "恶心、呕吐、头痛及失眠",
      "心动过速、严重心律失常",
      "惊厥",
      "药物相互作用可显著改变浓度，需监测",
    ],
    memoryTip: "茶碱作用多、治疗窗窄；血药浓度只是风险评估的一部分。",
    diagram: {
      title: "氨茶碱：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "氨茶碱", role: "drug" },
        { id: "s0", label: "茶碱影响 PDE 等相关途径", role: "target" },
        { id: "s1", label: "气道平滑肌张力降低", role: "signal" },
        { id: "s2", label: "支气管舒张（完整机制未明）", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "s0", label: "主线环节", kind: "flow" },
        { from: "s0", to: "s1", label: "后续变化", kind: "flow" },
        { from: "s1", to: "s2", label: "后续变化", kind: "flow" },
      ],
    },
    sources: [
      {
        title: "氨茶碱注射液说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=52bbc6cd-4baf-7859-e063-6394a90ac87d",
        sections: "成分、临床药理、警告和注意事项：茶碱复合物、机制的不确定性、浓度监测及心律与惊厥风险。",
      },
      {
        title: "GINA · 哮喘策略报告（2026）",
        url: "https://ginasthma.org/wp-content/uploads/2026/05/GINA-2026-Strategy-Report-WMS.pdf",
        sections: "哮喘急性加重中的氨茶碱/茶碱：不推荐",
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
    id: "montelukast",
    indicationQuizDistractorIds: [
      "aciclovir",
      "metformin",
      "levothyroxine",
    ],
    genericName: "孟鲁司特",
    brandNames: [],
    englishName: "Montelukast",
    category: "respiratory",
    target: "选择性拮抗半胱氨酰白三烯 CysLT1 受体",
    mechanismSteps: [
      {
        title: "口服吸收后发挥作用",
        detail: "孟鲁司特是口服有效的白三烯受体拮抗剂，作用于气道及炎症细胞上的受体。",
      },
      {
        title: "阻断 CysLT1 受体",
        detail: "孟鲁司特口服后高选择性结合 CysLT1 受体，拮抗 LTD4 等介质的作用。",
      },
      {
        title: "削弱白三烯信号",
        detail: "介质与受体的作用受阻后，白三烯介导的气道收缩、黏液分泌等信号减弱。",
      },
      {
        title: "减轻气道反应",
        detail: "有助于哮喘预防与长期治疗，但不用于急性发作抢救，也不能自行替代吸入糖皮质激素。",
      },
    ],
    indications: [
      "哮喘的预防与长期治疗、运动诱发支气管收缩的预防（本片剂说明书为 15 岁及以上）",
      "过敏性鼻炎：仅在其他治疗效果不足或不能耐受时考虑（本片剂为 15 岁及以上）",
    ],
    adverseReactions: [
      "严重神经精神事件：可有睡眠、情绪或行为改变及自杀意念；出现时需停药并及时联系医务人员",
      "头痛、腹痛或腹泻",
      "过敏反应及肝酶升高已有报告",
    ],
    memoryTip: "「孟鲁司特拦白三烯」——用于预防与控制，牢记神经精神风险，不能承担急救。",
    diagram: {
      title: "白三烯受体阻断 → 气道反应减弱",
      nodes: [
        { id: "n0", label: "孟鲁司特", role: "drug" },
        { id: "n1", label: "CysLT1 受体", role: "target" },
        { id: "n2", label: "白三烯信号 ↓", role: "signal" },
        { id: "n3", label: "气道反应减弱", role: "effect" },
      ],
      edges: [
        { from: "n0", to: "n1", label: "阻断", kind: "inhibit" },
        { from: "n1", to: "n2", kind: "flow", label: "受抑后" },
        { from: "n2", to: "n3", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "DailyMed：Montelukast 片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=52c650cf-3081-7b2c-e063-6394a90a797f",
        sections: "黑框警告及第 1、5、6、12.1 节：CysLT1 机制、15 岁及以上片剂用途、非急救及神经精神风险。",
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
    id: "tiotropium",
    indicationQuizDistractorIds: [
      "aciclovir",
      "metformin",
      "levothyroxine",
    ],
    genericName: "噻托溴铵",
    brandNames: [],
    englishName: "Tiotropium",
    category: "respiratory",
    target: "长效拮抗气道毒蕈碱受体，主要通过阻断平滑肌 M3 受体扩张支气管",
    mechanismSteps: [
      {
        title: "吸入后作用于气道",
        detail: "噻托溴铵是长效抗毒蕈碱药，吸入后的支气管舒张主要来自局部作用。",
      },
      {
        title: "拮抗 M3 受体",
        detail: "它对多种毒蕈碱受体有亲和力，气道平滑肌上的 M3 阻断是支气管扩张的主要环节。",
      },
      {
        title: "减弱胆碱能收缩作用",
        detail: "乙酰胆碱所介导的气道收缩受到抑制，气道平滑肌舒张。",
      },
      {
        title: "维持较长时间的扩张效应",
        detail: "用于长期维持治疗，不能用作急性支气管痉挛的抢救药。本卡以 SPIRIVA RESPIMAT 为例。",
      },
    ],
    indications: [
      "慢性阻塞性肺疾病的支气管痉挛长期维持治疗及急性加重风险降低",
      "6 岁及以上哮喘患者的长期维持治疗（所引 RESPIMAT 制剂范围）",
    ],
    adverseReactions: [
      "口干等抗胆碱能不良反应",
      "尿潴留加重：前列腺增生或膀胱颈梗阻者需关注",
      "窄角型青光眼恶化：避免吸入喷雾进入眼睛",
      "反常性支气管痉挛及即刻过敏反应",
    ],
    memoryTip: "「噻托拦 M3，长效松气道」——记住口干、尿潴留、眼部风险和非急救定位。",
    diagram: {
      title: "M3 阻断 → 胆碱能气道收缩减弱",
      nodes: [
        { id: "n0", label: "噻托溴铵", role: "drug" },
        { id: "n1", label: "M3 受体", role: "target" },
        { id: "n2", label: "胆碱能收缩 ↓", role: "signal" },
        { id: "n3", label: "支气管扩张", role: "effect" },
      ],
      edges: [
        { from: "n0", to: "n1", label: "阻断", kind: "inhibit" },
        { from: "n1", to: "n2", kind: "flow", label: "受抑后" },
        { from: "n2", to: "n3", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "DailyMed：SPIRIVA RESPIMAT（tiotropium）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=7b656b14-fcaa-2741-f6f0-e0be48971c02",
        sections: "第 1、5、6、12.1 节：本吸入制剂的 COPD/哮喘用途、非急救定位、抗胆碱能风险及 M3 机制。",
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
    id: "acetylcysteine",
    genericName: "乙酰半胱氨酸",
    brandNames: [],
    englishName: "Acetylcysteine",
    category: "respiratory",
    target: "巯基参与黏液中二硫键的断裂，使黏蛋白复合物解聚、痰液黏度下降",
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
        title: "巯基作用于黏液二硫键",
        detail: "黏液溶解作用与分子中的巯基有关；说明书将打开二硫键作为可能的作用解释。",
      },
      {
        title: "使黏蛋白复合物解聚",
        detail: "维持黏稠性的大分子网络变得松散。",
      },
      {
        title: "降低痰液黏度",
        detail: "稠厚分泌物变稀，更易随咳嗽和黏液纤毛清除排出。",
      },
      {
        title: "帮助排痰",
        detail: "本卡聚焦黏液溶解用途；不能代替支气管扩张急救，排痰能力不足者须防分泌物潴留。",
      },
    ],
    indications: [
      "伴稠厚黏液分泌的呼吸系统疾病的祛痰辅助治疗（所引口服制剂）",
    ],
    adverseReactions: [
      "恶心、呕吐、腹痛或腹泻",
      "支气管痉挛，哮喘患者尤其需要观察",
      "过敏反应，少见严重皮肤或全身反应",
      "分泌物液化后若不能有效排出，可能潴留；与镇咳药合用需评估这一风险",
    ],
    memoryTip: "「乙酰半胱氨酸拆开痰液的黏网」——痰变稀后还要排得出；不同制剂用途不能直接互换。",
    diagram: {
      title: "黏液网络解聚 → 痰变稀、易排出",
      nodes: [
        { id: "n0", label: "乙酰半胱氨酸", role: "drug" },
        { id: "n1", label: "黏液二硫键", role: "target" },
        { id: "n2", label: "黏蛋白解聚", role: "signal" },
        { id: "n3", label: "痰液黏度 ↓", role: "signal" },
        { id: "n4", label: "排痰更容易", role: "effect" },
      ],
      edges: [
        { from: "n0", to: "n1", label: "参与断裂", kind: "flow" },
        { from: "n1", to: "n2", kind: "flow", label: "受抑后" },
        { from: "n2", to: "n3", kind: "flow", label: "后续变化" },
        { from: "n3", to: "n4", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "emc：Acetylcysteine 口服溶液用散说明书",
        url: "https://www.medicines.org.uk/emc/product/13029/smpc",
        sections: "第 4.1～4.5、4.8、5.1 节：黏液溶解用途、支气管痉挛和分泌物潴留；所引 200 mg 散用于成人及 12 岁以上青少年。",
      },
      {
        title: "DailyMed：Acetylcysteine 溶液说明书（黏液溶解机制）",
        url: "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=8165ad85-98e7-438f-9567-5cfda88d0ebf&type=display",
        sections: "临床药理：巯基与黏液二硫键的关系；该来源仅补充机制，不外推制剂用法。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
  },
  {
    id: "budesonide-formoterol",
    genericName: "布地奈德福莫特罗",
    brandNames: [],
    englishName: "Budesonide / formoterol",
    category: "respiratory",
    target: "布地奈德发挥吸入糖皮质激素抗炎作用，福莫特罗激动 β2 受体舒张支气管",
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
        title: "两种成分分别发挥作用",
        detail: "吸入后，布地奈德负责糖皮质激素抗炎，福莫特罗负责 β2 受体激动；两条作用通路并行。",
      },
      {
        title: "布地奈德减轻气道炎症",
        detail: "局部抗炎有助于减少哮喘症状和加重；糖皮质激素的精确抗炎机制并未完全阐明。",
      },
      {
        title: "福莫特罗松弛支气管平滑肌",
        detail: "选择性 β2 受体激动可较快起效并维持较长时间，改善气流受限。",
      },
      {
        title: "抗炎与舒张协同控制疾病",
        detail: "所引 200/6 干粉制剂可按相应方案用于哮喘维持、维持兼缓解或缓解治疗；不能将其推广至所有规格和吸入器。",
      },
    ],
    indications: [
      "需相应 ICS/LABA 组合治疗的哮喘（所引干粉制剂为 12 岁及以上；具体维持或缓解方案遵医嘱）",
      "符合所引制剂条件的成人 COPD 症状治疗：支气管舒张后 FEV1 低于预计值 70%，且规律舒张治疗后仍有加重史",
    ],
    adverseReactions: [
      "口咽念珠菌感染、声音嘶哑；维持吸入后漱口可减少局部风险",
      "震颤、心悸、心动过速；可发生低钾血症",
      "反常性支气管痉挛，吸入后喘息突然加重需及时处理",
      "长期较高暴露可有全身糖皮质激素效应；COPD 患者需留意肺炎风险",
    ],
    memoryTip: "「布地控炎，福莫扩管」——能否作缓解药取决于具体制剂与处方方案。",
    diagram: {
      title: "吸入抗炎与 β2 舒张的并行通路",
      nodes: [
        { id: "bud", label: "布地奈德", role: "drug" },
        { id: "form", label: "福莫特罗", role: "drug" },
        { id: "inflam", label: "气道炎症", role: "target" },
        { id: "beta", label: "β2 受体", role: "target" },
        { id: "control", label: "炎症反应 ↓", role: "signal" },
        { id: "relax", label: "支气管平滑肌松弛", role: "signal" },
        { id: "effect", label: "改善疾病控制", role: "effect" },
      ],
      edges: [
        { from: "bud", to: "inflam", label: "抗炎", kind: "inhibit" },
        { from: "form", to: "beta", label: "激动", kind: "activate" },
        { from: "inflam", to: "control", label: "受抑后", kind: "flow" },
        { from: "beta", to: "relax", kind: "flow", label: "后续变化" },
        { from: "control", to: "effect", kind: "flow", label: "后续变化" },
        { from: "relax", to: "effect", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "emc：Symbicort Turbohaler 200/6 干粉吸入剂说明书",
        url: "https://www.medicines.org.uk/emc/product/1327/smpc",
        sections: "第 4.1～4.4、4.8、5.1 节：哮喘方案与 COPD 条件、抗炎及 β2 舒张机制、局部与全身风险。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
  {
    id: "ipratropium",
    genericName: "异丙托溴铵",
    brandNames: [],
    englishName: "Ipratropium bromide",
    category: "respiratory",
    target: "拮抗气道毒蕈碱型胆碱受体，减弱乙酰胆碱介导的支气管收缩",
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
        title: "拮抗气道毒蕈碱型受体",
        detail: "异丙托溴铵为季铵类抗胆碱药，吸入后主要在支气管局部发挥作用。",
      },
      {
        title: "减弱乙酰胆碱的收缩信号",
        detail: "减少迷走神经相关的胆碱能刺激，而非通过激动 β2 受体起效。",
      },
      {
        title: "减少平滑肌细胞内钙升高",
        detail: "阻断乙酰胆碱与受体作用引起的钙相关信号，促进支气管平滑肌松弛。",
      },
      {
        title: "缓解可逆性支气管痉挛",
        detail: "所引雾化制剂用于 COPD，并可与吸入 β2 激动剂联用于急慢性哮喘相关可逆性气道阻塞。",
      },
    ],
    indications: [
      "COPD 相关可逆性支气管痉挛（吸入制剂）",
      "急性或慢性哮喘相关可逆性气道阻塞的联合治疗（所引雾化制剂与吸入 β2 激动剂同用）",
    ],
    adverseReactions: [
      "口干、咽喉刺激、咳嗽或恶心",
      "雾滴入眼可诱发眼痛、眼压升高或闭角型青光眼，需正确使用装置",
      "尿潴留风险，原有尿路流出道梗阻者需谨慎",
      "反常性支气管痉挛或过敏反应；吸入后喘息突然加重需及时处理",
    ],
    memoryTip: "「异丙挡胆碱，让气道少收缩」——保护眼睛、注意排尿，哮喘雾化按联合方案使用。",
    diagram: {
      title: "胆碱受体拮抗 → 平滑肌松弛",
      nodes: [
        { id: "n0", label: "异丙托溴铵", role: "drug" },
        { id: "n1", label: "气道毒蕈碱型受体", role: "target" },
        { id: "n2", label: "胆碱能钙信号 ↓", role: "signal" },
        { id: "n3", label: "支气管平滑肌松弛", role: "signal" },
        { id: "n4", label: "气道阻塞改善", role: "effect" },
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
        title: "emc：Atrovent（异丙托溴铵）雾化吸入液说明书",
        url: "https://www.medicines.org.uk/emc/product/3818/smpc",
        sections: "第 4.1～4.4、4.8、5.1 节：COPD 与哮喘联用范围、局部抗胆碱机制、眼部和尿潴留风险。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
];
