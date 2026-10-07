(function () {
  "use strict";

  /* ================= ابزارها ================= */
  var FA = "۰۱۲۳۴۵۶۷۸۹";
  function f(n) { return String(n).replace(/\d/g, function (d) { return FA[d]; }); }
  function $(id) { return document.getElementById(id); }
  function all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function fix(a, b) { return a - b * Math.floor(a / b); }
  var rad = Math.PI / 180;
  function hhmm(h) {
    var m = Math.round(fix(h, 24) * 60), hh = Math.floor(m / 60) % 24, mm = m % 60;
    return f((hh < 10 ? "0" : "") + hh + ":" + (mm < 10 ? "0" : "") + mm);
  }
  function load(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function buzz(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }
  function toast(t) {
    var el = $("toast"); el.textContent = t; el.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(function () { el.hidden = true; }, 4500);
  }
  function beep() {
    try {
      var A = window.AudioContext || window.webkitAudioContext, a = new A(), o = a.createOscillator(), g = a.createGain();
      o.connect(g); g.connect(a.destination); o.frequency.value = 660;
      g.gain.setValueAtTime(0.25, a.currentTime); g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 1.4);
      o.start(); o.stop(a.currentTime + 1.4);
    } catch (e) {}
  }

  /* ================= تصاویر حالت‌ها =================
     آدرس تصویر (گوگل یا فایل محلی مثل "img/ruku.jpg") را اینجا یا از «تنظیمات» وارد کن. */
  var DEFAULT_IMAGES = { stand: "", ruku: "", sajdah: "", sit: "" };
  var POSE_NAME = { stand: "قیام", ruku: "رکوع", sajdah: "سجده", sit: "نشستن" };

  /* ================= شهرها ================= */
  var CITIES = [
    ["تهران",35.6892,51.389,"Asia/Tehran"],["مشهد",36.2972,59.6067,"Asia/Tehran"],["اصفهان",32.6546,51.668,"Asia/Tehran"],
    ["شیراز",29.5918,52.5837,"Asia/Tehran"],["تبریز",38.0962,46.2738,"Asia/Tehran"],["قم",34.6416,50.8746,"Asia/Tehran"],
    ["اهواز",31.3183,48.6706,"Asia/Tehran"],["کرج",35.8327,50.9915,"Asia/Tehran"],["کرمانشاه",34.3277,47.0778,"Asia/Tehran"],
    ["ارومیه",37.5527,45.076,"Asia/Tehran"],["رشت",37.2808,49.5832,"Asia/Tehran"],["زاهدان",29.4963,60.8629,"Asia/Tehran"],
    ["کرمان",30.2839,57.0834,"Asia/Tehran"],["همدان",34.7989,48.515,"Asia/Tehran"],["یزد",31.8974,54.3569,"Asia/Tehran"],
    ["اردبیل",38.2498,48.2933,"Asia/Tehran"],["بندرعباس",27.1865,56.2808,"Asia/Tehran"],["اراک",34.0954,49.6892,"Asia/Tehran"],
    ["سنندج",35.3219,46.9862,"Asia/Tehran"],["قزوین",36.2688,50.0041,"Asia/Tehran"],["زنجان",36.6765,48.4963,"Asia/Tehran"],
    ["گرگان",36.8427,54.4439,"Asia/Tehran"],["ساری",36.5633,53.0601,"Asia/Tehran"],["بوشهر",28.9234,50.8203,"Asia/Tehran"],
    ["خرم‌آباد",33.4878,48.3558,"Asia/Tehran"],["بیرجند",32.8649,59.2262,"Asia/Tehran"],["سمنان",35.5769,53.392,"Asia/Tehran"],
    ["ایلام",33.6374,46.4227,"Asia/Tehran"],["یاسوج",30.6682,51.5879,"Asia/Tehran"],["شهرکرد",32.3256,50.8644,"Asia/Tehran"],
    ["بجنورد",37.4747,57.329,"Asia/Tehran"],
    ["مکه",21.4225,39.8262,"Asia/Riyadh"],["مدینه",24.4672,39.6112,"Asia/Riyadh"],["کربلا",32.616,44.0249,"Asia/Baghdad"],
    ["نجف",31.996,44.315,"Asia/Baghdad"],["بغداد",33.3152,44.3661,"Asia/Baghdad"],["دمشق",33.5138,36.2765,"Asia/Damascus"],
    ["بیروت",33.8938,35.5018,"Asia/Beirut"],["قاهره",30.0444,31.2357,"Africa/Cairo"],["استانبول",41.0082,28.9784,"Europe/Istanbul"],
    ["دبی",25.2048,55.2708,"Asia/Dubai"],["دوحه",25.2854,51.531,"Asia/Qatar"],["کویت",29.3759,47.9774,"Asia/Kuwait"],
    ["مسقط",23.588,58.3829,"Asia/Muscat"],["باکو",40.4093,49.8671,"Asia/Baku"],["ایروان",40.1792,44.4991,"Asia/Yerevan"],
    ["عشق‌آباد",37.9601,58.3261,"Asia/Ashgabat"],["دوشنبه",38.5598,68.787,"Asia/Dushanbe"],["تاشکند",41.2995,69.2401,"Asia/Tashkent"],
    ["کابل",34.5553,69.2075,"Asia/Kabul"],["هرات",34.3529,62.204,"Asia/Kabul"],["کراچی",24.8607,67.0011,"Asia/Karachi"],
    ["لاهور",31.5204,74.3587,"Asia/Karachi"],["دهلی",28.6139,77.209,"Asia/Kolkata"],["داکا",23.8103,90.4125,"Asia/Dhaka"],
    ["کوالالامپور",3.139,101.6869,"Asia/Kuala_Lumpur"],["جاکارتا",-6.2088,106.8456,"Asia/Jakarta"],
    ["لندن",51.5074,-0.1278,"Europe/London"],["پاریس",48.8566,2.3522,"Europe/Paris"],["برلین",52.52,13.405,"Europe/Berlin"],
    ["استکهلم",59.3293,18.0686,"Europe/Stockholm"],["تورنتو",43.6532,-79.3832,"America/Toronto"],
    ["نیویورک",40.7128,-74.006,"America/New_York"],["لس‌آنجلس",34.0522,-118.2437,"America/Los_Angeles"],
    ["سیدنی",-33.8688,151.2093,"Australia/Sydney"]
  ];

  /* ================= محاسبهٔ اوقات ================= */
  function zoneNow(tz, date) {
    var o = {};
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" })
        .formatToParts(date).forEach(function (p) { o[p.type] = +p.value; });
    } catch (e) { o = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate(), hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds() }; }
    var asUtc = Date.UTC(o.year, o.month - 1, o.day, o.hour % 24, o.minute, o.second);
    return { y: o.year, m: o.month, d: o.day, h: (o.hour % 24) + o.minute / 60 + o.second / 3600,
             off: (asUtc - Math.floor(date.getTime() / 1000) * 1000) / 3600000 };
  }
  var METHOD = { shia: { fajr: 17.7, mag: 4.5, isha: 14 }, sunni: { fajr: 18, mag: 0.833, isha: 17 } };
  function times(z, lat, lng, sch) {
    var M = METHOD[sch] || METHOD.shia;
    var jd = Date.UTC(z.y, z.m - 1, z.d, 12) / 86400000 + 2440587.5, D = jd - 2451545.0;
    var g = fix(357.529 + 0.98560028 * D, 360), q = fix(280.459 + 0.98564736 * D, 360);
    var L = fix(q + 1.915 * Math.sin(g * rad) + 0.02 * Math.sin(2 * g * rad), 360);
    var e = 23.439 - 0.00000036 * D;
    var RA = Math.atan2(Math.cos(e * rad) * Math.sin(L * rad), Math.cos(L * rad)) / rad / 15;
    var eqt = q / 15 - fix(RA, 24);
    var decl = Math.asin(Math.sin(e * rad) * Math.sin(L * rad)) / rad;
    var noon = 12 + z.off - lng / 15 - eqt;
    function H(alt) {
      var c = (Math.sin(alt * rad) - Math.sin(decl * rad) * Math.sin(lat * rad)) / (Math.cos(decl * rad) * Math.cos(lat * rad));
      return (c > 1 || c < -1) ? NaN : Math.acos(c) / rad / 15;
    }
    var asrAlt = Math.atan(1 / (1 + Math.tan(Math.abs(lat - decl) * rad))) / rad;
    var t = { fajr: noon - H(-M.fajr), sunrise: noon - H(-0.833), zuhr: noon + 0.02, asr: noon + H(asrAlt), maghrib: noon + H(-M.mag), isha: noon + H(-M.isha) };
    if (isNaN(t.fajr)) t.fajr = noon - 6;
    if (isNaN(t.sunrise)) t.sunrise = noon - 5;
    if (isNaN(t.asr)) t.asr = noon + 3;
    if (isNaN(t.maghrib)) t.maghrib = noon + 6;
    if (isNaN(t.isha)) t.isha = noon + 7.5;
    return t;
  }
  function qiblaBearing(lat, lng) {
    var a = lat * rad, b = 21.4225 * rad, d = (39.8262 - lng) * rad;
    return fix(Math.atan2(Math.sin(d) * Math.cos(b), Math.cos(a) * Math.sin(b) - Math.sin(a) * Math.cos(b) * Math.cos(d)) / rad, 360);
  }
  function compassWord(b) {
    var w = ["شمال", "شمال شرق", "شرق", "جنوب شرق", "جنوب", "جنوب غرب", "غرب", "شمال غرب"];
    return w[Math.round(b / 45) % 8];
  }

  /* ================= دادهٔ نمازها ================= */
  var P = [
    { k: "fajr", n: "صبح", r: 2, loud: [1, 2] },
    { k: "zuhr", n: "ظهر", r: 4, loud: [] },
    { k: "asr", n: "عصر", r: 4, loud: [] },
    { k: "maghrib", n: "مغرب", r: 3, loud: [1, 2] },
    { k: "isha", n: "عشا", r: 4, loud: [1, 2] }
  ];
  function pr(k) { return P.filter(function (p) { return p.k === k; })[0]; }

  /* ================= مراحل نماز ================= */
  var T = {
    takbir: "اللَّهُ أَكْبَر",
    fatiha: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ…",
    arba: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ",
    qunut: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    ruku: "سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ",
    sajdah: "سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ",
    tashShia: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ ۝ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ ۝ اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ",
    tashSunni: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ ۝ السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ ۝ السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ ۝ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    salawat: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ…",
    salamShia: "السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ ۝ السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ ۝ السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ",
    salamSunni: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ"
  };

  function buildSteps(p, r, sch) {
    var shia = sch === "shia", total = p.r, last = r === total;
    var tash = last || (r === 2 && total > 2);
    var loud = p.loud.indexOf(r) >= 0;
    var S = [];
    if (r === 1) S.push({ name: "تکبیرة‌الاحرام", ar: T.takbir, fa: "نیت کن، دست‌ها را تا بناگوش بالا ببر و بگو", pose: "stand" });
    var q = { name: "قیام", pose: "stand", tags: [loud ? "بلند" : "آهسته"] };
    if (r <= 2) { q.ar = T.fatiha; q.fa = "سورهٔ حمد، سپس یک سوره (مثلاً توحید)"; }
    else if (shia) { q.ar = T.arba; q.fa = "یک بار حمد، یا تسبیحات اربعه (۳ بار)"; q.tags = ["آهسته", "۳ بار"]; }
    else { q.ar = T.fatiha; q.fa = "فقط سورهٔ حمد"; q.tags = ["آهسته"]; }
    S.push(q);
    if (shia && r === 2) S.push({ name: "قنوت (مستحب)", ar: T.qunut, fa: "دست‌ها را مقابل صورت بگیر و دعا کن", pose: "stand", tags: ["اختیاری"] });
    S.push({ name: "رکوع", ar: T.ruku, fa: "با «الله اکبر» به رکوع برو؛ دست‌ها روی زانو", pose: "ruku", tags: ["۳ بار"] });
    S.push({ name: "برخاستن از رکوع", ar: shia ? "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ" : "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ۝ رَبَّنَا وَلَكَ الْحَمْدُ", fa: "صاف بایست و آرام بگیر", pose: "stand" });
    S.push({ name: "سجدهٔ اول", ar: T.sajdah, fa: "با «الله اکبر» به سجده برو؛ پیشانی، دو کف، دو زانو و دو شست پا روی زمین", pose: "sajdah", tags: ["۳ بار"] });
    S.push({ name: "نشستن بین دو سجده", ar: shia ? "أَسْتَغْفِرُ اللَّهَ رَبِّي وَأَتُوبُ إِلَيْهِ" : "رَبِّ اغْفِرْ لِي", fa: "با «الله اکبر» بنشین و آرام بگیر", pose: "sit" });
    S.push({ name: "سجدهٔ دوم", ar: T.sajdah, fa: "دوباره با «الله اکبر» به سجده برو", pose: "sajdah", tags: ["۳ بار"], rk: true });
    if (tash) {
      var ts = shia ? T.tashShia : T.tashSunni;
      if (!shia && last) ts += " ۝ " + T.salawat;
      S.push({ name: last ? "تشهد آخر" : "تشهد", ar: ts, fa: last ? "بنشین و تشهد را بخوان" : "بنشین و تشهد را بخوان، سپس برای رکعت بعد برخیز", pose: "sit", rk: true });
    } else {
      S.push({ name: "برخاستن", ar: shia ? "بِحَوْلِ اللَّهِ وَقُوَّتِهِ أَقُومُ وَأَقْعُدُ" : T.takbir, fa: "برای رکعت بعد برخیز", pose: "stand", rk: true });
    }
    if (last) S.push({ name: "سلام نماز", ar: shia ? T.salamShia : T.salamSunni, fa: shia ? "به راست و چپ نگاه کن و سلام بده" : "اول به راست، بعد به چپ سلام بده", pose: "sit", rk: true });
    return S;
  }

  /* ================= تعقیبات ================= */
  var AYAT_KURSI = "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ";
  var TAWHID = "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ";
  var ISTIGHFAR = "أَسْتَغْفِرُ اللَّهَ رَبِّي وَأَتُوبُ إِلَيْهِ";
  var HELAL = "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ";

  function tqItems(k, sch) {
    var shia = sch === "shia", L = [];
    var helal = (k === "fajr" || k === "maghrib");
    if (shia) {
      L.push({ n: "تکبیر", ar: "اللَّهُ أَكْبَرُ", fa: "پس از سلام، دست‌ها را تا نزدیک گوش بالا ببر و سه بار بگو", c: 3 });
      L.push({ n: "استغفار", ar: ISTIGHFAR, fa: "از خدا آمرزش بخواه", c: 3 });
      L.push({ n: "تسبیح حضرت زهرا (س) · ۱", ar: "اللَّهُ أَكْبَرُ", fa: "۳۴ بار «الله اکبر»", c: 34 });
      L.push({ n: "تسبیح حضرت زهرا (س) · ۲", ar: "الْحَمْدُ لِلَّهِ", fa: "۳۳ بار «الحمد لله»", c: 33 });
      L.push({ n: "تسبیح حضرت زهرا (س) · ۳", ar: "سُبْحَانَ اللَّهِ", fa: "۳۳ بار «سبحان الله»", c: 33 });
    } else {
      L.push({ n: "استغفار", ar: ISTIGHFAR, fa: "سه بار از خدا آمرزش بخواه", c: 3 });
      L.push({ n: "ذکر پس از سلام", ar: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ", fa: "یک بار", c: 1 });
      L.push({ n: "تسبیحات · ۱", ar: "سُبْحَانَ اللَّهِ", fa: "۳۳ بار «سبحان الله»", c: 33 });
      L.push({ n: "تسبیحات · ۲", ar: "الْحَمْدُ لِلَّهِ", fa: "۳۳ بار «الحمد لله»", c: 33 });
      L.push({ n: "تسبیحات · ۳", ar: "اللَّهُ أَكْبَرُ", fa: "۳۴ بار «الله اکبر»", c: 34 });
    }
    if (helal) L.push({ n: "تهلیل (" + (k === "fajr" ? "پس از صبح" : "پس از مغرب") + ")", ar: HELAL, fa: "۱۰ بار", c: 10 });
    L.push({ n: "آیة‌الکرسی", ar: AYAT_KURSI, fa: "سورهٔ بقره، آیهٔ ۲۵۵", c: 1 });
    L.push({ n: "سورهٔ توحید", ar: TAWHID, fa: "سورهٔ اخلاص", c: 1 });
    L.push({ n: "حوقله", ar: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ", fa: "هیچ نیرو و توانی جز از خدا نیست", c: 3 });
    L.push({ n: "صلوات", ar: shia ? "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ وَعَجِّلْ فَرَجَهُمْ" : "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ", fa: "سه بار صلوات بفرست", c: 3 });
    if (shia) L.push({ n: "سجدهٔ شکر", ar: "شُكْرًا لِلَّهِ", fa: "پیشانی را بر زمین بگذار و سه بار بگو؛ سپس خواسته‌ات را از خدا بخواه", c: 3 });
    return L;
  }

  /* ================= وضعیت ================= */
  var cfg = Object.assign({ theme: "auto", tap: "step", tq: "on", alert: "off", fs: 26, imgs: {} }, load("rk-cfg", {}));
  var loc = load("rk-loc", { label: "تهران", lat: 35.6892, lng: 51.389, tz: "Asia/Tehran" });
  var scheme = load("rk-scheme", "shia");
  var sess = load("rk-sess", null);   // {t:'p'|'q', k, r, s, i, c}
  var log = load("rk-log", {});       // {"y-m-d":["fajr",...]}
  var C = null;                       // کش محاسبات
  var heading = null, wake = null;

  function saveCfg() { save("rk-cfg", cfg); }
  function imgFor(p) { return (cfg.imgs && cfg.imgs[p]) || DEFAULT_IMAGES[p] || ""; }
  function dayKey(z) { return z.y + "-" + z.m + "-" + z.d; }

  function applyCfg() {
    var root = document.documentElement;
    if (cfg.theme === "auto") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", cfg.theme);
    root.style.setProperty("--arfs", cfg.fs + "px");
    [["themeSeg", cfg.theme], ["tapSeg", cfg.tap], ["tqSeg", cfg.tq], ["alertSeg", cfg.alert]].forEach(function (x) {
      all("#" + x[0] + " button").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.v === x[1]); });
    });
    all(".field.img").forEach(function (i) { i.value = (cfg.imgs && cfg.imgs[i.dataset.p]) || ""; });
  }

  /* ================= محاسبهٔ وضعیت فعلی ================= */
  function compute() {
    var now = new Date(), z = zoneNow(loc.tz, now), t = times(z, loc.lat, loc.lng, scheme);
    var order = ["fajr", "zuhr", "asr", "maghrib", "isha"];
    var end = { fajr: t.sunrise, zuhr: t.asr, asr: t.maghrib, maghrib: t.isha, isha: t.fajr + 24 };
    var n = z.h < t.fajr ? z.h + 24 : z.h, cur = null, i;
    for (i = 0; i < order.length; i++) if (n >= t[order[i]] && n < end[order[i]]) cur = order[i];
    var res = { z: z, t: t, now: now, cur: cur };
    if (cur) res.left = end[cur] - n;
    else {
      var nx = "zuhr";
      for (i = 0; i < order.length; i++) if (t[order[i]] > z.h) { nx = order[i]; break; }
      res.next = nx; res.wait = t[nx] - z.h;
    }
    res.chosen = cur || res.next;
    return res;
  }
  function minutesText(m) {
    m = Math.max(0, Math.round(m));
    var h = Math.floor(m / 60), mm = m % 60;
    return h && mm ? f(h) + " ساعت و " + f(mm) + " دقیقه" : h ? f(h) + " ساعت" : f(mm) + " دقیقه";
  }

  /* ================= صفحهٔ اصلی ================= */
  function renderHome() {
    C = compute();
    var z = C.z, t = C.t;
    $("clock").textContent = hhmm(z.h);
    if (C.cur) {
      $("nowText").textContent = "الان وقت نماز " + pr(C.cur).n + " است";
      $("subText").textContent = minutesText(C.left * 60) + " تا پایان وقت";
    } else {
      $("nowText").textContent = "نماز بعدی: " + pr(C.next).n;
      $("subText").textContent = minutesText(C.wait * 60) + " دیگر، ساعت " + hhmm(t[C.next]);
    }
    $("startBtn").textContent = "شروع نماز " + pr(C.chosen).n;
    $("locName").textContent = loc.label;

    try {
      var d = new Date(), o = { timeZone: loc.tz, weekday: "long", day: "numeric", month: "long", year: "numeric" };
      $("dates").textContent = new Intl.DateTimeFormat("fa-IR-u-ca-persian", o).format(d) + " · " +
        new Intl.DateTimeFormat("fa-IR-u-ca-islamic", { timeZone: loc.tz, day: "numeric", month: "long", year: "numeric" }).format(d);
    } catch (e) { $("dates").textContent = ""; }

    var done = log[dayKey(z)] || [], html = "";
    P.forEach(function (p) {
      var cls = p.k === C.cur ? "cur" : (t[p.k] < z.h ? "past" : "");
      html += '<li class="' + cls + '"><button type="button" data-k="' + p.k + '"><span>' + p.n +
        '<span class="r">' + f(p.r) + " رکعت</span>" + (done.indexOf(p.k) >= 0 ? '<span class="ok">✓</span>' : "") +
        '</span><span class="t">' + hhmm(t[p.k]) + "</span></button></li>";
    });
    $("list").innerHTML = html;
    var dh = "";
    P.forEach(function (p) { dh += '<i class="' + (done.indexOf(p.k) >= 0 ? "on" : "") + '"></i>'; });
    $("daily").innerHTML = dh + "<span>امروز " + f(done.length) + " از ۵</span>";

    all("[data-s]").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.s === scheme); });
    drawTimeline();
    drawQibla();
  }

  function drawTimeline() {
    var t = C.t, W = 320, x = function (h) { return (fix(h, 24) / 24) * W; };
    var s = '<rect x="0" y="30" width="' + W + '" height="16" rx="8" fill="var(--night)"/>';
    var a = x(t.sunrise), b = x(t.maghrib);
    s += '<rect x="' + a + '" y="30" width="' + (b - a) + '" height="16" fill="var(--day)"/>';
    [["fajr", "صبح"], ["zuhr", "ظهر"], ["asr", "عصر"], ["maghrib", "مغرب"], ["isha", "عشا"]].forEach(function (m, i) {
      var px = x(t[m[0]]);
      s += '<line x1="' + px + '" x2="' + px + '" y1="28" y2="48" stroke="var(--ink)" stroke-width="1.5"/>';
      s += '<text class="' + (C.cur === m[0] ? "on" : "") + '" x="' + px + '" y="' + (i % 2 === 0 ? 20 : 63) + '">' + m[1] + "</text>";
    });
    s += '<circle cx="' + x(C.z.h) + '" cy="38" r="9" fill="var(--sun)" stroke="var(--bg)" stroke-width="3"/>';
    s += '<text x="12" y="80">۰۰</text><text x="160" y="80">۱۲</text><text x="308" y="80">۲۴</text>';
    $("timeline").innerHTML = s;
  }

  /* ================= قبله ================= */
  function drawQibla() {
    var b = qiblaBearing(loc.lat, loc.lng);
    $("qDeg").textContent = f(Math.round(b)) + "° از شمال (" + compassWord(b) + ")";
    var rot = heading == null ? b : b - heading;
    $("needle").style.transform = "rotate(" + rot + "deg)";
    $("compassBtn").hidden = heading != null;
  }
  function onOri(e) {
    var h = null;
    if (e.webkitCompassHeading != null) h = e.webkitCompassHeading;
    else if (e.alpha != null && (e.absolute || e.type === "deviceorientationabsolute")) h = 360 - e.alpha;
    if (h == null) return;
    heading = h; drawQibla();
  }
  function startCompass() {
    var D = window.DeviceOrientationEvent;
    function go() {
      window.addEventListener("deviceorientationabsolute", onOri, true);
      window.addEventListener("deviceorientation", onOri, true);
      setTimeout(function () { if (heading == null) toast("حسگر جهت در این دستگاه در دسترس نیست."); }, 2000);
    }
    if (D && typeof D.requestPermission === "function") {
      D.requestPermission().then(function (r) { if (r === "granted") go(); else toast("اجازهٔ حسگر داده نشد."); }).catch(function () { toast("حسگر جهت در دسترس نیست."); });
    } else go();
  }

  /* ================= ناوبری ================= */
  function show(id) {
    ["home", "pray", "taqib", "end", "loc", "settings"].forEach(function (s) { $(s).hidden = s !== id; });
    window.scrollTo(0, 0);
    setWake(id === "pray" || id === "taqib");
  }
  function setWake(on) {
    try {
      if (on && "wakeLock" in navigator) navigator.wakeLock.request("screen").then(function (l) { wake = l; }).catch(function () {});
      else if (!on && wake) { wake.release(); wake = null; }
    } catch (e) {}
  }
  function home() { show("home"); renderHome(); }

  /* ================= نماز ================= */
  var steps = [];
  function start(k) { sess = { t: "p", k: k, r: 1, s: 0 }; save("rk-sess", sess); renderPray(); }

  function renderPray() {
    var p = pr(sess.k);
    steps = buildSteps(p, sess.r, scheme);
    if (sess.s >= steps.length) sess.s = steps.length - 1;
    var st = steps[sess.s];
    show("pray");
    $("title").textContent = "نماز " + p.n + " · رکعت " + f(sess.r) + " از " + f(p.r);
    var done = sess.r - 1 + (st.rk ? 1 : 0), rh = "";
    for (var i = 0; i < p.r; i++) rh += '<i class="' + (i < done ? "full" : "") + (i === sess.r - 1 ? " act" : "") + '"><b></b></i>';
    $("rakats").innerHTML = rh;

    var url = imgFor(st.pose), img = $("poseImg"), pose = $("pose");
    $("poseLabel").textContent = POSE_NAME[st.pose];
    if (url) { img.src = url; img.hidden = false; pose.className = "pose"; img.onerror = function () { img.hidden = true; pose.className = "pose noimg"; }; }
    else { img.hidden = true; pose.className = "pose noimg"; }

    $("stepName").textContent = st.name;
    $("arText").textContent = st.ar;
    $("faText").textContent = st.fa;
    $("badges").innerHTML = (st.tags || []).map(function (t) { return '<span class="' + (t === "بلند" ? "loud" : "") + '">' + t + "</span>"; }).join("");
    var dh = ""; steps.forEach(function (_, j) { dh += '<i class="' + (j === sess.s ? "on" : "") + '"></i>'; });
    $("dots").innerHTML = dh;
    $("tapNote").textContent = cfg.tap === "rakat" ? "هر لمس = یک رکعت" : "هر جای صفحه را لمس کن";
    save("rk-sess", sess);
  }
  function prayNext() {
    var p = pr(sess.k);
    if (cfg.tap === "rakat") {
      buzz(40);
      if (sess.r < p.r) { sess.r++; sess.s = 0; renderPray(); } else finishPrayer();
      return;
    }
    if (sess.s < steps.length - 1) { sess.s++; buzz(15); renderPray(); return; }
    if (sess.r < p.r) { sess.r++; sess.s = 0; buzz(40); renderPray(); return; }
    finishPrayer();
  }
  function prayPrev() {
    if (sess.s > 0 && cfg.tap !== "rakat") { sess.s--; renderPray(); return; }
    if (sess.r > 1 && (cfg.tap === "rakat" || sess.s === 0)) {
      sess.r--; sess.s = cfg.tap === "rakat" ? 0 : buildSteps(pr(sess.k), sess.r, scheme).length - 1; renderPray();
    }
  }
  function finishPrayer() {
    buzz([80, 40, 80]);
    var z = zoneNow(loc.tz, new Date()), key = dayKey(z);
    log[key] = log[key] || [];
    if (log[key].indexOf(sess.k) < 0) log[key].push(sess.k);
    save("rk-log", log);
    if (cfg.tq === "on") { sess = { t: "q", k: sess.k, i: 0, c: 0 }; save("rk-sess", sess); renderTq(); }
    else endAll("نمازت ثبت شد.");
  }

  /* ================= تعقیبات: نمایش ================= */
  var items = [];
  function renderTq() {
    items = tqItems(sess.k, scheme);
    if (sess.i >= items.length) sess.i = items.length - 1;
    var it = items[sess.i];
    show("taqib");
    $("tqTitle").textContent = "تعقیبات نماز " + pr(sess.k).n;
    var h = ""; items.forEach(function (_, j) { h += '<i class="' + (j < sess.i ? "full" : "") + (j === sess.i ? " act" : "") + '"><b></b></i>'; });
    $("tqBar").innerHTML = h;
    $("tqName").textContent = it.n;
    $("tqAr").textContent = it.ar;
    $("tqFa").textContent = it.fa;
    drawCount();
    save("rk-sess", sess);
  }
  function drawCount() {
    var it = items[sess.i];
    $("cnt").textContent = f(sess.c);
    $("cntOf").textContent = it.c > 1 ? "از " + f(it.c) : "لمس برای ادامه";
    $("ring").style.setProperty("--p", it.c > 1 ? (sess.c / it.c) * 100 : 0);
    var r = $("ring"); r.classList.remove("pulse"); void r.offsetWidth; r.classList.add("pulse");
    if (it.c <= 1) $("cnt").textContent = "◦";
  }
  function tqNext() {
    var it = items[sess.i];
    if (it.c > 1 && sess.c < it.c - 1) { sess.c++; buzz(10); drawCount(); save("rk-sess", sess); return; }
    if (it.c > 1) { sess.c = it.c; drawCount(); }
    buzz(it.c > 1 ? [50, 30, 50] : 20);
    if (sess.i < items.length - 1) { sess.i++; sess.c = 0; renderTq(); }
    else endAll("تعقیبات هم تمام شد. دعاهایت مستجاب.");
  }
  function tqPrev() {
    if (sess.c > 0) { sess.c = 0; renderTq(); return; }
    if (sess.i > 0) { sess.i--; renderTq(); }
  }
  function endAll(msg) {
    sess = null; save("rk-sess", null);
    $("endText").textContent = msg;
    show("end");
  }

  /* ================= موقعیت ================= */
  function renderCities(q) {
    q = (q || "").trim();
    var h = "";
    CITIES.forEach(function (c, i) {
      if (!q || c[0].indexOf(q) >= 0) h += '<li><button type="button" data-i="' + i + '">' + c[0] + "</button></li>";
    });
    $("cityList").innerHTML = h || '<li class="note">شهری پیدا نشد؛ از موقعیت دقیق استفاده کن.</li>';
  }
  function setLoc(l) { loc = l; save("rk-loc", loc); home(); }

  /* ================= اعلان وقت ================= */
  var lastAlert = load("rk-alerted", "");
  function checkAlert() {
    if (cfg.alert !== "on") return;
    var c = compute();
    P.forEach(function (p) {
      var d = c.z.h - c.t[p.k];
      var key = dayKey(c.z) + p.k;
      if (d >= 0 && d < 0.05 && lastAlert !== key) {
        lastAlert = key; save("rk-alerted", key);
        toast("وقت نماز " + p.n + " شد");
        beep(); buzz([200, 100, 200]);
        try { if (window.Notification && Notification.permission === "granted") new Notification("وقت نماز " + p.n); } catch (e) {}
      }
    });
  }

  /* ================= آمار ================= */
  function renderStats() {
    var days = Object.keys(log), total = 0, full = 0;
    days.forEach(function (d) { total += log[d].length; if (log[d].length >= 5) full++; });
    $("stats").textContent = "نمازهای ثبت‌شده: " + f(total) + " · روزهای کامل: " + f(full) + " از " + f(days.length) + " روز";
  }

  /* ================= رویدادها ================= */
  $("startBtn").onclick = function () { start(C.chosen); };
  $("list").onclick = function (e) { var b = e.target.closest("button[data-k]"); if (b) start(b.dataset.k); };
  all("[data-s]").forEach(function (b) { b.onclick = function () { scheme = b.dataset.s; save("rk-scheme", scheme); renderHome(); }; });
  $("homeBtn").onclick = home;
  $("exitBtn").onclick = function () { sess = null; save("rk-sess", null); home(); };
  $("skipBtn").onclick = function () { endAll("نمازت ثبت شد."); };
  $("prevBtn").onclick = function (e) { e.stopPropagation(); prayPrev(); };
  $("tqPrev").onclick = function (e) { e.stopPropagation(); tqPrev(); };
  $("compassBtn").onclick = startCompass;

  // لمس هر جای صفحه
  document.addEventListener("click", function (e) {
    if (e.target.closest("button,input,a,select,label")) return;
    if (!$("pray").hidden) prayNext();
    else if (!$("taqib").hidden) tqNext();
  });

  // موقعیت
  $("locBtn").onclick = function () { renderCities(""); $("citySearch").value = ""; $("gpsMsg").textContent = ""; show("loc"); };
  $("citySearch").oninput = function () { renderCities(this.value); };
  $("cityList").onclick = function (e) {
    var b = e.target.closest("button[data-i]"); if (!b) return;
    var c = CITIES[+b.dataset.i]; setLoc({ label: c[0], lat: c[1], lng: c[2], tz: c[3] });
  };
  $("gpsBtn").onclick = function () {
    if (!navigator.geolocation) { $("gpsMsg").textContent = "این مرورگر موقعیت‌یابی ندارد."; return; }
    $("gpsMsg").textContent = "در حال یافتن موقعیت…";
    navigator.geolocation.getCurrentPosition(function (pos) {
      var tz = "UTC"; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"; } catch (e) {}
      setLoc({ label: "موقعیت من", lat: pos.coords.latitude, lng: pos.coords.longitude, tz: tz });
    }, function () { $("gpsMsg").textContent = "اجازهٔ موقعیت داده نشد؛ شهر را از فهرست انتخاب کن."; }, { timeout: 10000 });
  };

  // تنظیمات
  $("setBtn").onclick = function () { applyCfg(); renderStats(); show("settings"); };
  all(".back").forEach(function (b) { b.onclick = home; });
  function seg(id, key, after) {
    all("#" + id + " button").forEach(function (b) {
      b.onclick = function () { cfg[key] = b.dataset.v; saveCfg(); applyCfg(); if (after) after(); };
    });
  }
  seg("themeSeg", "theme"); seg("tapSeg", "tap"); seg("tqSeg", "tq");
  seg("alertSeg", "alert", function () {
    if (cfg.alert === "on") {
      try { if (window.Notification && Notification.permission === "default") Notification.requestPermission(); } catch (e) {}
      toast("صفحه باید باز بماند تا اعلان بدهد.");
    }
  });
  $("fsPlus").onclick = function () { cfg.fs = Math.min(40, cfg.fs + 2); saveCfg(); applyCfg(); };
  $("fsMinus").onclick = function () { cfg.fs = Math.max(18, cfg.fs - 2); saveCfg(); applyCfg(); };
  all(".field.img").forEach(function (i) {
    i.oninput = function () { cfg.imgs = cfg.imgs || {}; cfg.imgs[i.dataset.p] = i.value.trim(); saveCfg(); };
  });
  $("resetStats").onclick = function () { log = {}; save("rk-log", log); renderStats(); toast("آمار پاک شد."); };

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) { if (!$("home").hidden) renderHome(); if (!$("pray").hidden || !$("taqib").hidden) setWake(true); }
  });
  setInterval(function () { if (!$("home").hidden) renderHome(); checkAlert(); }, 20000);

  /* ================= شروع ================= */
  applyCfg();
  if (sess && sess.t === "q" && sess.k && pr(sess.k)) renderTq();
  else if (sess && sess.k && pr(sess.k)) renderPray();
  else { show("home"); renderHome(); }
})();
