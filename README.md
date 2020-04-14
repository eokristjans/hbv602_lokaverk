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


## Setting up redis (noSQL) for caching




## Setting up a development environment on Ubuntu VM

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

to

local   all   all       md5

# if you wish to perform database queries on the CLI, you can reconnect using:
psql -U notandi -d v3 # Should be prompted to insert your password, otherwise you're on your own (can be buggy)


# Install nodejs and npm
sudo apt install nodejs
sudo apt install npm
sudo apt upgrade npm

# Now you can navigate to the webapp project folder and install packages
npm install

# Run setup and run the project locally
npm run setup
npm start

## Install metasploit-framework
curl https://raw.githubusercontent.com/rapid7/metasploit-omnibus/master/config/templates/metasploit-framework-wrappers/msfupdate.erb > msfinstall && \
  chmod 755 msfinstall && \
  ./msfinstall

# Now you can run it using
msfconsole

# Following this guide : https://jonathansblog.co.uk/meatsploit-for-website-pentest
# Load wmap plugin for exploiting webapps 
load wmap

# TODO: Continue following guide and perform some exploit with webapp running on localhost


```
