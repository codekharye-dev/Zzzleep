# Zzzlep

**Yaxşı yuxu, yaxşı səfər.** Azərbaycanda yaşayış məkanlarını kəşf etmək üçün responsiv veb platforma. React 19, TypeScript, Vite və Lucide ilə hazırlanıb.

## Başlamaq

Node.js 24+ və npm tələb olunur. Hazır bulud mühitində asılılıqlar artıq quraşdırılıb.

```sh
cd /workspace/Zzzleep
npm ci
npm run dev -- --port 5173
```

Sayt Azərbaycan dilində açılır. Dil və açıq/qaranlıq rejim seçimi brauzerdə yadda qalır. Şəkillər və Inter şrifti lokal saxlanılır; saytın işləməsi üçün xarici foto və şrift xidmətləri tələb olunmur.

## Hazır funksiyalar

- 5 ölkə üzrə 40 əvvəlki farazi məkan və əlavə 12 interaktiv 3D demo elan: Azərbaycanda 24, Türkiyə, ABŞ, İtaliya və Yaponiyada hərəsində 4; AZ/EN/RU interfeys və məkan təsvirləri.
- Şəhər, qonaq tutumu, yaşayış növü, gecəlik qiymət və imkanlar birlikdə filtrlənir.
- Qiymət və reytinqə görə sıralama, daha çox nəticə, boş nəticə vəziyyətləri.
- Şəkil qalereyası, klaviatura ilə keçid, ev sahibi, imkanlar və nümunə rəy.
- Brauzerdə saxlanan seçilmişlər və maksimum 3 evin yan-yana müqayisəsi.
- Tarix, tutum və keçmiş gün validasiyası olan sınaq rezervasiyası; gecəlik qiymət + 5% xidmət haqqı, təsdiq nömrəsi və lokal rezervasiya tarixçəsi.
- Eyni qiymət düsturu ilə dostlar arasında xərc bölgüsü.
- Özəl ay/ulduz loqosu, açıq/qaranlıq rejim, keçid animasiyaları və `prefers-reduced-motion` dəstəyi.
- Telefon, planşet və kompüter görünüşləri; modallarda fokus idarəsi və Escape ilə bağlama.

## Yoxlamalar

```sh
npm test          # Qiymət, tarix, tutum, kataloq və tərcümə yoxlamaları
npm run build    # TypeScript + production build
npm run test:e2e # 15 Chromium brauzer sınağı
npm run preview  # Hazır build-i lokal yoxlamaq
```

Brauzer sınaqları bu bulud mühitində `/usr/bin/chromium` istifadə edir. Başqa mühitdə `playwright.config.ts` daxilində `executablePath` parametrini uyğunlaşdırın. Test serveri 4173 portunda avtomatik başlayır və sınaqlar bitəndə dayanır.

## Struktur

- `src/App.tsx` — naviqasiya, axtarış, filtr, kartlar və səhifə quruluşu.
- `src/data.ts` — 24 Azərbaycan məkanı və lokal şəkil mənbələri.
- `src/countries.ts` — ölkə məlumatları və 16 beynəlxalq nümunə məkan.
- `src/WorldDiscovery.tsx`, `src/components/ui/testimonial-globe.tsx` — istifadəçinin təqdim etdiyi komponentdən uyğunlaşdırılmış, Cobe ilə interaktiv qlobus.
- `src/Logo.tsx`, `src/header.css` — ev, ay və Z motivli brend və naviqasiya.
- `src/i18n.ts`, `src/content.ts` — üç dildə interfeys mətnləri.
- `src/ListingDetail.tsx`, `src/booking.ts` — detallı görünüş və sınaq rezervasiyası.
- `src/Extras.tsx` — müqayisə və büdcə kalkulyatoru.
- `public/favicon.svg`, `public/zzzlep-logo.svg` — brend faylları.
- `public/images/SOURCES.md` — illüstrativ şəkillərin mənbələri.

## Sınaq versiyası

