node {
  stage('SCM') {
    checkout scm
  }
  stage('SonarQube Analysis') {
    def scannerHome = tool 'lenesu';
    sh 'echo $PATH'
    withSonarQubeEnv() {
      sh "${scannerHome}/bin/sonar-scanner"
    }
  }
  stage('New Step') {
    sh 'echo "Hello World"'
  }
}