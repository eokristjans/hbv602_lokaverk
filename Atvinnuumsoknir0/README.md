# Lýsing á verkefnum 2 & 3 í Vefforritun 2

Verkefni 2 snýst um að setja upp vef sem bíður upp á senda inn atvinnuumsóknir ásamt síðu sem listar upp allar umsóknir.

Verkefni 3 byggir á verkefni 2 og bætir við notendaumsjón með nýskráningu og meðhöndlun á notendum.

## Útlit

Útlit er gefið í möppu `utlit/`, bæði fyrir `1200px` breiðan skjá og `400px` breiðan. Sjá má allar stöður sem komið geta upp. Útfæra skal útlit sem er mjög líkt en ekki þarf að gera það nákvæmlega eins. Um útlit í sýnilausn gildir:

* `Open sans regular` notað fyrir meginmál
* `Source Sans Pro bold` fyrir fyrirsagnir
* Grunnleturstærð er `16px` fyrir texta og form
* Aðalfyrirsögn er `48px` (nota `em` eða `rem`), önnur fyrirsögn `24px`, label fyrir form eru `22px`
* Bil frá viewport að efni er `32px`
* Texti í formi skal vera `16px` með `8px` padding
* Önnur bil eru `48px`, `32px` og `16px`
* Litir eru
  * Border á input `#888`
  * Border ef input ef ógilt `#855`, bakgrunnur `#fbb`
  * Bakgrunnur á takka þegar sveimað yfir `#bbb`, skipt með `easin-in` á `300ms`

## Notendaumsjón