Bu nümayiş layihəsidir. Bütün məkanlar, qiymətlər, ev sahibləri və rəylər farazidir; şəkillər illüstrativdir. Real ödəniş, rezervasiya və ictimai hesab qeydiyyatı yoxdur. Admin paneli üçün ayrıca Node.js/MongoDB serveri əlavə edilib. Abunə forması e-poçtu serverə göndərmir. Seçilmişlər, dil, mövzu, müqayisə və sınaq rezervasiyaları yalnız həmin brauzerin `localStorage` yaddaşında qalır. Real platforma üçün backend, autentifikasiya, mövcudluq təqvimi və ödəniş inteqrasiyası ayrıca hazırlanmalıdır.

## GitHub Pages

`main` budağına push edildikdə `.github/workflows/deploy.yml` saytın yoxlamalarını və build-ini işlədir, sonra GitHub Pages-ə yerləşdirir. Build repo alt yoluna uyğun hazırlanır (`/Zzzleep/`). Workflow Pages-i avtomatik aktivləşdirməyə çalışır. Repozitoriya qaydaları buna icazə verməsə, GitHub-da **Settings → Pages → Source → GitHub Actions** seçin və workflow-u yenidən başladın. Sayt yalnız Actions daxilində deploy addımı uğurla tamamlandıqdan sonra açıq olur. Private repozitoriya üçün GitHub planınız Pages-i dəstəkləməlidir.

## Dünya bölməsi

Qlobus sürüşdürməklə fırlanır; hər ölkənin bayrağı və ya ölkə düyməsi `#/country/TR` kimi ayrıca nəticə görünüşünü açır. Oxlar aktiv ölkə kartını dəyişir; kartdakı keçid həmin ölkənin evlərini göstərir. Ölkə seçimi səhifə yenilənəndə URL vasitəsilə qalır. Xarici məkanlar da filtr, seçilmişlər, müqayisə, rezervasiya və büdcə axınlarında işləyir. Əvvəlki məkanlar AZN, idxal edilmiş 3D elanlar USD ilə göstərilir.

Komponent `src/components/ui` daxilində saxlanır. Özündə React və Cobe xaricində shadcn komponentləri import etmir; əlavə CLI ilə layihəni yenidən yaratmaq tələb olunmur. Tailwind Vite plaqini və `src/globe-theme.css` mövcud dizaynın rənglərinə bağlanır. Qlobus ayrıca JS hissəsi kimi yüklənir və WebGL olmadıqda sadə qlobus təsviri ilə işlək ölkə düymələri qalır. Azaldılmış animasiya seçimində avtomatik fırlanma dayanır; ekran xaricində rəsm dövrəsi pauza edilir. Bayraqlar lokal SVG fayllarıdır.

## Rəylər və zlpy ai

Əvvəlki 40 demo məkanın hərəsi üçün 6 müxtəlif farazi qonağın rəyi var. Yeni 3D və admin elanlarına avtomatik rəy yaradılmır. Qiymətlər görünən rəylərin riyazi ortasından alınır; elan kartı, detallar, müqayisə və büdcə eyni reytinqi göstərir. Kataloqda əla, yaxşı və orta qiymətləndirilən məkanlar mövcuddur. “Qonaqların sevimlisi” nişanı yalnız 4.7 və daha yüksək reytinqdə göstərilir. Rəylər müsbət/irad filtrləri və tarix/xal sıralaması ilə oxunur.

**zlpy ai** bu versiyada yerli, deterministik rəy bələdçisidir. Xarici LLM və ya AI API-si qoşulmayıb və şəbəkəyə sual/rəy göndərilmir. `reviews.ts` daxilindəki rəylərin mövzu və sentiment etiketləri sayılır; `reviewSummary.ts` yalnız bu sübutlara əsaslanan xülasə və mənbə keçidləri qaytarır. Köməkçi əvvəlcədən hazırlanmış sualları və mövzu açar sözlərini tanıyır; dəstəklənməyən suallara sərhədlərini bildirir. Balın mövzular üzrə dəqiq nə qədər azaldığını iddia etmir. Tam generativ AI ayrıca server və təhlükəsiz API inteqrasiyası tələb edir. Bu məhdudiyyətlər interfeysdə “Xülasə necə hazırlanır?” bölməsində açıqlanır.

