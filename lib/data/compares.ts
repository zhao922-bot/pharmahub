import type { CompareGroup } from "@/lib/types";

/**
 * 同类药对比分组。
 *
 * 为什么对比数据独立于卡片数据：
 * 卡片是「纵向」的（一个药讲透），对比是「横向」的（多个药在同一维度上的差异）。
 * 如果把对比信息塞进卡片，每张卡都要知道「跟谁比、比什么」，
 * 卡片之间会产生大量循环引用。独立成组更清晰，也便于增删。
 *
 * 分组原则：**只收录真正有临床决策价值、且差异能被一句话说清的组合**。
 * 同机制的两个药（如奥美拉唑 vs 泮托拉唑）不值得对比，
 * 因为差异主要是药代动力学细节，对学习机制没有帮助。
 */
export const COMPARE_GROUPS: readonly CompareGroup[] = [
  {
    id: "antihistamine-gen",
    title: "第一代 vs 第二代抗组胺药",
    summary: "两药均拮抗 H1 受体；中枢镇静、抗胆碱作用和作用时程存在相对差异。",
    drugIds: [
      "chlorpheniramine",
      "loratadine",
    ],
    rows: [
      {
        quizId: "blood-brain-barrier",
        quizExplanation: "这里比较的是相对中枢暴露，不能将第二代写成绝不进入脑内或绝无嗜睡。",
        label: "中枢暴露特点",
        values: [
          "较易进入中枢，镇静较突出",
          "以外周 H1 作用为主，中枢影响较少",
        ],
      },
      {
        quizId: "sedation",
        quizExplanation: "两药都可能嗜睡；本题描述的是通常的相对倾向，不以是否困倦单独识药，也不保证驾驶安全。",
        label: "镇静倾向",
        values: [
          "嗜睡、注意力下降较常见",
          "通常较少镇静，但部分人仍会嗜睡",
        ],
      },
      {
        quizId: "anticholinergic",
        quizExplanation: "第一代药的抗胆碱负荷通常更高，老年人尤其需关注；不能把所有类似症状都视为第一代独有。",
        label: "抗胆碱负荷",
        values: [
          "较突出，可出现口干、视物模糊及尿潴留",
          "通常较弱，但不代表绝无口干等不良反应",
        ],
      },
      {
        quizId: "duration",
        quizExplanation: "作用维持时间不等于血浆半衰期；比较限定所引常规口服制剂，不能用于自行换算剂量。",
        label: "所引常规口服制剂的作用时程",
        values: [
          "作用维持相对较短，常需分次给药",
          "通常可维持约 24 小时，常每日一次",
        ],
      },
      {
        label: "驾驶与高风险操作",
        values: [
          "嗜睡和反应减慢可明显影响驾驶",
          "虽通常较少影响，仍需确认个体反应",
        ],
      },
    ],
    takeaways: [
      "少镇静是相对特点，不能写成第二代完全不困。",
      "氯苯那敏的镇静不是自行助眠的理由；老年人还需注意抗胆碱负荷。",
      "两药用途、年龄及相互作用均须看具体制剂说明书。",
    ],
    sources: [
      {
        title: "氯苯那敏 4 mg 片说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/14298/smpc",
        sections: "4.1 适应症、4.4–4.8 风险与不良反应、5.1 药效学",
      },
      {
        title: "氯雷他定 10 mg 片说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/14580/smpc",
        sections: "4.1 适应症、4.4–4.8 风险与不良反应、5.1 药效学",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
  {
    id: "acei-vs-arb",
    title: "ACEI vs ARB：干咳从哪来",
    summary: "ACEI 减少 Ang II 生成并影响缓激肽降解；ARB 在 AT1 受体处阻断 Ang II 的作用。",
    drugIds: [
      "captopril",
      "losartan",
    ],
    rows: [
      {
        quizId: "target",
        quizExplanation: "减少配体生成与阻断受体是不同环节；不能把氯沙坦也写成 ACE 抑制剂。",
        label: "作用靶点",
        values: [
          "抑制血管紧张素转化酶 ACE",
          "阻断血管紧张素 II 的 AT1 受体",
        ],
      },
      {
        quizId: "angiotensin",
        quizExplanation: "ARB 并不以降低 Ang II 浓度为主要机制；受体阻断和循环浓度上升可以同时存在。",
        label: "血管紧张素 II 的相关变化",
        values: [
          "抑制 ACE 介导的生成",
          "因反馈解除，其循环水平可上升，受体效应仍受阻",
        ],
      },
      {
        quizId: "bradykinin",
        quizExplanation: "ACE 也参与缓激肽降解，卡托普利因此可增加相关信号；氯沙坦不直接阻断该酶。",
        label: "对缓激肽降解的直接影响",
        values: [
          "抑制 ACE 介导的缓激肽降解",
          "不直接抑制 ACE 介导的缓激肽降解",
        ],
      },
      {
        quizId: "cough",
        quizExplanation: "干咳确属不良反应，机制相关不等于必然发生；出现咳嗽还需鉴别其他原因，调整方案应由医生评估。",
        label: "干咳的相对特点",
        values: [
          "ACE 抑制相关干咳较典型，但不是人人发生",
          "较少出现 ACE 抑制相关干咳，并非绝无咳嗽",
        ],
      },
      {
        label: "共同重要风险",
        values: [
          "高钾、肾功能变化、低血压及胎儿毒性",
          "高钾、肾功能变化、低血压及胎儿毒性",
        ],
      },
      {
        label: "血管性水肿",
        values: [
          "可发生，严重时危及气道",
          "也有报道，风险较低但不能忽略",
        ],
      },
    ],
    takeaways: [
      "ARB 阻断 AT1，不代表 Ang II 浓度下降。",
      "ACEI 的干咳不是必然结果；不能凭缓激肽机制断言 ARB 的心血管保护较差。",
      "两类均需评估肾功能和血钾；妊娠期禁用。",
    ],
    sources: [
      {
        title: "卡托普利说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1395ba5b-2fc9-41ff-9c43-e0740d781dee",
        sections: "药理、适应症、警告与不良反应（剂型与适用范围见正文）",
      },
      {
        title: "氯沙坦说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a959c71b-d658-4871-b303-073234b9fa84",
        sections: "药理、适应症、警告与不良反应（剂型与适用范围见正文）",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
  {
    id: "antithrombotic",
    title: "抗凝 vs 抗血小板",
    summary: "华法林影响维生素 K 依赖因子的功能形成；氯吡格雷与阿司匹林分别抑制不同血小板通路。",
    drugIds: [
      "warfarin",
      "clopidogrel",
      "aspirin",
    ],
    rows: [
      {
        quizId: "target",
        quizExplanation: "华法林并非直接抑制已生成的全部凝血因子；它通过维生素 K 再循环影响功能性因子形成。",
        label: "关键分子作用对象",
        values: [
          "维生素 K 再循环相关 VKORC1",
          "血小板 P2Y12 受体（活性代谢物）",
          "血小板 COX-1（低剂量抗血小板用途）",
        ],
      },
      {
        quizId: "pathway",
        quizExplanation: "三者分别作用于凝血蛋白形成、ADP 信号及血栓素合成，抗凝和抗血小板不能互相替代。",
        label: "主要抗栓路径",
        values: [
          "减少功能性维生素 K 依赖凝血因子形成",
          "抑制 ADP 介导的血小板活化",
          "减少 TXA2 合成及其血小板效应",
        ],
      },
      {
        label: "起效与持续性",
        values: [
          "充分效应需等待已有因子清除",
          "起效受活化、负荷方案等影响，受影响血小板作用不可逆",
          "血小板 COX 抑制不可逆，时间与剂型等有关",
        ],
      },
      {
        label: "监测",
        values: [
          "需 INR 监测，并评估出血",
          "不以 INR 监测效力，但仍需评估出血和相互作用",
          "不以 INR 监测效力，但仍需评估出血和胃肠风险",
        ],
      },
      {
        label: "代表性用途",
        values: [
          "静脉血栓栓塞、特定房颤或机械瓣膜情境",
          "急性冠脉综合征、特定缺血性事件预防",
          "有指征的动脉粥样硬化事件二级预防",
        ],
      },
      {
        label: "围手术期边界",
        values: [
          "停药与桥接需个体评估，不能一律桥接",
          "停药需兼顾支架血栓风险，不自行套固定天数",
          "是否继续用药须结合手术与风险评估",
        ],
      },
    ],
    takeaways: [
      "血栓机制不能仅按动脉与静脉划界，房颤的动脉栓塞预防也常依赖抗凝。",
      "联合抗血小板方案需看病情与出血风险，不代表每位支架患者永远使用同一组合。",
      "CHEST 2022 指南对许多需要中断华法林的患者不建议桥接；具体方案仍需评估。",
    ],
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
      {
        title: "氯吡格雷说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ab32a331-2cea-453b-bba1-5451d38edd73",
        sections: "药理、适应症、警告与不良反应（剂型与适用范围见正文）",
      },
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
  },
  {
    id: "antithyroid",
    title: "丙硫氧嘧啶 vs 甲巯咪唑",
    summary: "两药都抑制新生甲状腺激素，外周转化、作用时程及肝脏和妊娠风险也有差异。",
    drugIds: [
      "propylthiouracil",
      "methimazole",
    ],
    rows: [
      {
        label: "共同合成靶点",
        values: [
          "TPO 相关碘有机化和偶联",
          "TPO 相关碘有机化和偶联",
        ],
      },
      {
        quizId: "peripheral-conversion",
        quizExplanation: "外周转化是明确区别之一，但不是两药唯一差异；抑制新合成同样会影响后续 T3 水平。",
        label: "外周 T4→T3 转化",
        values: [
          "还可抑制外周 T4→T3 转化",
          "无 PTU 那样的外周转化抑制作用",
        ],
      },
      {
        quizId: "dosing-frequency",
        quizExplanation: "血浆半衰期与甲状腺内效应时程不同，频次还随病情变化；本行不作为自行调药依据。",
        label: "常规用药时程特点",
        values: [
          "作用维持相对较短，通常需分次用药",
          "作用维持较长，部分方案可每日一次",
        ],
      },
      {
        quizId: "hepatotoxicity",
        quizExplanation: "两者均可损伤肝脏；典型模式不是绝对排他诊断，也不能认为甲巯咪唑没有严重肝毒性。",
        label: "肝脏风险的典型特点",
        values: [
          "更需警惕严重肝细胞损伤及肝衰竭",
          "典型报告较偏胆汁淤积性损伤，亦可能严重",
        ],
      },
      {
        label: "甲状腺危象",
        values: [
          "因外周转化作用常受到考虑，需联合综合治疗",
          "可用于危象的抗甲状腺方案，不能写成绝不适用",
        ],
      },
      {
        label: "粒细胞缺乏",
        values: [
          "发热、咽痛需及时就医检查",
          "发热、咽痛需及时就医检查",
        ],
      },
    ],
    takeaways: [
      "PTU 的外周作用不能推出甲巯咪唑在危象中无效。",
      "两药不直接清除已储存的激素，临床效果需要时间。",
      "肝损伤、粒细胞缺乏和妊娠风险需纳入选择；常规血象不能保证预警突发粒细胞缺乏。",
    ],
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
      {
        title: "甲巯咪唑说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=acae35a6-dea2-3fa9-e053-2a95a90a3a4d&type=display",
        sections: "临床药理、警告与实验室监测：不使既有激素失活、甲减、粒细胞缺乏及肝损伤。",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
  {
    id: "antifungal-class",
    title: "唑类 vs 多烯类抗真菌药",
    summary: "氟康唑影响膜甾醇合成，两性霉素 B 作用于膜甾醇；疗效和风险还取决于菌种、感染部位与制剂。",
    drugIds: [
      "fluconazole",
      "amphotericin-b",
    ],
    rows: [
      {
        quizId: "target",
        quizExplanation: "一个干预合成途径，另一个作用于已有膜甾醇，不能都概括为直接在膜上打孔。",
        label: "主要作用方式",
        values: [
          "抑制真菌 14α-去甲基化酶",
          "结合膜麦角固醇并改变通透性",
        ],
      },
      {
        quizId: "ergosterol",
        quizExplanation: "减少合成与结合已有成分不同，是这组对比的明确分子线索。",
        label: "与麦角固醇的关系",
        values: [
          "减少合成并改变甾醇组成",
          "与膜中麦角固醇结合",
        ],
      },
      {
        quizId: "fungicidal",
        quizExplanation: "这是概括性的药效特征，实际受菌种和暴露影响；不能据此断言免疫低下者必须选择后者。",
        label: "典型抗真菌效应",
        values: [
          "通常对敏感菌表现为抑菌",
          "通常对敏感菌表现为杀菌",
        ],
      },
      {
        quizId: "toxicity-mechanism",
        quizExplanation: "氟康唑也有严重风险，两性霉素 B 对甾醇的选择性并非完全；肾毒性不是每位患者必然发生。",
        label: "风险相关机制重点",
        values: [
          "肝脏风险、CYP 相互作用与 QT 风险需关注",
          "对宿主膜甾醇的影响等参与毒性，制剂改变暴露与风险",
        ],
      },
      {
        label: "隐球菌脑膜炎中的角色",
        values: [
          "按指南用于特定治疗阶段或联合方案",
          "静脉制剂可参与诱导方案；不能由脑脊液浓度低推导必须鞘内给药",
        ],
      },
      {
        label: "制剂与菌种边界",
        values: [
          "不能覆盖所有念珠菌，也不覆盖曲霉、毛霉目等",
          "脂质体与去氧胆酸盐制剂不能直接等剂量互换",
        ],
      },
    ],
    takeaways: [
      "靶点差异不能代替菌种和药敏判断。",
      "两性霉素 B 肾毒性风险重要，但不是不可避免；具体制剂影响风险。",
      "隐球菌脑膜炎等治疗需整体方案，不能按脑脊液浓度或抑菌/杀菌标签自行选药。",
    ],
    sources: [
      {
        title: "氟康唑说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=98ac5455-d26c-4780-a5a3-bf8d85917626",
        sections: "药理、适应症、警告与不良反应（剂型与适用范围见正文）",
      },
      {
        title: "两性霉素 B说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a96a734f-d1c4-4d42-93c2-7c336da7f7b9",
        sections: "药理、适应症、警告与不良反应（剂型与适用范围见正文）",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
  {
    id: "asthma-reliever-controller",
    title: "哮喘缓解药 vs 控制药",
    summary: "沙丁胺醇快速舒张气道，吸入布地奈德主要抗炎；哮喘方案应包含吸入激素相关治疗。",
    drugIds: [
      "salbutamol",
      "budesonide",
    ],
    rows: [
      {
        quizId: "role",
        quizExplanation: "本组比较单方制剂，不涵盖所有缓解药策略；含福莫特罗的特定 ICS/LABA 复方可在相应方案中作缓解药。",
        label: "本组单方制剂的角色",
        values: [
          "短效 β2 激动药，缓解支气管痉挛",
          "吸入糖皮质激素，维持抗炎控制",
        ],
      },
      {
        quizId: "target",
        quizExplanation: "β2 激动偏向快速平滑肌舒张，糖皮质激素受体调节炎症相关转录。",
        label: "主要靶点",
        values: [
          "气道平滑肌 β2 肾上腺素受体",
          "细胞内糖皮质激素受体",
        ],
      },
      {
        quizId: "inflammation",
        quizExplanation: "缓解喘息不等于控制病理炎症，不能因 SABA 有即时感觉就省略含 ICS 治疗。",
        label: "抗炎治疗角色",
        values: [
          "不能替代 ICS 控制基础气道炎症",
          "通过多种炎症细胞和介质相关作用控制炎症",
        ],
      },
      {
        quizId: "hyperresponsiveness",
        quizExplanation: "本行区分治疗角色，不把短期支气管保护与长期抗炎控制混为一谈，也不宣称单药改变全部疾病自然史。",
        label: "对长期气道控制的意义",
        values: [
          "短暂缓解收缩，不能作为改善基础炎症的控制药",
          "规律治疗可降低炎症相关气道高反应性",
        ],
      },
      {
        quizId: "adverse-reactions",
        quizExplanation: "这些是各自典型风险组合，并非完整清单；两药都可发生其他反应，严重症状需评估。",
        label: "与主要药理相关的典型风险",
        values: [
          "震颤、心悸及低钾",
          "口咽念珠菌感染、声音嘶哑及高暴露时全身激素效应",
        ],
      },
      {
        label: "重要使用边界",
        values: [
          "不推荐哮喘仅依赖 SABA",
          "单方不直接快速解除支气管痉挛",
        ],
      },
    ],
    takeaways: [
      "沙丁胺醇是 SABA；不能把沙丁胺醇加布地奈德写成 ICS/LABA。",
      "布地奈德单方和布地奈德/福莫特罗复方的角色不同。",
      "含 ICS 的具体方案需按年龄、制剂和 GINA 治疗策略评估。",
    ],
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
      {
        title: "布地奈德 PULMICORT FLEXHALER 吸入粉雾剂说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ae1105cd-69fc-4c15-937f-c535304341c2",
        sections: "药理、适应症、警告与不良反应；不外推到其他剂型",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
  {
    id: "antiviral-target",
    title: "抗病毒药的两条靶点思路",
    summary: "阿昔洛韦活化后影响疱疹病毒 DNA 合成，奥司他韦活化后限制流感病毒释放。",
    drugIds: [
      "aciclovir",
      "oseltamivir",
    ],
    rows: [
      {
        quizId: "virus",
        quizExplanation: "这两类药的病毒谱不同，不能按发热或病毒感染这个共同描述互换。",
        label: "主要目标病毒",
        values: [
          "单纯疱疹病毒及水痘-带状疱疹病毒等",
          "甲型及乙型流感病毒",
        ],
      },
      {
        quizId: "target",
        quizExplanation: "DNA 合成属于复制环节；神经氨酸酶参与新生流感病毒释放与传播。",
        label: "活性物主要作用靶点",
        values: [
          "疱疹病毒 DNA 聚合酶及 DNA 链延伸",
          "流感病毒神经氨酸酶",
        ],
      },
      {
        quizId: "selectivity",
        quizExplanation: "选择性是相对概念；不能写成正常细胞完全不活化阿昔洛韦，或人类完全没有神经氨酸酶。",
        label: "选择性的重要来源",
        values: [
          "感染细胞中病毒酶优先启动活化等",
          "活性羧酸物对流感病毒神经氨酸酶的抑制",
        ],
      },
      {
        quizId: "pathway",
        quizExplanation: "机制环节帮助记忆病毒谱，不直接决定所有感染的统一疗程。",
        label: "主要干预环节",
        values: [
          "病毒 DNA 合成与延伸",
          "新生流感病毒释放和后续传播",
        ],
      },
      {
        label: "治疗时间边界",
        values: [
          "按病毒、感染部位、严重程度及制剂确定",
          "通常越早越好；重症或住院者超过 48 小时仍可能获益",
        ],
      },
    ],
    takeaways: [
      "两药均需活化，但活化途径与最终靶点不同。",
      "奥司他韦的 48 小时窗口不能作为重症患者的绝对排除条件。",
      "阿昔洛韦不清除潜伏病毒；两药都不能泛化成所有病毒感染通用。",
    ],
    sources: [
      {
        title: "阿昔洛韦说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=8d4c9317-7475-42ec-a0b0-d43929114369",
        sections: "药理、适应症、警告与不良反应（剂型与适用范围见正文）",
      },
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
  },
  {
    id: "antifolate-vs-alkylator",
    title: "烷化剂 vs 抗代谢药",
    summary: "甲氨蝶呤干预叶酸相关代谢，环磷酰胺的活性物损伤 DNA；解救与尿路保护的目的不同。",
    drugIds: [
      "cyclophosphamide",
      "methotrexate",
    ],
    rows: [
      {
        quizId: "target",
        quizExplanation: "抗代谢与烷化是不同路径；低剂量甲氨蝶呤抗炎不能完全照搬抗肿瘤机制。",
        label: "主要作用方式",
        values: [
          "抑制 DHFR 等叶酸相关过程",
          "活性烷化物导致 DNA 损伤，包括交联",
        ],
      },
      {
        quizId: "dna-damage",
        quizExplanation: "影响原料供应与直接化学损伤不同，不能都记成 DNA 交联药。",
        label: "与 DNA 的主要联系",
        values: [
          "通过影响核苷酸供应等干扰 DNA 合成",
          "活性代谢物与 DNA 反应形成损伤",
        ],
      },
      {
        quizId: "cell-cycle",
        quizExplanation: "这些是药理概括，并非所有细胞和剂量下的绝对规律；不能据此推导静止细胞肿瘤或某一癌种的选药。",
        label: "传统细胞周期分类",
        values: [
          "对增殖期尤其 DNA 合成相关过程影响突出，传统归为周期特异性",
          "传统归为周期非特异性烷化药",
        ],
      },
      {
        quizId: "activation",
        quizExplanation: "甲氨蝶呤不是靠肝活化才生效的前药，但也不是完全没有活性代谢过程。",
        label: "原药与代谢活性",
        values: [
          "原药具有 DHFR 抑制活性，细胞内多聚谷氨酸化也影响作用",
          "需经肝代谢形成烷化活性物",
        ],
      },
      {
        quizId: "rescue",
        quizExplanation: "亚叶酸是 5-甲酰四氢叶酸；美司钠不是全面逆转骨髓或其他器官毒性的通用解毒药。",
        label: "代表性保护或解救环节",
        values: [
          "亚叶酸按方案绕过 DHFR 阻断，用于特定解救",
          "美司钠在特定方案中降低尿路毒性",
        ],
      },
      {
        label: "共同重要风险",
        values: [
          "骨髓抑制、感染与生殖风险",
          "骨髓抑制、感染与生殖风险",
        ],
      },
    ],
    takeaways: [
      "亚叶酸不能写成普通四氢叶酸钙；解救时间和方案需要专科控制。",
      "环磷酰胺生成的磷酰胺氮芥与丙烯醛属于分支产物。",
      "细胞周期分类不能单独用来选择化疗药物或方案。",
    ],
    sources: [
      {
        title: "环磷酰胺说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=5bad5bfc-12c0-46a2-8355-1028f108ecbf",
        sections: "药理、适应症、警告与不良反应（剂型与适用范围见正文）",
      },
      {
        title: "甲氨蝶呤说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=aafd97c1-3a0a-42b2-845a-a9db9bb7d876",
        sections: "药理、适应症、警告与不良反应（剂型与适用范围见正文）",
      },
      {
        title: "亚叶酸钙注射剂说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=79d023ab-7d77-48c1-8f47-ea322fd58c2b",
        sections: "叶酸拮抗药解救与氟尿嘧啶联用用途的区分",
      },
    ],
    sourcesCheckedOn: "2026-10-21",
  },
  {
    id: "loop-vs-thiazide",
    title: "袢利尿药 vs 噻嗪类：排钙方向不同",
    summary: "都能排钠利尿，但作用的肾单位部位、转运体和尿钙变化不同。",
    drugIds: ["furosemide", "hydrochlorothiazide"],
    rows: [
      {
        label: "药物类别",
        quizId: "class",
        values: ["袢利尿药", "噻嗪类利尿药"],
        quizExplanation: "先把药物类别与肾单位部位连起来：袢利尿药的主要作用位置在髓袢，噻嗪类主要作用于远曲小管。两类都排钠，但阻断的转运环节不同。",
      },
      {
        label: "主要作用部位",
        quizId: "site",
        values: ["髓袢升支粗段", "远曲小管早段"],
        quizExplanation: "这里比较的是主要作用部位。呋塞米阻断髓袢升支粗段的盐重吸收，氢氯噻嗪则在更靠后的远曲小管发挥主要作用。",
      },
      {
        label: "直接抑制的转运体",
        quizId: "transporter",
        values: ["Na⁺-K⁺-2Cl⁻ 同向转运体（NKCC2）", "Na⁺-Cl⁻ 同向转运体（NCC）"],
        quizExplanation: "看转运组合就能区分：NKCC2 同时转运钠、钾和氯，NCC 转运钠和氯。不要把转运体名称中的钾与最终血钾变化混为一谈；两类药都可能造成低钾血症。",
      },
      {
        label: "尿钙排泄方向",
        quizId: "urinary-calcium",
        values: ["增加尿钙排泄", "减少尿钙排泄"],
        quizExplanation: "这是两类药容易记反的差异：呋塞米促进钙随尿排出，噻嗪类减少尿钙排泄。排钠方向相同，不代表对所有电解质的影响都相同。",
      },
      {
        label: "共同的电解质风险",
        values: ["可出现低钾、低钠和容量不足", "可出现低钾、低钠和容量不足"],
      },
      {
        label: "监测重点",
        values: ["关注容量状态、肾功能及钠钾；也需留意钙镁丢失", "关注容量状态、肾功能及钠钾；也需留意血钙升高"],
      },
    ],
    takeaways: [
      "把“髓袢—NKCC2”和“远曲小管—NCC”成对记忆，比只记药名更容易迁移到同类药。",
      "尿钙是方向相反的差异：袢利尿药增加，噻嗪类减少。",
      "低钾属于两者的共同风险，不能据此单独判断是哪一种药。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "呋塞米说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/12129/smpc",
        sections: "4.4、4.8、5.1 节：电解质风险、作用部位、NKCC2 与钙镁排泄。",
      },
      {
        title: "氢氯噻嗪成分说明 · emc",
        url: "https://www.medicines.org.uk/emc/product/100496/smpc",
        sections: "缬沙坦/氢氯噻嗪复方的 4.4、5.1 节：仅引用氢氯噻嗪的远曲小管、NCC 及尿钙作用。",
      },
    ],
  },
  {
    id: "glucose-lowering-strategies",
    title: "降糖药：改善代谢、促分泌与外源补充",
    summary: "同样降低血糖，二甲双胍、格列本脲和胰岛素与胰岛 β 细胞的关系并不相同。",
    drugIds: ["metformin", "glibenclamide", "insulin"],
    rows: [
      {
        label: "药物类别",
        quizId: "class",
        values: ["双胍类降糖药", "磺脲类促胰岛素分泌药", "外源性胰岛素制剂"],
        quizExplanation: "双胍类侧重改善葡萄糖代谢，磺脲类促使胰岛释放胰岛素，胰岛素制剂直接补充激素。分类对应三种不同的降糖路径。",
      },
      {
        label: "核心降糖路径",
        quizId: "strategy",
        values: [
          "通过双胍类药理作用减少肝糖生成、改善胰岛素敏感性",
          "关闭 β 细胞 ATP 敏感性钾通道，促进内源胰岛素释放",
          "给予外源胰岛素，促进组织摄取葡萄糖并抑制肝糖输出",
        ],
        quizExplanation: "格列本脲先作用于 β 细胞，再通过释放的胰岛素降糖；外源胰岛素绕过促分泌这一步。二甲双胍与胰岛素都可减少肝糖输出，因此不能只凭这一个共同结果区分，需看完整作用路径。",
      },
      {
        label: "与胰岛素分泌的关系",
        quizId: "insulin-relationship",
        values: [
          "不直接刺激胰岛素分泌，也不补充胰岛素",
          "促分泌作用依赖仍有功能的胰岛 β 细胞",
          "直接提供外源激素，可补充内源胰岛素不足",
        ],
        quizExplanation: "促分泌需要 β 细胞还有分泌能力；外源补充不需要先让 β 细胞释放胰岛素。二甲双胍不直接促分泌，不意味着它能在内源胰岛素严重不足时替代胰岛素。",
      },
      {
        label: "低血糖风险",
        values: ["单独使用时通常较低，合用促分泌药或胰岛素时需警惕", "可引起低血糖", "可引起低血糖"],
      },
      {
        label: "需要额外留意的风险",
        values: [
          "肾功能下降等情况下乳酸性酸中毒风险增加",
          "进食不足、肝肾功能异常等可增加低血糖风险",
          "除低血糖外，促钾进入细胞可导致低钾血症",
        ],
      },
    ],
    takeaways: [
      "用“改善代谢—促内源分泌—外源补充”串起三种机制。",
      "格列本脲和胰岛素都可能造成低血糖，这一共同点不能单独用于三选一。",
      "胰岛素制剂有不同作用时程；本组只比较共同机制，不把某一种制剂的起效时间套用到全部胰岛素。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "格列本脲与二甲双胍成分说明 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=e5ef9ba4-1d9f-4a97-a3a9-633b894bd062",
        sections: "复方说明书 5、12.1 节：分别引用两种成分的作用与风险；Glyburide 即格列本脲。",
      },
      {
        title: "人胰岛素说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=b519bd83-038c-4ec5-a231-a51ec5cc291f",
        sections: "HUMULIN R 的 5.3、5.6、12.1 节：引用胰岛素共同机制及低血糖、低钾风险，不泛化制剂时程。",
      },
    ],
  },
  {
    id: "analgesic-cox-selectivity",
    title: "解热镇痛药：COX 选择性与抗炎作用",
    summary: "布洛芬、对乙酰氨基酚和塞来昔布都能镇痛，但抗炎与血小板作用不能一概而论。",
    drugIds: ["ibuprofen", "paracetamol", "celecoxib"],
    rows: [
      {
        label: "药理类型",
        quizId: "class",
        values: ["非选择性 NSAID（非甾体抗炎药）", "以解热镇痛为主的非 NSAID 药物", "选择性 COX-2 抑制剂，属于 NSAID"],
        quizExplanation: "NSAID 不等于所有止痛药：布洛芬与塞来昔布属于这一类，对乙酰氨基酚虽能解热镇痛，却没有临床上显著的外周抗炎作用。",
      },
      {
        label: "机制侧重点",
        quizId: "mechanism",
        values: ["抑制 COX-1 和 COX-2，减少前列腺素生成", "以中枢作用为主，精确镇痛机制尚未完全阐明", "主要通过抑制 COX-2，减少前列腺素生成"],
        quizExplanation: "布洛芬与塞来昔布的区别在于 COX 选择性。对乙酰氨基酚的机制仍有未明之处，不能把它简单等同于选择性 COX-2 抑制剂。",
      },
      {
        label: "抗炎与血小板作用组合",
        quizId: "inflammation-platelets",
        values: [
          "有抗炎作用，可抑制血小板聚集",
          "无临床上显著的外周抗炎作用，常规剂量不抑制血小板聚集",
          "有抗炎作用，治疗剂量通常不抑制血小板聚集",
        ],
        quizExplanation: "要同时看两个条件：有抗炎作用的是布洛芬与塞来昔布，而后者通常不抑制血小板聚集。对乙酰氨基酚也不抑制血小板聚集，但缺少显著外周抗炎作用。",
      },
      {
        label: "重要风险",
        values: [
          "胃肠道出血、肾损害及心血管事件风险",
          "过量或重复摄入含同一成分的药物可导致严重肝损伤",
          "仍有胃肠道出血、肾损害及心血管事件风险",
        ],
      },
      {
        label: "容易误解的地方",
        values: [
          "能影响血小板，不等于可替代阿司匹林的抗血小板治疗",
          "能镇痛，不等于能控制外周炎症",
          "选择性 COX-2 抑制，不等于没有胃肠道或心血管风险",
        ],
      },
    ],
    takeaways: [
      "先分清“非选择性 NSAID—解热镇痛药—选择性 COX-2 抑制剂”，再看作用差异。",
      "“有抗炎作用”或“不抑制血小板”单独一条都不足以区分三种药，需结合判断。",
      "对乙酰氨基酚要留意重复成分与肝毒性；两种 NSAID 都仍需评估胃肠道、肾脏与心血管风险。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "布洛芬与对乙酰氨基酚机制说明 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b32651c4-7fa0-415b-91eb-854aa1c28f2a",
        sections: "COMBOGESIC 复方说明书 12.1 节：分别引用两种成分的机制。",
      },
      {
        title: "布洛芬说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/6713/smpc",
        sections: "4.4、4.5、5.1 节：抗炎、血小板影响及胃肠道、肾脏和心血管风险。",
      },
      {
        title: "对乙酰氨基酚说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/3233/smpc",
        sections: "4.4、4.9、5.1、5.2 节：抗炎与血小板作用、机制不确定性及肝毒性。",
      },
      {
        title: "塞来昔布说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2d6675e4-5859-4be2-8037-a20ce9f707aa",
        sections: "CELEBREX 的警示、5、12.1、12.2 节：COX-2 选择性、血小板作用与风险。",
      },
    ],
  },
  {
    id: "phenytoin-vs-valproate",
    title: "抗癫痫药：苯妥英钠 vs 丙戊酸钠",
    summary: "比较机制侧重点、失神发作适用性、代谢相互作用与血药浓度的解读。",
    drugIds: ["phenytoin", "valproate"],
    rows: [
      {
        label: "机制侧重点",
        quizId: "mechanism",
        values: [
          "主要与电压依赖性钠通道阻断、抑制持续高频放电有关",
          "作用与增强 GABA 抑制性传递等有关，完整机制尚未完全阐明",
        ],
        quizExplanation: "抓住苯妥英的钠通道作用与丙戊酸的 GABA 相关作用，便于建立机制框架；这是侧重点比较，不表示丙戊酸只作用于 GABA，也不表示两药的全部机制都已明确。",
      },
      {
        label: "对失神发作的适用性",
        quizId: "absence-seizures",
        values: ["不适用于失神发作，并可能使其加重", "可用于失神发作，选择时需结合严格的安全性限制"],
        quizExplanation: "“抗癫痫”不代表能覆盖所有发作类型。苯妥英可能加重失神发作；丙戊酸可用于这一发作类型，但适用性不等于人人首选，还要评估妊娠相关风险等限制。",
      },
      {
        label: "对药物代谢的影响",
        quizId: "enzyme-interactions",
        values: ["肝药酶诱导剂，可加快某些合用药的代谢", "无肝药酶诱导作用，可抑制某些药物的代谢"],
        quizExplanation: "相互作用的方向常不同：苯妥英可诱导代谢，丙戊酸可抑制部分代谢途径。两者合用还涉及蛋白结合置换，不能仅凭总血药浓度下降就判断作用减弱。",
      },
      {
        label: "血药浓度解读的典型难点",
        quizId: "concentration-pitfall",
        values: [
          "代谢可饱和，小幅加量也可能使血药浓度明显上升",
          "蛋白结合可饱和，总浓度呈非线性，而游离药动力学基本线性",
        ],
        quizExplanation: "苯妥英的典型难点是代谢饱和后，剂量与浓度不成比例；丙戊酸的典型难点是蛋白结合非线性，总浓度不一定反映活性游离部分。苯妥英也存在蛋白结合变化，不能把这些特点当作绝对排他的全部药代特征。",
      },
      {
        label: "重要安全性关注",
        values: [
          "可有严重皮肤反应、神经毒性及妊娠相关风险",
          "重点关注肝毒性、胰腺炎及显著的胎儿和神经发育风险",
        ],
      },
      {
        label: "共同的学习提醒",
        values: ["需结合发作类型、合用药及临床表现解读浓度", "需结合发作类型、合用药及临床表现解读浓度"],
      },
    ],
    takeaways: [
      "先看发作类型，再看药物名称；苯妥英不能因为能抑制放电就被用于所有癫痫发作。",
      "记住“苯妥英诱导、丙戊酸可抑制”，但具体相互作用仍需逐项核对。",
      "血药总浓度不是全部答案：代谢饱和与蛋白结合变化，都会影响对疗效和毒性的判断。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "苯妥英钠说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=86dd27d1-9cee-48ae-b55d-e2d2f7dbc593&type=display",
        sections: "DILANTIN 的 5、7、12.1、12.3 节：机制、酶诱导、饱和代谢及风险。",
      },
      {
        title: "丙戊酸钠说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/519/smpc",
        sections: "Epilim 的 4.4、4.5、5.1 节：安全性、代谢相互作用与 GABA 相关机制。",
      },
      {
        title: "丙戊酸活性成分的药理说明 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=ec41025a-ed7d-48c8-9005-08e3a9417f30",
        sections: "7.2、12.1～12.3 节：丙戊酸根的代谢抑制与浓度相关蛋白结合；不外推不同制剂的吸收时程。",
      },
      {
        title: "失神发作的药物治疗 · NICE NG217",
        url: "https://www.nice.org.uk/guidance/ng217/chapter/treating-epileptic-seizures-in-children-young-people-and-adults",
        sections: "5.3 节：丙戊酸的适用性与安全限制，以及苯妥英可能加重失神发作的提醒。",
      },
    ],
  },
  {
    id: "metoprolol-vs-amlodipine",
    title: "常用降压药：美托洛尔 vs 氨氯地平",
    summary: "一个阻断交感神经的 β 受体作用，一个减少血管平滑肌钙内流；降压并不都靠减慢心率。",
    drugIds: ["metoprolol", "amlodipine"],
    rows: [
      {
        label: "药物类别",
        quizId: "class",
        values: ["选择性 β1 受体阻断药", "二氢吡啶类钙通道阻滞药"],
        quizExplanation: "两者都可降压，但所属类别不同。美托洛尔的 β1 选择性并非绝对，血药浓度较高时对 β2 受体的阻断也会增加。",
      },
      {
        label: "直接作用靶点",
        quizId: "target",
        values: ["以心脏 β1 肾上腺素受体为主要靶点", "阻滞钙通道，作用以血管平滑肌为主"],
        quizExplanation: "区分受体和离子通道：美托洛尔减弱儿茶酚胺对 β1 受体的作用；氨氯地平直接减少钙内流，以舒张动脉平滑肌为主要效应。",
      },
      {
        label: "心率与房室结传导",
        quizId: "heart-rate-conduction",
        values: ["可减慢窦性心率，并减慢房室结传导", "常规口服治疗时通常不明显抑制窦房结功能或房室传导"],
        quizExplanation: "降压不一定同时减慢心率。氨氯地平主要作用于血管，不能把维拉帕米等其他钙通道阻滞药的明显心脏传导抑制作用套用到它身上。",
      },
      {
        label: "降压的作用侧重",
        quizId: "hemodynamic-focus",
        values: ["减弱心脏交感效应、降低心排出量，并可抑制肾素活性", "直接舒张外周动脉、降低外周血管阻力"],
        quizExplanation: "记忆时把美托洛尔与心率、心排出量和肾素联系起来，把氨氯地平与外周动脉阻力联系起来。这里描述主要环节，不表示降压机制只有单一路径。",
      },
      {
        label: "重点留意的风险",
        values: ["心动过缓、传导阻滞；长期使用后突然停药可加重心绞痛", "外周水肿、潮红、头痛及低血压"],
      },
      {
        label: "共同的观察指标",
        values: ["血压、症状及合用药情况", "血压、症状及合用药情况"],
      },
    ],
    takeaways: [
      "先区分 β 受体阻断与钙通道阻滞，再把药效连到心脏或血管。",
      "美托洛尔可减慢心率；氨氯地平的降压作用通常不依赖明显抑制心脏传导。",
      "同属降压药不代表可以直接互换；本组比较机制，不按单个症状给出换药方案。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "美托洛尔说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c0e147a8-36a6-1e61-e053-2a95a90afd62",
        sections: "4、5.1、6.1、12.1、12.2 节：β1 选择性、心率与传导、降压机制及停药风险。",
      },
      {
        title: "氨氯地平说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=6e9a6c82-9f25-4c71-b09a-929bd5d7b1cf",
        sections: "临床药理与不良反应章节：钙通道、血管舒张、心脏电生理及水肿等风险。",
      },
    ],
  },
  {
    id: "common-antibiotic-targets",
    title: "常用抗菌药：细胞壁、核糖体与 DNA",
    summary: "阿莫西林、阿奇霉素和左氧氟沙星分别干扰细菌的不同环节，不能只按“消炎药”记忆。",
    drugIds: ["amoxicillin", "azithromycin", "levofloxacin"],
    rows: [
      {
        label: "药物类别",
        quizId: "class",
        values: ["青霉素类，属于 β-内酰胺类", "大环内酯类", "氟喹诺酮类"],
        quizExplanation: "先建立类别与靶点的对应：青霉素类对应细胞壁合成，大环内酯类对应核糖体，氟喹诺酮类对应细菌 DNA 拓扑异构酶。",
      },
      {
        label: "直接作用靶点",
        quizId: "target",
        values: ["青霉素结合蛋白（PBPs）", "50S 核糖体亚基的 23S rRNA", "DNA 回旋酶与拓扑异构酶 IV"],
        quizExplanation: "PBPs 参与肽聚糖合成；23S rRNA 属于核糖体结构；DNA 回旋酶和拓扑异构酶 IV 参与 DNA 的复制等过程。不要把核糖体与核酸处理酶混为一类。",
      },
      {
        label: "直接受干扰的细菌过程",
        quizId: "bacterial-process",
        values: ["细胞壁肽聚糖的合成", "核糖体介导的蛋白质合成", "拓扑异构酶参与的 DNA 复制、转录与修复"],
        quizExplanation: "这道题考直接受影响的过程。三类药最终都能影响细菌生存，但不能用这种共同结果代替对具体作用环节的判断。",
      },
      {
        label: "典型耐药途径",
        quizId: "resistance-pathway",
        values: [
          "β-内酰胺酶使药物失活，或 PBPs 改变导致亲和力下降",
          "23S rRNA 靶位修饰，例如甲基化",
          "DNA 回旋酶或拓扑异构酶 IV 的耐药决定区突变",
        ],
        quizExplanation: "耐药可以来自药物被破坏，也可以来自靶点改变。这里列出各类的典型途径；外排等机制也可能参与，不能把每种药的耐药归结为唯一原因。",
      },
      {
        label: "重要风险举例",
        values: [
          "过敏反应，包括严重过敏；也可有抗菌药相关腹泻",
          "QT 间期延长、肝损伤及胃肠道反应",
          "肌腱损伤、周围神经病变及 QT 间期延长等",
        ],
      },
      {
        label: "选药仍需考虑",
        values: ["感染部位、病原体、药敏及个体风险", "感染部位、病原体、药敏及个体风险", "感染部位、病原体、药敏及个体风险"],
      },
    ],
    takeaways: [
      "把“阿莫西林—细胞壁、阿奇霉素—核糖体、左氧氟沙星—DNA 拓扑异构酶”连起来记。",
      "阿奇霉素与左氧氟沙星都可能延长 QT 间期，不能仅凭这一风险区分。",
      "靶点不同不代表某一种普遍更强，也不代表可凭症状自行替换；抗菌药的适用性还取决于病原体和药敏。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "阿莫西林说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/10638/smpc",
        sections: "4.4、5.1 节：过敏与腹泻风险、PBPs、肽聚糖合成及耐药机制。",
      },
      {
        title: "阿奇霉素说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=cd01f37d-4392-4d2b-e053-2995a90a721f",
        sections: "5、12.1、12.4 节：心律与肝脏风险、50S / 23S rRNA 靶点及耐药。",
      },
      {
        title: "左氧氟沙星说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=067e260c-dc47-4957-a9ff-5a79f17b4ca0",
        sections: "警示、5、12.4 节：肌腱与神经风险、QT 间期、拓扑异构酶靶点及耐药。",
      },
    ],
  },
  {
    id: "omeprazole-vs-sucralfate",
    title: "胃病用药：抑酸 vs 黏膜保护",
    summary: "奥美拉唑减少胃酸分泌，硫糖铝在溃疡表面形成屏障；保护黏膜有不同路径。",
    drugIds: ["omeprazole", "sucralfate"],
    rows: [
      {
        label: "核心作用方式",
        quizId: "mechanism",
        values: ["抑制胃壁细胞 H⁺/K⁺-ATP 酶（质子泵）", "与溃疡处蛋白性渗出物结合，形成黏附性保护层"],
        quizExplanation: "奥美拉唑阻断胃酸分泌的末端环节；硫糖铝主要通过局部屏障减少酸、胃蛋白酶和胆盐对溃疡面的攻击。两者作用于不同环节。",
      },
      {
        label: "对胃酸分泌的作用",
        quizId: "acid-secretion",
        values: ["抑制基础及受刺激后的胃酸分泌", "以局部保护为主，不以抑制胃壁细胞泌酸为主要机制"],
        quizExplanation: "硫糖铝有一定酸中和能力，但不等同于质子泵抑制剂。判断时要区分“减少酸分泌”和“减少酸对黏膜的接触与损伤”。",
      },
      {
        label: "发挥主要作用的位置",
        quizId: "site",
        values: ["胃壁细胞的泌酸表面", "胃肠腔内的溃疡表面，主要局部起效且吸收很少"],
        quizExplanation: "口服并不代表都只在胃肠腔内起效。奥美拉唑经吸收后到达壁细胞作用部位；硫糖铝的抗溃疡作用主要来自腔内局部保护。",
      },
      {
        label: "典型相互作用机制",
        quizId: "interaction",
        values: [
          "抑制 CYP2C19，可影响氯吡格雷生成活性代谢物",
          "在胃肠道结合某些同服药物，可减少其吸收",
        ],
        quizExplanation: "一个典型问题发生在代谢活化环节，另一个发生在胃肠吸收环节。两种相互作用不能套用同一种处理思路，尤其不能认为错开服药时间就能消除所有相互作用。",
      },
      {
        label: "风险与监测提示",
        values: ["长期使用需注意低镁等风险，并核对合用药", "可致便秘；肾功能不全时需警惕铝蓄积"],
      },
      {
        label: "共同的治疗边界",
        values: ["改善酸相关损伤，不等于已经处理所有溃疡病因", "改善局部损伤，不等于已经处理所有溃疡病因"],
      },
    ],
    takeaways: [
      "奥美拉唑偏向减少酸的分泌，硫糖铝偏向保护受损表面。",
      "“吸收很少”不等于没有相互作用，也不等于肾功能不全时完全没有风险。",
      "比较作用机制有助于理解药物角色，但不能据此把两种药当成同一种药替换。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "奥美拉唑说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=859de60d-dc1a-41d6-9aac-44dff3be3d31",
        sections: "5.7、5.9、12.1～12.3 节：质子泵与泌酸、吸收、氯吡格雷相互作用及低镁风险。",
      },
      {
        title: "硫糖铝说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a4f722e7-2885-4f27-8358-9c662439600a",
        sections: "临床药理、注意事项与不良反应：局部保护、少量吸收、结合相互作用、肾功能与铝蓄积。",
      },
    ],
  },
  {
    id: "domperidone-vs-ondansetron",
    title: "止吐药：多潘立酮 vs 昂丹司琼",
    summary: "都能止吐，但受体靶点、对胃肠动力和催乳素的影响不同。",
    drugIds: ["domperidone", "ondansetron"],
    rows: [
      {
        label: "主要受体靶点",
        quizId: "target",
        values: ["多巴胺 D2 受体拮抗", "5-HT3 受体选择性拮抗"],
        quizExplanation: "多潘立酮针对多巴胺通路；昂丹司琼针对 5-HT3 通路，并不是多巴胺受体拮抗药。同样止吐，不代表阻断同一种信号。",
      },
      {
        label: "对胃肠动力的影响",
        quizId: "motility",
        values: ["可增强胃窦与十二指肠运动、促进胃排空", "不是促胃肠蠕动药，多日给药可减慢结肠转运"],
        quizExplanation: "多潘立酮兼有促胃动力作用，昂丹司琼的止吐作用不能被理解为促进胃排空。症状缓解也不代表胃肠运动障碍已解除。",
      },
      {
        label: "对催乳素的影响",
        quizId: "prolactin",
        values: ["可促进垂体释放催乳素，使血中催乳素升高", "通常不改变血中催乳素水平"],
        quizExplanation: "多潘立酮不易通过血脑屏障，但仍可促进垂体催乳素释放。因此“不易入脑”不能被推断为“没有内分泌效应”；昂丹司琼作用于不同受体。",
      },
      {
        label: "共同的心律风险",
        values: ["可延长 QT 间期，需考虑心脏病、电解质及合用药", "可延长 QT 间期，需考虑心脏病、电解质及合用药"],
      },
      {
        label: "胃肠症状的观察边界",
        values: ["机械性梗阻、穿孔或消化道出血时，促进胃肠运动可能有害", "止吐可能掩盖进行性肠梗阻或胃扩张，仍需观察胃肠功能"],
      },
    ],
    takeaways: [
      "把“D2—促胃动力—催乳素升高”与“5-HT3—止吐但不促胃动力”区分开。",
      "不易通过血脑屏障不能排除催乳素变化；受体位置和药理效应也要一起看。",
      "两者都可能影响 QT 间期，不能把心律风险作为本组的单选识药依据。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "多潘立酮说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/3188/smpc",
        sections: "4.3、4.4、5.1 节：胃肠动力、血脑屏障、催乳素及 QT 间期风险。",
      },
      {
        title: "多潘立酮靶点说明 · 美国国家癌症研究所",
        url: "https://www.cancer.gov/publications/dictionaries/cancer-drug/def/domperidone",
        sections: "药物词典：D2 受体拮抗与胃肠道作用。",
      },
      {
        title: "昂丹司琼说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=f08f56de-8678-4da9-8cae-013a5c393453",
        sections: "5.2、5.4、12.1、12.2 节：5-HT3、非促胃肠动力作用、催乳素与心律风险。",
      },
    ],
  },
  {
    id: "penicillin-g-vs-vancomycin",
    title: "细胞壁抗菌药：青霉素 G vs 万古霉素",
    summary: "都干扰细胞壁合成，但一个结合合成酶，一个结合前体末端；耐药也可能发生在不同环节。",
    drugIds: ["penicillin-g", "vancomycin"],
    rows: [
      {
        label: "药物类别",
        quizId: "class",
        values: ["青霉素类，属于 β-内酰胺类", "糖肽类抗菌药"],
        quizExplanation: "作用于细胞壁的药物不只有 β-内酰胺类。万古霉素属于糖肽类，不能因为最终作用相近就归入青霉素类。",
      },
      {
        label: "直接结合的对象",
        quizId: "binding-target",
        values: ["青霉素结合蛋白（PBPs），包括转肽酶", "细胞壁前体的 D-Ala-D-Ala 末端"],
        quizExplanation: "青霉素 G 作用于参与细胞壁合成的酶；万古霉素结合前体的特定末端。前者是“结合酶”，后者是“结合底物结构”，不能把 D-Ala-D-Ala 当成一种 PBP。",
      },
      {
        label: "典型耐药途径",
        quizId: "resistance",
        values: [
          "β-内酰胺酶破坏药物，或 PBPs 改变使结合减弱",
          "某些肠球菌通过 van 基因相关改变，将前体末端改为 D-Ala-D-Lac 或 D-Ala-D-Ser",
        ],
        quizExplanation: "一个典型途径是破坏药物或改变合成酶，另一个是改变药物识别的前体末端。这只是代表性机制，不能概括所有细菌的耐药，也不能据此推断万古霉素始终有效。",
      },
      {
        label: "共同的作用结果",
        values: ["抑制敏感细菌的细胞壁合成", "抑制敏感细菌的细胞壁合成"],
      },
      {
        label: "风险与选药边界",
        values: [
          "可有严重过敏反应；是否适用需结合病原体与药敏",
          "需注意肾毒性、输注反应等；是否适用需结合病原体与药敏",
        ],
      },
    ],
    takeaways: [
      "记住“青霉素 G—PBPs”和“万古霉素—D-Ala-D-Ala”，共同终点不等于共同靶点。",
      "β-内酰胺类耐药不等于所有细胞壁抗菌药都失效；也不等于可以自动改用万古霉素。",
      "比较靶点与耐药机制，不把两药排成普遍的强弱顺序。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "青霉素 G（苄青霉素钠）说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/13988/smpc",
        sections: "4.4、5.1 节：过敏风险、PBPs、细胞壁合成和 β-内酰胺酶等耐药途径。",
      },
      {
        title: "万古霉素静脉制剂说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/8759/smpc",
        sections: "4.4、5.1 节：肾毒性与输注反应、前体末端结合、van 基因相关耐药。",
      },
    ],
  },
  {
    id: "morphine-vs-loperamide",
    title: "阿片受体药物：吗啡 vs 洛哌丁胺",
    summary: "同样涉及 μ 阿片受体，主要作用部位与治疗用途却不同；减慢肠蠕动是两者的共同点。",
    drugIds: ["morphine", "loperamide"],
    rows: [
      {
        label: "主要药效部位",
        quizId: "site",
        values: [
          "主要镇痛作用涉及脑和脊髓内的阿片受体",
          "主要作用于肠壁阿片受体，治疗剂量下进入中枢有限",
        ],
        quizExplanation: "不能只看受体名称，还要看药物到达哪里。洛哌丁胺在治疗剂量下以外周作用为主；这不代表过量或相互作用时绝不会发生中枢与呼吸毒性。",
      },
      {
        label: "主要治疗用途",
        quizId: "role",
        values: [
          "用于需要阿片类镇痛药、且替代治疗不足以控制的重度疼痛",
          "用于符合适应证的腹泻症状控制",
        ],
        quizExplanation: "吗啡主要用于镇痛，洛哌丁胺通过减慢推进性肠蠕动止泻。相似受体作用不能推出两者可互换；止泻也不能代替补液或病因处理。",
      },
      {
        label: "主要代谢方式",
        quizId: "metabolism",
        values: [
          "以葡萄糖醛酸结合为主，形成 M3G、M6G 等代谢物",
          "主要经 CYP3A4、CYP2C8 参与的 N-去甲基化",
        ],
        quizExplanation: "两药的主要代谢途径不同。洛哌丁胺还受 P-糖蛋白转运影响，相关酶或转运蛋白被抑制可增加暴露；不能把所有阿片受体药物的相互作用都按同一套规则记忆。",
      },
      {
        label: "共同的受体联系",
        values: ["具有 μ 阿片受体激动作用", "具有 μ 阿片受体激动作用"],
      },
      {
        label: "共同的胃肠效应",
        values: ["可减慢推进性肠蠕动，导致便秘", "可减慢推进性肠蠕动，导致便秘"],
      },
      {
        label: "重要风险与边界",
        values: [
          "需注意呼吸抑制、镇静及依赖风险",
          "过量可导致严重心律失常及中枢、呼吸毒性；血便伴高热等情况不适合自行止泻",
        ],
      },
    ],
    takeaways: [
      "受体相近，分布和主要用途仍可不同；吗啡偏中枢镇痛，洛哌丁胺偏肠道止泻。",
      "减慢肠蠕动和便秘不是洛哌丁胺独有的特征，不能据此单独识药。",
      "“治疗剂量下进入中枢有限”有适用前提，不等于过量安全。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "吗啡口服片说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3c847554-3b4b-4d24-a145-2ef7e9b83699",
        sections: "1、5、9、12.1～12.3 节：镇痛用途、中枢与胃肠作用、依赖及葡萄糖醛酸结合代谢。",
      },
      {
        title: "洛哌丁胺胶囊说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=26a50243-ab72-849b-e063-6394a90a60a9",
        sections: "临床药理、禁忌、注意事项和过量章节：肠壁受体、CYP 代谢、P-糖蛋白、补液及心脏和中枢毒性。",
      },
      {
        title: "洛哌丁胺胶囊说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/14352/smpc",
        sections: "4.4、4.5、4.9、5.1 节：治疗剂量下有限的血脑屏障穿透、相互作用与过量风险。",
      },
    ],
  },
  {
    id: "levothyroxine-vs-methimazole",
    title: "甲状腺用药：补充激素 vs 抑制合成",
    summary: "左甲状腺素钠补充 T4，甲巯咪唑减少新激素合成；都与甲状腺有关，但作用方向不同。",
    drugIds: ["levothyroxine", "methimazole"],
    rows: [
      {
        label: "核心治疗策略",
        quizId: "strategy",
        values: ["提供外源性 T4，用于甲状腺激素不足的替代治疗", "抑制新生甲状腺激素的合成，用于相应的甲亢治疗"],
        quizExplanation: "左甲状腺素钠提供激素；甲巯咪唑减少激素的新合成，但不使已储存或已进入血液的激素立即失活。不能把“抑制合成”理解成马上清除体内全部激素。",
      },
      {
        label: "作用涉及的分子环节",
        quizId: "molecular-pathway",
        values: [
          "补充的 T4 可在外周转为 T3，激素经核内甲状腺激素受体调节基因表达",
          "抑制甲状腺过氧化物酶（TPO）参与的激素合成环节",
        ],
        quizExplanation: "核内受体参与激素产生生理效应，TPO 参与制造激素。甲巯咪唑不是通过阻断核内甲状腺激素受体起效，也不会直接抵消外源性激素的作用。",
      },
      {
        label: "作用过度时的甲状腺状态",
        quizId: "excess-effect",
        values: [
          "激素补充过量可造成医源性甲状腺毒症",
          "激素合成抑制过强可造成甲状腺功能减退",
        ],
        quizExplanation: "两者作用过度时，偏离正常的方向相反：前者是激素作用过多，后者是激素不足。这道题考甲状腺状态，并不涵盖药物的其他不良反应。",
      },
      {
        label: "共同的随访要求",
        values: [
          "根据病因与治疗阶段复查甲状腺功能，不能仅凭症状调药",
          "根据病因与治疗阶段复查甲状腺功能，不能仅凭症状调药",
        ],
      },
      {
        label: "其他重要风险",
        values: [
          "补充过量需注意心律失常及骨量减少等风险",
          "需注意粒细胞缺乏、肝损伤；出现发热或咽痛应及时就医评估",
        ],
      },
    ],
    takeaways: [
      "先分清“补充激素”与“减少新合成”，再记核内受体和 TPO 的不同角色。",
      "甲巯咪唑不直接清除既有激素，不能把药物进入体内等同于全部症状立即消失。",
      "同属甲状腺治疗领域不代表可以互换，两者都需要结合甲状腺功能随访。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "左甲状腺素钠说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=b8c20f76-3ee6-4b29-b77f-ed4ad1baaed9",
        sections: "1、2.4、5、6、12.1～12.3 节：激素替代、核内受体、T4 转化、监测及过度替代风险。",
      },
      {
        title: "甲巯咪唑说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=acae35a6-dea2-3fa9-e053-2a95a90a3a4d&type=display",
        sections: "临床药理、警告与实验室监测：不使既有激素失活、甲减、粒细胞缺乏及肝损伤。",
      },
      {
        title: "甲巯咪唑靶点说明 · 美国国家癌症研究所",
        url: "https://www.cancer.gov/publications/dictionaries/cancer-drug/def/methimazole",
        sections: "药物词典：TPO 抑制与甲状腺激素合成。",
      },
    ],
  },
  {
    id: "nitroglycerin-vs-metoprolol",
    title: "抗心绞痛药：硝酸甘油 vs 美托洛尔",
    summary: "都可降低心肌耗氧，但硝酸甘油偏向舒张血管，美托洛尔偏向减弱心脏的交感反应。",
    drugIds: ["nitroglycerin", "metoprolol"],
    rows: [
      {
        label: "核心信号通路",
        quizId: "pathway",
        values: [
          "通过 NO 激活鸟苷酸环化酶，使平滑肌细胞内 cGMP 增加",
          "以阻断 β1 肾上腺素受体为主，减弱儿茶酚胺对心脏的作用",
        ],
        quizExplanation: "硝酸甘油通过 NO—cGMP 通路舒张血管；美托洛尔通过 β 受体阻断发挥作用。美托洛尔的 β1 选择性并非绝对，不能推断它完全不影响 β2 受体。",
      },
      {
        label: "降低耗氧的主要路径",
        quizId: "oxygen-demand",
        values: [
          "以静脉舒张、减少静脉回流和心室前负荷为重要途径",
          "抑制交感激活引起的心率和心肌收缩增强",
        ],
        quizExplanation: "前负荷与心脏做功都能影响耗氧。硝酸甘油也可舒张动脉，不能把“静脉作用为主”写成“只作用于静脉”。",
      },
      {
        label: "典型心率影响",
        quizId: "heart-rate",
        values: [
          "血压下降后可出现代偿性心率加快",
          "通常减慢窦性心率，并减慢房室结传导",
        ],
        quizExplanation: "抗心绞痛并不一定靠减慢心率。硝酸甘油可反射性加快心率，但严重低血压时也可能出现心动过缓；本行比较典型药理反应，不把它当成绝对规律。",
      },
      {
        label: "心绞痛中的剂型与角色",
        quizId: "angina-role",
        values: [
          "舌下片可用于急性发作的快速缓解",
          "口服治疗用于心绞痛的长期控制，不是舌下急救用药",
        ],
        quizExplanation: "快速缓解这一表述特指硝酸甘油舌下剂型，不能推广到所有硝酸酯剂型。美托洛尔的长期控制作用也不能代替急性胸痛的评估与处理。",
      },
      {
        label: "共同的低血压风险",
        values: ["可降低血压，需注意头晕与低血压", "可降低血压，需注意头晕与低血压"],
      },
      {
        label: "重要用药边界",
        values: [
          "禁与西地那非等 PDE5 抑制剂或利奥西呱合用，以免严重低血压",
          "需注意心动过缓和传导阻滞；长期使用后不宜自行突然停药",
        ],
      },
    ],
    takeaways: [
      "硝酸甘油偏向通过血管舒张减轻心脏负荷，美托洛尔偏向降低心率和收缩反应。",
      "两者都能降低耗氧和血压，这些共同结果不能单独作为识药依据。",
      "区分舌下快速缓解与口服长期控制，同时记住相互作用及停药风险。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "硝酸甘油舌下片 NITROSTAT 说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f7059ff7-bf74-48b4-811d-6eb1c26bfd8b",
        sections: "1、4.1、5.2、12.1～12.3 节：舌下剂型、NO—cGMP、前负荷、心率及合用禁忌。",
      },
      {
        title: "酒石酸美托洛尔口服片说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c0e147a8-36a6-1e61-e053-2a95a90afd62",
        sections: "1.2、4、5.1、12.1、12.2 节：心绞痛长期控制、β1 选择性、心率与传导、突然停药风险。",
      },
    ],
  },
  {
    id: "gentamicin-vs-azithromycin",
    title: "核糖体抗菌药：庆大霉素 vs 阿奇霉素",
    summary: "都干扰细菌蛋白质合成，但核糖体亚基、典型耐药途径和主要排泄途径不同。",
    drugIds: ["gentamicin", "azithromycin"],
    rows: [
      {
        label: "药物类别",
        quizId: "class",
        values: ["氨基糖苷类抗菌药", "大环内酯类抗菌药"],
        quizExplanation: "作用于核糖体不等于属于同一类药。氨基糖苷类与大环内酯类在结合部位、药代过程和风险方面均有区别。",
      },
      {
        label: "核糖体结合部位",
        quizId: "ribosomal-target",
        values: ["结合细菌 30S 亚基，导致 mRNA 误读", "结合细菌 50S 亚基的 23S rRNA，抑制蛋白质合成"],
        quizExplanation: "30S 与 50S 是不同的核糖体亚基。庆大霉素的典型作用包括扰乱解码；阿奇霉素结合 50S 上的 23S rRNA，不能将二者的亚基名称互换。",
      },
      {
        label: "典型耐药途径举例",
        quizId: "resistance-example",
        values: ["细菌产生使氨基糖苷类药物失活的酶", "23S rRNA 靶位修饰，常见方式是甲基化"],
        quizExplanation: "这里对照“药物被酶失活”与“核糖体靶位改变”两条典型路径。通透性或其他靶位变化也可能参与耐药，不能把例子当成唯一机制。",
      },
      {
        label: "主要排泄途径",
        quizId: "elimination",
        values: ["主要以原形经肾小球滤过进入尿液", "以原形经胆汁排泄是重要清除途径"],
        quizExplanation: "庆大霉素的清除明显依赖肾功能；阿奇霉素有重要的胆汁排泄途径。“主要”不等于“唯一”，不能据此推断后者完全没有肾脏相关风险。",
      },
      {
        label: "共同的作用结果",
        values: ["干扰敏感细菌的蛋白质合成", "干扰敏感细菌的蛋白质合成"],
      },
      {
        label: "重要风险与选药边界",
        values: [
          "需注意肾毒性、耳毒性，并结合肾功能及药物浓度等监测",
          "需注意 QT 间期延长、肝损伤及胃肠道反应",
        ],
      },
    ],
    takeaways: [
      "将“氨基糖苷—30S—解码错误”与“大环内酯—50S / 23S rRNA”对应起来。",
      "靶点同属核糖体，不代表药代过程、风险或适用病原体相同。",
      "两者均需结合感染部位、病原体与药敏选用，不能只按抗菌药类别自行替换。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "庆大霉素输注制剂说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/15154/smpc",
        sections: "4.2、4.4、5.1、5.2 节：浓度与肾功能监测、肾及耳毒性、30S、耐药和原形肾排泄。",
      },
      {
        title: "阿奇霉素说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=cd01f37d-4392-4d2b-e053-2995a90a721f",
        sections: "5、12.1、12.3、12.4 节：QT 与肝脏风险、胆汁排泄、50S / 23S rRNA 和靶位修饰。",
      },
    ],
  },
  {
    id: "digoxin-vs-metoprolol",
    title: "心脏用药：地高辛 vs 美托洛尔",
    summary: "都能减慢房室传导，但直接靶点、对心肌收缩的作用和清除途径不同。",
    drugIds: ["digoxin", "metoprolol"],
    rows: [
      {
        label: "直接作用靶点",
        quizId: "target",
        values: ["抑制 Na⁺-K⁺-ATP 酶（钠钾泵）", "以阻断 β1 肾上腺素受体为主"],
        quizExplanation: "地高辛影响跨膜离子梯度，增加心肌细胞内可利用的钙；美托洛尔减弱儿茶酚胺的受体信号。共同的减慢传导结果不能替代对靶点的判断。",
      },
      {
        label: "对心肌收缩的直接作用",
        quizId: "contractility",
        values: ["正性肌力作用，增强心肌收缩", "抑制儿茶酚胺介导的收缩增强，具有负性肌力作用"],
        quizExplanation: "“减慢心率”和“减弱收缩”不是同一件事。地高辛可以增强收缩而减慢房室传导；本行比较直接药理效应，不能据此判断心衰长期获益或自行替换治疗。",
      },
      {
        label: "原药清除的重要环节",
        quizId: "clearance",
        values: ["主要经肾排泄，较大部分以原形排出", "主要在肝脏经 CYP2D6 代谢"],
        quizExplanation: "地高辛需特别关注肾功能变化；美托洛尔暴露受 CYP2D6 活性和抑制剂影响。美托洛尔代谢物也可经尿排出，不能把“肝代谢”理解成“完全不经肾排泄”。",
      },
      {
        label: "共同的房室传导效应",
        values: ["可减慢房室结传导", "可减慢房室结传导"],
      },
      {
        label: "重要风险与监测",
        values: [
          "治疗窗较窄；需结合血药浓度、肾功能和电解质判断毒性风险",
          "需注意心动过缓、传导阻滞及突然停药风险",
        ],
      },
    ],
    takeaways: [
      "地高辛对应钠钾泵，美托洛尔对应 β1 受体。",
      "两者都可能导致心动过缓或传导阻滞，不能仅凭这一表现识药。",
      "把收缩力、传导和清除分开记忆；药理上的一项差异不等于完整的临床选择依据。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "地高辛口服片说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=dfac7f13-28be-423d-9389-9089da29da17",
        sections: "2、5.2、5.3、8.6、12.1～12.3 节：钠钾泵、正性肌力、传导、肾排泄及毒性监测。",
      },
      {
        title: "酒石酸美托洛尔说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c0e147a8-36a6-1e61-e053-2a95a90afd62",
        sections: "4、5.1、12.1～12.3 节：β1 阻断、心率与收缩、CYP2D6 代谢及突然停药风险。",
      },
    ],
  },
  {
    id: "aminophylline-vs-salbutamol",
    title: "支气管舒张药：氨茶碱 vs 沙丁胺醇",
    summary: "都能舒张支气管，但药物类别、作用环节与制剂监测重点不同。",
    drugIds: ["aminophylline", "salbutamol"],
    rows: [
      {
        label: "药物类别",
        quizId: "class",
        values: ["甲基黄嘌呤类，由茶碱与乙二胺形成复合物", "短效 β2 肾上腺素受体激动剂"],
        quizExplanation: "氨茶碱主要通过茶碱发挥药理作用，乙二胺有助于增加溶解度；沙丁胺醇属于 β2 受体激动剂。支气管舒张药并不是单一类别。",
      },
      {
        label: "作用机制的主要辨析",
        quizId: "mechanism",
        values: [
          "茶碱作用涉及磷酸二酯酶抑制、腺苷受体拮抗等，完整机制尚未完全明确",
          "激动 β2 受体，经腺苷酸环化酶增加细胞内 cAMP",
        ],
        quizExplanation: "沙丁胺醇从 β2 受体启动信号；茶碱的支气管舒张作用有研究支持磷酸二酯酶抑制，但其全部效应不能归结为单一靶点。二者都涉及 cAMP 相关通路，单说“升高 cAMP”不足以区分。",
      },
      {
        label: "剂型与监测重点（本组所引制剂）",
        quizId: "formulation-monitoring",
        values: [
          "静脉制剂需结合血中茶碱浓度评估暴露与毒性",
          "定量吸入制剂重点核对症状控制、使用频率与吸入技术",
        ],
        quizExplanation: "本行分别引用氨茶碱注射液与沙丁胺醇定量气雾剂。前者需关注浓度变化，后者使用频率增加可能提示控制恶化；这不代表后者无需监测，也不把结论推广到所有剂型。",
      },
      {
        label: "共同的支气管效应",
        values: ["可使气道平滑肌舒张", "可使气道平滑肌舒张"],
      },
      {
        label: "重要风险举例",
        values: [
          "茶碱暴露过高可引起严重心律失常、惊厥等",
          "可有震颤、心悸、低钾和反常性支气管痉挛等",
        ],
      },
      {
        label: "共同的学习边界",
        values: ["支气管舒张不等于气道炎症已得到充分控制", "支气管舒张不等于气道炎症已得到充分控制"],
      },
    ],
    takeaways: [
      "记住“茶碱类—多种分子作用”和“沙丁胺醇—β2 受体”，避免把所有平喘药当成同类。",
      "茶碱清除存在个体差异，疾病变化和相互作用可改变暴露；不能只按症状自行追加用量。",
      "机制对比不代表两者在治疗中的优先级相同，也不代表可以相互替换。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "氨茶碱注射液说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=52bbc6cd-4baf-7859-e063-6394a90ac87d",
        sections: "成分、临床药理、警告和注意事项：茶碱复合物、机制的不确定性、浓度监测及心律与惊厥风险。",
      },
      {
        title: "沙丁胺醇（albuterol）VENTOLIN HFA 说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=2ed73618-be3a-4331-9509-6401258f791f",
        sections: "2、5.1～5.8、12.1、17 节及使用说明：吸入剂型、β2—cAMP、症状恶化、炎症控制与不良反应。",
      },
    ],
  },
  {
    id: "cisplatin-vs-fluorouracil",
    title: "常用化疗药：顺铂 vs 氟尿嘧啶",
    summary: "顺铂形成 DNA 交联，氟尿嘧啶通过活性代谢物干扰核酸；相同的抗肿瘤目标来自不同环节。",
    drugIds: ["cisplatin", "fluorouracil"],
    rows: [
      {
        label: "药物类别",
        quizId: "class",
        values: ["铂类抗肿瘤药", "氟嘧啶类抗代谢药"],
        quizExplanation: "顺铂属于铂类，可产生类似烷化药的 DNA 损伤，但并不是氟嘧啶抗代谢药。氟尿嘧啶经细胞内转化后影响核酸合成与功能。",
      },
      {
        label: "主要细胞毒作用",
        quizId: "cytotoxic-mechanism",
        values: [
          "与 DNA 结合形成链内和链间交联，干扰复制与转录",
          "FdUMP 抑制胸苷酸合酶，FUTP、FdUTP 可分别掺入 RNA、DNA",
        ],
        quizExplanation: "顺铂造成 DNA 结构损伤；氟尿嘧啶既可阻碍胸苷酸生成，也可掺入核酸，不能把它记成另一种 DNA 交联药。",
      },
      {
        label: "体内转化的重要特点",
        quizId: "biotransformation",
        values: [
          "主要经历水或巯基等参与的化学取代反应，而非典型酶催化代谢",
          "DPD 酶参与大部分药物的分解代谢，活性不足可增加严重毒性",
        ],
        quizExplanation: "氟尿嘧啶的活化与分解是两件事：生成 FdUMP 等属于活化，DPD 主要参与分解。DPD 缺乏可能使毒性显著增加，不能误记成“缺乏活化酶，只会使疗效减弱”。",
      },
      {
        label: "共同的骨髓风险",
        values: ["可发生骨髓抑制，需要相应监测", "可发生骨髓抑制，需要相应监测"],
      },
      {
        label: "其他重要风险",
        values: [
          "需注意肾毒性、耳毒性、周围神经病变和严重恶心呕吐",
          "需注意 DPD 缺乏相关严重毒性、黏膜炎、腹泻、手足综合征及心脏毒性",
        ],
      },
    ],
    takeaways: [
      "顺铂偏向 DNA 交联，氟尿嘧啶偏向抗代谢与核酸掺入。",
      "DPD 负责氟尿嘧啶的重要分解途径；毒性风险不能仅由给药量或某一项检测结果判断。",
      "本组比较机制与风险，不根据某个不良反应自动推断化疗方案或替代关系。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "顺铂注射液说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a440f077-46f6-4688-a209-65bce38d1c92",
        sections: "5.1～5.6、12.1、12.3 节：DNA 交联、化学取代及肾、耳、神经和骨髓毒性。",
      },
      {
        title: "氟尿嘧啶注射液说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=8eff167f-203a-4a81-b2fc-d8773bc3555e",
        sections: "黑框警告、2.1、5.1～5.8、12.1、12.5 节：DPD / DPYD、活性代谢物、核酸作用及严重毒性。",
      },
    ],
  },
  {
    id: "diazepam-vs-phenytoin",
    title: "抗惊厥机制：地西泮 vs 苯妥英",
    summary: "增强 GABA 抑制性信号与限制神经元高频放电，是不同的抗惊厥路径。",
    drugIds: ["diazepam", "phenytoin"],
    rows: [
      {
        label: "药物类别",
        quizId: "class",
        values: ["苯二氮䓬类药物", "乙内酰脲类抗癫痫药"],
        quizExplanation: "具有抗惊厥作用不等于属于同一类药。苯二氮䓬类与乙内酰脲类的结构和主要作用环节不同，不能只凭用途归类。",
      },
      {
        label: "主要作用环节",
        quizId: "mechanism",
        values: [
          "结合 GABA-A 受体的苯二氮䓬位点，增强 GABA 的抑制作用",
          "通过电压依赖性钠通道阻断，减少持续的高频神经元放电",
        ],
        quizExplanation: "前者增强已有的抑制性递质信号，后者限制反复放电。苯妥英的确切治疗机制尚未完全明确，钠通道阻断是主要解释，不能把两者都记成直接激动 GABA 受体。",
      },
      {
        label: "肝代谢的辨析重点",
        quizId: "metabolism",
        values: [
          "经 CYP2C19、CYP3A 等形成去甲基地西泮等活性代谢物",
          "主要经 CYP2C9、部分经 CYP2C19 代谢，高浓度时羟化过程可饱和",
        ],
        quizExplanation: "地西泮的活性代谢物可延续药理作用；苯妥英的代谢饱和可使暴露随剂量非线性增加。两者均受肝功能和相互作用影响，单说“在肝脏代谢”不能区分。",
      },
      {
        label: "共同的中枢不良反应",
        values: ["可出现嗜睡、共济失调等", "可出现嗜睡、共济失调等"],
      },
      {
        label: "共同的停药提醒",
        values: ["突然停药可能诱发严重反应，应由医生评估调整", "突然停药可能诱发严重反应，应由医生评估调整"],
      },
      {
        label: "其他重要风险",
        values: [
          "需注意依赖与戒断；和阿片类等合用可增加镇静、呼吸抑制风险",
          "需注意严重皮肤反应、肝损伤及浓度相关毒性",
        ],
      },
    ],
    takeaways: [
      "地西泮对应 GABA-A 受体的苯二氮䓬位点，苯妥英对应电压依赖性钠通道。",
      "区分“活性代谢物延续作用”与“代谢饱和导致浓度非线性上升”。",
      "本组比较机制，不把口服制剂等同于急救制剂，也不把两药视为可直接互换。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "地西泮 VALIUM 口服片说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=260e2041-2bb3-482f-850e-b5d47a7bdbe6",
        sections: "5、6、9、12.1～12.3 节：GABA-A 位点、活性代谢物、中枢反应、依赖与戒断。",
      },
      {
        title: "苯妥英钠 DILANTIN 缓释胶囊说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=db8c69b0-4697-433e-98c7-b0b2d2c52a83",
        sections: "5.1、5.3、5.8、6、11、12.1、12.3 节：乙内酰脲、钠通道、饱和代谢及停药和毒性风险。",
      },
    ],
  },
  {
    id: "metronidazole-vs-levofloxacin",
    title: "影响细菌 DNA：甲硝唑 vs 左氧氟沙星",
    summary: "还原活化后损伤 DNA，与抑制 DNA 相关酶不同；抗菌谱和耐药路径也不能混为一谈。",
    drugIds: ["metronidazole", "levofloxacin"],
    rows: [
      {
        label: "药物类别",
        quizId: "class",
        values: ["硝基咪唑类抗感染药", "氟喹诺酮类抗菌药"],
        quizExplanation: "两者均影响微生物核酸过程，但不是同一类药。类别判断应与分子作用联系，不能仅凭“影响 DNA”归入氟喹诺酮类。",
      },
      {
        label: "抗菌作用的主要环节",
        quizId: "mechanism",
        values: [
          "在敏感厌氧菌内经还原活化，产生可与 DNA 相互作用的中间产物",
          "抑制细菌 DNA 回旋酶和拓扑异构酶 IV，干扰 DNA 相关过程",
        ],
        quizExplanation: "甲硝唑的关键线索是硝基还原与活性中间产物；左氧氟沙星的关键线索是两类拓扑异构酶。甲硝唑的精确机制尚未完全明确，不能简单写成另一种 DNA 回旋酶抑制剂。",
      },
      {
        label: "典型耐药环节举例",
        quizId: "resistance-example",
        values: [
          "硝基还原活化效率改变，使药物作用减弱",
          "DNA 回旋酶或拓扑异构酶 IV 的喹诺酮耐药决定区发生突变",
        ],
        quizExplanation: "这组例子分别落在“活化环节”与“酶靶点”。外排等其他机制也可参与两药耐药，因此这里不是完整耐药清单，也不能仅凭该机制推断药敏结果。",
      },
      {
        label: "共同的核酸联系",
        values: ["抗菌作用涉及 DNA 相关过程", "抗菌作用涉及 DNA 相关过程"],
      },
      {
        label: "共同的神经系统风险",
        values: ["可出现周围神经病变等神经系统不良反应", "可出现周围神经病变等神经系统不良反应"],
      },
      {
        label: "选药与风险边界",
        values: [
          "抗菌作用主要面向敏感厌氧菌，另有部分抗原虫用途；不能泛化为所有感染通用",
          "需结合病原体和药敏；注意肌腱损伤、神经系统反应和 QT 风险等",
        ],
      },
    ],
    takeaways: [
      "把“硝基还原—活性中间产物”与“回旋酶 / 拓扑异构酶 IV”分开记。",
      "神经病变不是左氧氟沙星独有的风险，不能只凭这个表现识药。",
      "作用都涉及 DNA，不代表抗菌谱相同，也不支持自行替换或合用。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "甲硝唑口服片说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=f7e5dacd-0bc4-4ac4-e053-6394a90a457a&type=display",
        sections: "微生物学、适应症、警告：硝基还原、机制局限、耐药、厌氧菌与原虫、神经系统风险。",
      },
      {
        title: "左氧氟沙星口服片说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=067e260c-dc47-4957-a9ff-5a79f17b4ca0",
        sections: "黑框警告、1、5、12.1、12.4 节：氟喹诺酮、拓扑异构酶、耐药与重要用药限制。",
      },
    ],
  },
  {
    id: "dexamethasone-vs-ibuprofen",
    title: "抗炎药：地塞米松 vs 布洛芬",
    summary: "糖皮质激素通过受体调节基因表达，NSAID 通过环氧化酶影响前列腺素；同样抗炎，作用路径不同。",
    drugIds: ["dexamethasone", "ibuprofen"],
    rows: [
      {
        label: "药物类别",
        quizId: "class",
        values: ["合成糖皮质激素", "丙酸类非甾体抗炎药（NSAID）"],
        quizExplanation: "抗炎是作用结果，不能据此把布洛芬归为激素。NSAID 中的“非甾体”正是与糖皮质激素这一类药相区分。",
      },
      {
        label: "主要抗炎作用路径",
        quizId: "mechanism",
        values: [
          "结合细胞内糖皮质激素受体，调节相关基因转录及炎症介质活动",
          "抑制环氧化酶相关的前列腺素合成",
        ],
        quizExplanation: "地塞米松的受体属于核受体家族，调控炎症相关基因；布洛芬作用于前列腺素合成环节。二者都可减轻炎症，但不能把地塞米松简单记成直接抑制 COX 的 NSAID。",
      },
      {
        label: "共同的抗炎结果",
        values: ["具有抗炎作用", "具有抗炎作用"],
      },
      {
        label: "共同的胃肠道提醒",
        values: ["需关注胃肠道溃疡、出血风险，合用另一药时风险可增加", "需关注胃肠道溃疡、出血风险，合用另一药时风险可增加"],
      },
      {
        label: "疗程与随访重点",
        values: [
          "长期全身用药需关注肾上腺轴抑制；减量停药应结合疗程与病情评估",
          "需结合疼痛、炎症及风险复评，关注胃肠道、肾功能和心血管风险",
        ],
      },
      {
        label: "共同的感染判断边界",
        values: ["可掩盖感染表现，症状减轻不代表病原体已被清除", "可掩盖感染表现，症状减轻不代表病原体已被清除"],
      },
    ],
    takeaways: [
      "抓住“糖皮质激素受体—基因调控”与“环氧化酶—前列腺素”两条路径。",
      "共同的胃肠道风险和抗炎作用不出识药题，本组只考类别与机制两项明确差异。",
      "长期全身糖皮质激素的停药问题需单独评估；抗炎作用也不等于抗感染治疗。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
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
      {
        title: "布洛芬口服片说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/100451/smpc",
        sections: "4.4、4.5、5.1 节：NSAID、前列腺素、感染掩盖及胃肠道、肾脏与心血管风险。",
      },
    ],
  },
  {
    id: "trastuzumab-vs-gefitinib",
    title: "靶向抗肿瘤药：曲妥珠单抗 vs 吉非替尼",
    summary: "抗 HER2 单抗与 EGFR 酪氨酸激酶抑制剂，在分子形式、结合环节和生物标志物上都有区别。",
    drugIds: ["trastuzumab", "gefitinib"],
    rows: [
      {
        label: "分子形式与类别",
        quizId: "class",
        values: ["人源化 IgG1 单克隆抗体", "小分子酪氨酸激酶抑制剂"],
        quizExplanation: "曲妥珠单抗是抗体；吉非替尼是小分子激酶抑制剂。靶向药不是单一的分子类别，不能因为都影响生长信号就把二者当成同一种药理策略。",
      },
      {
        label: "主要靶点与结合环节",
        quizId: "target",
        values: [
          "结合 HER2 受体胞外结构域，并可介导抗体依赖的细胞毒作用",
          "在 EGFR 酪氨酸激酶结构域与 ATP 竞争，可逆抑制激酶活性",
        ],
        quizExplanation: "HER2 与 EGFR 是不同的受体。抗体结合胞外结构域并可借助免疫效应，小分子作用于激酶环节；不能把“抗 HER2”与“抑制 EGFR”写成同一靶点。",
      },
      {
        label: "关键生物标志物（所引说明书）",
        quizId: "biomarker",
        values: [
          "相应乳腺癌或胃癌中 HER2 蛋白过表达或基因扩增",
          "转移性非小细胞肺癌中 EGFR 外显子 19 缺失或外显子 21 L858R 突变",
        ],
        quizExplanation: "蛋白过表达、基因扩增与特定激活突变不是同一种检测结果。这些线索需放在说明书限定的癌种与治疗情境中理解，单有一个标志物不能代替完整治疗评估。",
      },
      {
        label: "共同的选药要求",
        values: ["需结合癌种、相应检测结果及整体治疗方案", "需结合癌种、相应检测结果及整体治疗方案"],
      },
      {
        label: "重要风险与监测",
        values: [
          "需注意心肌病、输注反应与肺毒性，评估并随访左室射血分数",
          "需注意间质性肺病、肝毒性、腹泻和皮肤反应，随访肝功能等",
        ],
      },
    ],
    takeaways: [
      "曲妥珠单抗对应抗体与 HER2 胞外结构域，吉非替尼对应小分子与 EGFR 激酶。",
      "HER2 过表达 / 扩增和 EGFR 特定突变应分别记忆，不能只写成笼统的“靶点阳性”。",
      "两者均可能有肺部不良反应；对比用于理解机制和检测要求，不代表当前方案优先级。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "曲妥珠单抗 HERCEPTIN 静脉制剂说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=492dbdb2-077e-4064-bff3-372d6af0a7a2",
        sections: "1、2.1、2.2、5、11、12.1 节：HER2 检测、抗体与胞外结合、ADCC 及心肺风险。",
      },
      {
        title: "吉非替尼口服片说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1a3c0ce7-06a1-4e04-9106-14ddb2a866a5",
        sections: "1、2.1、5、6、12.1 节：EGFR 突变、适用癌种、可逆激酶抑制及肺、肝等风险。",
      },
      {
        title: "吉非替尼药物词典 · 美国国家癌症研究所（NCI）",
        url: "https://www.cancer.gov/publications/dictionaries/cancer-drug/def/gefitinib",
        sections: "药物定义：在 EGFR 酪氨酸激酶结构域竞争 ATP，抑制自磷酸化与信号传递。",
      },
    ],
  },
  {
    id: "atorvastatin-vs-aspirin",
    title: "心血管防治：阿托伐他汀 vs 阿司匹林",
    summary: "降脂与抗血小板作用于不同环节，不能把两种预防策略当成可以互相替代的作用。",
    drugIds: ["atorvastatin", "aspirin"],
    rows: [
      {
        label: "本组比较的药物类别",
        quizId: "class",
        values: ["他汀类调脂药", "用于抗血小板治疗的水杨酸类药物"],
        quizExplanation: "阿托伐他汀的核心分类是调脂药；本组讨论阿司匹林低剂量抗血小板用途。预防心血管事件这个共同目标不能代替药物分类，也不代表人人都需要同时使用。",
      },
      {
        label: "关键酶靶点与作用方式",
        quizId: "enzyme-target",
        values: [
          "竞争性抑制 HMG-CoA 还原酶，影响甲羟戊酸生成",
          "通过乙酰化不可逆抑制血小板环氧化酶，减少血栓素 A2 合成",
        ],
        quizExplanation: "HMG-CoA 还原酶属于胆固醇合成通路，血小板环氧化酶参与血栓素生成。前者不是凝血因子或血小板受体抑制剂，后者也不是抑制胆固醇合成的他汀。",
      },
      {
        label: "主要药理结果",
        quizId: "pharmacologic-effect",
        values: [
          "降低 LDL 胆固醇，相关机制包括增加肝脏 LDL 受体介导的清除",
          "抑制血小板聚集，作用可持续至受影响血小板被更新",
        ],
        quizExplanation: "降脂着眼于脂蛋白代谢，抗血小板着眼于血小板活化与聚集。血小板不能重新合成被乙酰化的环氧化酶，因此阿司匹林的作用不能仅按血中原药是否已清除来判断。",
      },
      {
        label: "重要风险与监测",
        values: [
          "需注意肌病、横纹肌溶解、肝功能异常及影响药物暴露的相互作用",
          "需注意出血、胃肠道损伤及过敏相关反应",
        ],
      },
      {
        label: "共同的治疗边界",
        values: ["需结合既往疾病、个体获益与风险评估用途", "需结合既往疾病、个体获益与风险评估用途"],
      },
    ],
    takeaways: [
      "将“他汀—HMG-CoA 还原酶—LDL”与“阿司匹林—血小板环氧化酶—血栓素”对应起来。",
      "降低 LDL 与抑制血小板聚集是不同任务，不能相互替代。",
      "本组阿司匹林资料针对抗血小板用途，不把所引二级预防适应症推广成全民预防建议。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "阿托伐他汀 LIPITOR 说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a60cc18b-0631-4cf0-b021-9f52224ece65",
        sections: "1、5.1～5.3、7、12.1、12.2 节：调脂用途、HMG-CoA 还原酶、LDL 及肌肉与肝脏风险。",
      },
      {
        title: "阿司匹林低剂量肠溶片说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/2614/smpc",
        sections: "4.1、4.3～4.5、4.8、5.1 节：二级预防、不可逆乙酰化、血栓素、血小板聚集及出血风险。",
      },
    ],
  },
  {
    id: "ceftriaxone-vs-gentamicin",
    title: "注射抗菌药：头孢曲松 vs 庆大霉素",
    summary: "同为注射抗菌药，作用部位却分别是细胞壁合成与核糖体，耐药和清除方式也不同。",
    drugIds: ["ceftriaxone", "gentamicin"],
    rows: [
      {
        label: "药物类别",
        quizId: "class",
        values: ["第三代头孢菌素，属于 β-内酰胺类", "氨基糖苷类抗菌药"],
        quizExplanation: "给药途径不能决定药理类别。头孢曲松的 β-内酰胺结构与细胞壁靶点相联系；庆大霉素属于氨基糖苷类，作用于细菌核糖体。",
      },
      {
        label: "主要作用部位",
        quizId: "target",
        values: [
          "结合青霉素结合蛋白（PBP），阻断细胞壁肽聚糖合成",
          "结合核糖体 30S 亚基，使 mRNA 解码发生错误",
        ],
        quizExplanation: "PBP 是细胞壁合成相关蛋白，30S 是核糖体亚基。二者分别影响细胞壁与蛋白质合成，不能把所有注射抗菌药都理解为“破坏细胞壁”。",
      },
      {
        label: "药物失活相关耐药举例",
        quizId: "resistance-example",
        values: [
          "被 ESBL、AmpC 等 β-内酰胺酶水解",
          "被细菌产生的氨基糖苷类药物失活酶作用",
        ],
        quizExplanation: "两种例子都涉及酶介导失活，但酶的作用对象不同。“第三代”不等于不受 β-内酰胺酶影响；此外，靶点改变、通透性下降等也可参与耐药。",
      },
      {
        label: "原形药物排泄",
        quizId: "elimination",
        values: [
          "原形药物经尿液和胆汁两条重要途径排出",
          "主要以原形经肾小球滤过进入尿液",
        ],
        quizExplanation: "头孢曲松有重要的肾脏与胆汁双途径排泄；庆大霉素清除更依赖肾小球滤过。不能因此认为头孢曲松无需评估肝肾功能，或凭这一项差异自行决定剂量。",
      },
      {
        label: "重要风险与监测",
        values: [
          "注意严重过敏、胆道沉积及与含钙静脉制剂相关的配伍和新生儿禁忌",
          "注意肾毒性、耳毒性，结合肾功能和药物浓度监测",
        ],
      },
      {
        label: "共同的选药要求",
        values: ["需结合感染部位、病原体、药敏和患者情况", "需结合感染部位、病原体、药敏和患者情况"],
      },
    ],
    takeaways: [
      "头孢曲松对应 PBP 与细胞壁，庆大霉素对应 30S 与解码错误。",
      "能经胆汁排泄不等于没有肾脏相关风险；耐药也不能只凭药物代际判断。",
      "本组比较所引注射制剂的药理特征，不代表两者抗菌谱相同或可以直接替换。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "头孢曲松注射 / 输注制剂说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/102127/smpc",
        sections: "4.2～4.5、5.1、5.2 节：PBP、β-内酰胺酶、尿液与胆汁排泄、含钙制剂限制和重要风险。",
      },
      {
        title: "庆大霉素输注制剂说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/15154/smpc",
        sections: "4.2、4.4、5.1、5.2 节：30S、细菌酶介导失活、原形肾排泄及肾、耳毒性监测。",
      },
    ],
  },
  {
    id: "levodopa-vs-haloperidol",
    title: "多巴胺通路：左旋多巴 vs 氟哌啶醇",
    summary: "提供多巴胺前体与阻断 D2 受体，方向不同；作用都涉及多巴胺，不代表用途相同。",
    drugIds: ["levodopa", "haloperidol"],
    rows: [
      {
        label: "药物类别",
        quizId: "class",
        values: ["多巴胺前体类抗帕金森病药", "丁酰苯类抗精神病药"],
        quizExplanation: "左旋多巴是可转化为递质的前体，不是直接阻断受体的药物；氟哌啶醇属于丁酰苯类，其主要作用与 D2 受体拮抗有关。",
      },
      {
        label: "对多巴胺信号的主要作用",
        quizId: "mechanism",
        values: [
          "穿过血脑屏障后在脑内转化为多巴胺，补充不足的递质",
          "拮抗中枢多巴胺 D2 受体，减弱相应信号",
        ],
        quizExplanation: "多巴胺本身难以通过血脑屏障，前体进入脑内后转化才是左旋多巴的关键。氟哌啶醇在受体环节阻断信号，不应把“涉及多巴胺”一概理解为增加多巴胺作用。",
      },
      {
        label: "代表性治疗用途",
        quizId: "therapeutic-role",
        values: [
          "改善帕金森病的运动症状",
          "治疗精神分裂症等精神病性障碍",
        ],
        quizExplanation: "运动症状改善与抗精神病作用是不同的治疗目标。氟哌啶醇可拮抗左旋多巴的作用，所引说明书将帕金森病列为禁忌，不能把两药理解为同一疾病中的常规替代选择。",
      },
      {
        label: "共同的体位性低血压风险",
        values: ["用药过程中可发生体位性低血压", "用药过程中可发生体位性低血压"],
      },
      {
        label: "其他重要风险",
        values: [
          "可出现异动症、幻觉等；需结合运动与精神症状评估",
          "可出现锥体外系反应、迟发性运动障碍、QT 延长和恶性综合征",
        ],
      },
      {
        label: "资料与联用边界",
        values: [
          "复方资料中的卡比多巴抑制外周脱羧，不能把这一作用归给左旋多巴",
          "D2 受体阻断可能削弱左旋多巴疗效，出现精神症状时不能自行套用本组对照选药",
        ],
      },
    ],
    takeaways: [
      "左旋多巴先作为前体进入脑内，再转化为多巴胺；氟哌啶醇在 D2 受体处阻断信号。",
      "左旋多巴的异动症与受体阻断药的运动不良反应不能简单混为一种机制。",
      "引用左旋多巴 / 卡比多巴复方说明书时，只将相应成分的药理作用归给左旋多巴。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "卡比多巴 / 左旋多巴口服片说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=dd2215a9-ee0f-443a-a2e3-3d0578c8cd8f",
        sections: "临床药理、适应症、注意事项与不良反应：区分两种成分、血脑屏障、运动症状、受体拮抗及体位性低血压。",
      },
      {
        title: "氟哌啶醇 HALDOL 口服溶液说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/15252/smpc",
        sections: "4.1、4.3～4.5、4.8、5.1 节：丁酰苯、D2 拮抗、治疗用途、帕金森病禁忌及运动与心律风险。",
      },
    ],
  },
  {
    id: "fluoxetine-vs-diazepam",
    title: "精神神经用药：氟西汀 vs 地西泮",
    summary: "抑制 5-HT 再摄取与增强 GABA 抑制性信号不同，不能把抗抑郁作用等同于镇静作用。",
    drugIds: ["fluoxetine", "diazepam"],
    rows: [
      {
        label: "药物类别",
        quizId: "class",
        values: ["选择性 5-HT 再摄取抑制剂（SSRI）", "苯二氮䓬类药物"],
        quizExplanation: "SSRI 通过影响递质再摄取发挥相关作用，苯二氮䓬类通过受体位点增强抑制性信号。二者都可用于精神神经领域，但不能合并记作同一类镇静药。",
      },
      {
        label: "主要分子作用",
        quizId: "mechanism",
        values: [
          "抑制中枢神经元对 5-HT 的再摄取",
          "结合 GABA-A 受体的苯二氮䓬位点，增强 GABA 的抑制作用",
        ],
        quizExplanation: "再摄取抑制与受体正向调节是不同环节。氟西汀的确切治疗机制尚未完全明确，认为与中枢 5-HT 再摄取抑制相关，不能把这一作用直接等同于即时镇静。",
      },
      {
        label: "代表性用途（所引口服制剂）",
        quizId: "therapeutic-role",
        values: [
          "用于重性抑郁障碍、强迫症等的治疗",
          "用于短期缓解焦虑症状，另可辅助治疗骨骼肌痉挛",
        ],
        quizExplanation: "本行列出各自说明书中的代表性用途，并非完整适应症清单。症状可能交叠，但缓解焦虑或产生镇静不等于治疗抑郁障碍，不能仅凭“紧张、睡不好”直接选药。",
      },
      {
        label: "共同的嗜睡风险",
        values: ["可能出现嗜睡等中枢不良反应", "可能出现嗜睡等中枢不良反应"],
      },
      {
        label: "重要风险与随访",
        values: [
          "需关注血清素综合征、躁狂转化，以及治疗期间情绪或行为恶化",
          "需关注依赖、戒断；与阿片类或其他中枢抑制剂合用可能增加呼吸抑制风险",
        ],
      },
      {
        label: "本组药物的相互作用提醒",
        values: [
          "与地西泮合用时，部分患者的地西泮半衰期可能延长",
          "与氟西汀合用可能影响自身清除，需由医生评估镇静等效应",
        ],
      },
    ],
    takeaways: [
      "区分“5-HT 再摄取”与“GABA-A 受体苯二氮䓬位点”。",
      "嗜睡并非地西泮独有，不能把它作为单选题唯一识药线索。",
      "两药存在相互作用；机制对比不能替代诊断、疗程和联用评估。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "氟西汀口服胶囊说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ab1eec9d-f755-81a2-e053-2a95a90acb3c",
        sections: "1、5.1、5.2、5.4、6、7.7、12.1～12.3 节：SSRI、适应症、嗜睡、精神与血清素风险及地西泮相互作用。",
      },
      {
        title: "地西泮 VALIUM 口服片说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=260e2041-2bb3-482f-850e-b5d47a7bdbe6",
        sections: "1、5、6、7、12.1～12.3 节：GABA-A 位点、焦虑与肌痉挛用途、嗜睡、依赖及相互作用。",
      },
    ],
  },
  {
    id: "sertraline-vs-chlorpromazine",
    title: "精神科用药：舍曲林 vs 氯丙嗪",
    summary: "5-HT 再摄取抑制与多巴胺受体阻断是不同环节，抗抑郁与抗精神病用途也需分清。",
    drugIds: ["sertraline", "chlorpromazine"],
    rows: [
      {
        label: "药物类别",
        quizId: "class",
        values: ["选择性 5-HT 再摄取抑制剂（SSRI）", "吩噻嗪类传统抗精神病药"],
        quizExplanation: "舍曲林属于 SSRI；氯丙嗪属于吩噻嗪类。都用于精神科并不意味着作用靶点和治疗目标相同，也不能用是否嗜睡来代替分类判断。",
      },
      {
        label: "主要作用环节",
        quizId: "mechanism",
        values: ["抑制神经元对 5-HT 的再摄取", "阻断脑内突触后多巴胺受体，发挥抗精神病作用"],
        quizExplanation: "再摄取决定递质被回收的过程，受体阻断影响递质信号的接收。氯丙嗪还涉及其他受体作用；本行比较主要药理环节，不把它描述为仅作用于一种受体。",
      },
      {
        label: "代表性治疗用途",
        quizId: "therapeutic-role",
        values: ["治疗抑郁发作、强迫症等", "治疗精神分裂症等精神病性障碍、躁狂等"],
        quizExplanation: "抑郁发作、强迫症与精神病性障碍、躁狂需要不同的诊断和治疗评估。本行只是各自说明书中的用途举例，不是凭单个情绪或行为表现选择药物的规则。",
      },
      {
        label: "共同的心律风险",
        values: ["有 QT 间期延长相关风险，需结合其他危险因素评估", "有 QT 间期延长相关风险，需结合其他危险因素评估"],
      },
      {
        label: "其他重要风险",
        values: [
          "关注血清素综合征、低钠血症、躁狂转化及情绪或行为恶化",
          "关注锥体外系反应、体位性低血压、抗胆碱反应及恶性综合征",
        ],
      },
      {
        label: "共同的治疗边界",
        values: ["需结合诊断、病史、合并用药和随访评估", "需结合诊断、病史、合并用药和随访评估"],
      },
    ],
    takeaways: [
      "先区分“递质再摄取”与“突触后受体”，再联系治疗目标。",
      "SSRI 的选择性不等于完全没有心律风险；共同风险不作为单选识药线索。",
      "本组比较用途与机制，不表示两药可直接替换或自行联用。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "舍曲林口服片说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/4348/smpc",
        sections: "4.1、4.4、4.5、4.8、5.1 节：SSRI、用途、5-HT 再摄取、QT 及其他重要风险。",
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
  },
  {
    id: "mesalazine-vs-omeprazole",
    title: "消化系统用药：美沙拉嗪 vs 奥美拉唑",
    summary: "肠黏膜局部抗炎与胃壁细胞抑酸不同，不能只按“胃肠不舒服”把两类药混为一谈。",
    drugIds: ["mesalazine", "omeprazole"],
    rows: [
      {
        label: "药物类别",
        quizId: "class",
        values: ["5-氨基水杨酸（5-ASA）类抗炎药", "质子泵抑制剂（PPI）"],
        quizExplanation: "5-ASA 与 PPI 的分类对应不同的药理任务。美沙拉嗪用于肠道炎症的相关治疗；奥美拉唑通过抑制酸分泌发挥作用，两者并非同一种“胃药”。",
      },
      {
        label: "主要作用部位与环节",
        quizId: "mechanism",
        values: [
          "主要在结肠黏膜局部抗炎，确切机制尚未完全明确",
          "抑制胃壁细胞 H+/K+-ATP 酶，阻断胃酸分泌的最后环节",
        ],
        quizExplanation: "美沙拉嗪可能通过影响结肠前列腺素等炎症介质减轻炎症，但不能把某一条假说当作已完全确定的唯一机制。奥美拉唑的关键靶点是胃壁细胞质子泵。",
      },
      {
        label: "代表性用途（所引口服制剂）",
        quizId: "therapeutic-role",
        values: ["成人轻中度活动性溃疡性结肠炎的诱导缓解与维持缓解", "胃食管反流病、胃或十二指肠溃疡等酸相关疾病"],
        quizExplanation: "结肠黏膜炎症与胃酸相关损伤不是同一病理过程。美沙拉嗪这一行限定 LIALDA 口服延迟释放制剂的成人适应症，不推广到所有肠炎或所有剂型。",
      },
      {
        label: "制剂与机制理解",
        values: [
          "LIALDA 依靠 pH 相关包衣和片芯释放药物，不能写成美沙拉嗪本身需菌群裂解活化",
          "口服延迟释放制剂保护药物通过胃部，吸收后作用于胃壁细胞；包衣不是药理靶点",
        ],
      },
      {
        label: "共同的肾脏风险",
        values: ["可发生间质性肾炎等肾损害", "可发生间质性肾炎等肾损害"],
      },
      {
        label: "治疗与监测边界",
        values: [
          "用前及治疗中评估肾功能；急性不耐受可能与肠炎加重相似",
          "症状改善不能排除胃部恶性疾病；疗程与长期风险需评估",
        ],
      },
    ],
    takeaways: [
      "美沙拉嗪对应肠黏膜抗炎，奥美拉唑对应胃壁细胞质子泵。",
      "不同释放系统不能混写为同一种前药活化过程，具体剂型需看对应说明书。",
      "局部抗炎不等于完全不吸收，也不等于没有肾损害风险。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "美沙拉嗪 LIALDA 口服延迟释放片说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3098a080-be86-4265-9818-7fc4beab77b7",
        sections: "1、5.1、5.2、11、12.1、12.3 节：成人溃疡性结肠炎、肾脏风险、急性不耐受、释放系统与机制局限。",
      },
      {
        title: "奥美拉唑口服延迟释放胶囊说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=5aba19da-663f-4901-94e2-f438dba4841f",
        sections: "1、5.1、5.3、11、12.1、12.3 节：酸相关疾病、肾炎、包衣与吸收、胃壁细胞质子泵。",
      },
    ],
  },
  {
    id: "indomethacin-vs-celecoxib",
    title: "非甾体抗炎药：吲哚美辛 vs 塞来昔布",
    summary: "同属 NSAID，COX 选择性与血小板作用有差异，但两者都需评估胃肠、心血管及肾脏风险。",
    drugIds: ["indomethacin", "celecoxib"],
    rows: [
      {
        label: "共同的药物类别",
        values: ["非甾体抗炎药（NSAID）", "非甾体抗炎药（NSAID）"],
      },
      {
        label: "环氧化酶选择性",
        quizId: "cox-selectivity",
        values: ["同时抑制 COX-1 与 COX-2", "在临床剂量范围内选择性抑制 COX-2"],
        quizExplanation: "吲哚美辛属于非选择性 COX 抑制剂，塞来昔布属于选择性 COX-2 抑制剂。COX 抑制是关键机制，但所引吲哚美辛说明书仍注明完整作用机制尚未完全明确。",
      },
      {
        label: "对血小板聚集的影响",
        quizId: "platelet-effect",
        values: ["可抑制血小板聚集", "临床剂量下不抑制血小板聚集"],
        quizExplanation: "血小板作用差异与 COX-1 抑制有关。不能由此把吲哚美辛当作阿司匹林的抗血栓替代药，也不能由塞来昔布不抑制血小板推导出没有出血或心血管风险。",
      },
      {
        label: "共同的重要风险",
        values: ["均需关注胃肠道出血、心血管事件和肾功能损害", "均需关注胃肠道出血、心血管事件和肾功能损害"],
      },
      {
        label: "共同的治疗边界",
        values: ["结合基础疾病、合并用药、剂量与疗程评估", "结合基础疾病、合并用药、剂量与疗程评估"],
      },
    ],
    takeaways: [
      "两者都是 NSAID；选择性 COX-2 抑制不等于没有胃肠、心血管或肾脏风险。",
      "将 COX 选择性与血小板作用联系起来，但不要把这一差异直接转成换药建议。",
      "补充的吲哚美辛栓剂资料仅用于核对血小板药理效应，不用于推算口服剂量或起效时间。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "吲哚美辛口服胶囊说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=16238287-d4b0-4afa-8483-1f4ae250a625",
        sections: "1、5.1、5.2、5.6、12.1 节：NSAID、COX-1 / COX-2 与胃肠、心血管、肾脏风险。",
      },
      {
        title: "吲哚美辛栓剂说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/2946/smpc",
        sections: "4.4 节：抑制血小板聚集的药理效应；不外推该制剂剂量及吸收速度。",
      },
      {
        title: "塞来昔布口服胶囊说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/14537/smpc",
        sections: "4.1、4.4、5.1 节：COX-2 选择性、血小板效应及胃肠、心血管、肾脏风险。",
      },
    ],
  },
  {
    id: "imatinib-vs-gefitinib",
    title: "小分子靶向药：伊马替尼 vs 吉非替尼",
    summary: "同为酪氨酸激酶抑制剂，靶点和适用肿瘤不同；药名都带“替尼”不能作为互换依据。",
    drugIds: ["imatinib", "gefitinib"],
    rows: [
      {
        label: "共同的药物类别",
        values: ["小分子酪氨酸激酶抑制剂", "小分子酪氨酸激酶抑制剂"],
      },
      {
        label: "关键激酶靶点",
        quizId: "target",
        values: ["抑制 BCR-ABL，以及 KIT、PDGFR 等激酶", "选择性抑制 EGFR 酪氨酸激酶"],
        quizExplanation: "BCR-ABL 融合蛋白与 EGFR 受体不是同一个靶点。伊马替尼也作用于 KIT、PDGFR 等，不能只按“抑制激酶”这个共同点判断抗肿瘤用途。",
      },
      {
        label: "代表性肿瘤与分子标志物",
        quizId: "disease-marker",
        values: [
          "Ph+（BCR-ABL 阳性）慢性髓性白血病，以及特定 KIT 阳性胃肠道间质瘤",
          "具有 EGFR 激活突变的成人局部晚期或转移性非小细胞肺癌",
        ],
        quizExplanation: "Ph+、KIT 与 EGFR 激活突变对应不同疾病背景。本行列举所引说明书情境，并非完整适应症；伊马替尼用于 GIST 还受不可切除、转移或术后复发风险等条件限制，不能只看一个标志物就选药。",
      },
      {
        label: "共同的选药要求",
        values: ["结合肿瘤诊断、分子检测、疾病阶段和治疗方案", "结合肿瘤诊断、分子检测、疾病阶段和治疗方案"],
      },
      {
        label: "重要风险与监测",
        values: [
          "关注液体潴留、血细胞减少与肝损伤",
          "关注皮疹、腹泻、间质性肺病与肝损伤",
        ],
      },
    ],
    takeaways: [
      "记住“伊马替尼—BCR-ABL / KIT”等靶点与“吉非替尼—EGFR”的对应关系。",
      "共同类别和共同肝脏风险不出单选识药题，测验集中在靶点与疾病标志物。",
      "靶向药并非只作用于肿瘤、也并非没有严重不良反应；治疗选择需结合完整检测与临床情境。",
    ],
    sourcesCheckedOn: "2026-10-20",
    sources: [
      {
        title: "伊马替尼口服片说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/13520/smpc",
        sections: "4.1、4.4、4.8、5.1 节：BCR-ABL、KIT、PDGFR、适应症条件、液体潴留及血液和肝脏监测。",
      },
      {
        title: "吉非替尼口服片说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/10591/smpc",
        sections: "4.1、4.4、4.8、5.1 节：EGFR、激活突变检测、晚期非小细胞肺癌及肺、肝、皮肤和胃肠风险。",
      },
    ],
  },
];