Útfæra skal notendaumsjón með [`passport.js`](http://www.passportjs.org/), [`passport-local`](https://github.com/jaredhanson/passport-local) og [`express-session`](https://github.com/expressjs/session).

Fyrir `express-session` skal skrá `sessionSecret` og skal það vera sótt úr `.env`, sjá gefin kóða í `app.js`.

Setja skal upp innskráningu á `/login` sem flettir upp notanda í gagngagrunni og skráir inn ef til og rétt lykilorð er gefið.

Setja skal upp notendaskráningu á `/register` sem leyfir notanda að skrá sig. Fyrir notanda skal skrá og uppfylla:

* Nafn
  * Má ekki vera tómt
* Netfang
  * Má ekki vera tómt, verður að vera netfang
  * Normalísera sem netfang
* Notendanafn
  * Má ekki vera tómt
  * Má ekki vera til nú þegar (fletta verður upp í notendagrunni)
* Lykilorð
  * Verður að vera a.m.k. 8 stafir
  * Verður að vera staðfest (þ.e.a.s. tveir lykilorða reitir)

Eftir skráningu skal senda á þakkarsíðu sem bíður notanda upp á að skrá sig inn.

Nota skal [`bcrypt`](https://github.com/kelektiv/node.bcrypt.js) fyrir geymslu lykilorða. Ekki skal geyma lykilorðin sjálf sem texta neinstaðar.

Eftir innskráningu mega notendur skoða umsóknir, ef reynt er að skoða umsóknir án þess að vera innskráður notandi er notandi sendur á `/login`.

Á umsóknarsíðu mega þeir notendur sem eru `admin` (boolean gildi geymt á notanda) eyða umsókn. Allir notendur mega „vinna umsókn“.

Ný síða sýnir alla notendur á `/admin`. Notendanöfn, nöfn og netföng eru sýnd. Ef notandi er `admin` má viðkomandi breyta `admin` stöðu allra notanda. Það er gert með því að haka í checkbox og senda form. Athugið að hægt er að fá fylki af gildum til baka úr formi með því að gefa þeim `name` sem endar á `[]`, t.d. `name="admin[]"`. Eftir að notendur eru uppfærðir er farið aftur á `/admin`. Þessa virkni skal útfæra í `admin.js`.

Í minni skjám skal notendaumsjónarsíða sýna töflu með láréttri skrunstiku, sjá skjáskot.


## Gagnagrunnur

Gefnar eru tvær skrár sem fylla skal inn í, `schema.sql` sem skilgreinir hvernig taflan `applications` er búin til og `insert.sql` sem fyllir inn gögn, sjá að neðan.

Setja skal _tengistreng_ (connection string) fyrir gagnagrunn í skrá sem heitir `.env` undir lyklinum `DATABASE_URL`. Þessi skrá skilgreinir breytur í keyrsluumhverfi (environment). Hún fylgir ekki verkefninu og er ekki geymd í Git vegna þess að tengiupplýsingar eru upplýsingar sem ekki á að dreifa því þær innihalda oft t.d. lykilorð. Afrita skal `.env_example` yfir í skrá `.env` og stilla tengistreng þar. Pakkinn `dotenv` er uppsettur og sér um að lesa þessar upplýsingar og koma þeim yfir í `process.env.DATABASE_URL`.

Gefin er virkni í `setup.js` sem keyrð er með `npm run setup`. Þessi virkni mun eyða töflunni `applications`, setja upp töfluna `applications` úr `schema.sql` og bæta við færslum úr `insert.sql`. Ef allt er rétt sett upp þá mun þetta keyra:

```bash
> npm run setup -s
Set upp gagnagrunn á postgres://:@localhost/gagnagrunnur # <- þinn tengistrengur
Töflu eytt
Tafla búin til
Gögnum bætt við
```

Athugið, fyrst þarf að setja upp `pg` pakkann úr NPM og keyra `npm install` fyrir þá pakka sem eru skilgreindir í `package.json`.

_CRUD_ virkni fyrir verkefni skal setja upp í `db.js`.

### Prufugögn

Í `insert.sql` skal setja inn eftirfarandi gögn með `INSERT` skipunum í gagnagrunn:

Nafn | Netfang | Sími | Texti | Starf | Unnin?
-----|---------|------|-------|-------|-------
Jón Jónsson | jon@example.org | 1231231 | Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut bibendum eleifend odio, eu laoreet sapien sollicitudin quis. | forritari | Nei
John Johnson | john@example.org | 1000000 | Etiam accumsan neque nec mauris fringilla, id dignissim tortor maximus. Proin sit amet sodales felis. Vivamus ut est magna. Quisque porta quam ac orci dignissim convallis. Nunc efficitur sagittis felis at gravida. | verkefnastjóri | Nei

*Fjarlægði 3 notendur til að minnka töflu því þessar upplýsingar skipta ekki höfuð máli.*

Leyfilegt er að setja upp virkni fyrir notendur í annari skrá en `db.js`.

Þar skal búa til eftirfarandi notendur:

Notendanafn | Lykilorð | Nafn | Netfang | Admin?
------------|----------|------|---------|-------
admin | `asdfasdf` | Admin | admin@example.org | Já
nn | `12341234` | Nafnlaus | nn@example.org | Nei

## Heroku

Verkefnið skal keyra á Heroku með allri þeirri virkni sem hér er lýst ásamt prufugögnum.

## Umsóknarsíða

Umsóknarsíða skal svara á `/` og birta form til að skrá umsókn. Öll gögn skal vista í gagnagrunni og passa upp á XSS, hreinsa af þeim auka bil (`trim`) og passa upp á að ekkert HTML fari með (`escape`) að auki sjá frekari hreinsun á reitum að neðan. Nota skal `xss` og `express-validator` pakka.

Umsókn samanstendur af og skulu gögn uppfylla:

* Nafn
  * Má ekki vera tómt
* Netfang
  * Má ekki vera tómt, verður að vera netfang
  * Normalísera sem netfang
* Sími
  * Verður að líta út eins og sjö stafa íslenskt símanúmer, leyfilegt skal að hafa ` ` eða `-` eftir fyrstu þrjá stafi
  * Símanúmer skal hreinsa þ.a. það sé sjö stafir og vista sem tölu (`int`)
* Kynning
  * Verður að vera a.m.k. 100 stafir
* Starf sem sótt er um
  * Verður að vera eitt af: `forritari`, `hönnuður`, `verkefnastjóri`

Aukalega skal hver umsókn hafa:

* `processed`, boolean breytu sem segir til um hvort umsókn hafi verið unnin, sjálfgefið `false`
* `created`, dagstími þegar umsókn var búin til, sjálfgefið tími þegar röð er búin til
* `updated`, dagstími þegar umsókn var seinast breytt, sjálfgefið tími þegar röð er búin til

Ef gögn sem send eru inn uppfylla ekki kröfur skal birta villuskilaboð og merkja reit (sjá fyrirmyndir undir `utlit/`). Birta skal öll gögn sem notandi hafði nú þegar slegið inn.

Ef gögn eru í lagi skal vista þau í gagnagrunni og senda á þakkarsíðu.

## Yfirlitssíða

Yfirlitssíða skal vera aðgengileg á `/applications`. Þar skal birta allar umsóknir sem eru í gagnagrunni. Til að viðhalda röð að einhverju leiti er æskilegt að velja reit til að raða eftir, t.d. `id` (betra en að nota dags þar sem prufugögn verða öll skráð á sama tíma) með `SELECT * FROM applications ORDER BY id`.

Auka upplýsinga skal birta tvo takka fyrir hverja umsókn:

* `Vinna umsókn` sem breytir `processed` yfir í `true` og uppfærir `updated` yfir í dagstíma þegar smellt var á takka
* `Eyða umsókn` sem eyðir umsókn úr gagnagrunni

## Annað

Notast skal við EJS template til að útbúa HTML.

Setja skal upp villumeðhöndlun fyrir almennar villur og ef beðið er um slóð sem ekki er til (404). Skilaboð skulu birt notanda um hvað gerðist („Síða fannst ekki“ – „Villa kom upp“)..

Öll dependency skulu skráð í `package.json`. `eslint` pakkar eru nú þegar uppsettir sem devDependency.

`npm start` skal keyra upp vefþjón á localhost porti 3000.

## Git og GitHub

Verkefni þetta er sett fyrir á GitHub og almennt ætti að skila því úr einka (private) repo nemanda. Nemendur geta fengið gjaldfrjálsan aðgang að einkarepos á meðan námi stendur, sjá https://education.github.com/.

Til að byrja er hægt að afrita þetta repo og bæta við á sínu eigin:

```bash
# Verkefni 2
> git clone https://github.com/vefforritun/vef2-2019-v2.git
> cd vef2-2019-v2
> git remote remove origin # fjarlægja remote sem verkefni er í
> git remote add origin <slóð á repo> # bæta við í þínu repo
> git push

# Verkefni 3
> git clone https://github.com/vefforritun/vef2-2019-v3.git
> cd vef2-2019-v3
> git remote remove origin # fjarlægja remote sem verkefni er í
> git remote add origin <slóð á repo> # bæta við í þínu repo
> git push
```

*Verkefnalýsingu frá kennara lýkur.*

---

## Glosur

#### npm install skipanir sem voru keyrðar eftir að [grunnur](https://github.com/vefforritun/vef2-2019-v2) var sóttur:

```bash
npm install
npm install --save pg express-validator ejs xss 
npm install --save bcrypt cookie-parser express-session passport passport-local
```

#### Varðandi uppsetningu gagnagrunns

_setup.js_ notar `connectionString = process.env.DATABASE_URL` sem er tómi strengurinn
þar til annað hefur verið skráð. Tómi strengurinn er Default value sem er Notendanafn.

Afritum texta úr _.env\_example_ í _.env_ og setjum upp eftir leiðbeiningum.

Fylgja eftirfarandi [postgres ítarefni](https://github.com/vefforritun/vef2-2019/blob/master/itarefni/postgres.md).

Keyrum `npm run setup` til að setja upp gagangrunn.

Hægt að tengjast gagnagrunn í skel með `psql -U notandi -d v2` (local gagnagrunnur má hafa annað nafn).

Erling lenti í smá veseni með að sýna íslenska stafi í PSQL, þurfti að keyra eftirfarandi í CMD:

```bash
SET PGCLIENTENCODING=utf-8
chcp 65001
```

Setjum upp gagnagrunnstöflur í _schema.sql_.

Búum til sýnigögn í _insert.sql_.

#### Fyrstu skref sem voru tekin við smíði verkefnisins (skref fyrir skref)

_Routers_ eru módúlar sem eru notaðir af aðal forritinu, _app.js_.

Búum til _index.ejs_ skrá undir _/views_. Bætum inn form.

Gott að geyma í _app.js_ stillingar á appi, villumeðhöndlanir, middleware o.fl.

Bætum `app.use(apply);` í _app.js_. Búum til skránna _apply.js_ og importum hana í _app.js_.

Template _index.ejs_ á ekki að sjá um neina lógík. Öll lógík fer fram í middleware, hér í _apply.js_.

Bætum `app.use(express.urlencoded({ extended: true }));` í _app.js_ til að geta unnið með body-ið.

Búum til _views/error.ejs_ til að geta birt error.

Klárum register POST í _register.js_.

Búum til validation og sanitazion fylki í _register.js_, því milliware getur verið hlaðið úr fylkjum eins og í fyrirlestri 3 Form, dæmi 09.

Búum til þakkarsíðu _views/thanks.ejs_ samhliða register post úrvinnslu.

Bætum við möguleika á að vista gögn í gagnagrunn eftir að þau hafa verið POST-uð.

Þurfum `pg`, `connectionString` og `client` í _register.js_. 

Útfærum það í _db.js_ og sækjum með `require`.

---

> Útgáfa 2.1

| Útgáfa | Lýsing                                    |
|--------|-------------------------------------------|
| 1.0    | Verkefni 2                                |
| 2.0    | Verkefni 3                                |
| 2.1    | Hreinsað til og bætt við athugasemdum     |