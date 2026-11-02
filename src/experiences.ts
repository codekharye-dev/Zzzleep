import { countries } from "./countries.ts";
import type { LocalizedText } from "./data.ts";
import { todayISO } from "./booking.ts";
export type ExperienceCountry = "AZ" | "TR" | "US" | "IT" | "JP" | "CN";
export type ExperienceCategory = "food" | "outdoor" | "culture" | "craft";
export interface ExperienceDish {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  image: string;
  tier: 1 | 2 | 3;
  details: LocalizedText[];
}
export interface Experience {
  id: string;
  country: ExperienceCountry;
  city: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  category: ExperienceCategory;
  price: number;
  duration: number;
  maxGuests: number;
  minAge: number;
  host: string;
  hero: string;
  languages: LocalizedText;
  concept?: boolean;
  menu?: ExperienceDish[];
  steps: { minutes: number; title: LocalizedText; body: LocalizedText }[];
  included: LocalizedText[];
  excluded: LocalizedText[];
}
const l = (az: string, en: string, ru: string): LocalizedText => ({
  az,
  en,
  ru,
});
export const experienceCountries = [
  ...countries.map((c) => ({
    code: c.code as ExperienceCountry,
    name: c.name,
    image: c.image,
  })),
  {
    code: "CN" as const,
    name: l("Çin", "China", "Китай"),
    image: "/flags/cn.svg",
  },
];
const wheat = l("Buğda", "Wheat", "Пшеница"),
  soy = l("Soya", "Soy", "Соя"),
  egg = l("Yumurta", "Egg", "Яйцо"),
  milk = l("Süd", "Milk", "Молоко"),
  shellfish = l("Dəniz məhsulları", "Shellfish", "Морепродукты");
