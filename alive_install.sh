#!/bin/sh
main() {
    git_url="${1}"
    local_folder="alive"

    echo "Check python3 ..."
    which python3 || exit 1
    echo "OK"

    echo "Cloning repo ..."
    git clone "${git_url}" "${local_folder}" || exit 1
    echo "OK"
    
    python3 -m venv "${local_folder}"

    cd "${local_folder}"
    echo "Install deps ... "
    pip3 install -r requirements.txt  &> /dev/null
    echo "OK"

    echo "Create config ..."
    cat <<EOF > "config.ini"
[Alive]
git = ${git_url}
web = ${2}
EOF
    echo "OK"

    echo "Adding web submodule ... "
    git submodule add "${2}" web
    echo "OK"

    chmod +x "main.py"
    echo "Scheduling cron ..."
    crontab -l > cron_bkp
    echo "*/15 * * * * cd "$(pwd)"; ./main.py >/dev/null 2>&1" >> cron_bkp
    crontab cron_bkp
    rm cron_bkp
    echo "OK"
}

main "${@}"