Kartlarda görünüşə daxilolma, hover və seçilmişə əlavəetmə animasiyaları var; `prefers-reduced-motion` seçiminə hörmət edilir. Loqo sadə Z monoqramı ilə yenilənib.

GitHub Pages hələ `Deploy from a branch` rejimindədirsə, yayımlama axını eyni commit üçün yerli Pages prosesinin bitməsini gözləyir və Vite build-ini sonda yerləşdirir. Beləliklə mənbə HTML/TSX faylları hazır tətbiqin üzərinə yazılmır. `GitHub Actions` mənbə rejimində bu gözləmə avtomatik ötürülür.

## Təcrübələr / Experiences

`#/experiences` ayrıca fəaliyyət kataloqudur: 6 ölkə üzrə 8 nümunə təcrübə, ölkə/kateqoriya/axtarış/qiymət filtrləri, USD ilə nəfər başına qiymət və ətraflı proqramlar. `#/experience/beijing-wok` ($200) və `#/experience/new-york-flavors` ($125) səhifələrində istifadəçinin təqdim etdiyi yemək lenti komponenti Çin wok dadımlarına və Amerika menyusuna uyğunlaşdırılıb. Yemək seçimi sınaq dadım planına əlavə olunur; ayrıca yemək sifarişi və ya əlavə ödəniş yaratmır. Sheki kanat fəaliyyəti ($23) real operatoru təsdiqləməyən konsept kimi işarələnib.

Tarix, saat və qrup tutumu yoxlanan planlar `zzzlep-experience-plans` lokal yaddaşında saxlanır. Real bilet, rezervasiya, yer təsdiqi və ödəniş yoxdur. Əvvəlki qalma məkanları AZN, 3D demo məkanlar və təcrübələr isə USD ilə göstərilir. Komponent `src/components/ui/sushi-conveyor-menu.tsx` daxilindədir; əlavə NPM asılılığı tələb etmədi. Təcrübə səhifələri və yemək lenti ayrıca hissələr kimi yüklənir.

## 3D ev baxışı

`src/stay3d/` istifadəçinin təqdim etdiyi `zzzlep-3d-only.zip` moduludur. Three.js və OrbitControls lokal fayllardır; ayrıca CDN və ya model endirməsi yoxdur. Əvvəlki elanların planları dəyişdirilməyib. ZIP-dəki 12 ev `model-baku`, `model-gabala` və s. ID-lərlə ayrıca əlavə edilib. Şəkillər mövcud yerli illüstrasiyalardır; model, şəkil və məkanın demo olduğu açıq göstərilir.

Məsələn: `#/listing/model-gabala`. 3D mühərrik yalnız “3D baxışı aç” düyməsindən sonra yüklənir. Mərtəbə, otaq, iki kamera bucağı, avtomatik fırlatma və bütöv evə qayıtma var. Bağlandıqda WebGL resursları azad edilir. WebGL açıla bilməsə, qalereya və rezervasiya işlək qalır. Otaq ölçüləri metr/m²-dir.

## MongoDB və admin paneli

`#/admin` — admin girişi, profil adının yenilənməsi, yeni elan, redaktə, silmə təsdiqi, qaralama/yayımlama. Hazırda ictimai qeydiyyat və istifadəçi paneli yoxdur. API yalnız admin roluna elan yazmaq hüququ verir. MongoDB `users`, `sessions` və `listings` kolleksiyalarını saxlayır. Mövcud 52 demo elan koddan oxunur; DB-yə avtomatik köçürülmür və admin paneli yalnız bazada yaradılmış elanları idarə edir.