export const chineseDishes: ExperienceDish[] = [
  {
    id: "wok-beef",
    name: l("Dana ətli wok", "Beef wok noodles", "Вок с говядиной"),
    description: l(
      "Əriştə, dana əti və rəngli tərəvəzlər. Wok texnikasının sürətli, isti ritmini kəşf et.",
      "Noodles, beef and colorful vegetables. Discover the hot, fast rhythm of wok cooking.",
      "Лапша, говядина и овощи. Откройте быстрый и горячий ритм приготовления в воке.",
    ),
    image: "/experiences/wok-beef.png",
    tier: 2,
    details: [wheat, soy, l("Ətli dadım", "Beef tasting", "Дегустация мяса")],
  },
  {
    id: "wok-chicken",
    name: l("Toyuqlu wok", "Chicken wok noodles", "Вок с курицей"),
    description: l(
      "Toyuq, əriştə və tərəvəzlərin yüngül sousla birləşməsi. Kiçik dadım porsiyası.",
      "Chicken, noodles and vegetables brought together with a light sauce, in a tasting portion.",
      "Курица, лапша и овощи в лёгком соусе, в дегустационной порции.",
    ),
    image: "/experiences/wok-chicken.png",
    tier: 2,
    details: [wheat, soy, egg],
  },
  {
    id: "wok-mixed",
    name: l("Qarışıq wok dadımı", "Mixed wok tasting", "Ассорти вок"),
    description: l(
      "Tərəvəz və əriştə üzərində qarışıq dadlar. Nümunə reseptin tərkibi real tədbirdə dəqiqləşdirilməlidir.",
      "Mixed flavors over noodles and vegetables. The sample recipe must be confirmed for any real event.",
      "Сочетание вкусов с лапшой и овощами. Состав примера необходимо уточнить для реального мероприятия.",
    ),
    image: "/experiences/wok-mixed.png",
    tier: 2,
    details: [wheat, soy, shellfish],
  },
  {
    id: "wok-vegetables",
    name: l("Tərəvəzli wok", "Vegetable wok noodles", "Овощной вок"),
    description: l(
      "Bibər, göyərti və əriştə ilə tərəvəz dadımı. Bu nümunə resept allergen və vegetarian zəmanəti deyil.",
      "A vegetable tasting with peppers, greens and noodles. This sample recipe is not an allergen or vegetarian guarantee.",
      "Дегустация овощей с перцем, зеленью и лапшой. Пример не гарантирует отсутствие аллергенов или вегетарианский состав.",
    ),
    image: "/experiences/wok-vegetables.png",
    tier: 1,
    details: [wheat, soy],
  },
];
export const americanDishes: ExperienceDish[] = [
  {
    id: "american-burger",
    name: l("Klassik burger", "Classic burger", "Классический бургер"),
    description: l(
      "Dana kotleti, çörək, salat və tərəvəzlər. ABŞ şəhər mətbəxinin tanış dadlarına kiçik giriş.",
      "A beef patty, bun, greens and vegetables. A little introduction to familiar American city flavors.",
      "Говяжья котлета, булочка, салат и овощи. Знакомство с городскими вкусами США.",
    ),
    image: "/experiences/burger.png",
    tier: 2,
    details: [
      wheat,
      egg,
      l(
        "Kiçik dadım porsiyası",
        "Small tasting portion",
        "Небольшая дегустационная порция",
      ),
    ],
  },
  {
    id: "american-steak",
    name: l("Steyk və kartof", "Steak & potatoes", "Стейк с картофелем"),
    description: l(
      "Ət, kartof və göyərti. Məqsəd böyük porsiya deyil, birlikdə dadları müqayisə etməkdir.",
      "Steak, potatoes and greens. Compare flavors together in a small tasting portion.",
      "Мясо, картофель и зелень. Небольшая порция, чтобы вместе сравнить вкусы.",
    ),
    image: "/experiences/steak.png",
    tier: 2,
    details: [l("Dana əti", "Beef", "Говядина"), milk],
  },
  {
    id: "american-brunch",
    name: l("Amerika səhər yeməyi", "American brunch", "Американский бранч"),
    description: l(
      "Yumurta, tost, tərəvəz və ət dadımı ilə günə başqa cür bax. Tərkib nümunədir.",
      "Eggs, toast, vegetables and a meat tasting for a new take on brunch. Ingredients are illustrative.",
      "Яйца, тост, овощи и мясная дегустация. Состав приведён для примера.",
    ),
    image: "/experiences/brunch.png",
    tier: 1,
    details: [egg, wheat, milk],
  },
  {
    id: "american-seafood",
    name: l("Sahil dadları", "Coastal seafood tasting", "Вкусы побережья"),
    description: l(
      "Dəniz məhsulları ilə sahil mətbəxinə giriş. Allergiyanız varsa real təşkilatçı ilə əvvəlcədən danışın.",
      "A little introduction to coastal seafood. Discuss allergies with a real organizer beforehand.",
      "Знакомство с прибрежной кухней. Заранее обсудите аллергию с реальным организатором.",
    ),
    image: "/experiences/seafood.png",
    tier: 3,
    details: [shellfish, egg],
  },
];
const foodSteps = [
  {
    minutes: 30,
    title: l(
      "Tanışlıq və hekayələr",
      "Meet & share stories",
      "Знакомство и истории",
    ),
    body: l(
      "Bələdçi ilə görüş, nümunə menyu və tərkiblə tanışlıq.",
      "Meet your guide and explore the sample menu and ingredients.",
      "Знакомство с гидом, примером меню и ингредиентами.",
    ),
  },
  {
    minutes: 90,
    title: l(
      "Yerli dadların izi ilə",
      "Follow the local flavors",
      "По следам местных вкусов",
    ),
    body: l(
      "Hazırlanma üsullarını kəşf et və kiçik porsiyaları müqayisə et.",
      "Explore preparation techniques and compare small tasting portions.",
      "Изучите способы приготовления и сравните дегустационные порции.",
    ),
  },
  {
    minutes: 60,
    title: l(
      "Bir süfrə, yeni xatirələr",
      "One table, new memories",
      "Один стол, новые воспоминания",
    ),
    body: l(
      "Birlikdə dadım, suallar və səfərə aparacağın kiçik hekayələr.",
      "Taste together, ask questions and take a little story home.",
      "Совместная дегустация, вопросы и истории на память.",
    ),
  },
];
const natureSteps = [
  {
    minutes: 20,
    title: l("Görüş və hazırlıq", "Meet & get ready", "Встреча и подготовка"),
    body: l(
      "Marşrutla tanışlıq, hava və iştirak şərtlərinin nümunə izahı.",
      "A sample route introduction and overview of conditions.",
      "Пример знакомства с маршрутом и условиями.",
    ),
  },
  {
    minutes: 30,
    title: l("Yeni bir mənzərə", "A new perspective", "Новый вид"),
    body: l(
      "Bələdçi ilə mənzərəni kəşf etmək və foto fasiləsi.",
      "Discover the scenery with a guide and take a photo break.",
      "Знакомство с пейзажем и остановка для фото.",
    ),
  },
  {
    minutes: 40,
    title: l("Sakit bir fasilə", "A little pause", "Небольшая пауза"),
    body: l(
      "Gəzinti və görüş nöqtəsinə qayıdışla sınaq proqramını tamamla.",
      "Finish the sample program with a walk and return to the meeting point.",
      "Завершите пример программы прогулкой и возвращением к месту встречи.",
    ),
  },
];
const guide = l(
  "Yerli bələdçi ilə nümunə proqram",
  "Sample program with a local guide",
  "Пример программы с местным гидом",
);
const transport = l(
  "Görüş yerinə gediş-gəliş",
  "Transport to the meeting point",
  "Проезд до места встречи",
);
export const experiences: Experience[] = [
  {
    id: "beijing-wok",
    country: "CN",
    city: l("Pekin", "Beijing", "Пекин"),
    title: l(
      "Çin mətbəxi ilə tanışlıq",
      "An introduction to Chinese flavors",
      "Знакомство с китайской кухней",
    ),
    description: l(
      "Wokun səsi, təzə tərəvəzlərin ətri və bir masa ətrafında yeni tanışlıqlar. Bu nümunə təcrübədə Çin üslublu wok texnikası və dörd fərqli dadımla tanış ol.",
      "The sound of a wok, fresh vegetables and new faces around one table. Explore Chinese-style wok techniques and four sample tastings.",
      "Звук вока, аромат свежих овощей и новые знакомства за одним столом. Пример знакомства с китайской техникой вок и четырьмя вкусами.",
    ),
    category: "food",
    price: 200,
    duration: 180,
    maxGuests: 8,
    minAge: 16,
    host: "Li Wei",
    hero: "/experiences/chinese-cuisine.webp",
    languages: l("İngilis dili", "English", "Английский"),
    menu: chineseDishes,
    steps: foodSteps,
    included: [
      guide,
      l(
        "Menyudakı 4 nümunə dadım",
        "4 sample menu tastings",
        "4 дегустации из меню",
      ),
      l("Alkoqolsuz içki", "A non-alcoholic drink", "Безалкогольный напиток"),
    ],
    excluded: [transport],
  },
  {
    id: "new-york-flavors",
    country: "US",
    city: l("Nyu-York", "New York", "Нью-Йорк"),
    title: l(
      "Amerikanın dadları, bir süfrədə",
      "A table full of American flavors",
      "Вкусы Америки за одним столом",
    ),
    description: l(
      "Şəhər ritminin içində bir dad fasiləsi. Burgerdən steykə, brunchdan sahil dadlarına — ABŞ-a uyğunlaşdırılmış bu menyunu bələdçi hekayələri ilə kəşf et.",
      "A little tasting break in the city rhythm. From burgers and steak to brunch and coastal flavors — explore this American menu with a guide’s stories.",
      "Дегустационная пауза в ритме города. От бургера и стейка до бранча и вкусов побережья — меню Америки с историями гида.",
    ),
    category: "food",
    price: 125,
    duration: 180,
    maxGuests: 8,
    minAge: 12,
    host: "Alex Carter",
    hero: "/experiences/american-food.jpg",
    languages: l("İngilis dili", "English", "Английский"),
    menu: americanDishes,
    steps: foodSteps,
    included: [
      guide,
      l(
        "4 kiçik dadım porsiyası",
        "4 small tasting portions",
        "4 небольшие дегустации",
      ),
      l("Alkoqolsuz içki", "A non-alcoholic drink", "Безалкогольный напиток"),
    ],
    excluded: [transport],
  },
  {
    id: "sheki-cable",
    country: "AZ",
    city: l("Şəki", "Sheki", "Шеки"),
    title: l(
      "Şəkidə mənzərəli kanat gəzintisi",
      "A scenic cable-car concept in Sheki",
      "Концепция прогулки по канатной дороге в Шеки",
    ),
    description: l(
      "Şəkinin yaşıllığını yuxarıdan kəşf etməyi xəyal et. Bu fəaliyyət dizayn üçün hazırlanmış konseptdir: real kanat xətti, operator və ya bilet mövcudluğunu təsdiqləmir.",
      "Imagine discovering Sheki’s greenery from above. This is a design concept, not confirmation of a real cable-car route, operator or ticket availability.",
      "Представьте вид на зелёные окрестности Шеки сверху. Это концепция дизайна, а не подтверждение реального маршрута, оператора или билетов.",
    ),
    category: "outdoor",
    price: 23,
    duration: 90,
    maxGuests: 6,
    minAge: 12,
    host: "Rəşad Məmmədov",
    hero: "/images/city-3.jpg",
    languages: l("Azərbaycan dili", "Azerbaijani", "Азербайджанский"),
    concept: true,
    steps: natureSteps,
    included: [
      guide,
      l(
        "Nümunə mənzərə və foto dayanacağı",
        "Sample viewpoint and photo stop",
        "Пример остановки для фото",
      ),
    ],
    excluded: [
      transport,
      l(
        "Real kanat bileti verilmir",
        "No real cable-car ticket is issued",
        "Реальный билет не выдаётся",
      ),
    ],
  },
  {
    id: "baku-old-town",
    country: "AZ",
    city: l("Bakı", "Baku", "Баку"),
    title: l(
      "İçərişəhərin kiçik hekayələri",
      "Little stories of Baku’s Old City",
      "Маленькие истории Старого города Баку",
    ),
    description: l(
      "Dar küçələr, daş divarlar və şəhərə başqa gözlə baxmaq. Nümunə gəzintidə bələdçi hekayələrini dinlə və foto xatirələr topla.",
      "Narrow streets, stone walls and a fresh way to see the city. Listen to a guide’s stories and collect photo memories on this sample walk.",
      "Узкие улицы, каменные стены и новый взгляд на город. Истории гида и фотографии на память в примере прогулки.",
    ),
    category: "culture",
    price: 35,
    duration: 120,
    maxGuests: 8,
    minAge: 8,
    host: "Nigar Əliyeva",
    hero: "/images/city-1.jpg",
    languages: l(
      "Azərbaycan və ingilis dilləri",
      "Azerbaijani & English",
      "Азербайджанский и английский",
    ),
    steps: [...natureSteps.slice(0, 2), { ...natureSteps[2], minutes: 70 }],
    included: [guide],
    excluded: [
      transport,
      l(
        "Muzey giriş biletləri",
        "Museum entrance tickets",
        "Входные билеты в музеи",
      ),
    ],
  },
  {
    id: "cappadocia-sunrise",
    country: "TR",
    city: l("Kapadokya", "Cappadocia", "Каппадокия"),
    title: l(
      "Kapadokyada günəşə ilk baxış",
      "The first light of Cappadocia",
      "Первый свет Каппадокии",
    ),
    description: l(
      "Səhər işığı və qeyri-adi təpələr arasında foto gəzintisi. Nümunə proqram hava şarı uçuşu və ya uçuş bileti daxil etmir.",
      "A photo walk among unusual hills in the morning light. This sample program does not include a balloon flight or ticket.",
      "Фотопрогулка среди необычных холмов в утреннем свете. Пример программы не включает полёт или билет на воздушный шар.",
    ),
    category: "outdoor",
    price: 65,
    duration: 90,
    maxGuests: 6,
    minAge: 12,
    host: "Deniz Kaya",
    hero: "/images/city-2.jpg",
    languages: l(
      "Türk və ingilis dilləri",
      "Turkish & English",
      "Турецкий и английский",
    ),
    steps: natureSteps,
    included: [
      guide,
      l("Foto dayanacaqları", "Photo stops", "Остановки для фото"),
    ],
    excluded: [
      transport,
      l("Hava şarı uçuşu", "Balloon flight", "Полёт на воздушном шаре"),
    ],
  },
  {
    id: "tuscany-clay",
    country: "IT",
    city: l("Toskana", "Tuscany", "Тоскана"),
    title: l(
      "Əllərinlə bir xatirə yarat",
      "Make a memory with your hands",
      "Создайте воспоминание своими руками",
    ),
    description: l(
      "Gil, sadə formalar və tələsmədən yaradıcılıq. Nümunə emalatxana proqramında öz kiçik keramika ideyanı hazırla.",
      "Clay, simple shapes and a little slow creativity. Make your own small ceramic idea in this sample workshop program.",
      "Глина, простые формы и неспешное творчество. Создайте маленькую керамическую идею в примере мастер-класса.",
    ),
    category: "craft",
    price: 90,
    duration: 120,
    maxGuests: 6,
    minAge: 12,
    host: "Luca Moretti",
    hero: "/images/interior-2.jpg",
    languages: l(
      "İtalyan və ingilis dilləri",
      "Italian & English",
      "Итальянский и английский",
    ),
    steps: [...natureSteps.slice(0, 2), { ...natureSteps[2], minutes: 70 }],
    included: [
      guide,
      l(
        "Nümunə material dəsti",
        "Sample materials kit",
        "Пример набора материалов",
      ),
    ],
    excluded: [
      transport,
      l(
        "Hazır işin göndərilməsi",
        "Shipping the finished piece",
        "Отправка готовой работы",
      ),
    ],
  },
  {
    id: "kyoto-tea",
    country: "JP",
    city: l("Kyoto", "Kyoto", "Киото"),
    title: l(
      "Bir fincan çay qədər sakitlik",
      "A quiet moment over tea",
      "Тишина за чашкой чая",
    ),
    description: l(
      "Çayın hazırlanma ritmi, sadə jestlər və gündəlik həyatdan bir az uzaqlaşmaq. Kyoto ilhamlı nümunə mədəniyyət proqramı.",
      "The rhythm of making tea, simple gestures and a little distance from the everyday. A Kyoto-inspired sample cultural program.",
      "Ритм приготовления чая, простые жесты и пауза от повседневности. Пример культурной программы, вдохновлённой Киото.",
    ),
    category: "culture",
    price: 55,
    duration: 90,
    maxGuests: 6,
    minAge: 12,
    host: "Hana Mori",
    hero: "/images/stay-7.jpg",
    languages: l(
      "Yapon və ingilis dilləri",
      "Japanese & English",
      "Японский и английский",
    ),
    steps: natureSteps,
    included: [
      guide,
      l("Nümunə çay dadımı", "Sample tea tasting", "Пример дегустации чая"),
    ],
    excluded: [transport],
  },
  {
    id: "tahoe-trails",
    country: "US",
    city: l("Taho gölü", "Lake Tahoe", "Озеро Тахо"),
    title: l(
      "Meşənin ritmində bir gəzinti",
      "A walk at the pace of the forest",
      "Прогулка в ритме леса",
    ),
    description: l(
      "Telefonu bir az kənara qoy, ağacların səsini dinlə. Nümunə təbiət gəzintisində mənzərəli dayanacaqlar və sakit anlar səni gözləyir.",
      "Put the phone away for a moment and listen to the trees. Scenic stops and quiet moments in this sample nature walk.",
      "Отложите телефон и прислушайтесь к деревьям. Живописные остановки и тихие моменты в примере прогулки.",
    ),
    category: "outdoor",
    price: 75,
    duration: 90,
    maxGuests: 8,
    minAge: 12,
    host: "Jamie Brooks",
    hero: "/images/hero-lake.jpg",
    languages: l("İngilis dili", "English", "Английский"),
    steps: natureSteps,
    included: [guide],
    excluded: [
      transport,
      l(
        "Şəxsi yürüş ləvazimatları",
        "Personal hiking equipment",
        "Личное походное снаряжение",
      ),
    ],
  },
];
// Match each sample itinerary to the activity rather than reusing a nature walk.
const programs: Record<string, Experience["steps"]> = {
  "baku-old-town": [
    {
      minutes: 20,
      title: l(
        "Köhnə şəhərdə görüş",
        "Meet in the Old City",
        "Встреча в Старом городе",
      ),
      body: l(
        "Nümunə görüş nöqtəsində tanışlıq və gəzinti planı.",
        "Meet at an illustrative point and introduce the walk.",
        "Знакомство в примерном месте встречи и план прогулки.",
      ),
    },
    {
      minutes: 70,
      title: l(
        "Küçələrin hekayələri",
        "Stories along the streets",
        "Истории улиц",
      ),
      body: l(
        "Şəhərin memarlığını, kiçik keçidlərini və foto bucaqlarını kəşf et.",
        "Explore architecture, little passageways and photo angles.",
        "Откройте архитектуру, переулки и ракурсы для фото.",
      ),
    },
    {
      minutes: 30,
      title: l(
        "Suallar və xatirələr",
        "Questions & memories",
        "Вопросы и воспоминания",
      ),
      body: l(
        "Söhbət, son foto fasiləsi və nümunə marşrutun tamamlanması.",
        "Conversation, one last photo stop and the end of the sample route.",
        "Разговор, последняя остановка для фото и завершение примера маршрута.",
      ),
    },
  ],
  "tuscany-clay": [
    {
      minutes: 20,
      title: l("Gil ilə ilk tanışlıq", "Meet the clay", "Знакомство с глиной"),
      body: l(
        "Nümunə alətlər və sadə formalarla tanışlıq.",
        "Explore sample tools and simple shapes.",
        "Знакомство с примером инструментов и простыми формами.",
      ),
    },
    {
      minutes: 70,
      title: l(
        "Öz formanı yarat",
        "Make your own shape",
        "Создайте свою форму",
      ),
      body: l(
        "Bələdçi ilə kiçik bir keramika ideyasının hazırlanması.",
        "Develop a little ceramic idea with your guide.",
        "Разработка маленькой керамической идеи с гидом.",
      ),
    },
    {
      minutes: 30,
      title: l("Son detallar", "Finishing touches", "Последние детали"),
      body: l(
        "İşin üzərində son toxunuşlar və nümunə qulluq tövsiyələri.",
        "Finishing touches and sample care advice.",
        "Последние штрихи и пример рекомендаций по уходу.",
      ),
    },
  ],
  "kyoto-tea": [
    {
      minutes: 15,
      title: l("Sakitliyə giriş", "A quiet beginning", "Тихое начало"),
      body: l(
        "Çay mədəniyyəti haqqında nümunə söhbət.",
        "A sample introduction to tea culture.",
        "Пример знакомства с культурой чая.",
      ),
    },
    {
      minutes: 45,
      title: l(
        "Bir fincanın hazırlanması",
        "Preparing a cup",
        "Приготовление чая",
      ),
      body: l(
        "Nümunə hazırlıq addımları və sadə jestlər.",
        "Sample preparation steps and simple gestures.",
        "Пример этапов приготовления и простых жестов.",
      ),
    },
    {
      minutes: 30,
      title: l(
        "Dadım və söhbət",
        "Tasting & conversation",
        "Дегустация и разговор",
      ),
      body: l(
        "Birlikdə çay dadımı və suallar üçün fasilə.",
        "A shared tea tasting and time for questions.",
        "Совместная дегустация чая и время для вопросов.",
      ),
    },
  ],
};
for (const experience of experiences)
  if (programs[experience.id]) experience.steps = programs[experience.id];
export const experienceTimes = ["10:00", "14:00", "17:00"];
export function experienceTotal(
  experience: Pick<Experience, "price">,
  people: number,
) {
  return Math.round(experience.price * people * 100) / 100;
}
export function validateExperienceSelection(
  experience: Experience,
  {
    date,
    time,
    people,
    today = todayISO(),
    nowMinutes = new Date().getHours() * 60 + new Date().getMinutes(),
  }: {
    date: string;
    time: string;
    people: number;
    today?: string;
    nowMinutes?: number;
  },
) {
  const timestamp = Date.parse(`${date}T00:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(timestamp) ||
    new Date(timestamp).toISOString().slice(0, 10) !== date ||
    date < today
  )
    return "dateError" as const;
  if (!experienceTimes.includes(time)) return "timeError" as const;
  if (
    date === today &&
    Number(time.slice(0, 2)) * 60 + Number(time.slice(3)) <= nowMinutes
  )
    return "sameDayError" as const;
  if (!Number.isInteger(people) || people < 1 || people > experience.maxGuests)
    return "peopleError" as const;
  return null;
}
