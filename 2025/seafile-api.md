```sh
# curl -X POST https://cld-dkr-makuro-seafile.wibudev.com/api2/auth-token/ \
#   -d "username=wibu@bip.com" \
#   -d "password=Production_123"

# {
#   "relay_id": "44e8f253849ad910dc142247227c8ece8ec0f971",
#   "relay_addr": "127.0.0.1",
#   "relay_port": "80",
#   "email": "wibu@bip.com",
#   "token": "32c2de2d576f40f5a7db2be2e94818439f65ad73",
#   "repo_id": "e27bc199-445a-4d55-939c-939df83efec8",
#   "repo_name": "jenna-mcp",
#   "repo_desc": "",
#   "repo_size": 0,
#   "repo_size_formatted": "0 bytes",
#   "mtime": 1762327478,
#   "mtime_relative": "<time datetime=\"2025-11-05T15:24:38\" is=\"relative-time\" title=\"Wed, 05 Nov 2025 15:24:38 +0800\" >Just now</time>",
#   "encrypted": "",
#   "enc_version": 0,
#   "salt": "",
#   "magic": "",
#   "random_key": "",
#   "repo_version": 1,
#   "head_commit_id": "e107155ad1845933f5e57fc2b07e491765271432",
#   "permission": "rw"
# }




# list repo
# curl -H "Authorization: Token $TOKEN" https://cld-dkr-makuro-seafile.wibudev.com/api2/repos/

URL="https://cld-dkr-makuro-seafile.wibudev.com"
TOKEN="fa49bf1774cad2ec89d2882ae2c6ac1f5d7df445"
REPO_ID="5a540fc1-a7fb-44af-884b-cb9a915b92e8"

list_repo(){
    curl -H "Authorization: Token $TOKEN" "$URL/api2/repos/" | jq
}

create_dir(){
    FOLDER_PATH="/test-folder"
    curl -s -X POST \
    -H "Authorization: Token $TOKEN" \
    -d "operation=mkdir" \
    "$URL/api2/repos/$REPO_ID/dir/?p=$FOLDER_PATH" | jq
}


ping(){
    echo "ping"
    curl -H "Authorization: Token $TOKEN" \
    "$URL/api2/auth/ping/"
}

check_permission(){
    echo "check_permission"
    curl -s -H "Authorization: Token $TOKEN" \
    "$URL/api2/repos/$REPO_ID/" | jq
}

check_dir(){
    echo "check_dir"
    curl -s -H "Authorization: Token $TOKEN" \
    "$URL/api2/repos/$REPO_ID/dir/?p=/" | jq
}

check_test_folder(){
    echo "check_test_folder"
    curl -s -H "Authorization: Token $TOKEN" \
    "$URL/api2/repos/$REPO_ID/dir/?p=/test-folder" | jq
}

upload_file(){
    echo "upload_file"
    # 1. GET upload-link (ini pakai Authorization)
    UPLOAD_URL=$(curl -s \
        -H "Authorization: Token $TOKEN" \
        "$URL/api2/repos/$REPO_ID/upload-link/" | tr -d '"')

    echo "UPLOAD_URL = $UPLOAD_URL"

    # 2. upload file — TIDAK boleh pakai -H Authorization
    #    token HARUS ditaruh di query param
    curl -s -X POST \
        -F file=@README.md \
        -F "parent_dir=/" \
        -F "relative_path=test-folder" \
        "$UPLOAD_URL?token=$TOKEN"
}

ping
check_permission
check_dir
check_test_folder
upload_file


```
