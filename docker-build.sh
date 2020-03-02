#!/bin/bash

## declare an array variable
declare -a settings=("DISCORD_TOKEN" "DISCORD_INV_LINK")


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
    # echo "{\"token\":\"${DISCORD_TOKEN}\",\"inv_link\":\"${DISCORD_INV_LINK}\"}" > config/config.json
    ## now loop through the above array
    for i in "${settings[@]}"
    do
    echo "$i"
    sed -i "s/$i/${i}/g" "config/config.json"
    # or do whatever with individual element of the array
    done
fi

docker build -f Dockerfile -t axmouth/log_bot_discord .
docker-compose up -d