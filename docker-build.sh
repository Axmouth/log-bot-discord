#!/bin/bash

## declare an array variable
declare -a settings=("DISCORD_TOKEN" "DISCORD_INV_LINK")

get_value_of()
{
    variable_name=$1
    variable_value=""
    if set | grep -q "^$variable_name="; then
        eval variable_value="\$$variable_name"
    fi
    echo "$variable_value"
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
    ## now loop through the above array
    for i in "${settings[@]}"
    do
        echo "$i"
        ii=$(get_value_of "$i")
        iii=$(echo "$ii"| sed 's/\//\\\//g')
        sed -i "s/${i}/${iii}/g" "config/config.json"
    done
fi

docker build -f Dockerfile -t axmouth/log_bot_discord .
docker-compose up -d