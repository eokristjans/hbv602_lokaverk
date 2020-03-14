# Lokaverkefni - Öryggisvæðing vefsíðu
### HBV602M - Öryggi Tölvukerfa
#### Háskóli Íslands
##### Vor 2020

<hr>

#### Hópur: Pointy Hats

| Nafn                      | Netfang       | 
| --                        | :--:          | 
| Andrea Ósk Sigurðardóttir | aos26         | 
| Erling Óskar Kristjánsson | eok4          | 
| Loftur Einarsson          | loe3          | 

<hr>

Við byrjum með vefsíðu sem nemandi smíðaði í námskeiðinu Vefforritun 2. Vefsíðan er forrituð í JavaScript með Express pakkanum og server-side rendering. Upprunalega útgáfa vefsíðunnar er í möppunni Atvinnuumsoknir0. Til að keyra hana locally þarf að hafa sett upp NodeJS og þá er hægt að keyra `npm install` á skipanalínu, keyra `npm run setup` til að setja upp gagnagrunn og svo `npm start` til að keyra síðunna á [127.0.0.1:3000](http://127.0.0.1:3000). Vefsíðan verður hýst á Heroku til að byrja með, en gæti verið færð á annan hýsingaraðila (t.d. til að setja upp örugg samskipti við netþjón með HTTPS).

Vefsíðan er umsóknarvefur fyrir starf hjá ónefndu fyrirtæki. Hver sem er getur sótt um starf með því að fylla út í form á umsóknarsíðu og senda inn umsóknina.

Á vefsíðunni geta notendur skráð sig (register) og skráð sig inn (login). Þessir notendur eiga að vera starfsmenn fyrirtækisins sem vinna umsóknir, en í raun getur hver sem er skráð sig. Notendur geta ýmist verið stjórnendur (admin) eða ekki. Stjórnendur geta eytt umsóknum og stjórnað því hverjir aðrir eru stjórnendur.

Upprunalega útgáfa vefsíðunnar inniheldur einhverjar varnir eins og hreinsun inntaks, en hún hefur ekki verið öryggisprófið. Verkefnið felst í því að finna sem flesta mögulega veikleika fyrir vefsíður (með rannsóknar vinnu og rýni í efni námskeiðsins), öryggisprófa vefsíðuna fyrir þessum veikleikum, kynna okkur beita exploitation hugbúnaði á vefsíðun, og laga þá öryggisgalla sem finnst. Þetta verður gert í ítrunum og reynt verður að laga sem flesta öryggisgalla, verjast fyrir sem flestum árásum, og almennt gera vefsíðuna sem öruggasta án þess að hún hætti að vera notendavæn.

<hr>

```bash
# Set up Heroku (globally)
npm install -g heroku

# Login
heroku login 

# Connect to remote
heroku git:remote -a vef2-v3-eok4

# Push just a subtree (the original webapp) to heroku
git subtree push --prefix Atvinnuumsoknir0 heroku master

# TODO: decide how and if to push .env file to heroku
```