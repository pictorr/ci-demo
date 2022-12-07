node {
  stage('SCM') {
    checkout scm
  }
  stage('SonarQube Analysis') {
    def scannerHome = tool 'lenesu';
    sh 'pwd'
    sh 'cat /etc/issue'
    sh 'node -v'
    withSonarQubeEnv() {
      sh "${scannerHome}/bin/sonar-scanner"
    }
  }
  stage('New Step') {
    sh 'echo "Hello World"'
  }
}