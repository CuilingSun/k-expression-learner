module.exports = [
  {
    id: "expr_0051",
    expression: "-네",
    meaning: "原来……啊；真……呢（当场看到后自然发出的发现或感叹）",
    scenario: {
      title: "看到结果后感叹",
      context: "你亲眼看到情况或刚注意到一个事实时，自然地把发现说出来。",
    },
    simple_example: { korean: "생각보다 괜찮네.", translation: "比想象中还不错啊。" },
    usage_examples: [
      { korean: "오늘 사람 많네.", translation: "今天人真多啊。", tone_note: "看到现场情况后自然发出的感叹。" },
      { korean: "이거 생각보다 쉽네.", translation: "这个比想象中简单啊。", tone_note: "带一点意外发现的语气。" },
      { korean: "너 오늘 기분 좋네.", translation: "你今天心情很好呢。", tone_note: "观察到对方状态后随口说出。" },
    ],
    relations: [
      { target_expression: "-더라", target_expression_id: "expr_0085", relation_type: "contrast", difference: "-네偏当下即时发现，-더라更像事后回想自己亲身经历到的事实。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "realization", target_expression: "-네", prompt: "看到实际情况后，用自然感叹的口语改写。", formal_sentence: "오늘은 사람이 많습니다.", natural_answer: "오늘 사람 많네." },
    ],
  },
  {
    id: "expr_0052",
    expression: "-지",
    meaning: "……吧；……嘛；对吧（确认共识、加强语气或缓和表达）",
    scenario: {
      title: "确认彼此都知道",
      context: "你默认对方能理解、认同，或者想把话说得更自然顺一点时会用到。",
    },
    simple_example: { korean: "쉽지?", translation: "很简单吧？" },
    usage_examples: [
      { korean: "너도 알지?", translation: "你也知道吧？", tone_note: "期待对方认同或回应。" },
      { korean: "지금 가면 늦지.", translation: "现在去的话就晚了嘛。", tone_note: "把判断说得像理所当然一样。" },
      { korean: "괜찮지 뭐.", translation: "还行啦。", tone_note: "语气轻松，带一点随口总结感。" },
    ],
    relations: [
      { target_expression: "-잖아", target_expression_id: "expr_0001", relation_type: "softer_than", difference: "-지更轻、更顺口，-잖아更强调‘你也知道’这个前提，情绪更明显。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "shared_knowledge", target_expression: "-지", prompt: "把这句改成更自然、像彼此都知道的口语。", formal_sentence: "당신도 알고 있습니까?", natural_answer: "너도 알지?" },
    ],
  },
  {
    id: "expr_0053",
    expression: "-지 뭐",
    meaning: "也就……咯；那就……呗（带一点无奈、轻松收尾或自我安慰）",
    scenario: {
      title: "无奈地收尾",
      context: "事情已经这样了，你不想太认真追究，只是轻轻带过去时会用到。",
    },
    simple_example: { korean: "그냥 기다리지 뭐.", translation: "那就等着呗。" },
    usage_examples: [
      { korean: "늦었으면 그냥 택시 타지 뭐.", translation: "晚了的话那就打车呗。", tone_note: "轻轻做出退一步的决定。" },
      { korean: "안 되면 다음에 하지 뭐.", translation: "不行的话下次再做呗。", tone_note: "有点无奈，但语气不重。" },
      { korean: "혼자 먹지 뭐.", translation: "那我就自己吃呗。", tone_note: "带一点自我安慰的感觉。" },
    ],
    relations: [
      { target_expression: "-지", target_expression_id: "expr_0052", relation_type: "related_tone", difference: "-지 뭐比单独的-지更多了一层‘算了、就这样吧’的收尾感。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "resignation", target_expression: "-지 뭐", prompt: "把这句话改成带一点无奈但很自然的口语。", formal_sentence: "안 되면 다음에 하겠습니다.", natural_answer: "안 되면 다음에 하지 뭐." },
    ],
  },
  {
    id: "expr_0054",
    expression: "-다니까",
    meaning: "我都说了……；真的是……（强烈坚持、反复说明）",
    scenario: {
      title: "反复强调事实",
      context: "对方不信你，或者你已经解释过还想再强调一次时会用到。",
    },
    simple_example: { korean: "진짜 맞다니까.", translation: "我都说了，真的对。" },
    usage_examples: [
      { korean: "나 오늘 진짜 바쁘다니까.", translation: "我都说了，我今天真的很忙。", tone_note: "重复说明，带一点急切。" },
      { korean: "괜찮다니까 왜 그래.", translation: "都说了我没事，你干吗这样。", tone_note: "想让对方别再追问。" },
      { korean: "걔 안 온다니까.", translation: "我都说了，他不会来。", tone_note: "对方还在怀疑时再次强调。" },
    ],
    relations: [
      { target_expression: "-잖아", target_expression_id: "expr_0001", relation_type: "stronger_than", difference: "-다니까更像反复坚持、强调自己说的是对的；-잖아更像提醒对方一个已知事实。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "insistence", target_expression: "-다니까", prompt: "把这句改成反复强调、很口语的说法。", formal_sentence: "저는 오늘 정말 바쁩니다.", natural_answer: "나 오늘 진짜 바쁘다니까." },
    ],
  },
  {
    id: "expr_0055",
    expression: "-라니까",
    meaning: "都叫你……了；说了让你……（转述命令、催促或不耐烦地提醒）",
    scenario: {
      title: "催促别人照做",
      context: "你已经叫过对方做某件事，还要再强调一次时很常用。",
    },
    simple_example: { korean: "빨리 오라니까.", translation: "都叫你快点来了。" },
    usage_examples: [
      { korean: "조심하라니까 왜 또 그래.", translation: "都叫你小心了，怎么又这样。", tone_note: "带点责备和不耐烦。" },
      { korean: "일찍 자라니까 안 듣네.", translation: "都叫你早点睡了，你就是不听。", tone_note: "像长辈或亲近的人反复叮嘱。" },
      { korean: "이쪽으로 오라니까.", translation: "都说了让你往这边来。", tone_note: "强调之前已经说过一次。" },
    ],
    relations: [
      { target_expression: "-지 말다", target_expression_id: "expr_0076", relation_type: "related_scenario", difference: "-라니까常用来重复命令或要求，-지 말다则是直接禁止某个动作。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "repeated_instruction", target_expression: "-라니까", prompt: "把这句改成已经提醒过一次、带一点不耐烦的口语。", formal_sentence: "빨리 오십시오.", natural_answer: "빨리 오라니까." },
    ],
  },
  {
    id: "expr_0056",
    expression: "-(으)ㄹ까",
    meaning: "要不要……呢；会不会……呢（提议、犹豫或自问）",
    scenario: {
      title: "边想边提议",
      context: "你在犹豫、试探对方意见，或自己边想边说时常会用到。",
    },
    simple_example: { korean: "우리 먼저 갈까?", translation: "我们要不先走？" },
    usage_examples: [
      { korean: "이따 커피 마실까?", translation: "等会儿要不要喝咖啡？", tone_note: "轻松提出建议，等对方回应。" },
      { korean: "그냥 집에 있을까.", translation: "要不就待在家吧。", tone_note: "带一点自言自语式的犹豫。" },
      { korean: "걔도 올까?", translation: "他也会来吗？", tone_note: "对可能性做不确定的猜测。" },
    ],
    relations: [
      { target_expression: "-(으)ㄹ래", target_expression_id: "expr_0057", relation_type: "contrast", difference: "-(으)ㄹ까更像提议或犹豫，-(으)ㄹ래更直接表达自己的意愿或询问对方意愿。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "suggestion", target_expression: "-(으)ㄹ까", prompt: "把这句改成轻松征求意见的口语。", formal_sentence: "우리 먼저 갈까요?", natural_answer: "우리 먼저 갈까?" },
    ],
  },
  {
    id: "expr_0057",
    expression: "-(으)ㄹ래",
    meaning: "想要……；要不要……（表达意愿或直接问对方）",
    scenario: {
      title: "直接说自己的意愿",
      context: "你想直接表达‘我要这样做’或直接问对方想不想时很常用。",
    },
    simple_example: { korean: "나 먼저 잘래.", translation: "我想先睡了。" },
    usage_examples: [
      { korean: "너 뭐 먹을래?", translation: "你想吃什么？", tone_note: "直接问对方的选择或意愿。" },
      { korean: "난 그냥 집에 있을래.", translation: "我还是想待在家。", tone_note: "明确表达自己的决定。" },
      { korean: "같이 갈래?", translation: "要不要一起去？", tone_note: "自然、亲近的邀请方式。" },
    ],
    relations: [
      { target_expression: "-고 싶다", target_expression_id: "expr_0060", relation_type: "contrast", difference: "-(으)ㄹ래更直接、更口语，常带选择和意愿；-고 싶다更单纯表达‘想做’的愿望。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "choice", target_expression: "-(으)ㄹ래", prompt: "把这句改成更直接表达自己意愿的口语。", formal_sentence: "저는 집에 있겠습니다.", natural_answer: "난 그냥 집에 있을래." },
    ],
  },
  {
    id: "expr_0058",
    expression: "-(으)ㄹ게",
    meaning: "那我就……；我会……的（当场决定、答应或主动承担）",
    scenario: {
      title: "当场答应去做",
      context: "你听到对方的话后，马上表态自己会怎么做，语气常比较自然亲近。",
    },
    simple_example: { korean: "내가 먼저 갈게.", translation: "那我先走了。" },
    usage_examples: [
      { korean: "내가 전화할게.", translation: "我来打电话。", tone_note: "听完情况后主动承担这件事。" },
      { korean: "그럼 내가 할게.", translation: "那我来做吧。", tone_note: "顺着对话现场做出决定。" },
      { korean: "나중에 다시 올게.", translation: "我晚点再来。", tone_note: "对对方做出自然承诺。" },
    ],
    relations: [
      { target_expression: "-자고", target_expression_id: "expr_0070", relation_type: "contrast", difference: "-(으)ㄹ게是说自己会做什么，-자고则是转述‘一起做吧’这样的提议。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "promise", target_expression: "-(으)ㄹ게", prompt: "把这句改成听完对方的话后自然答应的口语。", formal_sentence: "제가 전화하겠습니다.", natural_answer: "내가 전화할게." },
    ],
  },
  {
    id: "expr_0059",
    expression: "-아/어야지",
    meaning: "得……才行；我要……了（自我提醒、下决心）",
    scenario: {
      title: "给自己下决定",
      context: "你在心里给自己定下一个行动，或者轻声说出‘该这么做了’时很常见。",
    },
    simple_example: { korean: "이제 자야지.", translation: "现在得睡了。" },
    usage_examples: [
      { korean: "내일부터 운동해야지.", translation: "从明天开始得运动了。", tone_note: "像对自己下决心一样。" },
      { korean: "이제 진짜 공부해야지.", translation: "现在真的得学习了。", tone_note: "常带一点拖延后的自我提醒。" },
      { korean: "집에 가서 바로 씻어야지.", translation: "回家后得马上洗澡。", tone_note: "规划接下来要做的动作。" },
    ],
    relations: [
      { target_expression: "-(으)ㄹ게", target_expression_id: "expr_0058", relation_type: "contrast", difference: "-아/어야지更像对自己说‘得这么做’，-(으)ㄹ게更像对别人承诺‘我来做’。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "self_reminder", target_expression: "-아/어야지", prompt: "把这句改成对自己下决心的自然口语。", formal_sentence: "이제는 공부해야 합니다.", natural_answer: "이제 진짜 공부해야지." },
    ],
  },
  {
    id: "expr_0060",
    expression: "-고 싶다",
    meaning: "想……；想要……（直接表达自己的愿望）",
    scenario: {
      title: "直接说想做什么",
      context: "你想自然表达自己的愿望、计划或偏好时很常用。",
    },
    simple_example: { korean: "집에 가고 싶어.", translation: "我想回家。" },
    usage_examples: [
      { korean: "오늘은 그냥 쉬고 싶어.", translation: "今天就想休息。", tone_note: "直接说出自己此刻的愿望。" },
      { korean: "매운 거 먹고 싶다.", translation: "想吃辣的。", tone_note: "非常自然的日常表达。" },
      { korean: "혼자 있고 싶어.", translation: "我想一个人待着。", tone_note: "表达情绪或状态上的需要。" },
    ],
    relations: [
      { target_expression: "-기 싫다", target_expression_id: "expr_0061", relation_type: "contrast", difference: "-고 싶다表达想做某事，-기 싫다则表达不想做某事或抗拒去做。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "desire", target_expression: "-고 싶다", prompt: "把这句改成日常说自己想做什么的口语。", formal_sentence: "저는 집에 가고 싶습니다.", natural_answer: "나 집에 가고 싶어." },
    ],
  },
  {
    id: "expr_0061",
    expression: "-기 싫다",
    meaning: "不想……；讨厌去……（表达抗拒或厌烦）",
    scenario: {
      title: "表达不想做",
      context: "你对某件事有明显抗拒、懒得做或心情上不想面对时很常用。",
    },
    simple_example: { korean: "오늘은 나가기 싫어.", translation: "今天不想出门。" },
    usage_examples: [
      { korean: "월요일이라 일하기 싫다.", translation: "因为是星期一，真不想工作。", tone_note: "带一点抱怨和厌烦。" },
      { korean: "지금 아무 말도 하기 싫어.", translation: "我现在什么都不想说。", tone_note: "情绪比较低落或烦躁时会这样说。" },
      { korean: "비 와서 밖에 나가기 싫어.", translation: "因为下雨，不想出去。", tone_note: "给出不想做的理由。" },
    ],
    relations: [
      { target_expression: "-고 싶다", target_expression_id: "expr_0060", relation_type: "contrast", difference: "-기 싫다是消极抗拒，-고 싶다是积极愿望，两者方向正好相反。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "reluctance", target_expression: "-기 싫다", prompt: "把这句改成很自然地表达‘不想做’的口语。", formal_sentence: "저는 지금 말하고 싶지 않습니다.", natural_answer: "나 지금 아무 말도 하기 싫어." },
    ],
  },
  {
    id: "expr_0062",
    expression: "-겠네",
    meaning: "看来会……啊；一定很……吧（根据眼前情况做推断）",
    scenario: {
      title: "看情况做推断",
      context: "你根据眼前看到的线索，马上判断接下来会怎样或对方状态如何。",
    },
    simple_example: { korean: "비 오겠네.", translation: "看来要下雨了。" },
    usage_examples: [
      { korean: "짐이 많네, 힘들겠네.", translation: "东西这么多，肯定很累吧。", tone_note: "看到情况后对对方状态做推断。" },
      { korean: "하늘 보니까 곧 비 오겠네.", translation: "看这天，马上要下雨了。", tone_note: "根据现场迹象做自然判断。" },
      { korean: "시험 끝났으니까 좋겠네.", translation: "考试结束了，肯定很开心吧。", tone_note: "带一点替对方想象的感觉。" },
    ],
    relations: [
      { target_expression: "-겠지", target_expression_id: "expr_0063", relation_type: "contrast", difference: "-겠네更像看到线索后当场得出的推断，-겠지则更像较平静、默认式的猜测。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "inference", target_expression: "-겠네", prompt: "根据眼前情况做出自然推断，把句子改成口语。", formal_sentence: "곧 비가 올 것 같습니다.", natural_answer: "곧 비 오겠네." },
    ],
  },
  {
    id: "expr_0063",
    expression: "-겠지",
    meaning: "应该会……吧；大概……吧（比较温和的猜测或默认判断）",
    scenario: {
      title: "平静地猜测",
      context: "你没有特别强的证据，只是凭常识或感觉做一个顺口的猜测时常用。",
    },
    simple_example: { korean: "곧 오겠지.", translation: "应该快来了吧。" },
    usage_examples: [
      { korean: "걔도 알고 있겠지.", translation: "他应该也知道吧。", tone_note: "比较平静、默认式的推测。" },
      { korean: "시간 지나면 괜찮아지겠지.", translation: "时间过去应该就会好起来吧。", tone_note: "带一点安慰自己的感觉。" },
      { korean: "지금쯤 집에 도착했겠지.", translation: "现在应该已经到家了吧。", tone_note: "对看不见的情况做猜测。" },
    ],
    relations: [
      { target_expression: "-겠네", target_expression_id: "expr_0062", relation_type: "softer_than", difference: "-겠지는较平静的猜测，-겠네更像看到线索后当场冒出的判断。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "guessing", target_expression: "-겠지", prompt: "把这句改成自然、平静的猜测口语。", formal_sentence: "그도 알고 있을 것입니다.", natural_answer: "걔도 알고 있겠지." },
    ],
  },
  {
    id: "expr_0064",
    expression: "-(으)ㄴ가/나 보다",
    meaning: "好像……；看来……（根据线索做观察式推测）",
    scenario: {
      title: "根据线索判断",
      context: "你不是百分百确定，但从表情、情况或气氛判断出大概如此时会用。",
    },
    simple_example: { korean: "많이 피곤한가 봐.", translation: "他好像很累。" },
    usage_examples: [
      { korean: "오늘 기분이 안 좋은가 봐.", translation: "他今天心情好像不太好。", tone_note: "根据对方状态做观察式推测。" },
      { korean: "비가 오나 봐, 다들 우산 들고 있어.", translation: "好像在下雨，大家都拿着伞。", tone_note: "结合眼前线索来判断。" },
      { korean: "걔는 아직 모르는가 보다.", translation: "他好像还不知道。", tone_note: "语气比较保守，不把话说死。" },
    ],
    relations: [
      { target_expression: "-(으)ㄹ 것 같다", target_expression_id: "expr_0065", relation_type: "similar_meaning", difference: "-(으)ㄴ가/나 보다는根据外在线索的观察推测，-(으)ㄹ 것 같다는更宽泛，也可表达主观感觉。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "observing", target_expression: "-(으)ㄴ가/나 보다", prompt: "根据眼前线索，把这句改成观察式推测的口语。", formal_sentence: "그는 아직 모르는 것 같습니다.", natural_answer: "걔는 아직 모르는가 봐." },
    ],
  },
  {
    id: "expr_0065",
    expression: "-(으)ㄹ 것 같다",
    meaning: "感觉会……；好像会……（比较通用的推测）",
    scenario: {
      title: "表达一种感觉",
      context: "你基于直觉、经验或当前情况，想委婉表达‘我觉得大概会这样’时很常用。",
    },
    simple_example: { korean: "오늘 늦을 것 같아.", translation: "我感觉今天会迟到。" },
    usage_examples: [
      { korean: "이거 생각보다 오래 걸릴 것 같아.", translation: "这个感觉会比想象中花更久。", tone_note: "对未来做比较保守的判断。" },
      { korean: "걔 오늘 안 올 것 같아.", translation: "我感觉他今天不会来。", tone_note: "不是绝对断定，而是主观判断。" },
      { korean: "지금 말하면 좀 어색할 것 같아.", translation: "我觉得现在说会有点尴尬。", tone_note: "很适合表达委婉意见。" },
    ],
    relations: [
      { target_expression: "-(으)ㄴ가/나 보다", target_expression_id: "expr_0064", relation_type: "similar_meaning", difference: "-(으)ㄹ 것 같다는范围更广、也更主观；-(으)ㄴ가/나 보다는更像根据外部线索的观察。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "prediction", target_expression: "-(으)ㄹ 것 같다", prompt: "把这句改成委婉表达判断的自然口语。", formal_sentence: "오늘 늦을 가능성이 있습니다.", natural_answer: "오늘 늦을 것 같아." },
    ],
  },
  {
    id: "expr_0066",
    expression: "-(으)ㄹ걸",
    meaning: "大概会……吧；早知道就……了吧（口语里常带猜测或事后想法）",
    scenario: {
      title: "顺口做推测",
      context: "你比较随口地说出自己的猜测，或者带一点事后感的判断时会用。",
    },
    simple_example: { korean: "걔 벌써 갔을걸.", translation: "他大概已经走了吧。" },
    usage_examples: [
      { korean: "지금 가면 자리 없을걸.", translation: "现在去的话大概没位子了吧。", tone_note: "带一点提醒和预测。" },
      { korean: "걔도 후회했을걸.", translation: "他应该也后悔了吧。", tone_note: "根据常理做带感情色彩的推测。" },
      { korean: "조금만 일찍 왔으면 만났을걸.", translation: "如果早来一点，应该就碰到了。", tone_note: "可带一点事后可惜感。" },
    ],
    relations: [
      { target_expression: "-겠지", target_expression_id: "expr_0063", relation_type: "related_tone", difference: "-(으)ㄹ걸比-겠지更随口，也常带一点主观感或事后感。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "afterthought", target_expression: "-(으)ㄹ걸", prompt: "把这句改成比较随口、带一点判断感的口语。", formal_sentence: "지금 가면 자리가 없을 것입니다.", natural_answer: "지금 가면 자리 없을걸." },
    ],
  },
  {
    id: "expr_0067",
    expression: "-아/어 보다",
    meaning: "试着……；做做看（表示尝试）",
    scenario: {
      title: "先试试看",
      context: "你想建议别人尝试一下，或说自己会先做做看时，是最常见的表达之一。",
    },
    simple_example: { korean: "한번 물어봐.", translation: "你试着问问看。" },
    usage_examples: [
      { korean: "이거 한번 먹어 봐.", translation: "你试着吃吃这个。", tone_note: "很自然的邀请或建议。" },
      { korean: "나도 다시 해 볼게.", translation: "我也再试试看。", tone_note: "表示会先试一下再说。" },
      { korean: "모르면 직접 물어봐.", translation: "不知道的话就直接问问看。", tone_note: "鼓励对方先尝试。" },
    ],
    relations: [
      { target_expression: "-(으)ㄹ래", target_expression_id: "expr_0057", relation_type: "related_scenario", difference: "-아/어 보다는强调‘先试试’，-(으)ㄹ래更偏表达意愿或选择。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "trying", target_expression: "-아/어 보다", prompt: "把这句改成很自然地说‘先试试看’的口语。", formal_sentence: "이것을 한번 드셔 보십시오.", natural_answer: "이거 한번 먹어 봐." },
    ],
  },
  {
    id: "expr_0068",
    expression: "-고 있다",
    meaning: "正在……（进行中的动作或状态）",
    scenario: {
      title: "描述正在进行",
      context: "你想说某个动作正在发生、正在做时，是最基本也最常用的口语结构。",
    },
    simple_example: { korean: "지금 밥 먹고 있어.", translation: "我现在正在吃饭。" },
    usage_examples: [
      { korean: "뭐 하고 있어?", translation: "你在干吗？", tone_note: "日常对话里非常高频。" },
      { korean: "나 지금 일하고 있어.", translation: "我现在在工作。", tone_note: "说明当前正在做的事。" },
      { korean: "걔 아직 자고 있어.", translation: "他还在睡。", tone_note: "描述别人当前的状态。" },
    ],
    relations: [
      { target_expression: "-게 되다", target_expression_id: "expr_0069", relation_type: "contrast", difference: "-고 있다是‘正在做’，-게 되다는‘变成了这样、后来变成会做’。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "ongoing_action", target_expression: "-고 있다", prompt: "把这句改成描述正在进行中的自然口语。", formal_sentence: "저는 지금 식사를 하고 있습니다.", natural_answer: "나 지금 밥 먹고 있어." },
    ],
  },
  {
    id: "expr_0069",
    expression: "-게 되다",
    meaning: "变得……；后来就……了（强调结果或变化）",
    scenario: {
      title: "事情后来变成这样",
      context: "你想表达某件事不是一开始主动决定的，而是经过过程后变成那样时很常用。",
    },
    simple_example: { korean: "다시 만나게 됐어.", translation: "后来又见面了。" },
    usage_examples: [
      { korean: "일 때문에 서울에 가게 됐어.", translation: "因为工作，我后来要去首尔了。", tone_note: "强调事情发展后的结果。" },
      { korean: "자연스럽게 친해지게 됐어.", translation: "后来就自然变熟了。", tone_note: "不是刻意安排，而是逐渐如此。" },
      { korean: "그 영화를 보고 울게 됐어.", translation: "看了那部电影，后来就哭了。", tone_note: "强调结果的发生。" },
    ],
    relations: [
      { target_expression: "-고 있다", target_expression_id: "expr_0068", relation_type: "contrast", difference: "-게 되다는结果和变化，-고 있다는当前进行中的动作。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "change_of_circumstance", target_expression: "-게 되다", prompt: "把这句改成强调事情后来变成这样的口语。", formal_sentence: "저는 일 때문에 서울에 가게 되었습니다.", natural_answer: "나 일 때문에 서울에 가게 됐어." },
    ],
  },
  {
    id: "expr_0070",
    expression: "-자고",
    meaning: "说‘一起……吧’；提议说要……（转述提议）",
    scenario: {
      title: "转述别人的提议",
      context: "别人提议一起做某事时，你转述那句‘一起……吧’的内容时会用到。",
    },
    simple_example: { korean: "걔가 먼저 가자고 했어.", translation: "他说先走吧。" },
    usage_examples: [
      { korean: "애들이 같이 먹자고 하더라.", translation: "他们说一起吃吧。", tone_note: "转述一群人的提议。" },
      { korean: "걔가 주말에 보자고 했어.", translation: "他说周末见吧。", tone_note: "转述约见面的提议。" },
      { korean: "다들 그냥 쉬자고 그래.", translation: "大家都说干脆休息吧。", tone_note: "把集体意见转述出来。" },
    ],
    relations: [
      { target_expression: "-(으)ㄹ게", target_expression_id: "expr_0058", relation_type: "contrast", difference: "-자고是提议‘一起做’，-(으)ㄹ게是自己说‘我来做’。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "relaying_proposal", target_expression: "-자고", prompt: "把这句改成自然转述别人提议的口语。", formal_sentence: "그가 먼저 가자고 제안했습니다.", natural_answer: "걔가 먼저 가자고 했어." },
    ],
  },
  {
    id: "expr_0071",
    expression: "-대",
    meaning: "听说……；说是……（口语里转述别人说的话）",
    scenario: {
      title: "转述听来的信息",
      context: "你把别人说过的话转给另一个人听时，这个口语缩略形式特别常见。",
    },
    simple_example: { korean: "민지가 오늘 못 온대.", translation: "敏智说今天来不了。" },
    usage_examples: [
      { korean: "걔 내일 쉰대.", translation: "他说他明天休息。", tone_note: "简短转述别人说的事实。" },
      { korean: "엄마가 오늘 늦는대.", translation: "妈妈说今天会晚点。", tone_note: "家庭日常里很常见。" },
      { korean: "여기 진짜 맛있대.", translation: "听说这里真的很好吃。", tone_note: "也可用于转述听来的评价。" },
    ],
    relations: [
      { target_expression: "-래", target_expression_id: "expr_0072", relation_type: "contrast", difference: "-대多转述陈述内容，-래更常转述要求、邀请或‘说要……’这样的内容。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "relaying_information", target_expression: "-대", prompt: "把这句改成自然转述别人说法的口语。", formal_sentence: "민지는 오늘 오지 못한다고 합니다.", natural_answer: "민지가 오늘 못 온대." },
    ],
  },
  {
    id: "expr_0072",
    expression: "-래",
    meaning: "说要……；叫……；让……（转述要求、计划或意向）",
    scenario: {
      title: "转述要求或打算",
      context: "你转述别人让你做什么、叫某人做什么，或说自己想做什么时会用到。",
    },
    simple_example: { korean: "엄마가 빨리 오래.", translation: "妈妈叫我快点来。" },
    usage_examples: [
      { korean: "걔가 지금 바로 오래.", translation: "他说现在马上过来吧。", tone_note: "转述别人发出的要求或召唤。" },
      { korean: "선생님이 조용히 하래.", translation: "老师叫我们安静。", tone_note: "很常见的命令转述。" },
      { korean: "민수가 주말에 쉬고 싶대서 집에 있재.", translation: "民洙说周末想休息，所以说就在家吧。", tone_note: "能同时转述意向和后续建议。" },
    ],
    relations: [
      { target_expression: "-대", target_expression_id: "expr_0071", relation_type: "contrast", difference: "-래更常见于转述要求、提议或‘说要……’，-대则主要是转述一般陈述内容。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "relaying_request", target_expression: "-래", prompt: "把这句改成自然转述别人要求的口语。", formal_sentence: "어머니께서 빨리 오라고 하셨습니다.", natural_answer: "엄마가 빨리 오래." },
    ],
  },
  {
    id: "expr_0073",
    expression: "-다니",
    meaning: "竟然……；居然……（听到或发现某事后很惊讶）",
    scenario: {
      title: "对事实感到惊讶",
      context: "你对一个事实感到很意外，想把那种惊讶直接说出来时会用到。",
    },
    simple_example: { korean: "네가 벌써 끝냈다니 대단하다.", translation: "你居然已经做完了，真厉害。" },
    usage_examples: [
      { korean: "걔가 벌써 결혼했다니 놀랍다.", translation: "他居然已经结婚了，真让人惊讶。", tone_note: "对事实本身非常意外。" },
      { korean: "이걸 혼자 다 했다니 믿기네.", translation: "这居然是你一个人做的，真难以置信。", tone_note: "带有夸张的惊叹。" },
      { korean: "네가 먼저 사과했다니 의외네.", translation: "你居然先道歉了，真意外。", tone_note: "因为和预期不同，所以感到惊讶。" },
    ],
    relations: [
      { target_expression: "설마", target_expression_id: "expr_0014", relation_type: "related_tone", difference: "-다니用于得知事实后的惊讶，설마更常在还没完全确认前表达不敢相信。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "surprise_at_fact", target_expression: "-다니", prompt: "把这句改成听到事实后非常意外的自然口语。", formal_sentence: "당신이 벌써 끝냈다는 사실이 놀랍습니다.", natural_answer: "네가 벌써 끝냈다니 놀랍다." },
    ],
  },
  {
    id: "expr_0074",
    expression: "-냐고",
    meaning: "问……吗；说‘……吗’（转述问题，也常带一点不耐烦）",
    scenario: {
      title: "转述别人问的话",
      context: "别人问了你什么，或者你在重复某个问题时，口语里很常用这个形式。",
    },
    simple_example: { korean: "왜 이렇게 늦었냐고 물어봤어.", translation: "我问他怎么这么晚。" },
    usage_examples: [
      { korean: "걔가 언제 오냐고 계속 물어봐.", translation: "他一直问什么时候来。", tone_note: "转述对方重复追问的内容。" },
      { korean: "엄마가 밥 먹었냐고 전화했어.", translation: "妈妈打电话问我吃饭了没。", tone_note: "很自然的日常转述。" },
      { korean: "내가 왜 그랬냐고?", translation: "你问我为什么那样？", tone_note: "也可用于反问、重复对方的问题。" },
    ],
    relations: [
      { target_expression: "-대", target_expression_id: "expr_0071", relation_type: "contrast", difference: "-냐고是转述问句，-대是转述陈述内容，两者对应的原话类型不同。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "quoted_question", target_expression: "-냐고", prompt: "把这句改成自然转述别人提问的口语。", formal_sentence: "왜 이렇게 늦었는지 물어보았습니다.", natural_answer: "왜 이렇게 늦었냐고 물어봤어." },
    ],
  },
  {
    id: "expr_0075",
    expression: "-아/어도 되다",
    meaning: "可以……吗；可以……（表示许可）",
    scenario: {
      title: "问能不能这样做",
      context: "你想问某个动作是否被允许，或者告诉别人‘这样做也可以’时很常见。",
    },
    simple_example: { korean: "여기 앉아도 돼?", translation: "可以坐这里吗？" },
    usage_examples: [
      { korean: "지금 들어가도 돼?", translation: "现在可以进去吗？", tone_note: "礼貌度不高但很自然的日常问法。" },
      { korean: "이거 먹어도 돼.", translation: "这个可以吃。", tone_note: "表示许可，不一定非要是问句。" },
      { korean: "먼저 가도 되지?", translation: "我可以先走吧？", tone_note: "带一点确认意味。" },
    ],
    relations: [
      { target_expression: "-지 말다", target_expression_id: "expr_0076", relation_type: "contrast", difference: "-아/어도 되다는允许，-지 말다는禁止，方向正好相反。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "permission", target_expression: "-아/어도 되다", prompt: "把这句改成自然询问‘可不可以’的口语。", formal_sentence: "여기에 앉아도 됩니까?", natural_answer: "여기 앉아도 돼?" },
    ],
  },
  {
    id: "expr_0076",
    expression: "-지 말다",
    meaning: "不要……（直接阻止或提醒对方别做）",
    scenario: {
      title: "直接让别人别做",
      context: "当你想制止对方，或用比较直接的方式提醒对方避免某个动作时很常用。",
    },
    simple_example: { korean: "늦지 마.", translation: "别迟到。" },
    usage_examples: [
      { korean: "거기 가지 마.", translation: "别去那儿。", tone_note: "直接禁止某个动作。" },
      { korean: "혼자 참지 말고 말해.", translation: "别一个人忍着，说出来。", tone_note: "也可以带关心和安慰。" },
      { korean: "괜히 걱정하지 마.", translation: "别白担心了。", tone_note: "阻止对方继续某种情绪或行为。" },
    ],
    relations: [
      { target_expression: "-아/어도 되다", target_expression_id: "expr_0075", relation_type: "contrast", difference: "-지 말다는禁止或劝阻，-아/어도 되다는允许做某个动作。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "prohibition", target_expression: "-지 말다", prompt: "把这句改成直接自然的口语提醒。", formal_sentence: "늦지 마시기 바랍니다.", natural_answer: "늦지 마." },
    ],
  },
  {
    id: "expr_0077",
    expression: "-아/어 주다",
    meaning: "帮我……；给我……吧（请求对方为自己做事）",
    scenario: {
      title: "请别人帮个忙",
      context: "想请别人为自己做点事时，这是最自然、最常用的口语请求结构之一。",
    },
    simple_example: { korean: "문 좀 닫아 줘.", translation: "帮我把门关一下。" },
    usage_examples: [
      { korean: "잠깐만 기다려 줘.", translation: "等我一下。", tone_note: "语气自然亲近，常见于熟人之间。" },
      { korean: "이것도 같이 봐 줘.", translation: "这个也帮我一起看看。", tone_note: "请求对方帮忙处理某事。" },
      { korean: "끝나면 연락해 줘.", translation: "结束了给我发个消息。", tone_note: "委托对方做个动作。" },
    ],
    relations: [
      { target_expression: "좀", target_expression_id: "expr_0043", relation_type: "used_together", difference: "-아/어 주다本身就常用于请求，再加좀会让语气更自然、更缓和。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "requesting_help", target_expression: "-아/어 주다", prompt: "把这句改成请别人帮忙的自然口语。", formal_sentence: "문을 닫아 주십시오.", natural_answer: "문 좀 닫아 줘." },
    ],
  },
  {
    id: "expr_0078",
    expression: "-아/어 놓다",
    meaning: "先……好；做完并保持那个状态（强调结果状态）",
    scenario: {
      title: "先做完放着",
      context: "你想强调某件事提前做好了，而且结果会保持在那里供之后使用时会用到。",
    },
    simple_example: { korean: "미리 예약해 놨어.", translation: "我提前订好了。" },
    usage_examples: [
      { korean: "문 열어 놔.", translation: "把门先开着。", tone_note: "做完动作后保持那个状态。" },
      { korean: "필요한 건 다 적어 놨어.", translation: "需要的我都记好了。", tone_note: "事先准备好，之后随时能用。" },
      { korean: "커피 내려 놨으니까 마셔.", translation: "咖啡我已经煮好了，你喝吧。", tone_note: "强调已经准备妥当。" },
    ],
    relations: [
      { target_expression: "-아/어 두다", target_expression_id: "expr_0079", relation_type: "similar_function", difference: "两者都可表示提前准备，但-아/어 놓다更容易让人联想到结果状态被保留着。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "preparation", target_expression: "-아/어 놓다", prompt: "把这句改成强调‘已经先做好放着了’的口语。", formal_sentence: "미리 예약해 두었습니다.", natural_answer: "미리 예약해 놨어." },
    ],
  },
  {
    id: "expr_0079",
    expression: "-아/어 두다",
    meaning: "先……着；提前准备好（强调为以后预留）",
    scenario: {
      title: "提前留好准备",
      context: "你先做某件事，是为了以后方便使用、避免忘记，常会用这个结构。",
    },
    simple_example: { korean: "필요한 건 메모해 뒀어.", translation: "需要的我都先记下了。" },
    usage_examples: [
      { korean: "돈 좀 빼 둬.", translation: "先取点钱放着。", tone_note: "为了之后方便而先准备。" },
      { korean: "파일은 따로 저장해 뒀어.", translation: "文件我另外先存好了。", tone_note: "强调提前留好备用。" },
      { korean: "배터리 충전해 둬.", translation: "先把电充好。", tone_note: "提前准备，避免之后麻烦。" },
    ],
    relations: [
      { target_expression: "-아/어 놓다", target_expression_id: "expr_0078", relation_type: "similar_function", difference: "-아/어 두다更强调为了以后先准备好，-아/어 놓다는结果状态感更强一些。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "preparing_ahead", target_expression: "-아/어 두다", prompt: "把这句改成为了以后方便、提前准备的自然口语。", formal_sentence: "배터리를 미리 충전해 두십시오.", natural_answer: "배터리 미리 충전해 둬." },
    ],
  },
  {
    id: "expr_0080",
    expression: "-기만 하다",
    meaning: "光……；只会……（批评只做某件事、不做别的）",
    scenario: {
      title: "抱怨别人只会那样",
      context: "你在批评某人只会做一件事、一直重复同样行为时常会用到。",
    },
    simple_example: { korean: "걔는 불평만 해.", translation: "他光抱怨。" },
    usage_examples: [
      { korean: "말만 하지 말고 좀 도와.", translation: "别光说，帮点忙。", tone_note: "批评对方只出嘴不出手。" },
      { korean: "걔는 핑계만 대.", translation: "他只会找借口。", tone_note: "带有不满和指责。" },
      { korean: "앉아 있기만 하면 더 피곤해.", translation: "光坐着会更累。", tone_note: "也可不只是批评人，而是讲状态。" },
    ],
    relations: [
      { target_expression: "-고 있다", target_expression_id: "expr_0068", relation_type: "stronger_than", difference: "-기만 하다는‘只是一味地做那个动作’，语气比单纯的-고 있다更带评价。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "criticism", target_expression: "-기만 하다", prompt: "把这句改成带批评意味的口语。", formal_sentence: "그는 변명만 합니다.", natural_answer: "걔는 변명만 해." },
    ],
  },
  {
    id: "expr_0081",
    expression: "-다 말다",
    meaning: "做到一半就停；刚要……又没……（动作未完成）",
    scenario: {
      title: "做一半停下来",
      context: "你本来开始做了某件事，但中途停了，或者刚想做又放下时会用到。",
    },
    simple_example: { korean: "전화하다 말고 나왔어.", translation: "打电话打到一半就出来了。" },
    usage_examples: [
      { korean: "보내다 말고 다시 지웠어.", translation: "发到一半又删掉了。", tone_note: "动作开始了，但没完成。" },
      { korean: "말하다 말고 갑자기 웃더라.", translation: "说到一半突然笑了。", tone_note: "中途停住，转去别的反应。" },
      { korean: "씻다 말고 잠들었어.", translation: "洗到一半就睡着了。", tone_note: "带一点夸张或无奈。" },
    ],
    relations: [
      { target_expression: "-(으)ㄹ 뻔하다", target_expression_id: "expr_0094", relation_type: "similar_function", difference: "-다 말다는动作真的开始后停下，-(으)ㄹ 뻔하다는差点发生但最终没发生。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "stopping_midway", target_expression: "-다 말다", prompt: "把这句改成动作做到一半停下来的自然口语。", formal_sentence: "메시지를 보내다가 다시 삭제했습니다.", natural_answer: "보내다 말고 다시 지웠어." },
    ],
  },
  {
    id: "expr_0082",
    expression: "-아/어 죽겠다",
    meaning: "……死了；……得不行（夸张表达强烈状态）",
    scenario: {
      title: "夸张地说状态很强",
      context: "你想很口语地强调‘累死了、饿死了、热死了’这类强烈感受时特别常用。",
    },
    simple_example: { korean: "배고파 죽겠어.", translation: "我饿死了。" },
    usage_examples: [
      { korean: "오늘 더워 죽겠어.", translation: "今天热死了。", tone_note: "夸张表达身体感受很强。" },
      { korean: "기다리느라 답답해 죽겠다.", translation: "等得我烦死了。", tone_note: "不一定是身体状态，也可用来强调情绪。" },
      { korean: "피곤해 죽겠는데 아직도 안 끝나.", translation: "我都累死了，还没结束。", tone_note: "非常口语化，带一点抱怨。" },
    ],
    relations: [
      { target_expression: "미치겠다", target_expression_id: "expr_0008", relation_type: "similar_tone", difference: "-아/어 죽겠다更强调某种状态强到夸张，미치겠다更像快被逼疯、受不了。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "intense_feeling", target_expression: "-아/어 죽겠다", prompt: "把这句改成很口语、夸张地表达状态很强。", formal_sentence: "저는 매우 배가 고픕니다.", natural_answer: "나 배고파 죽겠어." },
    ],
  },
  {
    id: "expr_0083",
    expression: "-아/어 내다",
    meaning: "成功做到……；硬是完成……（强调克服困难后完成）",
    scenario: {
      title: "强调最后做成了",
      context: "事情不容易，但最后还是成功做到了时，用这个表达很有力度。",
    },
    simple_example: { korean: "혼자 다 해냈어.", translation: "我一个人全做成了。" },
    usage_examples: [
      { korean: "결국 끝까지 버텨 냈어.", translation: "最后还是撑到了最后。", tone_note: "强调过程不轻松，但挺过来了。" },
      { korean: "어려운 시험도 해냈네.", translation: "这么难的考试你也搞定了啊。", tone_note: "对结果带一点佩服。" },
      { korean: "밤새서라도 다 만들어 냈어.", translation: "就算熬夜，我也全做出来了。", tone_note: "强调硬是完成了。" },
    ],
    relations: [
      { target_expression: "-아/어 치우다", target_expression_id: "expr_0084", relation_type: "contrast", difference: "-아/어 내다는克服困难后成功完成，-아/어 치우다는带有一口气处理掉、做完拉倒的感觉。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "successful_completion", target_expression: "-아/어 내다", prompt: "把这句改成强调‘最后还是做成了’的自然口语。", formal_sentence: "결국 혼자 모두 완성했습니다.", natural_answer: "결국 혼자 다 해냈어." },
    ],
  },
  {
    id: "expr_0084",
    expression: "-아/어 치우다",
    meaning: "一口气做掉；狠狠干完（带点痛快、粗率或强硬感）",
    scenario: {
      title: "想赶紧处理完",
      context: "你想把事情干脆做掉、不留着烦心，常会用这个表达。",
    },
    simple_example: { korean: "오늘 숙제 다 해 치우자.", translation: "今天把作业一口气全做完吧。" },
    usage_examples: [
      { korean: "귀찮은 일부터 먼저 끝내 치워.", translation: "先把麻烦事赶紧做掉。", tone_note: "带点爽快处理掉的感觉。" },
      { korean: "냉장고에 있는 거 다 먹어 치웠어.", translation: "冰箱里的东西我全给吃光了。", tone_note: "也可表示彻底做完、吃完。" },
      { korean: "오늘 이 일 그냥 해 치우자.", translation: "今天这事干脆直接做完吧。", tone_note: "语气比较强势、干脆。" },
    ],
    relations: [
      { target_expression: "-아/어 내다", target_expression_id: "expr_0083", relation_type: "stronger_than", difference: "-아/어 치우다更有‘一口气处理掉’的劲头，-아/어 내다更强调困难之下终于成功做到。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "finishing_forcefully", target_expression: "-아/어 치우다", prompt: "把这句改成很干脆、像想一口气做掉的口语。", formal_sentence: "오늘 이 일을 모두 끝내겠습니다.", natural_answer: "오늘 이 일 다 해 치우자." },
    ],
  },
  {
    id: "expr_0085",
    expression: "-더라",
    meaning: "原来……；结果发现……（亲身经历后回头说）",
    scenario: {
      title: "回想亲身经历",
      context: "你亲自看过、做过、经历过后，再把那个发现告诉别人时很常用。",
    },
    simple_example: { korean: "가 보니까 진짜 멀더라.", translation: "去了一趟才发现真的很远。" },
    usage_examples: [
      { korean: "막상 가 보니까 사람 많더라.", translation: "真正去了才发现人很多。", tone_note: "强调亲身经历后的发现。" },
      { korean: "걔 생각보다 말 많더라.", translation: "他比想象中爱说话。", tone_note: "根据实际接触后的印象总结。" },
      { korean: "먹어 보니까 진짜 맛있더라.", translation: "吃了才发现真的很好吃。", tone_note: "很典型的体验后感想。" },
    ],
    relations: [
      { target_expression: "-네", target_expression_id: "expr_0051", relation_type: "contrast", difference: "-더라更偏事后回想自己的亲身经历，-네更偏当场看到时的即时反应。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "firsthand_realization", target_expression: "-더라", prompt: "把这句改成亲自经历之后再告诉别人的自然口语。", formal_sentence: "직접 가 보니 사람이 많았습니다.", natural_answer: "가 보니까 사람 많더라." },
    ],
  },
  {
    id: "expr_0086",
    expression: "-더라고",
    meaning: "我发现……来着；结果呢……（把亲身发现分享给对方）",
    scenario: {
      title: "把自己的发现告诉对方",
      context: "你想把自己亲自发现到的情况说给对方听，语气比-더라更像在分享。",
    },
    simple_example: { korean: "그 집 진짜 조용하더라고.", translation: "那家店真的很安静来着。" },
    usage_examples: [
      { korean: "가 보니까 생각보다 비싸더라고.", translation: "去了才发现比想象中贵。", tone_note: "像在分享亲身体验给对方。" },
      { korean: "걔 요즘 진짜 열심히 하더라고.", translation: "他最近真的很努力。", tone_note: "带一点观察后的转述感。" },
      { korean: "먹어 보니까 맵긴 한데 맛있더라고.", translation: "吃了之后发现虽然辣，但很好吃。", tone_note: "自然分享自己的体验结论。" },
    ],
    relations: [
      { target_expression: "-더라", target_expression_id: "expr_0085", relation_type: "related_tone", difference: "-더라고比-더라更像把自己的发现带给对方听，分享感更明显。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "shared_realization", target_expression: "-더라고", prompt: "把这句改成把自己亲身发现的情况分享给对方的口语。", formal_sentence: "직접 가 보니 생각보다 비쌌습니다.", natural_answer: "가 보니까 생각보다 비싸더라고." },
    ],
  },
  {
    id: "expr_0087",
    expression: "-겠는데",
    meaning: "这下要……了吧；看起来会……呢（带担心、预感或铺垫）",
    scenario: {
      title: "边看边有点担心",
      context: "你根据当前情况推测后果，常带一点担心、警觉或准备接下一句。",
    },
    simple_example: { korean: "이러다 늦겠는데.", translation: "这样下去可要迟到了。" },
    usage_examples: [
      { korean: "하늘 보니까 비 오겠는데.", translation: "看这天，感觉要下雨了。", tone_note: "带一点马上会发生的预感。" },
      { korean: "이 속도면 밤새겠는데.", translation: "照这速度看，怕是要熬通宵了。", tone_note: "语气里常带担心或无奈。" },
      { korean: "생각보다 일 커지겠는데.", translation: "这事感觉会比想象中闹大。", tone_note: "常作为铺垫，后面还会继续说。" },
    ],
    relations: [
      { target_expression: "-겠네", target_expression_id: "expr_0062", relation_type: "softer_than", difference: "-겠는데比-겠네更像‘看起来要这样了’并常带后续铺垫，语气也更悬着一点。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "cautious_inference", target_expression: "-겠는데", prompt: "把这句改成边看情况边有点担心的口语。", formal_sentence: "이러면 늦을 것 같습니다.", natural_answer: "이러다 늦겠는데." },
    ],
  },
  {
    id: "expr_0088",
    expression: "-길래",
    meaning: "因为看到/听到……所以……（根据眼前原因做了后续动作）",
    scenario: {
      title: "看到原因就那样做了",
      context: "你先注意到某个情况，然后顺着那个原因去做了下一步动作时很自然。",
    },
    simple_example: { korean: "배고프길래 김밥 샀어.", translation: "因为饿了，我就买了紫菜包饭。" },
    usage_examples: [
      { korean: "사람이 없길래 먼저 들어갔어.", translation: "因为没人，我就先进去了。", tone_note: "看到现场情况后立刻做决定。" },
      { korean: "네가 바빠 보이길래 나중에 연락했어.", translation: "看你很忙，我就晚点再联系了。", tone_note: "根据对方状态调整自己的行动。" },
      { korean: "비 오길래 그냥 집에 있었어.", translation: "因为下雨，我就待在家了。", tone_note: "原因和后续动作连接得很自然。" },
    ],
    relations: [
      { target_expression: "-는 바람에", target_expression_id: "expr_0099", relation_type: "contrast", difference: "-길래只是自然说明看到的原因，-는 바람에通常带意外、不利结果的感觉。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "seen_reason", target_expression: "-길래", prompt: "把这句改成看到原因后顺势这样做的自然口语。", formal_sentence: "배가 고파서 김밥을 샀습니다.", natural_answer: "배고프길래 김밥 샀어." },
    ],
  },
  {
    id: "expr_0089",
    expression: "-더니",
    meaning: "原本……后来却……；先……然后……（前后变化明显）",
    scenario: {
      title: "前后反差很明显",
      context: "你想把前一个状态和后一个状态并排说出来，突出变化或反差时会用到。",
    },
    simple_example: { korean: "아까는 춥더니 지금은 덥네.", translation: "刚才还冷，现在却热了。" },
    usage_examples: [
      { korean: "처음엔 싫다더니 지금은 제일 좋아해.", translation: "一开始还说不喜欢，现在却最喜欢。", tone_note: "前后态度变化很明显。" },
      { korean: "밥 먹더니 바로 졸려 하네.", translation: "刚吃完饭就开始犯困。", tone_note: "前一个动作之后接着出现另一个状态。" },
      { korean: "그때는 조용하더니 오늘은 엄청 말 많아.", translation: "那时候还挺安静，今天却特别爱说话。", tone_note: "用于对比不同时间的变化。" },
    ],
    relations: [
      { target_expression: "-다 보니", target_expression_id: "expr_0090", relation_type: "contrast", difference: "-더니更强调前后对比或变化，-다 보니更强调某个过程持续之后自然产生的结果。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "change_after_time", target_expression: "-더니", prompt: "把这句改成前后状态反差很明显的口语。", formal_sentence: "처음에는 싫다고 했지만 지금은 좋아합니다.", natural_answer: "처음엔 싫다더니 지금은 좋아하네." },
    ],
  },
  {
    id: "expr_0090",
    expression: "-다 보니",
    meaning: "做着做着就……了；时间久了就……（持续过程后的结果）",
    scenario: {
      title: "持续下来产生结果",
      context: "某个动作不是一下子造成结果，而是做久了、经历久了，慢慢就变成那样时很自然。",
    },
    simple_example: { korean: "매일 보다 보니 익숙해졌어.", translation: "天天看着看着就习惯了。" },
    usage_examples: [
      { korean: "같이 일하다 보니 친해졌어.", translation: "一起工作着工作着就熟了。", tone_note: "强调过程累积后的自然结果。" },
      { korean: "계속 듣다 보니 외워졌어.", translation: "一直听着听着就记住了。", tone_note: "不是刻意背，是过程带来的结果。" },
      { korean: "혼자 살다 보니 요리도 하게 됐어.", translation: "一个人住着住着，也开始会做饭了。", tone_note: "特别适合讲习惯和变化。" },
    ],
    relations: [
      { target_expression: "-다 보면", target_expression_id: "expr_0091", relation_type: "contrast", difference: "-다 보니更偏已经发生的结果，-다 보면更偏一般性的‘继续这样下去就会……’。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "accumulated_result", target_expression: "-다 보니", prompt: "把这句改成持续一段时间后自然产生结果的口语。", formal_sentence: "같이 일하다가 서로 친해졌습니다.", natural_answer: "같이 일하다 보니 친해졌어." },
    ],
  },
  {
    id: "expr_0091",
    expression: "-다 보면",
    meaning: "做着做着就会……；久了自然会……（一般规律或未来结果）",
    scenario: {
      title: "说一个普遍规律",
      context: "你想安慰、鼓励别人，或者说‘继续这样下去迟早会这样’时很常用。",
    },
    simple_example: { korean: "계속 하다 보면 늘 거야.", translation: "继续做下去的话会进步的。" },
    usage_examples: [
      { korean: "자주 보다 보면 익숙해져.", translation: "经常看着看着就会习惯。", tone_note: "表达一种一般性的规律。" },
      { korean: "같이 지내다 보면 알게 돼.", translation: "一起相处久了就会知道。", tone_note: "常用于安慰或劝说。" },
      { korean: "연습하다 보면 자연스러워질 거야.", translation: "练着练着就会自然起来。", tone_note: "很适合鼓励别人别着急。" },
    ],
    relations: [
      { target_expression: "-다 보니", target_expression_id: "expr_0090", relation_type: "contrast", difference: "-다 보면更像泛指‘继续下去会有这个结果’，-다 보니则是在回顾已经发生的结果。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "general_tendency", target_expression: "-다 보면", prompt: "把这句改成鼓励别人、说成一种规律的口语。", formal_sentence: "계속 연습하면 자연스러워질 것입니다.", natural_answer: "계속 하다 보면 자연스러워질 거야." },
    ],
  },
  {
    id: "expr_0092",
    expression: "-는 척하다",
    meaning: "装作……；假装……（并不是真的那样）",
    scenario: {
      title: "表面上装一装",
      context: "一个人明明不是那样，却故意表现成那样时，用这个表达非常自然。",
    },
    simple_example: { korean: "아무렇지 않은 척했어.", translation: "我装作若无其事。" },
    usage_examples: [
      { korean: "괜찮은 척했는데 사실 아니었어.", translation: "我装作没事，其实不是。", tone_note: "表面和真实状态不一致。" },
      { korean: "모르는 척하지 마.", translation: "别装不知道。", tone_note: "常带一点责备或戳破的语气。" },
      { korean: "바쁜 척만 해.", translation: "他就只会装忙。", tone_note: "带有批评感。" },
    ],
    relations: [
      { target_expression: "-는 편이다", target_expression_id: "expr_0093", relation_type: "contrast", difference: "-는 척하다는假装出来的样子，-는 편이다则是在概括一个人平常的真实倾向。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "pretending", target_expression: "-는 척하다", prompt: "把这句改成说‘装作没事’的自然口语。", formal_sentence: "저는 아무렇지 않은 것처럼 행동했습니다.", natural_answer: "나 아무렇지 않은 척했어." },
    ],
  },
  {
    id: "expr_0093",
    expression: "-는 편이다",
    meaning: "算是比较……；平时比较偏……（概括一种倾向）",
    scenario: {
      title: "概括自己的习惯",
      context: "你不想说得太绝对，只是想表达‘我大体上算是这样的人’时很好用。",
    },
    simple_example: { korean: "나는 아침에 일찍 일어나는 편이야.", translation: "我算是比较早起的类型。" },
    usage_examples: [
      { korean: "난 매운 걸 잘 먹는 편이야.", translation: "我算是挺能吃辣的。", tone_note: "表达倾向，不说得太绝对。" },
      { korean: "걔는 말을 아끼는 편이야.", translation: "他算是比较少说话的类型。", tone_note: "对人的风格做概括。" },
      { korean: "나는 낯을 좀 가리는 편이야.", translation: "我算是有点认生。", tone_note: "很适合介绍自己的个性。" },
    ],
    relations: [
      { target_expression: "-는 척하다", target_expression_id: "expr_0092", relation_type: "contrast", difference: "-는 편이다说的是长期倾向，-는 척하다는临时装出来的样子。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "personal_tendency", target_expression: "-는 편이다", prompt: "把这句改成不那么绝对、像在概括自己习惯的口语。", formal_sentence: "저는 아침에 일찍 일어나는 경향이 있습니다.", natural_answer: "난 아침에 일찍 일어나는 편이야." },
    ],
  },
  {
    id: "expr_0094",
    expression: "-(으)ㄹ 뻔하다",
    meaning: "差点就……了（险些发生但最后没发生）",
    scenario: {
      title: "差一点就出事",
      context: "事情已经很接近发生了，但最后还是避免了，这时这个表达非常自然。",
    },
    simple_example: { korean: "넘어질 뻔했어.", translation: "差点摔倒。" },
    usage_examples: [
      { korean: "버스 놓칠 뻔했어.", translation: "差点错过公交。", tone_note: "常见的日常险些发生场景。" },
      { korean: "진짜 큰일 날 뻔했다.", translation: "真的差点出大事。", tone_note: "可把事情说得更严重一些。" },
      { korean: "잘못 말해서 싸울 뻔했어.", translation: "说错话差点吵起来。", tone_note: "强调后果差一点就发生。" },
    ],
    relations: [
      { target_expression: "-다 말다", target_expression_id: "expr_0081", relation_type: "similar_function", difference: "-(으)ㄹ 뻔하다는差点发生但最终没发生，-다 말다는动作已经开始后中途停住。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "near_miss", target_expression: "-(으)ㄹ 뻔하다", prompt: "把这句改成很自然地说‘差点就……了’。", formal_sentence: "버스를 놓칠 뻔했습니다.", natural_answer: "버스 놓칠 뻔했어." },
    ],
  },
  {
    id: "expr_0095",
    expression: "-고 싶어 하다",
    meaning: "想……；想要……（第三人称的愿望）",
    scenario: {
      title: "说别人想做什么",
      context: "你不是说自己的愿望，而是观察、转述别人想做什么时会用到。",
    },
    simple_example: { korean: "애가 밖에 나가고 싶어 해.", translation: "孩子想出去。" },
    usage_examples: [
      { korean: "걔도 같이 가고 싶어 해.", translation: "他也想一起去。", tone_note: "转述别人的愿望。" },
      { korean: "엄마가 조용히 있고 싶어 하셔.", translation: "妈妈想安静待着。", tone_note: "也可以用来体贴地描述别人状态。" },
      { korean: "민지가 요즘 혼자 있고 싶어 하는 것 같아.", translation: "敏智最近好像想一个人待着。", tone_note: "根据表现去判断第三人称愿望。" },
    ],
    relations: [
      { target_expression: "-고 싶다", target_expression_id: "expr_0060", relation_type: "contrast", difference: "-고 싶다는说自己的愿望，-고 싶어 하다는说别人想做什么。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "third_person_desire", target_expression: "-고 싶어 하다", prompt: "把这句改成自然表达‘别人想做什么’的口语。", formal_sentence: "그도 함께 가고 싶어 합니다.", natural_answer: "걔도 같이 가고 싶어 해." },
    ],
  },
  {
    id: "expr_0096",
    expression: "-수도 있다",
    meaning: "也可能……；说不定会……（保留可能性）",
    scenario: {
      title: "留一点余地",
      context: "你不想把话说死，想保留一种可能性时，这个结构特别有用。",
    },
    simple_example: { korean: "그럴 수도 있어.", translation: "也有可能是那样。" },
    usage_examples: [
      { korean: "걔도 몰랐을 수도 있어.", translation: "他也可能不知道。", tone_note: "让判断更保守，不那么绝对。" },
      { korean: "지금은 안 되지만 나중엔 될 수도 있지.", translation: "现在不行，但以后也可能可以。", tone_note: "给人留一点希望或余地。" },
      { korean: "오해했을 수도 있으니까 다시 보자.", translation: "也可能是误会了，所以再看看吧。", tone_note: "常用于避免太快下结论。" },
    ],
    relations: [
      { target_expression: "-(으)ㄹ 것 같다", target_expression_id: "expr_0065", relation_type: "related_tone", difference: "-수도 있다는强调‘可能性存在’，-(으)ㄹ 것 같다는更像说话人的整体判断。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "possibility", target_expression: "-수도 있다", prompt: "把这句改成保留可能性的自然口语。", formal_sentence: "그도 몰랐을 가능성이 있습니다.", natural_answer: "걔도 몰랐을 수도 있어." },
    ],
  },
  {
    id: "expr_0097",
    expression: "-수밖에 없다",
    meaning: "只能……；别无选择（没有别的办法）",
    scenario: {
      title: "真的没别的办法",
      context: "你想说现在这个情况下只能这么做，不是你特别想，而是没得选。",
    },
    simple_example: { korean: "지금은 기다릴 수밖에 없어.", translation: "现在只能等。" },
    usage_examples: [
      { korean: "시간이 없어서 택시 탈 수밖에 없었어.", translation: "因为没时间，只能打车。", tone_note: "强调客观条件迫使你这么做。" },
      { korean: "지금은 믿을 수밖에 없지.", translation: "现在也只能相信了。", tone_note: "有点无奈接受现实的感觉。" },
      { korean: "비 오니까 안에서 놀 수밖에 없어.", translation: "因为下雨，只能在里面玩。", tone_note: "因为条件受限而没有别的选择。" },
    ],
    relations: [
      { target_expression: "어쩔 수 없다", target_expression_id: null, relation_type: "similar_meaning", difference: "-수밖에 없다更直接落在‘只能这么做’，어쩔 수 없다는更偏整体上的无奈感。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "no_choice", target_expression: "-수밖에 없다", prompt: "把这句改成表达‘没办法，只能这样’的口语。", formal_sentence: "지금은 기다릴 수밖에 없습니다.", natural_answer: "지금은 기다릴 수밖에 없어." },
    ],
  },
  {
    id: "expr_0098",
    expression: "-는 김에",
    meaning: "既然顺便……就……（趁这个机会一起做）",
    scenario: {
      title: "顺手一起做",
      context: "你反正已经要做前一件事了，所以顺便把另一件事也一起做掉时很常用。",
    },
    simple_example: { korean: "나가는 김에 쓰레기 좀 버려 줘.", translation: "既然要出去，顺便帮我把垃圾扔了。" },
    usage_examples: [
      { korean: "온 김에 얼굴 보고 가.", translation: "既然来了，就顺便见一面再走吧。", tone_note: "利用现成机会顺便做另一件事。" },
      { korean: "마트 가는 김에 우유도 사 와.", translation: "既然去超市，顺便买点牛奶回来。", tone_note: "非常日常的顺便请求。" },
      { korean: "청소하는 김에 책상도 정리했어.", translation: "既然都在打扫了，我顺便把桌子也整理了。", tone_note: "自己做事时也常用。" },
    ],
    relations: [
      { target_expression: "-는 대신", target_expression_id: "expr_0100", relation_type: "contrast", difference: "-는 김에是顺便一起做，-는 대신则是用一件事来交换、替代另一件事。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "while_at_it", target_expression: "-는 김에", prompt: "把这句改成‘既然都要做了就顺便……’的自然口语。", formal_sentence: "나가는 김에 쓰레기를 버려 주십시오.", natural_answer: "나가는 김에 쓰레기 좀 버려 줘." },
    ],
  },
  {
    id: "expr_0099",
    expression: "-는 바람에",
    meaning: "都怪……结果……；因为……害得……（常带负面后果）",
    scenario: {
      title: "因为意外原因出问题",
      context: "你想强调某个原因导致了不理想、麻烦或遗憾的结果时会用到。",
    },
    simple_example: { korean: "늦잠 자는 바람에 버스 놓쳤어.", translation: "因为睡过头，结果错过了公交。" },
    usage_examples: [
      { korean: "휴대폰을 잃어버리는 바람에 연락을 못 했어.", translation: "因为手机丢了，结果没联系上。", tone_note: "原因往往带来不方便或坏结果。" },
      { korean: "갑자기 비 오는 바람에 다 젖었어.", translation: "因为突然下雨，结果全淋湿了。", tone_note: "带一点倒霉和抱怨。" },
      { korean: "길이 막히는 바람에 늦었어.", translation: "因为堵车，所以迟到了。", tone_note: "很典型的负面结果表达。" },
    ],
    relations: [
      { target_expression: "-길래", target_expression_id: "expr_0088", relation_type: "contrast", difference: "-는 바람에는负面结果感更强，-길래只是顺着原因自然做了下一步动作。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "negative_cause", target_expression: "-는 바람에", prompt: "把这句改成因为某个原因而造成坏结果的自然口语。", formal_sentence: "늦잠을 자서 버스를 놓쳤습니다.", natural_answer: "늦잠 자는 바람에 버스 놓쳤어." },
    ],
  },
  {
    id: "expr_0100",
    expression: "-는 대신",
    meaning: "代替……；不……而……（用一件事换另一件事）",
    scenario: {
      title: "拿这个换那个",
      context: "你不做A而做B，或者你替别人做一件事来交换另一件事时，这个结构很好用。",
    },
    simple_example: { korean: "오늘은 내가 운전하는 대신 네가 커피 사.", translation: "今天我开车，换你请咖啡。" },
    usage_examples: [
      { korean: "주말에 쉬는 대신 오늘 좀 더 하자.", translation: "周末休息的话，今天就多做一点。", tone_note: "强调一种交换关系。" },
      { korean: "고기 대신 해산물 먹자.", translation: "别吃肉了，改吃海鲜吧。", tone_note: "也可用于替换选择。" },
      { korean: "내가 발표하는 대신 자료는 네가 정리해.", translation: "我来 발표，你来整理资料。", tone_note: "分工时很自然。" },
    ],
    relations: [
      { target_expression: "-는 김에", target_expression_id: "expr_0098", relation_type: "contrast", difference: "-는 대신是交换或替代关系，-는 김에则是顺带、一并做。" },
    ],
    rewrite_tasks: [
      { scenario_tag: "tradeoff", target_expression: "-는 대신", prompt: "把这句改成自然表达‘我做这个，换你做那个’的口语。", formal_sentence: "오늘은 제가 운전하겠습니다. 대신 당신이 커피를 사십시오.", natural_answer: "오늘은 내가 운전하는 대신 네가 커피 사." },
    ],
  },
];
