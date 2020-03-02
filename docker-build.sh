#!/bin/bash

tpl() {
    local file=$(cat - | \
                 sed -e 's/\"/\\"/g' \
                     -e "s/'/\\'/g")
    local vars=$(echo ${@} | tr ' ' ';')
    echo "$(sh -c "${vars};echo \"$file\"")"
}

if [ -e config ]
then
    echo "ok"
else
    mkdir config
fi

if [ -e config/config.json ]
then
    echo "ok"
else
    cp config.template.json config/config.json
    echo "{\"token\":\"${DISCORD_TOKEN}\",\"inv_link\":\"${DISCORD_INV_LINK}\"}" > config/config.json
fi

docker build -f Dockerfile -t axmouth/log_bot_discord .
docker-compose up -d