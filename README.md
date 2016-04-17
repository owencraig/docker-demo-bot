# Docker demo slackbot

A simple slackbot to showcase some of the benefits of containerisation and container linking with docker. 


## API

The bot will listen to any mentions of its name and the keyword "toIntl" or "toUS".

## Environment Variables
Variable | Default | Description
--- | --- | ---
TRANSLATE_HOST | 192.168.99.100:3000 | The downstream service that will actually do the translations
BOT_TOKEN | undefined | The token to use to integrate with your slack installation

