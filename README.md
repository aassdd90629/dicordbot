# DC機器人
本機器人是為了 DC 社群管理時間所用，未來會新增串接 google sheet 之功能以及將功能擴充的更完善

# 使用技術
- discord.js
  - DCbot 所需的核心語法
- appscript
  - 串接 google sheet API
- Express
  - 使用 Express 建立 HTTP 伺服器，提供機器人線上部署與 API 存取

# 功能
使用 / 指令
- /hello
  - 會跟你打招呼確保機器人還在運作中
- /settime
  - 填入訊息以及時間，機器人將會依照當前的頻道名字去標記身分組以及時間
  - 標記的身分組是只抓到第一個碰到 "-" 前的身分組
  - 機器人每10分鐘只能改兩次頻道名稱，切勿頻繁重複使用
# 部屬工具
- dashboard
  - 使用 dashboard 將機器人部屬到線上
- cron-job
  - 此工具能固定時間造訪網站，防止機器人閒置過久而無法使用
