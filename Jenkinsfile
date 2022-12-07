node {
  stage('SCM') {
    checkout scm
  }
  stage('SonarQube Analysis') {
    def scannerHome = tool 'lenesu';
    sh 'echo pwd'
    sh 'echo node -v'
    withSonarQubeEnv() {
      sh "${scannerHome}/bin/sonar-scanner"
    }
  }
  stage('New Step') {
    sh 'echo "Hello World"'
  }
}