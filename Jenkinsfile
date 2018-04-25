pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Deliver for development') {
            when {
                branch 'test' 
            }
            steps {
               checkout([$class: 'GitSCM', branches: [[name: '*/development']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'Gitlab_Aditya', url: 'https://gitlab.com/espxplayer/esp-playerplugin.git']]])        }
               sh 'npm run build-dev'
               azureUpload storageCredentialId: 'espxmediastaticdev_key1', storageType: 'blobstorage', containerName: 'lib', filesPath: 'player/**/**.js.br', blobProperties: [contentType: 'application/javascript', contentEncoding: 'br']
               azureUpload storageCredentialId: 'espxmediastaticdev_key1', storageType: 'blobstorage', containerName: 'lib', filesPath: 'player/**/**.js.gz', blobProperties: [contentType: 'application/javascript', contentEncoding: 'gzip']
               azureUpload storageCredentialId: 'espxmediastaticdev_key1', storageType: 'blobstorage', containerName: 'lib', filesPath: 'player/**/**.js', blobProperties: [contentType: 'application/javascript', contentEncoding: '']
               cleanWs deleteDirs: true, patterns: [[pattern: '**/node_modules', type: 'EXCLUDE'], [pattern: '**/src', type: 'INCLUDE'], [pattern: '**/base', type: 'INCLUDE']]
            }
        }
    }
}
