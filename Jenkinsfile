pipeline {
    agent {
        docker {
            image 'ubuntu:xenial' 
            args '-p 3000:3000' 
        }
    }
    stages {
        stage('Setup') { 
            steps {
                sh 'apt-get update' 
                sh 'apt-get install \
                    apt-transport-https \
                    ca-certificates \
                    curl \
                    gnupg-agent \
                    software-properties-common'
                sh 'curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -'
                sh 'add-apt-repository \
                    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
                    $(lsb_release -cs) \
                    stable"'
                sh 'apt-get update'
                sh 'apt-get install docker-ce docker-ce-cli containerd.io'
                sh 'curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose'
                sh 'chmod +x /usr/local/bin/docker-compose'
                sh 'ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose'
            }
        }
        stage('Build') { 
            steps {
                sh 'docker-compose up --no-start' 
            }
        }
        stage('Push') { 
            steps {
                sh 'docker-compose push' 
            }
        }
    }
}