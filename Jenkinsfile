pipeline { agent { label 'rootless-docker' }

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
                echo "Checking Jenkins agent..."
                whoami

                echo "Checking Docker..."
                docker --version
                docker context show
                docker info | grep -i rootless

                echo "Checking Docker Compose..."
                docker compose version

                echo "Checking Node.js inside Docker..."
                docker run --rm node:22-alpine node --version
                docker run --rm node:22-alpine npm --version
            '''
        }
    }

    stage('Backend Dependencies') {
        steps {
            sh '''
                docker run --rm \
                -v "$WORKSPACE/backend:/app" \
                -w /app \
                node:22-alpine npm ci
            '''
        }
    }

    stage('Frontend Dependencies') {
        steps {
            sh '''
                docker run --rm \
                -v "$WORKSPACE/frontend:/app" \
                -w /app \
                node:22-alpine npm ci
            '''
        }
    }

    stage('Frontend Lint') {
        steps {
            sh '''
                docker run --rm \
                -v "$WORKSPACE/frontend:/app" \
                -w /app \
                node:22-alpine npm run lint
            '''
        }
    }

    stage('Frontend Build') {
        steps {
            sh '''
                docker run --rm \
                -v "$WORKSPACE/frontend:/app" \
                -w /app \
                node:22-alpine npm run build
            '''
        }
    }

   stage('Docker Compose Validation') {
    steps {
        sh '''
            DB_PASSWORD=ci_test_password \
            MYSQL_ROOT_PASSWORD=ci_test_root_password \
            JWT_SECRET=ci_test_jwt_secret \
            docker compose config -q
        '''
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