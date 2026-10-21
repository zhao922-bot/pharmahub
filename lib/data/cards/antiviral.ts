import type { DrugCard } from "@/lib/types";

/**
 * 抗病毒药 · 4 张卡片
 *
 * 抗病毒药的选择性来自「病毒特有、宿主没有」的靶点。
 * 这两张卡分别代表两条路径：
 * - 阿昔洛韦：靶向病毒 DNA 聚合酶，靠病毒胸苷激酶活化（双重选择性）
 * - 奥司他韦：靶向病毒神经氨酸酶，阻断病毒释放
 *
 * 「为什么抗病毒药比抗菌药少」是这一类的核心认知：
 * 病毒复制依赖宿主细胞机器，可攻击的靶点天然更少。
 */
export const antiviralCards: readonly DrugCard[] = [
  {
    id: "aciclovir",
    genericName: "阿昔洛韦",
    brandNames: [],
    englishName: "Aciclovir",
    category: "antiviral",
    target: "活性三磷酸代谢物抑制疱疹病毒 DNA 聚合酶并终止链延伸",
    mechanismSteps: [
      {
        title: "在感染细胞内优先活化",
        detail: "阿昔洛韦先经病毒胸苷激酶等作用形成单磷酸物，这种选择性是相对的，不能写成正常细胞绝无活化。",
      },
      {
        title: "形成三磷酸活性物",
        detail: "宿主细胞酶继续磷酸化，形成阿昔洛韦三磷酸。",
      },
      {
        title: "影响病毒 DNA 合成",
        detail: "活性物抑制病毒 DNA 聚合酶，掺入 DNA 后可造成链终止。",
      },
      {
        title: "限制病毒复制而非清除潜伏",
        detail: "主要针对 HSV、VZV 等敏感病毒；制剂和感染部位决定方案，不能宣称清除潜伏感染或所有病毒通用。",
      },
    ],
    indications: [
      "单纯疱疹病毒相关感染的治疗或抑制，按具体制剂",
      "水痘、带状疱疹等符合条件的 VZV 感染",
    ],
    adverseReactions: [
      "恶心、腹泻或头痛",
      "肾损伤，静脉暴露和脱水等情境需关注",
      "神经毒性，肾功能下降者风险增加",
      "局部注射反应或过敏",
    ],
    memoryTip: "病毒酶先启动、宿主酶再磷酸化，活性物阻断 DNA 延伸。",
    diagram: {
      title: "阿昔洛韦：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "阿昔洛韦", role: "drug" },
        { id: "s0", label: "初步磷酸化", role: "signal" },
        { id: "s1", label: "形成三磷酸活性物", role: "signal" },
        { id: "s2", label: "病毒 DNA 合成受抑", role: "signal" },
        { id: "s3", label: "敏感病毒复制减少", role: "effect" },
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
        "初步磷酸化",
        "形成三磷酸活性物",
        "病毒 DNA 合成受抑",
        "敏感病毒复制减少",
      ],
      explanation: "本题选取的上游到下游主线：初步磷酸化 → 形成三磷酸活性物 → 病毒 DNA 合成受抑 → 敏感病毒复制减少。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "阿昔洛韦说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=8d4c9317-7475-42ec-a0b0-d43929114369",
        sections: "药理、适应症、警告与不良反应（剂型与适用范围见正文）",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
    targetQuizDistractorIds: [
      "omeprazole",
      "levothyroxine",
      "allopurinol",
    ],
    indicationQuizDistractorIds: [
      "levothyroxine",
      "allopurinol",
      "metformin",
    ],
  },
  {
    id: "oseltamivir",
    genericName: "奥司他韦",
    brandNames: [
      "达菲",
    ],
    englishName: "Oseltamivir",
    category: "antiviral",
    target: "活性羧酸代谢物抑制甲型和乙型流感病毒神经氨酸酶",
    mechanismSteps: [
      {
        title: "前药经酯酶活化",
        detail: "奥司他韦转化为活性羧酸代谢物。",
      },
      {
        title: "抑制流感病毒神经氨酸酶",
        detail: "减少该酶对唾液酸相关底物的切割，不把选择性解释为人类完全没有神经氨酸酶。",
      },
      {
        title: "限制病毒释放与传播",
        detail: "新生病毒从感染细胞释放及进一步传播受到限制；药物不能替代流感疫苗。",
      },
      {
        title: "区分早期获益与治疗边界",
        detail: "单纯性流感说明书强调发病 48 小时内治疗；CDC 对住院、重症或进展性流感强调尽早治疗，超过 48 小时仍可能获益。",
      },
    ],
    indications: [
      "甲型和乙型流感的治疗，尽早开始；重症或住院等不以 48 小时作绝对排除线",
      "符合条件的流感暴露后预防，年龄和方案按说明书及指南",
    ],
    adverseReactions: [
      "恶心、呕吐",
      "头痛",
      "少见严重皮肤或过敏反应",
      "流感期间曾报告异常行为等神经精神事件，需关注且不能简单归因于单一原因",
    ],
    memoryTip: "奥司阻释放，越早通常越好；重症超过 48 小时仍需评估治疗。",
    diagram: {
      title: "奥司他韦：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "奥司他韦", role: "drug" },
        { id: "s0", label: "形成活性羧酸代谢物", role: "signal" },
        { id: "s1", label: "病毒神经氨酸酶受抑", role: "signal" },
        { id: "s2", label: "新生病毒释放受限", role: "signal" },
        { id: "s3", label: "病毒进一步传播减少", role: "effect" },
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
        "形成活性羧酸代谢物",
        "病毒神经氨酸酶受抑",
        "新生病毒释放受限",
        "病毒进一步传播减少",
      ],
      explanation: "本题选取的上游到下游主线：形成活性羧酸代谢物 → 病毒神经氨酸酶受抑 → 新生病毒释放受限 → 病毒进一步传播减少。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "奥司他韦说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b015d73a-f3b6-4258-8972-6fc4a043aed8",
        sections: "药理、适应症、警告与不良反应（剂型与适用范围见正文）",
      },
      {
        title: "CDC · 流感抗病毒治疗（2026 更新）",
        url: "https://www.cdc.gov/flu/hcp/antivirals/summary-clinicians.html",
        sections: "住院、重症及进展性流感；超过 48 小时的治疗获益",
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
    id: "entecavir",
    genericName: "恩替卡韦",
    brandNames: [],
    englishName: "Entecavir",
    category: "antiviral",
    target: "转化为三磷酸恩替卡韦后，抑制乙型肝炎病毒（HBV）聚合酶 / 逆转录酶",
    targetQuizDistractorIds: [
      "amlodipine",
      "metformin",
      "sucralfate",
    ],
    indicationQuizDistractorIds: [
      "amlodipine",
      "metformin",
      "sucralfate",
    ],
    mechanismSteps: [
      {
        title: "在细胞内磷酸化活化",
        detail: "恩替卡韦是鸟嘌呤核苷类似物，转化为具有活性的三磷酸形式。",
      },
      {
        title: "与天然底物竞争",
        detail: "活性形式竞争天然的三磷酸脱氧鸟苷，作用于 HBV 聚合酶 / 逆转录酶。",
      },
      {
        title: "抑制病毒 DNA 合成三环节",
        detail: "抑制起始引发、由前基因组 RNA 逆转录生成负链，以及 HBV DNA 正链合成。",
      },
      {
        title: "减少 HBV 复制",
        detail: "降低病毒复制水平；停药后可能发生严重肝炎加重，需要持续随访。",
      },
    ],
    indications: [
      "有活动性病毒复制且持续转氨酶升高或组织学活动证据的慢性乙型肝炎（成人及 2 岁以上儿童，按说明书选择）",
    ],
    adverseReactions: [
      "头痛、疲劳、头晕及恶心",
      "停药后可发生严重急性乙型肝炎加重",
      "乳酸性酸中毒及伴脂肪变性的严重肝肿大已有报告，肝功能失代偿者更需关注",
      "合并未经有效治疗的 HIV 感染时可能选择出 HIV 耐药，不宜仅用恩替卡韦治疗",
      "主要经肾排泄，肾功能下降时需调整用药方案",
    ],
    memoryTip: "「恩替卡韦先活化，再拦 HBV 三环节」——抑制复制不等于可以自行停药。",
    diagram: {
      title: "核苷类似物活化后 → 抑制 HBV DNA 合成",
      nodes: [
        { id: "drug", label: "恩替卡韦", role: "drug" },
        { id: "active", label: "三磷酸活性形式", role: "signal" },
        { id: "target", label: "HBV 聚合酶", role: "target" },
        { id: "dna", label: "病毒 DNA ↓", role: "signal" },
        { id: "effect", label: "HBV 复制 ↓", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "active", label: "磷酸化", kind: "flow" },
        { from: "active", to: "target", label: "竞争抑制", kind: "inhibit" },
        { from: "target", to: "dna", kind: "flow", label: "受抑后" },
        { from: "dna", to: "effect", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "DailyMed：BARACLUDE（entecavir）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=046e61c9-9298-4b2e-b76e-b26b81fecd20",
        sections: "黑框警告及第 1、2.4、5、6、12.3～12.4 节：慢乙肝用途、三磷酸活化与复制抑制、停药和 HIV 共感染风险。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
  },
  {
    id: "tenofovir-disoproxil",
    genericName: "富马酸替诺福韦二吡呋酯",
    brandNames: [],
    englishName: "Tenofovir disoproxil fumarate (TDF)",
    category: "antiviral",
    target: "转为替诺福韦二磷酸后抑制 HIV-1 逆转录酶与 HBV 聚合酶，使病毒 DNA 链终止",
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
        title: "前药水解为替诺福韦",
        detail: "TDF 先经水解形成替诺福韦，再进入细胞内的活化过程。",
      },
      {
        title: "细胞内形成替诺福韦二磷酸",
        detail: "经细胞酶磷酸化，生成发挥抗病毒作用的二磷酸形式。",
      },
      {
        title: "竞争底物并终止病毒 DNA 链",
        detail: "活性物与天然脱氧腺苷三磷酸竞争，抑制 HIV-1 逆转录酶及 HBV 聚合酶；掺入 DNA 后终止链延长。",
      },
      {
        title: "抑制病毒复制",
        detail: "用于慢性乙肝或作为 HIV-1 联合治疗的一部分；用于 HIV 时不能作为单药治疗。",
      },
    ],
    indications: [
      "成人慢性乙型肝炎",
      "成人 HIV-1 感染的联合抗逆转录病毒治疗（不能单药使用）",
    ],
    adverseReactions: [
      "肾功能损害、近端肾小管病变或 Fanconi 综合征，需监测肾功能",
      "骨密度下降，肾小管损伤还可能伴低磷与骨软化",
      "乙肝患者停药后可能严重急性加重，需要随访肝功能",
      "恶心、腹泻等胃肠道反应；少见乳酸酸中毒及伴脂肪变性的严重肝肿大",
    ],
    memoryTip: "「TDF 先活化，二磷酸截断病毒 DNA」——HIV 要联合，乙肝停药需监测，留意肾与骨。",
    diagram: {
      title: "前药 → 二磷酸活性物 → 病毒 DNA 链终止",
      nodes: [
        { id: "tdf", label: "TDF", role: "drug" },
        { id: "tfv", label: "替诺福韦", role: "drug" },
        { id: "dp", label: "替诺福韦二磷酸", role: "drug" },
        { id: "enzyme", label: "病毒逆转录酶 / 聚合酶", role: "target" },
        { id: "dna", label: "病毒 DNA 链终止", role: "signal" },
        { id: "effect", label: "病毒复制受抑", role: "effect" },
      ],
      edges: [
        { from: "tdf", to: "tfv", label: "水解", kind: "flow" },
        { from: "tfv", to: "dp", label: "细胞内磷酸化", kind: "flow" },
        { from: "dp", to: "enzyme", label: "竞争底物", kind: "inhibit" },
        { from: "enzyme", to: "dna", label: "掺入后", kind: "flow" },
        { from: "dna", to: "effect", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "DailyMed：VIREAD（TDF）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=33fd6418-fbdc-42ca-a50d-ce2a476a5418",
        sections: "第 1、2.1、5～6、12.4 节：HIV 联合治疗与慢性乙肝、活化和 DNA 链终止、肾骨风险及停药后加重。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
];
