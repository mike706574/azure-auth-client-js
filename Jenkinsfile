pipeline {
    agent {
        node {
            label 'swarm'
        }
    }
    triggers {
        githubPush()
    }
    stages {
        stage ('Initialize') {
            steps {
                bat 'npm --version'
            }
        }
    }
}
