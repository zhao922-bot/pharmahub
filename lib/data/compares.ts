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
  {
    id: "heparin-vs-enoxaparin",
    title: "普通肝素 vs 依诺肝素：Xa/Ⅱa 比例与监测差异",
    summary: "两药均通过抗凝血酶发挥抗凝作用，但对 Xa 与Ⅱa 因子的抑制比例、常规监测需求、肾脏依赖及鱼精蛋白中和程度不同。",
    drugIds: ["heparin", "enoxaparin"],
    rows: [
      {
        quizId: "factor-ratio",
        quizExplanation: "普通肝素链长足以同时桥接抗凝血酶与凝血酶（Ⅱa），故抗 Xa 与抗Ⅱa 活性接近 1:1；低分子肝素链较短，对 Xa 抑制明显强于Ⅱa。",
        label: "类别与抗 Xa / Ⅱa 比例",
        values: [
          "普通肝素，抗凝血酶介导下对 Xa 与Ⅱa 抑制活性相近",
          "低分子肝素，抗凝血酶介导下抗 Xa 活性强于抗Ⅱa",
        ],
      },
      {
        quizId: "monitoring",
        quizExplanation: "普通肝素药代个体差异大，治疗量需按 aPTT（体外循环等用 ACT）动态调整；依诺肝素皮下给药吸收与效应较可预测，一般不以 aPTT 常规监测。",
        label: "常规治疗实验室监测",
        values: [
          "常规治疗需监测 aPTT 或 ACT 并依结果调量",
          "常规治疗一般无需日常监测 aPTT，特定人群可测抗 Xa",
        ],
      },
      {
        quizId: "reversal-and-renal",
        quizExplanation: "鱼精蛋白主要中和肝素的抗Ⅱa 活性，对低分子肝素的抗 Xa 仅能部分中和；依诺肝素高度依赖肾脏清除，严重肾功能减退时易蓄积出血。",
        label: "中和程度与肾脏清除特点",
        values: [
          "鱼精蛋白可较充分中和；重度肾功能不全时仍常可选用",
          "鱼精蛋白仅部分中和抗 Xa；主要经肾排泄，肾衰易蓄积",
        ],
      },
      {
        quizId: "administration",
        quizExplanation: "普通肝素静脉半衰期短、停药后作用消退快，便于手术或出血高风险患者快速撤药；依诺肝素皮下注射生物利用度高且维持时间较长。",
        label: "给药特点与作用时程",
        values: [
          "多静脉注射或持续静滴，半衰期短、停药后消退较快",
          "多皮下注射，生物利用度高且抗 Xa 效应维持较稳定",
        ],
      },
      {
        label: "共同的重要风险",
        values: [
          "均可致出血及肝素诱导的血小板减少症（HIT）；均不直接溶栓",
          "均可致出血及肝素诱导的血小板减少症（HIT）；均不直接溶栓",
        ],
      },
      {
        label: "使用与转换边界",
        values: [
          "两者单位不能简单等量互换，椎管内操作均需评估硬膜外血肿",
          "两者单位不能简单等量互换，椎管内操作均需评估硬膜外血肿",
        ],
      },
    ],
    takeaways: [
      "记住「普通肝素抗 Xa≈Ⅱa、查 aPTT、鱼精蛋白可充分中和」，与「低分子偏抗 Xa、主要经肾排泄、仅部分中和」成对对照。",
      "低分子肝素并非绝不发生 HIT，且不同肝素制剂不可按国际单位或毫克直接互换。",
      "严重肾功能不全或需快速可逆停药（如体外循环、即将手术）时，两者的权衡截然不同。",
    ],
    scenarios: [
      "体外循环、血液透析或重度肾功能不全需快速可逆抗凝时，常倾向普通肝素。",
      "肾功能尚可的院内外静脉血栓预防与常规抗凝，常选用皮下依诺肝素。",
    ],
    sources: [
      {
        title: "DailyMed：Heparin sodium 注射液说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=07438e10-1589-4683-9f26-e5494d076cf0",
        sections: "第 1、4～6、12.1 节：抗凝血酶机制、监测、HIT、出血及无直接纤溶作用。",
      },
      {
        title: "emc：Clexane（依诺肝素钠）注射剂说明书",
        url: "https://www.medicines.org.uk/emc/product/1695/smpc",
        sections: "第 4.1～4.5、4.8、5.1 节：抗 Xa/Ⅱa 比例、肾功能蓄积、HIT 与鱼精蛋白部分中和。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "warfarin-vs-apixaban-vs-rivaroxaban",
    title: "口服抗凝药：华法林 vs 阿哌沙班 vs 利伐沙班",
    summary: "华法林干预维生素 K 依赖凝血因子合成，阿哌沙班与利伐沙班均直接抑制因子 Xa，但饮食要求、肾排泄占比与给药监测差异显著。",
    drugIds: ["warfarin", "apixaban", "rivaroxaban"],
    rows: [
      {
        quizId: "food-interaction",
        quizExplanation: "华法林易受富含维生素 K 食物波动影响而改变 INR；阿哌沙班吸收不受食物显著影响；利伐沙班高剂量片（15 mg / 20 mg）需随餐服用以保证充分生物利用度。",
        label: "饮食与进食要求",
        values: [
          "需保持维生素 K 摄入相对稳定，饮食波动可改变 INR",
          "无维生素 K 饮食限制，常规口服不受进食显著影响",
          "无维生素 K 饮食限制，15 mg 与 20 mg 高剂量片需随餐服用",
        ],
      },
      {
        quizId: "renal-profile",
        quizExplanation: "华法林主要经肝酶代谢，不按肌酐清除率机械减量；阿哌沙班约 27% 经肾清除（减量常综合年龄、体重、血肌酐）；利伐沙班约 36% 以原型经肾排泄，对肾功能阈值更敏感。",
        label: "肾脏清除与调量依据",
        values: [
          "以肝酶代谢为主、原型经肾极少，不主要按肌酐清除率调量",
          "约 27% 经肾清除，房颤减量常综合年龄、体重与血肌酐",
          "约 36% 以原型经肾清除，主要依肌酐清除率分层调量或停用",
        ],
      },
      {
        quizId: "monitoring-and-regimen",
        quizExplanation: "华法林起效依赖已有凝血因子清除，需常规测 INR 调量；阿哌沙班与利伐沙班均无需常规 INR 监测，但常规房颤给药频次分别以每日两次与每日一次为主。",
        label: "起效与常规监测特点",
        values: [
          "起效较慢，需常规监测 INR 调整剂量，相互作用繁多",
          "起效快（常每日两次），无需常规 INR 监测",
          "起效快（房颤常每日一次），无需常规 INR 监测",
        ],
      },
      {
        label: "靶点与人工心脏瓣膜边界",
        values: [
          "抑制 VKORC1；适用于机械心脏瓣膜抗凝",
          "直接抑制因子 Xa；不推荐用于人工心脏瓣膜",
          "直接抑制因子 Xa；不推荐用于人工心脏瓣膜（含 TAVR 相关警示）",
        ],
      },
      {
        label: "共同的重要风险",
        values: [
          "均可导致严重或致命出血，椎管内操作均需评估硬膜外血肿",
          "均可导致严重或致命出血，椎管内操作均需评估硬膜外血肿",
          "均可导致严重或致命出血，椎管内操作均需评估硬膜外血肿",
        ],
      },
    ],
    takeaways: [
      "机械心脏瓣膜抗凝仍依赖华法林等维生素 K 拮抗剂，阿哌沙班与利伐沙班均不推荐用于人工心脏瓣膜。",
      "同为 Xa 抑制剂，阿哌沙班可空腹或随餐服用且肾清除占比约 27%；利伐沙班高剂量片必须随餐服用。",
      "三者无需常规查 INR 不等于绝对无需评估凝血与肾肝功能，围手术期停药均应个体化决策。",
    ],
    scenarios: [
      "机械心脏瓣膜置换术后抗凝，应选用华法林而非直接因子 Xa 抑制剂。",
      "非瓣膜性房颤患者若肾功能中度下降或进食不规律，常对比评估阿哌沙班与利伐沙班的调量条件及随餐要求。",
    ],
    sources: [
      {
        title: "华法林说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=cdbbc317-35d3-42ba-94f0-c83891358529",
        sections: "药理、适应症、警告与不良反应（机械瓣膜、INR 监测与饮食相互作用）",
      },
      {
        title: "DailyMed：ELIQUIS（apixaban）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=a454cd24-0c6d-46e8-b1e4-197388606175",
        sections: "第 1、2、5、12.1～12.3 节：年龄/体重/肌酐减量标准、约 27% 肾清除及人工瓣膜限制。",
      },
      {
        title: "DailyMed：XARELTO（利伐沙班）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=10db92f9-2300-4a80-836b-673e1ae91610",
        sections: "第 1、2、5、12.1～12.3 节：高剂量随餐服用、约 36% 肾排泄及人工瓣膜警示。",
      },
      {
        title: "CHEST · 围手术期抗栓指南（2022）",
        url: "https://www.chestnet.org/guidelines-and-topic-collections/guidelines/pulmonary-vascular/perioperative-management-of-antithrombotic-therapy",
        sections: "围手术期口服抗凝药中断与桥接评估原则",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "clopidogrel-vs-ticagrelor",
    title: "P2Y12 抑制剂：氯吡格雷 vs 替格瑞洛",
    summary: "两药均抑制血小板 P2Y12 受体，但在前药活化需求、受体结合可逆性及特征性不良反应和相互作用上差异明显。",
    drugIds: ["clopidogrel", "ticagrelor"],
    rows: [
      {
        quizId: "activation",
        quizExplanation: "氯吡格雷本身无活性，须经肝 CYP2C19 等酶转化为活性代谢物；替格瑞洛母药即可直接作用于受体，不受 CYP2C19 慢代谢基因型削弱。",
        label: "前药活化与 CYP2C19 影响",
        values: [
          "前药，需经 CYP2C19 等肝酶活化；慢代谢或奥美拉唑可降效",
          "非前药，母药直接具有活性，受 CYP2C19 基因多态性影响小",
        ],
      },
      {
        quizId: "reversibility",
        quizExplanation: "氯吡格雷不可逆结合 P2Y12，血小板整个生命周期内受抑；替格瑞洛可逆结合受体，停药后血小板功能恢复相对更快（仍须遵医嘱停药）。",
        label: "受体结合可逆性",
        values: [
          "活性代谢物不可逆抑制 P2Y12，作用持续至新血小板生成",
          "直接、可逆性抑制 P2Y12 受体下游信号转导",
        ],
      },
      {
        quizId: "adverse-and-interaction",
        quizExplanation: "两药都有出血风险，但替格瑞洛特有的呼吸困难与心动过缓风险，以及强 CYP3A4 抑制剂禁忌/相互作用是重要辨析点。",
        label: "特征性不良反应与相互作用重点",
        values: [
          "较少引起呼吸困难，但需防范 CYP2C19 抑制剂降低活化",
          "可致呼吸困难或心室停搏间期；禁与强 CYP3A4 抑制剂同用",
        ],
      },
      {
        label: "共同作用靶点与用途",
        values: [
          "均抑制血小板 P2Y12 通路，用于急性冠脉综合征等动脉血栓预防",
          "均抑制血小板 P2Y12 通路，用于急性冠脉综合征等动脉血栓预防",
        ],
      },
      {
        label: "共同风险与停药边界",
        values: [
          "均增加出血风险；不能自行骤停，围手术期需权衡支架血栓风险",
          "均增加出血风险；不能自行骤停，围手术期需权衡支架血栓风险",
        ],
      },
    ],
    takeaways: [
      "用「前药 + 不可逆 + 看 CYP2C19」记氯吡格雷，用「直接活性 + 可逆 + 呼吸困难/CYP3A4」记替格瑞洛。",
      "替格瑞洛虽结合可逆，但过早停药同样显著增加支架内血栓和心肌梗死风险。",
      "与阿司匹林联用时需注意替格瑞洛对应的阿司匹林维持剂量要求，具体遵指南与说明书。",
    ],
    scenarios: [
      "急性冠脉综合征需较强且不受 CYP2C19 慢代谢影响的抗血小板抑制时，常评估替格瑞洛。",
      "既往颅内出血史或无法耐受替格瑞洛相关呼吸困难时，禁忌或常需改选氯吡格雷等方案。",
    ],
    sources: [
      {
        title: "氯吡格雷说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ab32a331-2cea-453b-bba1-5451d38edd73",
        sections: "黑框警告及药理、适应症、相互作用（CYP2C19 活化与奥美拉唑影响）",
      },
      {
        title: "emc：Ticagrelor 片产品说明书",
        url: "https://www.medicines.org.uk/emc/product/101008/smpc",
        sections: "第 4.1～4.5、4.8、5.1 节：直接可逆 P2Y12 拮抗、呼吸困难、心动过缓及强 CYP3A4 抑制剂。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "rosuvastatin-vs-ezetimibe",
    title: "降胆固醇双路径：瑞舒伐他汀 vs 依折麦布",
    summary: "他汀在肝内抑制胆固醇合成，依折麦布在小肠刷状缘阻断胆固醇吸收；两药通路互补，临床常联合以进一步降低 LDL-C。",
    drugIds: ["rosuvastatin", "ezetimibe"],
    rows: [
      {
        quizId: "target-site",
        quizExplanation: "瑞舒伐他汀在肝细胞内抑制胆固醇从头合成限速酶 HMG-CoA 还原酶；依折麦布作用于小肠刷状缘 NPC1L1 转运蛋白，减少膳食和胆汁胆固醇吸收。",
        label: "直接作用靶点与部位",
        values: [
          "抑制肝细胞 HMG-CoA 还原酶，阻断胆固醇合成限速步骤",
          "抑制小肠刷状缘 NPC1L1，减少肠道胆固醇及植物甾醇吸收",
        ],
      },
      {
        quizId: "complementary-pathway",
        quizExplanation: "抑制合成与减少外源/胆汁吸收都会促使肝胆固醇池下降、代偿增加肝表面 LDL 受体，因而联合使用具有机制互补性。",
        label: "调脂机制与联合关系",
        values: [
          "减少肝内胆固醇合成并上调肝 LDL 受体，为降脂及心血管预防基石",
          "减少肠源胆固醇入肝并继发上调 LDL 受体，常与他汀联合互补",
        ],
      },
      {
        quizId: "adverse-emphasis",
        quizExplanation: "瑞舒伐他汀需重点警惕肌病、横纹肌溶解及血糖升高；依折麦布单用肌毒性相对少见但并非绝无，与他汀联用时尤其需监测转氨酶。",
        label: "不良反应与监测侧重点",
        values: [
          "需关注肌痛/肌病、转氨酶升高、血糖升高及亚洲人群暴露差异",
          "腹泻等胃肠不适较常见，与他汀联用需关注转氨酶升高；亦有肌病报告",
        ],
      },
      {
        label: "共同的下游结果",
        values: [
          "最终均有助于降低血液 LDL 胆固醇",
          "最终均有助于降低血液 LDL 胆固醇",
        ],
      },
      {
        label: "共同的治疗边界",
        values: [
          "均须配合饮食与生活方式干预，不能仅凭单次血脂值自行停药",
          "均须配合饮食与生活方式干预，不能仅凭单次血脂值自行停药",
        ],
      },
    ],
    takeaways: [
      "「肝内压合成（瑞舒伐他汀）」与「肠道堵吸收（依折麦布）」是从两个入口共同促使肝细胞多抓血中 LDL。",
      "依折麦布也有纯合子家族性植物甾醇血症的专门用途，并非仅在联用他汀时才有价值。",
      "非他汀不等于零肌病或零肝酶风险，两者联用时仍需评估肌肉症状和肝功能。",
    ],
    scenarios: [
      "原发性高脂血症或高危心血管预防的基础降脂，首选强效他汀如瑞舒伐他汀。",
      "他汀充分耐受剂量下 LDL-C 仍未达标，或他汀不耐受时，常加用或单用依折麦布。",
    ],
    sources: [
      {
        title: "emc：Rosuvastatin 片产品说明书",
        url: "https://www.medicines.org.uk/emc/product/8863/smpc",
        sections: "第 4.1～4.5、4.8、5.1 节：HMG-CoA 还原酶、LDL 受体、心血管事件预防及肌肝血糖风险。",
      },
      {
        title: "DailyMed：ZETIA（ezetimibe）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=174e45e0-45bb-48b7-9e60-8f6cfc1d22bb",
        sections: "第 1、5、6、12.1 节：NPC1L1 机制、联用他汀适应症、植物甾醇血症及肝酶/肌病风险。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "furosemide-vs-spironolactone",
    title: "利尿方向对照：呋塞米 vs 螺内酯",
    summary: "两者都促进排钠排水，但作用的肾单位部位、对血钾的影响方向以及在心衰等疾病中的角色完全不同。",
    drugIds: ["furosemide", "spironolactone"],
    rows: [
      {
        quizId: "site-and-target",
        quizExplanation: "呋塞米作用于髓袢升支粗段 NKCC2；螺内酯作用于远端肾小管与集合管的盐皮质激素（醛固酮）受体。段位越靠前且重吸收负荷越大，利尿效力通常越强。",
        label: "作用部位与分子靶点",
        values: [
          "髓袢升支粗段，抑制 Na⁺-K⁺-2Cl⁻ 同向转运体（NKCC2）",
          "肾远端小管与集合管，竞争性拮抗醛固酮（盐皮质激素）受体",
        ],
      },
      {
        quizId: "potassium-direction",
        quizExplanation: "呋塞米增加远端钠水递送与醛固酮反应而促进排钾（易低钾）；螺内酯阻断醛固酮介导的钠钾交换而减少排钾（易高钾），临床有时正是利用二者互补。",
        label: "对血钾的典型影响方向",
        values: [
          "排钾利尿，易导致低钾血症（常伴低镁与尿钙增加）",
          "保钾利尿，易导致高钾血症（肾损或联用 RAAS 阻断药更需警惕）",
        ],
      },
      {
        quizId: "clinical-role",
        quizExplanation: "呋塞米是迅速缓解肺水肿和体循环淤血的主力利尿药；螺内酯利尿较温和，更多凭借醛固酮受体拮抗参与原发性醛固酮增多症、肝硬化腹水及 HFrEF 长期获益。",
        label: "利尿强度与代表定位",
        values: [
          "强效快速排钠排水，主力缓解容量超负荷与肺水肿",
          "利尿作用较温和，重在拮抗醛固酮（心衰改善结局、原醛、腹水）",
        ],
      },
      {
        quizId: "distinct-adverse",
        quizExplanation: "呋塞米的低镁、高尿酸血症、代谢性碱中毒与大剂量快推耳毒性有别于螺内酯的男性乳房发育等内分泌反应。",
        label: "各自特征性不良反应",
        values: [
          "低钾、低镁、高尿酸血症、代谢性碱中毒及快速静注耳毒性",
          "高钾血症、男性乳房发育及其他抗雄激素/内分泌不良反应",
        ],
      },
      {
        label: "共同的容量与电解质风险",
        values: [
          "均可引起低钠血症、过度利尿所致容量不足、低血压与肾前性肾功能恶化",
          "均可引起低钠血症、过度利尿所致容量不足、低血压与肾前性肾功能恶化",
        ],
      },
      {
        label: "共同监测与治疗边界",
        values: [
          "均需定期监测血钾、血钠、肾功能与容量状态；尿量增加不等于肾损伤治愈",
          "均需定期监测血钾、血钠、肾功能与容量状态；尿量增加不等于肾损伤治愈",
        ],
      },
    ],
    takeaways: [
      "「呋塞米（髓袢 NKCC2）排钾、强效消肿」vs「螺内酯（远端醛固酮受体）保钾、抑纤维化/神经内分泌」。",
      "两者均可能导致低钠血症和容量不足；不可因螺内酯是“保钾”就忽视血钠或肾功能。",
      "呋塞米与螺内酯联用虽能部分平衡血钾，但仍须严密监测肾功能与电解质。",
    ],
    scenarios: [
      "急性或明显容量超负荷（如肺水肿、下肢水肿）需快速减轻充血时，主力选用呋塞米。",
      "NYHA Ⅲ～Ⅳ级 HFrEF、肝硬化腹水或原发性醛固酮增多症时，常评估加用螺内酯。",
    ],
    sources: [
      {
        title: "呋塞米说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/12129/smpc",
        sections: "第 4.1、4.4、4.8、5.1 节：NKCC2、强效利尿、低钾低镁及耳毒性。",
      },
      {
        title: "DailyMed：Spironolactone 片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=c1c5fdab-3ff7-414b-8e25-beed8311b8ad",
        sections: "第 1、5、6、12.1 节：醛固酮拮抗、NYHA Ⅲ～Ⅳ级心衰、高钾与内分泌反应。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "sacubitril-valsartan-vs-losartan",
    title: "心衰与 RAAS 阻断：沙库巴曲缬沙坦 vs 氯沙坦",
    summary: "沙库巴曲缬沙坦在阻断 AT1 受体基础上叠加脑啡肽酶抑制，比单用 ARB 多了一条利钠肽保护通路，也带来更严格的 ACEI 转换间隔。",
    drugIds: ["sacubitril-valsartan", "losartan"],
    rows: [
      {
        quizId: "pathway-count",
        quizExplanation: "沙库巴曲缬沙坦属于 ARNI，同时涵盖脑啡肽酶抑制（LBQ657）与 AT1 受体阻断（缬沙坦）；氯沙坦则是单纯阻断 AT1 受体的 ARB。",
        label: "靶点与通路构成",
        values: [
          "沙库巴曲活性物抑制脑啡肽酶 + 缬沙坦阻断 AT1 受体（双通路）",
          "氯沙坦及活性代谢物单通路阻断血管紧张素 II 的 AT1 受体",
        ],
      },
      {
        quizId: "natriuretic-peptide",
        quizExplanation: "抑制脑啡肽酶能减少 ANP、BNP 等内源性利钠肽降解，放大其舒血管和排钠利尿保护信号；ARB 不直接干预脑啡肽酶。",
        label: "对利钠肽降解的影响",
        values: [
          "抑制脑啡肽酶，减少利钠肽降解并增强舒血管与排钠效应",
          "不直接抑制脑啡肽酶，不依赖减少利钠肽降解发挥作用",
        ],
      },
      {
        quizId: "acei-washout",
        quizExplanation: "脑啡肽酶与 ACE 均参与缓激肽降解，同时阻断两者会大幅升高致命性血管性水肿风险，故沙库巴曲缬沙坦与 ACEI 互换必须留足 36 小时洗脱期。",
        label: "与 ACEI 转换的 36 小时边界",
        values: [
          "禁与 ACEI 同用，相互转换须至少间隔 36 小时以防血管性水肿",
          "一般不常规与 ACEI 双联，但单药 ARB 无 36 小时脑啡肽酶转换禁忌",
        ],
      },
      {
        quizId: "indication-focus",
        quizExplanation: "沙库巴曲缬沙坦的核心定位是改善成人慢性心衰（尤其 LVEF 低于正常者）死亡与住院结局；氯沙坦主要代表高血压及特定 2 型糖尿病肾病。",
        label: "核对资料中的典型定位",
        values: [
          "成人慢性心衰降低心血管死亡与住院风险（LVEF 低于正常者最明确）",
          "高血压及伴高血压、蛋白尿的特定 2 型糖尿病肾病",
        ],
      },
      {
        label: "共同的重要风险",
        values: [
          "均可致低血压、高钾血症、肾功能恶化及胎儿毒性（妊娠期避免）",
          "均可致低血压、高钾血症、肾功能恶化及胎儿毒性（妊娠期避免）",
        ],
      },
      {
        label: "共同的联用禁区",
        values: [
          "均已阻断 AT1 受体，不得再叠加其他 ARB，并需监测血钾与肾功能",
          "均已阻断 AT1 受体，不得再叠加其他 ARB，并需监测血钾与肾功能",
        ],
      },
    ],
    takeaways: [
      "ARNI = 脑啡肽酶抑制（护利钠肽）+ AT1 阻断（拦血管紧张素 II），已含缬沙坦，切忌再叠用氯沙坦等 ARB。",
      "从 ACEI 换用沙库巴曲缬沙坦（或反之）必须至少间隔 36 小时，绝不可直接无缝切换。",
      "沙库巴曲缬沙坦降压与利钠作用更强，启动或滴定期间需更密切监测低血压、血钾与肾功能。",
    ],
    scenarios: [
      "射血分数降低的慢性心力衰竭需进一步降低住院和心血管死亡风险时，常将 ACEI/ARB 转换为沙库巴曲缬沙坦。",
      "单纯原发性高血压或伴蛋白尿的 2 型糖尿病肾病基础治疗，可选用氯沙坦等 ARB。",
    ],
    sources: [
      {
        title: "DailyMed：ENTRESTO（沙库巴曲缬沙坦）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=000dc81d-ab91-450c-8eae-8eb74e72296f",
        sections: "黑框警告及第 1、2.1、4～7、12.1 节：慢性心衰、双通路机制、36 小时 ACEI 间隔及血管性水肿。",
      },
      {
        title: "氯沙坦说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a959c71b-d658-4871-b303-073234b9fa84",
        sections: "药理、适应症、警告与不良反应（AT1 阻断、高血压与糖尿病肾病、高钾及胎儿毒性）",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "sglt2i-vs-dpp4i-vs-glp1ra",
    title: "新型降糖三类代表：恩格列净 vs 西格列汀 vs 司美格鲁肽",
    summary: "三类药单用时低血糖风险均较低，但分别经尿排糖、保护内源肠促胰素或直接激动 GLP-1 受体起效，在心肾获益和不良反应上差异明显。",
    drugIds: ["empagliflozin", "sitagliptin", "semaglutide"],
    rows: [
      {
        quizId: "mechanism",
        quizExplanation: "恩格列净直接抑制肾脏 SGLT2 促进尿糖排泄（非胰岛素依赖）；西格列汀通过抑制 DPP-4 酶延长内源性 GLP-1/GIP；司美格鲁肽直接作为 GLP-1 受体激动剂起效。",
        label: "核心靶点与降糖机制",
        values: [
          "抑制肾小管 SGLT2，减少葡萄糖重吸收并促尿糖排泄",
          "抑制 DPP-4 酶，延长内源性 GLP-1 与 GIP 活性",
          "直接激动 GLP-1 受体，依血糖促胰岛素分泌并抑胰高血糖素",
        ],
      },
      {
        quizId: "route-and-renal",
        quizExplanation: "恩格列净与西格列汀为口服，但前者重度肾损时降糖减弱、后者需按肾功能减量；所引司美格鲁肽（OZEMPIC）为皮下注射剂，不主要经肾清除。",
        label: "给药方式与肾功能关联",
        values: [
          "口服；降糖效应依赖肾小球滤过，重度肾损时降糖效力下降",
          "口服；主要经肾排泄，肾功能减退时通常需按指标减量",
          "皮下注射（OZEMPIC 制剂）；非主要经肾清除，但严重脱水可诱发 AKI",
        ],
      },
      {
        quizId: "organ-indications",
        quizExplanation: "三类药在器官保护适应症上并非等同：恩格列净同时获批心衰与 CKD；西格列汀主要聚焦血糖控制；司美格鲁肽（OZEMPIC）另获批 T2DM 伴 CVD 降事件及伴 CKD 降肾进展风险。",
        label: "所引说明书的心肾结局定位",
        values: [
          "兼具成人心力衰竭及进展风险慢性肾病适应症",
          "所引说明书聚焦成人 2 型糖尿病血糖控制，未列心衰或肾病结局",
          "兼具合并确诊心血管病降事件及合并慢性肾病降进展风险适应症",
        ],
      },
      {
        quizId: "distinct-risk",
        quizExplanation: "排糖带来生殖器真菌/尿路感染与酮症酸中毒风险；DPP-4i 与 GLP-1RA 均警惕胰腺炎，后者更伴明显胃肠反应及啮齿类甲状腺 C 细胞瘤黑框警示。",
        label: "特征性风险警示",
        values: [
          "生殖器真菌感染、容量不足及血糖不高时亦可发的酮症酸中毒",
          "急性胰腺炎、严重关节痛及大疱性类天疱疮警示",
          "明显胃肠道反应、急性胰腺炎、视网膜病变加重及 C 细胞瘤黑框警示",
        ],
      },
      {
        label: "低血糖风险对比边界",
        values: [
          "单用低血糖风险通常较低，合用胰岛素或磺脲类时低血糖风险均增加",
          "单用低血糖风险通常较低，合用胰岛素或磺脲类时低血糖风险均增加",
          "单用低血糖风险通常较低，合用胰岛素或磺脲类时低血糖风险均增加",
        ],
      },
      {
        label: "共同适用边界",
        values: [
          "均不用于治疗 1 型糖尿病；具体剂型与人群须核对对应说明书",
          "均不用于治疗 1 型糖尿病；具体剂型与人群须核对对应说明书",
          "均不用于治疗 1 型糖尿病；具体剂型与人群须核对对应说明书",
        ],
      },
    ],
    takeaways: [
      "列净（SGLT2i）让糖从尿走、护心肾；列汀（DPP-4i）护内源肠促胰素、口服用药需调肾量；格鲁肽（GLP-1RA）强效激动受体并抑食欲/胰高血糖素。",
      "「列净」需牢记正常血糖型酮症酸中毒与泌尿生殖感染；「格鲁肽」需关注脱水致肾损、胰腺炎与甲状腺髓样癌/MEN2 禁忌。",
      "三类单用虽较少低血糖，但一旦联用磺脲类或胰岛素均须评估减量防低血糖。",
    ],
    scenarios: [
      "2 型糖尿病合并心力衰竭或慢性肾病时，SGLT2 抑制剂（如恩格列净）常为优先考虑方案。",
      "2 型糖尿病合并确诊动脉粥样硬化性心血管疾病或需强效减重控糖时，常评估 GLP-1 受体激动剂（如司美格鲁肽）。",
    ],
    sources: [
      {
        title: "DailyMed：JARDIANCE（empagliflozin）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=334f1b3d-5670-6685-e063-6294a90a7e47",
        sections: "第 1、5、12.1 节：T2DM/HF/CKD 适应症、SGLT2 机制与酮症酸中毒风险。",
      },
      {
        title: "DailyMed：JANUVIA（sitagliptin）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f85a48d0-0407-4c50-b0fa-7673a160bf01",
        sections: "第 1、2.2、5、12.1 节：DPP-4 抑制、肾功能调量、胰腺炎与关节痛风险。",
      },
      {
        title: "DailyMed：OZEMPIC（semaglutide 皮下注射剂）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=42bdd912-2393-44c4-b7e0-47672ca28991",
        sections: "黑框警告及第 1、5、12.1 节：GLP-1 激动、CVD/CKD 适应症及胃肠/胰腺炎警示。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "vancomycin-vs-linezolid",
    title: "耐药革兰阳性菌抗菌药：万古霉素 vs 利奈唑胺",
    summary: "两药均用于 MRSA 等严重革兰阳性菌感染，但在细胞壁 vs 核糖体靶点、口服生物利用度、VRE 覆盖及器官毒性上各有界线。",
    drugIds: ["vancomycin", "linezolid"],
    rows: [
      {
        quizId: "mechanism",
        quizExplanation: "万古霉素结合肽聚糖前体末端阻碍细胞壁组装；利奈唑胺结合 50S 亚基 23S rRNA，在 70S 起始复合物形成阶段阻断蛋白质合成。",
        label: "分子靶点与抗菌环节",
        values: [
          "结合肽聚糖前体 D-Ala-D-Ala 末端，抑制细菌细胞壁合成",
          "结合细菌 50S 亚基 23S rRNA，阻止 70S 翻译起始复合物形成",
        ],
      },
      {
        quizId: "oral-bioavailability",
        quizExplanation: "万古霉素口服几乎不吸收入血，不能用口服制剂治疗肺炎或菌血症；利奈唑胺口服吸收近乎完全，可与静脉制剂序贯转换用于全身感染。",
        label: "口服吸收与给药途径",
        values: [
          "口服吸收极低，全身感染须静脉给药；口服仅作用于肠腔内感染",
          "口服生物利用度高，口服与静脉制剂均可用于相应全身感染",
        ],
      },
      {
        quizId: "vre-coverage",
        quizExplanation: "两药均可覆盖敏感 MRSA，但对耐万古霉素屎肠球菌（VRE）的活性是关键临床分水岭。",
        label: "耐万古霉素肠球菌（VRE）覆盖",
        values: [
          "覆盖敏感 MRSA，但对耐万古霉素肠球菌（VRE）通常无效",
          "覆盖敏感 MRSA，且可用于耐万古霉素屎肠球菌（VRE）感染",
        ],
      },
      {
        quizId: "toxicity-profile",
        quizExplanation: "万古霉素重点监测肾毒性、耳毒性及输注反应；利奈唑胺则需重点监测血小板减少、长疗程神经病变、乳酸性酸中毒及与促血清素药合用的血清素综合征。",
        label: "典型不良反应与监测重点",
        values: [
          "肾毒性、耳毒性及输注反应（潮红、瘙痒或低血压）",
          "骨髓抑制（血小板减少）、视神经/周围病变及 MAOI 相关血清素综合征",
        ],
      },
      {
        label: "共同抗菌谱边界",
        values: [
          "主要针对革兰阳性菌，不常规覆盖革兰阴性菌",
          "主要针对革兰阳性菌，不常规覆盖革兰阴性菌",
        ],
      },
      {
        label: "共同选药与继发感染提醒",
        values: [
          "需结合感染部位与药敏选用，并警惕艰难梭菌相关腹泻",
          "需结合感染部位与药敏选用，并警惕艰难梭菌相关腹泻",
        ],
      },
    ],
    takeaways: [
      "万古霉素「静注治全身、口服留肠腔」，利奈唑胺「口服生物利用度高、可序贯全身治疗」。",
      "选药时将肾功能（万古霉素肾毒性）与血小板/合用抗抑郁药（利奈唑胺骨髓抑制与 MAOI 作用）对照权衡。",
      "两者均非广谱抗阴性菌药，混合感染须另行联合覆盖革兰阴性菌。",
    ],
    scenarios: [
      "口服治疗肠腔内艰难梭菌感染，或肾功能正常且非 VRE 的重症 MRSA 全身感染，常考虑万古霉素（分途径）。",
      "耐万古霉素屎肠球菌（VRE）感染、肾功能受损需规避万古霉素肾毒性或需口服序贯治疗时，常评估利奈唑胺。",
    ],
    sources: [
      {
        title: "万古霉素说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=06dcfd36-942f-4752-86ad-4c5a6fc3e48f",
        sections: "药理、适应症与不良反应（D-Ala-D-Ala 靶点、口服不吸收特征、肾毒性与输注反应）",
      },
      {
        title: "DailyMed：Linezolid 片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3e0d868d-f419-47e8-a3bc-41ececac468b",
        sections: "第 1、5、7、12.4 节：VRE/MRSA 适应症、70S 起始机制、血小板与视神经及血清素风险。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "gout-acute-vs-chronic",
    title: "痛风急性抗炎 vs 长期降尿酸：秋水仙碱 vs 别嘌醇 vs 非布司他",
    summary: "秋水仙碱控制或预防痛风炎症而不降尿酸；别嘌醇与非布司他均为抑制黄嘌呤氧化酶的长期降尿酸药，但在基因筛查、肝肾消除与心血管警示上不同。",
    drugIds: ["colchicine", "allopurinol", "febuxostat"],
    rows: [
      {
        quizId: "clinical-timing",
        quizExplanation: "痛风急性期需抗炎镇痛（如秋水仙碱），不能靠降尿酸药立即止痛；而别嘌醇与非布司他分别承担一线基础降尿酸与经评估二线降尿酸定位。",
        label: "急性期与长期降尿酸定位",
        values: [
          "抗炎治疗或预防急性痛风发作，不降低血尿酸",
          "长期降尿酸一线基础药，急性发作期不直接止痛",
          "长期降尿酸药（所引美国说明书限别嘌醇疗效不足、不耐受或不宜用者）",
        ],
      },
      {
        quizId: "mechanism-and-clearance",
        quizExplanation: "秋水仙碱作用于微管蛋白限制中性粒细胞；别嘌醇与非布司他虽同抑 XO，但别嘌醇经活性物氧嘌呤醇高度依赖肾脏清除，非布司他为非嘌呤类且以肝代谢为主的多途径消除。",
        label: "靶点机制与消除特点",
        values: [
          "抑制 β-微管蛋白聚合限制中性粒细胞，主要经肝代谢与 P-gp 消除",
          "嘌呤类似物抑制 XO；活性物氧嘌呤醇主要经肾排泄，肾损易蓄积",
          "非嘌呤类抑制 XO；以肝代谢与多途径消除为主，轻中度肾损常无需调量",
        ],
      },
      {
        quizId: "safety-warnings",
        quizExplanation: "三药关键风险各自明确：秋水仙碱忌肝肾损时合用强 CYP3A4/P-gp 抑制剂；别嘌醇警惕 SJS/TEN 及 HLA-B*58:01；非布司他需权衡心血管死亡警示且禁联用硫唑嘌呤/巯嘌呤。",
        label: "特征性安全警示与禁忌",
        values: [
          "治疗窗窄，肝或肾损时禁合用强 CYP3A4 或 P-gp 抑制剂",
          "警惕 SJS/TEN/DRESS，高携带率人群宜先筛查 HLA-B*58:01",
          "合并心血管病者需权衡心血管死亡风险；禁与硫唑嘌呤/巯嘌呤合用",
        ],
      },
      {
        label: "起始降尿酸与发作预防关系",
        values: [
          "常作为开始降尿酸治疗初期的痛风发作预防药",
          "起始治疗时血尿酸波动可诱发发作，常需配合抗炎预防",
          "起始治疗时血尿酸波动同样可诱发发作，常需配合抗炎预防",
        ],
      },
      {
        label: "共同的治疗原则",
        values: [
          "须严格区分“急性抗炎”与“长期降尿酸”，不可将无症状高尿酸血症一概强行用药",
          "须严格区分“急性抗炎”与“长期降尿酸”，不可将无症状高尿酸血症一概强行用药",
          "须严格区分“急性抗炎”与“长期降尿酸”，不可将无症状高尿酸血症一概强行用药",
        ],
      },
    ],
    takeaways: [
      "秋水仙碱管「痛风炎症」不管「尿酸水平」，别嘌醇与非布司他管「减少尿酸生成」而不直接止痛。",
      "启动降尿酸药初期反而容易诱发痛风急性发作，指南建议低剂量起始并配合小剂量秋水仙碱等抗炎预防。",
      "三者同用或换用前必核查肾功能、HLA-B*58:01（别嘌醇高危人群）、心血管病史（非布司他）及强 CYP3A4/P-gp 抑制剂（秋水仙碱）。",
    ],
    scenarios: [
      "急性痛风发作早期止痛或启动降尿酸时的发作预防，可选用小剂量秋水仙碱。",
      "痛风患者长期降尿酸首选别嘌醇；若 HLA-B*58:01 阳性、不耐受或达标不足，再评估换用非布司他。",
    ],
    sources: [
      {
        title: "DailyMed：Colchicine 片说明书",
        url: "https://www.dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=5e5d9488-d9d0-4b37-b535-941d66c3430d&type=display",
        sections: "第 1、4、5、7、12.1 节：微管机制、不降尿酸及肝肾损合用强 CYP3A4/P-gp 抑制剂禁忌。",
      },
      {
        title: "DailyMed：Allopurinol 片说明书",
        url: "https://www.dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=bdbf5ad4-86f2-4e9c-a51a-fb0c7220c480",
        sections: "第 1、2、5、12.1、12.5 节：XO 抑制、肾功能调量与 HLA-B*58:01 皮肤反应。",
      },
      {
        title: "DailyMed：Febuxostat 片说明书",
        url: "https://www.dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=41a95424-046e-413b-a121-cd7335e67135",
        sections: "黑框警告与第 1、4、5、12.1～12.3 节：适用条件、肝消除为主、心血管警示与硫唑嘌呤禁忌。",
      },
      {
        title: "ACR · 2020 痛风管理指南",
        url: "https://onlinelibrary.wiley.com/doi/10.1002/acr.24180",
        sections: "别嘌醇一线地位、HLA-B*58:01 筛查及降尿酸起始抗炎预防建议。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "ssri-vs-snri-escitalopram-duloxetine",
    title: "SSRI vs SNRI：艾司西酞普兰 vs 度洛西汀",
    summary: "艾司西酞普兰高选择性抑制 5-HT 再摄取，度洛西汀同时抑制 5-HT 与去甲肾上腺素再摄取，后者除情绪障碍外还兼具特定神经病理性疼痛用途。",
    drugIds: ["escitalopram", "duloxetine"],
    rows: [
      {
        quizId: "reuptake-target",
        quizExplanation: "SSRI 的核心特征是高选择性阻断 5-HT 转运体；SNRI 则在此基础上增加了对去甲肾上腺素（NE）再摄取的抑制，与中枢疼痛下行调控有关。",
        label: "单胺再摄取抑制谱",
        values: [
          "选择性抑制 5-HT 转运体，主要增强血清素能传递（SSRI）",
          "同时抑制 5-HT 与去甲肾上腺素再摄取（SNRI）",
        ],
      },
      {
        quizId: "pain-indication",
        quizExplanation: "度洛西汀因兼具 5-HT 与 NE 双重调节而获批糖尿病周围神经病理性疼痛等用途；艾司西酞普兰聚焦抑郁及焦虑谱系障碍。",
        label: "神经病理性疼痛适应症差异",
        values: [
          "所引说明书聚焦抑郁、焦虑、惊恐与强迫症，无典型神经痛适应症",
          "除抑郁与广泛性焦虑外，另获批成人糖尿病周围神经病理性疼痛",
        ],
      },
      {
        quizId: "organ-and-cardiac-risk",
        quizExplanation: "艾司西酞普兰较突出剂量相关的 QT 间期延长禁忌；度洛西汀需重点警惕肝损伤（慢性肝病或大量饮酒避免）及 NE 相关的血压变化。",
        label: "各自突出的心电或脏器警示",
        values: [
          "需重点关注剂量相关 QT 间期延长及心律失常合并用药禁忌",
          "需重点关注肝损伤（慢性肝病或大量饮酒者避免）及血压升高",
        ],
      },
      {
        label: "共同的机制与起效边界",
        values: [
          "临床情绪改善常需持续数周评估；人类精确治疗链仍有未明环节",
          "临床情绪或疼痛改善常需持续评估；人类精确治疗链仍有未明环节",
        ],
      },
      {
        label: "共同的重要安全边界",
        values: [
          "均禁与 MAOI 同用，均需监测自杀意念并避免突然停药引发撤药反应",
          "均禁与 MAOI 同用，均需监测自杀意念并避免突然停药引发撤药反应",
        ],
      },
    ],
    takeaways: [
      "区分「SSRI 单管 5-HT」与「SNRI 双管 5-HT + NE」：后者常把情绪管理与糖尿病神经痛等联系起来。",
      "艾司西酞普兰记「QT 延长边界」，度洛西汀记「肝脏警示与血压监测」；两者都不可与 MAOI 联用。",
      "度洛西汀的止痛不是靠抑制 COX 或直接消炎，也不能代替糖尿病本身的血糖管理。",
    ],
    scenarios: [
      "成人重性抑郁、广泛性焦虑、惊恐或强迫症（无 QT 延长风险时），常评估艾司西酞普兰。",
      "抑郁或焦虑合并糖尿病周围神经病理性疼痛（无慢性肝病或大量饮酒史时），常评估度洛西汀。",
    ],
    sources: [
      {
        title: "emc：Escitalopram 片产品说明书",
        url: "https://www.medicines.org.uk/emc/product/15007/smpc",
        sections: "第 4.1～4.5、4.8、5.1 节：SSRI 机制、抑郁/焦虑/强迫症用途、QT 延长禁忌及撤药症状。",
      },
      {
        title: "DailyMed：CYMBALTA（度洛西汀）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2f7d4d67-10c1-4bf4-a7f2-c185fbad64ba",
        sections: "黑框警告与第 1、4～6、12.1 节：SNRI 机制、糖尿病神经痛、肝损伤、血压及 MAOI 风险。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "ppi-vs-h2ra-pantoprazole-famotidine",
    title: "抑酸药对照：泮托拉唑 vs 法莫替丁",
    summary: "质子泵抑制剂（PPI）阻断胃酸分泌的末端酶且无快速耐受；H2 受体拮抗剂（H2RA）单剂起效较快但连续使用易产生快速耐受性。",
    drugIds: ["pantoprazole", "famotidine"],
    rows: [
      {
        quizId: "target",
        quizExplanation: "泮托拉唑在胃壁细胞分泌小管的酸性环境中活化，不可逆抑制末端质子泵；法莫替丁可逆竞争性阻断基底外侧膜的组胺 H2 受体。",
        label: "抑酸靶点与结合方式",
        values: [
          "酸性环境活化后不可逆抑制胃壁细胞 H+/K+-ATP 酶（质子泵）",
          "竞争性可逆阻断胃壁细胞组胺 H2 受体",
        ],
      },
      {
        quizId: "pathway-breadth",
        quizExplanation: "组胺、乙酰胆碱与胃泌素三条促酸通路最终都要汇合到质子泵，因此 PPI 抑酸更彻底，而 H2RA 仅阻断组胺单条通路。",
        label: "对多种促酸刺激的覆盖范围",
        values: [
          "阻断末端共同泵，同时抑制组胺、乙酰胆碱和胃泌素相关酸分泌",
          "主要阻断组胺促酸通路，其他促酸途径仍可部分代偿",
        ],
      },
      {
        quizId: "onset-and-tachyphylaxis",
        quizExplanation: "法莫替丁单次服药起效较快（约 1 小时内），适合按需缓解；但连续规律使用数日可因代偿出现快速耐受。泮托拉唑需连续数日达稳态最大抑酸，且无快速耐受。",
        label: "达最大抑酸速度与耐受性（快速减敏）",
        values: [
          "需连续每日给药数日达稳态最大抑酸，不产生快速耐受性",
          "单剂起效较快，但连续每日给药数日易产生快速耐受性（疗效衰减）",
        ],
      },
      {
        quizId: "distinct-risk",
        quizExplanation: "长期应用 PPI 需留意低镁、B12 吸收下降、肠道感染及间质性肾炎；法莫替丁主要经肾排泄，肾功能不全时尤需警惕谵妄/意识混乱及 QT 延长。",
        label: "不良反应与肾功能重点",
        values: [
          "长期用关注低镁血症、维生素 B12 减少、肠道感染与间质性肾炎",
          "中重度肾功能不全需调量，并警惕老年人意识混乱及 QT 延长",
        ],
      },
      {
        label: "共同的药理分类误区",
        values: [
          "均为抑制胃酸分泌药，而非直接中和胃腔现有胃酸的碱式抗酸剂",
          "均为抑制胃酸分泌药，而非直接中和胃腔现有胃酸的碱式抗酸剂",
        ],
      },
      {
        label: "共同的报警症状边界",
        values: [
          "症状好转均不能排除胃部恶性病变，伴报警症状需及时内镜等检查",
          "症状好转均不能排除胃部恶性病变，伴报警症状需及时内镜等检查",
        ],
      },
    ],
    takeaways: [
      "PPI 关「末端总闸（质子泵）」、抑酸强且无快速耐受；H2RA 拦「组胺支路」、单剂起效快但连续用易快速耐受。",
      "两药都不像铝碳酸镁那样瞬间中和已分泌的胃酸，按需或长期控制策略各不相同。",
      "中重度肾功能下降者用传统法莫替丁需调量防中枢与 QT 风险；长期使用泮托拉唑应定期评估停减指征。",
    ],
    scenarios: [
      "反流性食管炎愈合维持或高危 NSAID 溃疡预防需持续强效抑酸时，常选用泮托拉唑。",
      "轻症按需缓解或需避免 PPI 特定相互作用/长期风险时，常短程或按需评估法莫替丁（注意肾功能）。",
    ],
    sources: [
      {
        title: "emc：Pantoprazole 20 mg 肠溶片说明书",
        url: "https://www.medicines.org.uk/emc/product/450/smpc",
        sections: "第 4.1～4.5、4.8、5.1 节：质子泵不可逆抑制、酸活化、反流与长期用药风险。",
      },
      {
        title: "DailyMed：Famotidine 片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=54d93bf1-8f9a-981b-e063-6394a90a0fde&version=1",
        sections: "第 1、2.2、5～6、8.6、12.1 节：H2 阻断机制、肾功能调整、中枢反应与 QT 风险。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "hbv-entecavir-vs-tdf",
    title: "慢乙肝一线口服抗病毒：恩替卡韦 vs TDF",
    summary: "两药均为慢乙肝高耐药屏障一线核苷（酸）类似物，但在拉米夫定交叉耐药、妊娠期安全性及肾骨长期安全性上各自取舍明确。",
    drugIds: ["entecavir", "tenofovir-disoproxil"],
    rows: [
      {
        quizId: "class-and-activation",
        quizExplanation: "恩替卡韦为鸟嘌呤核苷类似物，细胞内三磷酸化；TDF 为腺苷酸核苷酸前药，水解后再细胞内二磷酸化并终止病毒 DNA 链。",
        label: "结构类别与活化形式",
        values: [
          "鸟嘌呤核苷类似物，细胞内磷酸化为三磷酸恩替卡韦",
          "腺苷酸核苷酸前药，水解后磷酸化为替诺福韦二磷酸（链终止）",
        ],
      },
      {
        quizId: "lamivudine-resistance",
        quizExplanation: "恩替卡韦与拉米夫定共享部分耐药突变位点（如 rtM204V/I），既往拉米夫定耐药会显著削弱恩替卡韦耐药屏障；TDF 对拉米夫定耐药株仍有效。",
        label: "既往拉米夫定耐药影响",
        values: [
          "与拉米夫定存在部分交叉耐药通路，既往拉米夫定耐药者屏障下降",
          "对拉米夫定耐药 HBV 株仍保持强效活性，常为经治耐药优选",
        ],
      },
      {
        quizId: "pregnancy-positioning",
        quizExplanation: "WHO 2024 乙肝指南明确将 TDF 作为妊娠期乙肝治疗及高病毒载量母婴阻断的首选方案；恩替卡韦因动物致畸信号不推荐用于妊娠期。",
        label: "妊娠期乙肝管理定位",
        values: [
          "动物研究提示潜在发育毒性信号，指南不推荐用于妊娠期",
          "妊娠安全性证据充分，WHO 2024 指南首选用于孕妇及母婴阻断",
        ],
      },
      {
        quizId: "renal-and-bone",
        quizExplanation: "TDF 长期使用需监测近端肾小管病变（Fanconi 综合征）及骨密度下降；恩替卡韦对肾骨影响相对较小，适合基线肾骨风险较高者（仍须按肾功能调量）。",
        label: "肾脏与骨骼安全性侧重",
        values: [
          "肾小管与骨密度影响相对较小；肾功能减退时仍须按指标调整间隔",
          "可致近端肾小管损伤（Fanconi 综合征）及骨密度下降，需定期监测",
        ],
      },
      {
        label: "共同停药与肝炎加重风险",
        values: [
          "均主要抑制病毒复制，擅自停药均可诱发严重急性乙型肝炎加重",
          "均主要抑制病毒复制，擅自停药均可诱发严重急性乙型肝炎加重",
        ],
      },
      {
        label: "共同合并 HIV 边界",
        values: [
          "均须先排查 HIV 感染；未经有效联合抗 HIV 治疗而单用可诱发 HIV 耐药",
          "均须先排查 HIV 感染；未经有效联合抗 HIV 治疗而单用可诱发 HIV 耐药",
        ],
      },
    ],
    takeaways: [
      "初治非妊娠且伴有肾损或骨质疏松风险时常偏向恩替卡韦；妊娠期或既往拉米夫定耐药时常偏向 TDF。",
      "两者虽耐药屏障均高，但绝对不可自行停药，停药后均可能出现严重肝炎反跳加重。",
      "启动任一药物前均应确认 HIV 状态，避免单药暴露导致 HIV 耐药筛选。",
    ],
    scenarios: [
      "高病毒载量妊娠期乙肝母婴阻断或既往拉米夫定经治耐药患者，常首选富马酸替诺福韦二吡呋酯（TDF）。",
      "存在基础肾功能减退风险、骨密度低下且无拉米夫定耐药史的成人非妊娠患者，常评估恩替卡韦。",
    ],
    sources: [
      {
        title: "DailyMed：BARACLUDE（entecavir）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=046e61c9-9298-4b2e-b76e-b26b81fecd20",
        sections: "黑框警告及第 1、2.4、5、12.4 节：拉米夫定耐药交叉、三磷酸活化、停药加重及 HIV 风险。",
      },
      {
        title: "DailyMed：VIREAD（TDF）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=33fd6418-fbdc-42ca-a50d-ce2a476a5418",
        sections: "黑框警告及第 1、5～6、12.4 节：DNA 链终止、肾小管与骨密度风险及停药加重。",
      },
      {
        title: "WHO · 慢性乙型肝炎预防、诊断、护理与治疗指南（2024）",
        url: "https://www.who.int/publications/i/item/9789240090903",
        sections: "一线口服抗病毒药选择、妊娠期 TDF 预防母婴传播及肾骨安全性评估。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "amiodarone-vs-diltiazem-vs-adenosine",
    title: "抗心律失常与室上速控制：胺碘酮 vs 地尔硫䓬 vs 腺苷",
    summary: "三药均涉及心脏电生理与传导调控，但在多通道作用、房室结瞬时阻断、给药时机及器官毒性谱上差异悬殊。",
    drugIds: ["amiodarone", "diltiazem", "adenosine"],
    rows: [
      {
        quizId: "electrophysiology-target",
        quizExplanation: "胺碘酮以阻滞钾通道延长复极为主并兼有钠、钙阻滞及抗交感作用；地尔硫䓬选择性阻滞心肌与血管 L 型钙通道；腺苷激活腺苷受体短暂抑制房室结传导以打断折返。",
        label: "主要电生理靶点与分类定位",
        values: [
          "Ⅲ 类为主兼多通道阻滞（钾、钠、钙通道及抗交感），显著延长不应期",
          "Ⅳ 类非二氢吡啶钙通道阻滞剂，抑制 L 型钙通道并减慢房室结传导",
          "内源性嘌呤核苷，激动腺苷受体短暂阻断房室结传导",
        ],
      },
      {
        quizId: "onset-and-half-life",
        quizExplanation: "腺苷在血液中数秒内被红细胞和内皮细胞摄取代谢，适合院内快速弹丸静脉转复；胺碘酮高度脂溶、分布容积大、清除极慢，相互作用可持续数周至数月。",
        label: "作用持续时间与药代特征",
        values: [
          "组织分布广、清除极慢（口服片清除半衰期长达数周），停药后仍长期蓄积",
          "常规口服缓释片用于慢性控制，主要经肝代谢并受 CYP3A4 影响",
          "血中半衰期极短（体外不足 10 秒），需快速静脉推注且效应瞬时消退",
        ],
      },
      {
        quizId: "clinical-role",
        quizExplanation: "胺碘酮（所引口服片说明书）定位反复危及生命的室颤及血流动力学不稳定室速；地尔硫䓬缓释片用于高血压与慢性稳定型心绞痛；腺苷静脉用于依赖房室结折返的阵发性室上速快速转复。",
        label: "所引制剂的核心临床定位",
        values: [
          "其他治疗无效或不能耐受的反复危及生命室颤或不稳定室速",
          "高血压及慢性稳定型心绞痛的长期控制（所引口服缓释片）",
          "依赖房室结传导的阵发性室上性心动过速院内快速转复（静脉）",
        ],
      },
      {
        quizId: "distinct-risk-and-interaction",
        quizExplanation: "胺碘酮独有肺纤维化、甲状腺及角膜/肝多器官慢性毒性；地尔硫䓬主要禁忌/慎用于失代偿心衰、病窦或重度传导阻滞；腺苷可诱发短暂支气管痉挛并受茶碱拮抗、双嘧达莫增强。",
        label: "特征性风险与关键相互作用",
        values: [
          "肺毒性（肺炎/肺纤维化）、甲功异常、肝损、角膜沉积及 QT 延长",
          "心室功能受损者加重心衰、外周水肿；抑制 CYP3A4 并可致传导阻滞",
          "短暂潮红胸闷、支气管痉挛（哮喘等禁忌）；茶碱拮抗而双嘧达莫增强效应",
        ],
      },
      {
        label: "共同的传导系统警示",
        values: [
          "均可能引起心动过缓或房室传导阻滞，用药前需评估基础心律与传导状态",
          "均可能引起心动过缓或房室传导阻滞，用药前需评估基础心律与传导状态",
          "均可能引起心动过缓或房室传导阻滞，用药前需评估基础心律与传导状态",
        ],
      },
    ],
    takeaways: [
      "记「时间尺度与作用部位」：腺苷论秒救急、专断房室结折返；地尔硫䓬阻钙减率兼扩管；胺碘酮广谱多通道但清除极慢。",
      "胺碘酮的肺、肝、甲状腺长期监测是学习重点，且停药后仍需继续警惕 CYP 与 P-gp 相互作用。",
      "支气管痉挛性气道疾病患者禁用腺苷；心衰伴明显左室收缩功能减退者慎用/避免非二氢吡啶类地尔硫䓬。",
    ],
    scenarios: [
      "院内急诊需快速打断依赖房室结折返的阵发性室上性心动过速（无气道痉挛禁忌与重度低血压）时，常静脉推注腺苷。",
      "高血压或慢性稳定型心绞痛需控制心室率且无左室收缩功能衰竭时，常评估缓释地尔硫䓬；反复危及生命室性心律失常则在充分监护下评估胺碘酮。",
    ],
    sources: [
      {
        title: "DailyMed：Amiodarone hydrochloride 片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=f4532f12-3b7a-42ab-9a6c-36fd2a3f192c",
        sections: "黑框警告及第 1、5、7、12.1～12.3 节：室颤/室速用途、多通道作用、超长半衰期与器官毒性。",
      },
      {
        title: "DailyMed：Diltiazem hydrochloride 缓释片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=73b3607a-99d0-44d8-92ef-0074684c9d7d",
        sections: "第 1、4～6、12.1～12.2 节：L 型钙通道阻滞、高血压与心绞痛用途及心衰传导风险。",
      },
      {
        title: "emc：Adenosine 注射液产品说明书",
        url: "https://www.medicines.org.uk/emc/product/4766/smpc",
        sections: "第 4.1～4.5、4.8、5.1～5.2 节：阵发性室上速、不足 10 秒半衰期、支气管痉挛禁忌及茶碱/双嘧达莫相互作用。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "metoprolol-vs-bisoprolol",
    title: "选择性 β1 阻滞剂对照：美托洛尔 vs 比索洛尔",
    summary: "两药均为临床常用的相对选择性 β1 受体阻滞剂，但在肝肾消除途径、CYP2D6 依赖度、半衰期及具体制剂适应症细节上有别。",
    drugIds: ["metoprolol", "bisoprolol"],
    rows: [
      {
        quizId: "elimination-and-cyp2d6",
        quizExplanation: "美托洛尔高度依赖肝脏 CYP2D6 生物转化，慢代谢者或联用 CYP2D6 抑制剂时暴露明显升高且 β1 选择性可下降；比索洛尔约半数经肾原形排泄、半数经肝代谢，较少受 CYP2D6 多态性影响。",
        label: "消除途径与 CYP2D6 依赖性",
        values: [
          "主要经肝脏 CYP2D6 代谢消除，受基因多态性与 CYP2D6 抑制剂影响显著",
          "肝代谢与肾原形排泄约各占 50%（均衡双通道消除），极少依赖 CYP2D6",
        ],
      },
      {
        quizId: "half-life-and-dosing",
        quizExplanation: "美托洛尔常规酒石酸盐平片血浆半衰期较短（约 3～7 小时），常需每日分次服药或改用琥珀酸盐缓释片；比索洛尔半衰期约 10～11 小时，常规每日一次口服即可维持稳定谷浓度。",
        label: "血浆半衰期与常规口服制剂特征",
        values: [
          "酒石酸盐常规片半衰期约 3～7 小时，常每日多次；缓释用途需另认琥珀酸盐制剂",
          "血浆半衰期约 10～11 小时，常规片即可每日一次给药",
        ],
      },
      {
        quizId: "organ-impairment-and-indications",
        quizExplanation: "肝功能损害会明显延长美托洛尔清除，而肾衰影响相对小；比索洛尔在单一肝或肾功能障碍时有另一途径代偿（仅重度肝/肾损需限低最大剂量），且所引片剂直接涵盖稳定慢性收缩性心衰。",
        label: "肝肾功能影响与所引片剂心衰标注",
        values: [
          "肝损时清除下降需谨慎；所引酒石酸盐说明书未直接用于慢性心衰（须另用缓释琥珀酸盐）",
          "单侧肝或肾损可部分代偿，仅重度肝肾损需调限；所引片剂直接标注稳定慢性收缩性心衰",
        ],
      },
      {
        label: "共同的受体选择性边界",
        values: [
          "β1 选择性均为相对性，高剂量或敏感气道疾病者仍可能诱发支气管痉挛",
          "β1 选择性均为相对性，高剂量或敏感气道疾病者仍可能诱发支气管痉挛",
        ],
      },
      {
        label: "共同的心血管安全提醒",
        values: [
          "均不可骤停（防反跳性心绞痛/事件），均可掩盖低血糖心动过速表现并需监测心动过缓",
          "均不可骤停（防反跳性心绞痛/事件），均可掩盖低血糖心动过速表现并需监测心动过缓",
        ],
      },
    ],
    takeaways: [
      "两药同属选择性 β1 阻滞剂，但美托洛尔走「肝 CYP2D6 单主线」，比索洛尔走「肝肾 50:50 双通道」。",
      "区分盐型与剂型：美托洛尔酒石酸盐与琥珀酸盐缓释片在给药频次与慢性心衰循证适应症上不能混为一谈。",
      "所谓「心脏选择性」并非绝对，支气管哮喘/COPD 患者及伴随低血糖风险者仍须严密观察。",
    ],
    scenarios: [
      "合并重度肝功能受损或同时使用强效 CYP2D6 抑制剂（如部分抗抑郁药或抗心律失常药）且需每日一次稳定阻断 β1 时，常评估比索洛尔。",
      "高血压、稳定型心绞痛或特定急性心肌梗死后稳定期需灵活滴定短效 β 阻滞时，常先评估酒石酸美托洛尔；慢性 HFrEF 长期管理则需对应核对琥珀酸美托洛尔缓释片或比索洛尔。",
    ],
    sources: [
      {
        title: "美托洛尔说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c0e147a8-36a6-1e61-e053-2a95a90afd62",
        sections: "第 4、5.1、6.1、12.1～12.3 节：β1 选择性、CYP2D6 代谢、半衰期及酒石酸盐适应症。",
      },
      {
        title: "emc：Bisoprolol 片产品说明书",
        url: "https://www.medicines.org.uk/emc/product/3090/smpc",
        sections: "第 4.1～4.4、4.8、5.1～5.2 节：高血压/心绞痛/慢性心衰用途、肝肾均衡清除及 10～11 小时半衰期。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "oral-glucose-acarbose-pioglitazone-repaglinide",
    title: "餐后、增敏与餐时促泌：阿卡波糖 vs 吡格列酮 vs 瑞格列奈",
    summary: "三药分别从延缓肠道碳水化合物吸收、核受体增敏及关闭 β 细胞钾通道快速促泌三条完全不同的路径降糖，低血糖救援与脏器禁忌亦各自独立。",
    drugIds: ["acarbose", "pioglitazone", "repaglinide"],
    rows: [
      {
        quizId: "mechanism",
        quizExplanation: "阿卡波糖在肠腔局部抑制刷状缘 α-葡萄糖苷酶与胰 α-淀粉酶；吡格列酮激动核受体 PPARγ 改善脂肪/肌肉胰岛素抵抗；瑞格列奈关闭胰岛 β 细胞 K_ATP 通道直接刺激胰岛素释放。",
        label: "核心靶点与降糖机制",
        values: [
          "抑制小肠刷状缘 α-葡萄糖苷酶与胰 α-淀粉酶，延缓双糖/多糖分解吸收",
          "激动核受体 PPARγ，调控基因转录以提高外周靶组织胰岛素敏感性",
          "快速结合并关闭胰岛 β 细胞 ATP 敏感性钾通道，促进餐时胰岛素分泌",
        ],
      },
      {
        quizId: "meal-timing-and-onset",
        quizExplanation: "阿卡波糖随第一口含碳水主食嚼服主控餐后峰；瑞格列奈快进快出须在进餐前服药且「不吃饭不服药」；吡格列酮通过核转录重塑发挥增敏效应，常需数周方现充分降糖效果。",
        label: "餐次关联与起效特征",
        values: [
          "随第一口主食服用，直接削平餐后血糖高峰，依赖膳食碳水化合物",
          "每日一次口服与餐次绑定较弱，通过核基因调控通常数周后逐步显效",
          "餐前即刻服用、作用短促；漏餐时必须跳过该次服药以防低血糖",
        ],
      },
      {
        quizId: "hypoglycemia-and-rescue",
        quizExplanation: "阿卡波糖单用罕见低血糖，但若联用胰岛素/磺脲发生低血糖时，因蔗糖分解受阻必须口服葡萄糖（右旋糖）而非蔗糖；瑞格列奈作为促泌剂本身可直接致低血糖；吡格列酮单用低血糖较少。",
        label: "低血糖风险与特殊急救要求",
        values: [
          "单用通常不致低血糖；若联用药物发生低血糖，须补葡萄糖而非普通蔗糖",
          "单用低血糖风险较低；与胰岛素或促泌剂合用时风险升高",
          "直接促胰岛素分泌，低血糖风险较明显，尤其进食不足或漏餐时",
        ],
      },
      {
        quizId: "organ-warnings-and-ddi",
        quizExplanation: "阿卡波糖未消化碳水进结肠发酵导致腹胀排气，肠梗阻/IBD 禁用；吡格列酮引起水钠潴留并带 NYHA Ⅲ～Ⅳ级心衰黑框禁忌及骨折/膀胱癌警示；瑞格列奈禁与吉非贝齐联用且避免联用氯吡格雷。",
        label: "特征性不良反应与重要禁忌",
        values: [
          "腹胀、排气增多及腹泻；禁用于肠梗阻、炎症性肠病及慢性肠吸收障碍",
          "液体潴留/水肿、骨折与膀胱癌警示；NYHA Ⅲ～Ⅳ级心衰禁忌启动",
          "体重增加；禁与吉非贝齐合用，应避免与氯吡格雷合用（防暴露激增致低血糖）",
        ],
      },
      {
        label: "共同的疾病定位边界",
        values: [
          "均适用于成人 2 型糖尿病配合饮食运动控糖，不可用于 1 型糖尿病或酮症酸中毒",
          "均适用于成人 2 型糖尿病配合饮食运动控糖，不可用于 1 型糖尿病或酮症酸中毒",
          "均适用于成人 2 型糖尿病配合饮食运动控糖，不可用于 1 型糖尿病或酮症酸中毒",
        ],
      },
    ],
    takeaways: [
      "阿卡波糖「卡在肠道消化酶」，联用发生低血糖只能用葡萄糖急救，蔗糖（白糖）来不及分解。",
      "瑞格列奈「按餐给药、漏餐停服」，严禁联用吉非贝齐并避开氯吡格雷。",
      "吡格列酮「改转录、慢增敏」，重在排查心力衰竭水钠潴留与骨质疏松/膀胱肿瘤风险。",
    ],
    scenarios: [
      "以碳水化合物饮食为主、餐后血糖升高突出且需避免单药低血糖风险时，常考虑阿卡波糖。",
      "进餐时间不规律的 2 型糖尿病患者需餐时灵活促泌时，常评估瑞格列奈（遵医嘱「有餐服、无餐停」）；显著胰岛素抵抗且无心衰/水肿风险时可评估吡格列酮。",
    ],
    sources: [
      {
        title: "DailyMed：Acarbose 片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=067c0adc-7322-489d-9baa-1d061b37be36",
        sections: "临床药理、适应症、禁忌、注意事项与不良反应：消化酶抑制、肠梗阻禁忌与葡萄糖/蔗糖急救区别。",
      },
      {
        title: "DailyMed：Pioglitazone 片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=a0846e3e-68b2-fd55-e053-2995a90a673e",
        sections: "黑框警告及第 1、4～6、12.1 节：PPARγ 机制、NYHA Ⅲ～Ⅳ级心衰禁忌与骨折/膀胱风险。",
      },
      {
        title: "DailyMed：Repaglinide 片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=cb995e92-295e-4638-a064-978211f5afe1",
        sections: "第 1～2、4～7、12.1 节：β 细胞钾通道关闭、漏餐跳过原则及吉非贝齐/氯吡格雷相互作用。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "dexamethasone-vs-prednisolone",
    title: "全身糖皮质激素对照：地塞米松 vs 泼尼松龙",
    summary: "两药均通过糖皮质激素受体调节基因转录抗炎免疫，但在生物作用时程、抗炎等效价及水钠潴留（盐皮质激素活性）上取舍不同。",
    drugIds: ["dexamethasone", "prednisolone"],
    rows: [
      {
        quizId: "duration-and-potency",
        quizExplanation: "地塞米松属于长效糖皮质激素（生物半衰期约 36～54 小时，抗炎等效价约为泼尼松龙的 7 倍左右）；泼尼松龙为中效糖皮质激素（生物半衰期约 12～36 小时），方便每日或隔日调量。",
        label: "生物半衰期分类与抗炎效力",
        values: [
          "长效糖皮质激素（生物半衰期约 36～54 小时），抗炎效力强（约泼尼松龙 7 倍）",
          "中效糖皮质激素（生物半衰期约 12～36 小时），临床多用于常规抗炎与免疫调节",
        ],
      },
      {
        quizId: "mineralocorticoid-activity",
        quizExplanation: "地塞米松几乎不具盐皮质激素活性，较少引起钠水潴留，但也正因如此不可单用于肾上腺皮质功能减退的盐皮质激素替代；泼尼松龙保留轻中度盐皮质激素活性。",
        label: "盐皮质激素（水钠潴留）活性",
        values: [
          "盐皮质激素活性极微，钠水潴留倾向极低（不适合单用替代原发肾上腺不足）",
          "保留轻至中度盐皮质激素活性，较需留意体液潴留、水肿与血压升高",
        ],
      },
      {
        quizId: "clinical-preference",
        quizExplanation: "地塞米松凭借强效长效且几乎无水钠潴留的特性，常见于脑水肿（不加重水肿）或特定严重炎症；泼尼松龙为中效活性体（无需经肝羟基化活化，异于泼尼松），常用于风湿免疫与哮喘急性期。",
        label: "代表性临床场景侧重",
        values: [
          "常用于肿瘤相关脑水肿、严重过敏炎症及需极少水钠潴留的高效抑制场景",
          "活性代谢物本身（不依赖肝转换），常用于自身免疫病、炎症性肠病及哮喘急性期",
        ],
      },
      {
        label: "共同的代谢与感染风险",
        values: [
          "均可升高血糖、增加骨质疏松与感染风险并掩盖发热等感染警示表现",
          "均可升高血糖、增加骨质疏松与感染风险并掩盖发热等感染警示表现",
        ],
      },
      {
        label: "共同的 HPA 轴与减停要求",
        values: [
          "长期或大剂量使用均可抑制下丘脑-垂体-肾上腺轴，不可自行骤停",
          "长期或大剂量使用均可抑制下丘脑-垂体-肾上腺轴，不可自行骤停",
        ],
      },
    ],
    takeaways: [
      "记「长效无盐」vs「中效有微盐」：地塞米松长效强力抗炎且几乎不蓄水；泼尼松龙中效便于按疗程逐渐减量。",
      "泼尼松龙本身即是活性形式，肝功能受损患者往往较泼尼松（需经肝转化为泼尼松龙）更受考虑。",
      "两者长期用药都会压抑自身肾上腺轴、升血糖、诱发骨质疏松并掩盖感染症状，减停必须遵医嘱评估。",
    ],
    scenarios: [
      "肿瘤相关脑水肿或需强效、极少水钠潴留的短程抗炎控制时，常评估地塞米松。",
      "系统性红斑狼疮、炎症性肠病或重度哮喘急性期需全身中效抗炎及逐步减量管理时，常评估泼尼松龙。",
    ],
    sources: [
      {
        title: "地塞米松口服片说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/15864/smpc",
        sections: "第 4.1、4.4、4.8、5.1～5.2 节：长效生物半衰期、极微盐皮质活性、脑水肿及 HPA 轴风险。",
      },
      {
        title: "emc：Prednisolone 口服片说明书",
        url: "https://www.medicines.org.uk/emc/product/14314/smpc",
        sections: "第 4.1～4.4、4.8、5.1 节：中效全身抗炎免疫用途、体液潴留与血压风险及减停药评估。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "doxycycline-vs-clindamycin",
    title: "抑菌核糖体药物对照：多西环素 vs 克林霉素",
    summary: "两药均通过结合细菌核糖体抑制蛋白质合成，但分别作用于 30S 与 50S 亚基，从而划出「非典型/立克次体」与「厌氧菌/革兰阳性球菌」两条核心覆盖线。",
    drugIds: ["doxycycline", "clindamycin"],
    rows: [
      {
        quizId: "ribosomal-subunit",
        quizExplanation: "四环素类（多西环素）靶向细菌核糖体 30S 亚基阻止氨酰-tRNA 结合；林可酰胺类（克林霉素）靶向 50S 亚基 23S rRNA 阻碍肽链延伸（与大环内酯存在结合位点重叠）。",
        label: "核糖体结合亚基与药物类别",
        values: [
          "四环素类，可逆结合细菌核糖体 30S 亚基抑制蛋白质合成",
          "林可酰胺类，结合细菌核糖体 50S 亚基（23S rRNA）抑制蛋白质合成",
        ],
      },
      {
        quizId: "spectrum-focus",
        quizExplanation: "多西环素对支原体、衣原体、立克次体等胞内/非典型病原体极具价值；克林霉素突出覆盖革兰阳性球菌（如青霉素过敏者替代）及包括脆弱拟杆菌在内的多种厌氧菌。",
        label: "核心抗菌谱与病原体侧重",
        values: [
          "突出覆盖支原体、衣原体、立克次体等非典型或胞内病原体及部分常见菌",
          "突出覆盖敏感厌氧菌及革兰阳性球菌（链球菌、葡萄球菌），无典型抗非典型菌定位",
        ],
      },
      {
        quizId: "distinct-risk",
        quizExplanation: "多西环素重点防光敏反应、发育期牙齿永久着色及仰卧服药致食管溃疡；克林霉素携带黑框警告，发生严重甚至致命性艰难梭菌相关性腹泻/结肠炎的风险相对更突出。",
        label: "各自突出的不良反应与警示",
        values: [
          "光敏反应、牙釉质发育期着色风险，以及片剂/胶囊滞留食管致溃疡",
          "艰难梭菌相关腹泻/伪膜性肠炎风险突出（带黑框警告）",
        ],
      },
      {
        label: "共同的食管刺激服药提醒",
        values: [
          "均可能引起食管炎或食管溃疡，口服宜用足量水直立送服，避免睡前立即躺服",
          "均可能引起食管炎或食管溃疡，口服宜用足量水直立送服，避免睡前立即躺服",
        ],
      },
      {
        label: "共同的合理用药边界",
        values: [
          "均主要为抑菌药且存在耐药演变，需依据病原学或指南规范使用并完成疗程",
          "均主要为抑菌药且存在耐药演变，需依据病原学或指南规范使用并完成疗程",
        ],
      },
    ],
    takeaways: [
      "记「30S 非典型、50S 厌氧与阳球」：多西环素打支原体/衣原体/立克次体；克林霉素打厌氧菌和青霉素过敏者的敏感阳性球菌感染。",
      "多西环素必叮嘱「防晒防光敏 + 足水直立吞服」；克林霉素必警惕「停药后仍可能发生的艰难梭菌严重腹泻」。",
      "妊娠期及牙齿发育期儿童使用多西环素需严格评估获益风险。",
    ],
    scenarios: [
      "肺炎支原体呼吸道感染、沙眼衣原体泌尿生殖道感染或立克次体病时，常评估多西环素。",
      "青霉素过敏或不宜使用时的敏感阳性球菌/厌氧菌混合皮肤软组织或腹腔感染，常评估克林霉素（关注腹泻警戒）。",
    ],
    sources: [
      {
        title: "DailyMed：Doxycycline hyclate 胶囊说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=fbc1924f-d647-465a-b8b2-25de332c5896",
        sections: "微生物学、适应症、警告及不良反应：30S 亚基机制、非典型病原体、光敏反应与牙齿/食管风险。",
      },
      {
        title: "DailyMed：Clindamycin hydrochloride 胶囊说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b43dc396-17ef-a523-e053-2a95a90ac872",
        sections: "黑框警告、微生物学、适应症与警告：50S 23S rRNA 机制、厌氧与阳性菌谱及艰难梭菌结肠炎。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "amoxicillin-vs-amoxicillin-clavulanate",
    title: "青霉素单方 vs 加酶复方：阿莫西林 vs 阿莫西林克拉维酸钾",
    summary: "克拉维酸本身抗菌作用微弱，但它以「牺牲性抑制剂」保护阿莫西林免受 β-内酰胺酶水解，从而扩宽抗菌谱，同时也增加胃肠与肝胆不良反应。",
    drugIds: ["amoxicillin", "amoxicillin-clavulanate"],
    rows: [
      {
        quizId: "beta-lactamase-defense",
        quizExplanation: "单方阿莫西林的 β-内酰胺环易被产酶菌产生的 β-内酰胺酶水解失活；复方中的克拉维酸不可逆结合并灭活部分 β-内酰胺酶，使阿莫西林得以到达并结合 PBP。",
        label: "对产 β-内酰胺酶细菌的稳定机制",
        values: [
          "单方 PBP 抑制剂，容易被多种细菌产生的 β-内酰胺酶水解失活",
          "克拉维酸抑制部分 β-内酰胺酶以保护阿莫西林，恢复对相应产酶菌的活性",
        ],
      },
      {
        quizId: "spectrum-and-indication",
        quizExplanation: "单方阿莫西林聚焦非产酶敏感菌耳鼻喉/呼吸道感染及幽门螺杆菌根除联合方案；复方则扩展至产酶菌引起的急性细菌性鼻窦炎、下呼吸道感染、部分尿路及皮肤咬伤/软组织感染。",
        label: "抗菌谱与主要适用感染差异",
        values: [
          "适合敏感非产酶菌所致耳鼻喉/呼吸道感染及幽门螺杆菌根除联合用药",
          "扩展覆盖相应敏感产酶菌所致的下呼吸道感染、急性细菌性鼻窦炎与软组织感染",
        ],
      },
      {
        quizId: "liver-and-gi-risk",
        quizExplanation: "克拉维酸组分增加了腹泻（及念珠菌感染）发生率，且复方制剂具有明确的胆汁淤积性黄疸与肝损伤警示，既往使用该复方曾致肝损伤者禁用。",
        label: "肝胆与胃肠道风险差异",
        values: [
          "胃肠道反应相对较轻；肝胆汁淤积性黄疸风险低于含克拉维酸复方",
          "腹泻发生率相对更高，且具胆汁淤积性黄疸与肝损伤警示（既往史者禁用）",
        ],
      },
      {
        quizId: "formulation-ratio",
        quizExplanation: "单方阿莫西林按单一有效成分计剂量；阿莫西林克拉维酸钾存在 4:1、7:1、14:1、16:1 等多种配比，不能仅凭阿莫西林毫克数用两片低比例片替换一片高比例片。",
        label: "规格配比与替换规则",
        values: [
          "单一有效成分，按阿莫西林本身含量计算与核对剂量",
          "双组分固定配比（如不同规格含不同克拉维酸比例），不可仅按阿莫西林含量随意拼片替换",
        ],
      },
      {
        label: "共同的青霉素过敏与皮疹警示",
        values: [
          "均属青霉素类，严重过敏史者禁用，传染性单核细胞增多症患者均易发皮疹",
          "均属青霉素类，严重过敏史者禁用，传染性单核细胞增多症患者均易发皮疹",
        ],
      },
    ],
    takeaways: [
      "克拉维酸不是单独杀菌主力，而是「替阿莫西林挡刀（挡 β-内酰胺酶）」的保护伞。",
      "切记不能用两片含固定克拉维酸的复方片去凑阿莫西林高剂量，否则克拉维酸过量会显著加重腹泻与肝风险。",
      "能用单方阿莫西林覆盖的非产酶敏感感染不必盲目升级为复方，减少不必要的胃肠/肝胆负担和耐药选择。",
    ],
    scenarios: [
      "敏感链球菌咽扁桃体炎或幽门螺杆菌四联/三联根除方案中，常选用单方阿莫西林。",
      "怀疑或证实产 β-内酰胺酶菌（如产酶流感嗜血杆菌、卡他莫拉菌等）所致急性细菌性鼻窦炎或下呼吸道感染时，常评估阿莫西林克拉维酸钾。",
    ],
    sources: [
      {
        title: "阿莫西林说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2c395111-c9c1-483e-a542-58b935ede689",
        sections: "药理、适应症、警告与不良反应：PBP 抑制、幽门螺杆菌联合及过敏/皮疹风险。",
      },
      {
        title: "FDA：AUGMENTIN 阿莫西林／克拉维酸钾说明书（2026）",
        url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/050564s061lbl.pdf",
        sections: "第 1～2、4～6、12.2、12.4 节：β-内酰胺酶保护机制、配比不可随意互换及肝胆汁淤积损伤禁忌。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "cefuroxime-vs-ceftriaxone",
    title: "头孢二代口服前药 vs 三代注射：头孢呋辛酯 vs 头孢曲松",
    summary: "两药均抑制细菌细胞壁 PBP，但头孢呋辛酯为需随餐口服水解的二代前药、主治社区轻中度感染；头孢曲松为注射三代头孢、可透入脑脊液且存在独特的钙沉淀与胆道沉积风险。",
    drugIds: ["cefuroxime-axetil", "ceftriaxone"],
    rows: [
      {
        quizId: "generation-and-prodrug",
        quizExplanation: "头孢呋辛酯（axetil）是口服酯化前药，经肠黏膜和血液非特异性酯酶水解为活性头孢呋辛并由食物显著提高吸收；头孢曲松为直接发挥活性的第三代注射头孢菌素。",
        label: "代别、剂型与前药活化特征",
        values: [
          "第二代头孢口服酯化前药，需经肠黏膜/血酯酶水解为头孢呋辛，随餐吸收明显提高",
          "第三代注射用头孢菌素（非前药），静脉或肌内给药直接起效",
        ],
      },
      {
        quizId: "cns-penetration",
        quizExplanation: "头孢曲松在脑膜炎时能有效穿透血脑屏障达到治疗脑脊液浓度，是细菌性脑膜炎的重要选择；所引头孢呋辛酯口服制剂不用于脑膜炎。",
        label: "血脑屏障穿透与重症定位",
        values: [
          "口服片聚焦咽炎、鼻窦炎、膀胱炎及非复杂性皮肤感染，不用于中枢感染",
          "炎症时可有效穿透血脑屏障入脑脊液，适用于细菌性脑膜炎等严重感染",
        ],
      },
      {
        quizId: "elimination-and-calcium-risk",
        quizExplanation: "头孢呋辛主要经肾排泄，肾损需调量；头孢曲松呈肾脏与胆道双途径排泄，可在胆囊形成可逆性头孢曲松钙沉积（胆泥/假性结石），并严禁与含钙静脉液混用（新生儿有致死性沉淀风险）。",
        label: "排泄途径与钙相关独特风险",
        values: [
          "主要经肾小球滤过与肾小管分泌原形排泄，肾损蓄积需按肾功能减量",
          "肾与胆道双通道排泄；可致胆泥/假性结石，严禁与含钙静脉溶液混合或同步输注",
        ],
      },
      {
        quizId: "neonatal-boundary",
        quizExplanation: "头孢曲松因高胆红素血症核黄疸风险（置换白蛋白结合位点）及新生儿输注含钙液致死性肺/肾钙盐沉淀而在特定新生儿人群存在明确禁忌。",
        label: "特殊人群与配伍禁忌差异",
        values: [
          "按适龄片剂或混悬剂说明书选用，且片剂与混悬剂生物利用度非简单 mg 等效",
          "高胆红素血症新生儿及需使用含钙静脉液的新生儿（≤28 天）存在明确禁忌",
        ],
      },
      {
        label: "共同的 β-内酰胺安全边界",
        values: [
          "均需核对头孢及其他 β-内酰胺类严重过敏史，并警惕艰难梭菌相关结肠炎",
          "均需核对头孢及其他 β-内酰胺类严重过敏史，并警惕艰难梭菌相关结肠炎",
        ],
      },
    ],
    takeaways: [
      "头孢呋辛酯记住「口服前药 + 餐后吸收好 + 社区轻中度」；头孢曲松记住「注射三代 + 入脑脊液 + 胆道排泄禁混钙」。",
      "头孢曲松严禁在 Y 型管路或输液袋中与林格液、葡萄糖酸钙等含钙静脉液混合，尤其新生儿期禁忌更为严格。",
      "同是二代头孢呋辛酯，口服片剂与干混悬剂不可按毫克数直接 1:1 互相替换。",
    ],
    scenarios: [
      "社区门诊成人或大龄儿童的链球菌咽炎、急性细菌性鼻窦炎或单纯性膀胱炎需口服治疗时，常评估头孢呋辛酯（随餐服用）。",
      "细菌性脑膜炎、住院重症肺炎或需每日一次强效静脉覆盖敏感阴性菌/肺炎链球菌时，常评估头孢曲松（避开含钙静脉液与新生儿禁忌）。",
    ],
    sources: [
      {
        title: "emc：Zinnat（头孢呋辛酯）片说明书",
        url: "https://www.medicines.org.uk/emc/product/3811/smpc",
        sections: "第 4.1～4.4、4.8、5.1～5.2 节：前药水解、随餐吸收、肾功能调整及片剂与混悬剂非等效。",
      },
      {
        title: "头孢曲松说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=8351aa37-552d-471d-b293-c564dcb6ec29",
        sections: "药理、适应症、禁忌与警告：细菌性脑膜炎、胆泥沉积、新生儿禁忌及含钙静脉液配伍禁令。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "tmp-smx-vs-nitrofurantoin",
    title: "尿路感染常见口服药：复方磺胺甲噁唑 vs 呋喃妥因",
    summary: "两药均常用于敏感菌尿路感染，但前者为双重阻断叶酸代谢的全身分布药物，后者仅在尿液中高度富集而组织浓度低，仅限急性单纯性膀胱炎。",
    drugIds: ["trimethoprim-sulfamethoxazole", "nitrofurantoin"],
    rows: [
      {
        quizId: "mechanism",
        quizExplanation: "复方磺胺甲噁唑通过磺胺甲噁唑（抑二氢蝶酸合成酶）与甲氧苄啶（抑二氢叶酸还原酶）先后阻断叶酸通路；呋喃妥因经细菌黄素蛋白还原为高活性中间体，多靶点破坏细菌大分子。",
        label: "抗菌作用靶点与机理",
        values: [
          "分别抑制二氢蝶酸合成酶与二氢叶酸还原酶，双重连续阻断细菌叶酸合成",
          "经细菌黄素蛋白还原为活性中间体，非特异性损伤核糖体蛋白及 DNA/RNA 等多种过程",
        ],
      },
      {
        quizId: "tissue-vs-urine-scope",
        quizExplanation: "复方磺胺甲噁唑全身血药与组织浓度高，既治尿感（含复杂/肾盂肾炎敏感株）又用于肺孢子菌肺炎（PCP）；呋喃妥因仅在尿中达杀菌浓度、血和肾实质浓度低，不可用于肾盂肾炎或全身感染。",
        label: "组织穿透与临床适用边界",
        values: [
          "全身组织分布良好，除敏感尿路感染外，也是耶氏肺孢子菌肺炎治疗与预防核心药",
          "主要在尿液中浓集而血及组织浓度低，仅限急性单纯性膀胱炎（不治肾盂肾炎）",
        ],
      },
      {
        quizId: "renal-and-organ-toxicity",
        quizExplanation: "复方磺胺甲噁唑（含甲氧苄啶阻断肾小管 ENaC）可致高钾血症、骨髓抑制及 SJS/TEN 严重药疹；呋喃妥因在明显肾损时尿浓度不足且蓄积增加毒性，可致急慢性肺纤维化、肝损及周围神经病变。",
        label: "特征性器官毒性与肾功能禁忌",
        values: [
          "高钾血症、骨髓抑制、SJS/TEN 严重皮肤反应与结晶尿风险",
          "明显肾功能不全禁忌（尿中不达效且增毒）；警惕急慢性肺毒性、肝损与周围神经病变",
        ],
      },
      {
        label: "共同的 G6PD 缺乏与围产期警戒",
        values: [
          "G6PD 缺乏者均有溶血风险，妊娠晚期/临近分娩及新生儿期均存在重要安全限制",
          "G6PD 缺乏者均有溶血风险，妊娠晚期/临近分娩及新生儿期均存在重要安全限制",
        ],
      },
      {
        label: "共同的尿感选药规范",
        values: [
          "均须结合当地大肠埃希菌耐药趋势、临床分型及患者基础肾功能选用",
          "均须结合当地大肠埃希菌耐药趋势、临床分型及患者基础肾功能选用",
        ],
      },
    ],
    takeaways: [
      "记「尿液局限于膀胱」vs「全身兼顾肺与肾」：发热腰痛怀疑肾盂肾炎时不能单指望呋喃妥因。",
      "呋喃妥因长期或反复使用须警惕咳嗽气短（肺纤维化）和肢端麻木（周围神经病），且常使尿液呈无害棕褐色。",
      "复方磺胺甲噁唑与 ACEI/ARB/螺内酯同用或肾功能偏低时，需格外警惕高钾血症。",
    ],
    scenarios: [
      "肾功能正常的非妊娠成人急性单纯性膀胱炎（无发热腰痛等上尿路感染征象）时，常优先评估短程呋喃妥因。",
      "耶氏肺孢子菌肺炎（PCP）防治，或药敏证实敏感的上尿路/全身感染需口服覆盖时，常评估复方磺胺甲噁唑（注意监测血钾、血象及皮疹）。",
    ],
    sources: [
      {
        title: "DailyMed：BACTRIM（sulfamethoxazole / trimethoprim）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f59d0c04-9c66-4d53-a0e1-cb55570deb62",
        sections: "微生物学、适应症、禁忌与警告：双重叶酸阻断、PCP 防治、高钾血症、骨髓及 SJS/TEN 风险。",
      },
      {
        title: "DailyMed：MACROBID（呋喃妥因）胶囊说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=28bc9ec9-b8db-4ece-a14a-8bcf618cbf7e",
        sections: "临床药理、适应症、禁忌与警告：单纯性膀胱炎限定、肾功不全与临产禁忌及肺/肝/神经毒性。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "donepezil-vs-memantine",
    title: "阿尔茨海默病对症用药：多奈哌齐 vs 美金刚",
    summary: "两药虽常在中重度阿尔茨海默病中联合使用，但多奈哌齐靠增强乙酰胆碱信号覆盖轻中重度，美金刚靠调节谷氨酸 NMDA 通道定位中重度。",
    drugIds: ["donepezil", "memantine"],
    rows: [
      {
        quizId: "neurotransmitter-mechanism",
        quizExplanation: "多奈哌齐可逆性抑制乙酰胆碱酯酶，减少突触间隙乙酰胆碱分解以放大胆碱能传递；美金刚以低中等亲和力非竞争性阻断开放态 NMDA 受体阳离子通道，抑制病理性谷氨酸兴奋毒性同时保留生理突触传递。",
        label: "神经递质靶点与作用模式",
        values: [
          "可逆性抑制乙酰胆碱酯酶，增加突触间隙乙酰胆碱浓度",
          "低中等亲和力、非竞争性阻断开放 NMDA 受体通道，抑制病理谷氨酸过度激活",
        ],
      },
      {
        quizId: "severity-stage",
        quizExplanation: "多奈哌齐（ARICEPT）适应症覆盖轻度、中度至重度阿尔茨海默病型痴呆；美金刚（NAMENDA）则明确获批用于中度至重度阿尔茨海默病型痴呆。",
        label: "所引说明书的疾病分期定位",
        values: [
          "覆盖轻度、中度及重度阿尔茨海默病型痴呆的症状治疗",
          "定位于中度至重度阿尔茨海默病型痴呆的症状治疗",
        ],
      },
      {
        quizId: "distinct-adverse-profile",
        quizExplanation: "多奈哌齐因外周与中枢胆碱能增强，易致恶心腹泻、食欲与体重下降、胃酸增加（关注溃疡/NSAIDs）及迷走神经张力增高引起的心动过缓与晕厥；美金刚较常见头晕头痛、意识混乱、幻觉及便秘。",
        label: "特征性不良反应与系统风险",
        values: [
          "胆碱能反应：恶心腹泻、减重、胃酸增高及心动过缓/传导阻滞/晕厥",
          "中枢与胃肠反应：头晕、头痛、意识混乱、嗜睡或幻觉及便秘",
        ],
      },
      {
        quizId: "renal-and-urine-ph",
        quizExplanation: "多奈哌齐主要经肝 CYP2D6/3A4 代谢并随尿粪排出；美金刚大部分原形经肾排泄，严重肾功能受损须减量，且尿液碱化（如碳酸氢钠、碳酸酐酶抑制剂或素食极端偏碱）会显著降低其清除率。",
        label: "肾功能与尿液酸碱度影响",
        values: [
          "主要经肝代谢与多途径消除，无尿液碱化蓄积警示",
          "主要经肾原形排泄，重度肾损须减量；尿液碱化可明显减少清除并增毒",
        ],
      },
      {
        label: "共同的疗效定位边界",
        values: [
          "均为对症改善或延缓功能评分下滑，尚无证据显示能逆转或阻止神经退行基础病变",
          "均为对症改善或延缓功能评分下滑，尚无证据显示能逆转或阻止神经退行基础病变",
        ],
      },
    ],
    takeaways: [
      "记「胆碱加法（轻中重全覆盖）」vs「谷氨酸减法（专管中重度）」：两者机制互补，中重度期临床常可联用。",
      "用多奈哌齐前先查心电图传导与消化性溃疡病史；用美金刚需核查肾功能并留意碱化尿液药物/饮食影响。",
      "两药皆属对症支持药物，需结合非药物照护并与家属建立合理疗效预期。",
    ],
    scenarios: [
      "初诊轻度阿尔茨海默病型痴呆（无严重心动过缓或活动性消化道溃疡）需启动一线对症治疗时，常评估多奈哌齐。",
      "已进展至中重度阿尔茨海默病、不能耐受胆碱酯酶抑制剂或需在多奈哌齐基础上协同干预兴奋毒性时，常评估加用或单用美金刚（注意重度肾损减量）。",
    ],
    sources: [
      {
        title: "DailyMed：ARICEPT（donepezil）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=98e451e1-e4d7-4439-a675-c5457ba20975",
        sections: "第 1、5～6、12.1 节：轻中重度阿尔茨海默病适应症、胆碱酯酶抑制及传导/胃肠风险。",
      },
      {
        title: "DailyMed：NAMENDA 美金刚片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=b9f27baf-aa2a-443a-9ef5-e002d23407ba",
        sections: "第 1～2、5～7、8.6、12.1 节：中重度定位、NMDA 通道机制、重度肾损减量及尿液碱化影响。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "carbamazepine-vs-levetiracetam-vs-pregabalin",
    title: "抗癫痫与神经痛药物：卡马西平 vs 左乙拉西坦 vs 普瑞巴林",
    summary: "三药均涉及中枢神经元过度兴奋调控，但在已知/未明分子靶点、CYP 酶诱导与遗传皮肤风险、肾脏消除及神经痛 vs 全面性发作适用边界上截然不同。",
    drugIds: ["carbamazepine", "levetiracetam", "pregabalin"],
    rows: [
      {
        quizId: "target-and-uncertainty",
        quizExplanation: "卡马西平主要通过阻滞电压/使用依赖性钠通道抑制高频放电；左乙拉西坦结合突触囊泡蛋白 SV2A；普瑞巴林结合电压门控钙通道 α2δ 辅助亚基——后两者的完整临床抗发作/镇痛机制至今仍未完全明确。",
        label: "分子靶点与机制明确度",
        values: [
          "主要阻滞电压及使用依赖性钠通道，抑制神经元持续高频重复放电",
          "结合突触囊泡蛋白 SV2A（可能调控递质释放），完整抗癫痫机制尚未完全明确",
          "结合中枢电压门控钙通道 α2δ 亚基，完整镇痛及抗发作机制尚未完全明确",
        ],
      },
      {
        quizId: "indication-focus",
        quizExplanation: "卡马西平兼治局灶性/全面强直阵挛发作及三叉神经痛；左乙拉西坦覆盖局灶性、青少年肌阵挛及原发全面强直阵挛等多种发作；普瑞巴林以成人糖尿病神经痛、带状疱疹后神经痛及局灶性发作辅助治疗为主。",
        label: "发作类型与疼痛定位侧重",
        values: [
          "局灶性与全面强直阵挛发作，以及三叉神经痛（可诱发或加重肌阵挛/失神）",
          "局灶性起始发作，并获批青少年肌阵挛发作及原发全面强直阵挛辅助治疗",
          "成人糖尿病周围神经痛、带状疱疹后神经痛，及局灶性起始发作辅助治疗",
        ],
      },
      {
        quizId: "pk-and-interactions",
        quizExplanation: "卡马西平为强效 CYP 酶诱导剂（且自身诱导代谢），治疗窗窄、相互作用繁多；左乙拉西坦与普瑞巴林几乎不经 CYP 代谢且主要经肾原形排泄，肝药酶相互作用极少但均须按肾功能调整剂量。",
        label: "酶诱导相互作用与肾脏调整",
        values: [
          "窄治疗窗强效 CYP 酶诱导剂（含自身诱导），可大幅降低多种联用药浓度",
          "极少经 CYP 代谢、相互作用少，主要经肾排泄，肾功能减退须按肌酐清除率调量",
          "几乎不经人体代谢、主要以原形经肾排泄，肾功能减退须严格按肾功调量",
        ],
      },
      {
        quizId: "distinct-safety-profile",
        quizExplanation: "卡马西平需防范低钠血症、骨髓抑制及亚洲高危人群 HLA-B*15:02 关联 SJS/TEN；左乙拉西坦突出易激惹、攻击性等精神行为异常；普瑞巴林则重在监测外周水肿、体重增加及联用中枢抑制药时的呼吸抑制。",
        label: "特征性不良反应与筛查重点",
        values: [
          "低钠血症、白细胞减少及严重药疹（汉族等高风险人群须先筛查 HLA-B*15:02）",
          "嗜睡乏力及易激惹、攻击性等精神行为异常（极少致明显酶诱导或血钠低下）",
          "头晕嗜睡、外周水肿/体重增加，及联用阿片等中枢抑制药时的呼吸抑制风险",
        ],
      },
      {
        label: "共同的停药与情绪警示",
        values: [
          "均不可突然停药以免诱发发作加重或撤药反应，均需关注情绪变化与自杀意念",
          "均不可突然停药以免诱发发作加重或撤药反应，均需关注情绪变化与自杀意念",
          "均不可突然停药以免诱发发作加重或撤药反应，均需关注情绪变化与自杀意念",
        ],
      },
    ],
    takeaways: [
      "记「卡马西平诱导 CYP 查 HLA-B*15:02」、「左乙拉西坦认 SV2A 查肾功与脾气」、「普瑞巴林认 α2δ 查肾功与呼吸抑制」。",
      "左乙拉西坦和普瑞巴林的精确人体全程机制均有未明环节，切勿把结合蛋白直接等同于单一因果全链条。",
      "三叉神经痛常先联系卡马西平，而带状疱疹后神经痛与糖尿病周围神经痛常评估普瑞巴林。",
    ],
    scenarios: [
      "三叉神经痛或已排除 HLA-B*15:02 风险的局灶性癫痫且无复杂合并用药冲突时，常评估卡马西平。",
      "合并多种肝代谢药物（如抗凝药、靶向药）需极少 CYP 相互作用的广谱抗发作治疗时，常评估左乙拉西坦（注意行为情绪与肾功）；糖尿病周围神经痛或带状疱疹后神经痛则常评估普瑞巴林。",
    ],
    sources: [
      {
        title: "emc：Tegretol 卡马西平片说明书",
        url: "https://www.medicines.org.uk/emc/product/7846/smpc",
        sections: "第 4.1～4.6、4.8、5.1 节：钠通道阻滞、三叉神经痛、HLA-B*15:02 筛查、低钠与酶诱导。",
      },
      {
        title: "DailyMed：KEPPRA（左乙拉西坦）口服制剂说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=3ca9df05-a506-4ec8-a4fe-320f1219ab21",
        sections: "第 1、2.5、5、6、12.1 节：SV2A 结合及未明机制、多种发作范围、精神行为警示及肾功能调量。",
      },
      {
        title: "DailyMed：LYRICA（普瑞巴林）口服制剂说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=d4734e7d-5079-455e-8ff5-8f4539c998a9",
        sections: "第 1、2.7、5～6、12.1 节：α2δ 结合及未明机制、神经痛与局灶发作、呼吸抑制与肾功调整。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "laxatives-lactulose-macrogol-bisacodyl",
    title: "通便药机制分层：乳果糖 vs 聚乙二醇电解质 vs 比沙可啶",
    summary: "同为缓解便秘的常用药，乳果糖靠结肠菌群发酵产酸兼降血氨，聚乙二醇 3350 为不发酵的惰性渗透大分子，比沙可啶则直接刺激结肠肌间神经丛蠕动。",
    drugIds: ["lactulose", "macrogol-3350", "bisacodyl"],
    rows: [
      {
        quizId: "laxative-mechanism",
        quizExplanation: "乳果糖需结肠细菌分解为低分子有机酸产生渗透压并酸化肠腔捕获氨；聚乙二醇 3350 作为不被吸收、不被发酵的惰性高分子直接束水软便；比沙可啶经肠水解生成活性二酚代谢物，直接刺激结肠黏膜促进推进性蠕动与水电解质分泌。",
        label: "通便机制与结肠作用方式",
        values: [
          "发酵渗透型：结肠细菌分解产有机酸，酸化肠腔并吸水增容",
          "惰性渗透型：大分子聚合物结合水分保留于肠腔，不被吸收或发酵",
          "刺激性泻药：水解为活性代谢物直接刺激结肠蠕动并促水电解质入肠腔",
        ],
      },
      {
        quizId: "extra-indication",
        quizExplanation: "乳果糖因结肠产酸把 NH3 离子化为难吸收的 NH4+ 排出，还明确用于肝性脑病与肝昏迷；聚乙二醇 3350 含电解质制剂常兼用于慢性便秘及经评估确认的粪便嵌塞；比沙可啶成人肠溶片定位短期缓解偶发便秘。",
        label: "特定临床拓展与适用定位",
        values: [
          "除便秘外，还通过降低肠腔氨吸收明确用于肝性脑病及肝昏迷",
          "慢性便秘及经评估确认的粪便嵌塞（所引含电解质成人/青少年制剂）",
          "仅定位成人偶发性便秘的短期缓解（所引成人肠溶片不用于未满 18 岁）",
        ],
      },
      {
        quizId: "gi-tolerance-and-abuse",
        quizExplanation: "乳果糖因细菌产气发酵，治疗初期腹胀、排气增多尤为明显；聚乙二醇含电解质制剂基本不发酵产气、腹胀相对较轻且等渗减少体液电解质净丢失；比沙可啶常见腹部绞痛，长期滥用可致脱水与低钾血症。",
        label: "肠道产气反应与过量/长期风险",
        values: [
          "初期因细菌发酵产气常致明显腹胀与排气增多；过量腹泻致电解质紊乱",
          "不被细菌发酵故产气较少，但过量或液丢失仍可致腹泻与电解质异常",
          "易诱发腹部绞痛；长期或过量滥用可致脱水、低钾血症及电解质紊乱",
        ],
      },
      {
        label: "共同的急腹症与肠梗阻禁忌",
        values: [
          "疑有肠梗阻、胃肠穿孔或急腹症时均不可自行用通便药掩盖病情",
          "疑有肠梗阻、胃肠穿孔或急腹症时均不可自行用通便药掩盖病情",
          "疑有肠梗阻、胃肠穿孔或急腹症时均不可自行用通便药掩盖病情",
        ],
      },
      {
        label: "共同的制剂成分提示",
        values: [
          "用药前须核对具体制剂辅料、电解质负荷及患者基础电解质状态",
          "用药前须核对具体制剂辅料、电解质负荷及患者基础电解质状态",
          "用药前须核对具体制剂辅料、电解质负荷及患者基础电解质状态",
        ],
      },
    ],
    takeaways: [
      "记「乳果糖发酵兼治肝脑、聚乙二醇惰性纯吸水、比沙可啶刺激防滥用」。",
      "对乳果糖胀气不耐受的慢性便秘患者，常考虑改用不被细菌发酵的聚乙二醇制剂。",
      "刺激性泻药（比沙可啶）宜短期按需使用，同时应避免与牛奶或抗酸剂同服肠溶片以免提前在胃内溶解刺激胃黏膜。",
    ],
    scenarios: [
      "肝硬化合并肝性脑病或需减少肠腔氨吸收同时保持排便通畅时，常首选乳果糖。",
      "慢性功能性便秘长期维持治疗或已确认粪便嵌塞需较少产气且补充电解质时，常评估聚乙二醇 3350 电解质散；成人偶发短期便秘需快速促蠕动时可短程评估比沙可啶。",
    ],
    sources: [
      {
        title: "emc：Duphalac（lactulose）产品特性概要",
        url: "https://www.medicines.org.uk/emc/product/5525/smpc",
        sections: "第 4.1、4.3～4.4、4.8、5.1～5.2 节：便秘与肝性脑病定位、结肠产酸离子化氨及胀气腹泻风险。",
      },
      {
        title: "emc：Movicol 聚乙二醇 3350 含电解质口服溶液用粉说明书",
        url: "https://www.medicines.org.uk/emc/product/1025/smpc",
        sections: "第 4.1～4.4、4.8、5.1～5.2 节：慢性便秘与粪便嵌塞、惰性渗透作用及禁忌。",
      },
      {
        title: "emc：Dulcolax Adult 比沙可啶肠溶片说明书",
        url: "https://www.medicines.org.uk/emc/product/361/smpc",
        sections: "第 4.1～4.4、4.8、5.1～5.2 节：成人短期偶发便秘、局部水解刺激蠕动及滥用低钾风险。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "domperidone-vs-metoclopramide",
    title: "多巴胺 D2 阻滞止吐促动力药：多潘立酮 vs 甲氧氯普胺",
    summary: "两药均拮抗多巴胺 D2 受体，但血脑屏障穿透差异决定了「外周心脏 QT 风险」与「中枢锥体外系/迟发性运动障碍风险」两条完全不同的安全警戒线。",
    drugIds: ["domperidone", "metoclopramide"],
    rows: [
      {
        quizId: "bbb-and-mechanism",
        quizExplanation: "多潘立酮极少穿透血脑屏障，主要拮抗外周胃肠及血脑屏障外的催吐化学感受区（CTZ）D2 受体；甲氧氯普胺易穿透血脑屏障阻断中枢与外周 D2 受体，并可能通过增强胆碱能反应促胃动力。",
        label: "血脑屏障穿透与作用范围",
        values: [
          "极少穿透血脑屏障，主要阻断外周胃肠及屏障外 CTZ 的 D2 受体",
          "易穿透血脑屏障，同时阻断中枢与外周 D2 受体（促动力或涉及胆碱能增强）",
        ],
      },
      {
        quizId: "cardiac-vs-eps-risk",
        quizExplanation: "多潘立酮较少引起锥体外系反应，但心脏 QT 间期延长、尖端扭转型室速及猝死风险突出（受年龄、剂量、肝损及 CYP3A4 抑制剂严格限制）；甲氧氯普胺具黑框警告，可致不可逆迟发性运动障碍及急性肌张力障碍。",
        label: "核心心脏风险 vs 中枢运动障碍风险",
        values: [
          "锥体外系反应少见，但需严防 QT 间期延长、室性心律失常及猝死风险",
          "中枢锥体外系反应（肌张力障碍/静坐不能）及可能不可逆迟发性运动障碍风险突出",
        ],
      },
      {
        quizId: "duration-and-indication",
        quizExplanation: "所引多潘立酮说明书限于恶心呕吐的短期最低有效剂量缓解；所引甲氧氯普胺口服片适用于成人急性或复发性糖尿病性胃轻瘫及难治性 GERD 短期治疗，且明确警示通常避免连续超过 12 周。",
        label: "所引制剂适应症与疗程限制",
        values: [
          "限于恶心、呕吐短期缓解（最低有效剂量、最短疗程）",
          "用于成人糖尿病性胃轻瘫及常规无效的症状性反流，通常避免超过 12 周",
        ],
      },
      {
        label: "共同的催乳素与胃肠梗阻禁忌",
        values: [
          "均可因阻断多巴胺抑制而升高泌乳素，机械性肠梗阻、穿孔或出血时均禁用",
          "均可因阻断多巴胺抑制而升高泌乳素，机械性肠梗阻、穿孔或出血时均禁用",
        ],
      },
      {
        label: "共同的临床使用原则",
        values: [
          "均仅作短期对症/特定动力支持，不作为长期常规健胃药使用",
          "均仅作短期对症/特定动力支持，不作为长期常规健胃药使用",
        ],
      },
    ],
    takeaways: [
      "记「多潘立酮留外周、紧盯心脏 QT」；「甲氧氯普胺入脑内、紧盯迟发性运动障碍与 12 周上限」。",
      "两者阻断垂体前叶多巴胺受体均会引起泌乳素升高（乳房胀痛、溢乳或月经变化）。",
      "多潘立酮禁与强 CYP3A4 抑制剂或已知延长 QT 药物联用；甲氧氯普胺严防帕金森病患者及长期超疗程暴露。",
    ],
    scenarios: [
      "需短期缓解成人恶心呕吐、希望减少中枢锥体外系风险且无心脏传导/QT 延长风险及 CYP3A4 冲突时，常按当地批准范围短期评估多潘立酮。",
      "成人糖尿病性胃轻瘫急性或复发性症状需明确胃动力支持（且注意严格控制总疗程≤12 周）时，常评估甲氧氯普胺。",
    ],
    sources: [
      {
        title: "多潘立酮口服混悬液说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/3188/smpc",
        sections: "第 4.1、4.3～4.5、4.8、5.1 节：外周 D2 拮抗、短期止吐、QT 延长与猝死风险及梗阻禁忌。",
      },
      {
        title: "DailyMed：Metoclopramide 片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c143e210-4ce7-44e5-b1e2-bf0e6bfde485",
        sections: "黑框警告及第 1～2、4～6、12.1～12.2 节：糖尿病性胃轻瘫、12 周上限、迟发性运动障碍与机械梗阻禁忌。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "ipratropium-vs-tiotropium",
    title: "吸入抗胆碱支气管舒张剂：异丙托溴铵 vs 噻托溴铵",
    summary: "两药均拮抗气道毒蕈碱受体（尤其 M3）减轻乙酰胆碱介导的支气管收缩，但受体解离速率把两者划分为短效（SAMA）与长效（LAMA）。",
    drugIds: ["ipratropium", "tiotropium"],
    rows: [
      {
        quizId: "duration-and-class",
        quizExplanation: "异丙托溴铵属于短效抗胆碱药（SAMA），作用维持约数小时（常约 2～4 至 6 小时），每日需 3～4 次；噻托溴铵从 M3 受体解离极慢，属于长效抗胆碱药（LAMA），作用持续 24 小时以上，每日一次。",
        label: "作用时程分类与给药频次",
        values: [
          "短效抗胆碱药（SAMA），作用维持数小时，常需每日 3～4 次吸入或雾化",
          "长效抗胆碱药（LAMA），从 M3 受体解离缓慢，维持 ≥24 小时且每日一次",
        ],
      },
      {
        quizId: "clinical-positioning",
        quizExplanation: "异丙托溴铵雾化液常用于 COPD 支气管痉挛，并可在急性/慢性哮喘中与吸入 β2 激动剂联合；噻托溴铵（RESPIMAT）为 COPD 维持治疗及降低急性加重风险，或 6 岁及以上哮喘长期维持加用，不可作急性支气管痉挛急救。",
        label: "急性联用 vs 长期维持定位",
        values: [
          "COPD 可逆性痉挛及急/慢性哮喘可与 β2 激动剂联合吸入雾化",
          "COPD 长期维持与降急性加重，及 6 岁及以上哮喘长期维持（非急救药）",
        ],
      },
      {
        quizId: "m3-selectivity",
        quizExplanation: "异丙托溴铵非选择性拮抗 M1/M2/M3 受体；噻托溴铵对气道平滑肌 M3 受体具有动力学选择性（从 M3 解离远慢于从 M2 解离），既保长效舒张又减少抑制突触前 M2 自受体带来的乙酰胆碱反跳释放。",
        label: "毒蕈碱亚型解离特点",
        values: [
          "非选择性拮抗 M1、M2、M3 受体，解离较快",
          "从 M3 受体解离明显慢于 M2 受体（动力学选择性），实现长效 M3 阻断",
        ],
      },
      {
        label: "共同的抗胆碱能眼与尿路警示",
        values: [
          "均应防雾滴或喷雾入眼诱发闭角型青光眼恶化，前列腺增生/尿路梗阻者均需警惕尿潴留",
          "均应防雾滴或喷雾入眼诱发闭角型青光眼恶化，前列腺增生/尿路梗阻者均需警惕尿潴留",
        ],
      },
      {
        label: "共同的气道反常反应提醒",
        values: [
          "吸入后均可能偶发反常性支气管痉挛或即刻过敏反应，发生时须立即停用并处理",
          "吸入后均可能偶发反常性支气管痉挛或即刻过敏反应，发生时须立即停用并处理",
        ],
      },
    ],
    takeaways: [
      "记「短效异丙一日多次、急性哮喘可联 SABA 雾化」vs「长效噻托一日一次、只管长期维持不管急救」。",
      "两者最易被忽略的操作风险是「雾滴或喷雾误入眼部诱发闭角型青光眼急性发作」，使用面罩或吸入器时需护眼。",
      "口干是两药最常见的局部抗胆碱表现；良性前列腺增生伴排尿困难患者需留意尿潴留。",
    ],
    scenarios: [
      "COPD 急性加重或哮喘急性发作需要联合短效 β2 激动剂协同舒张支气管时，常雾化吸入异丙托溴铵。",
      "稳定期 COPD 患者需每日一次方便给药以长期控制呼吸困难并降低急性加重风险，或 6 岁及以上哮喘需加用长效抗胆碱维持时，常评估噻托溴铵。",
    ],
    sources: [
      {
        title: "emc：Atrovent（异丙托溴铵）雾化吸入液说明书",
        url: "https://www.medicines.org.uk/emc/product/3818/smpc",
        sections: "第 4.1～4.4、4.8、5.1 节：SAMA 短效频次、与 β2 激动剂联用及青光眼/尿潴留风险。",
      },
      {
        title: "DailyMed：SPIRIVA RESPIMAT（tiotropium）说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=7b656b14-fcaa-2741-f6f0-e0be48971c02",
        sections: "第 1、5、6、12.1 节：M3 动力学长效机制、COPD 降加重与 ≥6 岁哮喘维持、非急救定位。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "budesonide-vs-budesonide-formoterol-vs-montelukast",
    title: "哮喘抗炎与控制策略：布地奈德 vs 布地奈德福莫特罗 vs 孟鲁司特",
    summary: "三者均参与哮喘气道炎症管理，但吸入激素单方（ICS）、ICS 联合快起效长效 β2 激动剂（ICS/福莫特罗）与口服白三烯拮抗剂（LTRA）在急性缓解能力、指南首选路径及黑框安全警示上截然不同。",
    drugIds: ["budesonide", "budesonide-formoterol", "montelukast"],
    rows: [
      {
        quizId: "pharmacologic-class-and-target",
        quizExplanation: "布地奈德单方是吸入糖皮质激素（ICS），仅调控气道炎症基因表达；布地奈德福莫特罗为 ICS/LABA 复方，兼备 ICS 抗炎与福莫特罗快起效（1～3 分钟）长效 β2 舒张；孟鲁司特口服选择性阻断半胱氨酰白三烯 CysLT1 受体。",
        label: "药物类别与分子作用靶点",
        values: [
          "单一吸入糖皮质激素（ICS），激动胞内糖皮质激素受体抑制气道炎症",
          "ICS/LABA 复方：布地奈德抗炎 + 福莫特罗快速并持久激动 β2 受体舒张支气管",
          "口服白三烯受体拮抗剂（LTRA），选择性拮抗 CysLT1 受体",
        ],
      },
      {
        quizId: "reliever-vs-maintenance-role",
        quizExplanation: "单方布地奈德不能立即扩张痉挛支气管；含福莫特罗的 ICS/LABA 因福莫特罗兼具快起效与长效特征，在 GINA 首选路径 1 中兼具抗炎缓解与维持（MART/AIR）角色；孟鲁司特口服仅作预防/辅助控制，绝不用于急性喘息急救。",
        label: "急性缓解能力与指南控制定位",
        values: [
          "纯控制维持抗炎药，起效慢，不可用于急性支气管痉挛即刻缓解",
          "兼具抗炎维持与快速支气管舒张，为 GINA 路径 1 核心按需/维持方案",
          "口服非急救预防与辅助控制药（可防运动诱发收缩），不可用于急性发作急救",
        ],
      },
      {
        quizId: "route-and-copd-scope",
        quizExplanation: "布地奈德与布地奈德福莫特罗均为局部吸入、全身暴露低，且所引 Symbicort 干粉另覆盖符合条件成人 COPD（FEV1 <70% 伴反复加重）；孟鲁司特为口服片剂，无 COPD 适应症但可用于特定过敏性鼻炎（二线）。",
        label: "给药途径与哮喘外适应症差异",
        values: [
          "经口吸入给药，所引单方粉雾剂聚焦哮喘维持治疗",
          "经口吸入给药，除哮喘外，所引制剂还涵盖特定加重史成人 COPD 症状控制",
          "每日一次口服给药，除哮喘预防外另获批其他药无效或不耐受的过敏性鼻炎",
        ],
      },
      {
        quizId: "distinct-safety-warnings",
        quizExplanation: "吸入含布地奈德制剂重点预防口咽念珠菌感染与声音嘶哑（吸后漱口），联用福莫特罗另留意心悸震颤与低钾；孟鲁司特带 FDA 黑框警告，提示抑郁、睡眠异常、行为改变及自杀意念等严重神经精神事件。",
        label: "特征性安全警示与防护",
        values: [
          "口咽念珠菌感染与声音嘶哑（吸后漱口可减轻），长期高剂量需关注生长与肾上腺轴",
          "口咽念珠菌/嘶哑叠加福莫特罗致震颤、心悸、低钾，COPD 用药需留意肺炎风险",
          "严重神经精神事件黑框警告（情绪变化、噩梦、攻击性或自杀意念，出现即停药）",
        ],
      },
      {
        label: "共同的疾病评估原则",
        values: [
          "症状控制不佳或需加用/调整缓解方案时，均应评估吸入技术、诱因与依从性，不可单靠口服用药替代评估",
          "症状控制不佳或需加用/调整缓解方案时，均应评估吸入技术、诱因与依从性，不可单靠口服用药替代评估",
          "症状控制不佳或需加用/调整缓解方案时，均应评估吸入技术、诱因与依从性，不可单靠口服用药替代评估",
        ],
      },
    ],
    takeaways: [
      "只有「ICS + 福莫特罗」因福莫特罗兼具快起效与抗炎同包，才在 GINA 路径 1 担任按需缓解兼维持核心；单方布地奈德与孟鲁司特都不能救急性喘息。",
      "使用含布地奈德吸入剂后务必「清水深漱口并吐出」，大幅减少口腔真菌感染与全身吞咽吸收。",
      "孟鲁司特携带神经精神事件黑框警告，给儿童或成人开具前须充分告知情绪睡眠异常信号，且对过敏性鼻炎仅作后线权衡。",
    ],
    scenarios: [
      "依据 GINA 2026 路径 1 需统一使用含 ICS-福莫特罗进行抗炎缓解（AIR）或维持加缓解（MART），或特定反复加重 COPD 需 ICS/LABA 时，常选用布地奈德福莫特罗。",
      "单纯低剂量 ICS 规律维持控制良好时可用单方布地奈德；无法有效掌握吸入装置或阿司匹林不耐受/运动诱发哮喘需口服辅助时，在充分告知神经精神警示后可评估孟鲁司特。",
    ],
    sources: [
      {
        title: "布地奈德 PULMICORT FLEXHALER 吸入粉雾剂说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ae1105cd-69fc-4c15-937f-c535304341c2",
        sections: "药理、适应症、警告与不良反应：ICS 单方抗炎维持、口腔念珠菌及非急救属性。",
      },
      {
        title: "emc：Symbicort Turbohaler 200/6 干粉吸入剂说明书",
        url: "https://www.medicines.org.uk/emc/product/1327/smpc",
        sections: "第 4.1～4.4、4.8、5.1 节：ICS/LABA 哮喘维持与缓解定位、COPD 条件及 β2/ICS 不良反应。",
      },
      {
        title: "DailyMed：Montelukast 片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=52c650cf-3081-7b2c-e063-6394a90a797f",
        sections: "黑框警告及第 1、5、6、12.1 节：CysLT1 拮抗、非急救、神经精神黑框及鼻炎限制。",
      },
      {
        title: "GINA · 2026 哮喘策略概要",
        url: "https://ginasthma.org/2026-gina-summary-guide/",
        sections: "路径 1（ICS-福莫特罗作为首选缓解/维持策略）与 ICS 单方、LTRA 的阶梯定位对比。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "oseltamivir-vs-baloxavir",
    title: "抗流感病毒口服药对照：奥司他韦 vs 玛巴洛沙韦",
    summary: "两药均覆盖甲型和乙型流感且可治可防，但分别作用于「子代病毒出芽释放」与「上游病毒 RNA 复制转录」，导致疗程次数、重症证据窗与饮食禁忌明显不同。",
    drugIds: ["oseltamivir", "baloxavir-marboxil"],
    rows: [
      {
        quizId: "viral-target",
        quizExplanation: "奥司他韦活性代谢物抑制神经氨酸酶（NA），阻止新复制出的子代病毒从宿主细胞表面释放播散；玛巴洛沙韦前药水解后抑制聚合酶酸性蛋白（PA）帽依赖性核酸内切酶，在更上游直接阻断病毒 mRNA 合成与复制。",
        label: "病毒复制靶点与阻断环节",
        values: [
          "抑制甲/乙型流感病毒神经氨酸酶（NA），阻断子代病毒从感染细胞释放",
          "抑制病毒聚合酶酸性（PA）帽依赖性核酸内切酶，直接阻断病毒 RNA 复制",
        ],
      },
      {
        quizId: "regimen-and-severe-window",
        quizExplanation: "奥司他韦常规口服 5 天（每日 2 次），且 CDC 明确指出住院、重症或进展性流感即便发病超过 48 小时启动仍有临床获益；玛巴洛沙韦常规全程仅需按体重单次口服一次，所引说明书限 5 岁及以上症状出现 48 小时内单纯性流感。",
        label: "疗程频次与重症时间窗",
        values: [
          "常规每日两次连服 5 天；重症或住院患者即使超过 48 小时仍推荐尽早治疗",
          "按体重单次口服 1 剂完成疗程；所引说明书限于 5 岁及以上发病 ≤48 小时单纯流感",
        ],
      },
      {
        quizId: "cations-and-resistance",
        quizExplanation: "玛巴洛沙韦易与多价阳离子螯合降低血药浓度，严禁与乳制品、钙强化饮品及含钙/镁/铝/铁/锌的制酸剂或补充剂同服；因靶点不同，对奥司他韦耐药株通常不与玛巴洛沙韦交叉耐药（但 PA 蛋白 I33T/I38T 等位点突变可致玛巴洛沙韦敏感性下降）。",
        label: "饮食/制酸剂螯合与交叉耐药特征",
        values: [
          "一般可与食物同服减轻恶心；与 PA 内切酶抑制剂无已知靶点交叉耐药",
          "禁与乳制品、高钙饮品或含铝镁铁锌钙制酸剂/补充剂同服（螯合降吸收）",
        ],
      },
      {
        quizId: "adverse-profile",
        quizExplanation: "奥司他韦最常见一过性恶心与呕吐（随餐可缓解），重度肾损需调整剂量；玛巴洛沙韦常见腹泻、支气管炎与头痛，并需关注上市后报告的速发超敏反应。",
        label: "常见不良反应与肾功调整",
        values: [
          "恶心、呕吐较常见（随餐可减轻），中重度肾功能不全常需调整剂量",
          "常见腹泻、支气管炎与头痛，警惕血管性水肿或严重超敏反应；轻中度肾损常无需调量",
        ],
      },
      {
        label: "共同的预防地位边界",
        values: [
          "均可用于暴露后预防，但均不能替代年度季节性流感疫苗接种",
          "均可用于暴露后预防，但均不能替代年度季节性流感疫苗接种",
        ],
      },
    ],
    takeaways: [
      "记「奥司他韦 5 天阻出芽、重症超时也可用」vs「玛巴洛沙韦 1 粒断复制、切忌配奶和钙铁锌」。",
      "由于分别打神经氨酸酶（NA）与聚合酶 PA 亚基，两者之间不存在常规交叉耐药机制。",
      "抗病毒药均越早启动越好，且妊娠期、婴幼儿或住院重症患者需按指南优先选择循证更充分的方案（当前重症住院多首选奥司他韦）。",
    ],
    scenarios: [
      "住院重症流感、进展性流感、发病已超 48 小时的高危人群或 5 岁以下儿童需抗流感治疗时，常首选奥司他韦。",
      "5 岁及以上急性单纯性流感在症状出现 48 小时内就诊、希望单次给药提升依从性且能避开奶制品及矿物质制剂时，常评估玛巴洛沙韦。",
    ],
    sources: [
      {
        title: "奥司他韦说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b015d73a-f3b6-4258-8972-6fc4a043aed8",
        sections: "药理、适应症、剂量调整与不良反应：神经氨酸酶抑制、5 天疗程及恶心呕吐。",
      },
      {
        title: "XOFLUZA（baloxavir marboxil）说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b58b2899-4d22-41e1-8f0c-bdead8917694",
        sections: "第 1、2.1、5.1、6、7.1、12.1 节：PA 内切酶机制、单次口服、48 小时窗与多价阳离子避用。",
      },
      {
        title: "CDC · 流感抗病毒治疗（2026 更新）",
        url: "https://www.cdc.gov/flu/hcp/antivirals/summary-clinicians.html",
        sections: "住院、重症及高危人群的奥司他韦优先地位及超过 48 小时启动获益。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "fluconazole-vs-caspofungin-vs-terbinafine",
    title: "抗真菌药三大靶点对照：氟康唑 vs 卡泊芬净 vs 特比萘芬",
    summary: "三药分别拦截真菌细胞膜的麦角固醇下游合成、细胞壁葡聚糖组装及麦角固醇上游角鲨烯环氧化，决定了各自的深部/浅部抗菌谱与肝肾药物相互作用。",
    drugIds: ["fluconazole", "caspofungin", "terbinafine"],
    rows: [
      {
        quizId: "fungal-target",
        quizExplanation: "氟康唑（吡咯/三唑类）抑制麦角固醇下游合成关键酶羊毛甾醇 14α-去甲基化酶；卡泊芬净（棘白菌素类）直接破坏真菌特有细胞壁成分 β-(1,3)-D-葡聚糖合成；特比萘芬（丙烯胺类）阻断麦角固醇上游角鲨烯环氧化酶，导致毒性角鲨烯蓄积。",
        label: "真菌细胞膜 vs 细胞壁靶点",
        values: [
          "抑制羊毛甾醇 14α-去甲基化酶，阻断细胞膜麦角固醇下游合成（三唑类）",
          "抑制真菌细胞壁 β-(1,3)-D-葡聚糖合成酶，破坏细胞壁结构（棘白菌素类）",
          "抑制角鲨烯环氧化酶，致细胞内角鲨烯毒性蓄积并耗竭麦角固醇（丙烯胺类）",
        ],
      },
      {
        quizId: "spectrum-and-route",
        quizExplanation: "氟康唑口服生物利用度高且有静脉剂型，覆盖敏感念珠菌与隐球菌（但对曲霉菌无效）；卡泊芬净仅供静脉输注，覆盖念珠菌血症及耐药/不耐受侵袭性曲霉病（但对隐球菌缺乏临床有效活性）；特比萘芬口服专攻皮肤癣菌甲真菌病。",
        label: "给药途径与核心抗真菌谱",
        values: [
          "口服或静脉；覆盖黏膜/系统性念珠菌与隐球菌，对曲霉菌通常无效",
          "仅静脉输注；覆盖念珠菌血症、侵袭性念珠菌及经治曲霉病，不常规覆盖隐球菌",
          "口服片（亦有外用制剂）；聚焦皮肤癣菌所致的指/趾甲真菌病",
        ],
      },
      {
        quizId: "cyp-and-qt-risk",
        quizExplanation: "氟康唑强/中效抑制 CYP2C9、CYP2C19 与 CYP3A4 且可致 QT 延长，经肾排泄为主需按肾功调量；卡泊芬净主要经自发降解及肽水解消除、极少影响 CYP，但需警惕组胺介导输注反应；特比萘芬主要抑制 CYP2D6。",
        label: "CYP 相互作用与心电/输注风险",
        values: [
          "抑制 CYP2C9/2C19/3A4 且致 QT 延长；经肾排泄为主，肾损须调量",
          "不经主要 CYP 通路消除；可致组胺介导输注反应（潮红/支气管痉挛），合用环孢素需监护",
          "显著抑制 CYP2D6（影响经 2D6 代谢药如部分三环类/β 阻滞剂）；无典型 QT 警示",
        ],
      },
      {
        quizId: "distinct-adverse",
        quizExplanation: "三药均需监测肝功能，但特比萘芬口服片对慢性或活动性肝病直接列为禁忌并具长期味/嗅觉丧失警示；卡泊芬净需注意静脉炎及低钾血症；氟康唑长期高剂量需关注妊娠致畸风险。",
        label: "肝脏禁忌与特征性不良反应",
        values: [
          "肝损伤及高剂量长期用药的妊娠致畸风险，偶见严重药疹",
          "转氨酶升高、发热、静脉炎及低钾血症",
          "慢性或活动性肝病禁用口服片；可致持久的味觉或嗅觉障碍及中性粒细胞减少",
        ],
      },
      {
        label: "共同的肝功能监测与诊断边界",
        values: [
          "均需留意肝损伤表现，使用前宜明确真菌学依据或规范临床指征（避免盲目经验混用）",
          "均需留意肝损伤表现，使用前宜明确真菌学依据或规范临床指征（避免盲目经验混用）",
          "均需留意肝损伤表现，使用前宜明确真菌学依据或规范临床指征（避免盲目经验混用）",
        ],
      },
    ],
    takeaways: [
      "记三大靶点分层：「氟康唑抑膜下游、打念珠菌与隐球菌；卡泊芬净破壁葡聚糖、打重症念珠菌与曲霉；特比萘芬抑膜上游、口服治皮肤癣菌甲病」。",
      "口服特比萘芬前先明确真菌学诊断并查基线肝功能（活动性/慢性肝病禁用），同时叮嘱出现味嗅觉异常及时就诊。",
      "氟康唑选药必核查心电图 QT、肾功能肌酐清除率及多种 CYP2C9/2C19/3A4 合并用药。",
    ],
    scenarios: [
      "敏感念珠菌口腔/食管炎或隐球菌脑膜炎巩固维持治疗时，常评估口服或静脉氟康唑。",
      "重症念珠菌血症、粒细胞缺乏伴发热疑似深部真菌感染或经治不耐受的侵袭性曲霉病时，常静脉评估卡泊芬净；皮肤癣菌确诊甲真菌病（肝功能正常）时，常评估口服特比萘芬。",
    ],
    sources: [
      {
        title: "氟康唑说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=98ac5455-d26c-4780-a5a3-bf8d85917626",
        sections: "药理、适应症、警告与不良反应：14α-去甲基化酶抑制、念珠菌/隐球菌、CYP 抑制、QT 延长与肾功调整。",
      },
      {
        title: "CANCIDAS（caspofungin acetate）说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3bad23a6-09a6-4194-9182-093ed61bc71c",
        sections: "第 1、2、5、6、7、12.1 节：β-(1,3)-D-葡聚糖合成抑制、侵袭性念珠菌/曲霉病及组胺输注反应。",
      },
      {
        title: "DailyMed：Terbinafine 口服片说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=5de4c245-7086-453b-b90a-7a1242ec2c0b&version=9",
        sections: "第 1、4～7、12.4 节：角鲨烯环氧化酶抑制、甲真菌病、肝病禁忌、味嗅觉障碍与 CYP2D6 抑制。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "gefitinib-vs-osimertinib",
    title: "EGFR 靶向代际迭代：吉非替尼 vs 奥希替尼",
    summary: "吉非替尼（第一代可逆 TKI）与奥希替尼（第三代不可逆共价 TKI）均靶向 EGFR 敏感突变 NSCLC，但后者克服 T790M 耐药突变并兼具说明书证实的中枢神经系统（CNS）分布与颅内活性。",
    drugIds: ["gefitinib", "osimertinib"],
    rows: [
      {
        quizId: "binding-and-generation",
        quizExplanation: "吉非替尼是第一代可逆竞争性 EGFR 酪氨酸激酶抑制剂；奥希替尼为第三代不可逆 EGFR-TKI，可与 EGFR 激酶域 Cys797 位点形成共价键持久抑制。",
        label: "药物代际与激酶结合方式",
        values: [
          "第一代 EGFR-TKI，可逆性抑制 EGFR 酪氨酸激酶活性",
          "第三代 EGFR-TKI，不可逆共价结合并持久抑制 EGFR 酪氨酸激酶",
        ],
      },
      {
        quizId: "t790m-and-indication-scope",
        quizExplanation: "一代 TKI 治疗进展后约半数由继发 EGFR T790M 突变介导耐药，吉非替尼对其无效；奥希替尼不仅获批 T790M 阳性二线治疗，还覆盖敏感突变（19del/L858R）转移性一线单药或联合化疗及术后辅助治疗。",
        label: "T790M 耐药突变覆盖与治疗线数",
        values: [
          "针对 19 外显子缺失或 21 L858R 转移性 NSCLC，对 T790M 耐药突变无效",
          "同时覆盖 19del/L858R（辅助/一线单药或联合）及既往 TKI 进展后的 T790M 耐药突变",
        ],
      },
      {
        quizId: "cns-penetration",
        quizExplanation: "根据 TAGRISSO（奥希替尼）美国官方说明书药理与临床研究数据，奥希替尼可分布进入脑组织并在基线伴 CNS/脑转移患者中展现出明确颅内客观缓解率；吉非替尼透过血脑屏障能力相对受限。",
        label: "说明书证实的中枢/脑转移分布与活性",
        values: [
          "血脑屏障穿透相对有限，所引说明书未将颅内分布与脑转移缓解作为核心特征",
          "药理证实分布至脑组织，临床试验显示对伴 CNS/脑转移患者具明确颅内客观缓解",
        ],
      },
      {
        quizId: "cardiac-and-distinct-risk",
        quizExplanation: "两药均需严密警惕间质性肺病（ILD）及腹泻皮疹；在此之外，吉非替尼需重点监测肝转氨酶升高/肝损伤及少见胃肠穿孔，奥希替尼则带明确 QTc 间期延长及心肌病/左室射血分数（LVEF）下降监测要求。",
        label: "心电/心功能 vs 肝脏重点监测差异",
        values: [
          "常规治疗中突出定期监测肝功能，并留意眼部刺激与少见胃肠穿孔",
          "突出基线及定期心电图 QTc 监测与左室射血分数（LVEF）评估（防心肌病），兼防甲沟炎/角膜炎",
        ],
      },
      {
        label: "共同的分子检测与肺毒性边界",
        values: [
          "均须经获批检测确认 EGFR 突变方可用药；均需严防致命性间质性肺病（ILD）/非感染性肺炎",
          "均须经获批检测确认 EGFR 突变方可用药；均需严防致命性间质性肺病（ILD）/非感染性肺炎",
        ],
      },
    ],
    takeaways: [
      "记「一代可逆怕 T790M，三代共价破 T790M 且入脑护颅内」。",
      "使用任一 EGFR-TKI 期间出现新发或加重咳嗽、气短、发热，均须立即排查间质性肺病（ILD）并及时暂停评估。",
      "奥希替尼多了「心脏双查（QTc + LVEF 心功能）」；吉非替尼多了「肝酶复查与 CYP3A4/胃酸 pH 影响核对」。",
    ],
    scenarios: [
      "EGFR 19 外显子缺失或 21 L858R 阳性早期术后辅助、一线（尤其伴脑/CNS 转移风险时），或一代/二代 TKI 耐药后检出 T790M 突变时，常评估奥希替尼。",
      "部分药物可及性或特定方案中针对未检测出 T790M 的 EGFR 敏感突变转移性 NSCLC 初始治疗（无严重肝病时），可评估吉非替尼。",
    ],
    sources: [
      {
        title: "吉非替尼口服片说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1a3c0ce7-06a1-4e04-9106-14ddb2a866a5",
        sections: "第 1、2.1、5、6、12.1 节：可逆 EGFR 抑制、19del/L858R 转移性用途及 ILD、肝损风险。",
      },
      {
        title: "TAGRISSO（osimertinib）说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=5e81b4a7-b971-45e1-9c31-29cea8c87ce7",
        sections: "第 1、2.1、5.1～5.6、6、12.1、14 节：不可逆共价结合、T790M 与辅助/一线定位、脑分布及 CNS 缓解、QTc/心肌病风险。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
  {
    id: "fexofenadine-vs-cromoglicate-vs-epinephrine",
    title: "抗过敏与急救层级：非索非那定 vs 色甘酸钠 vs 肾上腺素",
    summary: "三药横跨过敏反应的「下游受体症状阻断」「上游肥大细胞预防稳定」与「危及生命的全身过敏休克急救」三个完全不可互换的临床层级。",
    drugIds: ["fexofenadine", "cromoglicate", "epinephrine"],
    rows: [
      {
        quizId: "allergy-cascade-target",
        quizExplanation: "非索非那定在肥大细胞脱颗粒之后拮抗组胺结合外周 H1 受体；色甘酸钠在脱颗粒之前稳定肥大细胞膜阻止介质释放；肾上腺素通过激动 α 和 β 肾上腺素受体直接逆转全身血管扩张、低血压与支气管痉挛。",
        label: "过敏通路作用环节与靶点",
        values: [
          "下游介质阻断：外周选择性拮抗组胺 H1 受体（极少入脑）",
          "上游脱颗粒预防：稳定肥大细胞膜，抑制致敏细胞释放组胺与白三烯等介质",
          "生理功能逆转：激动 α/β 肾上腺素能受体，升压、缩血管并强力舒张支气管",
        ],
      },
      {
        quizId: "emergency-vs-prophylaxis",
        quizExplanation: "严重全身过敏反应/过敏性休克必须立即肌注肾上腺素作为唯一一线救命药；非索非那定仅能缓解鼻炎/荨麻疹皮肤瘙痒等非危及生命症状，不能逆转休克气道水肿；色甘酸钠起效慢，纯属预防性用药，禁用于急性喘息急救。",
        label: "过敏性休克急救 vs 日常预防/对症定位",
        values: [
          "口服症状缓解药：用于季节性过敏性鼻炎与慢性特发性荨麻疹，不可替代休克急救",
          "纯局部预防药：用于哮喘或过敏性结膜炎预防，起效慢，绝对不可用于急性发作急救",
          "一线急救抢救药：唯一用于严重全身过敏反应及过敏性休克的紧急一线治疗",
        ],
      },
      {
        quizId: "route-and-special-caution",
        quizExplanation: "非索非那定经口服且受 OATP 转运体影响，与西柚/橙/苹果汁或铝镁制酸剂同服可明显降低吸收；色甘酸钠以雾化吸入或滴眼局部起效（偶致短暂呛咳/刺激）；肾上腺素自动注射器须快速大腿前外侧肌注，误注入指趾可致缺血。",
        label: "给药方式与关键用药细节",
        values: [
          "口服片；不可与西柚/橙/苹果汁或含铝镁制酸剂同服（显著降低暴露量）",
          "吸入雾化或滴眼局部给药；吸入偶发一过性咽喉刺激或短暂支气管痉挛",
          "肌内自动注射（大腿前外侧），注射后仍需立即拨打急救并观察双相反应",
        ],
      },
      {
        label: "共同的急救延误红线",
        values: [
          "出现喉头水肿、呼吸困难或血压下降等严重过敏反应时，绝不可仅依赖抗组胺药或肥大细胞稳定剂延误肾上腺素注射",
          "出现喉头水肿、呼吸困难或血压下降等严重过敏反应时，绝不可仅依赖抗组胺药或肥大细胞稳定剂延误肾上腺素注射",
          "出现喉头水肿、呼吸困难或血压下降等严重过敏反应时，绝不可仅依赖抗组胺药或肥大细胞稳定剂延误肾上腺素注射",
        ],
      },
      {
        label: "共同的不良反应监测边界",
        values: [
          "需结合剂型及心血管、气道或个体耐受反应核对具体说明书警告",
          "需结合剂型及心血管、气道或个体耐受反应核对具体说明书警告",
          "需结合剂型及心血管、气道或个体耐受反应核对具体说明书警告",
        ],
      },
    ],
    takeaways: [
      "记「红绿灯」三层定位：红灯休克救命用肾上腺素；黄灯预先筑墙防脱颗粒用色甘酸钠；绿灯日常止痒消风团用非索非那定。",
      "非索非那定千万用白水送服——果汁（苹果/橙/西柚）和含铝镁抗酸剂都会把药效「拦截」在肠道外。",
      "抗组胺药不能逆转严重过敏时的低血压和致命支气管痉挛，严重过敏发作第一针永远是肾上腺素。",
    ],
    scenarios: [
      "发生食物、药物或蜂毒引起的呼吸困难、喉鸣、全身荨麻疹伴低血压等严重全身过敏反应时，必须立即使用肾上腺素自动注射器。",
      "季节性过敏性鼻炎或慢性特发性荨麻疹需较少嗜睡的口服控制时，常评估非索非那定；过敏性结膜炎或运动/冷空气诱发支气管痉挛提前预防时，可评估色甘酸钠。",
    ],
    sources: [
      {
        title: "Telfast（fexofenadine hydrochloride）120 mg 片说明书 · emc",
        url: "https://www.medicines.org.uk/emc/product/1433/smpc",
        sections: "第 4.1、4.4、4.5、4.8、5.1 节：外周 H1 拮抗、鼻炎/荨麻疹及少镇静特征。",
      },
      {
        title: "Fexofenadine Hydrochloride 片说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=d7fe71e4-aada-40f5-86a8-bf0d7eb9b851",
        sections: "药物相互作用章节：西柚/橙/苹果汁与含铝镁制酸剂显著降低非索非那定血药暴露。",
      },
      {
        title: "Cromolyn Sodium 吸入雾化溶液说明书 · DailyMed",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=0209cd6c-5c43-0b93-e063-6294a90ac964",
        sections: "适应症、临床药理与警告：肥大细胞膜稳定机制、纯预防定位及急性发作禁用。",
      },
      {
        title: "DailyMed：EPIPEN（epinephrine）自动注射器说明书",
        url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=311af6d9-20c0-4b87-b236-4185bfa49988",
        sections: "第 1、5～6、12.1～12.2 节：严重过敏休克一线急救、α/β 受体激动及大腿前外侧肌注。",
      },
    ],
    sourcesCheckedOn: "2026-11-24",
  },
];
