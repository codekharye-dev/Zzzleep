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

- 5 ölkə üzrə 40 farazi məkan: Azərbaycanda 24, Türkiyə, ABŞ, İtaliya və Yaponiyada hərəsində 4; AZ/EN/RU interfeys və məkan təsvirləri.
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

Bu frontend nümayiş layihəsidir. Bütün məkanlar, qiymətlər, ev sahibləri və rəylər farazidir; şəkillər illüstrativdir. Real ödəniş, rezervasiya, hesab qeydiyyatı, ev sahibi paneli və server inteqrasiyası yoxdur. Abunə forması e-poçtu serverə göndərmir. Seçilmişlər, dil, mövzu, müqayisə və sınaq rezervasiyaları yalnız həmin brauzerin `localStorage` yaddaşında qalır. Real platforma üçün backend, autentifikasiya, mövcudluq təqvimi və ödəniş inteqrasiyası ayrıca hazırlanmalıdır.

## GitHub Pages

`main` budağına push edildikdə `.github/workflows/deploy.yml` saytın yoxlamalarını və build-ini işlədir, sonra GitHub Pages-ə yerləşdirir. Build repo alt yoluna uyğun hazırlanır (`/Zzzleep/`). Workflow Pages-i avtomatik aktivləşdirməyə çalışır. Repozitoriya qaydaları buna icazə verməsə, GitHub-da **Settings → Pages → Source → GitHub Actions** seçin və workflow-u yenidən başladın. Sayt yalnız Actions daxilində deploy addımı uğurla tamamlandıqdan sonra açıq olur. Private repozitoriya üçün GitHub planınız Pages-i dəstəkləməlidir.

## Dünya bölməsi

Qlobus sürüşdürməklə fırlanır; hər ölkənin bayrağı və ya ölkə düyməsi `#/country/TR` kimi ayrıca nəticə görünüşünü açır. Oxlar aktiv ölkə kartını dəyişir; kartdakı keçid həmin ölkənin evlərini göstərir. Ölkə seçimi səhifə yenilənəndə URL vasitəsilə qalır. Xarici məkanlar da filtr, seçilmişlər, müqayisə, rezervasiya və büdcə axınlarında işləyir. Bütün qiymətlər AZN ilədir.

Komponent `src/components/ui` daxilində saxlanır. Özündə React və Cobe xaricində shadcn komponentləri import etmir; əlavə CLI ilə layihəni yenidən yaratmaq tələb olunmur. Tailwind Vite plaqini və `src/globe-theme.css` mövcud dizaynın rənglərinə bağlanır. Qlobus ayrıca JS hissəsi kimi yüklənir və WebGL olmadıqda sadə qlobus təsviri ilə işlək ölkə düymələri qalır. Azaldılmış animasiya seçimində avtomatik fırlanma dayanır; ekran xaricində rəsm dövrəsi pauza edilir. Bayraqlar lokal SVG fayllarıdır.

## Rəylər və zlpy ai

Hər məkan üçün 6 müxtəlif farazi qonağın rəyi var. Qiymətlər görünən rəylərin riyazi ortasından alınır; elan kartı, detallar, müqayisə və büdcə eyni reytinqi göstərir. Kataloqda əla, yaxşı və orta qiymətləndirilən məkanlar mövcuddur. “Qonaqların sevimlisi” nişanı yalnız 4.7 və daha yüksək reytinqdə göstərilir. Rəylər müsbət/irad filtrləri və tarix/xal sıralaması ilə oxunur.

**zlpy ai** bu versiyada yerli, deterministik rəy bələdçisidir. Xarici LLM və ya AI API-si qoşulmayıb və şəbəkəyə sual/rəy göndərilmir. `reviews.ts` daxilindəki rəylərin mövzu və sentiment etiketləri sayılır; `reviewSummary.ts` yalnız bu sübutlara əsaslanan xülasə və mənbə keçidləri qaytarır. Köməkçi əvvəlcədən hazırlanmış sualları və mövzu açar sözlərini tanıyır; dəstəklənməyən suallara sərhədlərini bildirir. Balın mövzular üzrə dəqiq nə qədər azaldığını iddia etmir. Tam generativ AI ayrıca server və təhlükəsiz API inteqrasiyası tələb edir. Bu məhdudiyyətlər interfeysdə “Xülasə necə hazırlanır?” bölməsində açıqlanır.

Kartlarda görünüşə daxilolma, hover və seçilmişə əlavəetmə animasiyaları var; `prefers-reduced-motion` seçiminə hörmət edilir. Loqo sadə Z monoqramı ilə yenilənib.
