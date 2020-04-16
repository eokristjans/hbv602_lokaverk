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

## Github strúktur á möppum

[Atvinnuumsoknir_v0](/Atvinnuumsoknir0) inniheldur upprunalega verkefnið, áður en það var öryggisprófað.

[Atvinnuumsoknir_v4](/Atvinnuumsoknir4) inniheldur lokaútgáfu verkefnisins, eftir að það var öryggisprófað og bætt var úr öryggi þess.

Bætt var úr örygginu í skrefum, en búið er að eyða v1, v2 og v3 því það er ekkert áhugavert að skoða þetta skref fyrir skref. Skrefunum er lýst í skýrslu sem finna má á [heimasíðu Erlings Óskars](https://eokristjans.github.io).

Ath. að í báðum möppum þarf að setja upp `.env` skrár samkvæmt leibeiningum að neðan og í `env_example` sem er að finna í báðum möppum. Þessar `.env` skrár munu vera eilítið mismunandi eftir möppu.

Eina leiðin til að búa til fyrsta `admin` notandann er að setja hann inn í gegnum postgres því nýskráðir notendur í vefforritinu eru ekki stjórnendur. Stjórnendur geta hins vegar breytt öðrum notendum í stjórnendur. Eins og sést í [Atvinnuumsoknir_v4/env_example](/Atvinnuumsoknir4/env_example) þá þarf að setja PEPPER (pipar) gildi þar, en þetta þarf ekki í [Atvinnuumsoknir_v0](/Atvinnuumsoknir0). Það er einn notandi sem er `admin` sem er settur í töfluna með `npm run setup`. Í skjalinu [Atvinnuumsoknir_v4/setup/insert.sql](/Atvinnuumsoknir4/setup/insert.sql) sést tætta lykilorð hans þar sem búið er að skeyta PEPPER fyrir aftan lykilorðið. Þú veist hins vegar ekki hvað þetta pipar er. 

Ef þú vilt hafa stjórnanda á þínu staðbundna vinnuumhverfi í [Atvinnuumsoknir_v4](/Atvinnuumsoknir4), þá skaltu fylgja eftirfarandi skrefum:

1. Þú þarft þá að vera búinn að velja pipar (t.d. *afe3.239_#!*) og stilla það í `.env` skránni.
2. Þú þarft að fara á síðu á netinu eins og [Bcrypt Generator](https://bcrypt-generator.com/) og velja lykilorð fyrir notandann sem er nægilega sterkt (t.d. *hfioEF#32d*), og skeyta piparnum aftan við lykilorðið (skv. dæmum þá væri þetta strengurinn *hfioEF#32dafe3.239_#!*) og tæta strenginn með **12 Rounds**. 
3. Þú þarft að fara í skjalið [Atvinnuumsoknir_v4/setup/insert.sql](/Atvinnuumsoknir4/setup/insert.sql) og breyta admin notandanum eða bæta við nýjum, og setja þennan tætta streng sem lykilorð hans.

Í [Atvinnuumsoknir_v0](/Atvinnuumsoknir0) eru tveir notendur, og sá sem er stjórnandi er með notendanafnið *admin* og lykilorðið *asdfasdf*.

`Readme.md` skrárnar í möppunum innihalda einungis verkefnalýsingar fyrir upprunalega verkefnið sem byggt var í Vefforritun 2.

## Uppsetning og keyrsla á Linux

```bash

### Setting up development environment on Ubuntu VM

# Install postgres
sudo apt install postgresql postgresql-contrib

# Connect to postgres as the default user, i.e. with username 'postgres'
sudo -u postgres psql
# Now you are connected, command line should say 'postgres=#'
\du # shows all users
CREATE USER notandi WITH ENCRYPTED PASSWORD 'lykilord'; # Creates a user (you should change the details)
CREATE DATABASE v3; # Or whatever you want to call it (make sure to update your .env file appropriately)
GRANT ALL PRIVILEGES ON DATABASE v3 TO notandi;
\q # Quit psql CLI

# before next step you might need to change pg_hba.conf file with line
local   all   all       peer
# to
local   all   all       md5

# if you wish to perform database queries on the CLI, you can reconnect using:
psql -U notandi -d v3 # Should be prompted to insert your password, otherwise you're on your own (can be buggy)


# Install nodejs and npm
sudo apt install nodejs
sudo apt install npm
sudo apt upgrade npm


# Now you can navigate to the webapp project folder and install packages
npm install

# CREATE A .env FILE AND COPY THE CONTENTS OF env_example INTO IT. SET THE APPROPRIATE PARAMETERS.

# Run setup and run the project locally
npm run setup
npm start

# Instead of npm start, you can 
npm install nodemon --save
npm run dev

```


## Verkefnislýsing

Við byrjum með vefsíðu sem nemandi smíðaði í námskeiðinu Vefforritun 2. Vefsíðan er forrituð í JavaScript með Express pakkanum og server-side rendering. Upprunalega útgáfa vefsíðunnar er í möppunni *Atvinnuumsoknir0*. Til að keyra hana locally þarf að hafa sett upp NodeJS og þá er hægt að keyra `npm install` á skipanalínu, keyra `npm run setup` til að setja upp gagnagrunn og svo `npm start` til að keyra síðunna á [127.0.0.1:3000](http://127.0.0.1:3000). Vefsíðan er hýst á [Heroku](https://vef2-v3-eok4.herokuapp.com/).

Vefsíðan er umsóknarvefur fyrir starf hjá ónefndu fyrirtæki. Hver sem er getur sótt um starf með því að fylla út í form á umsóknarsíðu og senda inn umsóknina.

Á vefsíðunni geta notendur skráð sig (register) og skráð sig inn (login). Þessir notendur eiga að vera starfsmenn fyrirtækisins sem vinna umsóknir, en í raun getur hver sem er skráð sig í upprunalegu útgáfunni. Notendur geta ýmist verið stjórnendur (admin) eða ekki. Stjórnendur geta eytt umsóknum og stjórnað því hverjir aðrir eru stjórnendur.

Upprunalega útgáfa vefsíðunnar inniheldur einhverjar varnir eins og hreinsun inntaks, en hún hefur ekki verið öryggisprófið. Verkefnið felst í því að finna sem flesta mögulega veikleika fyrir vefsíður (með rannsóknar vinnu og rýni í efni námskeiðsins), öryggisprófa vefsíðuna fyrir þessum veikleikum, kynna okkur  *exploitation* hugbúnað, beita honum á vefsíðuna og laga þá öryggisgalla sem finnst. Þetta verður gert í ítrunum og reynt verður að laga sem flesta öryggisgalla, verjast fyrir sem flestum árásum og almennt gera vefsíðuna sem öruggasta án þess að hún hætti að vera notendavæn. Haldið verður utan um þá veikleika sem finnast og hvernig þeir eru lagaðir.

<hr>

_Allt hér fyrir neðan er einna helst ætlað forriturum upprunalega verkefnisins, en þó er engin leyndarmál að finna þar._

## Setting up Heroku and deploying project

```bash
# Set up Heroku (globally)
npm install -g heroku

# Login
heroku login 

# Connect to remote
heroku git:remote -a vef2-v3-eok4

# Push just a subtree (the original webapp) to heroku
git subtree push --prefix Atvinnuumsoknir_v4 heroku master

# See https://medium.com/@shalandy/deploy-git-subdirectory-to-heroku-ea05e95fce1f for more details


# Setja upp gagnagrunn á heroku
heroku addons:create heroku-postgresql:hobby-dev -a vef2-v3-eok4

# Keyra setup á heroku
heroku run node setup/setup.js
```

Use Papertrail for logging and Heroku-Redis for caching.


## Setting up redis (noSQL) for caching (not easily available on Windows)

If you want to configure caching on development environment, you'll have to set up and have a redis-server running locally.

```bash
# Install on Linux
sudo apt install redis-server

# Run server with default config
redis-server
```


## Setting up a metasploit on Ubuntu VM

```bash
## Install metasploit-framework
curl https://raw.githubusercontent.com/rapid7/metasploit-omnibus/master/config/templates/metasploit-framework-wrappers/msfupdate.erb > msfinstall && \
  chmod 755 msfinstall && \
  ./msfinstall

# Now you can run it using
msfconsole

# Following this guide : https://jonathansblog.co.uk/meatsploit-for-website-pentest
# Load wmap plugin for exploiting webapps 
load wmap

# Run exploits...

```


## Deleting a file with sensitive data from git history

See [github help](https://help.github.com/en/github/authenticating-to-github/removing-sensitive-data-from-a-repository) for more info.

```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch PATH-TO-YOUR-FILE-WITH-SENSITIVE-DATA" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
```
