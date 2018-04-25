pipeline {
  agent any
  stages {
    stage('Initialize') {
      steps {
        echo ' Building ${BRANCH_NAME}'
      }
    }
    stage('Build') {
      steps {
        sh 'node -v'
        sh 'npm -v'
      }
    }
  }
}