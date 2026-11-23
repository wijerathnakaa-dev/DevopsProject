pipeline {
    agent {
        label 'rootless-docker'
    }

    options {
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out Chaceylon project'
                checkout scm
            }
        }

        stage('Environment Check') {
            steps {
                sh '''
                    whoami
                    node --version
                    npm --version
                    docker context show
                    docker info | grep -i rootless
                '''
            }
        }

        stage('Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Frontend Lint') {
            steps {
                dir('frontend') {
                    sh 'npm run lint'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Compose Validation') {
            steps {
                sh 'docker compose config -q'
            }
        }

        stage('Docker Image Build') {
            steps {
                sh '''
                    docker build -t chaceylon-backend:ci ./backend
                    docker build -t chaceylon-frontend:ci ./frontend
                '''
            }
        }
    }

    post {
        success {
            echo 'Chaceylon CI Pipeline completed successfully!'
        }

        failure {
            echo 'Chaceylon CI Pipeline failed. Check Console Output.'
        }
    }
}
