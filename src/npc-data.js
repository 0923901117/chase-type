/**
 * NPC definitions and word bank for Chase-Type.
 */

/** @typedef {{ name: string, crime: string, runSpeed: number, wpm: number, chaseHP: number, duelHP: number }} NPC */

/** 5 wanted outlaws — western themed, increasing difficulty */
export const NPCS = [
  {
    name: "Sneaky Pete",
    crime: "偷马贼",
    runSpeed: 80,    // pixels/sec
    wpm: 15,         // words per minute (simulated NPC typing)
    chaseHP: 5,
    duelHP: 3
  },
  {
    name: "Dusty Jane",
    crime: "抢劫驿站",
    runSpeed: 110,
    wpm: 22,
    chaseHP: 6,
    duelHP: 4
  },
  {
    name: "Wild Bill McGraw",
    crime: "银行劫匪",
    runSpeed: 140,
    wpm: 30,
    chaseHP: 7,
    duelHP: 5
  },
  {
    name: "Black Bart",
    crime: "火车大盗",
    runSpeed: 170,
    wpm: 40,
    chaseHP: 8,
    duelHP: 6
  },
  {
    name: "El Diablo Rojo",
    crime: "全镇通缉",
    runSpeed: 210,
    wpm: 55,
    chaseHP: 10,
    duelHP: 8
  }
];

/**
 * Chinese pinyin word bank — common words without tone marks.
 * Sorted roughly by difficulty / length.
 */
const WORD_BANK = [
  // Short / easy
  "ni", "wo", "ta", "hao", "ma", "ba", "le", "de", "da", "xiao",
  "shang", "xia", "qian", "hou", "zuo", "you", "jin", "chu", "lai", "qu",
  "chi", "he", "kan", "shuo", "xie", "du", "mai", "mai", "zuo", "zou",
  "pao", "tiao", "fei", "you", "da", "ti", "la", "tui", "kai", "guan",
  "ren", "jia", "xue", "sheng", "lao", "shi", "peng", "you", "shu", "hua",
  "shui", "huo", "tian", "di", "shan", "he", "feng", "yun", "yu", "xue",
  // Medium
  "nihao", "xiexie", "zaijian", "huanying", "piaoliang", "meili",
  "kuaile", "xingfu", "jiankang", "chenggong", "nuli", "xuexi",
  "gongzuo", "shenghuo", "shijie", "zhongguo", "beijing", "shanghai",
  "dianying", "yinyue", "tushu", "diannao", "shouji", "wangluo",
  "feiji", "huoche", "qiche", "zixingche", "ditie", "gongjiao",
  "dongwu", "zhiwu", "taiyang", "yueliang", "xingxing", "yuzhou",
  "shuxue", "yuwen", "yingyu", "lishi", "dili", "kexue",
  "yisheng", "hushi", "jingcha", "gongcheng", "yanyuan", "geshou",
  "jiaoshi", "xuesheng", "tongxue", "tongshi", "lingdao", "laoban",
  // Longer / harder
  "chuntian", "xiatian", "qiutian", "dongtian", "tianqi", "qixiang",
  "shudian", "canting", "jiudian", "yiyuan", "xuexiao", "tushuguan",
  "bowuguan", "dongwuyuan", "zhiwuyuan", "jiudian", "huochezhan",
  "feijichang", "gongyuan", "chaojishichang", "yinhang", "youju",
  "zhengfu", "gongsi", "gongchang", "daxue", "zhongxue", "xiaoxue",
  "jisuanji", "hulianwang", "rengongzhineng", "jiqixuexi",
  "shengwuxue", "huaxue", "wulixue", "tianwenxue", "zhexue",
  "aiqing", "youqing", "qinqing", "jiating", "fumu", "haizi",
  "xiongdi", "jiemei", "yeye", "nainai", "waigong", "waipo"
];

/**
 * Pick a random word from the bank.
 * Optionally filter by max length to control difficulty.
 */
export function randomWord(maxLength = Infinity) {
  const pool = maxLength < Infinity
    ? WORD_BANK.filter(w => w.length <= maxLength)
    : WORD_BANK;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Pick N unique random words.
 */
export function randomWords(count, maxLength = Infinity) {
  const pool = maxLength < Infinity
    ? [...new Set(WORD_BANK.filter(w => w.length <= maxLength))]
    : [...new Set(WORD_BANK)];
  
  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

/** Get all words */
export function getAllWords() {
  return [...WORD_BANK];
}
