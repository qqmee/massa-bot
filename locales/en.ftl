action-menu = 🔝 Menu
action-back = ◀️ Back
action-try-later = Try again later
action-saved = Saved

locale = Language
locale-ru = 🇷🇺 Русский
locale-en = 🇺🇸 English
locale-ru-selected = 🇷🇺 выбран русский язык
locale-en-selected = English! Do you speak it?

root = Menu

ip-invalid = Please enter a valid IP. Example: `/ip 65.10`
ip-not-found = Good news! You are forever alone.
ip-more = and a few more { $more }

stats = Statistics
stats-no-data = No data or episode is over
stats-network = Network status
stats-network-detail =
  {"*"}Throughput*
  => { $throughput_tx } tx/s
  => { $throughput_block } b/s

  { $period } *Period*
  { $cycle } *Cycle*
  { $rolls } *Rolls*
  { $stakers } *Stakers*
  { $cliques } *Cliques*
stats-company = Companies
stats-country = Countries
stats-version = Version

display-node-mode = Display Mode
display-mode-detail =
  Display Mode (current __{ $current }__).
  You can add tag via `/add A12ZAK my-node`

  {"*"}Tag*
  ❗️ my-node
  Rolls (candidate / final): 0 / 0
  {"..."}

  {"*"}Address*
  ❗️ A12ZAKMICMSIi2iMCUTJSSJSJSJSJJSJSJS
  {"..."}
display-mode-address = Address
display-mode-tag = Tag

notifications = Notifications
notifications-rolls = Rolls
notifications-github = Github release

help = Help
help-detail-main = __Menu__
help-detail-node = __Node__
help-detail-stats = __Network stats__
help-detail-extra = __Extra__
help-detail =
  This is community-driven bot by @hcligroup
  You can add bot to channel.

community = Community
community-detail =
  __Hiring__
  https://massa.net/careers

  __Official__
  Explorer: https://massa.net/testnet
  Telegram: @massanetwork
  News channel: @massa\_latest\_news
  Discord: https://discord.gg/massa
  Medium: https://massalabs.medium.com
  Twitter: https://twitter.com/massalabs
  GitHub: https://github.com/massalabs/massa
  LinkedIn: https://www.linkedin.com/company/massa-labs/
  Technical paper: https://arxiv.org/pdf/1803.09029
  Brand assets: https://massa.net/press

  __Bot__
  @MassaHelperBot - node monitoring, country stats
  @paramassa\_bot - wiki

  __Unofficial communities__
  { $unofficial }

address-invalid =
  Please enter a valid address. Example:
  `/add AU1EQeYwEWzixmLY2MLbSdp4QsWTzYTeN3XqH2t9yqrjBeXN3Mug natasha`

address-exists = Address already exists
address-not-deleted = Address not deleted. Check format `/delete AEZAKMI`
address-deleted = Successfully deleted
address-not-found = Addresses not found. Please enter `/add AU1EQeYwEWzixmLY2MLbSdp4QsWTzYTeN3XqH2t9yqrjBeXN3Mug tag`
address-no-data = ❗️ { $address } Cannot get information from RPC
address-info =
  { $status ->
  [fine] {"✅ "}
  *[other] {"❗️ "}
}{ $address }
  Rolls (final / candidate): { $rolls_final} / { $rolls_candidate }
  Balance (final / candidate): { $balance_final} / { $balance_candidate }
  __Stats__
  { $cycles }
address-info-cycle = { NUMBER($nok) ->
  [0] {""}
  *[other] {"❗️ "}
 }{ $cycle } (produced / miss): { $ok } / { $nok }

release = Binaries from GitHub
release-changelog = Changelog
release-detail =
  __{ $name }__ // { $date }
  { $url }

  {"*"}Assets*
  { $assets }

release-detail-changelog =
  {"*"}Changelog*
  { $changelog }

release-detail-asset =
  { $name } \- { $size }
  { $url }

cronjob-stuck =
  __{ $job }__ // { $started }
  Time: { $age } of { $limit }

stats-free = Countries without nodes
stats-free-ads = Friendly /hosting promocode or VPN
stats-free-hosting = Hosting

hosting = 🎁 Hosting promocode
ads-hosting =
  __Hosting__ \(•ᴗ•,, \)

  ₿itcoin accepted here
  { $crypto }

  🇷🇺 [MIR](https://en.wikipedia.org/wiki/Mir_\(payment_system\)) card
  { $mir }

  🕵🏿 __VPN__
  { $vpn }

mirror = Mirror
mirror-detail =
  You can create group with bot or use mirror:

  { $mirror }

command-my = Display staking info for all your nodes
command-start = Main menu
command-help = List all available commands
command-hosting = Hosting promocode
command-add = Add your node, eg: /add abcdef
command-delete = Delete node, eg: /delete abcdef
command-ip = Search by IP, eg: /ip 65.10
command-community = Useful links
command-free = Countries without nodes
command-country = Countries with node population
command-company = Companies with node population
command-version = Version with node population
command-stats = Stakers, cycle, version
command-ru = Русский язык
command-en = English language
command-mirror = Mirror link
command-release = Release from GitHub
command-locale = Change locale
command-mode = Display mode node

exception-unknown = Internal Server Error. Try again
exception-gateway-unavailable = Gateway `{ $gateway }` is down.
exception-rpc-unavailable = RPC is down. Try again later
exception-rpc-timeout = RPC is too busy. Timeout occurred
exception-access-denied = You are not admin 😡