Server Node.js 24+ tələb edir. GitHub Pages Node serverini işlətmir; oradakı statik sayt və 3D funksiyası davam edir, admin/baza üçün Node host lazımdır. Node hostunda build və API eyni origin-dən təqdim edilir.

1. `.env.example` faylını `.env` kimi köçürün. `MONGODB_URI` daxilində real DB istifadəçisi/şifrəsi və `MONGODB_DB` yazın. Xüsusi simvolları URL-encode edin. `.env` Git-dən çıxarılıb, heç bir `VITE_` dəyişəninə baza parolu yazmayın.
2. Atlas Network Access-də serverin çıxış IP-sinə giriş verin. DB istifadəçisinə yalnız seçilmiş bazada lazım olan hüquqları verin.
3. `ADMIN_EMAIL`, `ADMIN_NAME`, ən azı 12 simvolluq `ADMIN_PASSWORD` təyin edin. `npm run admin:create` ilə bir dəfə admin və indeksləri yaradın. Mövcud admin hesabı/şifrəsi yenidən yazılmır; ictimai bootstrap endpoint-i yoxdur.
4. Lokal inkişaf: bir terminalda `npm run api`, digərində `npm run dev -- --port 5173`. `APP_ORIGIN=http://localhost:5173` ilə brauzeri həmin ünvanda açın.
5. Production: `APP_ORIGIN=https://sizin-domeniniz` təyin edin, `npm run build`, sonra `npm start`. HTTPS proxy istifadə edin; production sessiya cookie-si `Secure`, `HttpOnly`, `SameSite=Strict` olur.

`PORT` standart 3001-dir. Şifrələr scrypt ilə hash olunur, sessiya tokenlərinin yalnız hash-ləri bazaya yazılır, sessiyalar 8 saatdan sonra bitir. Giriş cəhdləri bir API prosesində limitlənir; birdən çox instansiya üçün ortaq rate limit tələb olunur. Sorğuların origin-i serverdə yoxlanılır. Elan girişləri serverdə allowlist ilə yoxlanılır; yalnız yayımlanmış elanlar ictimai API-dən qaytarılır. Şəkil URL-ləri qəbul olunur; fayl yükləmə servisi hələ yoxdur.

`npm run test:api` autentifikasiya/CRUD/validasiya testlərini izolyasiya edilmiş yaddaş adapterində işlədir; bu test canlı Atlas bağlantısını təsdiqləmir. `GET /api/health` real DB ping edir. Bu iş mühitində canlı Atlas sınağı `ECONNREFUSED` ilə nəticələnib; admin hesabının canlı bazada yaradılması və davamlı saxlanma hələ təsdiqlənməyib.

Qiymət filtri və “ən ucuz” müqayisəsi AZN əsasında işləyir; USD demo qiymətləri müqayisə üçün sabit 1.7 əmsalı ilə hesablanır. Bu canlı valyuta xidməti deyil. Elan və büdcə məbləğləri öz valyutası ilə göstərilir.

### Vercel-də canlı admin

`api/index.mjs` Express API-ni Vercel Function kimi işlədər; `vercel.json` `/api/*` sorğularını həmin funksiyaya yönləndirir. Sayt və API eyni Vercel domenində olmalıdır. Server env dəyişənləri: `MONGODB_URI`, `MONGODB_DB`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (12+ simvol), `ADMIN_NAME` və dəqiq production ünvanı olan `APP_ORIGIN`. Baza və admin şifrələri fərqli olmalıdır.

Funksiya ilk API sorğusunda server env-dən admin hesabını və indeksləri təhlükəsiz, təkrarlana bilən şəkildə yaradır; ictimai qeydiyyat və ya bootstrap endpoint-i yoxdur. Mövcud hesabın şifrəsi/rolu dəyişdirilmir. Env dəyişikliklərindən sonra redeploy tələb olunur. Atlas həmin hostinqdən bağlantıya icazə verməlidir. `GET /api/health` uğurlu cavab verdikdən sonra `#/admin` girişini və bir qaralama elanın yaradılıb yenidən açılmasını yoxlayın.
