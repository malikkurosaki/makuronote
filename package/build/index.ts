#!/bin/bash
LOG_FILE="build_log.txt"
echo > "$LOG_FILE"

# Fungsi untuk memuat .env
load_env() {
    if [ -f ".env" ]; then
        # Aktifkan mode export otomatis
        set -o allexport
        source .env
        set +o allexport

        echo "Variabel dari .env berhasil dimuat."
    else
        echo "File .env tidak ditemukan."
    fi
}

generate_id() {
    local length=${1:-21} # Panjang default: 21 karakter (standar nanoid)

    # Validasi panjang harus bilangan bulat positif
    if ! [[ "$length" =~ ^[0-9]+$ ]] || [ "$length" -le 0 ]; then
        echo "Error: Panjang harus bilangan bulat positif."
        return 1
    fi

    local alphabet="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

    # Menghasilkan string acak menggunakan openssl
    openssl rand -base64 $((length * 2)) | tr -dc "$alphabet" | head -c "$length"
}

# Fungsi pembersihan untuk trap
cleanup() {
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "\n[Finish] ($timestamp) : Proses selesai." | tee -a "$LOG_FILE"
    if [ "$ERROR_OCCURRED" -eq 1 ]; then
        echo "[Finish] Ada error selama eksekusi." | tee -a "$LOG_FILE"
    else
        echo "[Finish] Semua langkah berhasil." | tee -a "$LOG_FILE"
    fi
}

# Inisialisasi variabel
ERROR_OCCURRED=0
STEP_COUNTER=0

# Trap untuk menjalankan cleanup saat skrip selesai
trap cleanup EXIT

# Muat variabel dari .env
load_env

# Fungsi run_command dengan argumen bernama
run_command() {
    local cwd="$PWD"  # Default CWD adalah direktori saat ini
    local continue=false
    local cmd=""

    # Parsing argumen
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --cwd)
                cwd="$2"
                shift 2
                ;;
            --continue)
                continue=true
                shift
                ;;
            --cmd)
                cmd="$2"
                shift 2
                ;;
            *)
                echo "Argumen tidak valid: $1" | tee -a "$LOG_FILE"
                exit 1
                ;;
        esac
    done

    # Pastikan --cmd diberikan
    if [ -z "$cmd" ]; then
        echo "[ERROR] : Parameter --cmd wajib diberikan." | tee -a "$LOG_FILE"
        exit 1
    fi

    # Tambah counter langkah
    ((STEP_COUNTER++))
    local step="$STEP_COUNTER"

    # Ubah direktori jika --cwd diberikan
    if ! cd "$cwd" 2>/dev/null; then
        echo "[Step $step] [ERROR] : Gagal masuk ke direktori $cwd" | tee -a "$LOG_FILE"
        ERROR_OCCURRED=1
        exit 1
    fi

    # Jalankan perintah dan tangkap semua output langsung ke log
    echo "[Step $step] Menjalankan: $cmd (CWD: $cwd)" | tee -a "$LOG_FILE"
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Jalankan perintah dengan output langsung ke log dan terminal
    eval "$cmd" 2>&1 | tee -a "$LOG_FILE"
    status=${PIPESTATUS[0]}  # Status dari perintah, bukan tee

    if [ $status -ne 0 ]; then
        echo -e "[Step $step] [ERROR] ($timestamp) : Perintah gagal dengan status $status" | tee -a "$LOG_FILE"
        ERROR_OCCURRED=1
        if [ "$continue" = "false" ]; then
            echo "[Step $step] Berhenti karena error (--continue=false)" | tee -a "$LOG_FILE"
            exit 1
        fi
    else
        echo -e "[Step $step] [SUCCESS] ($timestamp) : Perintah berhasil" | tee -a "$LOG_FILE"
    fi
}

NAME="hipmi"
NAMESPACE="hipmi-staging"
BRANCH="staging"
REPO="hipmi"
TOKEN=$WIBU_GIT_TOKEN
VERSION=$(generate_id)

BASE_PATH="/var/www/projects"
APP_PROJECT="${BASE_PATH}/${NAME}/${NAMESPACE}"
RELEASES="${APP_PROJECT}/releases"
CURRENT="${APP_PROJECT}/current"
CWD="${RELEASES}/${VERSION}"

run_command --cmd "mkdir -p ${RELEASES}"
run_command --cwd "${RELEASES}" --cmd "git clone --branch ${BRANCH} https://x-access-token:${TOKEN}@github.com/bipproduction/${REPO}.git ${VERSION}"
run_command --cwd "${CWD}" --cmd "bun install"
run_command --cwd "${CWD}" --cmd "bunx prisma db push"
run_command --cwd "${CWD}" --cmd "bunx prisma db seed" --continue
run_command --cwd "${CWD}" --cmd "bun run build"
run_command --cmd "ln -sf ${CWD} ${CURRENT}"
