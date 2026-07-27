import { Expression } from '../types';

// Pre-seeded comprehensive database of Daily Easy English Expressions (sorted chronologically 1 to N)
export const PRESEEDED_EXPRESSIONS: Expression[] = [
  {
    id: 'dee-1',
    episodeNumber: 1,
    title: 'Get over it',
    phrase: 'Get over it',
    phonetic: '/ɡet ˈoʊvər ɪt/',
    meaningCn: '克服；从（不愉快的事/失恋/打击）中走出来',
    definitionEn: 'To stop thinking about something bad that happened and move on with your life.',
    category: 'Emotions',
    tags: ['Daily Life', 'Encouragement'],
    audioUrl: 'https://traffic.libsyn.com/dailyeasyenglish/EE_1_Get_over_it.mp3',
    pubDate: 'Mon, 01 Jan 2018 08:00:00 GMT',
    description: 'Learn how to tell someone to stop worrying or obsessing over a past mistake or bad breakup.',
    usageNuance: '口语中非常常见，语气根据情境不同可表示安慰、劝导或略带不耐烦（如“别再纠结了”）。',
    examples: [
      {
        english: 'I know you failed the test, but you just need to get over it and try harder next time.',
        chinese: '我知道你考试没考好，但你需要跨过这个坎，下次更努力。',
        situation: '安慰考试失利的朋友'
      },
      {
        english: 'She broke up with him three months ago, and he still can’t get over it.',
        chinese: '她三个月前和他分手了，他至今还无法释怀。',
        situation: '描述感情困境'
      }
    ],
    dialogue: {
      speakerA: 'I am still so mad about what John said yesterday!',
      speakerA_cn: '我对约翰昨天说的话依然感到很生气！',
      speakerB: 'Come on, it was just a joke. Get over it!',
      speakerB_cn: '好了啦，那只是个玩笑，别放在心上了！'
    },
    quiz: {
      question: 'What does "Get over it" mean in daily conversation?',
      options: [
        'Jump over an obstacle physically',
        'Stop feeling sad or angry about something in the past',
        'Read a book from cover to cover',
        'Get on top of a roof'
      ],
      correctIndex: 1,
      explanation: '"Get over it" means to move past a negative experience or emotional setback.'
    }
  },
  {
    id: 'dee-2',
    episodeNumber: 2,
    title: 'On second thought',
    phrase: 'On second thought',
    phonetic: '/ɑːn ˈsekənd θɔːt/',
    meaningCn: '转念一想；重新考虑后（决定改变主意）',
    definitionEn: 'Used to express a change of opinion or decision after brief reflection.',
    category: 'Decision Making',
    tags: ['Daily Conversation', 'Polite'],
    audioUrl: 'https://traffic.libsyn.com/dailyeasyenglish/EE_2_On_second_thought.mp3',
    pubDate: 'Tue, 02 Jan 2018 08:00:00 GMT',
    description: 'A polite and natural phrase when changing your order at a restaurant or changing your plan.',
    usageNuance: '常用于点餐、做出决定或修改计划时，表示“我改主意了”。',
    examples: [
      {
        english: 'I’ll have coffee... wait, on second thought, make it a hot tea.',
        chinese: '我要一杯咖啡……等等，转念一想，还是换成热茶吧。',
        situation: '餐厅点餐改变主意'
      },
      {
        english: 'I was going to stay home, but on second thought, I’ll join you guys for dinner.',
        chinese: '我本来打算呆在家，但转念一想，我还是和你们一起吃晚饭吧。',
        situation: '改变社交计划'
      }
    ],
    dialogue: {
      speakerA: 'Should we take the train or drive?',
      speakerA_cn: '我们应该坐火车还是开车？',
      speakerB: 'Let’s drive. Wait, on second thought, traffic is terrible today, so train is better.',
      speakerB_cn: '开车吧。等等，转念一想，今天路况极差，还是坐火车更好。'
    },
    quiz: {
      question: 'When would you naturally use "On second thought"?',
      options: [
        'When introducing your second child',
        'When you change your mind after rethinking',
        'When asking someone for a second chance',
        'When counting numbers'
      ],
      correctIndex: 1,
      explanation: '"On second thought" is used when you change a choice or opinion after thinking again.'
    }
  },
  {
    id: 'dee-3',
    episodeNumber: 3,
    title: 'Bite the bullet',
    phrase: 'Bite the bullet',
    phonetic: '/baɪt ðə ˈbʊlɪt/',
    meaningCn: '咬紧牙关；硬着头皮去做（艰难/不情愿的事）',
    definitionEn: 'To face a difficult or unpleasant situation with courage and get it over with.',
    category: 'Idoms',
    tags: ['Workplace', 'Determination'],
    audioUrl: 'https://traffic.libsyn.com/dailyeasyenglish/EE_3_Bite_the_bullet.mp3',
    pubDate: 'Wed, 03 Jan 2018 08:00:00 GMT',
    description: 'Derived from old battlefield medicine where soldiers bit a lead bullet to endure pain without screaming.',
    usageNuance: '表示做出一件困难但不得不做的决定，强调决心。',
    examples: [
      {
        english: 'My tooth has been hurting for a week, so I finally bit the bullet and went to the dentist.',
        chinese: '我的牙痛了一周了，所以我终于硬着头皮去了看牙医。',
        situation: '克服恐惧去看医生'
      },
      {
        english: 'We have to bite the bullet and pay the repair fee.',
        chinese: '我们只能咬紧牙关把维修费给付了。',
        situation: '面对不必要的开支'
      }
    ],
    dialogue: {
      speakerA: 'I hate having to apologize to my supervisor.',
      speakerA_cn: '我真的很讨厌向我的主管道歉。',
      speakerB: 'Just bite the bullet and do it, so you can move forward.',
      speakerB_cn: '咬咬牙硬着头皮去吧，这样你才能继续向前看。'
    },
    quiz: {
      question: 'What is the origin of the idiom "Bite the bullet"?',
      options: [
        'Eating hard candies in winter',
        'Soldiers biting bullets during surgery before anesthesia was available',
        'Hunting animals in the woods',
        'Shooting targets in a competition'
      ],
      correctIndex: 1,
      explanation: 'Historically, wounded soldiers on battlefields were given a bullet to bite down on to endure pain during operation.'
    }
  },
  {
    id: 'dee-4',
    episodeNumber: 4,
    title: 'Call it a day',
    phrase: 'Call it a day',
    phonetic: '/kɔːl ɪt ə deɪ/',
    meaningCn: '收工；到此为止；结束今天的工作/活动',
    definitionEn: 'To stop working on something for the rest of the day.',
    category: 'Workplace',
    tags: ['Office', 'Routine'],
    audioUrl: 'https://traffic.libsyn.com/dailyeasyenglish/EE_4_Call_it_a_day.mp3',
    pubDate: 'Thu, 04 Jan 2018 08:00:00 GMT',
    description: 'The standard native way to say "Let us stop working now and go home".',
    usageNuance: '下班前或完成某项任务后最地道的口语表达，语气轻松自然。',
    examples: [
      {
        english: 'We’ve been working on this report for six hours. Let’s call it a day!',
        chinese: '我们写这份报告已经6个小时了。我们今天就到此为止收工吧！',
        situation: '加完班后提议收工'
      },
      {
        english: 'The sun is setting, so the workers decided to call it a day.',
        chinese: '太阳快落山了，工人决定今天就收工。',
        situation: '户外工作结束'
      }
    ],
    dialogue: {
      speakerA: 'Are you going to stay late again tonight?',
      speakerA_cn: '你今晚又要加班到很晚吗？',
      speakerB: 'No, I’m exhausted. I’m calling it a day right now.',
      speakerB_cn: '不加了，我精疲力竭了。我准备现在就收工下班。'
    },
    quiz: {
      question: 'If someone says "Let\'s call it a day", what are they proposing?',
      options: [
        'Rename the current weekday',
        'Stop working and rest for the rest of the day',
        'Schedule a meeting for tomorrow morning',
        'Make a phone call during daytime'
      ],
      correctIndex: 1,
      explanation: '"Call it a day" means ending work or an activity for the day.'
    }
  },
  {
    id: 'dee-5',
    episodeNumber: 5,
    title: 'Hit the sack',
    phrase: 'Hit the sack',
    phonetic: '/hɪt ðə sæk/',
    meaningCn: '睡觉；上床休息',
    definitionEn: 'To go to bed in order to sleep.',
    category: 'Slang & Casual',
    tags: ['Daily Life', 'Sleep'],
    audioUrl: 'https://traffic.libsyn.com/dailyeasyenglish/EE_5_Hit_the_sack.mp3',
    pubDate: 'Fri, 05 Jan 2018 08:00:00 GMT',
    description: 'The word "sack" historically refers to a mattress filled with straw or feathers.',
    usageNuance: '极为地道的俚语表达，同义词还有“hit the hay”。用于感到困倦想睡觉时。',
    examples: [
      {
        english: 'I have an early flight tomorrow, so I’m going to hit the sack.',
        chinese: '我明天赶早班飞机，所以我打算去睡觉了。',
        situation: '晚上早睡准备'
      },
      {
        english: 'After running the marathon, all he wanted was to hit the sack.',
        chinese: '跑完马拉松后，他只想躺到床上大睡一觉。',
        situation: '精疲力竭需要睡眠'
      }
    ],
    dialogue: {
      speakerA: 'Do you want to watch another episode of the movie?',
      speakerA_cn: '你想再看集电影吗？',
      speakerB: 'I’d love to, but my eyes are closing. Time to hit the sack.',
      speakerB_cn: '我很想看，但我眼睛都要睁不开了。该睡觉去了。'
    },
    quiz: {
      question: 'What does "Hit the sack" mean?',
      options: [
        'Punch a heavy punching bag',
        'Go to bed to sleep',
        'Throw away old garbage',
        'Buy groceries at the market'
      ],
      correctIndex: 1,
      explanation: '"Hit the sack" (or hit the hay) is a friendly informal expression for going to sleep.'
    }
  },
  {
    id: 'dee-10',
    episodeNumber: 10,
    title: 'Under the weather',
    phrase: 'Under the weather',
    phonetic: '/ˈʌndər ðə ˈweðər/',
    meaningCn: '身体不适；有点微恙 / 没精打采',
    definitionEn: 'Slightly unwell, sick, or exhausted.',
    category: 'Health',
    tags: ['Daily Life', 'Health'],
    audioUrl: 'https://traffic.libsyn.com/dailyeasyenglish/EE_10_Under_the_weather.mp3',
    pubDate: 'Wed, 10 Jan 2018 08:00:00 GMT',
    description: 'A polite, common way to explain why you are taking a sick leave or feeling tired without sharing graphic illness details.',
    usageNuance: '适合在请假或表达轻微不适时使用（如小感冒、头痛、头晕）。',
    examples: [
      {
        english: 'I’m feeling a bit under the weather today, so I think I’ll stay home.',
        chinese: '我今天感觉身体有点不舒服，所以我觉得我还是呆在家里吧。',
        situation: '向同事或朋友请假'
      }
    ],
    dialogue: {
      speakerA: 'You look a bit pale today. Is everything okay?',
      speakerA_cn: '你今天脸色看起来有点苍白，没事吧？',
      speakerB: 'I’m feeling a little under the weather, probably just a mild cold.',
      speakerB_cn: '我感觉身体有点微恙，可能只是轻微感冒了。'
    },
    quiz: {
      question: 'If someone is feeling "Under the weather", how are they?',
      options: ['Very happy', 'Slightly sick or unwell', 'Extremely wealthy', 'Standing outside in rain'],
      correctIndex: 1,
      explanation: '"Under the weather" means feeling slightly sick.'
    }
  },
  {
    id: 'dee-20',
    episodeNumber: 20,
    title: 'Piece of cake',
    phrase: 'Piece of cake',
    phonetic: '/piːs əv keɪk/',
    meaningCn: '小菜一碟；轻而易举的事',
    definitionEn: 'Something that is very easy to accomplish.',
    category: 'Idioms',
    tags: ['Easiness', 'Confidence'],
    audioUrl: 'https://traffic.libsyn.com/dailyeasyenglish/EE_20_Piece_of_cake.mp3',
    pubDate: 'Sat, 20 Jan 2018 08:00:00 GMT',
    description: 'Extremely popular idiom used when expressing that a task is non-challenging.',
    usageNuance: '表达对完成某项任务自信满满，或者任务非常简单。',
    examples: [
      {
        english: 'Don’t worry about the English driving test, it’s a piece of cake!',
        chinese: '不用担心英语驾照考试，那简直是小菜一碟！',
        situation: '鼓励朋友'
      }
    ],
    dialogue: {
      speakerA: 'Was the coding assignment difficult for you?',
      speakerA_cn: '那个编程作业对你来说难吗？',
      speakerB: 'Not at all! It was a total piece of cake.',
      speakerB_cn: '一点也不难！完全就是小菜一碟。'
    },
    quiz: {
      question: 'What does "Piece of cake" mean?',
      options: ['A slice of dessert', 'Something that is very easy', 'A difficult task', 'A birthday surprise'],
      correctIndex: 1,
      explanation: 'It denotes a very simple or effortless task.'
    }
  },
  {
    id: 'dee-50',
    episodeNumber: 50,
    title: 'Spill the beans',
    phrase: 'Spill the beans',
    phonetic: '/spɪl ðə biːnz/',
    meaningCn: '走漏风声；泄漏秘密',
    definitionEn: 'To reveal secret information unintentionally or prematurely.',
    category: 'Idioms',
    tags: ['Secrets', 'Social'],
    audioUrl: 'https://traffic.libsyn.com/dailyeasyenglish/EE_50_Spill_the_beans.mp3',
    pubDate: 'Tue, 20 Feb 2018 08:00:00 GMT',
    description: 'Used when someone reveals a surprise party, a business secret, or gossip.',
    usageNuance: '常带有“忍不住提前说出来”或“无意中泄密”的口吻。',
    examples: [
      {
        english: 'We were planning a surprise party for Sarah, but Tom spilled the beans.',
        chinese: '我们本来在给莎拉准备惊喜派对，但汤姆把秘密给泄露了。',
        situation: '剧透或泄密'
      }
    ],
    dialogue: {
      speakerA: 'Do you know where we are going for vacation?',
      speakerA_cn: '你知道我们去哪里度假吗？',
      speakerB: 'Mom told me, but she swore me not to spill the beans!',
      speakerB_cn: '妈妈告诉我了，但她让我发誓绝不泄露秘密！'
    },
    quiz: {
      question: 'What does "Spill the beans" mean?',
      options: ['Drop groceries on the kitchen floor', 'Reveal a secret prematurely', 'Cook a bean soup', 'Plant seeds in spring'],
      correctIndex: 1,
      explanation: 'It means revealing confidential or secret news.'
    }
  },
  {
    id: 'dee-100',
    episodeNumber: 100,
    title: 'Break a leg',
    phrase: 'Break a leg',
    phonetic: '/breɪk ə leɡ/',
    meaningCn: '祝你好运；表演顺利（常用于演出前祝愿）',
    definitionEn: 'A superstitious way to wish someone good luck before a performance or presentation.',
    category: 'Culture & Idioms',
    tags: ['Good Luck', 'Performance'],
    audioUrl: 'https://traffic.libsyn.com/dailyeasyenglish/EE_100_Break_a_leg.mp3',
    pubDate: 'Fri, 13 Apr 2018 08:00:00 GMT',
    description: 'In theater tradition, directly saying "good luck" was believed to cause bad luck, so people say "break a leg" instead.',
    usageNuance: '广泛用于演员登台、演讲比赛或重大面试前表达祝愿。',
    examples: [
      {
        english: 'You’re going on stage in five minutes! Break a leg!',
        chinese: '你再过五分钟就要上台了！祝你演出大获成功！',
        situation: '剧院上台前'
      }
    ],
    dialogue: {
      speakerA: 'I am so nervous about my speech in front of 500 people.',
      speakerA_cn: '要在500人面前演讲我好紧张啊。',
      speakerB: 'You have practiced enough. Go out there and break a leg!',
      speakerB_cn: '你已经练习得足够多了。上台去，祝你顺利！'
    },
    quiz: {
      question: 'Why do people say "Break a leg" instead of "Good luck"?',
      options: [
        'They want the person to get injured',
        'It is an old theater tradition where wishing luck directly was thought to bring bad luck',
        'It comes from martial arts training',
        'It was a translation mistake'
      ],
      correctIndex: 1,
      explanation: 'Theater folk tradition avoids direct "good luck" and uses "break a leg".'
    }
  },
  {
    id: 'dee-150',
    episodeNumber: 150,
    title: 'Once in a blue moon',
    phrase: 'Once in a blue moon',
    phonetic: '/wʌns ɪn ə bluː muːn/',
    meaningCn: '罕见；千载难逢；千百年来难得一次',
    definitionEn: 'Happening very rarely or almost never.',
    category: 'Idioms',
    tags: ['Frequency', 'Rare'],
    audioUrl: 'https://traffic.libsyn.com/dailyeasyenglish/EE_150_Once_in_a_blue_moon.mp3',
    pubDate: 'Wed, 06 Jun 2018 08:00:00 GMT',
    description: 'A "blue moon" is the second full moon in a single calendar month, which occurs rarely (roughly every 2.7 years).',
    usageNuance: '强调某件事发生的概率极低。',
    examples: [
      {
        english: 'My brother lives in London, so I only see him once in a blue moon.',
        chinese: '我哥哥住在伦敦，所以我难得见他一次。',
        situation: '描述 rare 见面频率'
      }
    ],
    dialogue: {
      speakerA: 'Does it ever rain in this desert town?',
      speakerA_cn: '这个沙漠小镇会下雨吗？',
      speakerB: 'Only once in a blue moon.',
      speakerB_cn: '极为罕见，难得下一回。'
    },
    quiz: {
      question: 'What is the frequency implied by "Once in a blue moon"?',
      options: ['Every Monday evening', 'Very rarely', 'Twice a day', 'Always during night'],
      correctIndex: 1,
      explanation: 'It denotes an event that happens extremely rarely.'
    }
  },
  {
    id: 'dee-200',
    episodeNumber: 200,
    title: 'Cut corners',
    phrase: 'Cut corners',
    phonetic: '/kʌt ˈkɔːrnərz/',
    meaningCn: '偷工减料；图省事走捷径（往往损害质量）',
    definitionEn: 'To do something in the easiest, cheapest, or fastest way, often sacrificing quality.',
    category: 'Workplace',
    tags: ['Quality', 'Warning'],
    audioUrl: 'https://traffic.libsyn.com/dailyeasyenglish/EE_200_Cut_corners.mp3',
    pubDate: 'Mon, 01 Oct 2018 08:00:00 GMT',
    description: 'Warning phrase used in manufacturing, coding, or construction when quality is compromised for speed or cost.',
    usageNuance: '通常带有贬义或警示性质，提醒不要因小失大。',
    examples: [
      {
        english: 'Don’t cut corners on safety equipment. Buying cheap gear is dangerous.',
        chinese: '切勿在安全设备上偷工减料。买便宜装备是很危险的。',
        situation: '安全警告'
      }
    ],
    dialogue: {
      speakerA: 'How did they finish the building project two months early?',
      speakerA_cn: '他们是怎么提前两个月完成工程建设的？',
      speakerB: 'I suspect they cut corners on materials.',
      speakerB_cn: '我怀疑他们在建筑材料上偷工减料了。'
    },
    quiz: {
      question: 'When you "cut corners", what are you doing?',
      options: ['Trimming paper squares into circles', 'Doing a task quickly/cheaply while sacrificing quality', 'Driving safely around street corners', 'Taking a geometry exam'],
      correctIndex: 1,
      explanation: 'Cutting corners refers to doing something hurriedly or cheaply at the expense of proper standards.'
    }
  },
  {
    id: 'dee-300',
    episodeNumber: 300,
    title: 'Out of the blue',
    phrase: 'Out of the blue',
    phonetic: '/aʊt əv ðə bluː/',
    meaningCn: '晴天霹雳；出乎意料地；毫无预兆地',
    definitionEn: 'Completely unexpectedly and without any advance warning.',
    category: 'Surprise',
    tags: ['Daily Life', 'Unexpected'],
    audioUrl: 'https://traffic.libsyn.com/dailyeasyenglish/EE_300_Out_of_the_blue.mp3',
    pubDate: 'Thu, 15 Feb 2019 08:00:00 GMT',
    description: 'Short for "out of the blue sky" — like a sudden bolt of lightning from a clear blue sky.',
    usageNuance: '描述突然收到的消息、突发的事件或久未联系的朋友突然出现。',
    examples: [
      {
        english: 'Yesterday, an old college friend called me out of the blue.',
        chinese: '昨天，一位大学老友出乎意料地给我打了电话。',
        situation: '意外来电'
      }
    ],
    dialogue: {
      speakerA: 'Did you know Mark quit his job?',
      speakerA_cn: '你知道马克辞职了吗？',
      speakerB: 'Yeah, it came completely out of the blue. Nobody expected it!',
      speakerB_cn: '对啊，简直毫无征兆。没有任何人料到！'
    },
    quiz: {
      question: 'What does "Out of the blue" describe?',
      options: ['An event happening under water', 'An unexpected event with no warning', 'Painting something blue', 'Feeling sad on Monday'],
      correctIndex: 1,
      explanation: 'It signifies a total surprise or unexpected occurrence.'
    }
  },
  {
    id: 'dee-400',
    episodeNumber: 400,
    title: 'A dime a dozen',
    phrase: 'A dime a dozen',
    phonetic: '/ə daɪm ə ˈdʌzn/',
    meaningCn: '多的是；不罕见；到处都是（价值不高）',
    definitionEn: 'Very common and easy to find, therefore not having much special value.',
    category: 'Idioms',
    tags: ['Common', 'Value'],
    audioUrl: 'https://traffic.libsyn.com/dailyeasyenglish/EE_400_A_dime_a_dozen.mp3',
    pubDate: 'Tue, 10 Sep 2019 08:00:00 GMT',
    description: 'Historically in America, 12 items sold together for just one dime (10 cents), meaning cheap and abundant.',
    usageNuance: '用来形容某类事物泛滥、随处可见，不值钱或缺乏独特性。',
    examples: [
      {
        english: 'Selfies on social media are a dime a dozen nowadays.',
        chinese: '如今社交媒体上的自拍照多如牛毛。',
        situation: '评论社会现象'
      }
    ],
    dialogue: {
      speakerA: 'I want to write a fantasy novel about dragons.',
      speakerA_cn: '我想写一本关于龙的奇幻小说。',
      speakerB: 'Good luck! Dragon books are a dime a dozen, so you need a unique plot.',
      speakerB_cn: '加油！关于龙的书到处都是，所以你需要一个独特的剧情。'
    },
    quiz: {
      question: 'If something is described as "A dime a dozen", it is:',
      options: ['Extremely rare and expensive', 'Very common and ordinary', 'Sold in bakery shops only', 'Worth millions of dollars'],
      correctIndex: 1,
      explanation: 'It indicates that the item is widespread and commonplace.'
    }
  },
  {
    id: 'dee-500',
    episodeNumber: 500,
    title: 'Back to the drawing board',
    phrase: 'Back to the drawing board',
    phonetic: '/bæk tuː ðə ˈdrɔːɪŋ bɔːrd/',
    meaningCn: '重头再来；打回原形重新设计',
    definitionEn: 'To start planning a project again from the beginning because a previous attempt failed.',
    category: 'Workplace',
    tags: ['Reset', 'Planning'],
    audioUrl: 'https://traffic.libsyn.com/dailyeasyenglish/EE_500_Back_to_the_drawing_board.mp3',
    pubDate: 'Fri, 20 Mar 2020 08:00:00 GMT',
    description: 'Refers to architects or designers returning to blank draft boards after a prototype test fails.',
    usageNuance: '表达某种方案失败后，不气馁地准备重新制定方案。',
    examples: [
      {
        english: 'Our marketing campaign didn’t generate any sales, so it’s back to the drawing board.',
        chinese: '我们的营销活动没有带来任何销售，所以只能推倒重来重新策划了。',
        situation: '营销方案调整'
      }
    ],
    dialogue: {
      speakerA: 'The client rejected our proposal completely.',
      speakerA_cn: '客户完全拒绝了我们的方案。',
      speakerB: 'Well, that’s disappointing. Back to the drawing board we go!',
      speakerB_cn: '好吧，挺令人失望的。咱们重头再来重新设计吧！'
    },
    quiz: {
      question: 'When a team goes "Back to the drawing board", what are they doing?',
      options: ['Painting an art mural', 'Restarting a plan from scratch after failure', 'Buying a new whiteboard', 'Drawing cartoons'],
      correctIndex: 1,
      explanation: 'It means starting over after an unsuccessful attempt.'
    }
  },
  {
    id: 'dee-600',
    episodeNumber: 600,
    title: 'Pull yourself together',
    phrase: 'Pull yourself together',
    phonetic: '/pʊl jɔːrˈself təˈɡeðər/',
    meaningCn: '冷静下来；控制好情绪；振作起来',
    definitionEn: 'To regain emotional control and calm down after being upset or panicked.',
    category: 'Emotions',
    tags: ['Mindset', 'Support'],
    audioUrl: 'https://traffic.libsyn.com/dailyeasyenglish/EE_600_Pull_yourself_together.mp3',
    pubDate: 'Wed, 11 Nov 2020 08:00:00 GMT',
    description: 'An imperative phrase used when someone is crying, hyperventilating, or panicking during a crisis.',
    usageNuance: '态度可以是关切的劝导，也可以是严肃的催促（“冷静点，别慌！”）。',
    examples: [
      {
        english: 'Take a deep breath and pull yourself together before you walk into the interview room.',
        chinese: '深呼吸，在走进面试室之前控制好自己的情绪。',
        situation: '面试前心理调整'
      }
    ],
    dialogue: {
      speakerA: 'I lost my keys and I’m going to miss the flight! Oh no!',
      speakerA_cn: '我把钥匙丢了，我要赶不上飞机了！天呐！',
      speakerB: 'Stop panicking and pull yourself together! Let’s search the bag carefully.',
      speakerB_cn: '别慌，冷静下来！我们仔细找找包包。'
    },
    quiz: {
      question: 'When you tell someone to "Pull yourself together", you mean:',
      options: ['Give yourself a big hug', 'Calm down and control your emotions', 'Zip up your jacket', 'Tie your shoes'],
      correctIndex: 1,
      explanation: 'It tells someone to overcome distress and regain self-control.'
    }
  },
  {
    id: 'dee-700',
    episodeNumber: 700,
    title: 'The last straw',
    phrase: 'The last straw',
    phonetic: '/ðə læst strɔː/',
    meaningCn: '忍无可忍的最后一击；压垮骆驼的最后一根稻草',
    definitionEn: 'The final small setback or annoyance in a series of troubles that makes a situation unbearable.',
    category: 'Idioms',
    tags: ['Patience', 'Limits'],
    audioUrl: 'https://traffic.libsyn.com/dailyeasyenglish/EE_700_The_last_straw.mp3',
    pubDate: 'Mon, 15 Aug 2021 08:00:00 GMT',
    description: 'Originates from the proverb "it is the last straw that breaks the camel\'s back".',
    usageNuance: '表达经过多次忍让后，最后一件事爆发导致彻底放弃或崩溃。',
    examples: [
      {
        english: 'He arrived late every day, but losing the company files was the last straw — he was fired.',
        chinese: '他每天都迟到，但把公司文件弄丢是最后一根稻草 —— 他被解雇了。',
        situation: '职场冲突爆点'
      }
    ],
    dialogue: {
      speakerA: 'Why did Rachel leave her apartment?',
      speakerA_cn: '雷切尔为什么搬离了她的公寓？',
      speakerB: 'The noisy neighbors were bad, but when the landlord raised rent by 30%, that was the last straw.',
      speakerB_cn: '吵闹的邻居已经够糟了，但当房东加租30%时，成了压垮她的最后一根稻草。'
    },
    quiz: {
      question: 'What is "The last straw"?',
      options: ['The last drinking tube in a box', 'The final problem in a series that causes total loss of patience', 'A straw hat worn in summer', 'A thin stick of bamboo'],
      correctIndex: 1,
      explanation: 'It is the final inconvenience that makes a situation completely intolerable.'
    }
  },
  {
    id: 'dee-800',
    episodeNumber: 800,
    title: 'Wrap your head around',
    phrase: 'Wrap your head around',
    phonetic: '/ræp jɔːr hed əˈraʊnd/',
    meaningCn: '理解；搞懂；弄明白（复杂/惊人的事物）',
    definitionEn: 'To comprehend or come to understand a complex, unusual, or shocking idea.',
    category: 'Mind & Knowledge',
    tags: ['Learning', 'Understanding'],
    audioUrl: 'https://traffic.libsyn.com/dailyeasyenglish/EE_800_Wrap_your_head_around.mp3',
    pubDate: 'Thu, 10 Mar 2022 08:00:00 GMT',
    description: 'Frequently used in negative form ("I can\'t wrap my head around it") when facing surprising quantum physics or crazy facts.',
    usageNuance: '常表达“太难以置信了/太难理解了”。',
    examples: [
      {
        english: 'I’m trying to wrap my head around quantum computing, but it’s so confusing.',
        chinese: '我正试图去弄懂量子计算，但这实在太深奥了。',
        situation: '学习复杂知识'
      }
    ],
    dialogue: {
      speakerA: 'Did you hear that housing prices doubled in one month?',
      speakerA_cn: '你听说了吗？房价在一个月内翻了一倍？',
      speakerB: 'I know! I still can’t wrap my head around how that happened.',
      speakerB_cn: '我知道！我至今都无法理解这是怎么发生的。'
    },
    quiz: {
      question: 'If you "can\'t wrap your head around" a fact, it means:',
      options: ['You need a warm hat', 'You find it difficult or crazy to comprehend', 'Your head is physically stuck', 'You agree wholeheartedly'],
      correctIndex: 1,
      explanation: 'It means struggling to understand or process a mind-boggling concept.'
    }
  },
  {
    id: 'dee-820',
    episodeNumber: 820,
    title: 'Touch and go',
    phrase: 'Touch and go',
    phonetic: '/tʌtʃ ænd ɡoʊ/',
    meaningCn: '难以预料；生死攸关；悬而未决',
    definitionEn: 'Precarious, uncertain, or risky regarding the outcome.',
    category: 'Risk',
    tags: ['Uncertainty', 'Suspense'],
    audioUrl: 'https://traffic.libsyn.com/dailyeasyenglish/EE_820_Touch_and_go.mp3',
    pubDate: 'Fri, 20 May 2022 08:00:00 GMT',
    description: 'Refers to a ship striking shallow ground momentarily or an aircraft landing touch-and-go drill.',
    usageNuance: '形容处于十分危险或局势不明朗的状态。',
    examples: [
      {
        english: 'The surgery was touch and go for a few hours, but the patient is stable now.',
        chinese: '手术有几个小时情况十分悬乎，但患者现在情况稳定了。',
        situation: '医疗风险状况'
      }
    ],
    dialogue: {
      speakerA: 'Did you make it to your flight on time?',
      speakerA_cn: '你按时赶上飞机了吗？',
      speakerB: 'It was touch and go because of the traffic jam, but we boarded just in time!',
      speakerB_cn: '因为交通堵塞情况非常悬，但我们刚好及时登机了！'
    },
    quiz: {
      question: 'What does a "Touch and go" situation imply?',
      options: ['Guaranteed success', 'An uncertain or risky state', 'A game played with touchscreen phones', 'A quick goodbye'],
      correctIndex: 1,
      explanation: 'Touch and go describes an outcome that is doubtful or perilous.'
    }
  },
  {
    id: 'dee-840',
    episodeNumber: 840,
    title: 'Play it by ear',
    phrase: 'Play it by ear',
    phonetic: '/pleɪ ɪt baɪ ɪər/',
    meaningCn: '随机应变；见机行事；看情况决定',
    definitionEn: 'To handle a situation as it develops rather than following a fixed plan.',
    category: 'Flexibility',
    tags: ['Spontaneous', 'Planning'],
    audioUrl: 'https://traffic.libsyn.com/dailyeasyenglish/EE_840_Play_it_by_ear.mp3',
    pubDate: 'Mon, 01 Aug 2022 08:00:00 GMT',
    description: 'Derived from musicians playing music by listening rather than reading sheet music notes.',
    usageNuance: '当无法提前做计划时，用于表达“到时候看情况再定”。',
    examples: [
      {
        english: 'We don’t know what time the rain will stop, so let’s just play it by ear.',
        chinese: '我们不知道雨什么时候会停，所以我们还是走一步看一步吧。',
        situation: '因天气变化灵活安排'
      }
    ],
    dialogue: {
      speakerA: 'What time are we meeting up tomorrow?',
      speakerA_cn: '我们明天几点碰头？',
      speakerB: 'I have a meeting in the afternoon, so let’s play it by ear after 3 PM.',
      speakerB_cn: '我下午有个会，所以下午3点后我们看情况再定吧。'
    },
    quiz: {
      question: 'Where does "Play it by ear" originate from?',
      options: ['Ear doctors examining patients', 'Musicians playing songs without reading musical notes', 'Listening to whisper games', 'Telephone operators'],
      correctIndex: 1,
      explanation: 'It comes from performing music by ear without rigid pre-written sheet music.'
    }
  },
  {
    id: 'dee-900',
    episodeNumber: 900,
    title: 'Take it with a grain of salt',
    phrase: 'Take it with a grain of salt',
    phonetic: '/teɪk ɪt wɪð ə ɡreɪn əv sɔːlt/',
    meaningCn: '半信半疑；对（言论/传闻）持保留态度',
    definitionEn: 'To regard something with skepticism or not accept it as completely true.',
    category: 'Wisdom',
    tags: ['Skepticism', 'Critical Thinking'],
    audioUrl: 'https://traffic.libsyn.com/dailyeasyenglish/EE_900_Take_it_with_a_grain_of_salt.mp3',
    pubDate: 'Tue, 15 Jan 2023 08:00:00 GMT',
    description: 'An ancient Latin concept suggesting that poison is easier to swallow if taken with a pinch of salt.',
    usageNuance: '告诫别人对小道消息或网上传言保持理性与怀疑。',
    examples: [
      {
        english: 'You should take online reviews with a grain of salt; some of them are sponsored.',
        chinese: '对网上的好评你要持半信半疑的态度，有些是付费推广。',
        situation: '评判网络信息'
      }
    ],
    dialogue: {
      speakerA: 'Did you hear the rumor about our company merging?',
      speakerA_cn: '你听到关于我们公司要合并的传闻了吗？',
      speakerB: 'I’d take that rumor with a grain of salt until an official email is sent.',
      speakerB_cn: '在收到官方邮件前，我对这个传言保持怀疑态度。'
    },
    quiz: {
      question: 'What does "Take it with a grain of salt" mean?',
      options: ['Season your food before eating', 'Be skeptical and do not believe everything completely', 'Add sugar to salt', 'Preserve food in saltwater'],
      correctIndex: 1,
      explanation: 'It means listening critically without believing 100% of what is said.'
    }
  },
  {
    id: 'dee-1000',
    episodeNumber: 1000,
    title: 'Hit the nail on the head',
    phrase: 'Hit the nail on the head',
    phonetic: '/hɪt ðə neɪl ɑːn ðə hed/',
    meaningCn: '一针见血；切中要害；说得完全正确',
    definitionEn: 'To describe exactly what is causing a situation or problem.',
    category: 'Communication',
    tags: ['Accuracy', 'Insight'],
    audioUrl: 'https://traffic.libsyn.com/dailyeasyenglish/EE_1000_Hit_the_nail_on_the_head.mp3',
    pubDate: 'Sat, 10 Jun 2023 08:00:00 GMT',
    description: 'From carpentry: striking the nail dead center on its head is perfect execution.',
    usageNuance: '夸赞某人的分析十分准确，直击痛点。',
    examples: [
      {
        english: 'Your analysis of why our app lost users hit the nail on the head.',
        chinese: '你关于为什么我们的应用流失用户的分析一针见血。',
        situation: '团队开会赞赏观点'
      }
    ],
    dialogue: {
      speakerA: 'I think our main problem is bad customer service, not product quality.',
      speakerA_cn: '我认为我们的主要问题是糟糕的客服，而不是产品质量。',
      speakerB: 'You hit the nail on the head! That’s exactly what users complained about.',
      speakerB_cn: '你说到点子上了！那正是用户所抱怨的。'
    },
    quiz: {
      question: 'If someone "hits the nail on the head", they have:',
      options: ['Injured their finger with a hammer', 'Stated something with exact accuracy', 'Hung a picture frame', 'Built a wooden chair'],
      correctIndex: 1,
      explanation: 'It means making an exact and accurate diagnosis or statement.'
    }
  },
  {
    id: 'dee-1120',
    episodeNumber: 1120,
    title: 'On the same page',
    phrase: 'On the same page',
    phonetic: '/ɑːn ðə seɪm peɪdʒ/',
    meaningCn: '达成共识；意见一致；心领神会',
    definitionEn: 'In agreement or sharing the same understanding about goals and plans.',
    category: 'Workplace',
    tags: ['Teamwork', 'Agreement'],
    audioUrl: 'https://traffic.libsyn.com/dailyeasyenglish/EE_1120_On_the_same_page.mp3',
    pubDate: 'Mon, 15 Jan 2024 08:00:00 GMT',
    description: 'Metaphor from a choir or reading class where everyone must turn to the same page number to stay synchronized.',
    usageNuance: '团队开会确认目标、或朋友配合时最常用的高频表达。',
    examples: [
      {
        english: 'Before we launch the project, let’s have a quick call to make sure we’re all on the same page.',
        chinese: '在项目上线之前，我们快速开个会，确保大家目标一致。',
        situation: '项目对接共识'
      }
    ],
    dialogue: {
      speakerA: 'So you will handle design, and I will handle backend coding?',
      speakerA_cn: '所以你负责设计，我负责后端代码？',
      speakerB: 'Exactly! Glad to see we are on the same page.',
      speakerB_cn: '没错！很高兴我们达成了共识。'
    },
    quiz: {
      question: 'What does being "on the same page" mean?',
      options: ['Reading the same printed book together', 'Having mutual agreement or understanding', 'Bookmarking a browser tab', 'Writing on paper'],
      correctIndex: 1,
      explanation: 'It signifies alignment in thoughts, plans, or objectives.'
    }
  }
];

// Generate dynamic batch groupings (20 words per group e.g. 1-19, 20-39, 40-59 ... 1120-1139)
export function generateBatchRanges(maxEp: number = 1140): { startNum: number; endNum: number; label: string }[] {
  const ranges = [];
  const batchSize = 20;
  for (let i = 1; i <= maxEp; i += batchSize) {
    const startNum = i;
    const endNum = i + batchSize - 1;
    ranges.push({
      startNum,
      endNum,
      label: `${startNum}-${endNum}`
    });
  }
  return ranges;
}
