import type { ClinicalTagId, DrugInteraction } from "../types";

export interface CardEnrichment {
  interactions?: DrugInteraction[];
  clinicalTags?: ClinicalTagId[];
}

/**
 * 高风险与高频学习卡片的药代特征标签及代表性药物相互作用（DDI）互链。
 * 依据公开说明书（DailyMed / emc）与临床药理共识整理，仅用于教学互链展示，
 * 不构成完整配伍禁忌清单；未收录于本卡片库的伴随用药不强行填写 targetCardId。
 */
export const CARD_ENRICHMENTS: Partial<Record<string, CardEnrichment>> = {
  warfarin: {
    clinicalTags: ["narrow-therapeutic-index", "hepatic-caution", "pregnancy-caution"],
    interactions: [
      {
        partner: "氟康唑",
        targetCardId: "fluconazole",
        mechanism: "抑制 CYP2C9（及 CYP3A4），显著减慢活性更强的 S-华法林代谢清除",
        consequence: "INR 明显升高、出血风险增加；合用时需加密监测 INR 并评估下调华法林剂量。",
      },
      {
        partner: "胺碘酮",
        targetCardId: "amiodarone",
        mechanism: "抑制 CYP2C9 等代谢酶，且胺碘酮半衰期极长、清除缓慢",
        consequence: "抗凝增强作用可延迟出现并在停药后持续数周至数月，常需下调华法林维持量并持续随访 INR。",
      },
      {
        partner: "阿司匹林",
        targetCardId: "aspirin",
        mechanism: "抗血小板作用与维生素 K 拮抗剂抗凝效应叠加，且阿司匹林可损伤胃黏膜",
        consequence: "显著增加消化道及颅内等严重出血风险；无明确联合指征时应避免盲目合用，联用需严密监护。",
      },
    ],
  },

  clopidogrel: {
    clinicalTags: ["prodrug", "hepatic-caution"],
    interactions: [
      {
        partner: "奥美拉唑",
        targetCardId: "omeprazole",
        mechanism: "抑制 CYP2C19，减少氯吡格雷前药向活性硫醇代谢物的肝内转化",
        consequence: "抗血小板聚集抑制效应减弱，说明书提示避免与奥美拉唑合用；确需 PPI 时常考虑对 CYP2C19 影响更小的替代品。",
      },
      {
        partner: "阿司匹林",
        targetCardId: "aspirin",
        mechanism: "分别阻断血小板 P2Y12 受体与 COX-1 途径，产生协同抗血小板效应",
        consequence: "双联抗血小板虽用于特定急性冠脉或支架术后指征，但出血风险显著升高，需严格把控疗程。",
      },
      {
        partner: "氟康唑",
        targetCardId: "fluconazole",
        mechanism: "抑制 CYP2C19，阻断氯吡格雷体内生物活化",
        consequence: "可能降低活性代谢物暴露并削弱抗血小板疗效，合用期间需评估心血管缺血风险与替代方案。",
      },
    ],
  },

  aspirin: {
    clinicalTags: ["renal-adjustment", "hepatic-caution", "pregnancy-caution"],
    interactions: [
      {
        partner: "华法林",
        targetCardId: "warfarin",
        mechanism: "抑制血小板聚集与抗凝血因子合成双重削弱止血功能，并伴胃黏膜损伤",
        consequence: "消化道及全身严重出血风险明显升高，合用必须有明确适应证并密切观察出血征象。",
      },
      {
        partner: "布洛芬",
        targetCardId: "ibuprofen",
        mechanism: "非选择性 NSAID 可竞争性占据血小板 COX-1 位点，干扰低剂量阿司匹林的不可逆乙酰化",
        consequence: "可能削弱低剂量阿司匹林的抗血小板心血管保护作用，同时叠加胃肠道溃疡与出血风险。",
      },
      {
        partner: "甲氨蝶呤",
        targetCardId: "methotrexate",
        mechanism: "水杨酸类可竞争肾小管主动分泌并置换血浆蛋白结合，减慢甲氨蝶呤清除",
        consequence: "升高甲氨蝶呤血药暴露并增加骨髓抑制、黏膜损伤及肾毒性风险，高剂量方案尤为警惕。",
      },
    ],
  },

  amiodarone: {
    clinicalTags: ["cyp-inhibitor", "hepatic-caution", "pregnancy-caution", "qt-prolongation"],
    interactions: [
      {
        partner: "华法林",
        targetCardId: "warfarin",
        mechanism: "抑制 CYP2C9，减慢华法林清除且因自身半衰期长使相互作用持久",
        consequence: "INR 显著升高并增加出血风险；加用胺碘酮常需经验性下调华法林剂量并长期监测 INR。",
      },
      {
        partner: "地高辛",
        targetCardId: "digoxin",
        mechanism: "抑制 P-糖蛋白（P-gp）外排并减少地高辛清除，使血药浓度明显上升",
        consequence: "易诱发地高辛中毒与心律失常；启动胺碘酮前宜测基线浓度并将地高辛剂量下调约 30%～50%。",
      },
      {
        partner: "左氧氟沙星等延长 QT 药物",
        targetCardId: "levofloxacin",
        mechanism: "共同延长心肌复极与 QT 间期，产生电生理复极延迟叠加",
        consequence: "增加尖端扭转型室性心动过速等恶性心律失常风险，合用前需评估 QTc、血钾与血镁。",
      },
    ],
  },

  digoxin: {
    clinicalTags: ["narrow-therapeutic-index", "renal-adjustment"],
    interactions: [
      {
        partner: "胺碘酮",
        targetCardId: "amiodarone",
        mechanism: "抑制 P-糖蛋白（P-gp）介导的肠道与肾脏外排，降低地高辛清除率",
        consequence: "地高辛血药浓度可显著升高，合用时通常需减量并严密监测血药浓度及中毒反应。",
      },
      {
        partner: "呋塞米",
        targetCardId: "furosemide",
        mechanism: "袢利尿剂引起低钾血症与低镁血症，提高心肌细胞对地高辛的敏感性",
        consequence: "即便地高辛血药浓度未超标，低钾低镁亦可诱发洋地黄中毒性心律失常，需常规监测电解质。",
      },
      {
        partner: "地尔硫䓬",
        targetCardId: "diltiazem",
        mechanism: "两者协同抑制房室结传导，且地尔硫䓬可抑制 P-gp 使地高辛浓度轻度升高",
        consequence: "增加严重心动过缓与房室传导阻滞风险，合用期间需监测心率、心电图与地高辛浓度。",
      },
    ],
  },

  captopril: {
    clinicalTags: ["renal-adjustment", "pregnancy-caution"],
    interactions: [
      {
        partner: "螺内酯",
        targetCardId: "spironolactone",
        mechanism: "ACE 抑制剂减少醛固酮生成，与醛固酮受体拮抗剂产生药效学保钾叠加",
        consequence: "显著升高高钾血症风险（尤其合并慢性肾病或糖尿病时），需定期监测血钾与肾功能。",
      },
      {
        partner: "布洛芬",
        targetCardId: "ibuprofen",
        mechanism: "NSAID 收缩入球小动脉并抑制肾前列腺素，削弱 ACE 抑制剂降压效果并降低肾小球滤过压",
        consequence: "降压疗效减弱，且与利尿剂等叠加时可诱发急性肾损伤与高钾血症。",
      },
      {
        partner: "氯沙坦（或其他 ARB / 沙库巴曲缬沙坦）",
        targetCardId: "losartan",
        mechanism: "双重阻断肾素-血管紧张素系统，或近端合用脑啡肽酶抑制剂导致缓激肽蓄积",
        consequence: "一般不推荐 ACEi 与 ARB 联用，以免叠加低血压、高钾与肾损害；换用沙库巴曲缬沙坦须严格满足 36 小时洗脱期。",
      },
    ],
  },

  losartan: {
    clinicalTags: ["hepatic-caution", "renal-adjustment", "pregnancy-caution"],
    interactions: [
      {
        partner: "螺内酯",
        targetCardId: "spironolactone",
        mechanism: "阻断 AT1 受体降低醛固酮水平，与保钾利尿剂协同减少肾脏排钾",
        consequence: "高钾血症及肾功能恶化风险升高，合用时需定期复查血钾与血肌酐。",
      },
      {
        partner: "布洛芬",
        targetCardId: "ibuprofen",
        mechanism: "NSAID 抑制前列腺素合成，减弱扩张出球小动脉状态下的肾小球滤过动力与降压反应",
        consequence: "可能降低抗高血压疗效并诱发肾功能急性下降，老年或容量不足患者尤为明显。",
      },
      {
        partner: "氟康唑",
        targetCardId: "fluconazole",
        mechanism: "抑制 CYP2C9，减少氯沙坦向活性更强的羧酸代谢物（E-3174）转化",
        consequence: "可能降低活性代谢物暴露并削弱降压或靶器官保护效应，合用期间需关注血压控制。",
      },
    ],
  },

  spironolactone: {
    clinicalTags: ["renal-adjustment", "pregnancy-caution"],
    interactions: [
      {
        partner: "卡托普利",
        targetCardId: "captopril",
        mechanism: "双方均抑制醛固酮通路介导的远曲小管与集合管排钾过程",
        consequence: "易诱发重度高钾血症甚至致命性心律失常，肾功能不全或合用补钾制剂时尤需严密监测。",
      },
      {
        partner: "布洛芬",
        targetCardId: "ibuprofen",
        mechanism: "NSAID 抑制肾前列腺素合成，降低肾血流并削弱利尿及排钾调节",
        consequence: "可减弱螺内酯的利尿降压效果，并增加高钾血症与急性肾损伤风险。",
      },
      {
        partner: "锂制剂（碳酸锂等）",
        mechanism: "利尿与钠平衡改变减少近端肾小管对锂的清除",
        consequence: "可使血锂浓度升高并诱发锂中毒（震颤、共济失调、意识改变），通常应避免合用或严密测血锂。",
      },
    ],
  },

  nitroglycerin: {
    interactions: [
      {
        partner: "西地那非等 PDE5 抑制剂",
        mechanism: "硝酸甘油释放 NO 升高 cGMP，PDE5 抑制剂阻断 cGMP 降解，强力放大血管平滑肌松弛",
        consequence: "可致骤发、严重甚至致命的低血压及心肌灌注不足，说明书严禁与任何 PDE5 抑制剂合用。",
      },
      {
        partner: "利奥西呱（可溶性鸟苷酸环化酶刺激剂）",
        mechanism: "作用于同一 NO–sGC–cGMP 信号通路，产生剧烈协同扩血管反应",
        consequence: "可引起严重低血压，禁止与硝酸酯类药物联合使用。",
      },
      {
        partner: "氨氯地平",
        targetCardId: "amlodipine",
        mechanism: "两药外周血管扩张及降压作用在药效学上叠加",
        consequence: "可能加重直立性低血压、头晕或晕厥，舌下含服硝酸甘油时宜取坐位并关注血压变化。",
      },
    ],
  },

  atorvastatin: {
    clinicalTags: ["hepatic-caution", "pregnancy-caution"],
    interactions: [
      {
        partner: "地尔硫䓬",
        targetCardId: "diltiazem",
        mechanism: "地尔硫䓬中等强度抑制 CYP3A4，减慢阿托伐他汀首过及全身代谢清除",
        consequence: "升高阿托伐他汀血药浓度并增加肌痛、肌病及横纹肌溶解风险，宜关注起始剂量与肌症状。",
      },
      {
        partner: "克拉霉素（强 CYP3A4 抑制剂）",
        mechanism: "强效抑制 CYP3A4（及部分 OATP1B1 转运），大幅提高阿托伐他汀全身暴露",
        consequence: "显著增加横纹肌溶解风险；说明书限制与克拉霉素合用时阿托伐他汀每日不得超过 20 mg。",
      },
      {
        partner: "环孢素 / 吉非罗齐",
        mechanism: "强力抑制肝脏摄取转运体 OATP1B1 及 CYP3A4（环孢素），或产生药动/药效学肌毒性叠加（吉非罗齐）",
        consequence: "使他汀血浆暴露急剧升高并诱发严重肌病或横纹肌溶解，说明书通常不建议合用。",
      },
    ],
  },

  rosuvastatin: {
    clinicalTags: ["renal-adjustment", "hepatic-caution", "pregnancy-caution"],
    interactions: [
      {
        partner: "环孢素",
        mechanism: "抑制 OATP1B1 等肝脏摄取转运体，使瑞舒伐他汀血浆暴露显著成倍升高",
        consequence: "大幅增加肌病和横纹肌溶解风险；说明书规定合用时瑞舒伐他汀每日不得超过 5 mg。",
      },
      {
        partner: "吉非罗齐",
        mechanism: "抑制 OATP1B1 转运并叠加骨骼肌毒性",
        consequence: "显著升高瑞舒伐他汀暴露与横纹肌溶解风险，应避免合用；确需联用时需严格限制日剂量。",
      },
      {
        partner: "华法林",
        targetCardId: "warfarin",
        mechanism: "瑞舒伐他汀虽极少经 CYP 代谢，但临床观察合用时可增强华法林抗凝反应（机制未完全阐明）",
        consequence: "可能引起 INR 升高并增加出血风险，启动或调整瑞舒伐他汀剂量后应及时复查 INR。",
      },
    ],
  },

  apixaban: {
    clinicalTags: ["renal-adjustment", "hepatic-caution"],
    interactions: [
      {
        partner: "强效 CYP3A4 与 P-gp 双重抑制剂（如酮康唑、伊曲康唑、利托那韦）",
        mechanism: "阿哌沙班经 CYP3A4 代谢及 P-gp/BCRP 外排，双重抑制显著减少清除并升高暴露",
        consequence: "出血风险升高；正在使用 5 mg 或 10 mg 每日两次时通常需剂量减半，若已用 2.5 mg 每日两次则应避免合用。",
      },
      {
        partner: "卡马西平（强效 CYP3A4 与 P-gp 诱导剂）",
        targetCardId: "carbamazepine",
        mechanism: "强效诱导 CYP3A4 与 P-gp 转运，加速阿哌沙班清除并显著拉低血药浓度",
        consequence: "抗凝效应不足并增加卒中或静脉血栓复发风险，说明书明确避免联合使用。",
      },
      {
        partner: "阿司匹林",
        targetCardId: "aspirin",
        mechanism: "抗血小板作用及胃黏膜损伤与直接 Xa 因子抑制剂抗凝作用叠加",
        consequence: "显著增加消化道和颅内出血风险，除非存在明确联合抗栓指征，否则需谨慎评估。",
      },
    ],
  },

  rivaroxaban: {
    clinicalTags: ["renal-adjustment", "hepatic-caution"],
    interactions: [
      {
        partner: "强效 CYP3A4 与 P-gp 双重抑制剂（如酮康唑、利托那韦）",
        mechanism: "同时阻断 CYP3A4 肝代谢及 P-gp 肾肠外排，大幅升高利伐沙班全身暴露",
        consequence: "严重出血风险骤增；不同于阿哌沙班减量策略，利伐沙班说明书明确避免与强效双重抑制剂合用。",
      },
      {
        partner: "地尔硫䓬（等中效 CYP3A4/P-gp 抑制剂，伴肾功能不全时尤须警惕）",
        targetCardId: "diltiazem",
        mechanism: "中效酶与转运体抑制叠加肾清除减慢，共同推高利伐沙班血药浓度",
        consequence: "在肾功能受损（如 CrCl 15～<80 mL/min）患者中可明显放大出血风险，需充分评估获益风险。",
      },
      {
        partner: "卡马西平（强效 CYP3A4 与 P-gp 诱导剂）",
        targetCardId: "carbamazepine",
        mechanism: "显著诱导 CYP3A4 与 P-gp，加速利伐沙班消除并降低有效抗凝暴露",
        consequence: "抗凝保护减弱并升高血栓栓塞风险，说明书建议避免合用。",
      },
    ],
  },

  diltiazem: {
    clinicalTags: ["cyp-inhibitor", "hepatic-caution"],
    interactions: [
      {
        partner: "美托洛尔",
        targetCardId: "metoprolol",
        mechanism: "两者均抑制窦房结自律性、房室结传导及心肌收缩力，产生心脏负性作用叠加",
        consequence: "可诱发严重心动过缓、高度房室传导阻滞、低血压或心力衰竭加重，需严密监测心率与心电图。",
      },
      {
        partner: "秋水仙碱",
        targetCardId: "colchicine",
        mechanism: "地尔硫䓬中等强度抑制 CYP3A4 与 P-gp，减少秋水仙碱代谢及外排清除",
        consequence: "秋水仙碱血药浓度升高并增加神经肌肉毒性与骨髓抑制风险；肝或肾功能受损者禁忌合用。",
      },
      {
        partner: "地高辛",
        targetCardId: "digoxin",
        mechanism: "协同减慢房室传导，并可能通过抑制 P-gp 轻度升高地高辛浓度",
        consequence: "增加心动过缓及传导阻滞风险，合用时应监测脉搏、心电图及地高辛血药浓度。",
      },
    ],
  },

  omeprazole: {
    clinicalTags: ["cyp-inhibitor", "hepatic-caution"],
    interactions: [
      {
        partner: "氯吡格雷",
        targetCardId: "clopidogrel",
        mechanism: "抑制 CYP2C19，阻断氯吡格雷前药向活性代谢物转化",
        consequence: "降低氯吡格雷抗血小板疗效，说明书建议避免合用；如需抑酸保护可评估改用泮托拉唑等对 CYP2C19 影响更小的药物。",
      },
      {
        partner: "地西泮",
        targetCardId: "diazepam",
        mechanism: "抑制 CYP2C19，减慢地西泮经肝药酶的去甲基代谢清除",
        consequence: "延长地西泮半衰期并增加嗜睡、镇静蓄积及跌倒风险，老年或长程合用时需注意观察。",
      },
      {
        partner: "甲氨蝶呤（尤指高剂量方案）",
        targetCardId: "methotrexate",
        mechanism: "抑制肾小管有机阴离子转运，延迟高剂量甲氨蝶呤及其代谢物排出",
        consequence: "可能导致甲氨蝶呤血药浓度持续偏高及严重骨髓抑制或黏膜毒性，高剂量治疗期间常需权衡暂停 PPI。",
      },
    ],
  },

  pantoprazole: {
    clinicalTags: ["hepatic-caution"],
    interactions: [
      {
        partner: "氯吡格雷",
        targetCardId: "clopidogrel",
        mechanism: "泮托拉唑对 CYP2C19 的抑制能力明显弱于奥美拉唑，对氯吡格雷前药活化的干扰较小",
        consequence: "在确需联合质子泵抑制剂预防消化道出血时，常作为较奥美拉唑更优的替代选择，但仍需结合患者整体方案评估。",
      },
      {
        partner: "甲氨蝶呤（尤指高剂量方案）",
        targetCardId: "methotrexate",
        mechanism: "质子泵抑制剂类可干扰肾小管主动分泌通道，延迟高剂量甲氨蝶呤清除",
        consequence: "存在甲氨蝶呤蓄积与毒性增强风险，高剂量方案期间需密切监测血药浓度或暂停 PPI。",
      },
      {
        partner: "吉非替尼（依赖胃酸溶解吸收的药物）",
        targetCardId: "gefitinib",
        mechanism: "持久升高胃内 pH，降低弱碱性药物吉非替尼在胃肠道的溶解度与吸收",
        consequence: "可明显降低吉非替尼血药暴露并影响抗肿瘤疗效，合用前须核对靶向药说明书的抑酸药交互限制。",
      },
    ],
  },

  fluconazole: {
    clinicalTags: [
      "cyp-inhibitor",
      "renal-adjustment",
      "hepatic-caution",
      "pregnancy-caution",
      "qt-prolongation",
    ],
    interactions: [
      {
        partner: "华法林",
        targetCardId: "warfarin",
        mechanism: "强效抑制 CYP2C9，阻断活性 S-华法林经肝脏氧化代谢",
        consequence: "凝血酶原时间与 INR 显著延长，短程合用即可引起严重出血，需严密监测 INR 并调整华法林剂量。",
      },
      {
        partner: "苯妥英钠",
        targetCardId: "phenytoin",
        mechanism: "强效抑制 CYP2C9 与 CYP2C19，阻断苯妥英钠呈非线性饱和特征的代谢通路",
        consequence: "苯妥英钠血药浓度易迅速攀升并引发眼球震颤、共济失调等中毒症状，需监测血药浓度并下调剂量。",
      },
      {
        partner: "胺碘酮等延长 QT 药物",
        targetCardId: "amiodarone",
        mechanism: "两者均延长心肌动作电位复极并增加心室电不稳定性（且氟康唑可抑制经 CYP3A4 代谢药的清除）",
        consequence: "QT 间期延长叠加并升高尖端扭转型室速风险，合用前应评估心电图 QTc 与电解质。",
      },
    ],
  },

  vancomycin: {
    clinicalTags: ["narrow-therapeutic-index", "renal-adjustment"],
    interactions: [
      {
        partner: "庆大霉素",
        targetCardId: "gentamicin",
        mechanism: "两药均具有近端肾小管毒性及耳蜗/前庭毛细胞毒性，合用产生器官毒性协同叠加",
        consequence: "显著升高急性肾损伤及不可逆耳聋/眩晕风险，静脉联合时需严密监测肾功能、谷浓度/AUC 与听力。",
      },
      {
        partner: "两性霉素 B",
        targetCardId: "amphotericin-b",
        mechanism: "两性霉素 B 诱发肾血管收缩与肾小管损伤，与万古霉素肾毒性叠加",
        consequence: "急性肾损伤风险明显升高，联合治疗期间需严密监测血肌酐、尿量及血钾、血镁。",
      },
      {
        partner: "呋塞米",
        targetCardId: "furosemide",
        mechanism: "利尿所致血容量不足加重万古霉素肾蓄积，同时叠加内耳毒性风险",
        consequence: "可能放大肾功能恶化及耳鸣、听力下降风险，大剂量或快速静脉给药时尤需警惕。",
      },
    ],
  },

  linezolid: {
    interactions: [
      {
        partner: "氟西汀",
        targetCardId: "fluoxetine",
        mechanism: "利奈唑胺具可逆性非选择性单胺氧化酶抑制（MAOI）作用，与 SSRI 协同引起突触 5-羟色胺过度蓄积",
        consequence: "可诱发危及生命的血清素综合征（高热、肌阵挛、精神状态改变、自主神经亢进）；因氟西汀洗脱期极长，一般禁忌合用。",
      },
      {
        partner: "舍曲林",
        targetCardId: "sertraline",
        mechanism: "MAOI 与 5-羟色胺再摄取抑制作用叠加，阻断神经递质降解与回收",
        consequence: "血清素综合征风险显著升高；除非缺乏替代抗菌方案，否则避免合用，必要时需停用 SSRI 并严密监护。",
      },
      {
        partner: "肾上腺素等拟交感胺类药物",
        targetCardId: "epinephrine",
        mechanism: "抑制单胺氧化酶减少儿茶酚胺降解，增强血管活性胺的升压效应",
        consequence: "可能引起血压骤升与心律失常，联合静脉泵入血管活性药时应从更低起始剂量滴定并监测血压。",
      },
    ],
  },

  metronidazole: {
    clinicalTags: ["cyp-inhibitor", "hepatic-caution", "pregnancy-caution"],
    interactions: [
      {
        partner: "华法林",
        targetCardId: "warfarin",
        mechanism: "抑制 CYP2C9，显著减少 S-华法林立体异构体的肝内代谢",
        consequence: "INR 快速升高并增加严重出血风险，合用期间需密切复查 INR 并评估下调华法林剂量。",
      },
      {
        partner: "乙醇（含酒精饮品或制剂）",
        mechanism: "合用可出现潮红、恶心呕吐、心动过速等双硫仑样反应；其机制尚存争议，不能把乙醛脱氢酶抑制写成唯一定论",
        consequence: "所引说明书明确要求用药期间及停药后至少 3 天内避免饮酒或使用含酒精的药物、食物。",
      },
      {
        partner: "锂制剂（碳酸锂等）",
        mechanism: "甲硝唑可降低肾脏对锂离子的清除率，促使锂在体内蓄积",
        consequence: "可升高血锂浓度并诱发锂中毒或肾功能异常，合用时应严密监测血锂与血肌酐。",
      },
    ],
  },

  carbamazepine: {
    clinicalTags: [
      "narrow-therapeutic-index",
      "cyp-inducer",
      "hepatic-caution",
      "pregnancy-caution",
    ],
    interactions: [
      {
        partner: "丙戊酸钠",
        targetCardId: "valproate",
        mechanism: "卡马西平诱导丙戊酸代谢降低其浓度，而丙戊酸抑制环氧化物水解酶升高卡马西平-10,11-环氧化物",
        consequence: "双向复杂交互：丙戊酸抗癫痫疗效可能减弱，同时活性环氧化物蓄积可致复视、共济失调等神经毒性。",
      },
      {
        partner: "阿哌沙班（及利伐沙班等 DOAC）",
        targetCardId: "apixaban",
        mechanism: "强效诱导 CYP3A4 与 P-gp，大幅加速直接口服抗凝药的代谢与外排",
        consequence: "抗凝血药暴露明显下降并升高卒中或静脉血栓复发风险，说明书通常建议避免合用。",
      },
      {
        partner: "苯妥英钠",
        targetCardId: "phenytoin",
        mechanism: "双方均具强肝药酶诱导作用，导致代谢酶竞争与相互诱导",
        consequence: "可使任一方血药浓度出现波动或降低，联合及调整剂量时需依托治疗药物监测（TDM）。",
      },
    ],
  },

  phenytoin: {
    clinicalTags: [
      "narrow-therapeutic-index",
      "cyp-inducer",
      "hepatic-caution",
      "pregnancy-caution",
    ],
    interactions: [
      {
        partner: "丙戊酸钠",
        targetCardId: "valproate",
        mechanism: "丙戊酸钠竞争白蛋白结合位点置换出游离苯妥英，并抑制 CYP2C9 减慢其代谢",
        consequence: "即使血清总苯妥英浓度看似正常或偏低，游离浓度升高仍可引发眼震、共济失调等急性中毒。",
      },
      {
        partner: "氟康唑",
        targetCardId: "fluconazole",
        mechanism: "抑制 CYP2C9 与 CYP2C19，阻断苯妥英钠的饱和动力学清除通路",
        consequence: "苯妥英钠血药浓度易呈非线性陡增并导致中枢神经毒性，合用时需严密测血药浓度并适时减量。",
      },
      {
        partner: "华法林",
        targetCardId: "warfarin",
        mechanism: "强效诱导 CYP 酶（初期偶见蛋白结合置换致短暂增强，随后酶诱导使华法林代谢加快）",
        consequence: "导致 INR 双向波动且难以预测，合用或撤停苯妥英钠期间均须频繁监测 INR。",
      },
    ],
  },

  valproate: {
    clinicalTags: [
      "narrow-therapeutic-index",
      "cyp-inhibitor",
      "hepatic-caution",
      "pregnancy-caution",
    ],
    interactions: [
      {
        partner: "卡马西平",
        targetCardId: "carbamazepine",
        mechanism: "抑制环氧化物水解酶，阻断卡马西平活性环氧化物代谢物进一步失活（同时卡马西平加速丙戊酸代谢）",
        consequence: "可升高卡马西平活性环氧化物水平并诱发头晕、复视、嗜睡等毒性，且常需监测双方血药浓度。",
      },
      {
        partner: "苯妥英钠",
        targetCardId: "phenytoin",
        mechanism: "置换苯妥英钠血浆蛋白结合并抑制其肝药酶代谢清除",
        consequence: "游离苯妥英比例上升，总浓度正常时也可能发生苯妥英中毒，必要时应检测游离血药浓度。",
      },
      {
        partner: "碳青霉烯类抗菌药（如美罗培南）",
        mechanism: "抑制酰基肽水解酶等途径，阻碍丙戊酸葡萄糖醛酸结合物水解再吸收并加速清除",
        consequence: "可在数日内使丙戊酸血药浓度急剧下降并诱发癫痫突破发作，临床一般应避免合用。",
      },
    ],
  },

  methotrexate: {
    clinicalTags: [
      "narrow-therapeutic-index",
      "renal-adjustment",
      "hepatic-caution",
      "pregnancy-caution",
    ],
    interactions: [
      {
        partner: "复方磺胺甲噁唑",
        targetCardId: "trimethoprim-sulfamethoxazole",
        mechanism: "双重阻断叶酸代谢通路叠加骨髓抑制，并竞争肾小管分泌与血浆蛋白结合",
        consequence: "大幅升高重度全血细胞减少、口腔黏膜炎及致命感染风险，临床通常避免或禁忌合用。",
      },
      {
        partner: "布洛芬",
        targetCardId: "ibuprofen",
        mechanism: "NSAID 减少肾血流并竞争肾小管有机酸分泌通道，显著减慢甲氨蝶呤消除",
        consequence: "可引发甲氨蝶呤蓄积与致命性骨髓抑制、急性肾损伤及消化道毒性，高剂量甲氨蝶呤严禁联用。",
      },
      {
        partner: "奥美拉唑",
        targetCardId: "omeprazole",
        mechanism: "抑制肾小管转运并延迟高剂量甲氨蝶呤及其代谢物排泄",
        consequence: "高剂量方案合用时可能造成消除延迟及严重毒性，需监测甲氨蝶呤浓度或提前停用 PPI。",
      },
    ],
  },

  aminophylline: {
    clinicalTags: ["narrow-therapeutic-index", "hepatic-caution"],
    interactions: [
      {
        partner: "卡马西平",
        targetCardId: "carbamazepine",
        mechanism: "诱导茶碱主要代谢酶 CYP1A2（及其他肝药酶），加速氨茶碱释放的茶碱清除",
        consequence: "茶碱血药浓度下降、平喘效果减弱；加用或停用诱导剂时均需复核茶碱血药浓度。",
      },
      {
        partner: "环丙沙星 / 氟伏沙明等 CYP1A2 抑制剂",
        mechanism: "抑制茶碱关键代谢酶 CYP1A2，显著降低茶碱肝清除率",
        consequence: "血浆茶碱浓度易升至中毒范围（>20 μg/mL），诱发顽固呕吐、心动过速甚至惊厥。",
      },
      {
        partner: "腺苷",
        targetCardId: "adenosine",
        mechanism: "茶碱竞争性拮抗心肌与血管 A1/A2 腺苷受体",
        consequence: "可明显削弱腺苷终止室上性心动过速的效果，使用腺苷前需留意近期茶碱类用药史。",
      },
    ],
  },

  furosemide: {
    clinicalTags: ["renal-adjustment"],
    interactions: [
      {
        partner: "地高辛",
        targetCardId: "digoxin",
        mechanism: "袢利尿剂排钾排镁导致低钾血症与低镁血症，增加心肌异位自律性并增强地高辛毒性",
        consequence: "显著升高洋地黄中毒性心律失常风险，合用期间需常规监测血钾、血镁并及时补充。",
      },
      {
        partner: "庆大霉素",
        targetCardId: "gentamicin",
        mechanism: "利尿所致血容量不足加重氨基糖苷类肾蓄积，同时两药耳蜗毒性药效学叠加",
        consequence: "显著增加不可逆耳毒性与急性肾损伤风险，快速静脉推注大剂量呋塞米时尤为突出。",
      },
      {
        partner: "布洛芬",
        targetCardId: "ibuprofen",
        mechanism: "NSAID 抑制肾前列腺素合成，降低髓袢血流并拮抗呋塞米的排钠利尿效应",
        consequence: "减弱利尿消肿与降压疗效，并可能诱发肾前性氮质血症或急性肾功能恶化。",
      },
    ],
  },

  metformin: {
    clinicalTags: ["renal-adjustment", "hepatic-caution"],
    interactions: [
      {
        partner: "含碘血管内造影剂",
        mechanism: "造影剂相关急性肾损伤可骤然阻断二甲双胍经肾排泄",
        consequence: "增加二甲双胍体内蓄积与罕见但致命的乳酸性酸中毒风险，肾功能偏低或特定造影情境须按规范暂停并复查肾功能。",
      },
      {
        partner: "泼尼松龙",
        targetCardId: "prednisolone",
        mechanism: "糖皮质激素促进糖异生并引起外周胰岛素抵抗，在药效学上拮抗降糖效应",
        consequence: "可能导致血糖升高并削弱二甲双胍控糖效果，启用或减停激素期间需加强血糖监测。",
      },
      {
        partner: "肾小管 OCT2/MATE 转运体抑制剂（如西咪替丁、多替拉韦）",
        mechanism: "竞争或抑制肾小管有机阳离子转运体，减少二甲双胍肾主动分泌",
        consequence: "升高二甲双胍血药暴露，合并肾功能边缘下降时需警惕胃肠道反应加重要求或酸中毒风险。",
      },
    ],
  },

  colchicine: {
    clinicalTags: ["narrow-therapeutic-index", "renal-adjustment", "hepatic-caution"],
    interactions: [
      {
        partner: "地尔硫䓬",
        targetCardId: "diltiazem",
        mechanism: "地尔硫䓬同时抑制 CYP3A4 与 P-gp，显著减慢秋水仙碱代谢与胆汁/肾脏外排",
        consequence: "血药浓度升高并诱发神经肌肉毒性与全血细胞减少；肝或肾功能受损者禁忌合用，正常者需按说明书减量。",
      },
      {
        partner: "克拉霉素（或伊曲康唑等强效 CYP3A4/P-gp 抑制剂）",
        mechanism: "强力阻断 CYP3A4 代谢及 P-gp 外排转运，使秋水仙碱全身暴露急剧上升",
        consequence: "已有致命性中毒报告；伴肝或肾功能损害者严禁合用，肝肾正常者亦需严格下调剂量或停药。",
      },
      {
        partner: "阿托伐他汀",
        targetCardId: "atorvastatin",
        mechanism: "两者在骨骼肌毒性上存在药效学叠加，且均为 CYP3A4/P-gp 相关底物",
        consequence: "合用可增加肌病与横纹肌溶解风险（肾功能不全患者更易发生），需注意肌痛、乏力及肌酸激酶监测。",
      },
    ],
  },

  "tenofovir-disoproxil": {
    clinicalTags: ["prodrug", "renal-adjustment"],
    interactions: [
      {
        partner: "布洛芬（尤指高剂量或长期多药合用）",
        targetCardId: "ibuprofen",
        mechanism: "NSAID 抑制肾前列腺素并降低肾血流量，与替诺福韦的近端肾小管毒性叠加",
        consequence: "已有联合高剂量或多种 NSAID 后发生急性肾衰竭或 Fanconi 综合征加重的报告，应监测肾功能并避免长期大剂量联用。",
      },
      {
        partner: "阿昔洛韦",
        targetCardId: "aciclovir",
        mechanism: "竞争肾小管有机阴离子转运体主动分泌通道，并可能叠加肾小管损伤风险",
        consequence: "可升高替诺福韦或阿昔洛韦血药浓度，增加肾功能损害与低磷血症风险，合用期间需监测肾功能。",
      },
      {
        partner: "利托那韦增效的蛋白酶抑制剂（如洛匹那韦/利托那韦）",
        mechanism: "抑制肠道 P-gp 外排及可能影响肾小管转运体，升高替诺福韦全身暴露",
        consequence: "替诺福韦暴露可升高约 30% 以上，从而放大近端肾小管病变与骨密度下降风险，需定期随访肾功能与血磷。",
      },
    ],
  },

  diazepam: {
    clinicalTags: ["hepatic-caution", "pregnancy-caution"],
    interactions: [
      {
        partner: "吗啡（及其他阿片类镇痛药）",
        targetCardId: "morphine",
        mechanism: "苯二氮䓬类与阿片类药物在中枢神经系统与呼吸中枢产生强协同抑制",
        consequence: "FDA 黑框警示：可致深度镇静、严重呼吸抑制、昏迷甚至死亡，仅在无替代方案时以最低有效剂量极短期使用。",
      },
      {
        partner: "奥美拉唑",
        targetCardId: "omeprazole",
        mechanism: "抑制 CYP2C19，减慢地西泮的肝内氧化去甲基代谢",
        consequence: "地西泮清除减慢、作用时间延长，可能加重日间嗜睡、共济失调及跌倒风险。",
      },
      {
        partner: "氟康唑",
        targetCardId: "fluconazole",
        mechanism: "抑制 CYP3A4 与 CYP2C19，阻断地西泮多条肝药酶消除路径",
        consequence: "显著升高地西泮血药暴露并延长镇静与呼吸抑制风险，合用时需考虑减量并严密观察。",
      },
    ],
  },

  "baloxavir-marboxil": {
    clinicalTags: ["prodrug"],
    interactions: [
      {
        partner: "多价阳离子制剂（含钙、铁、镁、铝、锌补充剂或抗酸药及乳制品）",
        mechanism: "玛巴洛沙韦活性代谢物可与二价或三价金属阳离子发生螯合，减少胃肠道吸收",
        consequence: "显著降低血药暴露并可能削弱抗流感疗效；DailyMed 说明书建议避免与乳制品、钙强化饮料及含多价阳离子的泻药、抗酸药或矿物质补充剂同服。",
      },
      {
        partner: "硫糖铝（含铝制剂）",
        targetCardId: "sucralfate",
        mechanism: "硫糖铝所含铝离子可在消化道与玛巴洛沙韦发生螯合吸附",
        consequence: "可明显降低玛巴洛沙韦生物利用度，联用时需注意避开同服并评估替代抑酸方案。",
      },
      {
        partner: "减毒活流感疫苗（LAIV）",
        mechanism: "抗病毒作用可抑制减毒活疫苗病毒在呼吸道黏膜的复制",
        consequence: "可能降低减毒活流感疫苗的免疫应答，接种前后需按规范间隔使用抗病毒药。",
      },
    ],
  },

  "nirmatrelvir-ritonavir": {
    clinicalTags: ["cyp-inhibitor", "renal-adjustment", "hepatic-caution"],
    interactions: [
      {
        partner: "胺碘酮",
        targetCardId: "amiodarone",
        mechanism: "利托那韦强效抑制 CYP3A4，显著阻断胺碘酮代谢清除且后者半衰期极长",
        consequence: "可导致胺碘酮蓄积并诱发危及生命的恶性心律失常或严重心动过缓，说明书列为禁忌合用。",
      },
      {
        partner: "卡马西平",
        targetCardId: "carbamazepine",
        mechanism: "卡马西平强效诱导 CYP3A4，显著加速奈玛特韦与利托那韦代谢消除",
        consequence: "大幅降低抗病毒血药浓度并可能导致抗病毒失败与耐药突变，说明书列为禁忌合用。",
      },
      {
        partner: "利伐沙班",
        targetCardId: "rivaroxaban",
        mechanism: "利托那韦强效抑制 CYP3A4 与 P-gp，大幅减少利伐沙班代谢与外排清除",
        consequence: "利伐沙班全身暴露升高并显著增加大出血风险，通常应避免合用或评估短期暂停/替换抗凝方案。",
      },
      {
        partner: "阿托伐他汀",
        targetCardId: "atorvastatin",
        mechanism: "强效抑制 CYP3A4（及 OATP1B1 等转运体），显著升高部分他汀血药浓度",
        consequence: "增加肌痛与横纹肌溶解风险；辛伐他汀、洛伐他汀为禁忌，联用阿托伐他汀时说明书通常建议在 5 天疗程期间考虑暂停或严密监测。",
      },
    ],
  },

  bictegravir: {
    clinicalTags: ["renal-adjustment", "hepatic-caution"],
    interactions: [
      {
        partner: "卡马西平（及利福平等强效诱导剂）",
        targetCardId: "carbamazepine",
        mechanism: "强效诱导 CYP3A4 与 UGT1A1（及 P-gp），加速比克替拉韦与 TAF 代谢清除",
        consequence: "显著降低比克替拉韦谷浓度并增加病毒学失败与耐药风险；利福平禁忌合用，卡马西平、苯妥英钠等不推荐联用。",
      },
      {
        partner: "二甲双胍",
        targetCardId: "metformin",
        mechanism: "比克替拉韦抑制肾小管有机阳离子转运体 OCT2 与 MATE1，减少二甲双胍肾主动分泌",
        consequence: "升高二甲双胍血浆暴露；在合并肾功能下降患者中需加强监测并权衡调整二甲双胍剂量。",
      },
      {
        partner: "多价阳离子制剂（含铝、镁、钙、铁制剂）",
        mechanism: "二价/三价阳离子在胃肠道与整合酶抑制剂螯合，阻碍比克替拉韦吸收",
        consequence: "显著降低比克替拉韦血药浓度；Biktarvy 说明书要求含铝/镁抗酸药至少在给药前 2 小时或给药后 6 小时服用（钙/铁制剂可随餐同服）。",
      },
    ],
  },

  ganciclovir: {
    clinicalTags: ["renal-adjustment", "pregnancy-caution"],
    interactions: [
      {
        partner: "亚胺培南/西司他丁",
        mechanism: "两药联合可产生中枢神经兴奋阈值下降与致惊厥药效学协同（具体机制未完全阐明）",
        consequence: "已有联合应用后发生全身性癫痫发作的报告，说明书提示除非获益明确大于风险，否则不推荐合用。",
      },
      {
        partner: "齐多夫定（及其他骨髓抑制药物）",
        mechanism: "双方均具有显著骨髓毒性，叠加抑制中性粒细胞与红细胞前体生成",
        consequence: "大幅升高重度中性粒细胞减少与贫血风险，确需合用时应严密监测全血细胞计数。",
      },
      {
        partner: "富马酸替诺福韦二吡呋酯（TDF）",
        targetCardId: "tenofovir-disoproxil",
        mechanism: "竞争肾小管分泌通道并可能叠加肾小管损伤，减慢双方清除",
        consequence: "可能引起血肌酐升高及任一方血药浓度上升，合用期间须常规监测肾功能并警惕血液学/肾毒性。",
      },
    ],
  },

  voriconazole: {
    clinicalTags: ["cyp-inhibitor", "hepatic-caution", "pregnancy-caution", "qt-prolongation"],
    interactions: [
      {
        partner: "卡马西平（及利福平等强效 CYP 诱导剂）",
        targetCardId: "carbamazepine",
        mechanism: "强效诱导 CYP2C19、CYP2C9 与 CYP3A4，大幅加速伏立康唑代谢清除",
        consequence: "伏立康唑血药浓度骤降并导致抗真菌治疗失败，说明书列为禁忌合用。",
      },
      {
        partner: "华法林",
        targetCardId: "warfarin",
        mechanism: "抑制 CYP2C9 与 CYP3A4，减慢活性 S-华法林经肝脏氧化清除",
        consequence: "PT/INR 明显延长且出血风险增加，联合治疗时需加密监测 INR 并下调华法林剂量。",
      },
      {
        partner: "奥美拉唑",
        targetCardId: "omeprazole",
        mechanism: "伏立康唑抑制 CYP2C19 与 CYP3A4，显著减少奥美拉唑肝内代谢",
        consequence: "大幅升高奥美拉唑峰浓度与 AUC；对于每日使用 ≥40 mg 奥美拉唑的患者，启用伏立康唑时说明书建议将奥美拉唑减半。",
      },
      {
        partner: "胺碘酮等延长 QT 药物",
        targetCardId: "amiodarone",
        mechanism: "延长心肌复极（QT 间期）的电生理效应叠加，且伏立康唑抑制 CYP3A4 可增加部分底物暴露",
        consequence: "增加尖端扭转型室速风险，合用前应纠正电解质紊乱并评估心电图 QTc。",
      },
    ],
  },

  caspofungin: {
    clinicalTags: ["hepatic-caution"],
    interactions: [
      {
        partner: "环孢素",
        mechanism: "环孢素抑制肝脏摄取等清除环节使卡泊芬净 AUC 升高约 35%，且两药转氨酶升高作用叠加",
        consequence: "联合使用曾观察到一过性 ALT/AST 升高，说明书建议仅在获益大于风险时联用并监测肝酶。",
      },
      {
        partner: "他克莫司",
        mechanism: "卡泊芬净可通过非 CYP 途径降低他克莫司全血暴露（AUC 约降 20%，C12h 约降 26%）",
        consequence: "可能削弱他克莫司免疫抑制强度，合用期间需监测他克莫司全血谷浓度并适时调整剂量。",
      },
      {
        partner: "卡马西平（或苯妥英钠、利福平等清除诱导剂）",
        targetCardId: "carbamazepine",
        mechanism: "慢性诱导肝药酶或转运体清除途径，降低卡泊芬净血药谷浓度",
        consequence: "抗真菌暴露下降；成人患者合用强效诱导剂时，说明书建议评估将卡泊芬净维持量提高至每日 70 mg。",
      },
    ],
  },

  osimertinib: {
    clinicalTags: ["qt-prolongation", "pregnancy-caution"],
    interactions: [
      {
        partner: "卡马西平（及苯妥英钠等强效 CYP3A 诱导剂）",
        targetCardId: "carbamazepine",
        mechanism: "强效诱导 CYP3A4/5，显著加速奥希替尼及其活性代谢物代谢消除",
        consequence: "明显降低抗肿瘤暴露；说明书建议避免合用，若无法避免则需按规范将奥希替尼上调至 160 mg/日并在停用诱导剂 3 周后恢复原量。",
      },
      {
        partner: "胺碘酮等延长 QTc 药物",
        targetCardId: "amiodarone",
        mechanism: "奥希替尼呈浓度依赖性延长 QTc 间期，与其他延长复极药物产生电生理叠加",
        consequence: "增加尖端扭转型室速等恶性心律失常风险；尽量避免合用，确需联用时须定期监测心电图与电解质。",
      },
      {
        partner: "地高辛（及瑞舒伐他汀等 BCRP/P-gp 底物）",
        targetCardId: "digoxin",
        mechanism: "奥希替尼抑制乳腺癌耐药蛋白（BCRP）与 P-糖蛋白（P-gp）外排转运",
        consequence: "可升高窄治疗窗底物（如地高辛）或他汀类的全身暴露及不良反应风险，联用时需严密监测耐受性与浓度。",
      },
    ],
  },

  paclitaxel: {
    clinicalTags: ["hepatic-caution", "pregnancy-caution"],
    interactions: [
      {
        partner: "顺铂",
        targetCardId: "cisplatin",
        mechanism: "存在给药顺序依赖性相互作用：先用顺铂再给紫杉醇可使紫杉醇清除率下降约 33%",
        consequence: "先顺铂后紫杉醇会显著加重重度中性粒细胞减少等骨髓抑制，临床联合方案通常遵循先紫杉醇后顺铂顺序。",
      },
      {
        partner: "卡马西平（或苯妥英钠等 CYP2C8/CYP3A4 诱导剂）",
        targetCardId: "carbamazepine",
        mechanism: "诱导紫杉醇主要肝药酶 CYP2C8 与 CYP3A4，加速其氧化代谢消除",
        consequence: "可能导致紫杉醇血药暴露下降并减弱化疗疗效，联合用药时需关注方案评估。",
      },
      {
        partner: "酮康唑等 CYP2C8/CYP3A4 抑制剂",
        mechanism: "抑制紫杉醇经 CYP2C8/CYP3A4 的肝内代谢失活",
        consequence: "可能升高紫杉醇全身暴露并加重骨髓抑制及周围神经病变风险，合用须谨慎监测。",
      },
    ],
  },

  pembrolizumab: {
    clinicalTags: ["pregnancy-caution"],
    interactions: [
      {
        partner: "泼尼松龙（及其他全身用糖皮质激素）",
        targetCardId: "prednisolone",
        mechanism: "基线超生理剂量激素抑制 T 细胞活化与免疫应答，拮抗 PD-1 阻断的抗肿瘤免疫机制",
        consequence: "启动帕博利珠单抗前应尽量避免基线全身用激素；但一旦发生免疫介导性不良反应，糖皮质激素则是首选救治用药。",
      },
      {
        partner: "地塞米松",
        targetCardId: "dexamethasone",
        mechanism: "强效糖皮质激素抑制淋巴细胞增殖与细胞因子释放，在药效学上与免疫检查点激活相拮抗",
        consequence: "基线长期合用可能削弱免疫治疗应答，但在发生 2～4 级免疫性肺炎、结肠炎或肝炎时需及时启用并规范减停。",
      },
      {
        partner: "其他全身免疫抑制剂（如英夫利西单抗、吗替麦考酚酯）",
        mechanism: "抑制下游炎症介质或淋巴细胞克隆扩增，干扰免疫检查点抑制剂诱导的抗肿瘤效应",
        consequence: "治疗前宜避免联用；临床上主要作为激素耐药型重度免疫不良反应的二线挽救治疗。",
      },
    ],
  },

  letrozole: {
    clinicalTags: ["cyp-inhibitor", "hepatic-caution", "pregnancy-caution"],
    interactions: [
      {
        partner: "他莫昔芬",
        mechanism: "合用可诱导或改变代谢清除，使来曲唑血浆浓度平均降低约 38%",
        consequence: "说明书提示同时联合可能降低来曲唑暴露；临床多采用序贯方案而非同期联用（先用他莫昔芬后序贯来曲唑疗效不受损）。",
      },
      {
        partner: "含雌激素药物（激素替代治疗或含雌激素避孕药）",
        mechanism: "外源性雌激素直接抵消芳香化酶抑制剂降低体内雌激素水平的药理作用",
        consequence: "可减弱来曲唑对激素受体阳性乳腺癌的抑制效果，治疗期间应避免合用雌激素制剂。",
      },
      {
        partner: "苯妥英钠等经 CYP2C19 代谢的窄治疗窗药物",
        targetCardId: "phenytoin",
        mechanism: "体外研究显示来曲唑强效抑制 CYP2A6 并中度抑制 CYP2C19（临床相关性尚待明确）",
        consequence: "联用依赖 CYP2C19 消除的窄治疗窗药物时，说明书建议保持警惕并监测底物反应或浓度。",
      },
    ],
  },

  fexofenadine: {
    clinicalTags: ["renal-adjustment"],
    interactions: [
      {
        partner: "含铝/镁抗酸药",
        mechanism: "在胃肠道内直接结合吸附非索非那定，减少药物跨膜吸收",
        consequence: "可使非索非那定 Cmax 与 AUC 下降约 40% 以上，建议两药至少间隔 2 小时服用。",
      },
      {
        partner: "西柚汁、橙汁及苹果汁",
        mechanism: "果汁中的黄酮成分抑制肠道摄取转运体 OATP1A2，阻碍非索非那定经肠壁吸收",
        consequence: "显著拉低非索非那定血药浓度与抗过敏疗效；口服片剂应以白开水送服，避免与果汁同服。",
      },
      {
        partner: "红霉素 / 酮康唑（P-gp 抑制剂）",
        mechanism: "抑制肠道与胆道 P-糖蛋白（P-gp）外排，增加非索非那定净吸收",
        consequence: "可使非索非那定血药浓度升高 2～3 倍；尽管临床研究未见 QTc 显著改变，合用仍需关注不良反应。",
      },
    ],
  },

  cromoglicate: {
    interactions: [
      {
        partner: "沙丁胺醇（吸入型 β2 受体激动剂）",
        targetCardId: "salbutamol",
        mechanism: "沙丁胺醇快速舒张支气管平滑肌改善气道通畅度，有助于吸入型色甘酸钠到达下呼吸道",
        consequence: "存在轻度支气管痉挛时常先吸入短效 β2 受体激动剂再用色甘酸钠，可发挥急性缓解与肥大细胞稳定预防的协同配合。",
      },
      {
        partner: "布地奈德（吸入型糖皮质激素）",
        targetCardId: "budesonide",
        mechanism: "两者分别通过稳定肥大细胞膜与抑制气道炎症转录发挥协同控制作用",
        consequence: "联合用于哮喘长期控制稳定后若尝试减量原用糖皮质激素，说明书提醒必须缓慢递减，防止诱发哮喘恶化或肾上腺皮质功能不全。",
      },
    ],
  },

  ticagrelor: {
    clinicalTags: ["cyp-inhibitor", "hepatic-caution"],
    interactions: [
      {
        partner: "阿司匹林（维持量 >100 mg/日）",
        targetCardId: "aspirin",
        mechanism: "高维持量阿司匹林对血管前列环素等途径的影响在机制上尚未完全明晰，但临床观察削弱替格瑞洛抗栓获益",
        consequence: "说明书黑框警示：与替格瑞洛联用时阿司匹林每日维持量不得超过 100 mg（通常 75～100 mg/日），否则会降低替格瑞洛疗效。",
      },
      {
        partner: "强效 CYP3A4 抑制剂（如酮康唑、克拉霉素、利托那韦）",
        mechanism: "阻断替格瑞洛主要代谢酶 CYP3A4，大幅升高母药暴露",
        consequence: "显著升高严重出血与呼吸困难风险，说明书明确避免合用。",
      },
      {
        partner: "卡马西平（强效 CYP3A4 诱导剂）",
        targetCardId: "carbamazepine",
        mechanism: "强效诱导 CYP3A4，显著加速替格瑞洛及其活性代谢物清除",
        consequence: "血药浓度大幅下降并削弱 P2Y12 血小板抑制作用，应避免联合使用。",
      },
      {
        partner: "地高辛",
        targetCardId: "digoxin",
        mechanism: "替格瑞洛抑制 P-糖蛋白（P-gp）外排转运，减少地高辛清除",
        consequence: "可使地高辛血清浓度升高，启动或调整替格瑞洛时应监测地高辛血药浓度。",
      },
    ],
  },

  heparin: {
    clinicalTags: ["narrow-therapeutic-index"],
    interactions: [
      {
        partner: "阿司匹林",
        targetCardId: "aspirin",
        mechanism: "抗凝血酶介导的凝血因子抑制与血小板 COX-1 不可逆抑制在止血环节产生协同削弱",
        consequence: "显著增加消化道、穿刺部位及颅内出血风险，联用须有明确适应证并严密监测凝血与出血体征。",
      },
      {
        partner: "华法林",
        targetCardId: "warfarin",
        mechanism: "直接增强抗凝血酶活性与抑制维生素 K 依赖凝血因子合成产生抗凝叠加",
        consequence: "出血风险升高，且普通肝素可轻微干扰 PT/INR 测定值，桥接期间需注意采血时机与密切监护。",
      },
      {
        partner: "硝酸甘油（高剂量静脉制剂）",
        targetCardId: "nitroglycerin",
        mechanism: "高剂量静脉硝酸甘油（及其溶剂/药效机制）在部分患者中可减弱肝素的抗凝效应",
        consequence: "可能降低 aPTT 达标稳定性；启动或撤停高剂量静脉硝酸甘油时应复查 aPTT 并及时调整肝素速率。",
      },
    ],
  },

  enoxaparin: {
    clinicalTags: ["renal-adjustment"],
    interactions: [
      {
        partner: "阿司匹林",
        targetCardId: "aspirin",
        mechanism: "低分子肝素抗 Xa/Ⅱa 效应与抗血小板聚集抑制协同削弱止血功能",
        consequence: "明显增加出血及硬膜外/脊髓血肿风险（尤其伴椎管内操作时），联用需严密观察出血征象。",
      },
      {
        partner: "布洛芬（及其他 NSAID）",
        targetCardId: "ibuprofen",
        mechanism: "抑制血小板 TXA2 合成并损伤胃肠道黏膜，与抗凝作用叠加",
        consequence: "升高消化道出血与其他部位出血风险，除非临床必需否则应避免长期合用。",
      },
      {
        partner: "华法林",
        targetCardId: "warfarin",
        mechanism: "两条抗凝途径叠加抑制凝血级联瀑布",
        consequence: "在华法林起效桥接阶段可放大出血风险，需按目标 INR 及时评估停用依诺肝素。",
      },
    ],
  },

  ezetimibe: {
    clinicalTags: ["hepatic-caution"],
    interactions: [
      {
        partner: "阿托伐他汀（或瑞舒伐他汀）",
        targetCardId: "atorvastatin",
        mechanism: "分别抑制肠道 NPC1L1 胆固醇吸收与肝脏 HMG-CoA 还原酶合成，实现协同降脂",
        consequence: "联合降 LDL-C 效果显著，但转氨酶升高风险略增，联用期间需关注基线与随访肝功能及肌症状。",
      },
      {
        partner: "华法林",
        targetCardId: "warfarin",
        mechanism: "上市后监测观察到部分联用患者 INR 升高，具体机制尚未完全阐明",
        consequence: "可能增加抗凝过度与出血风险，在华法林基础上加用或停用依折麦布时宜复查 INR。",
      },
      {
        partner: "胆汁酸螯合剂（如考来烯胺）",
        mechanism: "胆汁酸螯合剂在肠腔内吸附依折麦布并阻断其吸收与肠肝循环，使 AUC 下降约 55%",
        consequence: "削弱依折麦布降脂疗效，说明书要求依折麦布应在胆汁酸螯合剂前 ≥2 小时或后 ≥4 小时服用。",
      },
    ],
  },

  empagliflozin: {
    clinicalTags: ["renal-adjustment"],
    interactions: [
      {
        partner: "呋塞米（及其他利尿剂）",
        targetCardId: "furosemide",
        mechanism: "SGLT2 抑制所致的渗透性利尿与袢利尿剂排钠排水作用叠加",
        consequence: "增加血容量不足、直立性低血压及急性肾损伤风险，老年或低血压倾向患者启用前应评估容量状态。",
      },
      {
        partner: "胰岛素（或格列本脲等促泌剂）",
        targetCardId: "insulin",
        mechanism: "尿糖排泄增加与外源性胰岛素或促泌剂在降血糖效应上协同叠加",
        consequence: "低血糖发生风险上升，联用时常需考虑适当下调胰岛素或磺脲类剂量并加强血糖监测。",
      },
      {
        partner: "锂制剂（碳酸锂等）",
        mechanism: "SGLT2 抑制剂促进近端肾小管钠排泄与渗透性利尿，伴随肾脏对锂的清除增加",
        consequence: "可降低血锂浓度并削弱心境稳定疗效，启用或调整恩格列净剂量时需加密监测血锂。",
      },
    ],
  },

  semaglutide: {
    clinicalTags: ["pregnancy-caution"],
    interactions: [
      {
        partner: "胰岛素（或格列本脲等磺脲类促泌剂）",
        targetCardId: "insulin",
        mechanism: "GLP-1 受体激动增强葡萄糖依赖性胰岛素分泌，与非葡萄糖依赖性降糖药产生低血糖叠加",
        consequence: "显著升高低血糖（含严重低血糖）风险，启用司美格鲁肽时通常需评估减少胰岛素或磺脲类用量。",
      },
      {
        partner: "左甲状腺素钠（及其他口服窄治疗窗药物）",
        targetCardId: "levothyroxine",
        mechanism: "司美格鲁肽延缓胃排空，可能影响同服口服药物的吸收速率或程度（口服剂型尤为明显）",
        consequence: "联合使用左甲状腺素钠或华法林等需精确滴定的口服药时，应关注疗效波动并加强 TSH 或相关指标监测。",
      },
    ],
  },

  levothyroxine: {
    clinicalTags: ["narrow-therapeutic-index"],
    interactions: [
      {
        partner: "硫糖铝（及钙剂、铁剂、含铝/镁抗酸药）",
        targetCardId: "sucralfate",
        mechanism: "在胃肠道内与左甲状腺素形成难溶性复合物或产生表面吸附，阻碍小肠吸收",
        consequence: "导致血清 TSH 升高及甲状腺功能减退控制不佳，DailyMed 说明书要求两者至少间隔 4 小时服用。",
      },
      {
        partner: "奥美拉唑（及其他质子泵抑制剂）",
        targetCardId: "omeprazole",
        mechanism: "持久升高胃内 pH，降低口服左甲状腺素钠片剂的溶出度与吸收效率",
        consequence: "可能降低左甲状腺素生物利用度，加用或停用 PPI 后需复查 TSH 并按需调整替代剂量。",
      },
      {
        partner: "华法林",
        targetCardId: "warfarin",
        mechanism: "甲状腺激素加速维生素 K 依赖性凝血因子的体内分解代谢",
        consequence: "启动或上调左甲状腺素钠可增强华法林抗凝效应并升高 INR，需严密监测凝血指标并下调华法林剂量。",
      },
    ],
  },

  methimazole: {
    clinicalTags: ["hepatic-caution", "pregnancy-caution"],
    interactions: [
      {
        partner: "华法林",
        targetCardId: "warfarin",
        mechanism: "甲巯咪唑可抑制维生素 K 相关活性（且甲状腺功能恢复亦改变凝血因子降解速率）",
        consequence: "可能增强口服抗凝药的抗凝作用，手术前及合用期间应加强 PT/INR 监测。",
      },
      {
        partner: "美托洛尔（高首过清除 β 受体阻滞剂）",
        targetCardId: "metoprolol",
        mechanism: "甲亢状态下高提取率 β 受体阻滞剂清除加快；随甲巯咪唑使甲状腺功能恢复正常，其清除率回落",
        consequence: "进入甲状腺功能正常期后美托洛尔暴露相对升高，需评估下调 β 受体阻滞剂剂量以防心动过缓或低血压。",
      },
      {
        partner: "地高辛",
        targetCardId: "digoxin",
        mechanism: "随甲亢改善转为甲状腺功能正常，地高辛表观分布容积与肾清除变化使血药浓度上升",
        consequence: "可能诱发洋地黄中毒风险升高，甲状腺功能趋于正常时常需评估下调地高辛维持量。",
      },
    ],
  },

  levofloxacin: {
    clinicalTags: ["renal-adjustment", "qt-prolongation"],
    interactions: [
      {
        partner: "硫糖铝（及含铝/镁抗酸药、铁/钙/锌制剂）",
        targetCardId: "sucralfate",
        mechanism: "多价金属阳离子与氟喹诺酮母核发生螯合，大幅减少口服左氧氟沙星胃肠道吸收",
        consequence: "导致血药及组织抗菌浓度明显下降，须在服用上述制剂前 2 小时或后 2 小时再服左氧氟沙星。",
      },
      {
        partner: "泼尼松龙（及其他全身用糖皮质激素）",
        targetCardId: "prednisolone",
        mechanism: "两者在胶原代谢与肌腱微循环损伤上产生协同不良反应",
        consequence: "显著升高肌腱炎及跟腱断裂风险（老年患者尤甚），出现肌腱疼痛或肿胀应立即停药就医。",
      },
      {
        partner: "胺碘酮等延长 QT 药物",
        targetCardId: "amiodarone",
        mechanism: "共同阻滞心肌钾通道延长动作电位复极，产生 QT 间期延长叠加",
        consequence: "增加尖端扭转型室速风险；说明书建议避免与 IA 类及 Ⅲ 类抗心律失常药或已知延长 QT 药物合用。",
      },
      {
        partner: "华法林",
        targetCardId: "warfarin",
        mechanism: "临床监测显示左氧氟沙星可增强华法林抗凝效应（可能与肠道菌群及代谢干扰有关）",
        consequence: "引起 PT/INR 升高及出血风险，合用期间须严密复查凝血指标。",
      },
    ],
  },

  azithromycin: {
    clinicalTags: ["hepatic-caution", "qt-prolongation"],
    interactions: [
      {
        partner: "胺碘酮等延长 QT 药物",
        targetCardId: "amiodarone",
        mechanism: "两者均具有延长心室复极与 QTc 间期的电生理作用",
        consequence: "可叠加升高尖端扭转型室速等恶性心律失常风险，合并低钾/低镁或基础心脏病者尤须警惕。",
      },
      {
        partner: "华法林",
        targetCardId: "warfarin",
        mechanism: "上市后病例报告提示阿奇霉素可增强香豆素类口服抗凝药的抗凝活性",
        consequence: "可能引起 INR 升高与出血事件，联合用药期间建议严密监测凝血酶原时间。",
      },
      {
        partner: "地高辛",
        targetCardId: "digoxin",
        mechanism: "大环内酯类药物可通过抑制肠道 P-gp 或改变肠道菌群代谢升高部分患者地高辛暴露",
        consequence: "尽管阿奇霉素影响通常弱于克拉霉素，说明书仍提示联用期间需谨慎监测地高辛血药浓度与中毒征象。",
      },
    ],
  },

  doxycycline: {
    clinicalTags: ["pregnancy-caution"],
    interactions: [
      {
        partner: "硫糖铝（及含铝/镁抗酸药、钙剂、铁剂）",
        targetCardId: "sucralfate",
        mechanism: "多价阳离子在胃肠道与多西环素螯合形成不溶性复合物",
        consequence: "显著降低多西环素口服吸收并影响抗菌疗效，宜错开给药时间。",
      },
      {
        partner: "卡马西平（及苯妥英钠等肝药酶诱导剂）",
        targetCardId: "carbamazepine",
        mechanism: "诱导肝脏代谢酶，缩短多西环素血浆消除半衰期",
        consequence: "可降低多西环素全身暴露并导致抗感染失败，联用时需关注疗效或评估调整方案。",
      },
      {
        partner: "华法林",
        targetCardId: "warfarin",
        mechanism: "四环素类可降低血浆凝血酶原活性（可能与抑制维生素 K 合成菌群或代谢协同有关）",
        consequence: "增强华法林抗凝效果并增加出血风险，联用期间需监测 INR 并考虑下调抗凝药剂量。",
      },
      {
        partner: "口服维 A 酸类（如异维 A 酸）",
        mechanism: "两者均可独立诱发脑脊液吸收障碍与颅内压升高，产生神经系统毒性叠加",
        consequence: "显著升高良性颅内压增高（假性脑瘤）及视力受损风险，说明书建议避免合用。",
      },
    ],
  },

  allopurinol: {
    clinicalTags: ["renal-adjustment"],
    interactions: [
      {
        partner: "硫唑嘌呤 / 巯嘌呤",
        mechanism: "别嘌醇强力抑制黄嘌呤氧化酶，阻断巯嘌呤及硫唑嘌呤（前药）关键失活代谢通道",
        consequence: "导致嘌呤类药物严重蓄积并引发致命性全血细胞减少与骨髓抑制；若必须联用，通常需将硫唑嘌呤/巯嘌呤减至原剂量的 1/4～1/3 并严密查血象。",
      },
      {
        partner: "华法林",
        targetCardId: "warfarin",
        mechanism: "别嘌醇可抑制肝微粒体对部分香豆素类抗凝药的代谢，延长其半衰期",
        consequence: "可能增强抗凝反应并升高出血风险，启动或调整别嘌醇期间须复查凝血酶原时间/INR。",
      },
      {
        partner: "氢氯噻嗪（及其他噻嗪类利尿剂）",
        targetCardId: "hydrochlorothiazide",
        mechanism: "噻嗪类减少尿酸排泄并升高别嘌醇活性代谢物氧嘌呤醇蓄积倾向",
        consequence: "可削弱降尿酸达标率并升高别嘌醇严重皮肤超敏反应（如 DRESS/SJS）风险，肾功能不全者尤需警惕。",
      },
      {
        partner: "阿莫西林（及氨苄西林）",
        targetCardId: "amoxicillin",
        mechanism: "联合应用时皮疹发生率显著高于单用（机制尚未完全阐明）",
        consequence: "合用期间若出现皮肤斑丘疹等异常反应需及时鉴别药物超敏并评估停药。",
      },
    ],
  },

  fluoxetine: {
    clinicalTags: ["cyp-inhibitor", "hepatic-caution", "pregnancy-caution"],
    interactions: [
      {
        partner: "利奈唑胺（及其他 MAOI）",
        targetCardId: "linezolid",
        mechanism: "阻止 5-羟色胺再摄取与抑制单胺氧化酶降解产生极强血清素能叠加",
        consequence: "可致致命性血清素综合征；因氟西汀及其活性代谢物去甲氟西汀半衰期极长，停用氟西汀后通常需至少 5 周洗脱期方可启用 MAOI。",
      },
      {
        partner: "氟哌啶醇（及其他 CYP2D6 窄治疗窗底物）",
        targetCardId: "haloperidol",
        mechanism: "氟西汀强效抑制 CYP2D6，显著减慢氟哌啶醇氧化代谢清除",
        consequence: "升高氟哌啶醇血药浓度并增加锥体外系反应与 QTc 延长风险，合用时需密切观察。",
      },
      {
        partner: "阿司匹林（或布洛芬、华法林）",
        targetCardId: "aspirin",
        mechanism: "SSRI 耗竭血小板内 5-羟色胺并削弱血小板聚集，与抗血小板药、NSAID 或抗凝药协同",
        consequence: "明显升高上消化道出血及皮肤黏膜出血风险，联用期间需留意黑便、瘀斑或监测 INR。",
      },
    ],
  },

  sertraline: {
    clinicalTags: ["hepatic-caution", "pregnancy-caution"],
    interactions: [
      {
        partner: "利奈唑胺（及其他 MAOI）",
        targetCardId: "linezolid",
        mechanism: "SSRI 阻断突触前 5-羟色胺回收与 MAOI 阻断代谢降解产生协同过载",
        consequence: "可诱发危及生命的血清素综合征，属于禁忌合用（转换时需严格保留至少 14 天洗脱间隔）。",
      },
      {
        partner: "阿司匹林（或布洛芬、华法林）",
        targetCardId: "aspirin",
        mechanism: "抑制血小板摄取 5-羟色胺削弱初级止血功能，并与胃黏膜损伤或抗凝作用叠加",
        consequence: "消化道出血与抗凝出血风险增加，联合用药时应提醒患者注意出血征象并考虑胃黏膜保护评估。",
      },
    ],
  },

  duloxetine: {
    clinicalTags: ["renal-adjustment", "hepatic-caution"],
    interactions: [
      {
        partner: "利奈唑胺（及其他 MAOI）",
        targetCardId: "linezolid",
        mechanism: "SNRI 抑制 5-羟色胺和去甲肾上腺素再摄取，与 MAOI 协同引起单胺递质过度蓄积",
        consequence: "可致致命性血清素综合征与高血压危象，说明书禁忌联合使用。",
      },
      {
        partner: "氟西汀（或氟伏沙明等 CYP2D6/CYP1A2 抑制剂）",
        targetCardId: "fluoxetine",
        mechanism: "度洛西汀主要经 CYP1A2 与 CYP2D6 代谢，强抑制剂可显著阻断其清除",
        consequence: "大幅提高度洛西汀血药浓度（应避免合用强 CYP1A2 抑制剂，联用强 CYP2D6 抑制剂亦可使暴露升高约 60%）。",
      },
      {
        partner: "布洛芬（或阿司匹林、华法林）",
        targetCardId: "ibuprofen",
        mechanism: "阻断血小板 5-羟色胺摄取削弱止血聚集能力，与 NSAID/抗凝药出血风险叠加",
        consequence: "增加上消化道出血与抗凝过强风险，联用时需关注出血体征并按需监测 INR。",
      },
    ],
  },

  haloperidol: {
    clinicalTags: ["hepatic-caution", "qt-prolongation"],
    interactions: [
      {
        partner: "胺碘酮等延长 QTc 药物",
        targetCardId: "amiodarone",
        mechanism: "两药均呈浓度相关延长心肌复极（QTc），合用产生心律失常电生理叠加",
        consequence: "显著升高尖端扭转型室速与心源性猝死风险，说明书通常避免或禁忌与已知延长 QTc 药物联用。",
      },
      {
        partner: "氟西汀（强效 CYP2D6 抑制剂）",
        targetCardId: "fluoxetine",
        mechanism: "氟哌啶醇经 CYP3A4 与 CYP2D6 代谢，CYP2D6 强抑制减少其消除",
        consequence: "使氟哌啶醇血药浓度上升，加重锥体外系反应、静坐不能及 QTc 延长风险。",
      },
      {
        partner: "卡马西平（强效 CYP3A4 诱导剂）",
        targetCardId: "carbamazepine",
        mechanism: "强效诱导 CYP3A4，明显加速氟哌啶醇肝脏代谢清除",
        consequence: "可显著降低氟哌啶醇血药浓度并导致精神症状复发；停用卡马西平后则须防血药浓度反跳升高。",
      },
      {
        partner: "左旋多巴",
        targetCardId: "levodopa",
        mechanism: "中枢多巴胺 D2 受体强效阻断在受体水平直接拮抗左旋多巴的拟多巴胺效应",
        consequence: "明显削弱抗帕金森病疗效并加重运动迟缓与肌强直，原则上应避免联合应用。",
      },
    ],
  },

  morphine: {
    clinicalTags: ["renal-adjustment", "hepatic-caution"],
    interactions: [
      {
        partner: "地西泮（及其他苯二氮䓬类 / 中枢抑制剂）",
        targetCardId: "diazepam",
        mechanism: "作用于 μ 阿片受体与 GABAA 受体产生强效协同呼吸中枢与意识抑制",
        consequence: "FDA 黑框警示：可致深度镇静、致命性呼吸抑制及昏迷，除非别无替代，否则严禁常规联用。",
      },
      {
        partner: "利奈唑胺（及其他 MAOI）",
        targetCardId: "linezolid",
        mechanism: "部分阿片类与 MAOI 联用可引发严重中枢兴奋、血清素相关毒性或不可预测的呼吸抑制与低血压",
        consequence: "说明书提示避免在 MAOI 用药期间或停药 14 天内联用，确须镇痛时应选择更安全方案并严密监护。",
      },
      {
        partner: "氯丙嗪（及其他吩噻嗪类抗精神病药）",
        targetCardId: "chlorpromazine",
        mechanism: "中枢镇静、呼吸抑制与 α1 阻断所致降压作用产生药效学叠加",
        consequence: "显著加重嗜睡、体位性低血压及呼吸抑制风险，联用时需降低起始剂量并严密监测。",
      },
    ],
  },
};
