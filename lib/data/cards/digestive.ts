import type { DrugCard } from "@/lib/types";

/**
 * 消化系统 · 14 张卡片
 *
 * 四条主线：抑酸（奥美拉唑、雷尼替丁）、促动力（多潘立酮）、
 * 止吐（昂丹司琼）、黏膜保护与肠道炎症（硫糖铝、洛哌丁胺、美沙拉嗪）。
 */
export const digestiveCards: readonly DrugCard[] = [
  {
    id: "omeprazole",
    genericName: "奥美拉唑",
    brandNames: [
      "洛赛克",
      "奥克",
    ],
    englishName: "Omeprazole",
    category: "digestive",
    target: "抑制胃壁细胞 H+/K+-ATP 酶（质子泵）",
    mechanismSteps: [
      {
        title: "经吸收进入胃壁细胞",
        detail: "延迟释放制剂保护药物通过胃部；吸收后进入壁细胞酸性分泌小管，包衣本身不是药理靶点。",
      },
      {
        title: "酸性环境下转化为活性形式",
        detail: "奥美拉唑经酸性环境活化后与质子泵作用。",
      },
      {
        title: "抑制胃酸分泌末端环节",
        detail: "对活化泵产生持续抑制，降低基础及刺激性酸分泌。不是一剂永久关闭所有泵。",
      },
      {
        title: "泵更新及给药条件影响效应",
        detail: "新的泵生成后酸分泌可恢复；幽门螺杆菌根除需联合方案，不能只凭抑酸替代抗菌治疗。",
      },
    ],
    indications: [
      "胃食管反流病、胃或十二指肠溃疡等酸相关疾病",
      "幽门螺杆菌根除方案中的抑酸药",
      "病理性高胃酸分泌状态",
    ],
    adverseReactions: [
      "头痛、腹痛、恶心或腹泻",
      "急性间质性肾炎",
      "长期使用可涉及低镁、维生素 B12 降低等风险",
      "与氯吡格雷等药物存在相互作用，方案需评估",
    ],
    memoryTip: "酸中活化后抑制质子泵；抑酸不等于根除幽门螺杆菌。",
    diagram: {
      title: "奥美拉唑：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "奥美拉唑", role: "drug" },
        { id: "s0", label: "酸性环境中活化", role: "signal" },
        { id: "s1", label: "H+/K+-ATP 酶受抑", role: "signal" },
        { id: "s2", label: "胃酸分泌减少", role: "signal" },
        { id: "s3", label: "酸相关损伤减轻", role: "effect" },
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
        "酸性环境中活化",
        "H+/K+-ATP 酶受抑",
        "胃酸分泌减少",
        "酸相关损伤减轻",
      ],
      explanation: "本题选取的上游到下游主线：酸性环境中活化 → H+/K+-ATP 酶受抑 → 胃酸分泌减少 → 酸相关损伤减轻。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "奥美拉唑延迟释放胶囊说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=5aba19da-663f-4901-94e2-f438dba4841f",
        sections: "药理、适应症、警告与不良反应；不外推到其他剂型",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
    targetQuizDistractorIds: [
      "levothyroxine",
      "aciclovir",
      "allopurinol",
    ],
    indicationQuizDistractorIds: [
      "levothyroxine",
      "aciclovir",
      "allopurinol",
    ],
  },
  {
    id: "ranitidine",
    genericName: "雷尼替丁",
    brandNames: [
      "善胃得",
    ],
    englishName: "Ranitidine",
    category: "digestive",
    target: "拮抗胃壁细胞组胺 H2 受体",
    mechanismSteps: [
      {
        title: "作用于 H2 受体",
        detail: "雷尼替丁竞争性拮抗胃壁细胞 H2 受体，区别于抗过敏用 H1 受体药。",
      },
      {
        title: "减少组胺促酸信号",
        detail: "H2 受体相关 cAMP 信号减弱，使组胺刺激的胃酸分泌减少。",
      },
      {
        title: "减轻酸相关作用",
        detail: "可减少基础及刺激性酸分泌，但不直接中和已有胃酸。",
      },
      {
        title: "监管信息需按产品与地区核对",
        detail: "FDA 于 2025 年 11 月批准重新配方的雷尼替丁片；这不代表旧产品恢复可用，也不代表各地批准情况相同。",
      },
    ],
    indications: [
      "胃食管反流病、消化性溃疡等历史及相应获批产品的酸相关适应症；实际使用须核对当地产品",
    ],
    adverseReactions: [
      "头痛、胃肠道不适",
      "少见意识混乱，老年或肾功能下降者需关注",
      "少见肝损伤或血细胞异常",
      "NDMA 杂质及储存要求取决于具体产品与监管公告",
    ],
    needsVerification: true,
    verificationNote: "药理及 FDA 2025 年重新配方产品公告已核对；本地产品批准状态尚待逐产品核实。旧产品召回与新配方批准不可混为一谈。",
    memoryTip: "H2 阻断减少胃酸；监管状态要注明产品、地区和日期。",
    diagram: {
      title: "雷尼替丁：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "雷尼替丁", role: "drug" },
        { id: "s0", label: "H2 受体被阻断", role: "target" },
        { id: "s1", label: "组胺促酸信号减弱", role: "signal" },
        { id: "s2", label: "胃酸分泌减少", role: "signal" },
        { id: "s3", label: "酸相关作用减轻", role: "effect" },
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
        "H2 受体被阻断",
        "组胺促酸信号减弱",
        "胃酸分泌减少",
        "酸相关作用减轻",
      ],
      explanation: "本题选取的上游到下游主线：H2 受体被阻断 → 组胺促酸信号减弱 → 胃酸分泌减少 → 酸相关作用减轻。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "雷尼替丁说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=92e1e60c-be24-4b20-8a2a-a39d03cc3cf3",
        sections: "历史标签的 H2 药理与用途；当前监管变化另见 FDA 2025 公告",
      },
      {
        title: "FDA · 重新配方雷尼替丁片批准公告（2025-11-24）",
        url: "https://www.fda.gov/drugs/drug-safety-and-availability/fda-approves-reformulated-ranitidine-following-comprehensive-safety-review",
        sections: "新产品批准与 NDMA、储存要求；不代表其他地区或旧产品批准状态",
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
    id: "domperidone",
    genericName: "多潘立酮",
    brandNames: [
      "吗丁啉",
    ],
    englishName: "Domperidone",
    category: "digestive",
    target: "主要拮抗外周多巴胺 D2 受体，并作用于血脑屏障外的催吐化学感受区",
    mechanismSteps: [
      {
        title: "拮抗多巴胺 D2 受体",
        detail: "多潘立酮阻断 D2 受体，中枢暴露较少但并非完全不产生中枢不良反应。",
      },
      {
        title: "影响胃肠运动",
        detail: "拮抗多巴胺对胃肠动力的抑制作用，可促进胃排空等过程。",
      },
      {
        title: "参与止吐作用",
        detail: "催吐化学感受区位于血脑屏障保护较弱处，受体阻断也参与止吐；与胃肠效应不是严格先后关系。",
      },
      {
        title: "按心脏风险限制用途",
        detail: "所引英国口服制剂用于恶心、呕吐的短期缓解，不能据促动力机制扩大为长期反流或所有腹胀的通用药。",
      },
    ],
    indications: [
      "恶心、呕吐的短期缓解（按所引口服制剂说明书及当地批准范围）",
    ],
    adverseReactions: [
      "口干",
      "泌乳素升高及相关乳房症状",
      "QT 延长、室性心律失常及猝死风险",
      "少见锥体外系反应；相互作用和肝功能异常可增加风险",
    ],
    memoryTip: "外周 D2 拮抗可促动力止吐，但口服也有心律风险。",
    diagram: {
      title: "多潘立酮：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "多潘立酮", role: "drug" },
        { id: "s0", label: "D2 受体被阻断", role: "target" },
        { id: "s1", label: "胃肠运动与催吐信号受影响", role: "signal" },
        { id: "s2", label: "恶心呕吐减轻", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "s0", label: "主线环节", kind: "flow" },
        { from: "s0", to: "s1", label: "后续变化", kind: "flow" },
        { from: "s1", to: "s2", label: "后续变化", kind: "flow" },
      ],
    },
    sources: [
      {
        title: "多潘立酮口服混悬液说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/3188/smpc",
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
    id: "ondansetron",
    genericName: "昂丹司琼",
    brandNames: [
      "枢复宁",
    ],
    englishName: "Ondansetron",
    category: "digestive",
    target: "选择性拮抗 5-HT3 受体",
    mechanismSteps: [
      {
        title: "识别呕吐相关信号",
        detail: "化疗可促使肠嗜铬细胞释放 5-HT，刺激迷走传入等呕吐相关通路；这一诱因不是服药后才必然发生。",
      },
      {
        title: "阻断 5-HT3 受体",
        detail: "昂丹司琼是 5-HT3 受体拮抗药，不是 D2 受体阻断药。",
      },
      {
        title: "减少呕吐反射传入",
        detail: "外周迷走末梢和中枢相关部位的受体可能参与作用，完整机制和各部位贡献尚未完全明确。",
      },
      {
        title: "按特定诱因预防恶心呕吐",
        detail: "适用于化疗、放疗及术后等特定场景，不是所有恶心或晕动症的通用止吐药。",
      },
    ],
    indications: [
      "化疗或放疗相关恶心、呕吐的预防",
      "术后恶心、呕吐的预防，按具体制剂使用",
    ],
    adverseReactions: [
      "头痛、便秘",
      "QT 延长，电解质异常等可增加风险",
      "血清素综合征风险",
      "过敏反应",
    ],
    memoryTip: "5-HT3 阻断减少呕吐信号；诱因与给药不能强排为固定顺序。",
    diagram: {
      title: "昂丹司琼：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "昂丹司琼", role: "drug" },
        { id: "s0", label: "5-HT3 受体被阻断", role: "target" },
        { id: "s1", label: "呕吐相关信号减弱", role: "signal" },
        { id: "s2", label: "恶心呕吐减少", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "s0", label: "主线环节", kind: "flow" },
        { from: "s0", to: "s1", label: "后续变化", kind: "flow" },
        { from: "s1", to: "s2", label: "后续变化", kind: "flow" },
      ],
    },
    sources: [
      {
        title: "昂丹司琼说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=f08f56de-8678-4da9-8cae-013a5c393453",
        sections: "5.2、5.4、12.1、12.2 节：5-HT3、非促胃肠动力作用、催乳素与心律风险。",
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
    id: "sucralfate",
    genericName: "硫糖铝",
    brandNames: [],
    englishName: "Sucralfate",
    category: "digestive",
    target: "在溃疡表面形成黏附性保护复合物，主要局部作用",
    mechanismSteps: [
      {
        title: "主要停留于胃肠道",
        detail: "硫糖铝全身吸收很少，作用以局部为主；少量铝吸收仍有临床意义。",
      },
      {
        title: "黏附于溃疡表面",
        detail: "与溃疡表面的蛋白性渗出物结合，形成保护复合物。",
      },
      {
        title: "减少局部损伤刺激",
        detail: "保护层有助于减少酸、胃蛋白酶和胆盐对溃疡面的攻击，不是直接抑制质子泵。",
      },
      {
        title: "注意吸附相互作用",
        detail: "可影响其他口服药吸收，需按具体说明书错开。不能概括为绝对禁止与所有抑酸药合用。",
      },
    ],
    indications: [
      "活动性十二指肠溃疡的短期治疗",
      "溃疡愈合后的特定维持方案（所引口服片）",
    ],
    adverseReactions: [
      "便秘",
      "口干、恶心等胃肠道反应",
      "肾功能不全者铝蓄积风险",
      "少见胃石或过敏反应",
    ],
    memoryTip: "硫糖铝覆盖溃疡面，不是质子泵抑制剂；留意铝与吸附相互作用。",
    diagram: {
      title: "硫糖铝：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "硫糖铝", role: "drug" },
        { id: "s0", label: "与溃疡面蛋白结合", role: "target" },
        { id: "s1", label: "形成黏附保护层", role: "signal" },
        { id: "s2", label: "酸等攻击减少", role: "signal" },
        { id: "s3", label: "支持溃疡愈合", role: "effect" },
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
        "与溃疡面蛋白结合",
        "形成黏附保护层",
        "酸等攻击减少",
        "支持溃疡愈合",
      ],
      explanation: "本题选取的上游到下游主线：与溃疡面蛋白结合 → 形成黏附保护层 → 酸等攻击减少 → 支持溃疡愈合。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "硫糖铝说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a4f722e7-2885-4f27-8358-9c662439600a",
        sections: "临床药理、注意事项与不良反应：局部保护、少量吸收、结合相互作用、肾功能与铝蓄积。",
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
    id: "loperamide",
    genericName: "洛哌丁胺",
    brandNames: [
      "易蒙停",
    ],
    englishName: "Loperamide",
    category: "digestive",
    target: "作用于肠壁 μ 阿片受体，减少推进性蠕动",
    mechanismSteps: [
      {
        title: "作用于肠壁阿片受体",
        detail: "洛哌丁胺在肠壁发挥主要作用，正常暴露下中枢作用受限，但不能宣称绝无滥用或中枢毒性。",
      },
      {
        title: "降低推进性蠕动",
        detail: "影响递质释放，使肠内容物通过时间延长。",
      },
      {
        title: "减少水分和电解质丢失",
        detail: "通过时间延长等效应可减少便量、改善腹泻症状；它不治疗所有腹泻病因，也不能替代补液。",
      },
      {
        title: "按病因限制使用",
        detail: "旅行者腹泻常为感染性，不能写成非感染性腹泻。血便高热、侵袭性感染或严重结肠炎等情境不宜套用止泻方案。",
      },
    ],
    indications: [
      "符合年龄和禁忌要求的急性非特异性腹泻的对症缓解",
      "特定慢性腹泻或回肠造口排出量管理，需医生评估",
    ],
    adverseReactions: [
      "便秘、腹胀及肠梗阻风险",
      "腹痛、恶心",
      "严重结肠炎等情境可能发生中毒性巨结肠",
      "超量或滥用可致 QT/QRS 异常及致命心律失常",
    ],
    memoryTip: "慢蠕动能减轻腹泻，不能替代病因判断与补液。",
    diagram: {
      title: "洛哌丁胺：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "洛哌丁胺", role: "drug" },
        { id: "s0", label: "肠壁 μ 受体作用增强", role: "target" },
        { id: "s1", label: "推进性蠕动减少", role: "signal" },
        { id: "s2", label: "肠内容物通过时间延长", role: "signal" },
        { id: "s3", label: "粪便水分丢失减少", role: "effect" },
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
        "肠壁 μ 受体作用增强",
        "推进性蠕动减少",
        "肠内容物通过时间延长",
        "粪便水分丢失减少",
      ],
      explanation: "本题选取的上游到下游主线：肠壁 μ 受体作用增强 → 推进性蠕动减少 → 肠内容物通过时间延长 → 粪便水分丢失减少。它是简化的作用关系，不表示卡片中的其他并行作用必须依次发生。",
    },
    sources: [
      {
        title: "洛哌丁胺胶囊说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=26a50243-ab72-849b-e063-6394a90a60a9",
        sections: "临床药理、禁忌、注意事项和过量章节：肠壁受体、CYP 代谢、P-糖蛋白、补液及心脏和中枢毒性。",
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
    id: "mesalazine",
    genericName: "美沙拉嗪",
    brandNames: [
      "艾迪莎",
    ],
    englishName: "Mesalazine",
    category: "digestive",
    target: "主要在肠黏膜局部抗炎，确切机制尚未完全明确",
    mechanismSteps: [
      {
        title: "制剂释放活性 5-ASA",
        detail: "美沙拉嗪本身是 5-氨基水杨酸；LIALDA 等释放系统不能写成靠菌群裂解前药才能活化。",
      },
      {
        title: "在结肠黏膜发挥局部作用",
        detail: "药物主要通过局部抗炎作用减轻黏膜炎症，但并非完全不吸收。",
      },
      {
        title: "可能影响炎症介质",
        detail: "前列腺素等通路可能参与作用；不能把其中一条假说当作已证实的唯一靶点。",
      },
      {
        title: "按疾病与剂型使用",
        detail: "不同制剂的释放部位和适应症不完全相同，不能泛化到所有肠炎或自行换剂型。",
      },
    ],
    indications: [
      "成人轻中度活动性溃疡性结肠炎的诱导与维持缓解（所引 LIALDA 口服制剂）",
    ],
    adverseReactions: [
      "腹痛、头痛及胃肠道反应",
      "急性不耐受综合征，可能类似原病加重",
      "间质性肾炎等肾损伤",
      "过敏、胰腺炎等少见严重反应",
    ],
    memoryTip: "5-ASA 局部抗炎；释放系统不是前药活化。",
    diagram: {
      title: "美沙拉嗪：作用主线（简化示意）",
      nodes: [
        { id: "drug", label: "美沙拉嗪", role: "drug" },
        { id: "s0", label: "制剂在肠道释放 5-ASA", role: "signal" },
        { id: "s1", label: "结肠黏膜局部抗炎（机制未完全明确）", role: "signal" },
        { id: "s2", label: "溃疡性结肠炎相关炎症减轻", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "s0", label: "主线环节", kind: "flow" },
        { from: "s0", to: "s1", label: "后续变化", kind: "flow" },
        { from: "s1", to: "s2", label: "后续变化", kind: "flow" },
      ],
    },
    sources: [
      {
        title: "美沙拉嗪 LIALDA 口服延迟释放片说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3098a080-be86-4265-9818-7fc4beab77b7",
        sections: "1、5.1、5.2、11、12.1、12.3 节：成人溃疡性结肠炎、肾脏风险、急性不耐受、释放系统与机制局限。",
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
    id: "lactulose",
    indicationQuizDistractorIds: [
      "amlodipine",
      "aciclovir",
      "levothyroxine",
    ],
    genericName: "乳果糖",
    brandNames: [],
    englishName: "Lactulose",
    category: "digestive",
    target: "在结肠经细菌分解产生有机酸，通过渗透作用通便并促进肠腔内氨的离子化",
    mechanismSteps: [
      {
        title: "基本以原形到达结肠",
        detail: "乳果糖口服后吸收很少，主要在结肠由细菌代谢。",
      },
      {
        title: "细菌分解生成有机酸",
        detail: "低分子有机酸使肠腔 pH 下降，并通过渗透效应增加结肠内容物的水分和体积。",
      },
      {
        title: "软化粪便并促进排便",
        detail: "内容物增加促进结肠蠕动、改善粪便性状，从而缓解便秘。",
      },
      {
        title: "酸化肠腔有助于减少氨吸收",
        detail: "肝性脑病中的作用包括把氨转为离子形式留在肠腔，以及促进排泄、改变细菌氮代谢等多个环节。",
      },
    ],
    indications: [
      "便秘",
      "肝性脑病及肝昏迷（所引 Duphalac 说明书范围）",
    ],
    adverseReactions: [
      "腹胀与排气增多：治疗初期较常见",
      "腹痛、恶心和呕吐",
      "腹泻：过量时更易发生，持续腹泻可导致电解质紊乱",
    ],
    memoryTip: "「乳果糖到结肠，产酸留水又留氨」——通便与肝性脑病用途沿两条机制理解。",
    diagram: {
      title: "结肠产酸 → 渗透性通便",
      nodes: [
        { id: "n0", label: "乳果糖", role: "drug" },
        { id: "n1", label: "结肠细菌", role: "target" },
        { id: "n2", label: "有机酸生成", role: "signal" },
        { id: "n3", label: "肠腔水分 ↑", role: "signal" },
        { id: "n4", label: "粪便软化", role: "effect" },
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
        title: "emc：Duphalac（lactulose）产品特性概要",
        url: "https://www.medicines.org.uk/emc/product/5525/smpc",
        sections: "第 4.1、4.3～4.4、4.8、5.1～5.2 节：便秘与肝性脑病用途、腹泻及电解质风险、结肠产酸机制。",
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
    id: "famotidine",
    genericName: "法莫替丁",
    brandNames: [],
    englishName: "Famotidine",
    category: "digestive",
    target: "竞争性阻断组胺 H2 受体，抑制胃酸分泌",
    targetQuizDistractorIds: [
      "amlodipine",
      "aciclovir",
      "levothyroxine",
    ],
    indicationQuizDistractorIds: [
      "amlodipine",
      "aciclovir",
      "levothyroxine",
    ],
    mechanismSteps: [
      {
        title: "竞争性阻断 H2 受体",
        detail: "阻断组胺对胃壁细胞的 H2 受体刺激。",
      },
      {
        title: "削弱促胃酸分泌信号",
        detail: "组胺介导的促酸作用减弱，基础及刺激后的胃酸分泌受到抑制。",
      },
      {
        title: "降低胃液酸浓度与分泌量",
        detail: "酸负荷下降，为酸相关黏膜损伤恢复提供条件。",
      },
      {
        title: "改善酸相关疾病",
        detail: "可用于溃疡及胃食管反流病；症状缓解不能排除胃部恶性病变。",
      },
    ],
    indications: [
      "活动性胃或十二指肠溃疡（所引片剂适用于成人及体重至少 40 kg 的儿童）",
      "胃食管反流病及相关糜烂性食管炎（所引片剂范围）",
      "成人病理性胃酸分泌过多，如卓-艾综合征",
    ],
    adverseReactions: [
      "头痛、头晕、便秘或腹泻",
      "意识混乱、谵妄等中枢反应：老年人及肾功能不全者风险增加",
      "中重度肾功能不全时可出现 QT 延长，需按肾功能调整方案",
      "严重过敏反应已有报告",
    ],
    memoryTip: "「替丁拦 H2，减少胃酸」——与抗过敏用的 H1 阻断药区分，并记得评估肾功能。",
    diagram: {
      title: "阻断组胺促酸信号 → 减少酸负荷",
      nodes: [
        { id: "n0", label: "法莫替丁", role: "drug" },
        { id: "n1", label: "H2 受体", role: "target" },
        { id: "n2", label: "促酸信号 ↓", role: "signal" },
        { id: "n3", label: "胃酸分泌 ↓", role: "signal" },
        { id: "n4", label: "酸损伤减轻", role: "effect" },
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
        title: "DailyMed：Famotidine 片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=54d93bf1-8f9a-981b-e063-6394a90a0fde&version=1",
        sections: "第 1、2.2、5～6、8.6、12.1 节：片剂范围、肾功能调整、中枢与 QT 风险、H2 阻断机制。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
  },
  {
    id: "metoclopramide",
    genericName: "甲氧氯普胺",
    brandNames: [],
    englishName: "Metoclopramide",
    category: "digestive",
    target: "多巴胺 D2 受体拮抗剂；促胃动力作用可能涉及增强组织对乙酰胆碱的反应",
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
        title: "增强上消化道胆碱能反应（推定）",
        detail: "促动力的完整机制尚未明确；说明书提出可能使组织对乙酰胆碱更敏感，不能把该解释当成全部机制。",
      },
      {
        title: "增强胃窦收缩并改善出口协调",
        detail: "胃窦收缩增强，幽门括约肌和十二指肠球部松弛。",
      },
      {
        title: "促进上段小肠蠕动与胃排空",
        detail: "十二指肠和空肠蠕动增加，使内容物向下转运加快。",
      },
      {
        title: "改善胃轻瘫相关症状",
        detail: "口服片用于成人糖尿病性胃轻瘫等特定情况；需限制疗程以降低运动障碍风险。",
      },
    ],
    indications: [
      "成人急性或复发性糖尿病性胃轻瘫症状（所引口服片说明书）",
      "成人常规治疗无效、已证实的有症状胃食管反流的短期治疗",
    ],
    adverseReactions: [
      "迟发性运动障碍可能不可逆，风险随累积剂量和疗程增加；通常避免超过 12 周",
      "急性肌张力障碍、静坐不能、帕金森样症状，罕见恶性综合征",
      "嗜睡、乏力或烦躁不安",
      "泌乳素升高；机械性梗阻、穿孔或消化道出血等不宜促进胃肠动力的情况禁用",
    ],
    memoryTip: "「甲氧氯普胺推动上消化道」——记胃排空，也记中枢运动不良反应与疗程限制。",
    diagram: {
      title: "促动力路径为推定；D2 拮抗另列",
      nodes: [
        { id: "drug", label: "甲氧氯普胺", role: "drug" },
        { id: "ach", label: "胆碱能反应", role: "target" },
        { id: "d2", label: "D2 受体", role: "target" },
        { id: "motility", label: "上消化道蠕动 ↑", role: "signal" },
        { id: "emptying", label: "胃排空加快", role: "signal" },
        { id: "effect", label: "胃轻瘫症状改善", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "ach", label: "可能增强", kind: "flow" },
        { from: "drug", to: "d2", label: "拮抗", kind: "inhibit" },
        { from: "ach", to: "motility", kind: "flow", label: "后续变化" },
        { from: "motility", to: "emptying", kind: "flow", label: "后续变化" },
        { from: "emptying", to: "effect", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "DailyMed：Metoclopramide 片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c143e210-4ce7-44e5-b1e2-bf0e6bfde485",
        sections: "黑框警告、第 1～2、4～6、11、12.1～12.2 节：成人口服用途、迟发性运动障碍、D2 拮抗与尚未完全明确的促动力机制。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
  },
  {
    id: "bisacodyl",
    genericName: "比沙可啶",
    brandNames: [],
    englishName: "Bisacodyl",
    category: "digestive",
    target: "经水解形成活性代谢物，在结肠局部促进蠕动和水、电解质在肠腔内积聚",
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
        title: "水解形成局部活性代谢物",
        detail: "肠溶片到达下消化道后释放，经水解形成 BHPM 等活性形式。",
      },
      {
        title: "刺激结肠及直肠黏膜",
        detail: "主要在下消化道局部发挥刺激性泻药作用。",
      },
      {
        title: "促进蠕动并增加肠腔水分",
        detail: "推进性运动增强，水和电解质积聚有助于软化并推进粪便。",
      },
      {
        title: "促进排便、短期缓解便秘",
        detail: "用于偶发性便秘；持续需要泻药时应查明原因，不能当作减重药。",
      },
    ],
    indications: [
      "成人偶发性便秘的短期缓解（所引成人肠溶片说明书）",
    ],
    adverseReactions: [
      "腹痛、腹部绞痛及腹泻",
      "过量或长期滥用可导致脱水、电解质紊乱和低钾血症",
      "少见直肠出血、结肠炎或过敏反应",
      "肠梗阻、急腹症、严重脱水为禁忌；本成人制剂不用于未满 18 岁人群",
    ],
    memoryTip: "「比沙可啶：结肠动起来，水分留下来」——短期通便，不靠腹泻减肥。",
    diagram: {
      title: "局部活性代谢物 → 蠕动与含水量增加",
      nodes: [
        { id: "n0", label: "比沙可啶", role: "drug" },
        { id: "n1", label: "结肠局部活性物", role: "target" },
        { id: "n2", label: "黏膜受到刺激", role: "signal" },
        { id: "n3", label: "蠕动、水分 ↑", role: "signal" },
        { id: "n4", label: "促进排便", role: "effect" },
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
        title: "emc：Dulcolax Adult 比沙可啶肠溶片说明书",
        url: "https://www.medicines.org.uk/emc/product/361/smpc",
        sections: "第 4.1～4.4、4.8、5.1～5.2 节：成人短期便秘、局部水解活化、泻药过用及肠梗阻等禁忌。",
      },
    ],
    sourcesCheckedOn: "2026-10-20",
  },
  {
    id: "macrogol-3350",
    genericName: "聚乙二醇电解质",
    brandNames: [],
    englishName: "Macrogol 3350 with electrolytes",
    category: "digestive",
    target: "聚乙二醇 3350 在肠腔发挥渗透作用，增加粪便含水量与体积",
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
        title: "聚乙二醇在肠腔发挥渗透作用",
        detail: "聚乙二醇 3350 几乎不经胃肠道吸收，主要在肠腔作用；本卡对应含电解质的便秘用制剂。",
      },
      {
        title: "增加粪便含水量和体积",
        detail: "粪便软化、体积增加，为后续推进和排出提供条件。",
      },
      {
        title: "促进结肠推进",
        detail: "增大的内容物通过神经肌肉通路促进结肠运动。",
      },
      {
        title: "帮助软化粪便排出",
        detail: "缓解慢性便秘，也可按所引制剂方案处理经确认的粪便嵌塞；不能直接套用到不同配方的肠道清洁制剂。",
      },
    ],
    indications: [
      "慢性便秘（所引含聚乙二醇 3350 与电解质的成人及青少年制剂）",
      "经评估确认的粪便嵌塞",
    ],
    adverseReactions: [
      "腹胀、腹痛、肠鸣或排气增加",
      "腹泻、恶心或呕吐；严重丢失水分时需评估",
      "电解质紊乱、外周水肿或过敏反应仍可发生",
      "肠梗阻、穿孔或严重炎症性肠病等情况禁用；不能靠通便掩盖这些病因",
    ],
    memoryTip: "「PEG 留住肠腔水，软化增容再推进」——含电解质不代表完全没有水盐紊乱风险。",
    diagram: {
      title: "肠腔渗透作用 → 软便与推进",
      nodes: [
        { id: "n0", label: "聚乙二醇 3350", role: "drug" },
        { id: "n1", label: "肠腔渗透作用", role: "target" },
        { id: "n2", label: "粪便水分与体积 ↑", role: "signal" },
        { id: "n3", label: "结肠推进 ↑", role: "signal" },
        { id: "n4", label: "排便更容易", role: "effect" },
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
        title: "emc：Movicol 聚乙二醇 3350 含电解质口服溶液用粉说明书",
        url: "https://www.medicines.org.uk/emc/product/1025/smpc",
        sections: "第 4.1～4.4、4.8、5.1～5.2 节：慢性便秘与粪便嵌塞、渗透作用、制剂范围和禁忌。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
  {
    id: "ursodeoxycholic-acid",
    genericName: "熊去氧胆酸",
    brandNames: [],
    englishName: "Ursodeoxycholic acid",
    category: "digestive",
    target: "改变胆汁胆固醇与胆汁酸的比例，降低胆汁成石性，促进合适胆固醇结石逐渐溶解",
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
        title: "改变胆汁中胆固醇与胆汁酸比例",
        detail: "以下步骤聚焦胆固醇结石溶解作用；不能把这条链等同于所有肝胆疾病的治疗机制。",
      },
      {
        title: "降低胆汁成石性",
        detail: "使胆汁中的胆固醇更易维持在溶解状态。",
      },
      {
        title: "促进合适结石缓慢溶解",
        detail: "针对经过筛选的未钙化胆固醇结石，作用是逐渐发生的，不是即时解除梗阻。",
      },
      {
        title: "用于特定胆汁相关疾病",
        detail: "还可用于无失代偿肝硬化的原发性胆汁性胆管炎；不同适应症须分别评估，并监测肝功能。",
      },
    ],
    indications: [
      "无失代偿肝硬化的原发性胆汁性胆管炎（PBC）",
      "不适合手术、胆囊功能良好者的透 X 线胆固醇结石溶解（所引制剂限定直径不超过 15 mm）",
    ],
    adverseReactions: [
      "软便或腹泻",
      "胆结石钙化，可影响继续溶石治疗",
      "少见过敏反应；PBC 治疗中可出现上腹痛等症状",
      "急性胆囊或胆道炎症、胆道梗阻、频发胆绞痛等情况禁用，需先明确病因",
    ],
    memoryTip: "「熊去调胆汁，溶石有条件」——不是所有胆结石都适用，也不是通用的保肝药。",
    diagram: {
      title: "胆固醇结石路径：改变胆汁 → 逐渐溶石",
      nodes: [
        { id: "n0", label: "熊去氧胆酸", role: "drug" },
        { id: "n1", label: "胆汁成分比例", role: "target" },
        { id: "n2", label: "胆汁成石性 ↓", role: "signal" },
        { id: "n3", label: "胆固醇保持溶解", role: "signal" },
        { id: "n4", label: "合适结石逐渐溶解", role: "effect" },
      ],
      edges: [
        { from: "n0", to: "n1", label: "改变", kind: "flow" },
        { from: "n1", to: "n2", kind: "flow", label: "后续变化" },
        { from: "n2", to: "n3", kind: "flow", label: "后续变化" },
        { from: "n3", to: "n4", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "emc：Ursodeoxycholic acid 250 mg 胶囊说明书",
        url: "https://www.medicines.org.uk/emc/product/14374/smpc",
        sections: "第 4.1～4.4、4.8、5.1 节：PBC 与胆固醇结石筛选条件、胆汁成分机制、监测和禁忌。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
  {
    id: "pantoprazole",
    genericName: "泮托拉唑",
    brandNames: [],
    englishName: "Pantoprazole",
    category: "digestive",
    target: "在胃壁细胞酸性环境中活化，抑制 H+/K+-ATP 酶（质子泵），阻断胃酸分泌末端环节",
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
        title: "在壁细胞酸性环境中活化",
        detail: "泮托拉唑转化为活性形式后作用于胃壁细胞的质子泵。",
      },
      {
        title: "抑制 H+/K+-ATP 酶",
        detail: "阻断胃酸分泌的末端步骤，不是直接中和胃腔中已经存在的胃酸。",
      },
      {
        title: "降低基础和刺激性胃酸分泌",
        detail: "无论上游由组胺、乙酰胆碱或胃泌素刺激，末端质子泵受抑均可减少酸分泌。",
      },
      {
        title: "改善相应酸相关疾病",
        detail: "用于所引 20 mg 制剂范围内的反流症状、反流性食管炎维持及特定 NSAID 溃疡预防；不同规格用途需分别核对。",
      },
    ],
    indications: [
      "有症状的胃食管反流病（所引制剂适用于成人及 12 岁及以上青少年）",
      "反流性食管炎的长期管理与复发预防",
      "需持续使用非选择性 NSAID 且具有风险的成人胃十二指肠溃疡预防",
    ],
    adverseReactions: [
      "头痛、腹泻、恶心或腹部不适",
      "长期用药可发生低镁血症、维生素 B12 吸收减少",
      "可增加部分胃肠道感染风险，长期治疗需定期评估",
      "可发生肾小管间质性肾炎或严重过敏反应；报警症状不能仅靠抑酸掩盖",
    ],
    memoryTip: "「泮托到酸处活化，关住末端质子泵」——不同于 H2 阻断，也不是即时中和胃酸。",
    diagram: {
      title: "酸性环境活化 → 抑制末端质子泵",
      nodes: [
        { id: "drug", label: "泮托拉唑", role: "drug" },
        { id: "active", label: "活性形式", role: "drug" },
        { id: "pump", label: "H+/K+-ATP 酶", role: "target" },
        { id: "acid", label: "胃酸分泌 ↓", role: "signal" },
        { id: "effect", label: "相应酸相关症状改善", role: "effect" },
      ],
      edges: [
        { from: "drug", to: "active", label: "酸性环境活化", kind: "flow" },
        { from: "active", to: "pump", label: "抑制", kind: "inhibit" },
        { from: "pump", to: "acid", label: "受抑后", kind: "flow" },
        { from: "acid", to: "effect", kind: "flow", label: "后续变化" },
      ],
    },
    sources: [
      {
        title: "emc：Pantoprazole 20 mg 肠溶片说明书",
        url: "https://www.medicines.org.uk/emc/product/450/smpc",
        sections: "第 4.1～4.5、4.8、5.1 节：20 mg 制剂用途、酸活化与质子泵机制、长期用药和肾脏风险。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
];
