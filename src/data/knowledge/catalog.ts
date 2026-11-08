export type KnowledgeKind = "term" | "syndrome" | "formula" | "herb";

export type KnowledgeRelation = {
  slug: string;
  kind: KnowledgeKind;
  label: string;
  relation: string;
};

export type KnowledgeFact = {
  label: string;
  value: string;
};

export type KnowledgeSection = {
  title: string;
  points: string[];
};

export type KnowledgeEntry = {
  id: string;
  slug: string;
  kind: KnowledgeKind;
  title: string;
  aliases?: string[];
  summary: string;
  facts?: KnowledgeFact[];
  sections?: KnowledgeSection[];
  tags?: string[];
  relations?: KnowledgeRelation[];
  featured?: boolean;
};

export const knowledgeKindLabels: Record<KnowledgeKind, string> = {
  term: "术语",
  syndrome: "证候",
  formula: "方意",
  herb: "药材",
};

export const knowledgeEntries: KnowledgeEntry[] = [
  {
    id: "term-yin-yang",
    slug: "yin-yang",
    kind: "term",
    title: "阴阳",
    aliases: ["阴阳理论"],
    summary: "中医最基础的判断框架，用来概括事物的寒热、动静、升降、内外等对立统一关系。",
    facts: [
      { label: "核心含义", value: "对立、互根、消长、转化" },
      { label: "常见应用", value: "寒热判断、虚实偏向、调养方向" },
    ],
    sections: [
      {
        title: "怎么理解",
        points: [
          "寒、静、内、下、多偏阴；热、动、外、上、多偏阳。",
          "临床不是只看一个症状，而是看整体偏性与动态变化。",
        ],
      },
      {
        title: "在系统中的作用",
        points: [
          "知识库中多数证候、治则与调理建议，都可以回到阴阳偏颇去理解。",
          "问诊结果中的“寒热、虚实”表述，本质上是阴阳失衡的具体化。",
        ],
      },
    ],
    tags: ["基础理论", "辨证"],
    relations: [
      { slug: "ba-gang", kind: "term", label: "八纲", relation: "展开为" },
      { slug: "yin-xu-nei-re", kind: "syndrome", label: "阴虚内热", relation: "常见偏向" },
      { slug: "yang-xu-han-shi", kind: "syndrome", label: "阳虚寒湿", relation: "常见偏向" },
    ],
    featured: true,
  },
  {
    id: "term-zang-xiang",
    slug: "zang-xiang",
    kind: "term",
    title: "藏象",
    summary: "通过脏腑功能与外在征象的对应关系来理解机体状态，是“由外知内”的重要基础。",
    facts: [
      { label: "观察入口", value: "神色、舌象、声音、食欲、睡眠、二便" },
      { label: "常用场景", value: "问诊、望诊、体质评估" },
    ],
    sections: [
      {
        title: "怎么理解",
        points: [
          "“藏”偏指内在功能系统，“象”偏指外显征象与变化。",
          "舌质、舌苔、情志、纳差、便溏等，都是藏象判断的外在窗口。",
        ],
      },
    ],
    tags: ["基础理论", "望诊"],
    relations: [
      { slug: "si-zhen", kind: "term", label: "四诊", relation: "常与之配合" },
      { slug: "constitution-assessment", kind: "term", label: "体质评估", relation: "可延伸到" },
    ],
  },
  {
    id: "term-si-zhen",
    slug: "si-zhen",
    kind: "term",
    title: "四诊",
    aliases: ["望闻问切"],
    summary: "望、闻、问、切合参，信息越完整，辨证越稳健。",
    facts: [
      { label: "组成", value: "望诊、闻诊、问诊、切诊" },
      { label: "系统映射", value: "主诉输入、舌象、问卷、结构化追问" },
    ],
    sections: [
      {
        title: "在本系统中的体现",
        points: [
          "体质辨识模块主要承接舌象与问卷。",
          "智诊辅助模块则把主诉、补充四诊摘要和图谱推理组合起来。",
        ],
      },
    ],
    tags: ["诊法", "问诊"],
    relations: [
      { slug: "ba-gang", kind: "term", label: "八纲", relation: "用于归纳到" },
      { slug: "tongue-diagnosis", kind: "term", label: "舌诊", relation: "重点组成" },
    ],
    featured: true,
  },
  {
    id: "term-ba-gang",
    slug: "ba-gang",
    kind: "term",
    title: "八纲",
    summary: "阴、阳、表、里、寒、热、虚、实，是辨证时最常用的提纲。",
    facts: [
      { label: "作用", value: "先定大方向，再细分病机" },
      { label: "常见输出", value: "表热、里寒、虚热、实热等" },
    ],
    sections: [
      {
        title: "怎么用",
        points: [
          "先看病位是表还是里，再看病性偏寒偏热、偏虚偏实。",
          "八纲不是终点，而是把复杂症状先归纳成可操作的框架。",
        ],
      },
    ],
    tags: ["辨证", "提纲"],
    relations: [
      { slug: "yin-yang", kind: "term", label: "阴阳", relation: "总摄于" },
      { slug: "symptom-pattern", kind: "term", label: "证候", relation: "常用于归纳" },
    ],
  },
  {
    id: "term-qi-blood-fluid",
    slug: "qi-blood-fluid",
    kind: "term",
    title: "气血津液",
    summary: "气、血、津液是人体运行与滋养的基本物质基础，也是很多证候分析的核心。",
    facts: [
      { label: "常见失调", value: "气虚、气滞、血瘀、津亏、痰湿" },
      { label: "表现入口", value: "疲乏、胸闷、口干、痰多、舌苔变化" },
    ],
    sections: [
      {
        title: "在临床中的提示",
        points: [
          "痰湿、血瘀、气郁等证候，本质上都和气血津液运行失衡有关。",
          "知识图谱中的症状—证候—方意链，也经常围绕这三者展开。",
        ],
      },
    ],
    tags: ["基础理论", "病机"],
    relations: [
      { slug: "tan-shi-nei-zu", kind: "syndrome", label: "痰湿内阻", relation: "常见失调" },
      { slug: "qi-zhi-xue-yu", kind: "syndrome", label: "气滞血瘀", relation: "常见失调" },
    ],
  },
  {
    id: "term-jun-chen-zuo-shi",
    slug: "jun-chen-zuo-shi",
    kind: "term",
    title: "君臣佐使",
    summary: "方剂配伍结构，用来说明一张方子里各药物在主次、协同和引导上的分工。",
    facts: [
      { label: "用途", value: "理解方意，不是机械记忆" },
      { label: "系统呈现", value: "方意卡与图谱中的药材组成" },
    ],
    sections: [
      {
        title: "怎么理解",
        points: [
          "君药解决核心病机，臣佐使围绕增强、纠偏或引经发挥作用。",
          "系统里的“君药示意”主要用于帮助用户理解方意，不等同正式处方。",
        ],
      },
    ],
    tags: ["方剂", "配伍"],
    relations: [
      { slug: "xiao-yao-san", kind: "formula", label: "逍遥散", relation: "可用来理解" },
      { slug: "er-chen-tang", kind: "formula", label: "二陈汤", relation: "可用来理解" },
    ],
    featured: true,
  },
  {
    id: "term-symptom-pattern",
    slug: "symptom-pattern",
    kind: "term",
    title: "证候",
    aliases: ["证型"],
    summary: "疾病在某一阶段病因、病位、病性和正邪关系的综合概括，是中医论治的依据。",
    facts: [
      { label: "和病名区别", value: "病名偏西医或疾病标签，证候偏当前病机状态" },
      { label: "系统输出", value: "智诊结果中的主要证候标签" },
    ],
    sections: [
      {
        title: "为什么重要",
        points: [
          "同一病名可见不同证候，所以建议与调理方向不能只看疾病名称。",
          "系统中的图谱检索先找证候，再连接治则、方意与建议。",
        ],
      },
    ],
    tags: ["辨证", "核心概念"],
    relations: [
      { slug: "gan-yu-pi-xu", kind: "syndrome", label: "肝郁脾虚", relation: "示例证候" },
      { slug: "shu-shi-jia-re", kind: "syndrome", label: "暑湿夹热", relation: "示例证候" },
    ],
  },
  {
    id: "term-zhi-wei-bing",
    slug: "zhi-wei-bing",
    kind: "term",
    title: "治未病",
    summary: "未病先防、既病防变、瘥后防复，是中医长期健康管理的核心理念。",
    facts: [
      { label: "系统关联", value: "体质辨识、健康档案、阶段复评" },
      { label: "用户价值", value: "从一次性问答延伸到持续调养" },
    ],
    sections: [
      {
        title: "为什么和知识库有关",
        points: [
          "知识库不只是解释结果，也承担帮助用户形成自我管理认知的作用。",
          "术语、证候和调理建议被串起来后，用户更容易理解“为什么这样调”。",
        ],
      },
    ],
    tags: ["养生", "长期管理"],
    relations: [
      { slug: "constitution-assessment", kind: "term", label: "体质评估", relation: "常作为入口" },
      { slug: "overall-view", kind: "term", label: "整体观念", relation: "相互支撑" },
    ],
  },
  {
    id: "term-overall-view",
    slug: "overall-view",
    kind: "term",
    title: "整体观念",
    summary: "强调人体内部、人与自然、人与生活方式之间的整体联系，是中医理解复杂症状的重要思路。",
    facts: [
      { label: "系统体现", value: "体质先验、主诉、舌象、时令因素联合判断" },
      { label: "常见场景", value: "多模态评估、图谱推理、个性化调理" },
    ],
    sections: [
      {
        title: "在系统中的表现",
        points: [
          "同一条主诉会受到体质、时令、饮食与情志线索的共同影响。",
          "知识库的关联关系卡，正是为了让用户看到这种“不是孤立看问题”的思路。",
        ],
      },
    ],
    tags: ["基础理论", "方法论"],
    relations: [
      { slug: "si-zhen", kind: "term", label: "四诊", relation: "常配合使用" },
      { slug: "zhi-wei-bing", kind: "term", label: "治未病", relation: "常延伸到" },
    ],
  },
  {
    id: "syndrome-gan-yu-pi-xu",
    slug: "gan-yu-pi-xu",
    kind: "syndrome",
    title: "肝郁脾虚",
    summary: "情志不舒与脾胃运化受阻并见，常见胸胁不舒、饭后腹胀、纳差、困倦等表现。",
    facts: [
      { label: "常见主诉", value: "胸闷胁胀、饭后腹胀、食欲下降、情绪波动" },
      { label: "常用治则", value: "疏肝健脾，理气和中" },
    ],
    sections: [
      {
        title: "识别线索",
        points: [
          "症状往往和压力、情绪波动、饮食不规律同时出现。",
          "既有气机不舒的表现，也有脾胃运化偏弱的表现。",
        ],
      },
    ],
    tags: ["证候", "情志", "脾胃"],
    relations: [
      { slug: "xiao-yao-san", kind: "formula", label: "逍遥散", relation: "常见方意" },
      { slug: "chai-hu", kind: "herb", label: "柴胡", relation: "常见药材" },
      { slug: "si-zhen", kind: "term", label: "四诊", relation: "需合参判断" },
    ],
    featured: true,
  },
  {
    id: "syndrome-pi-wei-qi-xu",
    slug: "pi-wei-qi-xu",
    kind: "syndrome",
    title: "脾胃气虚",
    summary: "多见疲乏、食欲差、饭后胀、便溏、恢复慢等，偏向脾胃运化功能不足。",
    facts: [
      { label: "常见主诉", value: "乏力、纳差、饭后困、便软" },
      { label: "常用治则", value: "健脾益气，和胃助运" },
    ],
    sections: [
      {
        title: "识别线索",
        points: [
          "劳倦、作息紊乱或病后恢复不足时更常见。",
          "相比单纯情志因素，更偏向体力下降和运化弱。",
        ],
      },
    ],
    tags: ["证候", "气虚", "脾胃"],
    relations: [
      { slug: "si-jun-zi-tang", kind: "formula", label: "四君子汤", relation: "常见方意" },
      { slug: "dang-shen", kind: "herb", label: "党参", relation: "常见药材" },
    ],
  },
  {
    id: "syndrome-tan-shi-nei-zu",
    slug: "tan-shi-nei-zu",
    kind: "syndrome",
    title: "痰湿内阻",
    summary: "常见痰多、困重、头重、胸闷、腹胀、口中黏腻等，偏向湿浊停聚。",
    facts: [
      { label: "常见主诉", value: "痰多、头重、身体困重、口黏、腹胀" },
      { label: "常用治则", value: "燥湿化痰，理气和中" },
    ],
    sections: [
      {
        title: "识别线索",
        points: [
          "和久坐、甜腻饮食、运动少等生活方式关系较大。",
          "舌苔偏厚、偏腻时常作为加重这一判断的辅助线索。",
        ],
      },
    ],
    tags: ["证候", "痰湿", "脾胃"],
    relations: [
      { slug: "er-chen-tang", kind: "formula", label: "二陈汤", relation: "常见方意" },
      { slug: "ban-xia", kind: "herb", label: "半夏", relation: "常见药材" },
      { slug: "tongue-diagnosis", kind: "term", label: "舌诊", relation: "常作为辅助判断" },
    ],
  },
  {
    id: "syndrome-shu-shi-jia-re",
    slug: "shu-shi-jia-re",
    kind: "syndrome",
    title: "暑湿夹热",
    summary: "多见于高温、闷热或暴晒后出现发热、纳差、口渴、小便黄等短期急性不适。",
    facts: [
      { label: "常见主诉", value: "发热、口渴、胃口差、小便黄、身重困倦" },
      { label: "常用治则", value: "清暑解表，化湿和中" },
    ],
    sections: [
      {
        title: "识别线索",
        points: [
          "常见于夏季、闷热环境或暴晒后症状加重。",
          "和长期体虚不同，更偏短期外感或暑湿侵袭。 ",
        ],
      },
    ],
    tags: ["证候", "外感", "暑湿"],
    relations: [
      { slug: "xin-jia-xiang-ru-yin", kind: "formula", label: "新加香薷饮", relation: "常见方意" },
      { slug: "huo-xiang", kind: "herb", label: "藿香", relation: "常见药材" },
    ],
  },
  {
    id: "syndrome-shi-re-yun-jie",
    slug: "shi-re-yun-jie",
    kind: "syndrome",
    title: "湿热蕴结",
    summary: "热与湿并见，常见口苦口黏、尿黄、痤疮、纳差、腹胀或大便黏滞不爽。",
    facts: [
      { label: "常见主诉", value: "口苦、尿黄、纳差、困重、痘疹" },
      { label: "常用治则", value: "清利湿热，和中醒脾" },
    ],
    sections: [
      {
        title: "识别线索",
        points: [
          "饮食肥甘辛辣、夜宵饮酒或熬夜常是加重因素。",
          "外在表现往往带有“热象 + 黏滞不爽”的双重特点。",
        ],
      },
    ],
    tags: ["证候", "湿热"],
    relations: [
      { slug: "gan-lu-xiao-du-dan", kind: "formula", label: "甘露消毒丹", relation: "常见方意" },
      { slug: "huang-qin", kind: "herb", label: "黄芩", relation: "常见药材" },
    ],
  },
  {
    id: "syndrome-yin-xu-nei-re",
    slug: "yin-xu-nei-re",
    kind: "syndrome",
    title: "阴虚内热",
    summary: "多见口干、睡眠浅、烦热、午后热感或大便偏干，偏向津液不足、虚热内扰。",
    facts: [
      { label: "常见主诉", value: "口干、心烦、睡浅、多梦、便干" },
      { label: "常用治则", value: "养阴清热，宁心润燥" },
    ],
    sections: [
      {
        title: "识别线索",
        points: [
          "长期熬夜、耗神过度或恢复不足时更常见。",
          "和单纯实热不同，往往伴随“虚”“干”“耗”的背景。",
        ],
      },
    ],
    tags: ["证候", "阴虚"],
    relations: [
      { slug: "zhi-bai-di-huang-wan", kind: "formula", label: "知柏地黄丸", relation: "常见方意" },
      { slug: "shu-di-huang", kind: "herb", label: "熟地黄", relation: "常见药材" },
    ],
  },
  {
    id: "syndrome-yang-xu-han-shi",
    slug: "yang-xu-han-shi",
    kind: "syndrome",
    title: "阳虚寒湿",
    summary: "多见怕冷、便溏、腹部喜温、乏力或肢体困重，偏向温煦推动不足。",
    facts: [
      { label: "常见主诉", value: "怕冷、手足凉、便溏、腹部冷、乏力" },
      { label: "常用治则", value: "温阳健脾，散寒化湿" },
    ],
    sections: [
      {
        title: "识别线索",
        points: [
          "受凉、久病体虚或恢复不足常是背景因素。",
          "和阴虚内热相反，更偏冷、缓、弱。",
        ],
      },
    ],
    tags: ["证候", "阳虚", "寒湿"],
    relations: [
      { slug: "li-zhong-tang", kind: "formula", label: "理中汤", relation: "常见方意" },
      { slug: "gan-jiang", kind: "herb", label: "干姜", relation: "常见药材" },
    ],
  },
  {
    id: "syndrome-qi-zhi-xue-yu",
    slug: "qi-zhi-xue-yu",
    kind: "syndrome",
    title: "气滞血瘀",
    summary: "多见固定性不适、刺痛、久痛或情绪紧张后症状加重，偏向气机郁滞日久、血行不畅。",
    facts: [
      { label: "常见主诉", value: "固定痛、刺痛、夜间加重、情绪相关" },
      { label: "常用治则", value: "理气活血，通络止痛" },
    ],
    sections: [
      {
        title: "识别线索",
        points: [
          "病程较长、部位较固定，和久坐或情绪紧张常有相关性。",
          "需要和单纯气郁、单纯疼痛做区分。",
        ],
      },
    ],
    tags: ["证候", "气滞", "血瘀"],
    relations: [
      { slug: "xue-fu-zhu-yu-tang", kind: "formula", label: "血府逐瘀汤", relation: "常见方意" },
      { slug: "dang-gui", kind: "herb", label: "当归", relation: "常见药材" },
    ],
  },
  {
    id: "formula-xiao-yao-san",
    slug: "xiao-yao-san",
    kind: "formula",
    title: "逍遥散",
    summary: "常用于肝郁脾虚方向的方意理解，强调疏肝与健脾并举。",
    facts: [
      { label: "方意核心", value: "疏肝、养血、健脾、和中" },
      { label: "常见关联", value: "肝郁脾虚、情志不舒、饭后腹胀" },
    ],
    sections: [
      {
        title: "如何理解它在系统中的角色",
        points: [
          "系统输出的是“方意示意”，帮助理解治法方向，不直接等同临床处方。",
          "用户更应该把它看成“为什么会推荐这个调理思路”的说明。",
        ],
      },
    ],
    tags: ["方剂", "肝脾同调"],
    relations: [
      { slug: "gan-yu-pi-xu", kind: "syndrome", label: "肝郁脾虚", relation: "常对应证候" },
      { slug: "chai-hu", kind: "herb", label: "柴胡", relation: "常见药材" },
      { slug: "bai-zhu", kind: "herb", label: "白术", relation: "常见药材" },
    ],
    featured: true,
  },
  {
    id: "formula-si-jun-zi-tang",
    slug: "si-jun-zi-tang",
    kind: "formula",
    title: "四君子汤",
    summary: "常用于脾胃气虚方向的方意理解，强调健脾益气、扶助运化。",
    facts: [
      { label: "方意核心", value: "补气健脾" },
      { label: "常见关联", value: "疲乏、纳差、便软、病后恢复慢" },
    ],
    sections: [
      {
        title: "在知识库中的作用",
        points: [
          "帮助用户理解“为什么这类体力下降和纳差，会落到健脾益气方向”。",
        ],
      },
    ],
    tags: ["方剂", "气虚"],
    relations: [
      { slug: "pi-wei-qi-xu", kind: "syndrome", label: "脾胃气虚", relation: "常对应证候" },
      { slug: "dang-shen", kind: "herb", label: "党参", relation: "常见药材" },
      { slug: "fu-ling", kind: "herb", label: "茯苓", relation: "常见药材" },
    ],
  },
  {
    id: "formula-er-chen-tang",
    slug: "er-chen-tang",
    kind: "formula",
    title: "二陈汤",
    summary: "常用于痰湿方向的方意理解，强调燥湿化痰、理气和中。",
    facts: [
      { label: "方意核心", value: "燥湿化痰，理气和胃" },
      { label: "常见关联", value: "痰多、头重、胸闷、腹胀、困重" },
    ],
    sections: [
      {
        title: "如何看待系统中的呈现",
        points: [
          "这类方意对用户最重要的价值，是帮助理解“痰湿为什么会导致头重、困和胀”。",
        ],
      },
    ],
    tags: ["方剂", "痰湿"],
    relations: [
      { slug: "tan-shi-nei-zu", kind: "syndrome", label: "痰湿内阻", relation: "常对应证候" },
      { slug: "ban-xia", kind: "herb", label: "半夏", relation: "常见药材" },
      { slug: "chen-pi", kind: "herb", label: "陈皮", relation: "常见药材" },
    ],
  },
  {
    id: "formula-xin-jia-xiang-ru-yin",
    slug: "xin-jia-xiang-ru-yin",
    kind: "formula",
    title: "新加香薷饮",
    summary: "常用于暑湿夹热方向的方意理解，偏向清暑、化湿、和中。",
    facts: [
      { label: "方意核心", value: "清暑化湿，解表和中" },
      { label: "常见关联", value: "发热、暑热、纳差、小便黄、身重" },
    ],
    sections: [
      {
        title: "适合什么场景理解",
        points: [
          "适合用来解释夏季闷热、暴晒后出现的急性不适为什么会落到“暑湿夹热”。",
        ],
      },
    ],
    tags: ["方剂", "暑湿"],
    relations: [
      { slug: "shu-shi-jia-re", kind: "syndrome", label: "暑湿夹热", relation: "常对应证候" },
      { slug: "huo-xiang", kind: "herb", label: "藿香", relation: "常见药材" },
      { slug: "pei-lan", kind: "herb", label: "佩兰", relation: "常见药材" },
    ],
  },
  {
    id: "formula-gan-lu-xiao-du-dan",
    slug: "gan-lu-xiao-du-dan",
    kind: "formula",
    title: "甘露消毒丹",
    summary: "常用于湿热偏盛方向的方意理解，重在清利湿热、芳香化浊。",
    facts: [
      { label: "方意核心", value: "清热利湿，芳香化浊" },
      { label: "常见关联", value: "口苦、尿黄、口黏、困重、纳差" },
    ],
    sections: [
      {
        title: "系统里常和什么一起出现",
        points: [
          "在湿热蕴结、舌苔黄腻、饮食失节等线索共同出现时更常见。",
        ],
      },
    ],
    tags: ["方剂", "湿热"],
    relations: [
      { slug: "shi-re-yun-jie", kind: "syndrome", label: "湿热蕴结", relation: "常对应证候" },
      { slug: "huang-qin", kind: "herb", label: "黄芩", relation: "常见药材" },
      { slug: "huo-xiang", kind: "herb", label: "藿香", relation: "常见药材" },
    ],
  },
  {
    id: "formula-zhi-bai-di-huang-wan",
    slug: "zhi-bai-di-huang-wan",
    kind: "formula",
    title: "知柏地黄丸",
    summary: "常用于阴虚内热方向的方意理解，偏向滋阴清热。",
    facts: [
      { label: "方意核心", value: "滋阴潜阳，清热降火" },
      { label: "常见关联", value: "口干、烦热、睡浅、多梦、便干" },
    ],
    sections: [
      {
        title: "常见理解误区",
        points: [
          "它不是单纯“上火就用”，前提是有明显的阴液不足与虚热背景。",
        ],
      },
    ],
    tags: ["方剂", "阴虚"],
    relations: [
      { slug: "yin-xu-nei-re", kind: "syndrome", label: "阴虚内热", relation: "常对应证候" },
      { slug: "shu-di-huang", kind: "herb", label: "熟地黄", relation: "常见药材" },
    ],
  },
  {
    id: "formula-li-zhong-tang",
    slug: "li-zhong-tang",
    kind: "formula",
    title: "理中汤",
    summary: "常用于阳虚寒湿或脾胃虚寒方向的方意理解，偏向温中健脾。",
    facts: [
      { label: "方意核心", value: "温中散寒，健脾益气" },
      { label: "常见关联", value: "怕冷、便溏、腹部喜温、乏力" },
    ],
    sections: [
      {
        title: "理解重点",
        points: [
          "适合帮助用户理解“为什么怕冷、腹泻、乏力”会落到温阳健脾，而不是清热方向。",
        ],
      },
    ],
    tags: ["方剂", "阳虚"],
    relations: [
      { slug: "yang-xu-han-shi", kind: "syndrome", label: "阳虚寒湿", relation: "常对应证候" },
      { slug: "gan-jiang", kind: "herb", label: "干姜", relation: "常见药材" },
      { slug: "bai-zhu", kind: "herb", label: "白术", relation: "常见药材" },
    ],
  },
  {
    id: "formula-xue-fu-zhu-yu-tang",
    slug: "xue-fu-zhu-yu-tang",
    kind: "formula",
    title: "血府逐瘀汤",
    summary: "常用于气滞血瘀方向的方意理解，偏向理气活血、通络止痛。",
    facts: [
      { label: "方意核心", value: "理气活血，通络止痛" },
      { label: "常见关联", value: "固定痛、刺痛、病程较长、情绪相关" },
    ],
    sections: [
      {
        title: "为什么会出现在智诊里",
        points: [
          "当症状位置固定、病程较长且情绪波动相关时，这一路径会更常被检索到。",
        ],
      },
    ],
    tags: ["方剂", "血瘀"],
    relations: [
      { slug: "qi-zhi-xue-yu", kind: "syndrome", label: "气滞血瘀", relation: "常对应证候" },
      { slug: "dang-gui", kind: "herb", label: "当归", relation: "常见药材" },
      { slug: "chai-hu", kind: "herb", label: "柴胡", relation: "常见药材" },
    ],
  },
  {
    id: "herb-chai-hu",
    slug: "chai-hu",
    kind: "herb",
    title: "柴胡",
    summary: "常用于疏肝解郁、和解少阳方向的方意理解，在情志相关或气机不畅的条目中很常见。",
    facts: [
      { label: "常见印象", value: "疏肝、解郁、升举清阳" },
      { label: "系统常见关联", value: "肝郁脾虚、气滞血瘀、逍遥散" },
    ],
    sections: [
      {
        title: "知识卡用途",
        points: [
          "用户不必记药理细节，重点是理解它为什么会在“肝气不舒”类方意里频繁出现。",
        ],
      },
    ],
    tags: ["药材", "理气"],
    relations: [
      { slug: "gan-yu-pi-xu", kind: "syndrome", label: "肝郁脾虚", relation: "常见对应证候" },
      { slug: "xiao-yao-san", kind: "formula", label: "逍遥散", relation: "常见对应方意" },
    ],
    featured: true,
  },
  {
    id: "herb-bai-zhu",
    slug: "bai-zhu",
    kind: "herb",
    title: "白术",
    summary: "常用于健脾益气、燥湿助运方向的理解，在脾胃和运化类方意中很常见。",
    facts: [
      { label: "常见印象", value: "健脾益气，燥湿利水" },
      { label: "系统常见关联", value: "脾胃气虚、肝郁脾虚、理中汤" },
    ],
    sections: [
      {
        title: "怎么理解它出现的意义",
        points: [
          "当系统把主诉往“脾胃运化偏弱”方向归纳时，白术很容易作为关键药材出现。",
        ],
      },
    ],
    tags: ["药材", "健脾"],
    relations: [
      { slug: "pi-wei-qi-xu", kind: "syndrome", label: "脾胃气虚", relation: "常见对应证候" },
      { slug: "si-jun-zi-tang", kind: "formula", label: "四君子汤", relation: "常见对应方意" },
    ],
  },
  {
    id: "herb-fu-ling",
    slug: "fu-ling",
    kind: "herb",
    title: "茯苓",
    summary: "常用于健脾渗湿、宁心安神方向的理解，在痰湿、脾虚类方意中常见。",
    facts: [
      { label: "常见印象", value: "健脾渗湿，宁心" },
      { label: "系统常见关联", value: "脾胃气虚、痰湿内阻、逍遥散" },
    ],
    sections: [
      {
        title: "知识卡用途",
        points: [
          "帮助用户理解“困、湿、虚”之间为什么经常连在一起。",
        ],
      },
    ],
    tags: ["药材", "渗湿"],
    relations: [
      { slug: "tan-shi-nei-zu", kind: "syndrome", label: "痰湿内阻", relation: "常见对应证候" },
      { slug: "si-jun-zi-tang", kind: "formula", label: "四君子汤", relation: "常见对应方意" },
    ],
  },
  {
    id: "herb-chen-pi",
    slug: "chen-pi",
    kind: "herb",
    title: "陈皮",
    summary: "常用于理气健脾、燥湿和中方向的理解，在腹胀、痰湿、纳差类方意中常见。",
    facts: [
      { label: "常见印象", value: "理气和中，燥湿化痰" },
      { label: "系统常见关联", value: "肝郁脾虚、痰湿内阻、二陈汤" },
    ],
    sections: [
      {
        title: "常见关联场景",
        points: [
          "只要出现“胀、闷、痰、纳差”这类和中焦气机有关的线索，它就很容易出现。",
        ],
      },
    ],
    tags: ["药材", "理气"],
    relations: [
      { slug: "er-chen-tang", kind: "formula", label: "二陈汤", relation: "常见对应方意" },
      { slug: "gan-yu-pi-xu", kind: "syndrome", label: "肝郁脾虚", relation: "常见对应证候" },
    ],
  },
  {
    id: "herb-ban-xia",
    slug: "ban-xia",
    kind: "herb",
    title: "半夏",
    summary: "常用于燥湿化痰、和胃降逆方向的理解，在痰湿、恶心、胸闷类方意中常见。",
    facts: [
      { label: "常见印象", value: "燥湿化痰，降逆和胃" },
      { label: "系统常见关联", value: "痰湿内阻、二陈汤" },
    ],
    sections: [
      {
        title: "理解重点",
        points: [
          "它在系统里更多承担“痰湿阻滞中焦”这一方向的可解释提示。",
        ],
      },
    ],
    tags: ["药材", "化痰"],
    relations: [
      { slug: "tan-shi-nei-zu", kind: "syndrome", label: "痰湿内阻", relation: "常见对应证候" },
      { slug: "er-chen-tang", kind: "formula", label: "二陈汤", relation: "常见对应方意" },
    ],
  },
  {
    id: "herb-huo-xiang",
    slug: "huo-xiang",
    kind: "herb",
    title: "藿香",
    summary: "常用于芳香化湿、和中止呕方向的理解，在暑湿、湿热、胃口差类方意中较常见。",
    facts: [
      { label: "常见印象", value: "化湿和中，解暑" },
      { label: "系统常见关联", value: "暑湿夹热、湿热蕴结、新加香薷饮" },
    ],
    sections: [
      {
        title: "为什么适合放在系统里",
        points: [
          "用户很容易把它和“暑气”“胃口差”“湿”这些感受联系起来，解释成本低。",
        ],
      },
    ],
    tags: ["药材", "芳香化湿"],
    relations: [
      { slug: "shu-shi-jia-re", kind: "syndrome", label: "暑湿夹热", relation: "常见对应证候" },
      { slug: "xin-jia-xiang-ru-yin", kind: "formula", label: "新加香薷饮", relation: "常见对应方意" },
    ],
    featured: true,
  },
  {
    id: "herb-pei-lan",
    slug: "pei-lan",
    kind: "herb",
    title: "佩兰",
    summary: "常用于芳香化湿、醒脾开胃方向的理解，常见于暑湿或湿热相关方意中。",
    facts: [
      { label: "常见印象", value: "芳香化湿，醒脾" },
      { label: "系统常见关联", value: "暑湿夹热、湿热蕴结" },
    ],
    sections: [
      {
        title: "知识卡用途",
        points: [
          "帮助用户理解“闷、黏、困、胃口差”为什么会指向化湿醒脾思路。",
        ],
      },
    ],
    tags: ["药材", "化湿"],
    relations: [
      { slug: "shu-shi-jia-re", kind: "syndrome", label: "暑湿夹热", relation: "常见对应证候" },
      { slug: "gan-lu-xiao-du-dan", kind: "formula", label: "甘露消毒丹", relation: "常见对应方意" },
    ],
  },
  {
    id: "herb-huang-qin",
    slug: "huang-qin",
    kind: "herb",
    title: "黄芩",
    summary: "常用于清热燥湿方向的理解，在湿热、火热偏盛相关条目中较常见。",
    facts: [
      { label: "常见印象", value: "清热燥湿" },
      { label: "系统常见关联", value: "湿热蕴结、甘露消毒丹" },
    ],
    sections: [
      {
        title: "理解重点",
        points: [
          "它更适合作为“热和湿同时偏盛”时的解释节点，而不是泛化成所有上火问题。",
        ],
      },
    ],
    tags: ["药材", "清热"],
    relations: [
      { slug: "shi-re-yun-jie", kind: "syndrome", label: "湿热蕴结", relation: "常见对应证候" },
      { slug: "gan-lu-xiao-du-dan", kind: "formula", label: "甘露消毒丹", relation: "常见对应方意" },
    ],
  },
  {
    id: "herb-shan-yao",
    slug: "shan-yao",
    kind: "herb",
    title: "山药",
    summary: "常用于补脾养胃、平和调养方向的理解，在脾虚与日常养护条目中常见。",
    facts: [
      { label: "常见印象", value: "补脾养胃，偏平和" },
      { label: "系统常见关联", value: "脾胃气虚、阴虚内热（食养）" },
    ],
    sections: [
      {
        title: "为什么适合知识库展示",
        points: [
          "它兼具药材与日常食养属性，用户容易把知识条目和生活场景联系起来。",
        ],
      },
    ],
    tags: ["药材", "食养"],
    relations: [
      { slug: "pi-wei-qi-xu", kind: "syndrome", label: "脾胃气虚", relation: "常见对应证候" },
      { slug: "si-jun-zi-tang", kind: "formula", label: "四君子汤", relation: "常见对应方意" },
    ],
  },
  {
    id: "herb-dang-shen",
    slug: "dang-shen",
    kind: "herb",
    title: "党参",
    summary: "常用于益气健脾方向的理解，在脾胃气虚类方意中较常见。",
    facts: [
      { label: "常见印象", value: "补中益气，健脾" },
      { label: "系统常见关联", value: "脾胃气虚、四君子汤" },
    ],
    sections: [
      {
        title: "知识卡用途",
        points: [
          "帮助用户理解“为什么系统会把疲乏、纳差和补气健脾联系起来”。",
        ],
      },
    ],
    tags: ["药材", "补气"],
    relations: [
      { slug: "pi-wei-qi-xu", kind: "syndrome", label: "脾胃气虚", relation: "常见对应证候" },
      { slug: "si-jun-zi-tang", kind: "formula", label: "四君子汤", relation: "常见对应方意" },
    ],
  },
  {
    id: "herb-gan-jiang",
    slug: "gan-jiang",
    kind: "herb",
    title: "干姜",
    summary: "常用于温中散寒方向的理解，在阳虚寒湿、脾胃虚寒类条目中较常见。",
    facts: [
      { label: "常见印象", value: "温中散寒" },
      { label: "系统常见关联", value: "阳虚寒湿、理中汤" },
    ],
    sections: [
      {
        title: "知识卡用途",
        points: [
          "帮助用户理解“冷、弱、缓”为什么会落到温阳和散寒方向，而不是清热。",
        ],
      },
    ],
    tags: ["药材", "温阳"],
    relations: [
      { slug: "yang-xu-han-shi", kind: "syndrome", label: "阳虚寒湿", relation: "常见对应证候" },
      { slug: "li-zhong-tang", kind: "formula", label: "理中汤", relation: "常见对应方意" },
    ],
  },
  {
    id: "herb-dang-gui",
    slug: "dang-gui",
    kind: "herb",
    title: "当归",
    summary: "常用于养血活血方向的理解，在气滞血瘀相关方意里较常见。",
    facts: [
      { label: "常见印象", value: "补血活血" },
      { label: "系统常见关联", value: "气滞血瘀、血府逐瘀汤" },
    ],
    sections: [
      {
        title: "知识卡用途",
        points: [
          "它适合帮助用户理解“久痛、刺痛、固定痛”为什么会和活血通络思路连接起来。",
        ],
      },
    ],
    tags: ["药材", "活血"],
    relations: [
      { slug: "qi-zhi-xue-yu", kind: "syndrome", label: "气滞血瘀", relation: "常见对应证候" },
      { slug: "xue-fu-zhu-yu-tang", kind: "formula", label: "血府逐瘀汤", relation: "常见对应方意" },
    ],
  },
  {
    id: "herb-shu-di-huang",
    slug: "shu-di-huang",
    kind: "herb",
    title: "熟地黄",
    summary: "常用于滋阴养血方向的理解，在阴虚内热类方意中较常见。",
    facts: [
      { label: "常见印象", value: "滋阴养血" },
      { label: "系统常见关联", value: "阴虚内热、知柏地黄丸" },
    ],
    sections: [
      {
        title: "知识卡用途",
        points: [
          "帮助用户把“口干、睡浅、烦热”与“滋阴”这一方向建立联系。",
        ],
      },
    ],
    tags: ["药材", "滋阴"],
    relations: [
      { slug: "yin-xu-nei-re", kind: "syndrome", label: "阴虚内热", relation: "常见对应证候" },
      { slug: "zhi-bai-di-huang-wan", kind: "formula", label: "知柏地黄丸", relation: "常见对应方意" },
    ],
  },
];

export const knowledgeEntriesBySlug = Object.fromEntries(
  knowledgeEntries.map((entry) => [entry.slug, entry]),
) as Record<string, KnowledgeEntry>;

export const featuredKnowledgeEntries = knowledgeEntries.filter((entry) => entry.featured);
