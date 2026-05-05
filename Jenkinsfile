pipeline {
    agent any

    environment {
        // Konfigurasi Image & Kredensial 
        DOCKER_IMAGE = "lombokhalalroom/lombok-halal-room-api-jenkins"
        REGISTRY_CRED = "dockerhub-credentials" 
        SSH_CRED = "vps-ssh-key"               
        VPS_HOST = "38.147.122.123"
        VPS_USER = "production"
        TARGET_DIR = "/opt/lhr-api-jenkins"
        
        SHORT_SHA = "${GIT_COMMIT.take(7)}"
    }

    stages {
        stage('Install & Test') {
            steps {
                script {
                    // Verifikasi kode sebelum build
                    sh 'pnpm install --frozen-lockfile'
                    // sh 'pnpm lint'
                    // sh 'pnpm vitest run --coverage'
                }
            }
        }

        stage('Build & Push Docker') {
            when {
                branch 'production'
            }
            steps {
                script {
                    // Login ke Docker Hub menggunakan REGISTRY_CRED
                    withCredentials([usernamePassword(credentialsId: env.REGISTRY_CRED, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                        
                        // Build dengan tag unik (SHA) untuk deployment presisi
                        sh "docker build -t ${env.DOCKER_IMAGE}:latest -t ${env.DOCKER_IMAGE}:${env.SHORT_SHA} ."
                        
                        sh "docker push ${env.DOCKER_IMAGE}:latest"
                        sh "docker push ${env.DOCKER_IMAGE}:${env.SHORT_SHA}"
                    }
                }
            }
        }

        stage('Deploy to VPS') {
            when {
                branch 'production'
            }
            steps {
                sshagent(credentials: [env.SSH_CRED]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${env.VPS_USER}@${env.VPS_HOST} << 'EOF'
                        set -e
                        cd ${env.TARGET_DIR}

                        # Otomatisasi penggantian tag image di docker-compose.yml
                        sed -i "s|image: ${env.DOCKER_IMAGE}:.*|image: ${env.DOCKER_IMAGE}:${env.SHORT_SHA}|g" docker-compose.yml

                        echo "--- Deploying API Version: ${env.SHORT_SHA} ---"
                        docker compose pull
                        docker compose up -d --remove-orphans

                        # Pastikan API berjalan normal di port 3000
                        until curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q 200; do
                            printf "."
                            sleep 2
                        done

                        echo -e "\nDEPLOYMENT API SUCCESS!"
                        docker image prune -f
EOF
                    """
                }
            }
        }
    }

    post {
        always {
            // Bersihkan sisa build agar RAM tidak penuh lagi
            cleanWs()
        }
    }
}
