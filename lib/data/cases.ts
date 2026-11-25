import type { CaseQuestionSpec } from "@/lib/types";

/**
 * 临床机制情景题核对题库（26 题，覆盖 13 个系统分类）。
 * 纯学习向情景辨析，聚焦作用靶点、代谢酶相互作用、耐药与用药边界，
 * 不构成针对个体患者的临床诊断或处方建议。
 */
export const CASE_QUESTIONS: readonly CaseQuestionSpec[] = [
  {
    id: "acei-cough-switch-arb",
    cardId: "captopril",
    category: "cardiovascular",
    prompt:
      "在药理学学习情景中，患者服用卡托普利后出现持续性无痰干咳，拟从作用机制角度分析其原因并比较换用氯沙坦的差异，哪项判断最恰当？",
    correctOption:
      "卡托普利抑制 ACE（激肽酶 II）使缓激肽降解减少而诱发干咳；氯沙坦阻断 AT1 受体而不直接抑制 ACE 对缓激肽的降解",
    distractors: [
      "卡托普利直接激动支气管 C 纤维上的 β2 受体导致干咳；氯沙坦可阻断支气管 β2 受体从而止咳",
      "卡托普利促使血管紧张素 II 大量升高刺激咳嗽反射；氯沙坦可直接灭活循环中的血管紧张素 II",
      "氯沙坦通过阻断 AT1 受体消除了肾素-血管紧张素系统对肾脏和血钾的影响，因此换药后无需关注高钾或肾功能变化",
    ],
    explanation:
      "卡托普利等 ACEI 抑制血管紧张素转化酶（ACE，又称激肽酶 II），不仅减少血管紧张素 I 向 II 的转化，也减少缓激肽降解，缓激肽及相关介质蓄积可刺激气道引发干咳甚至血管性水肿。氯沙坦作为 ARB 选择性阻断 AT1 受体，不直接抑制 ACE 对缓激肽的降解，因而干咳发生率显著较低。其余选项错误原因：β2 受体主要介导支气管舒张而非卡托普利干咳机制；ACEI 是减少而非升高血管紧张素 II，且 ARB 阻断 AT1 受体可因负反馈解除反而使血浆血管紧张素 II 升高；ARB 同样存在高钾血症、低血压、肾功能恶化（如肾动脉狭窄情境）及妊娠禁忌，不可认为无需监测。",
    sources: [
      {
        title: "卡托普利说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1395ba5b-2fc9-41ff-9c43-e0740d781dee",
        sections: "药理、适应症、警告与不良反应",
      },
      {
        title: "氯沙坦说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a959c71b-d658-4871-b303-073234b9fa84",
        sections: "药理、适应症、警告与不良反应",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "beta1-selective-vs-nonselective",
    cardId: "metoprolol",
    category: "cardiovascular",
    prompt:
      "在药理学学习情景中，关于美托洛尔等相对选择性 β1 受体阻滞剂与非选择性 β 受体阻滞剂在气道反应及低血糖识别方面的机制比较，哪项最恰当？",
    correctOption:
      "美托洛尔优先阻断心脏 β1 受体以减弱交感心率反应，对支气管 β2 受体影响相对较弱，但选择性具有剂量相对性，仍可能诱发支气管痉挛并掩盖低血糖的心动过速警示",
    distractors: [
      "美托洛尔属于绝对选择性 β1 受体阻滞剂，在任何剂量下都不会作用于支气管 β2 受体或影响糖代谢信号",
      "美托洛尔通过直接激动支气管平滑肌 β2 受体舒张气道，因此对哮喘患者的气道痉挛具有治疗作用",
      "美托洛尔完全不透过血脑屏障且不影响低血糖时的心动过速反应，糖尿病患者合用时无需警惕警示症状被掩盖",
    ],
    explanation:
      "美托洛尔和比索洛尔主要阻断心脏与肾脏的 β1 受体，减弱儿茶酚胺介导的心率、心肌收缩力、房室传导及肾素释放，因此对支气管 β2 受体介导的平滑肌舒张和外周代谢效应干扰相对弱于非选择性 β 阻滞剂。但说明书明确指出其 β1 选择性是相对的，较高暴露下仍可抑制 β2 受体诱发支气管痉挛，且心脏 β1 阻断本身即可减弱低血糖时肾上腺素引起的心动过速等早期警示信号（出汗等胆碱能表现常保留），同时美托洛尔可透过血脑屏障，并非绝对外周局限。",
    sources: [
      {
        title: "美托洛尔说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c0e147a8-36a6-1e61-e053-2a95a90afd62",
        sections: "4、5.1、6.1、12.1、12.2 节：β1 选择性、支气管痉挛及低血糖警示掩盖",
      },
      {
        title: "emc：Bisoprolol 片产品说明书",
        url: "https://www.medicines.org.uk/emc/product/3090/smpc",
        sections: "第 4.4、5.1 节：β1 选择性边界及气道/低血糖注意",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "warfarin-fluconazole-cyp2c9",
    cardId: "warfarin",
    category: "cardiovascular",
    prompt:
      "在药理学学习情景中，长期使用华法林者合用氟康唑后出现 INR 明显升高及出血倾向增加，最核心的药物相互作用机制是哪一项？",
    correctOption:
      "氟康唑抑制参与华法林（尤其是 S-华法林）代谢的 CYP2C9 及相关 CYP 酶，减慢华法林清除并放大对 VKORC1 的抑制效应",
    distractors: [
      "氟康唑直接与血液中已有凝血因子 II、VII、IX、X 结合并使其立即失活，因此可瞬间溶解已有血栓",
      "氟康唑强效诱导肝脏 CYP2C9 加速华法林转化为活性溶栓代谢物，从而使抗凝强度骤增",
      "华法林主要经肾小球原形排泄，氟康唑通过竞争肾小管分泌完全阻断华法林的肾脏清除",
    ],
    explanation:
      "华法林为外消旋体，药理活性更强的 S-华法林主要经 CYP2C9 代谢清除，R-华法林涉及 CYP3A4/CYP1A2 等途径。氟康唑抑制 CYP2C9（及中度抑制 CYP3A4），显著减慢华法林代谢，使血药暴露上升、维生素 K 依赖性凝血因子合成进一步受抑、INR 升高并增加出血风险。其余选项错误原因：华法林和氟康唑均不直接灭活已有凝血因子或直接溶解血栓；氟康唑是 CYP 抑制剂而非诱导剂；华法林主要依赖肝酶代谢而非以原形经肾排泄。",
    sources: [
      {
        title: "华法林说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=cdbbc317-35d3-42ba-94f0-c83891358529",
        sections: "药理、警告与药物相互作用",
      },
      {
        title: "氟康唑说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=98ac5455-d26c-4780-a5a3-bf8d85917626",
        sections: "药物相互作用：CYP2C9 与华法林合用风险",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "nitroglycerin-pde5-hypotension",
    cardId: "nitroglycerin",
    category: "cardiovascular",
    prompt:
      "在药理学学习情景中，为什么硝酸甘油舌下含服严禁与西地那非等 PDE5 抑制剂合用，其血管平滑肌信号通路机制是什么？",
    correctOption:
      "硝酸甘油释放 NO 激活可溶性鸟苷酸环化酶使 cGMP 生成增多，而 PDE5 抑制剂阻断 cGMP 水解，两者协同导致 cGMP 剧增和严重低血压",
    distractors: [
      "硝酸甘油直接阻断心肌与血管 L 型钙通道，与 PDE5 抑制剂协同产生不可逆的心脏停搏",
      "PDE5 抑制剂抑制硝酸甘油在胃肠道的吸收代谢酶，使舌下硝酸甘油首过消除消失而引发高血压危象",
      "硝酸甘油促进 PDE5 酶大量降解 cAMP，而 PDE5 抑制剂反向升高交感神经张力导致冠脉痉挛",
    ],
    explanation:
      "硝酸甘油在平滑肌内经生物转化产生一氧化氮（NO）相关活性信号，激活可溶性鸟苷酸环化酶（sGC），催化 GTP 转化为环磷酸鸟苷（cGMP），进而促进肌球蛋白轻链去磷酸化与血管舒张。5 型磷酸二酯酶（PDE5）负责降解 cGMP；当合用西地那非等 PDE5 抑制剂（或 sGC 激动剂利奥西呱）时，cGMP 生成增加与降解受阻叠加，引起剧烈而难以逆转的血管扩张和严重低血压甚至休克。硝酸甘油并非钙通道阻滞剂，舌下给药本身即绕过首过效应，且合用后果是重度低血压而非高血压或冠脉痉挛。",
    sources: [
      {
        title: "硝酸甘油舌下片 NITROSTAT 说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f7059ff7-bf74-48b4-811d-6eb1c26bfd8b",
        sections: "4.1、5.2、12.1～12.3 节：NO—cGMP 通路及 PDE5 抑制剂合用禁忌",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "furosemide-hypokalemia-digoxin-toxicity",
    cardId: "digoxin",
    category: "cardiovascular",
    prompt:
      "在药理学学习情景中，心衰学习病例显示合用呋塞米引起低钾血症时更易诱发地高辛中毒，这一现象的分子机制是什么？",
    correctOption:
      "细胞外 K⁺ 与地高辛竞争结合心肌细胞膜 Na⁺/K⁺-ATP 酶结合位点；低钾血症削弱这种竞争，从而增强地高辛与钠钾泵的结合并放大毒性",
    distractors: [
      "呋塞米直接抑制地高辛经肾小球滤过的重吸收，使地高辛在心肌细胞内迅速分解为剧毒醛类代谢物",
      "低钾血症通过直接激活心脏 β1 受体大幅升高 cAMP，进而把地高辛从血浆蛋白中完全置换出来",
      "地高辛通过阻断肾髓袢 NKCC2 进一步加重低钾血症，两者在肾小管管腔侧竞争同一转运蛋白",
    ],
    explanation:
      "地高辛抑制细胞膜 Na⁺/K⁺-ATP 酶，使胞内 Na⁺ 升高、经 Na⁺/Ca²⁺ 交换外排 Ca²⁺ 减少，增加心肌收缩可利用钙并减慢房室结传导。正常细胞外 K⁺ 与地高辛在 Na⁺/K⁺-ATP 酶上存在竞争性结合；当呋塞米抑制髓袢升支粗段 NKCC2 造成排钾增多及低钾血症（或低镁血症）时，K⁺ 竞争保护减弱，地高辛与酶结合增强，易诱发异位起搏和严重心律失常。地高辛主要以原形经肾排泄而非在心肌分解为毒物，也不与血浆蛋白高结合被低钾置换，更不直接抑制 NKCC2。",
    sources: [
      {
        title: "地高辛口服片说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=dfac7f13-28be-423d-9389-9089da29da17",
        sections: "5.3、12.1 节：Na+/K+-ATP 酶机制与低钾、低镁诱发毒性",
      },
      {
        title: "呋塞米说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=48d8f490-e9d1-4c95-ab2f-414d3f4a9df4",
        sections: "药理、警告与电解质紊乱不良反应",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "omeprazole-clopidogrel-cyp2c19",
    cardId: "omeprazole",
    category: "digestive",
    prompt:
      "在药理学学习情景中，需要同时使用质子泵抑制剂（PPI）与抗血小板药氯吡格雷时，为什么奥美拉唑与泮托拉唑的酶学相互作用评价不同？",
    correctOption:
      "氯吡格雷是需经 CYP2C19 等代谢活化的前药；奥美拉唑较强抑制 CYP2C19 可能减少其活性代谢物生成，而泮托拉唑对 CYP2C19 抑制相对较弱",
    distractors: [
      "奥美拉唑使胃内 pH 升高从而阻止氯吡格雷在胃壁细胞酸性分泌小管内的酸活化，泮托拉唑则不升高胃内 pH",
      "氯吡格雷直接抑制 H⁺/K⁺-ATP 酶，奥美拉唑与其竞争质子泵结合位点导致消化道溃疡复发",
      "泮托拉唑通过强效诱导 CYP2C19 大幅提升氯吡格雷活性代谢物浓度，因此对所有患者均无需评估相互作用",
    ],
    explanation:
      "氯吡格雷本身为前药，口服吸收后需经肝脏 CYP2C19 等酶两步氧化转化为不可逆抑制血小板 P2Y12 受体的活性代谢物。奥美拉唑对 CYP2C19 具有较明显的抑制作用，说明书提示合用可能降低氯吡格雷活性代谢物暴露及抗血小板效应；相比之下，泮托拉唑抑制胃酸分泌的末端 H⁺/K⁺-ATP 酶机制相同，但对 CYP2C19 的抑制作用明显更弱。其余选项错误：需要壁细胞酸环境活化的是 PPI 本身而非氯吡格雷；氯吡格雷靶向血小板 P2Y12 而非胃质子泵；泮托拉唑并非 CYP2C19 强诱导剂。",
    sources: [
      {
        title: "奥美拉唑延迟释放胶囊说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=5aba19da-663f-4901-94e2-f438dba4841f",
        sections: "药物相互作用：CYP2C19 与氯吡格雷活化减弱",
      },
      {
        title: "emc：Pantoprazole 20 mg 肠溶片说明书",
        url: "https://www.medicines.org.uk/emc/product/450/smpc",
        sections: "第 4.5、5.1 节：药代动力学相互作用特征与质子泵抑制机制",
      },
      {
        title: "氯吡格雷说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ab32a331-2cea-453b-bba1-5451d38edd73",
        sections: "黑框/警告与第 7 节：CYP2C19 代谢及奥美拉唑避免合用提示",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "salbutamol-saba-vs-ics-asthma",
    cardId: "salbutamol",
    category: "respiratory",
    prompt:
      "在哮喘药理学学习情景中，吸入沙丁胺醇能迅速缓解支气管痉挛却不能单独作为哮喘长期控制方案，其机制依据与 GINA 原则是哪一项？",
    correctOption:
      "沙丁胺醇激动支气管 β2 受体升高 cAMP 以快速舒张平滑肌，但不控制潜在气道慢性炎症；GINA 强调哮喘方案应包含吸入糖皮质激素以减少炎症和急性加重",
    distractors: [
      "沙丁胺醇通过阻断糖皮质激素受体转录快速扩管，因此长期单用会完全抵消所有吸入激素的抗炎作用",
      "沙丁胺醇选择性阻断气道 M3 胆碱受体使 cAMP 下降，虽然抗炎较强但起效需数周才能缓解喘息",
      "沙丁胺醇只在支气管局部起效而绝不进入体循环，因此频繁过量吸入也不会引起震颤、心悸或低钾血症",
    ],
    explanation:
      "沙丁胺醇属于短效 β2 肾上腺素受体激动药（SABA），经 Gs 偶联激活腺苷酸环化酶使气道平滑肌内 cAMP 增加，迅速舒张痉挛支气管、缓解急性喘息症状。但它并不抑制气道嗜酸性粒细胞等慢性炎症过程，过度依赖 SABA 单药掩盖炎症进展反而增加急性加重与死亡风险，因此 GINA 2026 不推荐成人及青少年哮喘仅靠 SABA 单药治疗，而强调含吸入糖皮质激素（ICS）的方案。沙丁胺醇不阻断糖皮质激素受体，也不是 M3 拮抗剂；较高暴露仍可引起 β2 相关的骨骼肌震颤、心动过速及细胞内移钾所致低钾血症。",
    sources: [
      {
        title: "沙丁胺醇（albuterol）VENTOLIN HFA 说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=2ed73618-be3a-4331-9509-6401258f791f",
        sections: "5.1～5.8、12.1 节：β2—cAMP 舒张、不良反应及症状恶化警示",
      },
      {
        title: "GINA · 2026 哮喘策略概要",
        url: "https://ginasthma.org/2026-gina-summary-guide/",
        sections: "含 ICS 的哮喘治疗原则与 SABA 单药局限",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "empagliflozin-euglycemic-dka",
    cardId: "empagliflozin",
    category: "endocrine",
    prompt:
      "在药理学学习情景中，使用恩格列净者在禁食、围手术期或急性疾病期间发生酮症酸中毒（DKA）时，为什么可能表现为「血糖未明显升高」？",
    correctOption:
      "恩格列净抑制肾脏 SGLT2 使尿糖持续排出从而压低血糖水平，同时体内胰岛素需求下降与相对高胰高血糖素状态促进脂肪分解和生酮",
    distractors: [
      "恩格列净直接抑制肝脏糖原磷酸化酶使血糖无法升高，并直接把丙酮酸化学还原为 β-羟丁酸",
      "恩格列净强效刺激胰岛 β 细胞持续大量分泌胰岛素，使血糖保持偏低的同时直接诱导酮体合成",
      "SGLT2 抑制剂仅在血糖低于正常时才会抑制近端小管重吸收葡萄糖，高血糖时则会停止排糖",
    ],
    explanation:
      "恩格列净抑制肾近端小管钠-葡萄糖协同转运蛋白 2（SGLT2），降低肾糖阈并持续增加尿糖排泄。在禁食、脱水、手术或胰岛素减量等应激状态下，胰岛素不足与升糖/生酮激素（如胰高血糖素）相对升高促使脂肪动员和肝脏酮体生成加速；由于大量葡萄糖同时经尿液流失，血浆葡萄糖浓度可能仍处于正常或轻度升高范围（即血糖正常型酮症酸中毒，euDKA），容易延误识别。其余选项错误：恩格列净不刺激胰岛素分泌或直接还原丙酮酸；SGLT2 抑制的尿糖排泄量与滤过葡萄糖负荷正相关，高血糖时排糖更多而非停止。",
    sources: [
      {
        title: "DailyMed：JARDIANCE（empagliflozin）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=334f1b3d-5670-6685-e063-6294a90a7e47",
        sections: "第 5.1、12.1 节：酮症酸中毒（含血糖未显著升高情况）与 SGLT2 机制",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "metformin-renal-lactic-acidosis",
    cardId: "metformin",
    category: "endocrine",
    prompt:
      "在药理学学习情景中，为什么二甲双胍在急性肾功能损伤、严重低氧灌注或特定含碘造影前后的评估中，尤其强调警惕乳酸性酸中毒风险？",
    correctOption:
      "二甲双胍主要以原形经肾清除，肾功能骤降会导致药物显著蓄积；在缺氧或肝脏利用障碍时，乳酸生成增加且经糖异生清除受限，进一步推高血乳酸",
    distractors: [
      "二甲双胍在肝脏完全代谢为乳酸后经胆汁排泄，肾功能受损会逆转胆汁排泄路径",
      "二甲双胍通过强效刺激胰岛 β 细胞骤然释放胰岛素引起低血糖抽搐，从而继发乳酸酸中毒",
      "二甲双胍引起的乳酸性酸中毒主要源于直接抑制肾小管碳酸酐酶导致的近端肾小管酸中毒",
    ],
    explanation:
      "二甲双胍口服后几乎不经肝脏代谢，主要通过肾小球滤过和肾小管主动分泌以原形经尿液排泄。当出现急性肾功能恶化、脱水或含碘造影剂诱发肾功能波动风险时，二甲双胍血浆浓度可明显蓄积；同时在心衰休克、败血症或低氧状态下，外周组织无氧酵解产生乳酸增多，且药物减少肝糖输出的同时也限制了肝脏对乳酸的糖异生清除，共同增加罕见但致命的乳酸性酸中毒风险。二甲双胍不主要经肝代谢为乳酸，不以促胰岛素分泌为主要机制，也不通过抑制碳酸酐酶致病。",
    sources: [
      {
        title: "二甲双胍说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=104b5f5b-cc83-450d-82ec-1fd20c4f7119",
        sections: "黑框警告、禁忌与药代动力学：肾清除、缺氧及乳酸性酸中毒",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "propylthiouracil-vs-methimazole",
    cardId: "propylthiouracil",
    category: "endocrine",
    prompt:
      "在甲亢与甲状腺毒症学习情景中，比较丙硫氧嘧啶（PTU）与甲巯咪唑的药理机制与安全性边界，哪项判断最准确？",
    correctOption:
      "两者均抑制甲状腺过氧化物酶（TPO）减少新生激素合成且不灭活已储存激素；PTU 额外抑制外周 T4 向 T3 转化，但因严重肝损伤风险限制其常规首选地位",
    distractors: [
      "PTU 与甲巯咪唑都能直接中和血液中已释放的 T3 和 T4，因此给药后数小时即可完全清除甲状腺毒症",
      "甲巯咪唑除抑制 TPO 外还可强效抑制外周 5'-脱碘酶阻断 T4→T3 转化，因此是甲状腺危象绝对唯一的有效药物",
      "PTU 不会引起粒细胞缺乏或肝毒性，因此在所有非妊娠成人 Graves 病长期治疗中均优于甲巯咪唑",
    ],
    explanation:
      "丙硫氧嘧啶与甲巯咪唑同属硫脲类抗甲状腺药，均通过抑制甲状腺过氧化物酶（TPO）阻断碘有机化和碘化酪氨酸偶联，减少新激素合成，但都不使甲状腺滤泡内已储存或循环中的 T4/T3 失活。两者的核心机制差别在于：PTU 可抑制外周组织 5'-脱碘酶，减少 T4 转化为生物活性更高的 T3，因而在甲状腺危象等需要迅速降低外周活性激素的情境中常被考虑；然而 PTU 存在严重的特异质性肝衰竭警告，故常规甲亢多优先甲巯咪唑（妊娠早期或特定不耐受情况另按指南权衡），且两者均须警惕粒细胞缺乏。",
    sources: [
      {
        title: "丙硫氧嘧啶说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b0c23a2c-b250-4c0d-9b2a-c1483faa2ca0",
        sections: "黑框警告、药理与不良反应：肝损伤、粒细胞缺乏及外周 T4→T3 抑制",
      },
      {
        title: "ATA · 甲亢及甲状腺毒症指南（2016）",
        url: "https://doi.org/10.1089/thy.2016.0229",
        sections: "抗甲状腺药选择；甲状腺危象治疗表 7；血液与肝脏风险",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "methotrexate-leucovorin-weekly-warning",
    cardId: "methotrexate",
    category: "antineoplastic",
    prompt:
      "在药理学学习情景中，关于大剂量甲氨蝶呤后的亚叶酸钙解救机制，以及非肿瘤用途（如类风湿关节炎）误按每日给药的毒性警示，哪项表述最准确？",
    correctOption:
      "甲氨蝶呤抑制二氢叶酸还原酶（DHFR），亚叶酸钙（5-甲酰四氢叶酸）可绕过 DHFR 阻断补充还原叶酸以解救正常细胞；非肿瘤用途通常按周给药，误作日服可致致命骨髓与黏膜毒性",
    distractors: [
      "普通叶酸片可无需还原酶直接绕过 DHFR 阻断，因此在大剂量甲氨蝶呤方案中与亚叶酸钙具有完全相同的急性解救效力",
      "亚叶酸钙通过在肾小管内与甲氨蝶呤共价结合使其失去抑制 DHFR 的能力，因此必须在甲氨蝶呤输注前同时大剂量快速推注",
      "低剂量抗风湿用途与高剂量抗肿瘤方案一样均需每日服用，只需合用普通维生素 B12 即可完全避免骨髓抑制和肝肺毒性",
    ],
    explanation:
      "甲氨蝶呤抑制二氢叶酸还原酶（DHFR），阻断二氢叶酸转化为四氢叶酸，从而抑制嘌呤与胸苷酸合成及 DNA 复制。亚叶酸钙本身已是还原型叶酸衍生物（5-甲酰四氢叶酸），可在细胞内直接转化为四氢叶酸辅酶而绕过 DHFR 阻断，按特定时间窗给药用于挽救正常骨髓与黏膜细胞（而普通叶酸仍需经 DHFR 还原，不能用于急性大剂量解救）。同时，说明书黑框警告强调：用于类风湿关节炎、银屑病等非肿瘤适应症时为每周一次（或每周分次）给药，若误按每日一次服用可导致严重甚至致命的全血细胞减少与黏膜溃烂。",
    sources: [
      {
        title: "甲氨蝶呤说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=aafd97c1-3a0a-42b2-845a-a9db9bb7d876",
        sections: "黑框警告、药理与给药频次：按周给药误服日服风险与叶酸代谢",
      },
      {
        title: "亚叶酸钙注射剂说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=79d023ab-7d77-48c1-8f47-ea322fd58c2b",
        sections: "叶酸拮抗药解救机制与时间窗",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "cyclophosphamide-acrolein-mesna",
    cardId: "cyclophosphamide",
    category: "antineoplastic",
    prompt:
      "在抗肿瘤药理学学习情景中，环磷酰胺诱发出血性膀胱炎的核心代谢产物及美司钠（Mesna）的保护机制分别是哪一项？",
    correctOption:
      "肝代谢产物醛磷酰胺分解生成磷酰胺氮芥与副产物丙烯醛，丙烯醛经尿排泄刺激损伤膀胱黏膜；美司钠在尿路中提供巯基与丙烯醛结合失活",
    distractors: [
      "磷酰胺氮芥在尿液中被细菌转化为氰化物损伤膀胱；美司钠在血液中直接螯合环磷酰胺原药阻止其进入肝脏代谢",
      "环磷酰胺原药本身具有极强酸蚀性直接烧伤尿道；美司钠通过碱化血液并完全阻断肾小球滤过来保护膀胱",
      "美司钠可在全身组织中逆转磷酰胺氮芥造成的 DNA 交联，因此能同时彻底消除环磷酰胺的骨髓抑制与脱发风险",
    ],
    explanation:
      "环磷酰胺为前药，经肝细胞色素 P450 酶活化为 4-羟基环磷酰胺及其互变异构体醛磷酰胺，随后在细胞内分解产生发挥 DNA 烷化及交联抗肿瘤作用的磷酰胺氮芥，以及另一个重要裂解副产物——丙烯醛（acrolein）。丙烯醛经肾脏排泄并在膀胱蓄积，对尿路上皮造成化学性刺激与损伤，引起出血性膀胱炎。美司钠（Mesna）在尿液中游离出巯基，与丙烯醛发生结合反应形成无毒硫醚化合物排出，且因其主要局限在尿路与胞外环境，不会抵消肿瘤细胞内的全身烷化效应，但也不消除骨髓抑制等其他系统毒性。",
    sources: [
      {
        title: "环磷酰胺说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=5bad5bfc-12c0-46a2-8355-1028f108ecbf",
        sections: "药理、警告与不良反应：丙烯醛与出血性膀胱炎、尿路保护",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "osimertinib-egfr-t790m-resistance",
    cardId: "osimertinib",
    category: "antineoplastic",
    prompt:
      "在靶向抗肿瘤学习情景中，部分 EGFR 敏感突变非小细胞肺癌经第一代可逆 EGFR-TKI 治疗进展后出现 EGFR T790M 耐药突变，第三代药物奥希替尼能够克服该耐药的机制是什么？",
    correctOption:
      "奥希替尼针对突变型 EGFR 激酶结构域（包括敏感突变及 T790M 突变）形成不可逆共价结合并保持对野生型 EGFR 较低亲和力，同时需经分子检测确认突变",
    distractors: [
      "奥希替尼改作细胞外单克隆抗体阻断 HER2 二聚化，完全不与 EGFR 细胞内酪氨酸激酶结构域结合",
      "奥希替尼通过与 T790M 突变的腺苷三磷酸（ATP）以弱可逆氢键竞争，且对野生型 EGFR 亲和力远高于突变型",
      "奥希替尼属于广谱细胞毒烷化剂，无需检测 EGFR 突变状态即可用于所有非小细胞肺癌患者",
    ],
    explanation:
      "第一代 EGFR-TKI（如吉非替尼）以可逆方式竞争性结合 EGFR 激酶区 ATP 口袋；当肿瘤细胞出现外显子 20 T790M「看门人」突变时，空间位阻与 ATP 亲和力变化使一代可逆抑制剂失效。奥希替尼为第三代不可逆 EGFR-TKI，可与 EGFR 激酶区 C797 残基形成共价键，同时高效抑制外显子 19 缺失/21 L858R 敏感突变和 T790M 耐药突变，且对野生型 EGFR 活性较弱。说明书要求用药前必须经临床验证检测确认相应 EGFR 突变存在，并需关注间质性肺病（ILD）、QTc 延长及心肌病等不良反应。",
    sources: [
      {
        title: "TAGRISSO（osimertinib）说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=5e81b4a7-b971-45e1-9c31-29cea8c87ce7",
        sections: "第 1、2.1、5.1～5.6、12.1 节：突变检测、T790M 不可逆共价结合与心肺风险",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "linezolid-maoi-serotonin-syndrome",
    cardId: "linezolid",
    category: "antibacterial",
    prompt:
      "在抗菌药物相互作用学习情景中，为什么正在使用 SSRI 类抗抑郁药时合用利奈唑胺需高度警惕 5-羟色胺（血清素）综合征风险？",
    correctOption:
      "利奈唑胺除结合细菌 50S 亚基抑制蛋白合成外，还具有可逆性非选择性单胺氧化酶抑制（MAOI）特性，减少 5-HT 降解并与 SSRI 的再摄取抑制叠加",
    distractors: [
      "利奈唑胺强效诱导肝脏 CYP2D6 酶将 SSRI 快速代谢为强效兴奋中枢的毒性胺类产物",
      "利奈唑胺直接激动人脑突触后膜所有 5-HT 受体，其结合亲和力高于细菌核糖体 50S 亚基",
      "利奈唑胺属于不可逆性细菌肽聚糖合成酶抑制剂，通过引起肠道菌群崩溃间接升高脑内 5-HT",
    ],
    explanation:
      "利奈唑胺属于噁唑烷酮类抗菌药，主要通过结合细菌核糖体 50S 亚基 23S rRNA 阻断 70S 起始复合物形成来治疗敏感革兰阳性菌感染。但在人体药理方面，利奈唑胺还具有弱的、可逆性、非选择性单胺氧化酶抑制（MAOI）活性，可减少突触内单胺类递质（包括 5-羟色胺、去甲肾上腺素等）的氧化降解。当与抑制突触前 SERT 回收 5-HT 的 SSRI 合用时，突触间隙 5-HT 蓄积显著加剧，可诱发以精神状态改变、自主神经功能紊乱及神经肌肉兴奋性增高（阵挛、肌强直、高热）为特征的血清素综合征。",
    sources: [
      {
        title: "DailyMed：Linezolid 片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3e0d868d-f419-47e8-a3bc-41ececac468b",
        sections: "第 5.3、7、12.4 节：单胺氧化酶抑制特性、血清素综合征及 50S 核糖体机制",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "vancomycin-infusion-reaction-rate",
    cardId: "vancomycin",
    category: "antibacterial",
    prompt:
      "在药理学学习情景中，静脉输注万古霉素过快时出现面颈及上半身潮红、瘙痒伴低血压（万古霉素输注反应），对其免疫与药理学机制的正确理解是哪一项？",
    correctOption:
      "主要为与输注速率及浓度相关的非 IgE 介导肥大细胞和嗜碱性粒细胞直接脱颗粒释放组胺；减慢输注速度可降低风险但不能保证绝不发生",
    distractors: [
      "属于典型的 IgE 介导 I 型速发变态反应，与静脉输注速率和浓度完全无关，只要发生即意味着终生禁用于任何糖肽类药物",
      "源于万古霉素迅速溶解革兰阴性菌细胞壁外膜释放大量内毒素所致的菌群内毒素休克",
      "是因为万古霉素在体内快速代谢为去甲肾上腺素耗竭剂，从而引起中枢性血管运动中枢麻痹",
    ],
    explanation:
      "万古霉素输注反应（过去曾称红人综合征）主要由药物直接刺激皮肤肥大细胞和嗜碱性粒细胞脱颗粒释放组胺引起，属于非 IgE 介导的假性过敏/输注反应，发生风险与静脉输注速率过快及给药浓度过高密切相关。按照说明书延长输注时间（通常不少于 60 分钟，并控制输注速率）有助于降低发生率与严重程度，但仍不能保证慢滴后绝对不发生，且需与真正的 IgE 介导严重过敏反应鉴别。万古霉素通过结合肽聚糖前体 D-Ala-D-Ala 抑制敏感革兰阳性菌细胞壁合成，不覆盖革兰阴性菌，也不通过消耗去甲肾上腺素起效。",
    sources: [
      {
        title: "万古霉素说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=06dcfd36-942f-4752-86ad-4c5a6fc3e48f",
        sections: "药理、警告与不良反应：输注反应（组胺释放与输注速率关系）",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "gentamicin-furosemide-ototoxicity",
    cardId: "gentamicin",
    category: "antibacterial",
    prompt:
      "在药理学学习情景中，庆大霉素与静脉呋塞米合并使用时为什么耳毒性（耳蜗及前庭毒性）与肾毒性风险会明显升高？",
    correctOption:
      "两药均具有潜在耳毒性，合用在内耳毛细胞及内淋巴离子稳态产生叠加损伤；同时呋塞米导致的容量不足和肾排泄变化可加剧经肾清除的庆大霉素蓄积与肾毒性",
    distractors: [
      "呋塞米强效诱导肝药酶使庆大霉素转化为耳毒性代谢产物，因此只要肝功能正常即可避免二者合用的耳毒性",
      "庆大霉素通过激动血管纹 NKCC2 增加内淋巴钾浓度，而呋塞米阻断 30S 核糖体导致听神经蛋白质合成障碍",
      "呋塞米仅引起可逆性低钾血症而本身绝无耳毒性，合用风险仅仅源自两种药物在静脉输液袋中产生沉淀",
    ],
    explanation:
      "庆大霉素（氨基糖苷类）可损伤内耳耳蜗及前庭毛细胞并主要以原形经肾脏清除，高暴露或肾功能减退易引起不可逆耳毒性与肾小管毒性。呋塞米（袢利尿剂）除抑制肾髓袢 NKCC2 外，同样作用于内耳血管纹离子转运并可诱发耳毒性（尤其快速大剂量静脉给药时）。两者合用时，不仅耳毒性产生药效学叠加，利尿所致的血容量不足和肾血流灌注下降还可减少庆大霉素清除、加重肾皮质药物蓄积与肾损伤。庆大霉素基本不经肝药酶代谢，呋塞米也不作用于细菌 30S 核糖体。",
    sources: [
      {
        title: "庆大霉素说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=449c9a41-d61e-49fd-b5e3-d76f74b92acf",
        sections: "黑框警告、警告与相互作用：耳毒性、肾毒性及强效利尿药合用",
      },
      {
        title: "呋塞米说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=48d8f490-e9d1-4c95-ab2f-414d3f4a9df4",
        sections: "警告与相互作用：耳毒性及氨基糖苷类合用风险",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "oseltamivir-beyond-48h-severe-flu",
    cardId: "oseltamivir",
    category: "antiviral",
    prompt:
      "在抗流感药理学学习情景中，关于奥司他韦的作用机制以及「发病超过 48 小时」时的用药原则辨析，哪项表述最符合说明书与 CDC 指南？",
    correctOption:
      "奥司他韦活性代谢物抑制流感病毒神经氨酸酶以阻断子代病毒从宿主细胞释放；虽然单纯性流感强调 48 小时内尽早开始，但住院、重症或进展性流感超过 48 小时启动仍可能带来治疗获益",
    distractors: [
      "奥司他韦直接杀灭游离病毒颗粒并阻断病毒 RNA 聚合酶合成，一旦发病超过 48 小时所有患者均绝对无效且列为禁忌",
      "奥司他韦通过抑制宿主细胞唾液酸合成酶阻止病毒吸附，与流感疫苗具有完全相同的长期免疫预防效力",
      "奥司他韦仅对乙型流感病毒有效且需等待病毒核酸确认后方可启动，发病 48 小时后在重症住院患者中也不推荐开始使用",
    ],
    explanation:
      "奥司他韦是前药，经肝酯酶水解为活性羧酸代谢物，选择性抑制甲型和乙型流感病毒神经氨酸酶（NA），减少神经氨酸酶对宿主细胞表面唾液酸残基的切割，从而阻断新生病毒颗粒从被感染细胞的出芽释放与继续播散。在时间窗上，单纯门诊患者发病 48 小时内尽早启动获益最大；但根据 CDC 流感抗病毒指南更新，对于需要住院、存在重症或疾病呈进展性加重的流感患者，即使已超过发病 48 小时，启动奥司他韦治疗仍可降低并发症与不良结局风险。本药不替代流感疫苗，也不直接杀灭游离病毒或抑制 RNA 聚合酶（后者如玛巴洛沙韦靶向的机制）。",
    sources: [
      {
        title: "奥司他韦说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b015d73a-f3b6-4258-8972-6fc4a043aed8",
        sections: "药理、适应症与使用原则",
      },
      {
        title: "CDC · 流感抗病毒治疗（2026 更新）",
        url: "https://www.cdc.gov/flu/hcp/antivirals/summary-clinicians.html",
        sections: "住院、重症及进展性流感：超过 48 小时的治疗获益",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "nirmatrelvir-ritonavir-cyp3a4-ddi",
    cardId: "nirmatrelvir-ritonavir",
    category: "antiviral",
    prompt:
      "在抗病毒学习情景中，奈玛特韦/利托那韦联合包装在用药前必须系统核查所有合并用药清单，其药理学原因是什么？",
    correctOption:
      "奈玛特韦抑制 SARS-CoV-2 主蛋白酶（Mpro），而利托那韦作为强效 CYP3A4（及 P-gp）抑制剂用于减缓奈玛特韦代谢，因而也会使多种经 CYP3A 代谢的合并用药血药浓度骤升",
    distractors: [
      "利托那韦是直接抑制 SARS-CoV-2 主蛋白酶的主要抗病毒活性成分，奈玛特韦仅用于抑制肾脏排泄",
      "奈玛特韦/利托那韦是强效 CYP3A4 诱导剂，会大幅加速所有合用他汀类和抗凝药的清除而导致完全失效",
      "只要把奈玛特韦单独与利托那韦错开 2 小时服用，就可以完全消除利托那韦对其他 CYP3A4 底物药物的相互作用",
    ],
    explanation:
      "在该复方中，真正针对 SARS-CoV-2 主蛋白酶（Mpro/3CLpro）发挥阻断病毒多聚蛋白裂解及复制作用的是奈玛特韦；利托那韦本身不直接抑制新冠 Mpro，而是作为药代动力学增强剂强效抑制 CYP3A4（并抑制 P-gp 等转运体），减缓奈玛特韦首过及系统代谢以维持有效抗病毒浓度。正因利托那韦的强效且持久的酶抑制作用（停药后仍可持续数天），高度依赖 CYP3A 清除的合并用药（如部分他汀、抗心律失常药、直接口服抗凝药、镇静药等）暴露量可能急剧升高至危及生命，故黑框警告要求用药前全面核查相互作用；错开数小时服药不能避免酶抑制。",
    sources: [
      {
        title: "PAXLOVID（nirmatrelvir; ritonavir）说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=8a99d6d6-fd9e-45bb-b1bf-48c7f761232a",
        sections: "黑框警告、第 4、5.1、7、12.1 节：Mpro 抑制、CYP3A4 增强与药物相互作用",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "voriconazole-nonlinear-pk-visual",
    cardId: "voriconazole",
    category: "antifungal",
    prompt:
      "在抗真菌药理学学习情景中，关于伏立康唑在侵袭性曲霉病治疗中的药代动力学特点、视觉不良反应与特殊制剂限制，哪项描述最准确？",
    correctOption:
      "因肝药酶代谢饱和呈非线性药代动力学（加量时血药暴露超比例升高），常见一过性视觉障碍（畏光/色觉改变），且中重度肾功能不全应避免静脉制剂以防辅料 SBECD 蓄积",
    distractors: [
      "伏立康唑呈严格线性药代动力学且完全不经 CYP 酶系代谢，因此调整剂量时血药浓度永远按固定比例变化且无 CYP 相互作用",
      "伏立康唑的视觉障碍必然代表不可逆视网膜永久失明，一旦出现一过性畏光即说明药物对毛霉目也已产生完全杀菌作用",
      "伏立康唑母体在肾功能不全时大量经尿排泄受阻，因此肌酐清除率下降时口服片剂禁用，只能改用静脉制剂",
    ],
    explanation:
      "伏立康唑抑制真菌 14α-去甲基化酶阻断麦角固醇合成，对曲霉等丝状真菌具强活性（但仍不覆盖毛霉目）。由于其在肝内主要经 CYP2C19、CYP2C9 和 CYP3A4 代谢且易发生酶饱和，表现为典型的非线性药代动力学——剂量小幅上调即可导致血浆峰浓度和 AUC 呈超比例升高，且受 CYP2C19 基因多态性及复杂 CYP 抑制/诱导相互作用影响显著。不良反应中约两成患者出现一过性、可逆的视觉障碍（视物模糊、色觉改变、畏光），长程需警惕视神经炎。口服伏立康唑不需因肾功能减退调量，但静脉制剂含磺丁基-β-环糊精钠（SBECD），在中重度肾功能不全（CrCl < 50 mL/min）时易蓄积，应优先改用口服制剂。",
    sources: [
      {
        title: "VFEND（voriconazole）说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=dac26bcd-7a59-401f-9f66-a0649767cece",
        sections: "第 5、6、7、12.1、12.3 节：非线性 PK、视觉异常、CYP 相互作用与肾功不全 SBECD 警示",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "allopurinol-initiation-gout-flare",
    cardId: "allopurinol",
    category: "analgesic",
    prompt:
      "在痛风药理学学习情景中，为什么别嘌醇（黄嘌呤氧化酶抑制剂）在开始降尿酸治疗初期反而可能诱发痛风急性发作，而不能直接充当急性止痛药？",
    correctOption:
      "别嘌醇通过抑制黄嘌呤氧化酶减少尿酸生成而非直接抗炎止痛；起始阶段血尿酸迅速波动促使关节内沉积的尿酸盐微晶体溶解动员，从而引发局部急性炎症发作",
    distractors: [
      "别嘌醇初始给药时会暂时激活黄嘌呤氧化酶使尿酸生成飙升，通常在服用后第 1 小时直接诱发关节晶体新沉淀",
      "别嘌醇通过抑制肾小管尿酸转运体 URAT1 立即排出大量尿酸，从而直接刺激关节滑膜释放前列腺素致痛",
      "别嘌醇对皮肤粘膜绝对安全，起始诱发痛风发作仅仅提示需要立即把剂量加倍以压制炎症",
    ],
    explanation:
      "别嘌醇及其活性代谢物氧嘌呤醇通过抑制黄嘌呤氧化酶（XO），阻断次黄嘌呤→黄嘌呤→尿酸的生成通路，本身既无直接镇痛作用也不直接抑制关节急性炎症。在降尿酸治疗起始阶段，血尿酸水平快速降低导致关节滑膜或软骨沉积的尿酸钠微晶体表面溶解、脱落并被中性粒细胞吞噬，反而可触发痛风急性发作，因此常需评估联合抗炎预防且不宜将其用作急性发作期止痛药。同时，说明书提示需警惕严重皮肤不良反应（SJS/TEN/DRESS），且高危人群（如汉族等）在启动前应考虑筛查 HLA-B*58:01 等位基因，出现皮疹应立即停药就医而非加量。",
    sources: [
      {
        title: "DailyMed：Allopurinol 片说明书",
        url: "https://www.dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=bdbf5ad4-86f2-4e9c-a51a-fb0c7220c480",
        sections: "第 1、2、5、12.1、12.5 节：XO 抑制、起始痛风发作及 HLA-B*58:01 皮肤反应警示",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "colchicine-narrow-window-cyp3a4-pgp",
    cardId: "colchicine",
    category: "analgesic",
    prompt:
      "在药理学学习情景中，秋水仙碱为何具有极窄的治疗窗，且在肝或肾功能受损时严禁与强效 CYP3A4 或 P-gp 抑制剂（如克拉霉素）联用？",
    correctOption:
      "秋水仙碱抑制 β-微管蛋白聚合以限制中性粒细胞炎症活动，且依赖 CYP3A4 代谢与 P-gp 外排；双途径受抑（尤伴肝肾清除受损）可致致命骨髓抑制与神经肌肉毒性",
    distractors: [
      "秋水仙碱通过抑制黄嘌呤氧化酶大幅降低血尿酸，强效 CYP3A4 抑制剂会阻断其降尿酸作用并引起急性高尿酸肾病",
      "秋水仙碱仅经尿液原形排泄而完全不涉及 CYP3A4 或 P-gp 转运，合用风险只因克拉霉素抑制其肠道吸收",
      "秋水仙碱诱发的严重腹泻说明抗炎已达到最佳安全剂量，可继续联用强效 CYP3A4 抑制剂并加大剂量",
    ],
    explanation:
      "秋水仙碱通过与 β-微管蛋白结合抑制微管聚合，从而阻断中性粒细胞的趋化、活化与脱颗粒，减轻痛风急性炎症，但对尿酸生成与排泄无影响。其药代动力学高度依赖肠道与肝脏 CYP3A4 代谢以及 P-糖蛋白（P-gp）外排转运，同时存在经肾排泄环节。因为秋水仙碱治疗窗窄（中毒量与治疗量接近），一旦合用强效 CYP3A4 或 P-gp 抑制剂（如克拉霉素、伊曲康唑、利托那韦等），尤其在合并肝功能或肾功能不全时，血药暴露急剧攀升，可致严重甚至致命的骨髓抑制、横纹肌溶解及多器官毒性；显著胃肠反应往往是中毒早期信号而非安全上限指标。",
    sources: [
      {
        title: "DailyMed：Colchicine 片说明书",
        url: "https://www.dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=5e5d9488-d9d0-4b37-b535-941d66c3430d&type=display",
        sections: "黑框/警告、第 4、5、7、12.1 节：微管机制、CYP3A4/P-gp 禁忌及肌肉血液毒性",
      },
      {
        title: "emc：Colchicine 片产品特性概要",
        url: "https://www.medicines.org.uk/emc/product/14362/smpc",
        sections: "第 4.4、5.1 节：窄治疗窗与无降尿酸作用",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "levodopa-carbidopa-peripheral-aadc",
    cardId: "levodopa",
    category: "nervous",
    prompt:
      "在帕金森病药理学学习情景中，为什么左旋多巴通常与外周脱羧酶抑制剂卡比多巴组成复方使用，而不是直接单独大剂量给予左旋多巴或直接注射多巴胺？",
    correctOption:
      "多巴胺难透过血脑屏障，而左旋多巴可入脑；卡比多巴不透过血脑屏障且抑制外周芳香族 L-氨基酸脱羧酶，减少外周转化为多巴胺以提高入脑比例并减轻外周不良反应",
    distractors: [
      "卡比多巴能随左旋多巴一起大量进入脑内并直接激活纹状体 D2 受体，从而使左旋多巴无需再在脑内脱羧",
      "左旋多巴不能透过血脑屏障，必须先在外周经卡比多巴转化为水溶性多巴胺后才能主动转运入脑",
      "卡比多巴抑制中枢和外周的 COMT 酶来阻止左旋多巴降解，从而彻底阻断异动症等运动并发症的发生",
    ],
    explanation:
      "多巴胺分子极性高、难以透过血脑屏障，而左旋多巴作为中性氨基酸前体可经氨基酸转运体入脑，并在脑内经芳香族 L-氨基酸脱羧酶（AADC）脱羧转化为多巴胺以改善帕金森病运动症状。若单用左旋多巴，绝大多数药物在外周组织即被 AADC 转化为多巴胺，不仅入脑极少，还会引发明显的恶心、呕吐和体位性低血压等外周多巴胺能不良反应。卡比多巴几乎不透过血脑屏障，选择性抑制外周 AADC，既减少外周消耗和外周副作用，又允许在降低左旋多巴总剂量的同时增加入脑份额；但复方仍可能因中枢多巴胺能波动引起异动症及运动波动。",
    sources: [
      {
        title: "卡比多巴/左旋多巴口服片说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=dd2215a9-ee0f-443a-a2e3-3d0578c8cd8f",
        sections: "药理、适应症与不良反应：血脑屏障及外周脱羧抑制机制",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "valproate-teratogenicity-hepatotoxicity",
    cardId: "valproate",
    category: "nervous",
    prompt:
      "在中枢神经药理学学习情景中，关于丙戊酸钠的作用机制边界及其在有生育潜能人群和肝病风险中的重要安全警示，哪项最准确？",
    correctOption:
      "丙戊酸钠抗癫痫机制涉及脑内 GABA 增多及离子通道调节等多环节（完整机制未完全确立）；因其具有明确的致畸/神经管缺陷与神经发育风险及严重肝毒性警示，绝非无条件首选",
    distractors: [
      "丙戊酸钠通过单一阻断突触后 GABA-A 受体氯通道发挥作用，且因不通过胎盘屏障故可作为妊娠期各类癫痫的无条件首选",
      "丙戊酸钠不同盐型及缓释制剂在任何情况下均可按毫克数直接 1:1 互换，且不会引起血小板减少、高氨血症或胰腺炎",
      "丙戊酸钠引起的肝毒性仅见于联用卡比多巴时，单药治疗不会造成致命性肝损伤或致畸风险",
    ],
    explanation:
      "丙戊酸钠的完整抗癫痫机制尚未完全单一化确立，说明书指出其可能与脑内 γ-氨基丁酸（GABA）浓度增加以及电压门控钠通道、钙通道调节等多环节有关。安全性方面，丙戊酸钠带有严格的黑框警示：一是妊娠暴露可致脊柱裂等严重神经管缺陷、其他重大先天畸形及儿童期智商下降/神经发育障碍，因此对有生育潜能者及妊娠人群必须严格评估风险与避孕/替代方案；二是可致严重甚至致命肝毒性（尤其婴幼儿及线粒体疾病高危者）以及急性胰腺炎、血小板减少、高氨血症等。此外，不同制剂释放与暴露特征不同，不能仅凭药名直接替代。",
    sources: [
      {
        title: "丙戊酸钠说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ec41025a-ed7d-48c8-9005-08e3a9417f30",
        sections: "黑框警告、药理与不良反应：致畸性、肝毒性、胰腺炎与机制说明",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "epinephrine-im-anaphylaxis-vs-h1",
    cardId: "epinephrine",
    category: "antiallergic",
    prompt:
      "在严重过敏反应（过敏性休克）药理学学习情景中，为什么首选肌内注射肾上腺素作为一线急救措施，而不能仅依靠口服第二代 H1 抗组胺药？",
    correctOption:
      "肾上腺素迅速激动 α 与 β 肾上腺素受体，同时收缩血管升压减轻水肿、增强心肌收缩并舒张支气管平滑肌；口服 H1 抗组胺药起效慢且无法逆转休克性低血压与支气管痉挛",
    distractors: [
      "口服 H1 抗组胺药可同时激动 α1 受体和 β2 受体，只是因为消化道吸收过快容易诱发高血压脑出血而不作首选",
      "肾上腺素选择性阻断 H1 受体并直接中和血清中的特异性 IgE 抗体，从而在数秒内消除过敏原触发机制",
      "由于手指等末端误注可能导致缺血风险，发生怀疑过敏性休克时应先口服抗组胺药观察数小时再考虑肌内注射肾上腺素",
    ],
    explanation:
      "严重全身过敏反应常伴肥大细胞与嗜碱性粒细胞释放组胺、白三烯、血小板活化因子等多种介质，引发血管扩张、毛细血管渗漏低血压及严重支气管痉挛。肌内注射肾上腺素可快速吸收并激动全身 α 和 β 肾上腺素受体：α1 效应收缩外周血管、提升血压并减轻喉头及黏膜水肿；β1 效应增强心肌收缩与心率；β2 效应直接舒张支气管平滑肌并抑制炎症介质进一步释放。相比之下，口服 H1 抗组胺药仅阻断组胺 H1 受体，起效较慢且不能逆转低血压休克或支气管痉挛，不能替代肾上腺素作为一线急救；此外，说明书明确误注指端风险不构成延误严重过敏急救的理由。",
    sources: [
      {
        title: "DailyMed：EPIPEN（epinephrine）自动注射器说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=311af6d9-20c0-4b87-b236-4185bfa49988",
        sections: "第 1、5、12.1～12.2 节：严重过敏急救一线定位与 α/β 受体机制",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "naloxone-postoperative-recurrence",
    cardId: "naloxone",
    category: "antidote",
    prompt:
      "术后恢复室内，一名接受阿片镇痛的患者呼吸变慢。使用纳洛酮后通气改善，随后在没有追加阿片的情况下呼吸再次变慢。哪项机制能同时解释这两次变化？",
    correctOption:
      "纳洛酮与阿片竞争受体。拮抗作用减弱时，体内仍有活性的阿片可再次抑制呼吸",
    distractors: [
      "纳洛酮使肝脏迅速清除阿片。其作用减弱后，已清除的阿片重新进入循环",
      "纳洛酮不可逆地封闭阿片受体。通气再次减弱说明此时已合成了大量新受体",
      "纳洛酮是阿片受体部分激动剂。通气再次减弱源于纳洛酮自身延迟出现的激动效应",
    ],
    explanation:
      "纳洛酮竞争性占据阿片受体，对 μ 受体亲和力最高，因此可以迅速逆转阿片所致呼吸抑制。若阿片作用持续更久，纳洛酮的拮抗效应消退后，残余阿片仍能作用于受体，这也是最初通气改善后仍需监护的原因。肝清除加快无法解释已经清除的药物重新出现；受体竞争可逆，无需新受体合成即可恢复阿片效应；纳洛酮本身缺乏解释呼吸再抑制所需的阿片激动活性。",
    sources: [
      {
        title: "DailyMed：盐酸纳洛酮注射液（Somerset Therapeutics）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b59ee3cc-9604-4abc-81be-897e2f42aa67",
        sections: "Clinical Pharmacology、Warnings 和 Dosage and Administration（Postoperative Opioid Depression）：受体竞争、作用时程与术后呼吸抑制复发。",
      },
    ],
    sourcesCheckedOn: "2026-11-25",
  },
  {
    id: "tacrolimus-transplant-nfat-il2",
    cardId: "tacrolimus",
    category: "immunomodulator",
    prompt:
      "在肾移植抗排斥治疗的机制讨论中，学生观察到，受刺激的 T 细胞接触他克莫司后，进入细胞核的 NFAT 减少，产生的白细胞介素 2（IL-2）也减少。哪个环节最能解释这组结果？",
    correctOption:
      "他克莫司与细胞内 FKBP12 结合，抑制钙调磷酸酶，使 NFAT 难以去磷酸化并进入细胞核",
    distractors: [
      "他克莫司结合细胞外已经分泌的 IL-2，使其无法与受体结合，从而直接阻断 NFAT 入核",
      "他克莫司与 FKBP12 结合后增强钙调磷酸酶活性，使 NFAT 去磷酸化后滞留在细胞质",
      "他克莫司在细胞核内直接占据 IL-2 基因启动子，使已入核的 NFAT 无法启动转录",
    ],
    explanation:
      "他克莫司与 FKBP12 形成的复合物抑制钙调磷酸酶。NFAT 的去磷酸化和入核随之减少，IL-2 等细胞因子的表达下降，T 细胞活化受到抑制。结合细胞外 IL-2 只会截断已分泌细胞因子的信号，不能直接解释 NFAT 入核减少。增强钙调磷酸酶活性会促进 NFAT 去磷酸化和入核，方向与观察相反。直接占据启动子至多能解释转录减少，无法解释上游的入核变化。",
    sources: [
      {
        title: "DailyMed：PROGRAF（他克莫司）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=7f667de1-9dfa-4bd6-8ba0-15ee2d78873b",
        sections: "第 1 节 Indications and Usage 与第 12.1 节 Mechanism of Action：预防移植排斥、FKBP12、钙调磷酸酶、NFAT 及 IL-2 表达。",
      },
    ],
    sourcesCheckedOn: "2026-11-25",
  },
];
