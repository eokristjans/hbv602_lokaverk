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

## Verkefnislýsing

Við byrjum með vefsíðu sem nemandi smíðaði í námskeiðinu Vefforritun 2. Vefsíðan er forrituð í JavaScript með Express pakkanum og server-side rendering. Upprunalega útgáfa vefsíðunnar er í möppunni *Atvinnuumsoknir0*. Til að keyra hana locally þarf að hafa sett upp NodeJS og þá er hægt að keyra `npm install` á skipanalínu, keyra `npm run setup` til að setja upp gagnagrunn og svo `npm start` til að keyra síðunna á [127.0.0.1:3000](http://127.0.0.1:3000). Vefsíðan er hýst á Heroku - upprunalega útgáfan er [hér](https://vef2-v3-eok4.herokuapp.com/).

Vefsíðan er umsóknarvefur fyrir starf hjá ónefndu fyrirtæki. Hver sem er getur sótt um starf með því að fylla út í form á umsóknarsíðu og senda inn umsóknina.

Á vefsíðunni geta notendur skráð sig (register) og skráð sig inn (login). Þessir notendur eiga að vera starfsmenn fyrirtækisins sem vinna umsóknir, en í raun getur hver sem er skráð sig í upprunalegu útgáfunni. Notendur geta ýmist verið stjórnendur (admin) eða ekki. Stjórnendur geta eytt umsóknum og stjórnað því hverjir aðrir eru stjórnendur.

Upprunalega útgáfa vefsíðunnar inniheldur einhverjar varnir eins og hreinsun inntaks, en hún hefur ekki verið öryggisprófið. Verkefnið felst í því að finna sem flesta mögulega veikleika fyrir vefsíður (með rannsóknar vinnu og rýni í efni námskeiðsins), öryggisprófa vefsíðuna fyrir þessum veikleikum, kynna okkur  *exploitation* hugbúnað, beita honum á vefsíðuna og laga þá öryggisgalla sem finnst. Þetta verður gert í ítrunum og reynt verður að laga sem flesta öryggisgalla, verjast fyrir sem flestum árásum og almennt gera vefsíðuna sem öruggasta án þess að hún hætti að vera notendavæn. Haldið verður utan um þá veikleika sem finnast og hvernig þeir eru lagaðir.

<hr>


## Heroku stillingar og glósur

```bash
# Set up Heroku (globally)
npm install -g heroku

# Login
heroku login 

# Connect to remote
heroku git:remote -a vef2-v3-eok4

# Push just a subtree (the original webapp) to heroku
git subtree push --prefix Atvinnuumsoknir0 heroku master

# See https://medium.com/@shalandy/deploy-git-subdirectory-to-heroku-ea05e95fce1f for more details


# Setja upp gagnagrunn á heroku
heroku addons:create heroku-postgresql:hobby-dev -a vef2-v3-eok4

# TODO: Halda utan um logging til lengri tíma með heroku resource: Papertrail

# Keyra setup á heroku
heroku run node setup/setup.js
```

Við munum svo endurtaka þetta fyrir Atvinnuumsoknir1, sem verður uppfært og betrumbætt útgáfa af Atvinnuumsoknir0.
Það verður semsagt geymt á öðru Heroku remote.
